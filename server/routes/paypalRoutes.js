const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController.js');
const protect = require('../middleware/authMiddleware.js');

// La création de l'abonnement est protégée
router.post('/orders', protect, paypalController.createOrder); // 'createOrder' pointe maintenant sur 'createSubscription'

// La capture n'est plus utilisée de la même manière, mais on garde une route pour la compatibilité
router.post('/orders/:orderID/capture', protect, paypalController.captureOrder);

// La route pour le webhook PayPal est maintenant gérée directement dans server.js

module.exports = router;