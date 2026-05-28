import React, { useState, useEffect } from 'react';
import Step1TypeSelect from './Step1TypeSelect';
import Step2Calculator from './Step2Calculator';
import Step3DocUpload from './Step3DocUpload';
import Step4ESign from './Step4ESign';
import Step5Auditing from './Step5Auditing';
import Step6Success from './Step6Success';
import './ApplyLoanModal.css';

const ApplyLoanModal = ({ isOpen, onClose, onApplySuccess, initialTrustTier = 'bronze' }) => {
  if (!isOpen) return null;

  // Wizard Navigation Step
  const [step, setStep] = useState(1); // 1: Type, 2: Calculate, 3: Documents, 4: E-Sign, 5: Progress, 6: Success

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

  // Calculated EMI details
  const monthlyRate = interestRate / 12 / 100;
  const emiVal = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  const emi = Math.round(emiVal) || 0;
  const totalRepayment = emi * tenure;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  // Sync amount slider limits based on type
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

  const handleAuditingComplete = () => {
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

          {/* Render Active Step */}
          {step === 1 && (
            <Step1TypeSelect 
              loanType={loanType} 
              setLoanType={setLoanType} 
            />
          )}

          {step === 2 && (
            <Step2Calculator 
              loanType={loanType}
              loanAmount={loanAmount}
              setLoanAmount={setLoanAmount}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              tenure={tenure}
              setTenure={setTenure}
              emi={emi}
              totalInterest={totalInterest}
            />
          )}

          {step === 3 && (
            <Step3DocUpload 
              loanType={loanType}
              uploadedFiles={uploadedFiles}
              uploadProgress={uploadProgress}
              handleUploadFile={handleUploadFile}
            />
          )}

          {step === 4 && (
            <Step4ESign 
              loanType={loanType}
              loanAmount={loanAmount}
              emi={emi}
              tenure={tenure}
              interestRate={interestRate}
              typedSignature={typedSignature}
              setTypedSignature={setTypedSignature}
              hasDrawnSignature={hasDrawnSignature}
              setHasDrawnSignature={setHasDrawnSignature}
            />
          )}

          {step === 5 && (
            <Step5Auditing 
              onComplete={handleAuditingComplete}
            />
          )}

          {step === 6 && (
            <Step6Success 
              loanAmount={loanAmount}
              emi={emi}
              tenure={tenure}
              interestRate={interestRate}
              onClose={onClose}
            />
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
