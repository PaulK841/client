const axios = require('axios');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_BASE } = process.env;

// --- DÉBUT DE LA SECTION DE DÉBOGAGE ---
// Ce bloc va s'exécuter chaque fois qu'une route de ce fichier est appelée.
console.log('\n--- DÉBOGAGE PAYPAL ---');
console.log('Client ID lu depuis .env:', PAYPAL_CLIENT_ID);
// Pour la sécurité, on ne montre jamais le secret, on vérifie juste s'il existe.
console.log('Client Secret lu depuis .env:', PAYPAL_CLIENT_SECRET ? 'Chargé' : 'NON CHARGÉ ou vide');
console.log('-------------------------\n');
// --- FIN DE LA SECTION DE DÉBOGAGE ---


/**
 * Génère un token d'accès pour l'API PayPal.
 * @returns {Promise<string>} Le token d'accès.
 */
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      // Cette erreur se déclenche si les variables ci-dessus sont 'undefined'.
      throw new Error('MISSING_API_CREDENTIALS');
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw new Error('Failed to generate Access Token');
  }
};

/**
 * Crée une commande PayPal.
 * @route   POST /api/paypal/orders
 * @access  Private
 */
const createOrder = async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: '49.99',
          },
          description: 'AimGuard Hardware Device',
        },
      ],
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.status(201).json({ id: response.data.id });
  } catch (error) {
    console.error('Failed to create order:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

/**
 * Capture le paiement pour une commande.
 * @route   POST /api/paypal/orders/:orderID/capture
 * @access  Private
 */
const captureOrder = async (req, res) => {
  const { orderID } = req.params;
  try {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;
    
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Failed to capture order:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to capture order' });
  }
};

module.exports = { createOrder, captureOrder };

