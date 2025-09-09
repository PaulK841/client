const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Applying the 'protect' middleware ensures that only a logged-in user
// can access their own profile.
router.route('/profile').get(protect, getUserProfile);

module.exports = router;