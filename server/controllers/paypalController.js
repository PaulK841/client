// paypalController.js
const axios = require('axios');
const User = require('../models/User.js');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_BASE } = process.env;

/**
 * Génère un token d'accès PayPal
 */
const generateAccessToken = async () => {
  try {
    console.log('🔐 Génération du token PayPal...');
    
    // Vérifier que les variables d'environnement sont présentes
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('Configuration PayPal manquante (CLIENT_ID ou CLIENT_SECRET)');
    }
    
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    console.log('✅ Token PayPal généré avec succès');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Erreur lors de la génération du token PayPal:', error.response?.data || error.message);
    throw new Error('Impossible de générer le token PayPal');
  }
};

/**
 * @desc    Créer une commande PayPal
 * @route   POST /api/paypal/orders
 * @access  Private
 */
const createOrder = async (req, res, next) => {
  try {
    // --- LOGS DE DÉBOGAGE ---
    console.log('\n========================================');
    console.log('📦 NOUVELLE TENTATIVE DE CRÉATION DE COMMANDE');
    console.log('========================================');
    console.log('Headers reçus:', req.headers);
    console.log('Body reçu (raw):', req.body);
    console.log('Body (JSON stringifié):', JSON.stringify(req.body, null, 2));
    console.log('Type de purchaseType:', typeof req.body.purchaseType);
    console.log('========================================\n');
    
    // Vérifier la configuration PayPal
    if (!PAYPAL_API_BASE) {
      console.error('❌ PAYPAL_API_BASE non défini dans les variables d\'environnement');
      res.status(500);
      throw new Error('Configuration PayPal incomplète');
    }
    
    const { purchaseType } = req.body;
    
    // Validation stricte du purchaseType
    if (!purchaseType) {
      console.error('❌ purchaseType manquant dans la requête');
      res.status(400);
      throw new Error('Le type d\'achat (purchaseType) est requis');
    }
    
    let price;
    let description;
    
    // Déterminer le prix et la description selon le type d'achat
    switch(purchaseType.toLowerCase()) {
      case 'initial':
        price = '49.99';
        description = 'AimGuard Starter Pack (Hardware + 1st Month Software)';
        break;
      case 'renewal':
        price = '9.99';
        description = 'AimGuard Software Subscription (1 Month Renewal)';
        break;
      default:
        console.error(`❌ Type d'achat invalide: ${purchaseType}`);
        res.status(400);
        throw new Error(`Type d'achat invalide: ${purchaseType}. Utilisez 'initial' ou 'renewal'.`);
    }
    
    console.log(`💰 Création de commande: ${description} - ${price}€`);
    
    // Générer le token d'accès PayPal
    const accessToken = await generateAccessToken();
    
    // Préparer la requête PayPal
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: price
          },
          description: description
        }
      ],
      application_context: {
        brand_name: 'AimGuard',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`
      }
    };
    
    console.log('📤 Envoi de la requête à PayPal...');
    console.log('URL:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    // Faire la requête à PayPal
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `aimguard-${Date.now()}` // ID unique pour éviter les doublons
      }
    });
    
    console.log('✅ Commande PayPal créée avec succès');
    console.log('Order ID:', response.data.id);
    
    // Retourner l'ID de la commande au frontend
    res.status(201).json({
      id: response.data.id,
      status: response.data.status,
      links: response.data.links
    });
    
  } catch (error) {
    // Gestion détaillée des erreurs
    console.error('\n❌ ERREUR DANS createOrder:');
    console.error('Message:', error.message);
    
    if (error.response) {
      // Erreur de la réponse PayPal
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
      console.error('Headers:', error.response.headers);
      
      // Créer un message d'erreur plus informatif
      const paypalError = error.response.data?.details?.[0]?.description || 
                          error.response.data?.message || 
                          'Erreur PayPal inconnue';
      
      if (!res.statusCode || res.statusCode === 200) {
        res.status(error.response.status || 500);
      }
      
      error.message = `Erreur PayPal: ${paypalError}`;
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error('Pas de réponse de PayPal');
      if (!res.statusCode || res.statusCode === 200) {
        res.status(503);
      }
      error.message = 'Service PayPal temporairement indisponible';
    }
    
    // Passer l'erreur au middleware de gestion d'erreurs
    next(error);
  }
};

/**
 * @desc    Capturer le paiement d'une commande PayPal
 * @route   POST /api/paypal/orders/:orderID/capture
 * @access  Private
 */
const captureOrder = async (req, res, next) => {
  try {
    console.log('\n========================================');
    console.log('💳 CAPTURE DE PAIEMENT');
    console.log('========================================');
    
    const { orderID } = req.params;
    const { purchaseType } = req.body;
    
    if (!orderID) {
      res.status(400);
      throw new Error('Order ID manquant');
    }
    
    console.log('Order ID:', orderID);
    console.log('Purchase Type:', purchaseType);
    console.log('User ID:', req.user?._id);
    
    // Générer le token d'accès
    const accessToken = await generateAccessToken();
    
    // Capturer le paiement
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;
    
    console.log('📤 Envoi de la requête de capture à PayPal...');
    
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );
    
    console.log('✅ Paiement capturé avec succès');
    console.log('Capture Status:', response.data.status);
    
    // Si le paiement est complété, mettre à jour l'utilisateur
    if (response.data.status === 'COMPLETED' && req.user) {
      console.log('📝 Mise à jour de l\'abonnement utilisateur...');
      
      const user = await User.findById(req.user._id);
      
      if (user) {
        const now = new Date();
        let newExpirationDate;
        
        if (!user.subscriptionExpiresAt || user.subscriptionExpiresAt < now) {
          // Nouvelle souscription ou souscription expirée
          newExpirationDate = new Date(now.setMonth(now.getMonth() + 1));
        } else {
          // Extension de la souscription existante
          newExpirationDate = new Date(user.subscriptionExpiresAt);
          newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
        }
        
        user.subscriptionExpiresAt = newExpirationDate;
        user.subscriptionStatus = 'active';
        
        // Ajouter l'historique de paiement
        if (!user.paymentHistory) {
          user.paymentHistory = [];
        }
        
        user.paymentHistory.push({
          orderId: orderID,
          amount: purchaseType === 'initial' ? 49.99 : 9.99,
          currency: 'EUR',
          type: purchaseType,
          date: new Date(),
          status: 'completed'
        });
        
        await user.save();
        
        console.log('✅ Abonnement mis à jour jusqu\'au:', newExpirationDate);
      }
    }
    
    // Retourner les détails de la capture
    res.status(200).json({
      status: response.data.status,
      id: response.data.id,
      purchase_units: response.data.purchase_units,
      payer: response.data.payer
    });
    
  } catch (error) {
    console.error('\n❌ ERREUR DANS captureOrder:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('PayPal Response Error:', error.response.data);
      
      const paypalError = error.response.data?.details?.[0]?.description || 
                          error.response.data?.message || 
                          'Erreur de capture PayPal';
      
      if (!res.statusCode || res.statusCode === 200) {
        res.status(error.response.status || 500);
      }
      
      error.message = `Erreur PayPal: ${paypalError}`;
    }
    
    next(error);
  }
};

module.exports = {
  createOrder,
  captureOrder
};