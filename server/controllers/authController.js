const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide a username, email, and password.' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: 'A user with this email or username already exists.' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isSubscribed: user.isSubscribed, // <-- AJOUTÉ
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data. Could not create user.' });
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isSubscribed: user.isSubscribed, // <-- AJOUTÉ
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};