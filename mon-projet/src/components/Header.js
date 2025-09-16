import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, logout, user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="rgba(59, 130, 246, 0.1)"/>
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
            </svg>
            AimGuard
          </Link>
        </div>

        <div className="nav-menu">
          {token ? (
            <>
              <NavLink to="/" className="nav-link">Home</NavLink>
              <NavLink to="/profile" className="nav-link">{user?.username || 'Profile'}</NavLink>
              <NavLink to="/pricing" className="nav-link btn-primary">Purchase</NavLink>
              <button onClick={logout} className="nav-link btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <a href="/#features" className="nav-link">Features</a>
              <a href="/#hardware-build" className="nav-link">Hardware</a>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/pricing" className="nav-link btn-primary">Pricing</NavLink>
            </>
          )}
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mobile-nav">
          {token ? (
            <>
              <NavLink to="/" onClick={toggleMenu} className="mobile-nav-link">Home</NavLink>
              <NavLink to="/profile" onClick={toggleMenu} className="mobile-nav-link">
                {user?.username || 'Profile'}
              </NavLink>
              <NavLink to="/pricing" onClick={toggleMenu} className="mobile-nav-link">Purchase</NavLink>
              <button onClick={() => { logout(); toggleMenu(); }} className="mobile-nav-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/#features" onClick={toggleMenu} className="mobile-nav-link">Features</a>
              <a href="/#hardware-build" onClick={toggleMenu} className="mobile-nav-link">Hardware</a>
              <NavLink to="/login" onClick={toggleMenu} className="mobile-nav-link">Login</NavLink>
              <NavLink to="/pricing" onClick={toggleMenu} className="mobile-nav-link">Pricing</NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;