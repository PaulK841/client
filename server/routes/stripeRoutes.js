const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');
const protect = require('../middleware/authMiddleware');

// Routes publiques
router.get('/products', stripeController.getProducts);
router.get('/verify-payment/:sessionId', stripeController.verifyPayment);

// La route du webhook est maintenant gérée directement dans server.js

// Routes protégées (nécessitent une authentification de l'utilisateur)
router.post('/create-session', protect, stripeController.createPaymentSession);
router.post('/create-product', protect, stripeController.createProduct);

module.exports = router;
