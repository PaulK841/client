const axios = require('axios');
const User = require('../models/User.js');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_BASE } = process.env;

// Fonction complète pour générer le token d'accès
const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await axios.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, 'grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` },
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw new Error('Failed to generate Access Token');
  }
};

const createOrder = async (req, res) => {
  try {
    const { purchaseType } = req.body;

    let price;
    let description;

    if (purchaseType === 'initial') {
      price = '49.99';
      description = 'AimGuard Starter Pack (Hardware + 1st Month Software)';
    } else if (purchaseType === 'renewal') {
      price = '9.99';
      description = 'AimGuard Software Subscription (1 Month Renewal)';
    } else {
      return res.status(400).json({ message: 'Invalid purchase type specified.' });
    }

    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders`;
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'EUR', value: price },
        description: description,
      }],
    };
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    });
    res.status(201).json({ id: response.data.id });
  } catch (error) {
    console.error('Failed to create order:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

const captureOrder = async (req, res) => {
  const { orderID } = req.params;
  try {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;
    
    const response = await axios.post(url, {}, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` } });

    if (response.data.status === 'COMPLETED') {
      const user = await User.findById(req.user._id);
      const now = new Date();
      
      const startDate = (user.subscriptionExpiresAt && user.subscriptionExpiresAt > now) 
        ? user.subscriptionExpiresAt 
        : now;
      
      const newExpirationDate = new Date(startDate);
      newExpirationDate.setDate(newExpirationDate.getDate() + 30);
      
      const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        subscriptionExpiresAt: newExpirationDate,
      }, { new: true });

      res.status(200).json({ 
          ...response.data, 
          subscriptionExpiresAt: updatedUser.subscriptionExpiresAt 
      });
    } else {
      res.status(200).json(response.data);
    }
  } catch (error) {
    console.error('Failed to capture order:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to capture order' });
  }
};

module.exports = { createOrder, captureOrder };