import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PayPalButton from '../components/PayPalButton';
import StripeButton from '../components/StripeButton';

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
            <div className="payment-options">
              {/* PayPal Option */}
              <div className="payment-option">
                <h4>Pay with PayPal</h4>
                <PayPalButton />
              </div>
              
              {/* Stripe Option */}
              <div className="payment-option">
                <h4>Pay with Card</h4>
                <StripeButton 
                  setupFeePriceId="YOUR_SETUP_FEE_PRICE_ID_HERE" // <-- REMPLACEZ CECI
                  subscriptionPriceId="YOUR_SUBSCRIPTION_PRICE_ID_HERE" // <-- ET CECI
                  productName="AimGuard Starter Pack"
                  amount={49.99}
                  onSuccess={() => console.log('Stripe Payment successful')}
                  onError={(error) => console.error('Stripe Error:', error)}
                />
              </div>
            </div>
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

      <style jsx>{`
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }

        .payment-option {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #f9fafb;
        }

        .payment-option h4 {
          margin: 0 0 15px 0;
          color: #374151;
          font-size: 1.1rem;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .payment-options {
            flex-direction: row;
            gap: 30px;
          }
          
          .payment-option {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;