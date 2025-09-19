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
        shippingAddress: user.shippingAddress,
        phoneNumber: user.phoneNumber
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// Nouveau endpoint pour récupérer toutes les adresses de livraison (admin)
exports.getShippingAddresses = async (req, res, next) => {
  try {
    // Récupérer tous les utilisateurs qui ont une adresse de livraison
    const usersWithShipping = await User.find({
      shippingAddress: { $exists: true, $ne: null }
    }).select('username email shippingAddress phoneNumber subscriptionStatus createdAt');

    // Formater les données pour faciliter la lecture
    const shippingList = usersWithShipping.map(user => ({
      userId: user._id,
      username: user.username,
      email: user.email,
      shippingAddress: user.shippingAddress,
      phoneNumber: user.phoneNumber,
      subscriptionStatus: user.subscriptionStatus,
      orderDate: user.createdAt,
      fullAddress: `${user.shippingAddress?.name || 'N/A'}\n${user.shippingAddress?.line1 || ''}\n${user.shippingAddress?.line2 || ''}\n${user.shippingAddress?.city || ''}, ${user.shippingAddress?.postal_code || ''}\n${user.shippingAddress?.country || ''}`
    }));

    res.json({
      total: shippingList.length,
      addresses: shippingList
    });
  } catch (error) {
    console.error('Erreur récupération adresses:', error);
    next(error);
  }
};
