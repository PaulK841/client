const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User'); // Assurez-vous d'importer le modèle User

/**
 * Crée une session de paiement Stripe pour un ABONNEMENT avec frais d'installation.
 */
const createSubscriptionSession = async (req, res) => {
    // --- DEBUG: VÉRIFIER QUE LA REQUÊTE ARRIVE ---
    console.log('\n🚀 === REQUÊTE STRIPE REÇUE ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User ID:', req.user?.id);
    console.log('Body:', req.body);
    console.log('Origin:', req.headers.origin);
    console.log('==================================');
    
    // --- CODE DE DÉBOGAGE AJOUTÉ ---
    console.log('\n========================================');
    console.log('🏁 Tentative de création de session Stripe...');
    console.log('========================================');
    
    // 1. Vérifier si la clé secrète Stripe est chargée
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        console.error('❌ ERREUR FATALE : La variable STRIPE_SECRET_KEY est manquante ou vide !');
    } else {
        console.log('✅ Clé secrète Stripe chargée.');
        // Affiche une version "masquée" de la clé pour vérification (ex: sk_test_...1234)
        console.log(`   Clé utilisée: ${stripeKey.substring(0, 11)}...${stripeKey.slice(-4)}`);
        if (stripeKey.startsWith('whsec_')) {
            console.error('🚨 ALERTE : Vous utilisez la clé de webhook (whsec_) au lieu de la clé secrète (sk_) !');
        }
    }

    // 2. Vérifier les IDs de prix reçus du frontend
    const { subscriptionPriceId, setupFeePriceId } = req.body;
    console.log('📥 IDs de prix reçus du frontend:');
    console.log('   - ID Abonnement:', subscriptionPriceId);
    console.log('   - ID Frais matériel:', setupFeePriceId);

    // 3. Vérifier l'URL client pour la redirection
    const clientUrl = process.env.CLIENT_URL;
    if (!clientUrl) {
        console.error('❌ ERREUR FATALE : La variable CLIENT_URL est manquante !');
    } else if (!clientUrl.startsWith('http')) {
        console.error(`🚨 ALERTE : La variable CLIENT_URL ("${clientUrl}") ne commence pas par http:// ou https://`);
    } else {
        console.log('✅ URL de redirection client chargée:', clientUrl);
    }

    console.log('========================================\n');
    // --- FIN DU CODE DE DÉBOGAGE ---

    try {
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
        console.error('❌ Erreur Stripe (Création Abonnement):', error.message);
        res.status(500).json({ error: 'Error creating the payment session.' });
    }
};

/**
 * Gère les webhooks entrants de Stripe pour mettre à jour la base de données.
 */
const handleWebhook = async (req, res) => {
    // --- CODE DE DÉBOGAGE AJOUTÉ ---
    console.log('\n========================================');
    console.log('🔔 Webhook Stripe reçu !');
    console.log('========================================');
    
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('❌ ERREUR FATALE : La variable STRIPE_WEBHOOK_SECRET est manquante !');
        return res.status(400).send('Webhook secret not configured.');
    } else {
        console.log('✅ Secret de webhook chargé.');
    }
    
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.log(`✅ Signature du webhook vérifiée. Événement: ${event.type}`);
    } catch (err) {
        console.error(`❌ ERREUR Signature Webhook Stripe: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    console.log('🪝 Traitement de l\'événement:', event.type);
    // --- FIN DU CODE DE DÉBOGAGE ---

    // Gérer les événements spécifiques
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('-> checkout.session.completed pour le client:', session.customer);

            // Étape 1: Activer l'abonnement sans date de fin.
            const user = await User.findOneAndUpdate(
                { stripeCustomerId: session.customer },
                {
                    stripeSubscriptionId: session.subscription,
                    subscriptionStatus: 'active'
                },
                { new: true }
            );

            if (user) {
                console.log(`✅ Abonnement activé (sans date) pour: ${user.email}. En attente de la facture.`);
            } else {
                console.error(`❌ checkout.session.completed: Aucun utilisateur trouvé avec le customerId: ${session.customer}`);
            }
            break;

        case 'invoice.payment_succeeded':
            const invoice = event.data.object;
            console.log('-> invoice.payment_succeeded pour le client:', invoice.customer);
            console.log('   Détails facture - subscription:', invoice.subscription, 'customer:', invoice.customer);
            
            // Pour les abonnements Stripe, on trouve l'utilisateur par customer ID
            const userToUpdate = await User.findOne({ stripeCustomerId: invoice.customer });
            
            if (!userToUpdate) {
                console.error(`❌ invoice.payment_succeeded: Aucun utilisateur trouvé avec le customerId: ${invoice.customer}`);
                break;
            }

            // Calculer la date d'expiration (30 jours à partir de maintenant)
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);

            userToUpdate.subscriptionExpiresAt = expirationDate;
            await userToUpdate.save();

            console.log(`✅ Date d'expiration mise à jour pour: ${userToUpdate.email} -> ${expirationDate.toLocaleDateString()}`);
            break;

        case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            await User.findOneAndUpdate(
                { stripeSubscriptionId: deletedSubscription.id },
                { subscriptionStatus: 'cancelled' }
            );
            console.log(`🔌 Abonnement annulé: ${deletedSubscription.id}`);
            break;

        default:
            console.log(`-> Événement webhook non géré: ${event.type}`);
    }

    res.json({ received: true });
};


// Vérifier le statut du paiement ET METTRE À JOUR L'UTILISATEUR
const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Logique de fallback : Mettre à jour l'utilisateur ici aussi
            const user = await User.findOne({ stripeCustomerId: session.customer });
            if (user && user.subscriptionStatus !== 'active') {
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                user.stripeSubscriptionId = session.subscription;
                user.subscriptionStatus = 'active';
                user.subscriptionExpiresAt = new Date(subscription.current_period_end * 1000);
                await user.save();
                console.log(`✅ (Fallback) Abonnement activé via la page de succès pour: ${user.email}`);
            }

            res.json({ 
                success: true, 
                paymentStatus: 'paid',
                customerEmail: session.customer_details.email,
                amount: session.amount_total,
                currency: session.currency
            });
        } else {
            res.json({ success: false, paymentStatus: session.payment_status });
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
