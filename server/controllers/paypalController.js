// paypalController.js
const axios = require('axios');
const User = require('../models/User');

const PAYPAL_API_URL = process.env.PAYPAL_MODE === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

/**
 * Génère un token d'accès pour l'API PayPal.
 */
const getAccessToken = async () => {
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(`${PAYPAL_API_URL}/v1/oauth2/token`, 'grant_type=client_credentials', {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data.access_token;
};

/**
 * Crée un abonnement PayPal avec des frais d'installation.
 */
const createSubscription = async (req, res, next) => {
    try {
        const accessToken = await getAccessToken();
        const userId = req.user.id;
        
        // IDs des plans à stocker dans les variables d'environnement
        const planId = process.env.PAYPAL_PLAN_ID; 
        if (!planId) {
            throw new Error("PayPal Plan ID is not configured on the server.");
        }

        const response = await axios.post(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
            plan_id: planId,
            // On peut ajouter des frais d'installation si le plan est configuré pour ça
            // PayPal gère ça au niveau de la configuration du Plan directement
            custom_id: userId, // Lier l'abonnement à notre ID utilisateur
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        
        res.json({ subscriptionId: response.data.id, approveUrl: response.data.links.find(link => link.rel === 'approve').href });

    } catch (error) {
        console.error("PayPal Subscription Creation Error:", error.response ? error.response.data : error.message);
        next(new Error("Could not create PayPal subscription."));
    }
};

/**
 * Gère les webhooks entrants de PayPal.
 */
const handleWebhook = async (req, res) => {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    try {
        const accessToken = await getAccessToken();
        const { event_type, resource } = req.body;

        // ÉTAPE 1: Vérifier l'authenticité du webhook
        const verificationResponse = await axios.post(`${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
            auth_algo: req.headers['paypal-auth-algo'],
            cert_url: req.headers['paypal-cert-url'],
            transmission_id: req.headers['paypal-transmission-id'],
            transmission_sig: req.headers['paypal-transmission-sig'],
            transmission_time: req.headers['paypal-transmission-time'],
            webhook_id: webhookId,
            webhook_event: req.body,
        }, {
            headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
        });

        if (verificationResponse.data.verification_status !== 'SUCCESS') {
            console.error('❌ Échec de la vérification du webhook PayPal.');
            return res.status(400).send('Webhook verification failed.');
        }
        
        // ÉTAPE 2: Gérer les événements
        switch (event_type) {
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
                const userId = resource.custom_id;
                const user = await User.findById(userId);
                if (user) {
                    user.paypalSubscriptionId = resource.id;
                    user.subscriptionStatus = 'active';
                    // La date d'expiration sera mise à jour par 'PAYMENT.SALE.COMPLETED'
                    await user.save();
                    console.log(`✅ Abonnement PayPal activé pour l'utilisateur: ${user.email}`);
                }
                break;

            case 'PAYMENT.SALE.COMPLETED':
                if (resource.billing_agreement_id) { // C'est un paiement d'abonnement
                    const subscriptionId = resource.billing_agreement_id;
                    const subscriptionUser = await User.findOne({ paypalSubscriptionId: subscriptionId });
                    
                    if (subscriptionUser) {
                        // On doit récupérer la date de fin de cycle depuis l'API PayPal
                        const subDetails = await axios.get(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
                            headers: { 'Authorization': `Bearer ${accessToken}` }
                        });
                        const cycleEndDate = subDetails.data.billing_info.next_billing_time;

                        subscriptionUser.subscriptionExpiresAt = new Date(cycleEndDate);
                        subscriptionUser.subscriptionStatus = 'active';
                        await subscriptionUser.save();
                        console.log(`✅ Date d'expiration PayPal mise à jour pour: ${subscriptionUser.email}`);
                    }
                }
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
                await User.findOneAndUpdate(
                    { paypalSubscriptionId: resource.id },
                    { subscriptionStatus: 'cancelled' }
                );
                console.log(`🔌 Abonnement PayPal annulé: ${resource.id}`);
                break;
        }

        res.sendStatus(200);

    } catch (error) {
        console.error('Erreur Webhook PayPal:', error.response ? error.response.data : error.message);
        res.sendStatus(500);
    }
};


module.exports = {
    createOrder: createSubscription, // Renommé pour compatibilité
    handleWebhook,
    // On laisse 'captureOrder' vide pour l'instant pour éviter les erreurs, 
    // car le flux d'abonnement ne l'utilise pas.
    captureOrder: async (req, res) => res.json({ status: 'completed' }),
};