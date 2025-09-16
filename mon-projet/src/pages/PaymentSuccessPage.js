import React from 'react';
import { Link } from 'react-router-dom';
import MemberActions from '../components/MemberActions';

const PaymentSuccessPage = () => {
  return (
    <div className="payment-status-page">
      <div className="success-card fade-in-section is-visible">
        <h2>Payment Successful!</h2>
        <p>Welcome to AimGuard! Your subscription is now active. Here are your next steps:</p>
        
        <MemberActions />
        
        <Link to="/profile" className="back-link">Go to my Profile</Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;