import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Remplacez 'VOTRE_CLIENT_ID_PAYPAL' par le Client ID de votre Sandbox PayPal
const initialOptions = {
  "client-id": "ATKfMgsTLxFRdok7EPEgzmUUGZPl5cKLf6df4BHkiG58ndpWUe1duPvSzrC9tj274yrcslazDVw-wpn8",
  currency: "EUR",
  intent: "capture",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PayPalScriptProvider options={initialOptions}>
          <App />
        </PayPalScriptProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);