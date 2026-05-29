import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';
import { apiClient } from '../../../../../utils/apiClient';

const TERMS_TEXT = `
LENDOGO FINANCIAL SERVICES & DIGITAL LOAN AGREEMENT

Lending Partners: RBI-Registered Non-Banking Financial Companies (NBFCs)
Authorized Platform Operator: LendoGo Capital Facilitation Suite
Effective Date: January 1, 2026

1. SCOPE OF FACILITATION & DIGITAL CONSENT
LendoGo is an authorized digital lending platform that connects qualified applicants with registered Non-Banking Financial Companies (NBFCs). By checking the confirmation box below, you explicitly grant consent to LendoGo and its partnering financial institutions to retrieve your credit bureau scores (including CIBIL, Experian, Equifax) and verify your KYC credentials through secure government databases.

2. LOAN PRICING, INTEREST STRUCTURE, AND PROCESSING FEES
a) NOMINAL INTEREST RATES: Fixed annual interest rates are calculated dynamically based on individual credit appraisal matrices, ranging strictly from 8.5% to 18% per annum (APR).
b) ONE-TIME PROCESSING FEE: An upfront administrative processing and documentation fee of up to 2% of the sanctioned loan amount (subject to applicable taxes/GST) is deducted directly from the sanctioned principal before disbursement to your bank account.
c) PREPAYMENT FORECLOSURE: No hidden foreclosure or prepayment penalties will be levied if you choose to prepay your active credit balance.

3. THE ADVANTAGES OF EARLY OR ON-TIME REPAYMENT (GOOD PRACTICE)
Repaying your monthly installments strictly BEFORE or ON the scheduled due date is highly beneficial to your financial profile:
- CIBIL SCORE AMPLIFICATION: Prompt repayment acts as a primary positive credit history builder, significantly boosting your CIBIL and Experian credit ratings.
- ELEVATED FUTURE CREDIT LINES: Users with zero delayed payments are automatically upgraded to higher loan categories, unlocking instant credit limits of up to ₹15 Lakhs.
- FAST-TRACKED AUTOMATED APPROVALS: Future applications will bypass manual verification queues, securing instant disbursement in under 5 minutes.
- LOWER PROMOTIONAL INTEREST RATES: Building a strong loyalty history unlocks exclusive low-interest promotional offers on subsequent borrowing cycles.

4. SEVERE FINANCIAL & LEGAL CONSEQUENCES OF LATE PAYMENTS AND DEFAULT
Failing to settle your dues on or before the due date constitutes a material breach of this agreement. The consequences are highly severe:
a) SEVERE CREDIT SCORE DAMAGE (CIBIL RUINATION): LendoGo and its partners are legally bound to report all default behaviors to all registered credit bureaus (CIBIL, Experian, Equifax, CRIF). A single late payment or auto-debit failure will severely damage your credit profile (credit score will lose). This will completely block you from acquiring home loans, education loans, vehicle financing, or commercial credit cards from any bank or financial institution in India.
b) COMPOUND DUE INCREMENTATION (PENALTY ACCRUAL): Any outstanding balance past the due date will immediately and automatically increment on a daily compounding basis. Default interest rates of up to 36% per annum will be applied to the unpaid principal, alongside flat collection penalty fees and administrative overdue charges.
c) IMMEDIATE ACCOUNT SUSPENSION & REPEAT ISSUES: If an auto-debit bounces or a payment is delayed, LendoGo will flag your account. Repeating the issue (failing multiple EMI cycles) will lead to immediate, permanent freezing and suspension of your LendoGo account, preventing any future borrowing.
d) SYSTEMIC BLACKLISTING & LEGAL ACTION: Persistent delays or failure to resolve pending dues will result in your details being added to a national defaulter blacklist. Partner NBFCs reserve the right to initiate institutional debt recovery proceedings and legal action under Section 138 of the Negotiable Instruments Act.

5. NATIONAL AUTO-DEBIT (NACH/ECS) MANDATE & DEBIT BOUNCING
By confirming this agreement, you authorize LendoGo and its lending partners to register a secure National Automated Clearing House (NACH) auto-debit mandate on your linked salary or savings account. Monthly EMIs will be debited automatically. If a debit attempt fails due to "Insufficient Funds" or "Account Blocked," your linked bank will charge standard bounce fees, and LendoGo will levy an administrative failed-debit fee of ₹500 per attempt.
`;

const Step4Terms = () => {
  const navigate = useNavigate();
  const {
    completedSteps,
    termsAccepted, setTermsAccepted,
    markStepComplete,
    fullName, dob, email, phone, city, stateName, pincode,
    loanAmount, tenure,
    aadhaarFront, aadhaarBack, panCard, liveSelfie, incomeProof, employmentType, monthlyIncome,
    loanType,
  } = useLoanApplication();

  useEffect(() => {
    if (!completedSteps.step3) navigate('/loan/apply/kyc');
  }, []);

  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTermsScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setScrolledToBottom(true);
    }
  };

  const canContinue = termsAccepted && scrolledToBottom;

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();

      // Append text parameters
      formData.append('principal_amount', String(loanAmount));
      formData.append('tenure_months', String(tenure));
      formData.append('monthly_income', String(monthlyIncome || ''));
      formData.append('full_name', fullName);
      formData.append('dob', dob);
      formData.append('email', email);
      formData.append('mobile_number', phone);
      formData.append('city', city);
      formData.append('state', stateName);
      formData.append('pincode', pincode);
      formData.append('employment_status', employmentType || '');
      
      const isLowTrack = loanType === 'instant' || loanType === 'credit-builder' || loanType === 'micro';
      formData.append('loan_track', isLowTrack ? 'low' : 'high');
      formData.append('product_category', loanType || 'personal');

      // Helper to convert custom base64 state object to native File object
      const getFileFromState = (stateValue, defaultName) => {
        if (!stateValue) return null;
        if (stateValue instanceof File || stateValue instanceof Blob) {
          return stateValue;
        }
        if (stateValue && stateValue.url) {
          try {
            const arr = stateValue.url.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], stateValue.name || defaultName, { type: mime });
          } catch (e) {
            console.error('Error converting base64 data to File:', e);
            return null;
          }
        }
        return null;
      };

      // Append files if uploaded
      const liveSelfieFile = getFileFromState(liveSelfie, 'live_selfie.png');
      if (liveSelfieFile) formData.append('live_selfie', liveSelfieFile);

      const aadhaarFrontFile = getFileFromState(aadhaarFront, 'aadhaar_front.png');
      if (aadhaarFrontFile) formData.append('aadhaar_front', aadhaarFrontFile);

      const aadhaarBackFile = getFileFromState(aadhaarBack, 'aadhaar_back.png');
      if (aadhaarBackFile) formData.append('aadhaar_back', aadhaarBackFile);

      const panCardFile = getFileFromState(panCard, 'pan_card.png');
      if (panCardFile) formData.append('pan_card', panCardFile);

      const bankStatementFile = getFileFromState(incomeProof, 'bank_statement.pdf');
      if (bankStatementFile) formData.append('bank_statement', bankStatementFile);

      // Submit API call
      const response = await apiClient('/loans/apply', {
        method: 'POST',
        body: formData,
      });

      if (response && response.reference_number) {
        markStepComplete('step4');
        navigate('/loan/apply/disbursal', {
          state: { reference_number: response.reference_number }
        });
      } else {
        throw new Error('Server response did not include reference number.');
      }
    } catch (err) {
      console.error('Final Loan Submit Error:', err);
      setError(err.message || 'Something went wrong during submission. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className="loan-step-card compact-card shadow-sm" style={{ width: '100%', maxWidth: '1120px', minHeight: '515px', margin: '0 auto', fontFamily: "'Outfit', sans-serif" }}>
        {/* Step Title Row Matching Step 1 */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
          <PaperOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            4. Agreement Setup
          </h2>
        </div>

        {/* Spacious Scrollable Agreement Box */}
        <div className="terms-scroll-box" onScroll={handleTermsScroll} style={{ height: '240px', padding: '16px 20px', fontSize: '0.88rem', marginBottom: '12px', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#fafbff', overflowY: 'auto' }}>
          {TERMS_TEXT.trim().split('\n\n').map((para, i) => {
            const isHeading = /^[A-Z0-9\s.,()&-]+$/.test(para.trim());
            return isHeading
              ? <h4 key={i} style={{ fontSize: '0.94rem', fontWeight: 800, margin: '14px 0 6px', color: '#0f172a' }}>{para.trim()}</h4>
              : <p key={i} style={{ margin: '0 0 10px', color: '#475569', lineHeight: '1.6' }}>{para.trim()}</p>;
          })}
        </div>

        {/* Dynamic Scroll Notice */}
        {!scrolledToBottom ? (
          <p className="terms-must-scroll-note" style={{ fontSize: '0.76rem', margin: '0 0 12px', color: '#d97706', fontWeight: 700 }}>
            * Please scroll to the bottom of the terms box above to activate the agreement checkbox.
          </p>
        ) : (
          <p style={{ fontSize: '0.76rem', margin: '0 0 12px', color: '#10b981', fontWeight: 700 }}>
            ✓ Terms fully read. You may now check the box and proceed to loan approval.
          </p>
        )}

        {/* Agree Checkbox */}
        <label className="terms-checkbox-row" style={{ gap: '10px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', cursor: (scrolledToBottom && !loading) ? 'pointer' : 'not-allowed' }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            disabled={!scrolledToBottom || loading}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: (scrolledToBottom && !loading) ? 'pointer' : 'not-allowed' }}
          />
          <span style={{ fontWeight: 700, color: scrolledToBottom ? '#1e293b' : '#64748b', lineHeight: '1.4' }}>
            I confirm that I have read all terms, understanding early-payment positive score benefits and late due increment/suspension penalty rules.
          </span>
        </label>

        {/* Error alert if submission failed */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', fontSize: '0.84rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <span>Error: {error}</span>
          </div>
        )}

        {/* Premium Action Bar Matching Step 1 Sizing */}
        <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
          <button
            type="button"
            className="btn-step-prev"
            disabled={loading}
            onClick={() => navigate('/loan/apply/kyc')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.6 : 1 }}
          >
            &lt; PREVIOUS
          </button>

          <button
            type="button"
            className="btn-step-next"
            disabled={!canContinue || loading}
            onClick={handleFinalSubmit}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: (canContinue && !loading) ? '#0f172a' : '#cbd5e1', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.82rem', fontWeight: 700, color: (canContinue && !loading) ? '#ffffff' : '#94a3b8', cursor: (canContinue && !loading) ? 'pointer' : 'not-allowed', boxShadow: (canContinue && !loading) ? '0 4px 12px rgba(15,23,42,0.15)' : 'none', transition: 'all 0.2s' }}
          >
            {loading ? 'SUBMITTING...' : 'CONFIRM & SUBMIT >'}
          </button>
        </div>
      </div>
    </LoanApplyLayout>
  );
};

export default Step4Terms;
