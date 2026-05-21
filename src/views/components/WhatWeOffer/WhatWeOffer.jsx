import React from 'react';
import './WhatWeOffer.css';

const WhatWeOffer = () => {
  return (
    <section className="what-we-offer">
      <h2 className="offer-title">What We Offer?</h2>
      
      <div className="offer-grid">
        <div className="offer-card">
          <div className="offer-icon">
            {/* SVG placeholder for Loan Amount Icon (Sack of money) */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="offer-card-title">Loan Amount</h3>
          <p className="offer-card-text">₹2,000 - ₹2,00,000</p>
        </div>

        <div className="offer-card">
          <div className="offer-icon">
            {/* SVG placeholder for Quick Disbursal Icon (Approval Badge) */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 className="offer-card-title">Quick Disbursal</h3>
          <p className="offer-card-text">Funds to your bank in 2 minutes</p>
        </div>

        <div className="offer-card">
          <div className="offer-icon">
            {/* SVG placeholder for Flexible Repayment Icon (Wallet/Hand) */}
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <h3 className="offer-card-title">Flexible Repayment</h3>
          <p className="offer-card-text">Choose between 2 to 36 months</p>
        </div>

        <div className="offer-card">
          <div className="offer-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <h3 className="offer-card-title">No Paperwork</h3>
          <p className="offer-card-text">Just PAN, Aadhaar, and bank statement</p>
        </div>

        <div className="offer-card">
          <div className="offer-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="9" y1="15" x2="15" y2="21"></line>
              <line x1="15" y1="15" x2="9" y2="21"></line>
            </svg>
          </div>
          <h3 className="offer-card-title">No Collateral Needed</h3>
          <p className="offer-card-text">Get funds without pledging any security or assets</p>
        </div>

        <div className="offer-card">
          <div className="offer-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <h3 className="offer-card-title">100% Online Process</h3>
          <p className="offer-card-text">Apply, upload, and receive money</p>
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
