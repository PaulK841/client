// Configuration des variables d'environnement (Render gère automatiquement les variables)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');
const bodyParser = require('body-parser'); // Importer body-parser

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

// Utiliser bodyParser.raw pour les webhooks
app.post('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }), require('./controllers/stripeController').handleWebhook);
app.post('/api/paypal/webhook', bodyParser.raw({ type: 'application/json' }), require('./controllers/paypalController').handleWebhook);

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // === DEBUG VARIABLES D'ENVIRONNEMENT ===
  console.log('\n🔍 === VÉRIFICATION VARIABLES D\'ENVIRONNEMENT ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('PORT:', process.env.PORT);
  console.log('CLIENT_URL:', process.env.CLIENT_URL);
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Définie' : '❌ Manquante');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Définie' : '❌ Manquante');
  console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? `✅ ${process.env.STRIPE_SECRET_KEY.substring(0, 11)}...` : '❌ Manquante');
  console.log('STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ Définie' : '❌ Manquante');
  console.log('=================================================\n');
});