import React from 'react';
import PayPalButton from '../components/PayPalButton';

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <h1>Purchase AimGuard</h1>
        <p>Get lifetime access to our hardware and software solution for a one-time payment of €49.99.</p>
        <p>Click below to complete your secure payment with PayPal.</p>
        <PayPalButton />
      </div>
    </div>
  );
};

export default DashboardPage;