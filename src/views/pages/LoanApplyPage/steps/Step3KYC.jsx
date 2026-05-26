import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';

const Step3KYC = () => {
  const navigate = useNavigate();
  const {
    loanType, loanTypeLabel, completedSteps,
    aadhaarFront, setAadhaarFront,
    aadhaarBack, setAadhaarBack,
    panCard, setPanCard,
    liveSelfie, setLiveSelfie,
    incomeProof, setIncomeProof,
    propertyDoc, setPropertyDoc,
    registrationDoc, setRegistrationDoc,
    agreementDoc, setAgreementDoc,
    creditHistory, setCreditHistory,
    employmentType, setEmploymentType,
    monthlyIncome, setMonthlyIncome,
    markStepComplete,
  } = useLoanApplication();

  useEffect(() => {
    if (!completedSteps.step2) navigate('/loan/apply/offer');
  }, []);

  const isTier1 = loanType === 'personal' || loanType === 'instant' || loanType === 'credit-builder';

  const tier1Docs = [
    { key: 'aadhaarFront', label: 'Aadhaar Front', state: aadhaarFront, setter: setAadhaarFront },
    { key: 'aadhaarBack',  label: 'Aadhaar Back',  state: aadhaarBack,  setter: setAadhaarBack },
    { key: 'panCard',      label: 'PAN Card',      state: panCard,      setter: setPanCard },
    { key: 'liveSelfie',   label: 'Live Selfie',   state: liveSelfie,   setter: setLiveSelfie },
  ];

  const tier2Docs = [
    { key: 'aadhaarFront',    label: 'Aadhaar Front',    state: aadhaarFront,    setter: setAadhaarFront },
    { key: 'aadhaarBack',     label: 'Aadhaar Back',     state: aadhaarBack,     setter: setAadhaarBack },
    { key: 'panCard',         label: 'PAN Card',         state: panCard,         setter: setPanCard },
    { key: 'liveSelfie',      label: 'Live Selfie',      state: liveSelfie,      setter: setLiveSelfie },
    { key: 'incomeProof',     label: 'Income Proof',     state: incomeProof,     setter: setIncomeProof },
    { key: 'propertyDoc',     label: 'Property Docs',    state: propertyDoc,     setter: setPropertyDoc },
    { key: 'registrationDoc', label: 'Registration Cert',state: registrationDoc, setter: setRegistrationDoc },
    { key: 'agreementDoc',    label: 'Loan Agreement',   state: agreementDoc,    setter: setAgreementDoc },
    { key: 'creditHistory',   label: 'Credit History',   state: creditHistory,   setter: setCreditHistory },
  ];

  const activeDocs = isTier1 ? tier1Docs : tier2Docs;

  const allDocsUploaded = activeDocs.every(doc => doc.state !== null);
  const canContinue = allDocsUploaded && employmentType && monthlyIncome && Number(monthlyIncome) >= 0;

  const handleContinue = () => {
    markStepComplete('step3');
    navigate('/loan/apply/terms');
  };

  const DocOutlineIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );

  const DocCellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );

  const SelfieIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#10b981' }}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  return (
    <LoanApplyLayout>
      <div className="loan-step-card compact-card shadow-sm">
        {/* Step Title Row */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <DocOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            3. Document Setup
          </h2>
        </div>

        {/* Dynamic Compact Grid */}
        <div className={isTier1 ? 'kyc-grid-2x2' : 'kyc-grid-3x3'}>
          {activeDocs.map((doc) => {
            const isSelfie = doc.key === 'liveSelfie';
            const isUploaded = !!doc.state;
            return (
              <div key={doc.key} className={`kyc-grid-cell ${isUploaded ? 'uploaded' : ''}`}>
                <div className="cell-icon-wrap">
                  {isUploaded ? <CheckIcon /> : isSelfie ? <SelfieIcon /> : <DocCellIcon />}
                </div>
                <div className="cell-content">
                  <span className="cell-label">{doc.label}</span>
                  {isUploaded ? (
                    <span className="cell-filename" title={doc.state}>Uploaded</span>
                  ) : (
                    <label className="cell-upload-btn">
                      Upload
                      <input
                        type="file"
                        accept={isSelfie ? "image/*" : ".pdf,.jpg,.jpeg,.png"}
                        className="file-input-hidden"
                        onChange={(e) => doc.setter(e.target.files[0]?.name || 'uploaded_doc.pdf')}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Employment & Income */}
        <div className="form-row-multi" style={{ marginTop: 14, gap: '16px' }}>
          <div className="form-group flex-1" style={{ marginBottom: 0 }}>
            <label className="form-label-flat">EMPLOYMENT STATUS*</label>
            <select
              className="form-select-flat"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              style={{ height: '48px', padding: '8px 12px', fontSize: '0.9rem' }}
            >
              <option value="">Select employment</option>
              <option value="Salaried">Salaried</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Student">Student</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>

          <div className="form-group flex-1" style={{ marginBottom: 0 }}>
            <label className="form-label-flat">MONTHLY NET INCOME (₹)*</label>
            <input
              type="number"
              className="form-input-flat"
              placeholder="e.g. 45000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              style={{ height: '48px', padding: '8px 12px', fontSize: '0.9rem' }}
              min={0}
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '24px' }}>
          <button
            type="button"
            className="btn-step-prev"
            onClick={() => navigate('/loan/apply/offer')}
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
            NEXT STEP &gt;
          </button>
        </div>
      </div>
    </LoanApplyLayout>
  );
};

export default Step3KYC;
