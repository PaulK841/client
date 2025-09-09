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
          <h2>AimGuard Starter Pack</h2>
          <p>Your one-time purchase to get everything you need to dominate.</p>
        </div>

        <div className="price-display">
          <span className="currency-symbol">€</span>
          <span className="price-amount">49</span>
          <span className="price-decimal">.99</span>
        </div>

        <ul className="features-list">
          <li>✓ Hand-Crafted Hardware Device</li>
          <li>✓ First Month of Software Access</li>
          <li>✓ Undetected & Secure</li>
          <li>✓ Lifetime Hardware Warranty</li>
        </ul>

        <p className="renewal-info">After the first month, the software subscription renews at just €9.99/month.</p>

        {token ? (
          <div className="payment-section">
            <h3>Complete Your Purchase</h3>
            {/* On spécifie que c'est un achat initial */}
            <PayPalButton purchaseType="initial" />
          </div>
        ) : (
          <div className="login-prompt">
            <h3>Get Started</h3>
            <p>Log in or create an account to purchase the AimGuard Starter Pack.</p>
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