import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage = () => {
  return (
    <div className="payment-status-page">
      <div className="error-message" style={{borderColor: 'var(--secondary-color)', color: 'var(--primary-color)'}}>
        <h2>Payment Cancelled</h2>
        <p>Your payment process was cancelled. You have not been charged.</p>
        <p>You can try again anytime from your dashboard.</p>
        <Link to="/dashboard" className="contact-btn" style={{marginTop: '1rem', display: 'inline-block', backgroundColor: '#6c757d'}}>Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default PaymentCancelPage;