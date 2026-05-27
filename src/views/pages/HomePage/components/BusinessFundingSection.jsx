import React from 'react';
import laptopImg from '../../../../assets/laptop_business_funding.png';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';

const BusinessFundingSection = ({ navigate }) => {
  return (
    <section className="business-funding-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Interactive Floating Background Parallax Shapes */}
      <ParallaxShapes preset="side-decor" />

      <div className="business-funding-layout" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Left Column: LendoGO Value Proposition and Action Flow */}
        <div className="business-funding-details-col">
          <h2 className="business-funding-headline">
            Business Funding Simplified
          </h2>
          <p className="business-funding-paragraph">
            Improve your cash flow in under 24 hours. Access between ₹10 Lakhs to ₹10 Crores in business finance with a LendoGO facility.
          </p>

          {/* Action Trigger */}
          <button
            onClick={() => navigate('/loan/apply/details?type=business')}
            className="btn-business-funding-cta"
          >
            APPLY NOW
          </button>

          {/* Apply Duration Subtext Indicator */}
          <div className="business-funding-duration-indicator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2.5" />
              <path d="M12 6V12L15.5 14" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="duration-text">Apply in 2 minutes</span>
          </div>
        </div>

        {/* Right Column: Open Laptop Screen and Floating Metric Indicators */}
        <div className="business-funding-visual-col">
          <div className="business-funding-visual-wrapper">
            
            {/* Base Laptop graphic */}
            <img 
              src={laptopImg} 
              alt="LendoGO Corporate Business Funding Analytics Dashboard" 
              className="laptop-showcase-img" 
            />

            {/* Fingertip Keypress Typing Sparks Overlay */}
            <div className="typing-spark tap-left-1" />
            <div className="typing-spark tap-left-2" />
            <div className="typing-spark tap-left-3" />
            <div className="typing-spark tap-left-4" />
            <div className="typing-spark tap-right-1" />
            <div className="typing-spark tap-right-2" />
            <div className="typing-spark tap-right-3" />
            <div className="typing-spark tap-right-4" />

            {/* Floating Element 1: Premium Amount Slider Card */}
            <div className="floating-funding-slider-card animate-float-slow">
              <span className="slider-card-label">Your Required Funding</span>
              <strong className="slider-card-value">₹25,00,000</strong>
              <div className="slider-card-track-wrapper">
                <div className="slider-card-track-line">
                  <div className="slider-card-track-fill" style={{ width: '55%' }} />
                  <div className="slider-card-track-thumb" style={{ left: '55%' }} />
                </div>
                <div className="slider-card-track-ticks">
                  <span>₹1,00,000</span>
                  <span>₹50,00,000</span>
                </div>
              </div>
            </div>

            {/* Floating Element 2: Green circular money badge */}
            <div className="floating-money-badge animate-float-reverse">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#10b981" />
                <path d="M7 11.5H17M7 11.5C7 10 9 8.5 12 8.5C15 8.5 17 10 17 11.5M7 11.5C7 13 9 14.5 12 14.5C15 14.5 17 13 17 11.5M12 5V19" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Floating Element 3: Dual invoice document status card */}
            <div className="floating-invoice-status-card animate-float-slow">
              <div className="invoice-status-row">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="2" width="14" height="16" rx="2" stroke="#64748b" strokeWidth="2" />
                  <line x1="6" y1="6" x2="14" y2="6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="10" x2="14" y2="10" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                  <line x1="6" y1="14" x2="10" y2="14" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="invoice-status-dot green" />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Corporate Brand Trust Logo Bar (As Seen On: Animate into Moving Loop) */}
      <div className="brand-trust-bar">
        <div className="brand-trust-container">
          <span className="trust-bar-label">AS SEEN ON:</span>
          
          <div className="brand-trust-marquee">
            <div className="marquee-track-logos">
              
              {/* Group 1 */}
              <div className="marquee-group-logos">
                {/* Logo 1: VERTEX */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  </svg>
                  <span className="trust-logo-text">VERTEX</span>
                </div>

                {/* Logo 2: martino */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <path d="M2 17C2 17 6 12 12 12C18 12 22 17 22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M2 7C2 7 6 12 12 12C18 12 22 7 22 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="trust-logo-text">martino</span>
                </div>

                {/* Logo 3: SquareStone */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="8" y="8" width="8" height="8" fill="currentColor" />
                  </svg>
                  <span className="trust-logo-text">SquareStone</span>
                </div>

                {/* Logo 4: waverio */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                  <span className="trust-logo-text">waverio</span>
                </div>

                {/* Logo 5: fireli */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <path d="M12 2C12 2 15 6 15 9.5C15 13 12 16 12 16C12 16 9 13 9 9.5C9 6 12 2 12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  </svg>
                  <span className="trust-logo-text">fireli</span>
                </div>
              </div>

              {/* Group 2 (Duplicate for infinite seamless scroll!) */}
              <div className="marquee-group-logos" aria-hidden="true">
                {/* Logo 1: VERTEX */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <path d="M12 2L2 22H22L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  </svg>
                  <span className="trust-logo-text">VERTEX</span>
                </div>

                {/* Logo 2: martino */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <path d="M2 17C2 17 6 12 12 12C18 12 22 17 22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M2 7C2 7 6 12 12 12C18 12 22 7 22 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="trust-logo-text">martino</span>
                </div>

                {/* Logo 3: SquareStone */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="8" y="8" width="8" height="8" fill="currentColor" />
                  </svg>
                  <span className="trust-logo-text">SquareStone</span>
                </div>

                {/* Logo 4: waverio */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                  <span className="trust-logo-text">waverio</span>
                </div>

                {/* Logo 5: fireli */}
                <div className="trust-logo-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="trust-logo-icon">
                    <path d="M12 2C12 2 15 6 15 9.5C15 13 12 16 12 16C12 16 9 13 9 9.5C9 6 12 2 12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                  </svg>
                  <span className="trust-logo-text">fireli</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default BusinessFundingSection;
