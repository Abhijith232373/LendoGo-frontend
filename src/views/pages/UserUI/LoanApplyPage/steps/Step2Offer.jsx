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

// Discrete amounts for the Elite Asset Funding high track (50k, 1L, 5L, 10L, 15L)
const DISCRETE_HIGH_AMOUNTS = [50000, 100000, 500000, 1000000, 1500000];

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

  // Automatically snap loanAmount when activeTrack changes or on load to guarantee valid track ranges
  useEffect(() => {
    if (activeTrack === 'high' && loanAmount < 10000) {
      setLoanAmount(50000);
    } else if (activeTrack === 'low' && loanAmount > 3000) {
      setLoanAmount(2500);
    }
  }, [activeTrack, loanAmount]);

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
      <div className="loan-step-card compact-card shadow-sm" style={{ width: '100%', maxWidth: '1120px', minHeight: '515px', margin: '0 auto', fontFamily: "'Outfit', sans-serif" }}>
        {/* Flat Header Matching Step 1 */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
          <BriefcaseOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            2. Loan Configuration
          </h2>
        </div>

        {/* Zero-Scroll Two Column Layout Split with Generous Breathing Room */}
        <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', alignItems: 'stretch' }}>
          
          {/* Left Column: Input Selection */}
          <div style={{ flex: 1.25, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Dual-Track Selection */}
            <div>
              <label className="form-label-flat" style={{ marginBottom: '6px' }}>SELECT LOAN TRACK</label>
              <div className="dual-track-selector" style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className={`track-btn ${activeTrack === 'low' ? 'active' : ''}`}
                  onClick={() => handleTrackChange('low')}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: activeTrack === 'low' ? '2.5px solid #0f172a' : '1.5px solid #e2e8f0',
                    background: activeTrack === 'low' ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: activeTrack === 'low' ? '0 4px 16px rgba(15,23,42,0.05)' : 'none'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: activeTrack === 'low' ? '#0f172a' : '#1e293b', fontWeight: 800 }}>Micro-Credit Hub</strong>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block', marginTop: '2px' }}>Up to ₹3,000 • 4-Doc KYC</span>
                </button>

                <button
                  type="button"
                  className={`track-btn ${activeTrack === 'high' ? 'active' : ''}`}
                  onClick={() => handleTrackChange('high')}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: activeTrack === 'high' ? '2.5px solid #0f172a' : '1.5px solid #e2e8f0',
                    background: activeTrack === 'high' ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    boxShadow: activeTrack === 'high' ? '0 4px 16px rgba(15,23,42,0.05)' : 'none'
                  }}
                >
                  <strong style={{ display: 'block', fontSize: '0.92rem', color: activeTrack === 'high' ? '#0f172a' : '#1e293b', fontWeight: 800 }}>Elite Asset Funding</strong>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block', marginTop: '2px' }}>₹10,000 - ₹15 Lakhs • 7-Doc KYC</span>
                </button>
              </div>
            </div>

            {/* Product Category Selection */}
            <div>
              <label className="form-label-flat" style={{ marginBottom: '6px' }}>SELECT PRODUCT CATEGORY</label>
              <div className="loan-product-selector" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {(activeTrack === 'low' ? LOW_TRACK_PRODUCTS : HIGH_TRACK_PRODUCTS).map((prod) => {
                  const isActive = loanType === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleProductChange(prod)}
                      style={{
                        padding: '6px 14px',
                        background: isActive ? '#0f172a' : '#ffffff',
                        border: isActive ? '1.5px solid #0f172a' : '1.5px solid #e2e8f0',
                        color: isActive ? '#ffffff' : '#475569',
                        borderRadius: '24px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        whiteSpace: 'nowrap',
                        boxShadow: isActive ? '0 4px 12px rgba(15,23,42,0.12)' : 'none'
                      }}
                    >
                      {prod.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label-flat" style={{ margin: 0 }}>PRINCIPAL AMOUNT</label>
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>

              {activeTrack === 'low' ? (
                /* Discrete pills selection for Micro-Credit track */
                <div style={{ display: 'flex', gap: '8px' }}>
                  {DISCRETE_LOW_AMOUNTS.map((amt) => {
                    const isSelected = loanAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setLoanAmount(amt)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #0f172a' : '1.5px solid #e2e8f0',
                          background: isSelected ? '#0f172a' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          fontSize: '0.88rem',
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
                /* 5 Discrete selector buttons for Elite Asset Funding as requested by the user */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '2px' }}>
                  {DISCRETE_HIGH_AMOUNTS.map((amt) => {
                    const isSelected = loanAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setLoanAmount(amt)}
                        style={{
                          padding: '10px 0',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #0f172a' : '1.5px solid #e2e8f0',
                          background: isSelected ? '#0f172a' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#475569',
                          fontSize: '0.84rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {amt === 50000 ? '₹50k' : amt === 100000 ? '₹1 Lakh' : amt === 500000 ? '₹5 Lakhs' : amt === 1000000 ? '₹10 Lakhs' : '₹15 Lakhs'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Repayment Tenure selection */}
            <div>
              <label className="form-label-flat" style={{ marginBottom: '6px' }}>REPAYMENT TENURE</label>
              {activeTrack === 'low' ? (
                <div className="tenure-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 0 }}>
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
                          border: isActive ? '2px solid #0f172a' : '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '8px 12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: isActive ? '#f8fafc' : '#ffffff',
                          transition: 'all 0.15s',
                          boxShadow: isActive ? '0 4px 12px rgba(15,23,42,0.04)' : 'none'
                        }}
                      >
                        <span className="tenure-tab-months" style={{ display: 'block', fontSize: '0.94rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: isActive ? '#0f172a' : '#1e293b', marginBottom: '1px' }}>{m} Months</span>
                        <span className="tenure-tab-emi" style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? '#475569' : '#64748b' }}>₹{tempEmi.toLocaleString('en-IN')}/mo</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Manual Tenure Selection 6 / 12 / 18 / 24 Months for High Track styled with premium neutrals */
                <div className="tenure-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 0 }}>
                  {[6, 12, 18, 24].map((m) => {
                    const tempEmi = calcEmi(loanAmount, m, interestRate);
                    const isActive = tenure === m;
                    return (
                      <div
                        key={m}
                        className={`tenure-tab ${isActive ? 'active' : ''}`}
                        onClick={() => setTenure(m)}
                        style={{
                          border: isActive ? '2px solid #0f172a' : '1.5px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '8px 12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: isActive ? '#f8fafc' : '#ffffff',
                          transition: 'all 0.15s',
                          boxShadow: isActive ? '0 4px 12px rgba(15,23,42,0.04)' : 'none'
                        }}
                      >
                        <span className="tenure-tab-months" style={{ display: 'block', fontSize: '0.94rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: isActive ? '#0f172a' : '#1e293b', marginBottom: '1px' }}>{m} Months</span>
                        <span className="tenure-tab-emi" style={{ fontSize: '0.8rem', fontWeight: 700, color: isActive ? '#475569' : '#64748b' }}>₹{tempEmi.toLocaleString('en-IN')}/mo</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Statement, Timeline & Actions */}
          <div style={{ flex: 1.0, borderLeft: '1.5px dashed #e2e8f0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              {/* Dynamic Billing Dashboard Summary */}
              <div className="emi-summary-box" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '10px 16px', marginBottom: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '10px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Deducted Fee</span>
                    <strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#475569', marginTop: '2px' }}>₹{processingFee.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>In-Hand</span>
                    <strong style={{ display: 'block', fontSize: '0.98rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>₹{disbursedAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Interest Fee</span>
                    <strong style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>₹{interestPayable.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Repayment</span>
                    <strong style={{ display: 'block', fontSize: '1.3rem', fontWeight: 900, color: '#1e293b' }}>₹{Math.round(totalRepay).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>EMI INSTALMENT</span>
                    <strong style={{ display: 'block', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>₹{emi.toLocaleString('en-IN')}/mo</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic Dues Receipts Calendar Schedule Timeline */}
              <div className="dues-timeline-container" style={{ marginBottom: '10px' }}>
                <label className="form-label-flat" style={{ marginBottom: '6px' }}>DUES & REPAYMENT SCHEDULE</label>

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
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '0.74rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 900, color: '#1e293b', fontSize: '0.78rem' }}>#{installmentNum}</span>
                          <div>
                            <strong style={{ display: 'block', color: '#1e293b', fontSize: '0.8rem' }}>₹{emi.toLocaleString('en-IN')}</strong>
                            <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 600 }}>{dueDate}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
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
                          gap: '4px',
                          background: '#fffbeb',
                          border: '1px solid #fef3c7',
                          borderRadius: '6px',
                          padding: '2px 6px',
                          fontSize: '0.64rem',
                          fontWeight: 800,
                          color: '#b45309'
                        }}>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#d97706' }} />
                          PENDING
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Premium Action Buttons Matching Step 1 Sizing */}
            <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn-step-prev"
                onClick={() => navigate('/loan/apply/details')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                &lt; PREVIOUS
              </button>

              <button
                type="button"
                className="btn-step-next"
                onClick={handleContinue}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#0f172a', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.15)', transition: 'all 0.2s' }}
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
