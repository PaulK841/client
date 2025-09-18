const express = require('express');
const router = express.Router();
const { 
    createPaymentSession, 
    verifyPayment, 
    createProduct, 
    getProducts 
} = require('../controllers/stripeController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques
router.get('/products', getProducts);
router.get('/verify-payment/:sessionId', verifyPayment);

// Routes protégées (nécessitent une authentification)
router.post('/create-session', authMiddleware, createPaymentSession);
router.post('/create-product', authMiddleware, createProduct);

module.exports = router;
