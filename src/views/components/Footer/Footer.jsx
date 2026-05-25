import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* Column 1: Brand & Apps */}
          <div className="footer-col">
            <div className="footer-logo">
              <div className="logo-icon"></div>
              <span className="logo-text">LendoGO</span>
            </div>
            <p className="company-name">LENDOGO PLATFORMS PRIVATE LIMITED</p>
            
            <div className="social-icons">
              <a href="https://linkedin.com" className="social-linkedin" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://instagram.com" className="social-instagram" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://twitter.com" className="social-twitter" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="https://youtube.com" className="social-youtube" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="https://facebook.com" className="social-facebook" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>

            <div className="app-badges">
              <button className="store-badge google-play">
                <div className="badge-icon">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" width="24" height="24" style={{ display: 'block' }} />
                </div>
                <div className="badge-text">
                  <span className="small-text">GET IT ON</span>
                  <span className="large-text">Google Play</span>
                </div>
              </button>
              <button className="store-badge app-store">
                <div className="badge-icon">
                  <svg viewBox="0 0 384 512" width="24" height="24" fill="white">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                  </svg>
                </div>
                <div className="badge-text">
                  <span className="small-text">Download on the</span>
                  <span className="large-text">App Store</span>
                </div>
              </button>
            </div>
          </div>

          {/* Column 2: Contact Us */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-links">
              <li>LendoGO Tower, Tech Park, Bengaluru, Karnataka - 560001</li>
              <li>+91 9876543210</li>
              <li>help@lendogo.com</li>
              <li>(NBFC) bearing Registration No: B-12.34567</li>
            </ul>
            
            <h4 className="footer-heading grievance-heading">Grievance</h4>
            <ul className="footer-links">
              <li>For technical issues:</li>
              <li>tech@lendogo.com</li>
              <li>For sanction/loan approval:</li>
              <li>approvals@lendogo.com</li>
            </ul>
          </div>

          {/* Column 3: LendoGO */}
          <div className="footer-col">
            <h4 className="footer-heading">LendoGO</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/careers" className="footer-careers-link">Careers 🚀</Link></li>
              <li><a href="#">Get in contact</a></li>
              <li><a href="#">Eligibility criteria</a></li>
            </ul>
          </div>

          {/* Column 4: Products */}
          <div className="footer-col">
            <h4 className="footer-heading">Products</h4>
            <ul className="footer-links">
              <li><a href="#">Personal Loans</a></li>
              <li><a href="#">Business Loan</a></li>
              <li><a href="#">Home Loan</a></li>
              <li><a href="#">Loan Against Property</a></li>
              <li><a href="#">Loan Against Securities</a></li>
              <li><a href="#">Instant Personal Loans</a></li>
              <li><a href="#">Credit Builder Loan</a></li>
            </ul>
          </div>

          {/* Column 5: Other */}
          <div className="footer-col">
            <h4 className="footer-heading">Other</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms and Conditions</a></li>
              <li><a href="#">Account Deletion</a></li>
              <li><a href="#">Partners Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="copyright">
            © 2026 LendoGO. A brand by LendoGO Platforms Private Limited. All rights reserved.
          </div>
          <div className="footer-hiring-pill">
            <span className="footer-hiring-dot" />
            <span>We're hiring — </span>
            <Link to="/careers" className="footer-hiring-link">See open roles</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
