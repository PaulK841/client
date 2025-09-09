import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MemberActions from '../components/MemberActions'; // VÉRIFIEZ CE CHEMIN

const ProfilePage = () => {
  const { user, refreshUserProfile } = useAuth();

  useEffect(() => {
    if (user) {
      refreshUserProfile();
    }
  }, []);

  if (!user) {
    return <div className="dashboard-page"><p>Loading profile...</p></div>;
  }
  
  const isSubscribed = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > new Date();
  const expirationDate = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : 'N/A';

  return (
    <div className="dashboard-page">
      <div className="profile-content">
        <h1>Your Profile</h1>
        
        {/* ---- LE TÉMOIN EST ICI ---- */}
        <p style={{ color: 'red', fontSize: '24px', fontWeight: 'bold' }}>
          TÉMOIN DE DÉPLOIEMENT
        </p>
        
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

        {isSubscribed ? (
          <div className="member-area">
            <h2>Member Area</h2>
            <MemberActions />
          </div>
        ) : (
          <>
            {user.subscriptionExpiresAt ? (
              <div className="profile-actions">
                <h2>Renew Your Subscription</h2>
                <p>Your access has expired. Renew now for <strong>€9.99</strong> to continue using the software.</p>
                <Link to="/pricing" className="auth-button">Renew Now</Link>
              </div>
            ) : (
              <div className="profile-actions">
                <h2>Get AimGuard</h2>
                <p>You currently don't have an active subscription. Get the starter pack now!</p>
                <Link to="/pricing" className="auth-button">View Pricing</Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;