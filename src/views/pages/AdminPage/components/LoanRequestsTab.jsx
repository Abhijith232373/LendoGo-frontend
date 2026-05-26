import React from 'react';

const LoanRequestsTab = ({ 
  loanRequests, 
  handleRunRiskAudit, 
  handleApproveLoan, 
  handleRejectLoan 
}) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Pending Loan Applications</h2>
        <p>Run simulated credit assessments and approve or decline incoming loan sanction contracts.</p>
      </div>

      <div className="requests-grid-wrapper">
        {loanRequests.length > 0 ? (
          loanRequests.map((req) => (
            <div className="request-card" key={req.id}>
              <div className="req-card-header">
                <span className="req-id-badge">{req.id}</span>
                <span className="req-type-badge">{req.type}</span>
              </div>
              
              <div className="req-card-body">
                <h3>{req.name}</h3>
                <div className="req-details-grid">
                  <div>
                    <span className="detail-lbl">Requested Sum</span>
                    <strong className="detail-val text-primary">₹{req.amount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="detail-lbl">Tax Registry PAN</span>
                    <strong className="detail-val"><code>{req.PAN}</code></strong>
                  </div>
                </div>

                {/* Risk Audit Progress / Score */}
                {req.auditState === 'idle' && (
                  <div className="audit-state-box idle">
                    <span className="state-msg">Credit audit analysis required before decision.</span>
                  </div>
                )}

                {req.auditState === 'scanning' && (
                  <div className="audit-state-box scanning">
                    <div className="mini-spinner" />
                    <span className="state-msg animate-pulse">Scanning risk profile databases...</span>
                  </div>
                )}

                {req.auditState === 'completed' && (
                  <div className="audit-state-box completed">
                    <div className="score-badge-circle">
                      <strong>{req.riskScore}</strong>
                      <span>/850</span>
                    </div>
                    <div className="score-desc">
                      <span className="score-level">
                        Rating: <strong className={req.riskScore >= 700 ? 'text-green' : req.riskScore >= 600 ? 'text-orange' : 'text-red'}>
                          {req.riskScore >= 700 ? 'Safe Account' : req.riskScore >= 600 ? 'Moderate Risk' : 'Critical Credit Risk'}
                        </strong>
                      </span>
                      <p>KYC verified, bank statements matches approved criteria.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="req-card-actions">
                {req.auditState === 'idle' ? (
                  <button className="btn-req-audit" onClick={() => handleRunRiskAudit(req.id)}>
                    📊 Run Credit Risk Audit
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn-decision approve" 
                      disabled={req.auditState === 'scanning'}
                      onClick={() => handleApproveLoan(req)}
                    >
                      Approve & Disburse
                    </button>
                    <button 
                      className="btn-decision reject" 
                      disabled={req.auditState === 'scanning'}
                      onClick={() => handleRejectLoan(req.id, req.name)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-card">
            <span>✓</span>
            <h3>All Requests Cleared!</h3>
            <p>There are no outstanding loan applications waiting to be sanctioned.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanRequestsTab;
