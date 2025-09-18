const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Créer une session de paiement Stripe
const createPaymentSession = async (req, res) => {
    try {
        const { priceId, userId, productName } = req.body;

        // Créer la session Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
            metadata: {
                userId: userId,
                productName: productName,
            },
            customer_email: req.user?.email, // Si l'utilisateur est connecté
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Erreur Stripe:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
    }
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
    createPaymentSession,
    verifyPayment,
    createProduct,
    getProducts
};
