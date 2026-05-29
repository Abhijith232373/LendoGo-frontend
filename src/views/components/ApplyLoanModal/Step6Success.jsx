import React from 'react';

const Step6Success = ({ loanAmount, emi, tenure, interestRate, onClose }) => {
  return (
    <div className="loan-step-pane pane-6 animate-fade-in success-screen-wrapper">
      <div className="success-badge-blast">
        <span>✓</span>
      </div>
      <h2>Sanction Capital Approved!</h2>
      <p>
        Congratulations! Your LendoGo loan request of <strong>₹{loanAmount.toLocaleString('en-IN')}</strong> has been approved. The payout transfer to <strong>SBI account (**4099)</strong> will complete inside 24 hours.
      </p>

      <div className="success-recap-box" style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '20px', borderRadius: '20px', maxWidth: '400px', margin: '0 auto 30px auto', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: '#9ca3af' }}>Monthly EMI Installment:</span>
          <strong style={{ color: '#34d399' }}>₹{emi.toLocaleString('en-IN')}/mo</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: '#9ca3af' }}>Tenure Selection:</span>
          <strong>{tenure} Months</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: '#9ca3af' }}>Interest locked rate:</span>
          <strong>{interestRate}% Fixed</strong>
        </div>
      </div>

      <button className="btn-loan-modal btn-finish" onClick={onClose}>
        Return to Dashboard
      </button>
    </div>
  );
};

export default Step6Success;
