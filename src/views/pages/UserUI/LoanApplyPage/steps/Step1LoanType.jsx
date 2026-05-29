import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';

const LOAN_OPTIONS = [
  {
    id: 'micro',
    icon: '⚡',
    title: 'Personal Micro-Loan',
    desc: 'Fast disbursals with no paperwork. Repay in 3–6 months to build your credit trust score.',
    tag: 'Trust Tiers',
    tagClass: 'bronze',
  },
  {
    id: 'home',
    icon: '🏠',
    title: 'Home Loan',
    desc: 'Long-term housing finance. Requires income proof & property registry documents.',
    tag: 'High Docs',
    tagClass: 'secured',
  },
  {
    id: 'vehicle',
    icon: '🏍️',
    title: 'Vehicle Loan',
    desc: 'Finance two-wheelers or autos. Dealer invoice and identity proofs required.',
    tag: 'High Docs',
    tagClass: 'secured',
  },
];

const Step1LoanType = () => {
  const navigate = useNavigate();
  const { loanType, setLoanType, markStepComplete } = useLoanApplication();

  const handleContinue = () => {
    markStepComplete('step1');
    navigate('/loan/apply/offer');
  };

  return (
    <LoanApplyLayout>
      <div className="loan-step-card">
        <div className="step-icon-hero">👤</div>
        <h2 className="step-card-title">Select Loan Category</h2>
        <p className="step-card-subtitle">
          Choose the type of financing that matches your funding requirement
        </p>

        <div className="loan-type-options">
          {LOAN_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className={`loan-option-card ${loanType === opt.id ? 'selected' : ''}`}
              onClick={() => setLoanType(opt.id)}
            >
              <div className="loan-option-icon">{opt.icon}</div>
              <div className="loan-option-info">
                <h3>{opt.title}</h3>
                <p>{opt.desc}</p>
              </div>
              <span className={`loan-option-tag ${opt.tagClass}`}>{opt.tag}</span>
              <div className="radio-dot" />
            </div>
          ))}
        </div>

        <button
          className="btn-loan-continue"
          disabled={!loanType}
          onClick={handleContinue}
        >
          Continue →
        </button>

        <div className="trust-badge-row">
          <span>🔒 CIBIL Secured</span>
          <span>✦ Experian Verified</span>
          <span>🛡️ 256-bit Encrypted</span>
        </div>
      </div>
    </LoanApplyLayout>
  );
};

export default Step1LoanType;
