const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

/**
 * Génère un JSON Web Token pour l'authentification.
 * @param {string} id - L'ID de l'utilisateur à inclure dans le token.
 * @returns {string} Le token JWT signé.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Le token expirera dans 30 jours
  });
};

/**
 * @desc    Inscrire un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Vérification : S'assurer que tous les champs sont présents
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide a username, email, and password.' });
    }
    
    // 2. Vérification : S'assurer que le mot de passe est assez long
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // 3. Vérification : Chercher si un utilisateur existe déjà avec cet email OU ce pseudonyme
    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });

    if (userExists) {
      // Si un utilisateur est trouvé, renvoyer une erreur
      return res.status(400).json({ message: 'A user with this email or username already exists.' });
    }

    // 4. Création de l'utilisateur (le mot de passe sera haché automatiquement par le middleware du modèle)
    const user = await User.create({
      username,
      email,
      password,
    });

    // 5. Si la création réussit, renvoyer les informations de l'utilisateur et un token
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // Cette erreur ne devrait normalement pas se produire si les validations précédentes sont passées
      res.status(400).json({ message: 'Invalid user data. Could not create user.' });
    }
  } catch (error) {
    // Gérer les erreurs inattendues du serveur
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * @desc    Authentifier un utilisateur et obtenir un token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérification : S'assurer que les champs sont présents
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password.' });
    }

    // 2. Chercher l'utilisateur dans la base de données par son email
    const user = await User.findOne({ email: email.toLowerCase() });

    // 3. Vérifier si l'utilisateur a été trouvé ET si le mot de passe correspond
    // La méthode 'matchPassword' est définie dans notre modèle User.js et utilise bcrypt.compare
    if (user && (await user.matchPassword(password))) {
      // Si tout est correct, renvoyer les informations de l'utilisateur et un token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // Si l'utilisateur n'existe pas ou si le mot de passe est incorrect,
      // renvoyer une erreur générique pour des raisons de sécurité.
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    // Gérer les erreurs inattendues du serveur
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};