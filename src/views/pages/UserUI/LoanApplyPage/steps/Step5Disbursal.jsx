import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const referenceNumberFromState = location.state?.reference_number;
  const loanIdFromState = location.state?.loan_id;

  const {
    completedSteps,
    loanAmount, tenure, interestRate, emi,
    loanTypeLabel,
    email,
  } = useLoanApplication();

  useEffect(() => {
    if (!completedSteps.step4 && !referenceNumberFromState) navigate('/loan/apply/terms');
  }, []);

  const [checkedKeys, setCheckedKeys] = useState([]);
  const [currentMsg, setCurrentMsg]   = useState(0);
  const [done, setDone]               = useState(false);
  const [refNumber]                   = useState(() => referenceNumberFromState || 'LG-' + Math.floor(100000 + Math.random() * 900000));

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

  const handleGoToDashboard = () => {
    // Generate new active loan
    const activeLoanId = loanIdFromState || '1092a1a1-1234-4321-abcd-1234567890ab';
    const newActiveLoan = {
      id: activeLoanId,
      referenceNumber: refNumber,
      amountApplied: loanAmount,
      dateApplied: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      amountDistributed: loanAmount,
      dateDistributed: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      dailyInterestRate: (interestRate / 365).toFixed(3) + '%',
      numberOfEmis: tenure,
      emiFrequency: 'Monthly',
      nextEmiAmount: emi,
      nextEmiDueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      remainingBalance: emi * tenure,
      status: 'ACTIVE'
    };
    localStorage.setItem('lendogo_active_loan', JSON.stringify(newActiveLoan));

    // Generate new repayment schedule
    const newSchedule = [];
    const limit = Math.min(6, tenure);
    for (let i = 1; i <= limit; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      const dateStr = dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      newSchedule.push({
        installment: i,
        date: dateStr,
        amount: emi,
        status: i === 1 ? 'Next Due' : 'Upcoming',
        principal: Math.round(emi * 0.88 * 100) / 100,
        interest: Math.round(emi * 0.12 * 100) / 100
      });
    }
    localStorage.setItem('lendogo_repayment_schedule', JSON.stringify(newSchedule));

    // Add to loan history
    const savedHistoryStr = localStorage.getItem('lendogo_loan_history');
    let history = savedHistoryStr ? JSON.parse(savedHistoryStr) : [];
    // Filter out dummy loans if they were previously saved
    history = history.filter(item => !['LGO-1092', 'LGO-0871', 'LGO-0654'].includes(item.id));
    // Add new loan to history
    history.unshift({
      id: refNumber,
      type: loanTypeLabel,
      amount: loanAmount,
      status: 'DISBURSED',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    localStorage.setItem('lendogo_loan_history', JSON.stringify(history));

    // Dip trust score slightly on application (-15 points)
    const emailKey = email || 'user';
    const currentScore = parseInt(localStorage.getItem(`trust_score_${emailKey}`)) || 736;
    localStorage.setItem(`trust_score_${emailKey}`, Math.max(300, currentScore - 15).toString());

    // Trigger update events
    window.dispatchEvent(new Event('loan-state-changed'));
    window.dispatchEvent(new Event('user-details-changed'));

    navigate('/home');
  };

  const StatusOutlineIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  const ClockIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '14px' }}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );

  return (
    <LoanApplyLayout>
      <div className="loan-step-card compact-card shadow-sm" style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* Step Title Row Matching Step 1 */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
          <StatusOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            5. Application Status
          </h2>
        </div>

        {!done ? (
          /* ── Processing animation ── */
          <div className="disbursal-center" style={{ textAlign: 'center', padding: '16px 0' }}>
            <div className="disbursal-spinner" style={{ margin: '0 auto 16px', width: '56px', height: '56px' }} />
            <h3 className="disbursal-title" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Submitting Application...
            </h3>
            <p className="disbursal-sub" style={{ fontSize: '0.94rem', color: '#64748b', marginBottom: '20px', fontWeight: 500 }}>
              {currentMsg < AUDIT_STEPS.length
                ? AUDIT_STEPS[currentMsg]?.label + '...'
                : 'Securing digital vault logs...'}
            </p>

            <div className="audit-list" style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'left', background: '#fafbff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '16px 20px' }}>
              {AUDIT_STEPS.map((s) => {
                const checked = checkedKeys.includes(s.key);
                return (
                  <div
                    key={s.key}
                    className={`audit-row ${checked ? 'checked' : ''}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', fontSize: '0.84rem', color: checked ? '#0f172a' : '#94a3b8', fontWeight: checked ? 700 : 500 }}
                  >
                    <div className="audit-check" style={{ width: '20px', height: '20px', borderRadius: '50%', background: checked ? '#d1fae5' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 'bold', fontSize: '0.74rem' }}>
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
          <div className="success-card" style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <ClockIcon />
            </div>
            <h2 className="success-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Application Submitted Successfully
            </h2>
            <p className="success-sub" style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.6', marginBottom: '20px', padding: '0 24px' }}>
              Your application has been received. Our credit underwriting team is currently evaluating your profile. You will receive a final status notification via email and SMS within <strong>24 working hours</strong>.
            </p>

            <div className="success-recap" style={{ background: '#f8faff', border: '1.5px solid #cbd5e1', borderRadius: '14px', padding: '16px 20px', textAlign: 'left', marginBottom: '20px', maxWidth: '640px', margin: '0 auto 20px' }}>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span className="recap-label" style={{ color: '#64748b', fontWeight: 600 }}>Reference Number</span>
                <span className="recap-value" style={{ fontWeight: 800, color: '#0f172a' }}>{refNumber}</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span className="recap-label" style={{ color: '#64748b', fontWeight: 600 }}>Loan Category</span>
                <span className="recap-value" style={{ fontWeight: 800, color: '#0f172a' }}>{loanTypeLabel}</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span className="recap-label" style={{ color: '#64748b', fontWeight: 600 }}>Requested Amount</span>
                <span className="recap-value" style={{ fontWeight: 900, color: '#0f172a' }}>₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span className="recap-label" style={{ color: '#64748b', fontWeight: 600 }}>Estimated EMI</span>
                <span className="recap-value" style={{ fontWeight: 800, color: '#0f172a' }}>₹{emi.toLocaleString('en-IN')}/mo ({tenure} mos)</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.84rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                <span className="recap-label" style={{ color: '#64748b', fontWeight: 600 }}>Interest Rate</span>
                <span className="recap-value" style={{ fontWeight: 800, color: '#059669' }}>{interestRate}% P.A. (Fixed)</span>
              </div>
              <div className="recap-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, fontSize: '0.84rem' }}>
                <span className="recap-label" style={{ color: '#64748b', fontWeight: 600 }}>Application Status</span>
                <span className="recap-value" style={{ fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Under Review</span>
              </div>
            </div>

            {/* Premium Action Bar Matching Step 1 Sizing */}
            <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '16px' }}>
              <button
                type="button"
                className="btn-step-prev"
                onClick={handleTrackApplication}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                TRACK STATUS
              </button>

              <button
                type="button"
                className="btn-step-next"
                onClick={handleGoToDashboard}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#059669', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.82rem', fontWeight: 700, color: '#ffffff', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,150,105,0.15)', transition: 'all 0.2s' }}
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
