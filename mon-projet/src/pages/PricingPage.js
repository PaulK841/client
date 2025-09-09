import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PayPalButton from '../components/PayPalButton';

const PricingPage = () => {
  const { token } = useAuth();

  return (
    <div className="pricing-page">
      <div className="pricing-card fade-in-section is-visible">
        <div className="pricing-header">
          <h2>AimGuard - Lifetime Access</h2>
          <p>One-time payment for our complete hardware and software solution.</p>
        </div>

        <div className="price-display">
          <span className="currency-symbol">€</span>
          <span className="price-amount">49</span>
          <span className="price-decimal">.99</span>
        </div>

        <ul className="features-list">
          <li>✓ Hand-Crafted Hardware Device</li>
          <li>✓ Intuitive Companion Software</li>
          <li>✓ Undetected & Secure</li>
          <li>✓ Lifetime Updates</li>
          <li>✓ 24/7 Support</li>
        </ul>

        {token ? (
          // Si l'utilisateur est connecté, afficher le paiement
          <div className="payment-section">
            <h3>Complete Your Secure Purchase</h3>
            <PayPalButton />
          </div>
        ) : (
          // Sinon, afficher l'invitation à se connecter
          <div className="login-prompt">
            <h3>You're almost there!</h3>
            <p>Please log in or create an account to complete your purchase.</p>
            <div className="prompt-buttons">
              <Link to="/login" className="auth-button">Login</Link>
              <Link to="/register" className="secondary-button">Register</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingPage;