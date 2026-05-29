import React from 'react';
import sleekBlueSedan from '../../../../../assets/sleek_blue_sedan.png';
import ruggedWhiteSuv from '../../../../../assets/rugged_white_suv.png';
import ParallaxShapes from '../../../../components/ParallaxShapes/ParallaxShapes';

const AutoLoanSection = ({ navigate }) => {
  return (
    <section className="auto-loan-section">
      {/* Interactive Background Floating Shapes */}
      <ParallaxShapes preset="side-decor" />

      <div className="auto-loan-layout">
        
        {/* Left Column: Layered Vehicles and Floating Status Cards */}
        <div className="auto-loan-visual-col">
          <div className="auto-loan-visual-wrapper">
            
            {/* Bottom/Foreground Element: Rugged White SUV with Pulsing Headlights */}
            <div className="auto-loan-car-container suv-container animate-float-reverse">
              <img src={ruggedWhiteSuv} alt="LendoGO Rugged White SUV Auto Loan" className="auto-loan-vehicle-img suv-img" />
              
              {/* Headlight 1 (Inner Left) */}
              <div className="car-headlight suv-headlight-1">
                <div className="headlight-beam" />
              </div>
              {/* Headlight 2 (Outer Right) */}
              <div className="car-headlight suv-headlight-2">
                <div className="headlight-beam" />
              </div>
            </div>

            {/* Small Corner Accent Element: Sleek Blue Sedan with Pulsing Headlights */}
            <div className="auto-loan-car-container accent-car-container animate-float-slow">
              <img src={sleekBlueSedan} alt="LendoGO Accent Blue Sedan Auto Loan" className="auto-loan-vehicle-img sedan-img" />
              
              {/* Headlight 1 (Inner Left) */}
              <div className="car-headlight sedan-headlight-1">
                <div className="headlight-beam" />
              </div>
              {/* Headlight 2 (Outer Right) */}
              <div className="car-headlight sedan-headlight-2">
                <div className="headlight-beam" />
              </div>
            </div>

            {/* Floating Card 1: Your Monthly Payment (Floating over Sedan) */}
            <div className="floating-status-card card-payment animate-float-slow">
              <span className="floating-card-title">Your Monthly Payment</span>
              <strong className="floating-card-value text-purple">₹29,999 <span className="floating-card-unit">/mo*</span></strong>
              <span className="floating-card-subtext">₹1.5 Lakhs down payment</span>
            </div>

            {/* Floating Card 2: 36 Month Financing (Floating beside both cars) */}
            <div className="floating-status-card card-financing animate-float-reverse">
              <span className="floating-card-title">36 Month Financing</span>
              <strong className="floating-card-value text-indigo">8.99% <span className="floating-card-unit">/APR*</span></strong>
              <span className="floating-card-subtext">₹0 Down payment</span>
            </div>

          </div>
          
          {/* Visual Footnote Disclaimer */}
          <span className="auto-loan-footnote-disclaimer">
            *For display only, actual credit terms may vary.
          </span>
        </div>

        {/* Right Column: LendoGO Value Proposition and Action Flow */}
        <div className="auto-loan-details-col">
          <span className="auto-loan-overhead-badge">No Hidden Fees</span>
          <h2 className="auto-loan-headline">
            Low Interest Auto Loans at LendoGO Credit
          </h2>
          <p className="auto-loan-paragraph">
            Our low-interest auto loans make vehicle ownership more accessible and affordable, empowering you to upgrade your ride without the financial burden.
          </p>

          {/* Core Feature Bullet Points with Premium SVGs */}
          <ul className="auto-loan-feature-list">
            <li className="auto-loan-feature-item">
              <div className="feature-checkmark-wrapper">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="10" fill="#a855f7" fillOpacity="0.15" />
                  <path d="M6 10L9 13L14 7" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="feature-item-text">Competitive rates as low as 8.99% APR</span>
            </li>
            <li className="auto-loan-feature-item">
              <div className="feature-checkmark-wrapper">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="10" fill="#a855f7" fillOpacity="0.15" />
                  <path d="M6 10L9 13L14 7" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="feature-item-text">Flexible terms up to 84 months</span>
            </li>
            <li className="auto-loan-feature-item">
              <div className="feature-checkmark-wrapper">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="10" fill="#a855f7" fillOpacity="0.15" />
                  <path d="M6 10L9 13L14 7" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="feature-item-text">100% online application and approval</span>
            </li>
          </ul>

          {/* Action Trigger */}
          <button
            onClick={() => navigate('/loan/apply/details?type=auto')}
            className="btn-auto-loan-cta"
          >
            Apply Now <span className="cta-arrow">&rarr;</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default AutoLoanSection;
