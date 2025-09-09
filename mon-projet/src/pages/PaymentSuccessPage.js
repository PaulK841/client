import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccessPage = () => {
  return (
    <div className="payment-status-page">
      <div className="success-message">
        <h2>Payment Successful!</h2>
        <p>Thank you for your purchase. Your access to AimGuard has been activated.</p>
        <p>You can now download the software and get started.</p>
        <Link to="/dashboard" className="contact-btn" style={{marginTop: '1rem', display: 'inline-block'}}>Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;