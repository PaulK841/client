const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const protect = require('../middleware/authMiddleware.js');
const adminOnly = require('../middleware/adminMiddleware.js');

// Applying the 'protect' middleware ensures that only a logged-in user
// can access their own profile.
router.route('/profile').get(protect, userController.getUserProfile);

// Endpoint pour récupérer toutes les adresses de livraison (admin)
router.route('/shipping-addresses').get(protect, userController.getShippingAddresses);

module.exports = router;