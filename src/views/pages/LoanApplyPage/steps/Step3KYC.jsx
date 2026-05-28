import React, { useEffect, useState } from 'react';
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
    employmentType, setEmploymentType,
    monthlyIncome, setMonthlyIncome,
    markStepComplete,
  } = useLoanApplication();

  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (!completedSteps.step2) navigate('/loan/apply/offer');
  }, []);

  const handleFileChange = (e, setter, fileNameDefault = 'uploaded_doc.pdf') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter({
          name: file.name,
          type: file.type,
          url: event.target.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      setter(null);
    }
  };

  const getDocInfo = (state) => {
    if (!state) return null;
    if (typeof state === 'string') {
      if (state.startsWith('data:image/')) {
        return { name: 'Uploaded Image', type: 'image/png', url: state };
      }
      if (state.startsWith('data:application/pdf') || state.endsWith('.pdf')) {
        return { name: state.includes('/') ? 'Uploaded Document' : state, type: 'application/pdf', url: state };
      }
      return { name: state, type: 'image/png', url: state };
    }
    return state;
  };

  // Determine track active
  const isLowTrack = loanType === 'instant' || loanType === 'credit-builder';

  // Minimal 4-document KYC Checklist for Micro-Credit Track
  const lowTrackDocs = [
    { key: 'liveSelfie',   label: 'Live Selfie (Photo)',   state: liveSelfie,   setter: setLiveSelfie,   accept: 'image/*' },
    { key: 'aadhaarFront', label: 'Aadhaar Front (ID)',    state: aadhaarFront, setter: setAadhaarFront, accept: '.jpg,.jpeg,.png,.pdf' },
    { key: 'aadhaarBack',  label: 'Aadhaar Back (ID)',     state: aadhaarBack,  setter: setAadhaarBack,  accept: '.jpg,.jpeg,.png,.pdf' },
    { key: 'panCard',      label: 'PAN Card (ID)',         state: panCard,      setter: setPanCard,      accept: '.jpg,.jpeg,.png,.pdf' },
  ];

  // Rigorous 7-document "Tuff" KYC Checklist for Elite Asset Funding
  const highTrackDocs = [
    { key: 'liveSelfie',      label: 'Live Selfie (Photo)',        state: liveSelfie,      setter: setLiveSelfie,      accept: 'image/*' },
    { key: 'aadhaarFront',    label: 'Aadhaar Front (ID)',         state: aadhaarFront,    setter: setAadhaarFront,    accept: '.jpg,.jpeg,.png,.pdf' },
    { key: 'aadhaarBack',     label: 'Aadhaar Back (ID)',          state: aadhaarBack,     setter: setAadhaarBack,     accept: '.jpg,.jpeg,.png,.pdf' },
    { key: 'panCard',         label: 'PAN Card (ID)',              state: panCard,         setter: setPanCard,         accept: '.jpg,.jpeg,.png,.pdf' },
    { key: 'incomeProof',     label: '3-Month Bank Statement',     state: incomeProof,     setter: setIncomeProof,     accept: '.pdf' },
    { key: 'propertyDoc',     label: 'Property/Asset Agreement',   state: propertyDoc,     setter: setPropertyDoc,     accept: '.pdf' },
    { key: 'registrationDoc', label: 'Income Proof / ITR',         state: registrationDoc, setter: setRegistrationDoc, accept: '.pdf' },
  ];

  const activeDocs = isLowTrack ? lowTrackDocs : highTrackDocs;

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

  const PdfIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ef4444' }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <text x="8" y="16" fill="#ef4444" fontSize="5" fontWeight="800" fontFamily="sans-serif">PDF</text>
    </svg>
  );

  const CloseXIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const modalStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;

  return (
    <LoanApplyLayout>
      <style>{modalStyles}</style>
      <div className="loan-step-card compact-card shadow-sm" style={{ maxWidth: '1120px', margin: '0 auto' }}>
        {/* Step Title Row Matching Step 1 */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
          <DocOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            3. Document Setup ({loanTypeLabel})
          </h2>
        </div>

        {/* Dynamic Compact Grid (2x2 for Micro-loans, 3x3 for Asset loans) with Larger Sizing */}
        <div className={isLowTrack ? 'kyc-grid-2x2' : 'kyc-grid-3x3'} style={{ gap: '12px' }}>
          {activeDocs.map((doc) => {
            const isSelfie = doc.key === 'liveSelfie';
            const isPdfOnly = doc.accept === '.pdf';
            const isUploaded = !!doc.state;
            const docInfo = getDocInfo(doc.state);

            return (
              <div
                key={doc.key}
                className={`kyc-grid-cell ${isUploaded ? 'uploaded' : ''}`}
                style={{
                  minHeight: '68px',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  background: isUploaded ? '#f8fafc' : '#ffffff',
                  border: isUploaded ? '1.5px solid #cbd5e1' : '1.5px dashed #cbd5e1'
                }}
              >
                {/* Thumbnail Preview / Default Icon */}
                <div 
                  className="cell-icon-wrap" 
                  onClick={() => {
                    if (isUploaded && docInfo) {
                      setPreviewFile({ ...docInfo, label: doc.label });
                    }
                  }}
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: isUploaded ? 'pointer' : 'default',
                    transition: 'all 0.2s',
                    background: isUploaded ? '#ffffff' : '#f1f5f9',
                    boxShadow: isUploaded ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    flexShrink: 0
                  }}
                >
                  {isUploaded && docInfo ? (
                    docInfo.type.startsWith('image/') ? (
                      <img 
                        src={docInfo.url} 
                        alt={doc.label} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <PdfIcon />
                    )
                  ) : isSelfie ? (
                    <SelfieIcon />
                  ) : isPdfOnly ? (
                    <PdfIcon />
                  ) : (
                    <DocCellIcon />
                  )}
                </div>

                {/* Main Cell Content & Actions */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span className="cell-label" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.label}
                  </span>
                  
                  {isUploaded && docInfo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span 
                        onClick={() => setPreviewFile({ ...docInfo, label: doc.label })}
                        style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        View File
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>|</span>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', cursor: 'pointer', textDecoration: 'underline', marginBottom: 0 }}>
                        Re-upload
                        <input
                          type="file"
                          accept={doc.accept}
                          className="file-input-hidden"
                          onChange={(e) => handleFileChange(e, doc.setter, doc.key + '_reupload.pdf')}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cell-upload-btn" style={{ fontSize: '0.74rem', fontWeight: 700, marginTop: '2px', cursor: 'pointer', color: '#2563eb', marginBottom: 0 }}>
                      Upload {isPdfOnly ? 'PDF' : ''}
                      <input
                        type="file"
                        accept={doc.accept}
                        className="file-input-hidden"
                        onChange={(e) => handleFileChange(e, doc.setter, doc.key + '.pdf')}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>

                {/* Cancel / Remove Button ("X") */}
                {isUploaded && (
                  <button
                    type="button"
                    onClick={() => doc.setter(null)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: 0,
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fca5a5';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.color = '#64748b';
                    }}
                  >
                    <CloseXIcon />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Employment & Income inputs with generous height & margins */}
        <div className="form-row-multi" style={{ marginTop: 16, gap: '20px' }}>
          <div className="form-group flex-1" style={{ marginBottom: 0 }}>
            <label className="form-label-flat">EMPLOYMENT STATUS*</label>
            <select
              className="form-select-flat"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              style={{ height: '54px' }}
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
              min={0}
              style={{ height: '54px' }}
            />
          </div>
        </div>

        {/* Premium Action Bar Matching Step 1 Sizing */}
        <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '16px' }}>
          <button
            type="button"
            className="btn-step-prev"
            onClick={() => navigate('/loan/apply/offer')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 700, color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            &lt; PREVIOUS
          </button>

          <button
            type="button"
            className="btn-step-next"
            disabled={!canContinue}
            onClick={handleContinue}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: canContinue ? '#0f172a' : '#cbd5e1', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '0.82rem', fontWeight: 700, color: canContinue ? '#ffffff' : '#94a3b8', cursor: canContinue ? 'pointer' : 'not-allowed', boxShadow: canContinue ? '0 4px 12px rgba(15,23,42,0.15)' : 'none', transition: 'all 0.2s' }}
          >
            NEXT STEP &gt;
          </button>
        </div>

        {/* Full-Screen Document Preview Modal / Lightbox Overlay */}
        {previewFile && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => setPreviewFile(null)}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '700px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {previewFile.label}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, display: 'block', marginTop: '2px', wordBreak: 'break-all' }}>
                    {previewFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#e2e8f0',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#0f172a',
                    transition: 'all 0.2s',
                    padding: 0
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#cbd5e1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#e2e8f0'; }}
                >
                  <CloseXIcon />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f1f5f9', minHeight: '350px' }}>
                {previewFile.type.startsWith('image/') ? (
                  <img
                    src={previewFile.url}
                    alt={previewFile.label}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '55vh',
                      borderRadius: '12px',
                      objectFit: 'contain',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <iframe
                      src={previewFile.url}
                      title={previewFile.label}
                      style={{
                        width: '100%',
                        height: '45vh',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        background: '#ffffff'
                      }}
                    />
                    <div style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      PDF Loaded Securely
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </LoanApplyLayout>
  );
};

export default Step3KYC;
