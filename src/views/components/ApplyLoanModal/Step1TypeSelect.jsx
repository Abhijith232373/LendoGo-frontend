import React from 'react';

const Step1TypeSelect = ({ loanType, setLoanType }) => {
  return (
    <div className="loan-step-pane pane-1 animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Sanction Destination Category</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Select the target capital product based on funding specifications</p>
      </div>

      <div className="loan-types-grid">
        <div 
          className={`loan-type-card ${loanType === 'micro' ? 'selected' : ''}`}
          onClick={() => setLoanType('micro')}
        >
          <div className="loan-type-icon">⚡</div>
          <h3>Micro Credit</h3>
          <p>Fast micro borrowing. Repay inside 3-6 months to establish operations trust.</p>
          <span className="loan-tier-tag bronze">Trust Tiers</span>
        </div>

        <div 
          className={`loan-type-card ${loanType === 'home' ? 'selected' : ''}`}
          onClick={() => setLoanType('home')}
        >
          <div className="loan-type-icon">🏠</div>
          <h3>Home Loan</h3>
          <p>Long-term housing funds. Requires income slips & collateral registry checks.</p>
          <span className="loan-tier-tag secured">High Docs</span>
        </div>

        <div 
          className={`loan-type-card ${loanType === 'vehicle' ? 'selected' : ''}`}
          onClick={() => setLoanType('vehicle')}
        >
          <div className="loan-type-icon">🏍️</div>
          <h3>Vehicle Loan</h3>
          <p>Finance two-wheeler or auto purchases. Identity & dealer invoice uploads.</p>
          <span className="loan-tier-tag secured">High Docs</span>
        </div>
      </div>
    </div>
  );
};

export default Step1TypeSelect;
