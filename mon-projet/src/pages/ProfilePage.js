// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Idéalement, déplace ces icônes dans src/components/icons/ pour éviter les doublons
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const DiscordIcon = () => (
  <svg role="img" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-label="Discord">
    <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515c-.24.43-.46.87-.666 1.282a31.93 31.93 0 0 0-6.532 0c-.206-.412-.426-.852-.666-1.282A19.79 19.79 0 0 0 3.683 4.37C1.67 7.667.89 11.103 1.15 14.505c2.026 1.5 3.985 2.41 5.885 2.838.475-.652.902-1.349 1.27-2.083-.692-.262-1.353-.586-1.964-.966.164-.12.325-.247.483-.38 3.78 1.76 7.876 1.76 11.657 0 .158.133.319.26.483.38-.611.379-1.272.704-1.964.966.368.734.795 1.431 1.27 2.083 1.9-.429 3.86-1.338 5.885-2.838.35-4.49-1.02-7.88-2.88-10.135zM9.23 12.79c-.76 0-1.377-.71-1.377-1.585 0-.874.617-1.584 1.377-1.584.767 0 1.384.71 1.384 1.584 0 .875-.617 1.585-1.384 1.585zm5.538 0c-.76 0-1.378-.71-1.378-1.585 0-.874.618-1.584 1.378-1.584.767 0 1.384.71 1.384 1.584 0 .875-.617 1.585-1.384 1.585z"/>
  </svg>
);

const ProfilePage = () => {
  const { user, refreshUserProfile, token } = useAuth();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        await refreshUserProfile();
      } finally {
        if (mounted) setLoading(false);
      }
    };
    // On ne recharge que si on n'a pas d'user (ou si on veut forcer un refresh)
    if (!user) run();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const isSubscribed = useMemo(() => {
    if (!user || !user.subscriptionExpiresAt) return false;
    const exp = new Date(user.subscriptionExpiresAt);
    const isNotExpired = !Number.isNaN(exp.getTime()) && exp.getTime() > Date.now();
    const isConfirmed = user.subscriptionStatus === 'confirmed';
    return isNotExpired && isConfirmed;
  }, [user]);

  const expirationDate = useMemo(() => {
    if (!user?.subscriptionExpiresAt) return 'N/A';
    const d = new Date(user.subscriptionExpiresAt);
    return Number.isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString();
  }, [user]);

  if (loading) {
    return <div className="dashboard-page"><p>Loading profile...</p></div>;
  }
  if (!user) {
    return (
      <div className="dashboard-page">
        <p>Not logged in.</p>
        <Link to="/login" className="auth-button">Log in</Link>
      </div>
    );
  }

  // Valeurs venant d’un .env (Vite) – tu peux aussi tout passer par l’API si tu préfères
  const DISCORD_INVITE = import.meta.env.VITE_DISCORD_INVITE_URL || '#';
  const DOWNLOAD_API = '/api/download/latest'; // route sécurisée (voir backend ci-dessous)

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
              <span className="subscription-status active">Confirmed - Active until {expirationDate}</span>
            ) : user?.subscriptionExpiresAt && user?.subscriptionStatus !== 'confirmed' ? (
              <span className="subscription-status pending">Payment pending confirmation</span>
            ) : (
              <span className="subscription-status inactive">Inactive / Expired</span>
            )}
          </div>
        </div>

        {isSubscribed ? (
          <div className="member-area">
            <h2>Member Area</h2>
            <div className="member-actions">
              <div className="member-action-card">
                <div className="step-icon"><DownloadIcon /></div>
                <h3>Download Software</h3>
                <p>Get the latest version of the AimGuard client.</p>

                {/* IMPORTANT: lien vers l'API protégée ; le token est envoyé automatiquement par le navigateur si tu utilises cookie HttpOnly.
                   Si tu stockes le JWT en header Authorization, fais un fetch pour récupérer un blob (voir mini code plus bas). */}
                <a href={DOWNLOAD_API} className="auth-button">Download Now</a>
              </div>

              <div className="member-action-card">
                <div className="step-icon"><DiscordIcon /></div>
                <h3>Join our Community</h3>
                <p>Get support, share profiles, and chat with other users.</p>
                <a
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button"
                >
                  Join Discord
                </a>
              </div>
            </div>
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
