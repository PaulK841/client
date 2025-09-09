import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MemberActions from '../components/MemberActions'; // IMPORTANT: Vérifiez que ce chemin est correct

const ProfilePage = () => {
  const { user, refreshUserProfile } = useAuth();

  useEffect(() => {
    // Rafraîchit les informations de l'utilisateur au chargement de la page
    if (user) {
      refreshUserProfile();
    }
  }, []); // Le tableau de dépendances vide assure que cela ne s'exécute qu'une fois au montage

  // Affiche un message de chargement si les données de l'utilisateur ne sont pas encore arrivées
  if (!user) {
    return <div className="dashboard-page"><p>Loading profile...</p></div>;
  }
  
  // Détermine si l'abonnement est actif
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

        {isSubscribed ? (
          // --- SI L'UTILISATEUR EST ABONNÉ : AFFICHER L'ESPACE MEMBRE ---
          <div className="member-area">
            <h2>Member Area</h2>
            <MemberActions />
          </div>
        ) : (
          // --- SINON : AFFICHER LES OPTIONS D'ACHAT OU DE RENOUVELLEMENT ---
          <>
            {user.subscriptionExpiresAt ? (
              // L'utilisateur a eu un abonnement, mais il a expiré
              <div className="profile-actions">
                <h2>Renew Your Subscription</h2>
                <p>Your access has expired. Renew now for <strong>€9.99</strong> to continue using the software.</p>
                <Link to="/pricing" className="auth-button">Renew Now</Link>
              </div>
            ) : (
              // L'utilisateur n'a jamais eu d'abonnement
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