import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';

const TERMS_TEXT = `
LENDOGO LENDING PLATFORM TERMS & CONDITIONS

Effective Date: January 1, 2026
Lending Partner: Registered NBFCs under RBI Guidelines

1. SCOPE OF SERVICES
LendoGo is a digital lending facilitation platform operated to connect qualified applicants with registered Non-Banking Financial Companies (NBFCs) and institutional lenders. By submitting this application, you authorize LendoGo to share your credentials with authorized partner NBFCs for credit score retrieval and loan underwriting purposes.

2. LOAN TERMS & INTEREST CHARGES
Interest rates are determined dynamically based on the credit appraisal matrix. Fixed interest rates range from 8.5% to 18% per annum. An upfront administrative processing fee of up to 2% may be deducted from the sanctioned disbursement amount. Loan repayment periods are structured under fixed monthly EMI installments as authorized.

3. PAYMENT AND AUTODEBIT NACH MANDATE
By checking the agreement box below, you explicitly grant consent for registering a National Automated Clearing House (NACH) auto-debit mandate on your linked bank account. EMIs will be automatically debited on the designated monthly due date. Failed auto-debit transactions due to insufficient funds will incur standard bounce charges of ₹500 per attempt.

4. CREDIT BUREAU DISCLOSURE
LendoGo and its lending partners are legally mandated to report all repayment behaviors, including delays, defaults, and prepayments, to registered Credit Information Companies (CIBIL, Experian, Equifax, CRIF High Mark) in compliance with the Credit Information Companies Regulation Act.

5. GRIEVANCE REDRESSAL MECHANISM
In case of any discrepancies, disputes, or grievances related to disbursement, interest calculations, or collections, please contact our dedicated LendoGo Grievance Cell at support@lendogo.com. Standard response time is 48 working hours.

--------------------------------------------------
LENDOGO DATA PRIVACY POLICY & UIDAI DISCLOSURE

1. DATA COLLECTION AND ENCRYPTION
LendoGo is committed to protecting your personal information. All uploaded documents (Aadhaar, PAN, Live Selfie, Property Slips, Income Proofs) are immediately encrypted using AES-256 protocols before being stored on secure ISO 27001 certified LendoGo servers based within Indian territories. LendoGo never sells, rents, or shares your personal details with third-party marketing agencies.

2. UIDAI AADHAAR CONSENT AND KYC
By uploading your Aadhaar front and back documents, you grant LendoGo the permission to verify your identity credentials via secure UIDAI offline verification modules. This data is used solely to confirm your address, legal name, and date of birth in accordance with Prevention of Money Laundering (PML) Rules.
`;

const Step4Terms = () => {
  const navigate  = useNavigate();
  const canvasRef = useRef(null);
  const {
    completedSteps,
    termsAccepted, setTermsAccepted,
    signature, setSignature,
    hasDrawnSignature, setHasDrawnSignature,
    markStepComplete,
  } = useLoanApplication();

  useEffect(() => {
    if (!completedSteps.step3) navigate('/loan/apply/kyc');
  }, []);

  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const handleTermsScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolledToBottom(true);
    }
  };

  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches?.[0]) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoords(e);
    canvasRef.current.getContext('2d').beginPath();
    canvasRef.current.getContext('2d').moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  const canContinue = termsAccepted && (hasDrawnSignature || signature.trim().length > 2);

  const handleContinue = () => {
    markStepComplete('step4');
    navigate('/loan/apply/disbursal');
  };

  const PaperOutlineIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );

  return (
    <LoanApplyLayout>
      <div className="loan-step-card compact-card shadow-sm">
        {/* Step Title Row */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <PaperOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            4. Agreement Setup
          </h2>
        </div>

        {/* Scrollable Box */}
        <div className="terms-scroll-box" onScroll={handleTermsScroll} style={{ height: '140px', padding: '12px 16px', fontSize: '0.78rem', marginBottom: '8px' }}>
          {TERMS_TEXT.trim().split('\n\n').map((para, i) => {
            const isHeading = /^[A-Z0-9\s.-]+$/.test(para.trim());
            return isHeading
              ? <h4 key={i} style={{ fontSize: '0.8rem', fontWeight: 800, margin: '10px 0 4px', color: '#0f172a' }}>{para.trim()}</h4>
              : <p key={i} style={{ margin: '0 0 6px', color: '#475569', lineHeight: '1.5' }}>{para.trim()}</p>;
          })}
        </div>

        {!scrolledToBottom && (
          <p className="terms-must-scroll-note" style={{ fontSize: '0.7rem', margin: '0 0 8px', color: '#d97706' }}>
            * Please scroll to the bottom of the agreement window to activate the checkbox.
          </p>
        )}

        {/* Agree Checkbox */}
        <label className="terms-checkbox-row" style={{ gap: '8px', marginBottom: '12px', fontSize: '0.78rem' }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            disabled={!scrolledToBottom}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{ width: '16px', height: '16px' }}
          />
          <span>
            I agree to the LendoGo Terms & Conditions, UIDAI Aadhaar consent, and data encryption policies.
          </span>
        </label>

        {/* E-Sign Pad */}
        <div className="esign-canvas-row" style={{ marginBottom: '4px' }}>
          <span className="esign-section-title" style={{ fontSize: '0.72rem' }}>Draw secure signature</span>
          {hasDrawnSignature && (
            <button type="button" className="btn-clear-sign" onClick={clearCanvas} style={{ fontSize: '0.7rem' }}>Clear Signature</button>
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={560}
          height={64}
          className="esign-canvas"
          style={{ height: '64px', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: '#fafbff' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={() => setIsDrawing(false)}
          onMouseLeave={() => setIsDrawing(false)}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={() => setIsDrawing(false)}
        />

        <div className="or-divider" style={{ margin: '8px 0', fontSize: '0.64rem' }}>OR ENTER LEGAL NAME TO E-SIGN</div>

        <input
          type="text"
          className="typed-sign-input"
          placeholder="e.g. Rahul Sharma"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          style={{ height: '40px', padding: '8px 12px', fontSize: '0.88rem' }}
        />

        {/* Action Bar */}
        <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '20px' }}>
          <button
            type="button"
            className="btn-step-prev"
            onClick={() => navigate('/loan/apply/kyc')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 24px', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
          >
            &lt; PREVIOUS
          </button>

          <button
            type="button"
            className="btn-step-next"
            disabled={!canContinue}
            onClick={handleContinue}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: canContinue ? '#1d4ed8' : '#e2e8f0', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '0.82rem', fontWeight: 700, color: canContinue ? '#ffffff' : '#94a3b8', cursor: canContinue ? 'pointer' : 'not-allowed', boxShadow: canContinue ? '0 4px 12px rgba(29,78,216,0.15)' : 'none', transition: 'all 0.2s' }}
          >
            SUBMIT &gt;
          </button>
        </div>
      </div>
    </LoanApplyLayout>
  );
};

export default Step4Terms;
