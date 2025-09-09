import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="dashboard-page"><p>Loading profile...</p></div>;
  }

  return (
    <div className="dashboard-page">
      <div className="profile-content">
        <h1>Your Profile</h1>
        <div className="profile-details">
          <div className="profile-detail-item">
            <strong>Username:</strong>
            <span>{user.username}</span>
          </div>
          <div className="profile-detail-item">
            <strong>Email:</strong>
            <span>{user.email}</span>
          </div>
          <div className="profile-detail-item">
            <strong>Subscription:</strong>
            {user.isSubscribed ? (
              <span className="subscription-status active">Active</span>
            ) : (
              <span className="subscription-status inactive">Inactive</span>
            )}
          </div>
        </div>

        {!user.isSubscribed && (
          <div className="profile-actions">
            <h2>Get AimGuard</h2>
            <p>You currently don't have an active subscription. Get lifetime access now!</p>
            <Link to="/pricing" className="auth-button">View Pricing</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;