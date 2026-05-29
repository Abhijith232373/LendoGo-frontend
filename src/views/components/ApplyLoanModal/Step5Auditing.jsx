import React, { useState, useEffect } from 'react';

const Step5Auditing = ({ onComplete }) => {
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

  useEffect(() => {
    setAuditStep(0);
    setAuditChecklist({ kyc: false, credit: false, bank: false, disburse: false });
  }, []);

  useEffect(() => {
    let timer;
    if (auditStep < auditLogs.length) {
      timer = setTimeout(() => {
        if (auditStep === 0) setAuditChecklist(prev => ({ ...prev, kyc: true }));
        if (auditStep === 1) setAuditChecklist(prev => ({ ...prev, credit: true }));
        if (auditStep === 2) setAuditChecklist(prev => ({ ...prev, bank: true }));
        if (auditStep === 3) setAuditChecklist(prev => ({ ...prev, disburse: true }));
        
        setAuditStep(prev => prev + 1);
      }, 900);
    } else if (auditStep === auditLogs.length) {
      timer = setTimeout(() => {
        onComplete();
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [auditStep]);

  return (
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
  );
};

export default Step5Auditing;
