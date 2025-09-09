import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  // Affiche un message de chargement si les informations ne sont pas prêtes
  if (!user) {
    return (
      <div className="dashboard-page">
        <p>Loading profile...</p>
      </div>
    );
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
            <span className="subscription-status inactive">Inactive</span>
          </div>
        </div>
        <div className="profile-actions">
          <h2>Get AimGuard</h2>
          <p>If you haven't purchased yet, get lifetime access now!</p>
          <Link to="/dashboard" className="auth-button">Purchase Now</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;