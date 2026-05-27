import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';

const LOW_TRACK_PRODUCTS = [
  { id: 'instant',         label: 'Instant Personal Loan' },
  { id: 'credit-builder',  label: 'Credit Builder Loan' },
];

const HIGH_TRACK_PRODUCTS = [
  { id: 'personal',        label: 'Personal Loan' },
  { id: 'business',        label: 'Business Loan' },
  { id: 'home',            label: 'Home Loan' },
  { id: 'marriage',        label: 'Marriage Loan' },
  { id: 'bike-mobile',     label: 'Bike & Mobile Loan' },
];

const LOAN_CONFIGS = {
  instant:         { min: 1000, max: 3000, step: 100, minTenure: 3, maxTenure: 6, defaultAmount: 2500, defaultTenure: 3 },
  'credit-builder':{ min: 1000, max: 3000, step: 100, minTenure: 3, maxTenure: 6, defaultAmount: 2500, defaultTenure: 3 },
  personal:        { min: 10000, max: 1500000, step: 10000, minTenure: 24, maxTenure: 24, defaultAmount: 50000, defaultTenure: 24 },
  business:        { min: 10000, max: 1500000, step: 10000, minTenure: 24, maxTenure: 24, defaultAmount: 100000, defaultTenure: 24 },
  home:            { min: 10000, max: 1500000, step: 10000, minTenure: 24, maxTenure: 24, defaultAmount: 500000, defaultTenure: 24 },
  marriage:        { min: 10000, max: 1500000, step: 10000, minTenure: 24, maxTenure: 24, defaultAmount: 150000, defaultTenure: 24 },
  'bike-mobile':   { min: 10000, max: 1500000, step: 10000, minTenure: 24, maxTenure: 24, defaultAmount: 50000, defaultTenure: 24 },
};

// Discrete amounts for the Micro-Credit low track
const DISCRETE_LOW_AMOUNTS = [1000, 1500, 2000, 2500, 3000];

const Step2Offer = () => {
  const navigate = useNavigate();
  const {
    loanType, setLoanType, setLoanTypeLabel, completedSteps,
    loanAmount, setLoanAmount,
    tenure, setTenure,
    interestRate, calcEmi, markStepComplete,
  } = useLoanApplication();

  const isLowTrack = loanType === 'instant' || loanType === 'credit-builder';
  const activeTrack = isLowTrack ? 'low' : 'high';

  useEffect(() => {
    if (!completedSteps.step1) {
      navigate('/loan/apply/details');
      return;
    }
    // Initialize default loan option if not set
    if (!loanType || !LOAN_CONFIGS[loanType]) {
      setLoanType('instant');
      setLoanTypeLabel('Instant Personal Loan');
      setLoanAmount(2500);
      setTenure(3);
    }
  }, []);

  const cfg = LOAN_CONFIGS[loanType] || LOAN_CONFIGS['instant'];
  const { min, max, step } = cfg;

  // Real-Time Calculations depending on low vs high track
  let processingFee = 0;
  let disbursedAmount = 0;
  let interestPayable = 0;
  let totalRepay = 0;
  let emi = 0;
  let flatInterestPct = 0;

  if (activeTrack === 'low') {
    // Micro-Credit Track: Flat ₹200 fee, flat 8% or 16% interest
    processingFee   = 200;
    disbursedAmount = Math.max(0, loanAmount - processingFee);
    flatInterestPct = tenure === 3 ? 0.08 : 0.16;
    interestPayable = Math.round(loanAmount * flatInterestPct);
    totalRepay      = loanAmount + interestPayable;
    emi             = Math.round(totalRepay / tenure);
  } else {
    // Elite Funding Track: 1% processing fee, standard reducing interest
    processingFee   = Math.round(loanAmount * 0.01);
    disbursedAmount = Math.max(0, loanAmount - processingFee);
    emi             = calcEmi(loanAmount, tenure, interestRate);
    totalRepay      = emi * tenure;
    interestPayable = Math.max(0, totalRepay - loanAmount);
  }

  const fillPct = Math.max(0, Math.min(100, ((loanAmount - min) / (max - min)) * 100));

  const handleTrackChange = (targetTrack) => {
    if (targetTrack === 'low') {
      setLoanType('instant');
      setLoanTypeLabel('Instant Personal Loan');
      setLoanAmount(2500);
      setTenure(3);
    } else {
      setLoanType('personal');
      setLoanTypeLabel('Personal Loan');
      setLoanAmount(50000);
      setTenure(24);
    }
  };

  const handleProductChange = (prod) => {
    setLoanType(prod.id);
    setLoanTypeLabel(prod.label);
    const targetConfig = LOAN_CONFIGS[prod.id] || LOAN_CONFIGS['instant'];
    setLoanAmount(targetConfig.defaultAmount);
    setTenure(targetConfig.defaultTenure);
  };

  const handleContinue = () => {
    markStepComplete('step2');
    navigate('/loan/apply/kyc');
  };

  const getDueDate = (monthsAhead) => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsAhead);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const BriefcaseOutlineIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#475569' }}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );

  return (
    <LoanApplyLayout>
      <div className="loan-step-card compact-card shadow-sm" style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: "'Outfit', sans-serif" }}>
        {/* Compact Header */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <BriefcaseOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            2. Loan Configuration
          </h2>
        </div>

        {/* Zero-Scroll Two Column Layout Split */}
        <div style={{ display: 'flex', gap: '24px', flexDirection: 'row', alignItems: 'stretch' }}>
          
          {/* Left Column: Input Selection */}
          <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Dual-Track Selection */}
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>Select Loan Track</span>
              <div className="dual-track-selector" style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`track-btn ${activeTrack === 'low' ? 'active' : ''}`}
                  onClick={() => handleTrackChange('low')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: activeTrack === 'low' ? '2px solid #1e293b' : '1.5px solid #cbd5e1',
                    background: activeTrack === 'low' ? '#f1f5f9' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.78rem', color: '#1e293b' }}>⚡ Micro-Credit Hub</strong>
                  <span style={{ fontSize: '0.62rem', color: '#64748b' }}>Up to ₹3,000 • 4-Doc KYC</span>
                </button>

                <button
                  type="button"
                  className={`track-btn ${activeTrack === 'high' ? 'active' : ''}`}
                  onClick={() => handleTrackChange('high')}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: activeTrack === 'high' ? '2px solid #1e293b' : '1.5px solid #cbd5e1',
                    background: activeTrack === 'high' ? '#f1f5f9' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.78rem', color: '#1e293b' }}>💼 Elite Asset Funding</strong>
                  <span style={{ fontSize: '0.62rem', color: '#64748b' }}>₹10,000 - ₹15 Lakhs • 7-Doc KYC</span>
                </button>
              </div>
            </div>

            {/* Product Pill Selection */}
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>Select Product Category</span>
              <div className="loan-product-selector" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                {(activeTrack === 'low' ? LOW_TRACK_PRODUCTS : HIGH_TRACK_PRODUCTS).map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleProductChange(prod)}
                    style={{
                      padding: '5px 10px',
                      background: loanType === prod.id ? '#1e293b' : '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderColor: loanType === prod.id ? '#1e293b' : '#cbd5e1',
                      color: loanType === prod.id ? '#ffffff' : '#475569',
                      borderRadius: '16px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {prod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Principal Amount</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 850, color: '#1e293b' }}>₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>

              {activeTrack === 'low' ? (
                /* Discrete pills selection for Micro-Credit track */
                <div style={{ display: 'flex', gap: '6px' }}>
                  {DISCRETE_LOW_AMOUNTS.map((amt) => {
                    const isSelected = loanAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setLoanAmount(amt)}
                        style={{
                          flex: 1,
                          padding: '8px 0',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #1e293b' : '1.5px solid #cbd5e1',
                          background: isSelected ? '#1e293b' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Compact slider for elite loans */
                <div style={{ marginTop: '2px' }}>
                  <input
                    type="range"
                    className="offer-range-input"
                    min={min}
                    max={max}
                    step={step}
                    value={loanAmount}
                    style={{ '--fill': `${fillPct}%` }}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                  <div className="offer-slider-bounds" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                    <span>₹10,000</span>
                    <span>₹15,00,000</span>
                  </div>
                </div>
              )}
            </div>

            {/* Repayment Tenure selection */}
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '6px' }}>Repayment Tenure</span>
              {activeTrack === 'low' ? (
                <div className="tenure-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[3, 6].map((m) => {
                    const tempInterest = Math.round(loanAmount * (m === 3 ? 0.08 : 0.16));
                    const tempEmi = Math.round((loanAmount + tempInterest) / m);
                    const isActive = tenure === m;
                    return (
                      <div
                        key={m}
                        className={`tenure-tab ${isActive ? 'active' : ''}`}
                        onClick={() => setTenure(m)}
                        style={{
                          border: isActive ? '2px solid #1e293b' : '1.5px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: isActive ? '#f8fafc' : '#ffffff',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span className="tenure-tab-months" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '2px' }}>{m} Months</span>
                        <span className="tenure-tab-emi" style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>₹{tempEmi.toLocaleString('en-IN')}/mo</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Fixed 24 Months Tenure box for Elite Funding Track */
                <div
                  style={{
                    border: '2px solid #1e293b',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 850, color: '#1e293b' }}>24 Months (Fixed Elite Tenure)</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>🔒 Standard premium tenure optimized for asset funding</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Statement, Timeline & Actions */}
          <div style={{ flex: 1, borderLeft: '1.5px dashed #e2e8f0', paddingLeft: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              {/* Dynamic Billing Dashboard Summary */}
              <div className="emi-summary-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deducted Fee</span>
                    <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginTop: '2px' }}>₹{processingFee.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>In-Hand</span>
                    <strong style={{ display: 'block', fontSize: '0.92rem', fontWeight: 850, color: '#10b981', marginTop: '2px' }}>₹{disbursedAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interest Fee</span>
                    <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>₹{interestPayable.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Repayment</span>
                    <strong style={{ display: 'block', fontSize: '1.15rem', fontWeight: 850, color: '#1e293b' }}>₹{Math.round(totalRepay).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMI INSTALMENT</span>
                    <strong style={{ display: 'block', fontSize: '1.15rem', fontWeight: 850, color: '#1e293b' }}>₹{emi.toLocaleString('en-IN')}/mo</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic Dues Receipts Calendar Schedule Timeline */}
              <div className="dues-timeline-container" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px', display: 'block' }}>Dues & Repayment Schedule</span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Array.from({ length: Math.min(3, tenure) }).map((_, i) => {
                    const installmentNum = i + 1;
                    const dueDate = getDueDate(installmentNum);
                    const principalPortion = Math.round(loanAmount / tenure);
                    const interestPortion = Math.round(interestPayable / tenure);

                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#ffffff',
                          border: '1.5px solid #f1f5f9',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.72rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 850, color: '#1e293b' }}>#{installmentNum}</span>
                          <div>
                            <strong style={{ display: 'block', color: '#1e293b' }}>₹{emi.toLocaleString('en-IN')}</strong>
                            <span style={{ fontSize: '0.62rem', color: '#64748b' }}>{dueDate}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.64rem', color: '#64748b' }}>
                          <div>
                            <span>P: </span>
                            <strong style={{ color: '#1e293b' }}>₹{principalPortion.toLocaleString('en-IN')}</strong>
                          </div>
                          <div>
                            <span>I: </span>
                            <strong style={{ color: '#1e293b' }}>₹{interestPortion.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>

                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          background: '#fffbeb',
                          border: '1px solid #fef3c7',
                          borderRadius: '4px',
                          padding: '1px 5px',
                          fontSize: '0.58rem',
                          fontWeight: 800,
                          color: '#b45309'
                        }}>
                          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#d97706' }} />
                          PENDING
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
              <button
                type="button"
                className="btn-step-prev"
                onClick={() => navigate('/loan/apply/details')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 16px', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
              >
                &lt; PREVIOUS
              </button>

              <button
                type="button"
                className="btn-step-next"
                onClick={handleContinue}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#1e293b', border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                NEXT STEP &gt;
              </button>
            </div>

          </div>

        </div>
      </div>
    </LoanApplyLayout>
  );
};

export default Step2Offer;
