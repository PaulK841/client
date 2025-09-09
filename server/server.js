const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Configuration de dotenv TOUT EN HAUT. C'est la correction clé.
// Il faut le faire avant d'importer les fichiers qui utilisent les variables d'environnement.
dotenv.config();

const connectDB = require('./config/db.js');

// Import des routes
const authRoutes = require('./routes/authRoutes.js');
const paypalRoutes = require('./routes/paypalRoutes.js');


// Connexion à la base de données
connectDB();

const app = express();

// Middleware pour autoriser les requêtes cross-origin (depuis votre frontend React)
app.use(cors());

// Middleware pour permettre au serveur d'accepter du JSON dans le corps des requêtes
app.use(express.json());

// Routes de l'API
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/paypal', paypalRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

