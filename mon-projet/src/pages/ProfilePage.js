import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PayPalButton from '../components/PayPalButton';

const ProfilePage = () => {
  const { user, refreshUserProfile } = useAuth();

  // Each time the page is displayed, refresh the data
  useEffect(() => {
    if (user) { // Only refresh if user is logged in
      refreshUserProfile();
    }
  }, []); // The empty array means this only runs once on mount

  if (!user) {
    return <div className="dashboard-page"><p>Loading profile...</p></div>;
  }
  
  const isSubscribed = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();
  const expirationDate = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : 'N/A';

  return (
    <div className="dashboard-page">
      <div className="profile-content">
        <h1>Your Profile</h1>
        <div className="profile-details">
          <div className="profile-detail-item"><strong>Username:</strong><span>{user.username}</span></div>
          <div className="profile-detail-item"><strong>Email:</strong><span>{user.email}</span></div>
          <div className="profile-detail-item">
            <strong>Subscription:</strong>
            {isSubscribed ? (
              <span className="subscription-status active">Active until {expirationDate}</span>
            ) : (
              <span className="subscription-status inactive">Inactive / Expired</span>
            )}
          </div>
        </div>

        {!isSubscribed && user.subscriptionExpiresAt && (
          <div className="profile-actions">
            <h2>Renew Your Subscription</h2>
            <p>Your access has expired. Renew now for <strong>€9.99</strong> to continue using the software.</p>
            <PayPalButton purchaseType="renewal" />
          </div>
        )}
        
        {!user.subscriptionExpiresAt && (
            <div className="profile-actions">
              <h2>Get AimGuard</h2>
              <p>You currently don't have an active subscription. Get the starter pack now!</p>
              <Link to="/pricing" className="auth-button">View Pricing</Link>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;