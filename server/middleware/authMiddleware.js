const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Récupère le token de l'en-tête (ex: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Vérifie et décode le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trouve l'utilisateur par l'ID du token et l'attache à l'objet 'req'
      // '-password' pour ne pas renvoyer le hash du mot de passe
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Passe au prochain middleware ou contrôleur
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;