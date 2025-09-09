import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MenuIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>);
const CloseIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>);

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
      <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
        <nav className="container navbar">
          <Link to="/" className="logo">AimGuard</Link>
          <div className="nav-links-desktop">
            {token ? (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/profile">{user?.username || 'Profile'}</NavLink>
                <NavLink to="/pricing" className="contact-btn">Purchase</NavLink>
                <a href="#!" onClick={logout}>Logout</a>
              </>
            ) : (
              <>
                <a href="/#features">Features</a>
                <a href="/#hardware-build">Hardware</a>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/pricing" className="contact-btn">Pricing</NavLink>
              </>
            )}
          </div>
          <div className="burger-menu" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <CloseIcon className="icon" /> : <MenuIcon className="icon" />}
          </div>
        </nav>
      </header>
      <div className={`nav-links-mobile ${navOpen ? 'open' : ''}`}>
        <div className="links-container">
          {token ? (
            <>
              <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
              <NavLink to="/profile" onClick={closeMobileMenu}>{user?.username || 'Profile'}</NavLink>
              <NavLink to="/pricing" onClick={closeMobileMenu} className="contact-btn">Purchase</NavLink>
              <a href="#!" onClick={() => { logout(); closeMobileMenu(); }}>Logout</a>
            </>
          ) : (
            <>
              <a href="/#features" onClick={closeMobileMenu}>Features</a>
              <a href="/#hardware-build" onClick={closeMobileMenu}>Hardware</a>
              <NavLink to="/login" onClick={closeMobileMenu}>Login</NavLink>
              <NavLink to="/pricing" onClick={closeMobileMenu} className="contact-btn">Pricing</NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;