import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';

const AUDIT_STEPS = [
  { key: 'kyc',      label: 'Biometric KYC registry match checked'           },
  { key: 'credit',   label: 'CIBIL credit history profiling requested'      },
  { key: 'bank',     label: 'Direct payout bank coordinates authenticated'   },
  { key: 'contract', label: 'Loan application registered on secure ledger'   },
];

const Step5Disbursal = () => {
  const navigate = useNavigate();
  const {
    completedSteps,
    loanAmount, tenure, interestRate, emi,
    loanTypeLabel,
  } = useLoanApplication();

  useEffect(() => {
    if (!completedSteps.step4) navigate('/loan/apply/terms');
  }, []);

  const [checkedKeys, setCheckedKeys] = useState([]);
  const [currentMsg, setCurrentMsg]   = useState(0);
  const [done, setDone]               = useState(false);
  const [refNumber]                   = useState(() => 'LG-' + Math.floor(100000 + Math.random() * 900000));

  useEffect(() => {
    if (done) return;
    if (currentMsg < AUDIT_STEPS.length) {
      const t = setTimeout(() => {
        setCheckedKeys(prev => [...prev, AUDIT_STEPS[currentMsg].key]);
        setCurrentMsg(prev => prev + 1);
      }, 950);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 500);
      return () => clearTimeout(t);
    }
  }, [currentMsg, done]);

  const handleTrackApplication = () => {
    alert(`Application Status Update:\nReference: ${refNumber}\n\nYour application is in "Credit Underwriting". A status tracking link has been sent to your registered mobile number and email address.`);
  };

  const StatusOutlineIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '14px' }}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  return (
    <LoanApplyLayout>
      <div className="loan-step-card compact-card shadow-sm" style={{ padding: '36px 40px' }}>
        {/* Step Title Row */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <StatusOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            5. Application Status
          </h2>
        </div>

        {!done ? (
          /* ── Processing animation ── */
          <div className="disbursal-center" style={{ textAlign: 'center', padding: '16px 0' }}>
            <div className="disbursal-spinner" style={{ margin: '0 auto 20px', width: '48px', height: '48px' }} />
            <h3 className="disbursal-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Submitting Application...
            </h3>
            <p className="disbursal-sub" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>
              {currentMsg < AUDIT_STEPS.length
                ? AUDIT_STEPS[currentMsg]?.label + '...'
                : 'Securing digital vault logs...'}
            </p>

            <div className="audit-list" style={{ maxWidth: '440px', margin: '0 auto', textAlign: 'left', background: '#fafbff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
              {AUDIT_STEPS.map((s) => {
                const checked = checkedKeys.includes(s.key);
                return (
                  <div
                    key={s.key}
                    className={`audit-row ${checked ? 'checked' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '0.8rem', color: checked ? '#0f172a' : '#94a3b8', fontWeight: checked ? 600 : 500 }}
                  >
                    <div className="audit-check" style={{ width: '18px', height: '18px', borderRadius: '50%', background: checked ? '#d1fae5' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 'bold', fontSize: '0.7rem' }}>
                      {checked ? '✓' : ''}
                    </div>
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Application Submitted ── */
          <div className="success-card" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ClockIcon />
            </div>
            <h2 className="success-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Application Submitted Successfully
            </h2>
            <p className="success-sub" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '20px', padding: '0 12px' }}>
              Your application has been received. Our credit underwriting team is currently evaluating your profile. You will receive a final status notification via email and SMS within <strong>24 working hours</strong>.
            </p>

            <div className="success-recap" style={{ background: '#f8faff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'left', marginBottom: '24px' }}>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span className="recap-label" style={{ color: '#64748b' }}>Reference Number</span>
                <span className="recap-value" style={{ fontWeight: 700, color: '#0f172a' }}>{refNumber}</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span className="recap-label" style={{ color: '#64748b' }}>Loan Category</span>
                <span className="recap-value" style={{ fontWeight: 700, color: '#0f172a' }}>{loanTypeLabel}</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span className="recap-label" style={{ color: '#64748b' }}>Requested Amount</span>
                <span className="recap-value" style={{ fontWeight: 700, color: '#1d4ed8' }}>₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span className="recap-label" style={{ color: '#64748b' }}>Estimated EMI</span>
                <span className="recap-value" style={{ fontWeight: 700, color: '#0f172a' }}>₹{emi.toLocaleString('en-IN')}/mo ({tenure} mos)</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span className="recap-label" style={{ color: '#64748b' }}>Interest Rate</span>
                <span className="recap-value" style={{ fontWeight: 700, color: '#059669' }}>{interestRate}% P.A. (Fixed)</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, fontSize: '0.8rem' }}>
                <span className="recap-label" style={{ color: '#64748b' }}>Application Status</span>
                <span className="recap-value" style={{ fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Under Review</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <button
                type="button"
                className="btn-step-prev"
                onClick={handleTrackApplication}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 24px', fontSize: '0.82rem', fontWeight: 700, color: '#1d4ed8', cursor: 'pointer' }}
              >
                TRACK STATUS
              </button>

              <button
                type="button"
                className="btn-step-next"
                onClick={() => navigate('/home')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#059669', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,150,105,0.15)', transition: 'all 0.2s' }}
              >
                GO TO DASHBOARD &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </LoanApplyLayout>
  );
};

export default Step5Disbursal;
