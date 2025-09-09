const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

/**
 * Génère un JSON Web Token pour l'authentification.
 * @param {string} id - L'ID de l'utilisateur à inclure dans le token.
 * @returns {string} Le token JWT signé.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Inscrire un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // --- Validations ---
    if (!username || !email || !password) {
      res.status(400); // Bad Request
      throw new Error('Please provide a username, email, and password.');
    }
    
    if (password.length < 6) {
      res.status(400); // Bad Request
      throw new Error('Password must be at least 6 characters long.');
    }

    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (userExists) {
      res.status(400); // Bad Request
      throw new Error('A user with this email or username already exists.');
    }

    // --- Création de l'utilisateur ---
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      // Si la création réussit, on envoie les données
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        token: generateToken(user._id),
      });
    } else {
      // Si la création échoue pour une raison inconnue
      res.status(400);
      throw new Error('Invalid user data. Could not create user.');
    }
  } catch (error) {
    // On passe toute erreur (de validation ou autre) à notre gestionnaire d'erreurs central
    next(error);
  }
};

/**
 * @desc    Authentifier un utilisateur et obtenir un token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400); // Bad Request
      throw new Error('Please provide an email and password.');
    }

    // Chercher l'utilisateur par son email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Vérifier si l'utilisateur existe ET si le mot de passe correspond
    if (user && (await user.matchPassword(password))) {
      // Si tout est correct, on envoie les données
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        token: generateToken(user._id),
      });
    } else {
      // Si l'utilisateur n'est pas trouvé ou si le mot de passe est incorrect
      res.status(401); // Unauthorized
      throw new Error('Invalid email or password.');
    }
  } catch (error) {
    // On passe toute erreur à notre gestionnaire d'erreurs central
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};