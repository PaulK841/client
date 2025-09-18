const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User'); // Assurez-vous d'importer le modèle User

/**
 * Crée une session de paiement Stripe pour un ABONNEMENT avec frais d'installation.
 */
const createSubscriptionSession = async (req, res) => {
    try {
        const { subscriptionPriceId, setupFeePriceId } = req.body;
        const userId = req.user.id; // Depuis le middleware d'authentification

        if (!subscriptionPriceId || !setupFeePriceId) {
            return res.status(400).json({ error: "Subscription and setup fee price IDs are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        let customerId = user.stripeCustomerId;

        // Si l'utilisateur n'a pas encore de stripeCustomerId, on en crée un
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.username,
                metadata: {
                    mongoId: userId,
                },
            });
            customerId = customer.id;
            user.stripeCustomerId = customerId;
            await user.save();
        }

        // Créer la session Stripe en mode abonnement
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                // L'abonnement mensuel
                {
                    price: subscriptionPriceId,
                    quantity: 1,
                },
                // Les frais d'installation uniques
                {
                    price: setupFeePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            metadata: {
                userId: userId,
            },
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Subscription Creation Error:', error.message);
        res.status(500).json({ error: 'Error creating the payment session.' });
    }
};

/**
 * Gère les webhooks entrants de Stripe pour mettre à jour la base de données.
 */
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`❌ Erreur Webhook Stripe: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gérer les événements spécifiques
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const user = await User.findOne({ stripeCustomerId: session.customer });
            
            if (user) {
                user.stripeSubscriptionId = session.subscription;
                user.subscriptionStatus = 'active';
                // La date d'expiration sera gérée par l'événement 'invoice.payment_succeeded'
                await user.save();
                console.log(`✅ Abonnement activé pour l'utilisateur: ${user.email}`);
            }
            break;

        case 'invoice.payment_succeeded':
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;
            
            // La période de l'abonnement est en secondes, on la convertit en millisecondes
            const periodEnd = new Date(invoice.lines.data[0].period.end * 1000);
            
            await User.findOneAndUpdate(
                { stripeSubscriptionId: subscriptionId },
                { 
                    subscriptionStatus: 'active',
                    subscriptionExpiresAt: periodEnd 
                }
            );
            console.log(`✅ Date d'expiration mise à jour pour l'abonnement: ${subscriptionId}`);
            break;

        case 'customer.subscription.deleted':
            const subscription = event.data.object;
            await User.findOneAndUpdate(
                { stripeSubscriptionId: subscription.id },
                { 
                    subscriptionStatus: 'cancelled',
                    // On peut garder la date d'expiration pour savoir jusqu'à quand ils avaient accès
                }
            );
            console.log(`🔌 Abonnement annulé: ${subscription.id}`);
            break;

        default:
            console.log(`Événement webhook non géré: ${event.type}`);
    }

    res.json({ received: true });
};


// Vérifier le statut du paiement
const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Le paiement est réussi, mettre à jour l'utilisateur
            res.json({ 
                success: true, 
                paymentStatus: 'paid',
                customerEmail: session.customer_email,
                amount: session.amount_total,
                currency: session.currency
            });
        } else {
            res.json({ 
                success: false, 
                paymentStatus: session.payment_status 
            });
        }
    } catch (error) {
        console.error('Erreur vérification paiement:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification du paiement' });
    }
};

// Créer un produit et un prix (pour l'admin)
const createProduct = async (req, res) => {
    try {
        const { name, description, price, currency = 'eur' } = req.body;

        // Créer le produit
        const product = await stripe.products.create({
            name: name,
            description: description,
        });

        // Créer le prix
        const priceObj = await stripe.prices.create({
            product: product.id,
            unit_amount: price * 100, // Stripe utilise les centimes
            currency: currency,
        });

        res.json({ 
            productId: product.id, 
            priceId: priceObj.id,
            product: product,
            price: priceObj
        });
    } catch (error) {
        console.error('Erreur création produit:', error);
        res.status(500).json({ error: 'Erreur lors de la création du produit' });
    }
};

// Récupérer les produits Stripe
const getProducts = async (req, res) => {
    try {
        const products = await stripe.products.list({
            active: true,
            expand: ['data.default_price']
        });

        res.json({ products: products.data });
    } catch (error) {
        console.error('Erreur récupération produits:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
};

module.exports = {
    createPaymentSession: createSubscriptionSession, // On renomme pour garder la compatibilité
    verifyPayment,
    createProduct,
    getProducts,
    handleWebhook
};
