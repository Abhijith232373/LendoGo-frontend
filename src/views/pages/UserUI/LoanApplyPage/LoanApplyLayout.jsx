import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import ScrollReveal from '../../../components/ScrollReveal/ScrollReveal';
import './LoanApplyPage.css';

const STEPS = [
  { label: 'APPLICANT', path: '/loan/apply/details', icon: 'applicant' },
  { label: 'OFFER CONFIG', path: '/loan/apply/offer', icon: 'offer' },
  { label: 'KYC DETAILS', path: '/loan/apply/kyc', icon: 'kyc' },
  { label: 'AGREEMENT', path: '/loan/apply/terms', icon: 'terms' },
  { label: 'STATUS', path: '/loan/apply/disbursal', icon: 'disbursal' },
];

const StepIcon = ({ type }) => {
  if (type === 'applicant') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (type === 'offer') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  if (type === 'kyc') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  if (type === 'terms') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  // disbursal / status
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
};

const LoanApplyLayout = ({ children }) => {
  const location = useLocation();
  const navigate  = useNavigate();

  // Match current step ignoring query params
  const currentIndex = STEPS.findIndex(s =>
    location.pathname === s.path
  );

  return (
    <div className="loan-apply-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic ambient moving shapes background */}
      <ParallaxShapes preset="side-decor" />

      <header className="loan-progress-header" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="loan-progress-logo"
          onClick={() => navigate('/home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <img src="https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686372/lendogoLogo_lh4jjw.png" alt="LendoGO Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
          <div>Lendo<span>Go</span></div>
        </div>

        {/* Custom Tab Row mimicking image */}
        <div className="loan-tab-navbar-container">
          <nav className="loan-tab-navbar" aria-label="Application Steps">
            {STEPS.map((step, idx) => {
              const isActive = idx === currentIndex;
              const isCompleted = idx < currentIndex;
              let stepClass = 'tab-nav-item';
              if (isActive) stepClass += ' active';
              if (isCompleted) stepClass += ' completed';

              return (
                <div key={step.path} className={stepClass}>
                  <div className="tab-nav-icon-wrapper">
                    <StepIcon type={step.icon} />
                  </div>
                  <span className="tab-nav-label">{step.label}</span>
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="loan-step-content" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal key={location.pathname} variant="fade-left" duration={0.9} style={{ width: '100%', maxWidth: '1120px', margin: '0 auto' }}>
          {children}
        </ScrollReveal>
      </main>
    </div>
  );
};

export default LoanApplyLayout;
