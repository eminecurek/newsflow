import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">N</span>
          <span className="brand-text">NewsFlow</span>
        </Link>

        {/* Desktop nav */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Ana Sayfa
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/feed" className={`nav-link ${isActive('/feed') ? 'active' : ''}`}>
                Akışım
              </Link>
              <Link to="/saved" className={`nav-link ${isActive('/saved') ? 'active' : ''}`}>
                Kaydedilenler
              </Link>
              <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
                Ayarlar
              </Link>
            </>
          )}
        </div>

        {/* Desktop auth */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">
                Merhaba, <strong>{user?.username}</strong>
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Çıkış
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Giriş Yap
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menüyü aç/kapat"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
          Ana Sayfa
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/feed" className={`mobile-link ${isActive('/feed') ? 'active' : ''}`} onClick={closeMenu}>
              Akışım
            </Link>
            <Link to="/saved" className={`mobile-link ${isActive('/saved') ? 'active' : ''}`} onClick={closeMenu}>
              Kaydedilenler
            </Link>
            <Link to="/settings" className={`mobile-link ${isActive('/settings') ? 'active' : ''}`} onClick={closeMenu}>
              Ayarlar
            </Link>
          </>
        )}
        {isAuthenticated ? (
          <button className="mobile-link mobile-logout" onClick={handleLogout}>
            Çıkış Yap
          </button>
        ) : (
          <div className="mobile-auth">
            <Link to="/login" className="btn btn-secondary" onClick={closeMenu}>
              Giriş Yap
            </Link>
            <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
