const axios = require('axios');
const User = require('../models/User.js');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_BASE } = process.env;

const generateAccessToken = async () => { /* ... (code inchangé) ... */ };

const createOrder = async (req, res, next) => {
  try {
    // --- LE TEST ULTIME EST ICI ---
    // On demande au serveur d'afficher exactement ce qu'il reçoit du frontend.
    console.log('--- NOUVELLE TENTATIVE DE CRÉATION DE COMMANDE ---');
    console.log('Contenu reçu du frontend (req.body):', req.body);
    // -----------------------------------------------------------
    
    const { purchaseType } = req.body;

    let price;
    let description;

    if (purchaseType === 'initial') {
      price = '49.99';
      description = 'AimGuard Starter Pack (Hardware + 1st Month Software)';
    } else if (purchaseType === 'renewal') {
      price = '9.99';
      description = 'AimGuard Software Subscription (1 Month Renewal)';
    } else {
      // Si on arrive ici, c'est que purchaseType est manquant ou invalide.
      console.log('ERREUR: purchaseType non valide. Reçu :', purchaseType);
      res.status(400);
      throw new Error('Invalid purchase type specified.');
    }

    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'EUR', value: price }, description }],
    };
    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } });
    res.status(201).json({ id: response.data.id });
  } catch (error) {
    next(error); // On passe l'erreur à notre gestionnaire central
  }
};

const captureOrder = async (req, res, next) => { /* ... (code inchangé, mais on ajoute next(error)) ... */ 
    try {
        // ... votre logique de capture
    } catch(error) {
        next(error);
    }
};

module.exports = { createOrder, captureOrder };