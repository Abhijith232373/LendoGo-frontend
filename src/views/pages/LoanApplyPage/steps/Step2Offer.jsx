import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';

const LOAN_PRODUCTS = [
  { id: 'personal',        label: 'Personal Loan' },
  { id: 'business',        label: 'Business Loan' },
  { id: 'home',            label: 'Home Loan' },
  { id: 'property',        label: 'Loan Against Property' },
  { id: 'instant',         label: 'Instant Personal Loan' },
  { id: 'credit-builder',  label: 'Credit Builder Loan' },
];

const LOAN_CONFIG = {
  personal:        { min: 10000,  max: 500000,  step: 5000,  minTenure: 6,  maxTenure: 60 },
  instant:         { min: 1000,   max: 50000,   step: 1000,  minTenure: 3,  maxTenure: 24 },
  'credit-builder':{ min: 5000,   max: 50000,   step: 1000,  minTenure: 6,  maxTenure: 24 },
  business:        { min: 50000,  max: 2000000, step: 10000, minTenure: 12, maxTenure: 60 },
  home:            { min: 500000, max: 10000000,step: 50000, minTenure: 12, maxTenure: 240 },
  property:        { min: 100000, max: 5000000, step: 25000, minTenure: 12, maxTenure: 120 },
};

const Step2Offer = () => {
  const navigate = useNavigate();
  const {
    loanType, setLoanType, setLoanTypeLabel, completedSteps,
    loanAmount, setLoanAmount,
    tenure, setTenure,
    isTrustedUpgrade, setIsTrustedUpgrade,
    interestRate, calcEmi, markStepComplete,
  } = useLoanApplication();

  useEffect(() => {
    if (!completedSteps.step1) navigate('/loan/apply/details');
  }, []);

  const cfg = LOAN_CONFIG[loanType] || LOAN_CONFIG['personal'];
  const { min, max, step, minTenure, maxTenure } = cfg;

  const useCards = loanType === 'instant' || loanType === 'credit-builder';
  const cardTenures = [3, 6];

  useEffect(() => {
    const freshCfg = LOAN_CONFIG[loanType] || LOAN_CONFIG['personal'];
    if (loanAmount > freshCfg.max) setLoanAmount(freshCfg.max);
    if (loanAmount < freshCfg.min) setLoanAmount(freshCfg.min);
    if (tenure > freshCfg.maxTenure) setTenure(freshCfg.maxTenure);
    if (tenure < freshCfg.minTenure) setTenure(freshCfg.minTenure);
  }, [loanType]);

  const emi        = calcEmi(loanAmount, tenure, interestRate);
  const totalRepay = emi * tenure;
  const fillPct    = Math.max(0, Math.min(100, ((loanAmount - min) / (max - min)) * 100));
  const tenureFill = Math.max(0, Math.min(100, ((tenure - minTenure) / (maxTenure - minTenure)) * 100));

  const handleProductChange = (prod) => {
    setLoanType(prod.id);
    setLoanTypeLabel(prod.label);
    const targetConfig = LOAN_CONFIG[prod.id];
    setLoanAmount(targetConfig.min);
    setTenure(targetConfig.minTenure);
  };

  const handleContinue = () => {
    markStepComplete('step2');
    navigate('/loan/apply/kyc');
  };

  const BriefcaseOutlineIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );

  return (
    <LoanApplyLayout>
      <div className="loan-step-card compact-card shadow-sm">
        {/* Step Title Row */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <BriefcaseOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            2. Loan Configuration
          </h2>
        </div>

        {/* Loan Product Selector Horizontal Pill Bar */}
        <div className="loan-product-selector">
          {LOAN_PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              type="button"
              className={`product-pill ${loanType === prod.id ? 'active' : ''}`}
              onClick={() => handleProductChange(prod)}
            >
              {prod.label}
            </button>
          ))}
        </div>

        {/* Instant loan trust upgrade toggle */}
        {loanType === 'instant' && (
          <div className="simulator-box" style={{ margin: '12px 0 16px' }}>
            <div className="simulator-text">
              <h4>Previous Loan Closed — Trusted Tier Upgrade</h4>
              <p>Unlock higher limit (up to ₹50,000) for accounts with a closed EMI track record</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isTrustedUpgrade}
                onChange={() => {
                  const checkVal = !isTrustedUpgrade;
                  setIsTrustedUpgrade(checkVal);
                  setLoanAmount(checkVal ? 50000 : 1000);
                }}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        )}

        {/* Sliders Container */}
        <div className="offer-sliders-container">
          {/* Amount Slider */}
          <div className="offer-slider-group" style={{ marginBottom: 16 }}>
            <div className="offer-slider-header">
              <span className="offer-slider-label">Requested Loan Amount</span>
              <span className="offer-slider-value">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              className="offer-range-input"
              min={min}
              max={isTrustedUpgrade && loanType === 'instant' ? 50000 : max}
              step={step}
              value={loanAmount}
              style={{ '--fill': `${fillPct}%` }}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
            <div className="offer-slider-bounds">
              <span>₹{min.toLocaleString('en-IN')}</span>
              <span>₹{(isTrustedUpgrade && loanType === 'instant' ? 50000 : max).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Tenure */}
          {useCards ? (
            <div style={{ marginBottom: 16 }}>
              <p className="offer-slider-label" style={{ marginBottom: 8 }}>Select Repayment Tenure</p>
              <div className="tenure-grid" style={{ gap: '10px', marginBottom: 0 }}>
                {cardTenures.map((m) => {
                  const cardEmi = calcEmi(loanAmount, m, interestRate);
                  return (
                    <div
                      key={m}
                      className={`tenure-tab ${tenure === m ? 'active' : ''}`}
                      onClick={() => setTenure(m)}
                      style={{ padding: '10px 8px' }}
                    >
                      <span className="tenure-tab-months" style={{ fontSize: '0.9rem' }}>{m} Months</span>
                      <span className="tenure-tab-emi" style={{ fontSize: '0.78rem' }}>₹{cardEmi.toLocaleString('en-IN')}/mo</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="offer-slider-group" style={{ marginBottom: 16 }}>
              <div className="offer-slider-header">
                <span className="offer-slider-label">Repayment Tenure</span>
                <span className="offer-slider-value" style={{ fontSize: '1.2rem' }}>
                  {tenure} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>months</span>
                </span>
              </div>
              <input
                type="range"
                className="offer-range-input"
                min={minTenure}
                max={maxTenure}
                step={loanType === 'home' ? 12 : 6}
                value={tenure}
                style={{ '--fill': `${tenureFill}%` }}
                onChange={(e) => setTenure(Number(e.target.value))}
              />
              <div className="offer-slider-bounds">
                <span>{minTenure} months</span>
                <span>{maxTenure} months</span>
              </div>
            </div>
          )}
        </div>

        {/* Rate Indicator */}
        <div className="rate-row" style={{ padding: '8px 14px', marginBottom: 12 }}>
          <span className="rate-row-label">Interest Rate Applied</span>
          <span className="rate-row-value">{interestRate}% per annum (Fixed)</span>
        </div>

        {/* EMI Summary Box */}
        <div className="emi-summary-box" style={{ padding: '14px 18px', marginBottom: 16 }}>
          <div className="emi-summary-row" style={{ marginBottom: 8 }}>
            <span className="emi-label">Monthly Instalment (EMI)</span>
            <span className="emi-value highlight" style={{ fontSize: '1.2rem' }}>₹{emi.toLocaleString('en-IN')}/month</span>
          </div>
          <div className="emi-divider" style={{ margin: '6px 0' }} />
          <div className="emi-summary-row" style={{ marginBottom: 4 }}>
            <span className="emi-label">Total Repayment Amount</span>
            <span className="emi-value" style={{ fontSize: '0.8rem' }}>₹{totalRepay.toLocaleString('en-IN')}</span>
          </div>
          <div className="emi-summary-row" style={{ marginBottom: 0 }}>
            <span className="emi-label">Total Interest Payable</span>
            <span className="emi-value" style={{ fontSize: '0.8rem' }}>₹{(totalRepay - loanAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <button
            type="button"
            className="btn-step-prev"
            onClick={() => navigate('/loan/apply/details')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 24px', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
          >
            &lt; PREVIOUS
          </button>

          <button
            type="button"
            className="btn-step-next"
            onClick={handleContinue}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1d4ed8', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(29,78,216,0.15)', transition: 'all 0.2s' }}
          >
            NEXT STEP &gt;
          </button>
        </div>
      </div>
    </LoanApplyLayout>
  );
};

export default Step2Offer;
