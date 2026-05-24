import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import ConsultationModal from '../ConsultationModal/ConsultationModal';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navbarRef = useRef(null);

  const toggleDropdown = (e, dropdownName) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon"></div>
          <span className="logo-text">LendoGO</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <a href="#" className="nav-link active">Home</a>

          <div className="dropdown-container">
            <a href="#" className="nav-link dropdown" onClick={(e) => toggleDropdown(e, 'loanProducts')}>Loan Products</a>
            {activeDropdown === 'loanProducts' && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">Personal Loans</a>
                <a href="#" className="dropdown-item">Business Loan</a>
                <a href="#" className="dropdown-item">Home Loan</a>
                <a href="#" className="dropdown-item">Loan Against Property</a>
                <a href="#" className="dropdown-item">Loan Against Securities</a>
                <a href="#" className="dropdown-item">Instant Personal Loans</a>
                <a href="#" className="dropdown-item">Credit Builder Loan</a>
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
          <a href="#" className="nav-link">Blogs</a>

          <div className="dropdown-container">
            <a href="#" className="nav-link dropdown" onClick={(e) => toggleDropdown(e, 'support')}>Support</a>
            {activeDropdown === 'support' && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">About Us</a>
                {/* <a href="#" className="dropdown-item">Contact Us</a> */}
                <Link to="/careers" className="dropdown-item">Careers </Link>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-actions">
          <button className="btn-outline" onClick={() => setModalOpen(true)}>Free Consultation</button>
          <button className="btn-primary">Sign In</button>
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
        <a href="#" className="mobile-link active">Home</a>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'loanProductsMobile')}>
            Loan Products <span className="mobile-arrow">{activeDropdown === 'loanProductsMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'loanProductsMobile' && (
            <div className="mobile-submenu">
              <a href="#" className="mobile-sublink">Personal Loans</a>
              <a href="#" className="mobile-sublink">Business Loan</a>
              <a href="#" className="mobile-sublink">Home Loan</a>
              <a href="#" className="mobile-sublink">Loan Against Property</a>
              <a href="#" className="mobile-sublink">Instant Personal Loans</a>
              <a href="#" className="mobile-sublink">Credit Builder Loan</a>
            </div>
          )}
        </div>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'loanCalculatorsMobile')}>
            Loan Calculators <span className="mobile-arrow">{activeDropdown === 'loanCalculatorsMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'loanCalculatorsMobile' && (
            <div className="mobile-submenu">
              <a href="#" className="mobile-sublink">Car Loan Calculator</a>
              <a href="#" className="mobile-sublink">Bike Loan Calculator</a>
              <a href="#" className="mobile-sublink">Laptop Loan Calculator</a>
              <a href="#" className="mobile-sublink">Travel Loan Calculator</a>
              <a href="#" className="mobile-sublink">Marriage Loan Calculator</a>
            </div>
          )}
        </div>

        <a href="#" className="mobile-link">Repay Loan</a>
        <a href="#" className="mobile-link">Blogs</a>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'supportMobile')}>
            Support <span className="mobile-arrow">{activeDropdown === 'supportMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'supportMobile' && (
            <div className="mobile-submenu">
              <a href="#" className="mobile-sublink">About Us</a>
              {/* <a href="#" className="mobile-sublink">Contact Us</a> */}
              <Link to="/careers" className="mobile-sublink">Careers </Link>
            </div>
          )}
        </div>

        <div className="mobile-actions">
          <button className="btn-outline" onClick={() => { setModalOpen(true); setMenuOpen(false); }}>Free Consultation</button>
          <button className="btn-primary">Sign In</button>
        </div>
      </div>
    </nav>

    <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
