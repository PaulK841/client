// This must be the VERY FIRST line for environment variables to be available everywhere
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

// Import routes
const authRoutes = require('./routes/authRoutes.js');
const paypalRoutes = require('./routes/paypalRoutes.js');
const userRoutes = require('./routes/userRoutes.js'); // <-- IMPORT NEW ROUTES

// Start database connection
connectDB();

const app = express();

// Base middlewares
app.use(cors());
app.use(express.json()); // To make the server understand JSON sent by the frontend

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/users', userRoutes); // <-- USE NEW ROUTES

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));