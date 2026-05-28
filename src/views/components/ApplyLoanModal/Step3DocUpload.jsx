import React from 'react';

const Step3DocUpload = ({
  loanType,
  uploadedFiles,
  uploadProgress,
  handleUploadFile
}) => {
  return (
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
  );
};

export default Step3DocUpload;
