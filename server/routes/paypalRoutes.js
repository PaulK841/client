const express = require('express');
const router = express.Router();
const { createOrder, captureOrder } = require('../controllers/paypalController.js');
const protect = require('../middleware/authMiddleware.js');

// Ces routes sont protégées : seul un utilisateur connecté peut créer une commande.
router.post('/orders', protect, createOrder);
router.post('/orders/:orderID/capture', protect, captureOrder);

module.exports = router;