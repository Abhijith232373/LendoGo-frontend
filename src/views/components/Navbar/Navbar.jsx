import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-icon"></div>
          <span className="logo-text">LendoGO</span>
        </div>
        
        <div className="navbar-links">
          <a href="#" className="nav-link active">Home</a>
          <a href="#" className="nav-link dropdown">Loan Products</a>
          <a href="#" className="nav-link dropdown">Loan Calculators</a>
          <a href="#" className="nav-link">Repay Loan</a>
          <a href="#" className="nav-link">Blogs</a>
          <a href="#" className="nav-link dropdown">Support</a>
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
