import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navbarRef = useRef(null);

  const toggleDropdown = (e, dropdownName) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon"></div>
          <span className="logo-text">LendoGO</span>
        </div>
        
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
                <a href="#" className="dropdown-item">Contact Us</a>
                <a href="#" className="dropdown-item">Careers</a>
              </div>
            )}
          </div>
        </div>
        
        <div className="navbar-actions">
          <button className="btn-outline">Free Consultation</button>
          <button className="btn-primary">Sign In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
