const User = require('../models/User.js');

/**
 * @desc    Get logged in user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    // req.user is attached by our 'protect' middleware
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        paymentHistory: user.paymentHistory,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile };