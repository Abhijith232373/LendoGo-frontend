import React, { useState, useEffect, useRef } from 'react';
import './ApplyLoanModal.css';

const ApplyLoanModal = ({ isOpen, onClose, onApplySuccess, initialTrustTier = 'bronze' }) => {
  if (!isOpen) return null;

  // Wizard Navigation Step
  const [step, setStep] = useState(1); // 1: Type, 2: Calculate, 3: Documents, 4: E-Sign, 5: Progress, 6: Success

  // Simulator Mode Toggle
  const [isTrustedUpgrade, setIsTrustedUpgrade] = useState(false);

  // Form selections
  const [loanType, setLoanType] = useState('micro'); // 'micro', 'home', 'vehicle'
  const [loanAmount, setLoanAmount] = useState(20000);
  const [interestRate, setInterestRate] = useState(18.5);
  const [tenure, setTenure] = useState(18); // 3, 6 months for micro; 12-60 for home/vehicle
  const [typedSignature, setTypedSignature] = useState('');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // Document states (Salary Statement, Asset Quote)
  const [uploadedFiles, setUploadedFiles] = useState({
    salarySlip: null,
    assetQuote: null,
  });

  const [uploadProgress, setUploadProgress] = useState({
    salarySlip: 0,
    assetQuote: 0,
  });

  // Credit scan animation checklist
  const [auditStep, setAuditStep] = useState(0);
  const auditLogs = [
    "Performing KYC matches on Aadhaar Database...",
    "Scanning credit score files on Central Registry...",
    "Validating secure bank ledger synchronizations...",
    "Generating loan disbursement certificates...",
    "Securing ultimate platform sanction clearances..."
  ];

  const [auditChecklist, setAuditChecklist] = useState({
    kyc: false,
    credit: false,
    bank: false,
    disburse: false,
  });

  // HTML5 E-Signature Pad Ref Coordinates
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Calculated EMI details
  const monthlyRate = interestRate / 12 / 100;
  const emiVal = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const emi = Math.round(emiVal) || 0;
  const totalRepayment = emi * tenure;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  // Personal Micro-Loan custom EMIs side-by-side
  const calculateMicroEmi = (months) => {
    const r = interestRate / 12 / 100;
    const emiCalc = (loanAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emiCalc);
  };

  // Sync amount slider limits based on type & trust toggle
  useEffect(() => {
    if (loanType === 'micro') {
      setLoanAmount(20000);
      setInterestRate(18.5);
      setTenure(18);
    } else if (loanType === 'home') {
      setLoanAmount(250000);
      setInterestRate(12.5);
      setTenure(36);
    } else if (loanType === 'vehicle') {
      setLoanAmount(80000);
      setInterestRate(15.0);
      setTenure(24);
    }
  }, [loanType]);

  // Simulated Audit Checklists triggers
  useEffect(() => {
    let timer;
    if (step === 5) {
      setAuditStep(0);
      setAuditChecklist({ kyc: false, credit: false, bank: false, disburse: false });
    }
  }, [step]);

  useEffect(() => {
    let timer;
    if (step === 5 && auditStep < auditLogs.length) {
      timer = setTimeout(() => {
        if (auditStep === 0) setAuditChecklist(prev => ({ ...prev, kyc: true }));
        if (auditStep === 1) setAuditChecklist(prev => ({ ...prev, credit: true }));
        if (auditStep === 2) setAuditChecklist(prev => ({ ...prev, bank: true }));
        if (auditStep === 3) setAuditChecklist(prev => ({ ...prev, disburse: true }));
        
        setAuditStep(prev => prev + 1);
      }, 900);
    } else if (step === 5 && auditStep === auditLogs.length) {
      timer = setTimeout(() => {
        setStep(6);
        // Trigger parent state increment callback!
        const displayedTypeName = loanType === 'micro' ? 'Personal Micro-Loan' : (loanType === 'home' ? 'Home Loan' : 'Vehicle Loan');
        onApplySuccess({
          amount: loanAmount,
          type: displayedTypeName,
          tenure: tenure,
          emi: emi,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        });
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [step, auditStep]);

  // E-Signature Pad Drawing routines
  useEffect(() => {
    if (step === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [step]);

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getEventCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getEventCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  // Mock document upload simulations
  const handleUploadFile = (field, fileName) => {
    setUploadedFiles(prev => ({ ...prev, [field]: fileName }));
    setUploadProgress(prev => ({ ...prev, [field]: 10 }));
    
    // Simulate upload progress loading
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev[field] >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [field]: prev[field] + 15 };
      });
    }, 100);
  };

  const isDocsCompleted = () => {
    if (loanType === 'micro') return true;
    if (loanType === 'home' || loanType === 'vehicle') {
      return uploadedFiles.salarySlip && uploadedFiles.assetQuote;
    }
    return false;
  };

  const isSignCompleted = () => {
    return hasDrawnSignature || typedSignature.trim().length > 2;
  };

  return (
    <div className="loan-modal-backdrop">
      <div className="loan-modal-container">
        
        {/* Close Button (Hidden on processing/success) */}
        {step < 5 && (
          <button className="loan-modal-close-btn" onClick={onClose}>✕</button>
        )}

        <div className="loan-modal-body">
          
          {/* Header Title section */}
          {step <= 4 && (
            <header className="loan-modal-header">
              <h2>LendoGo Lending Wizard</h2>
              <p>Configure borrowing values and secure approvals in under 5 minutes</p>
            </header>
          )}

          {/* Wizard step dots progress bar */}
          {step <= 4 && (
            <div className="loan-step-progress">
              <div 
                className="loan-step-bar-active" 
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
              <div className={`loan-step-dot ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>1</div>
              <div className={`loan-step-dot ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>2</div>
              <div className={`loan-step-dot ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>3</div>
              <div className={`loan-step-dot ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}`}>4</div>
            </div>
          )}

          {/* STEP 1: CHOOSE TYPE */}
          {step === 1 && (
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
          )}

          {/* STEP 2: CALCULATOR */}
          {step === 2 && (
            <div className="loan-step-pane pane-2 emi-calculator-container animate-slide-up">
              
              <div className="emi-calculator-header">
                <h3>Calculate your EMI</h3>
              </div>

              <div className="emi-calculator-grid">
                
                {/* Left Column: Sliders */}
                <div className="emi-sliders-col">
                  
                  {/* Slider 1: Loan Amount */}
                  <div className="emi-slider-card">
                    <div className="emi-slider-header">
                      <span className="emi-slider-title">Loan Amount:</span>
                      <div className="emi-input-wrapper">
                        <span className="emi-currency-symbol">₹</span>
                        <input 
                          type="number" 
                          value={loanAmount} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setLoanAmount(val);
                          }}
                          className="emi-number-input"
                        />
                      </div>
                    </div>
                    <input 
                      type="range"
                      min={loanType === 'micro' ? 5000 : (loanType === 'home' ? 50000 : 20000)}
                      max={loanType === 'micro' ? 100000 : (loanType === 'home' ? 1000000 : 500000)}
                      step={loanType === 'micro' ? 1000 : 5000}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="emi-range-slider"
                    />
                    <div className="emi-slider-ticks">
                      <span>0.0L</span>
                      <span>2L</span>
                      <span>4L</span>
                      <span>6L</span>
                      <span>8L</span>
                      <span>10L</span>
                    </div>
                  </div>

                  {/* Slider 2: Interest Rate */}
                  <div className="emi-slider-card">
                    <div className="emi-slider-header">
                      <span className="emi-slider-title">Interest Rate:</span>
                      <div className="emi-input-wrapper">
                        <span className="emi-currency-symbol">%</span>
                        <input 
                          type="number" 
                          step="0.1"
                          value={interestRate} 
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="emi-number-input"
                        />
                      </div>
                    </div>
                    <input 
                      type="range"
                      min={10}
                      max={30}
                      step={0.5}
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="emi-range-slider"
                    />
                    <div className="emi-slider-ticks">
                      <span>10%</span>
                      <span>15%</span>
                      <span>20%</span>
                      <span>25%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  {/* Slider 3: Tenure */}
                  <div className="emi-slider-card">
                    <div className="emi-slider-header">
                      <span className="emi-slider-title">Tenure:</span>
                      <div className="emi-input-wrapper">
                        <span className="emi-currency-symbol">Months</span>
                        <input 
                          type="number" 
                          value={tenure} 
                          onChange={(e) => setTenure(Number(e.target.value))}
                          className="emi-number-input narrow"
                        />
                      </div>
                    </div>
                    <input 
                      type="range"
                      min={1}
                      max={60}
                      step={1}
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="emi-range-slider"
                    />
                    <div className="emi-slider-ticks">
                      <span>1</span>
                      <span>12</span>
                      <span>24</span>
                      <span>36</span>
                      <span>48</span>
                      <span>60</span>
                    </div>
                  </div>

                </div>

                {/* Right Column: Visual Donut Chart + Table */}
                <div className="emi-visual-col">
                  
                  {/* Dynamic Conic Donut Chart */}
                  <div className="emi-chart-wrapper">
                    <div 
                      className="emi-donut-chart"
                      style={{
                        background: `conic-gradient(#10b981 0% ${100 - (totalInterest / (loanAmount + totalInterest) * 100)}%, #3b82f6 ${100 - (totalInterest / (loanAmount + totalInterest) * 100)}% 100%)`
                      }}
                    >
                      <div className="emi-donut-hole">
                        <span className="donut-center-label">Monthly EMI</span>
                        <strong className="donut-center-value">₹{emi.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="emi-chart-legend">
                      <span className="legend-item"><span className="legend-dot principal" /> Principal Amount</span>
                      <span className="legend-item"><span className="legend-dot interest" /> Total Interest</span>
                    </div>
                  </div>

                  {/* Dynamic Values Breakdown Grid */}
                  <div className="emi-details-table">
                    <div className="emi-table-row">
                      <span className="emi-row-label">Loan Amount selected</span>
                      <span className="emi-row-value font-bold text-primary">₹{loanAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="emi-table-row">
                      <span className="emi-row-label">EMI</span>
                      <span className="emi-row-value font-bold text-primary">₹{emi.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="emi-table-row">
                      <span className="emi-row-label">Total Interest</span>
                      <span className="emi-row-value font-bold text-primary">₹{totalInterest.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="emi-table-row total-highlight">
                      <span className="emi-row-label">Total Amount</span>
                      <span className="emi-row-value">₹{(loanAmount + totalInterest).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* STEP 3: DOCUMENT UPLOAD */}
          {step === 3 && (
            <div className="loan-step-pane pane-3 animate-fade-in">
              {loanType === 'micro' ? (
                /* FAST PASS FOR PERSONAL MICRO-LOAN */
                <div className="kyc-fast-pass-box">
                  <span className="fast-pass-shield">🛡️</span>
                  <h4>Instant KYC Fast-Pass Enabled!</h4>
                  <p>As a valued member, your details are auto-validated with UIDAI database credentials.</p>
                  <ul className="fast-pass-details-list">
                    <li>🟢 Aadhaar Verification Ledger: **5678 (✓ SECURED)</li>
                    <li>🟢 PAN Registry Verification: ABCDE1234F (✓ VERIFIED)</li>
                    <li>🟢 Linked Disbursal Bank: SBI ending in **4099</li>
                  </ul>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '20px', fontStyle: 'italic' }}>
                    Zero file uploads needed. Complete E-Sign to receive instant transfer.
                  </p>
                </div>
              ) : (
                /* SECURED HIGHER ASSET UPLOAD FORMS */
                <div className="document-upload-stack">
                  <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Secured Asset Document Uploads</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>High-value loans require proof of income and collateral agreements</p>
                  </div>

                  {/* Document 1: Salary Statement */}
                  <div className={`upload-card-row ${uploadedFiles.salarySlip ? 'uploaded' : ''}`}>
                    <div className="upload-icon-circle">📄</div>
                    <div className="upload-meta">
                      <h4>Income Statement / Salary Slips</h4>
                      <p>{uploadedFiles.salarySlip ? `✓ ${uploadedFiles.salarySlip}` : 'PDF format up to 5MB file size'}</p>
                    </div>
                    {uploadedFiles.salarySlip ? (
                      <span className="uploaded-tick">✓ Completed</span>
                    ) : (
                      <button className="btn-upload-browse">
                        Browse File
                        <input 
                          type="file" 
                          accept=".pdf,.png,.jpg" 
                          onChange={(e) => handleUploadFile('salarySlip', e.target.files[0]?.name || 'salary_slip.pdf')}
                          className="file-input-hidden"
                        />
                      </button>
                    )}
                    {uploadProgress.salarySlip > 0 && uploadProgress.salarySlip < 100 && (
                      <div className="upload-progress-fill" style={{ width: `${uploadProgress.salarySlip}%` }} />
                    )}
                  </div>

                  {/* Document 2: Collateral quote */}
                  <div className={`upload-card-row ${uploadedFiles.assetQuote ? 'uploaded' : ''}`}>
                    <div className="upload-icon-circle">🏠</div>
                    <div className="upload-meta">
                      <h4>{loanType === 'home' ? 'Home Registration Ledger' : 'Dealer Vehicle Invoice Quote'}</h4>
                      <p>{uploadedFiles.assetQuote ? `✓ ${uploadedFiles.assetQuote}` : 'Land registry, tax bill, or vehicle quote'}</p>
                    </div>
                    {uploadedFiles.assetQuote ? (
                      <span className="uploaded-tick">✓ Completed</span>
                    ) : (
                      <button className="btn-upload-browse">
                        Browse File
                        <input 
                          type="file" 
                          accept=".pdf,.png,.jpg" 
                          onChange={(e) => handleUploadFile('assetQuote', e.target.files[0]?.name || 'collateral_proof.pdf')}
                          className="file-input-hidden"
                        />
                      </button>
                    )}
                    {uploadProgress.assetQuote > 0 && uploadProgress.assetQuote < 100 && (
                      <div className="upload-progress-fill" style={{ width: `${uploadProgress.assetQuote}%` }} />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: REVIEW & E-SIGN */}
          {step === 4 && (
            <div className="loan-step-pane pane-4 animate-fade-in esign-prompt-section">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Sanction E-Sign Contract</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '24px' }}>Review parameters and authorize electronic bank transfer</p>

              <div className="esign-summary-card">
                <h4>Disbursal Summary Contract</h4>
                <div className="esign-summary-grid">
                  <div>
                    <span className="summary-data-lbl">Lending Product</span>
                    <strong className="summary-data-val">
                      {loanType === 'micro' ? 'Personal Micro-Loan' : (loanType === 'home' ? 'Home Loan' : 'Vehicle Loan')}
                    </strong>
                  </div>
                  <div>
                    <span className="summary-data-lbl">Sanction Capital</span>
                    <strong className="summary-data-val text-primary" style={{ color: '#60a5fa' }}>₹{loanAmount.toLocaleString('en-IN')}.00</strong>
                  </div>
                  <div>
                    <span className="summary-data-lbl">Monthly Installment (EMI)</span>
                    <strong className="summary-data-val">₹{emi.toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div>
                    <span className="summary-data-lbl">Sanction Tenure</span>
                    <strong className="summary-data-val">{tenure} Months</strong>
                  </div>
                  <div>
                    <span className="summary-data-lbl">Interest rate baseline</span>
                    <strong className="summary-data-val">{interestRate}% Fixed P.A.</strong>
                  </div>
                  <div>
                    <span className="summary-data-lbl">Linked Payout Destination</span>
                    <strong className="summary-data-val payout">SBI (**4099)</strong>
                  </div>
                </div>
              </div>

              {/* Signature input methods */}
              <div className="esign-box-wrapper">
                <div className="esign-box-header">
                  <span>DRAW HANDWRITTEN SIGNATURE</span>
                  {hasDrawnSignature && (
                    <button className="btn-clear-esign" onClick={clearSignature}>Wipe signature</button>
                  )}
                </div>
                <canvas 
                  ref={canvasRef}
                  width={600}
                  height={120}
                  className="esign-canvas-element"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>

              <div style={{ margin: '16px 0', fontSize: '0.8rem', color: '#6b7280' }}>— OR TYPE CLEARANCE KEY TO E-SIGN —</div>

              <input 
                type="text" 
                placeholder="Type your full legal name to authorize (e.g. Rahul Sharma)" 
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                className="esign-typed-input"
                style={{ textAlign: 'center', fontFamily: typedSignature.trim().length > 0 ? "'Alex Brush', 'Dancing Script', cursive, italic" : 'inherit', fontSize: typedSignature.trim().length > 0 ? '1.4rem' : '0.95rem' }}
              />
            </div>
          )}

          {/* STEP 5: SIMULATED AUDITING PROGRESS */}
          {step === 5 && (
            <div className="loan-step-pane pane-5 animate-fade-in audit-timeline-container">
              <div className="audit-circular-spinner">
                <div className="audit-spinner-outer" />
                <div className="audit-spinner-shield">🛡️</div>
              </div>

              <div className="audit-ticker-status">
                <h3>Evaluating Credit Standing</h3>
                <p className="animate-pulse">
                  {auditLogs[Math.min(auditStep, auditLogs.length - 1)]}
                </p>
              </div>

              <div className="audit-checkboxes-stack">
                <div className={`audit-checkbox-item ${auditChecklist.kyc ? 'checked' : ''}`}>
                  <span className="checkbox-circle">{auditChecklist.kyc ? '✓' : ''}</span>
                  <span>Biometric KYC Registry match check</span>
                </div>
                <div className={`audit-checkbox-item ${auditChecklist.credit ? 'checked' : ''}`}>
                  <span className="checkbox-circle">{auditChecklist.credit ? '✓' : ''}</span>
                  <span>Financial risk limits evaluation scan</span>
                </div>
                <div className={`audit-checkbox-item ${auditChecklist.bank ? 'checked' : ''}`}>
                  <span className="checkbox-circle">{auditChecklist.bank ? '✓' : ''}</span>
                  <span>Linking direct payout bank credentials</span>
                </div>
                <div className={`audit-checkbox-item ${auditChecklist.disburse ? 'checked' : ''}`}>
                  <span className="checkbox-circle">{auditChecklist.disburse ? '✓' : ''}</span>
                  <span>Registering block transaction details ledger</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS */}
          {step === 6 && (
            <div className="loan-step-pane pane-6 animate-fade-in success-screen-wrapper">
              <div className="success-badge-blast">
                <span>✓</span>
              </div>
              <h2>Sanction Capital Approved!</h2>
              <p>
                Congratulations! Your LendoGo loan request of <strong>₹{loanAmount.toLocaleString('en-IN')}</strong> has been approved. The payout transfer to <strong>SBI account (**4099)</strong> will complete inside 24 hours.
              </p>

              <div className="success-recap-box" style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '20px', borderRadius: '20px', maxWidth: '400px', margin: '0 auto 30px auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#9ca3af' }}>Monthly EMI Installment:</span>
                  <strong style={{ color: '#34d399' }}>₹{emi.toLocaleString('en-IN')}/mo</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#9ca3af' }}>Tenure Selection:</span>
                  <strong>{tenure} Months</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#9ca3af' }}>Interest locked rate:</span>
                  <strong>{interestRate}% Fixed</strong>
                </div>
              </div>

              <button className="btn-loan-modal btn-finish" onClick={onClose}>
                Return to Dashboard
              </button>
            </div>
          )}

        </div>

        {/* BOTTOM ACTION BUTTON FOOTER */}
        {step <= 4 && (
          <footer className="loan-modal-actions-footer">
            {step > 1 && (
              <button 
                className="btn-loan-modal btn-back"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </button>
            )}
            
            <button 
              className="btn-loan-modal btn-next"
              disabled={(step === 3 && !isDocsCompleted()) || (step === 4 && !isSignCompleted())}
              onClick={() => {
                if (step === 4) {
                  setStep(5);
                } else {
                  setStep(step + 1);
                }
              }}
            >
              {step === 4 ? 'E-Sign & Request Payout' : 'Continue'}
            </button>
          </footer>
        )}

      </div>
    </div>
  );
};

export default ApplyLoanModal;
