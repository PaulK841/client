import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icônes modernes et minimalistes
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="2" width="24" height="24" rx="6" fill="url(#logoGradient)" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="14" cy="14" r="4" fill="white" opacity="0.9"/>
    <circle cx="14" cy="14" r="2" fill="currentColor"/>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6"/>
        <stop offset="100%" stopColor="#1d4ed8"/>
      </linearGradient>
    </defs>
  </svg>
);

const Header = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const { token, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => { setHeaderScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const closeMobileMenu = () => setNavOpen(false);

  return (
    <>
      <header className={`modern-header ${headerScrolled ? 'scrolled' : ''}`}>
        <nav className="container modern-navbar">
          <Link to="/" className="modern-logo">
            <LogoIcon />
            <span>AimGuard</span>
          </Link>
          
          <div className="nav-center">
            {token ? (
              <div className="nav-links">
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/profile" className="nav-link">{user?.username || 'Profile'}</NavLink>
              </div>
            ) : (
              <div className="nav-links">
                <a href="/#features" className="nav-link">Features</a>
                <a href="/#hardware-build" className="nav-link">Hardware</a>
              </div>
            )}
          </div>

          <div className="nav-actions">
            {token ? (
              <>
                <NavLink to="/pricing" className="nav-btn primary">Purchase</NavLink>
                <button onClick={logout} className="nav-btn secondary">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-btn secondary">Login</NavLink>
                <NavLink to="/pricing" className="nav-btn primary">Pricing</NavLink>
              </>
            )}
          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
          >
            {navOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${navOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-nav-links">
            {token ? (
              <>
                <NavLink to="/" onClick={closeMobileMenu} className="mobile-nav-link">Home</NavLink>
                <NavLink to="/profile" onClick={closeMobileMenu} className="mobile-nav-link">
                  {user?.username || 'Profile'}
                </NavLink>
                <NavLink to="/pricing" onClick={closeMobileMenu} className="mobile-nav-link">Purchase</NavLink>
                <button onClick={() => { logout(); closeMobileMenu(); }} className="mobile-nav-link logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/#features" onClick={closeMobileMenu} className="mobile-nav-link">Features</a>
                <a href="/#hardware-build" onClick={closeMobileMenu} className="mobile-nav-link">Hardware</a>
                <NavLink to="/login" onClick={closeMobileMenu} className="mobile-nav-link">Login</NavLink>
                <NavLink to="/pricing" onClick={closeMobileMenu} className="mobile-nav-link primary">Pricing</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;