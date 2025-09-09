require('dotenv').config(); // S'assurer que c'est bien la première ligne

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const { errorHandler } = require('./middleware/errorMiddleware.js'); // <-- IMPORTER

// ... (le reste des imports)
const authRoutes = require('./routes/authRoutes.js');
const paypalRoutes = require('./routes/paypalRoutes.js');

connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { res.send('API is running...'); });

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/paypal', paypalRoutes);

// --- GESTIONNAIRE D'ERREURS ---
// Doit être placé APRÈS toutes vos routes d'API
app.use(errorHandler);
// -----------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));