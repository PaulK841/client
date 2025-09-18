// Configuration des variables d'environnement (Render gère automatiquement les variables)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

// Importer les routes
const authRoutes = require('./routes/authRoutes.js');
const paypalRoutes = require('./routes/paypalRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const stripeRoutes = require('./routes/stripeRoutes.js');

// Démarrer la connexion à la base de données
connectDB();

const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());

// --- ROUTE DE HEALTH CHECK AJOUTÉE ---
// Pour répondre positivement aux services de surveillance comme Render
app.get('/', (req, res) => {
    res.send('API is healthy and running!');
});
// ------------------------------------

// Routes de l'API (tout ce qui commence par /api)
app.use('/api/auth', authRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stripe', stripeRoutes);

// Middlewares de gestion d'erreurs (doivent être à la fin)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));