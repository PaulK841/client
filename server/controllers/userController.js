// controllers/userController.js
const User = require('../models/User');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        subscriptionStatus: user.subscriptionStatus,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};
