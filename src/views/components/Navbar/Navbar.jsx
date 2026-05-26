import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import ConsultationModal from '../ConsultationModal/ConsultationModal';
import { useAuthController } from '../../../controllers/auth/useAuthController';

const Navbar = () => {
  const { user, signOut } = useAuthController();
  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navbarRef = useRef(null);

  const [profileDp, setProfileDp] = useState(
    localStorage.getItem('user_dp') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );

  useEffect(() => {
    const handleDpChange = () => {
      setProfileDp(
        localStorage.getItem('user_dp') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      );
    };
    window.addEventListener('user-dp-changed', handleDpChange);
    return () => window.removeEventListener('user-dp-changed', handleDpChange);
  }, []);

  const toggleDropdown = (e, dropdownName) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveDropdown(null);
    setProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setMenuOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate(user.isAuthenticated ? '/home' : '/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon"></div>
          <span className="logo-text">LendoGO</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to={user.isAuthenticated ? "/home" : "/"} className="nav-link">Home</Link>

          <div className="dropdown-container">
            <a href="#" className="nav-link dropdown" onClick={(e) => toggleDropdown(e, 'loanProducts')}>Loan Products</a>
            {activeDropdown === 'loanProducts' && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { navigate('/loan/apply/details?type=personal'); setActiveDropdown(null); }}>Personal Loans</button>
                <button className="dropdown-item" onClick={() => { navigate('/loan/apply/details?type=business'); setActiveDropdown(null); }}>Business Loan</button>
                <button className="dropdown-item" onClick={() => { navigate('/loan/apply/details?type=home'); setActiveDropdown(null); }}>Home Loan</button>
                <button className="dropdown-item" onClick={() => { navigate('/loan/apply/details?type=property'); setActiveDropdown(null); }}>Loan Against Property</button>
                <button className="dropdown-item" onClick={() => { navigate('/loan/apply/details?type=instant'); setActiveDropdown(null); }}>Instant Personal Loans</button>
                <button className="dropdown-item" onClick={() => { navigate('/loan/apply/details?type=credit-builder'); setActiveDropdown(null); }}>Credit Builder Loan</button>
              </div>
            )}
          </div>

          <div className="dropdown-container">
            <a href="#" className="nav-link dropdown" onClick={(e) => toggleDropdown(e, 'loanCalculators')}>Loan Calculators</a>
            {activeDropdown === 'loanCalculators' && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">Car Loan Calculator</a>
                <a href="#" className="dropdown-item">Bike Loan Calculator</a>
                <a href="#" className="dropdown-item">Laptop Loan Calculator</a>
                <a href="#" className="dropdown-item">Mobile Loan Calculator</a>
                <a href="#" className="dropdown-item">Travel Loan Calculator</a>
                <a href="#" className="dropdown-item">Marriage Loan Calculator</a>
              </div>
            )}
          </div>

          <a href="#" className="nav-link">Repay Loan</a>
          <Link to="/blogs" className="nav-link">Blogs</Link>

          <div className="dropdown-container">
            <a href="#" className="nav-link dropdown" onClick={(e) => toggleDropdown(e, 'support')}>Support</a>
            {activeDropdown === 'support' && (
              <div className="dropdown-menu">
                <Link to="/about" className="dropdown-item">About Us</Link>
                <Link to="/careers" className="dropdown-item">Careers </Link>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <button className="btn-outline" onClick={() => setModalOpen(true)}>Free Consultation</button>
          
          {user.isAuthenticated ? (
            <div className="profile-dropdown-container">
              <button 
                type="button"
                className="navbar-avatar-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User Menu"
                style={{ padding: 0, overflow: 'hidden' }}
              >
                <img 
                  src={profileDp} 
                  alt="User Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </button>
              
              {profileDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-menu-header">
                    <span className="profile-menu-name">{user.name}</span>
                    <span className="profile-menu-email">{user.email}</span>
                  </div>
                  <div className="profile-menu-divider" />
                  <Link 
                    to="/home" 
                    className="profile-menu-item" 
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/profile" 
                    className="profile-menu-item" 
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button 
                    type="button"
                    className="profile-menu-item sign-out-btn" 
                    onClick={() => {
                      signOut();
                      setProfileDropdownOpen(false);
                      navigate('/');
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/')}>Sign In</button>
          )}
        </div>

        {/* Hamburger button — mobile only */}
        <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`ham-bar ${menuOpen ? 'open-1' : ''}`}></span>
          <span className={`ham-bar ${menuOpen ? 'open-2' : ''}`}></span>
          <span className={`ham-bar ${menuOpen ? 'open-3' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <Link to={user.isAuthenticated ? "/home" : "/"} className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'loanProductsMobile')}>
            Loan Products <span className="mobile-arrow">{activeDropdown === 'loanProductsMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'loanProductsMobile' && (
            <div className="mobile-submenu">
              <button className="mobile-sublink" onClick={() => { navigate('/loan/apply/details?type=personal'); setMenuOpen(false); }}>Personal Loans</button>
              <button className="mobile-sublink" onClick={() => { navigate('/loan/apply/details?type=business'); setMenuOpen(false); }}>Business Loan</button>
              <button className="mobile-sublink" onClick={() => { navigate('/loan/apply/details?type=home'); setMenuOpen(false); }}>Home Loan</button>
              <button className="mobile-sublink" onClick={() => { navigate('/loan/apply/details?type=property'); setMenuOpen(false); }}>Loan Against Property</button>
              <button className="mobile-sublink" onClick={() => { navigate('/loan/apply/details?type=instant'); setMenuOpen(false); }}>Instant Personal Loans</button>
              <button className="mobile-sublink" onClick={() => { navigate('/loan/apply/details?type=credit-builder'); setMenuOpen(false); }}>Credit Builder Loan</button>
            </div>
          )}
        </div>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'loanCalculatorsMobile')}>
            Loan Calculators <span className="mobile-arrow">{activeDropdown === 'loanCalculatorsMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'loanCalculatorsMobile' && (
            <div className="mobile-submenu">
              <a href="#" className="mobile-sublink" onClick={() => setMenuOpen(false)}>Car Loan Calculator</a>
              <a href="#" className="mobile-sublink" onClick={() => setMenuOpen(false)}>Bike Loan Calculator</a>
              <a href="#" className="mobile-sublink" onClick={() => setMenuOpen(false)}>Laptop Loan Calculator</a>
              <a href="#" className="mobile-sublink" onClick={() => setMenuOpen(false)}>Travel Loan Calculator</a>
              <a href="#" className="mobile-sublink" onClick={() => setMenuOpen(false)}>Marriage Loan Calculator</a>
            </div>
          )}
        </div>

        <a href="#" className="mobile-link" onClick={() => setMenuOpen(false)}>Repay Loan</a>
        <Link to="/blogs" className="mobile-link" onClick={() => setMenuOpen(false)}>Blogs</Link>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'supportMobile')}>
            Support <span className="mobile-arrow">{activeDropdown === 'supportMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'supportMobile' && (
            <div className="mobile-submenu">
              <Link to="/about" className="mobile-sublink" onClick={() => setMenuOpen(false)}>About Us</Link>
              <Link to="/careers" className="mobile-sublink" onClick={() => setMenuOpen(false)}>Careers </Link>
            </div>
          )}
        </div>

        <div className="mobile-actions">
          <button className="btn-outline" onClick={() => { setModalOpen(true); setMenuOpen(false); }}>Free Consultation</button>
          
          {user.isAuthenticated ? (
            <div className="mobile-profile-info">
              <div className="mobile-avatar-badge" style={{ overflow: 'hidden', padding: 0 }}>
                <img 
                  src={profileDp} 
                  alt="User Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div className="mobile-user-details">
                <span className="mobile-username">{user.name}</span>
                <span className="mobile-useremail">{user.email}</span>
              </div>
              <div className="mobile-profile-links">
                <Link to="/home" className="mobile-profile-link-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/profile" className="mobile-profile-link-item" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button 
                  type="button"
                  className="mobile-profile-link-item mobile-sign-out" 
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                    navigate('/');
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => { navigate('/'); setMenuOpen(false); }}>Sign In</button>
          )}
        </div>
      </div>
    </nav>

    <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
