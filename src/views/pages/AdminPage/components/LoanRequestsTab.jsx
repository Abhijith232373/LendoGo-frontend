import React, { useState } from 'react';

const LoanRequestsTab = ({ 
  loanRequests, 
  handleRunRiskAudit, 
  handleApproveLoan, 
  handleRejectLoan,
  onInspectRequest 
}) => {
  // Filters, Search, and Export states
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' or 'pdf'

  // Filter list live on render
  const filteredRequests = loanRequests.filter((req) => {
    const matchesType = typeFilter === 'All' || req.type === typeFilter;
    
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      req.id.toLowerCase().includes(q) || 
      req.name.toLowerCase().includes(q) || 
      req.PAN.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  // Client-side CSV Exporter
  const handleExportCSV = () => {
    const headers = ['Request ID', 'Borrower Name', 'Loan Type', 'Requested Sum', 'Tax PAN', 'Audit Status', 'Bureau Score'];
    const rows = filteredRequests.map(req => [
      req.id,
      req.name,
      req.type,
      req.amount,
      req.PAN,
      req.auditState,
      req.riskScore || 'Pending'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LendoGo_LoanRequests_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-side PDF Print Auditor
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const rowsHtml = filteredRequests.map(req => `
      <tr>
        <td><strong>${req.id}</strong></td>
        <td>${req.name}</td>
        <td>${req.type}</td>
        <td>₹${req.amount.toLocaleString('en-IN')}</td>
        <td><code>${req.PAN}</code></td>
        <td><span class="status ${req.auditState}">${req.auditState}</span></td>
        <td>${req.riskScore ? `${req.riskScore}/850` : 'Pending'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>LendoGo - Pending Loan Registry</title>
          <style>
            body {
              font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              margin: 40px;
              line-height: 1.5;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #0066ff;
            }
            .title {
              font-size: 14px;
              text-align: right;
              color: #64748b;
            }
            h1 {
              font-size: 20px;
              font-weight: 700;
              margin: 0 0 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            th {
              background-color: #f8fafc;
              border-bottom: 2px solid #e2e8f0;
              color: #475569;
              font-size: 11px;
              text-transform: uppercase;
              font-weight: 700;
              padding: 12px 10px;
              text-align: left;
            }
            td {
              border-bottom: 1px solid #e2e8f0;
              padding: 12px 10px;
              font-size: 12px;
            }
            code {
              font-family: monospace;
              background-color: #f1f5f9;
              padding: 2px 6px;
              border-radius: 4px;
            }
            .status {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .status.idle { background-color: #fef3c7; color: #d97706; }
            .status.scanning { background-color: #e0f2fe; color: #0284c7; }
            .status.completed { background-color: #d1fae5; color: #059669; }
            .footer {
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              margin-top: 50px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">LendoGo</div>
            <div class="title">Capital Audit Desk</div>
          </div>
          <h1>Pending Loan Request Audit Registry</h1>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
            Generated on: <strong>${today}</strong> | 
            Total Pending Applications: <strong>${filteredRequests.length}</strong> | 
            Audited by: <strong>Compliance Officer</strong>
          </div>
          <table>
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Borrower Name</th>
                <th>Loan Type</th>
                <th>Requested Capital</th>
                <th>PAN</th>
                <th>Audit Status</th>
                <th>Bureau Score</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">
            CONFIDENTIAL - Internal Administrative Audit Ledger - LendoGo FinTech Inc.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Pending Loan Applications</h2>
      </div>

      {/* Premium Filter & Search Controls Row */}
      <div className="filter-controls-row animate-fade-in" style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px', 
        marginBottom: '25px', 
        padding: '16px 20px', 
        backgroundColor: 'var(--admin-sidebar)', 
        border: '1px solid var(--admin-border)', 
        borderRadius: '12px' 
      }}>
        {/* Left Filters */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-input-admin"
              style={{ minWidth: '170px', padding: '8px 12px', height: '38px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <option value="All">All Types</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Auto Loan">Auto Loan</option>
              <option value="Home Loan">Home Loan</option>
            </select>
          </div>
        </div>

        {/* Right Search & Export Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input 
              type="text"
              placeholder="Search by ID, name, PAN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input-admin"
              style={{ width: '220px', padding: '8px 12px', height: '38px', borderRadius: '8px' }}
            />
          </div>

          <button 
            className="btn-action-primary" 
            onClick={() => setShowExportModal(true)}
            style={{ height: '38px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderRadius: '8px', fontWeight: '700' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export All
          </button>
        </div>
      </div>

      <div className="requests-grid-wrapper">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div 
              className="request-card" 
              key={req.id}
              onClick={() => onInspectRequest(req)}
              style={{ cursor: 'pointer' }}
            >
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

              <div className="req-card-actions" onClick={(e) => e.stopPropagation()}>
                {req.auditState === 'idle' ? (
                  <button 
                    className="btn-req-audit" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunRiskAudit(req.id);
                    }}
                  >
                    Run Credit Risk Audit
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn-decision approve" 
                      disabled={req.auditState === 'scanning'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveLoan(req);
                      }}
                    >
                      Approve & Disburse
                    </button>
                    <button 
                      className="btn-decision reject" 
                      disabled={req.auditState === 'scanning'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRejectLoan(req.id, req.name);
                      }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state-card" style={{ gridColumn: '1 / -1' }}>
            <h3>No requests match your current filters.</h3>
            <p>Try modifying your search query or selecting a different loan type classification.</p>
          </div>
        )}
      </div>

      {/* ── EXPORT CONFIRMATION MODAL ── */}
      {showExportModal && (
        <div className="admin-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="admin-modal-container" style={{ width: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Export Pending Loans Data</h3>
              <button className="close-btn" onClick={() => setShowExportModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.4' }}>
                You are about to export <strong>{filteredRequests.length}</strong> pending loan requests. Please select your preferred layout:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* CSV Format Card */}
                <div 
                  onClick={() => setExportFormat('csv')}
                  style={{
                    border: exportFormat === 'csv' ? '2px solid var(--primary)' : '1px solid var(--admin-border)',
                    backgroundColor: exportFormat === 'csv' ? 'rgba(0, 102, 255, 0.06)' : 'var(--admin-input)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '6px' }}>CSV</span>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--admin-text)' }}>CSV Spreadsheet</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>Excel & Google Sheets</span>
                </div>

                {/* PDF Format Card */}
                <div 
                  onClick={() => setExportFormat('pdf')}
                  style={{
                    border: exportFormat === 'pdf' ? '2px solid var(--primary)' : '1px solid var(--admin-border)',
                    backgroundColor: exportFormat === 'pdf' ? 'rgba(0, 102, 255, 0.06)' : 'var(--admin-input)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '6px' }}>PDF</span>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--admin-text)' }}>PDF Document</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)' }}>Formal Compliance Log</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-secondary-admin" 
                  onClick={() => setShowExportModal(false)}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary-admin" 
                  onClick={() => {
                    if (exportFormat === 'csv') {
                      handleExportCSV();
                    } else {
                      handleExportPDF();
                    }
                    setShowExportModal(false);
                  }}
                  style={{ padding: '8px 20px', fontSize: '0.85rem', fontWeight: '700' }}
                >
                  Confirm & Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanRequestsTab;
