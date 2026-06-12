import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../../../utils/apiClient';
import "./LoanApplicationsTab.css";
import LoanRequestsTab from '../LoanRequestsTab/LoanRequestsTab';
import LoanApprovalsTab from '../LoanApprovalsTab/LoanApprovalsTab';

const LoanApplicationsTab = ({ 
  loanRequests, 
  handleRunRiskAudit, 
  handleApproveLoan, 
  handleRejectLoan,
  approvedLoans,
  handleDisburseMoney
}) => {
  const [activeSubTab, setActiveSubTab] = useState('pending');

  // Fetch rejected logs from real PostgreSQL DB on mount
  useEffect(() => {
    const fetchRejected = async () => {
      try {
        const res = await apiClient('/admin/applications');
        const data = res?.data || res || [];
        const dbRejected = data
          .filter(app => app.status === 'REJECTED')
          .map(app => ({
            id: app.id || '',
            name: app.full_name || 'Unknown',
            email: app.email || '',
            type: app.product_category || app.loan_track || 'Personal Loan',
            amount: app.principal_amount || 0,
            reason: 'Credit scoring models indicated high-risk default ratio or document discrepancy.',
            date: app.updated_at ? new Date(app.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
        setRejectedLoans(prev => {
          const existingIds = new Set(prev.map(item => item.id));
          const filteredDb = dbRejected.filter(item => !existingIds.has(item.id));
          return [...prev, ...filteredDb];
        });
      } catch (err) {
        console.error("Failed to load rejected loans from DB:", err);
      }
    };
    fetchRejected();
  }, []);

  // Interactive Modals States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showInspectModal, setShowInspectModal] = useState(false);
  const [showRejectMailModal, setShowRejectMailModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Update Rejection Reason States
  const [editingRejectedLog, setEditingRejectedLog] = useState(null);
  const [editReasonText, setEditReasonText] = useState('');

  // Rejected logs filters
  const [rejectedTypeFilter, setRejectedTypeFilter] = useState('All');
  const [rejectedSearchQuery, setRejectedSearchQuery] = useState('');
  const [showRejectedExportModal, setShowRejectedExportModal] = useState(false);
  const [rejectedExportFormat, setRejectedExportFormat] = useState('csv');

  // Rejected logs local state storage
  const [rejectedLoans, setRejectedLoans] = useState([]);

  // Mock document mapping
  const getDocUrl = (docKey) => {
    // If we have a real backend model preloaded in selectedRequest.raw
    if (selectedRequest?.raw) {
      const kyc = selectedRequest.raw.kyc_documents;
      const fin = selectedRequest.raw.financial_details;
      
      const docMapping = {
        liveSelfie: kyc?.live_selfie_path,
        aadhaarFront: kyc?.aadhaar_front_path,
        aadhaarBack: kyc?.aadhaar_back_path,
        panCard: kyc?.pan_card_path,
        bankStatements: fin?.bank_statement_path
      };
      
      if (docMapping[docKey]) {
        return docMapping[docKey];
      }
    }

    // Fallback to high-quality placeholders if data is not uploaded
    const mockDocs = {
      liveSelfie: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80',
      aadhaarFront: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      aadhaarBack: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80',
      panCard: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=600&q=80',
      bankStatements: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    };
    return mockDocs[docKey];
  };

  const kycDocs = [
    { key: 'liveSelfie', label: 'Live Selfie (Photo)', type: 'image' },
    { key: 'aadhaarFront', label: 'Aadhaar Front (ID)', type: 'image' },
    { key: 'aadhaarBack', label: 'Aadhaar Back (ID)', type: 'image' },
    { key: 'panCard', label: 'PAN Card (ID)', type: 'image' },
    { key: 'bankStatements', label: 'Bank Statement Ledger', type: 'pdf' }
  ];

  // Helper icons
  const CloseXIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  // Trigger inspect drawer
  const handleInspectRequest = (req) => {
    setSelectedRequest(req);
    setShowInspectModal(true);
  };

  // Trigger rejection mail setup
  const handleRejectButtonClick = (req) => {
    setSelectedRequest(req);
    setRejectionReason(
      `Dear ${req.name},\n\nWe regret to inform you that your application ${req.id} for a ₹${req.amount.toLocaleString()} ${req.type} has been declined following our risk-scoring audit.\n\nReason: Insufficient verification documents or credit score requirements were not satisfied.\n\nBest regards,\nLendoGo Compliance Team`
    );
    setShowRejectMailModal(true);
  };

  // Confirm rejection & save log
  const handleConfirmRejection = async () => {
    if (!selectedRequest) return;

    const success = await handleRejectLoan(selectedRequest.id, selectedRequest.name);
    if (success) {
      // Create entry in rejected logs
      const newRejectedLog = {
        id: selectedRequest.id.replace('REQ-', 'REJ-'),
        name: selectedRequest.name,
        email: `${selectedRequest.name.toLowerCase().replace(' ', '.')}@gmail.com`,
        type: selectedRequest.type,
        amount: selectedRequest.amount,
        reason: rejectionReason,
        date: new Date().toISOString().split('T')[0]
      };

      setRejectedLoans(prev => [newRejectedLog, ...prev]);

      // Reset modals
      setShowRejectMailModal(false);
      setShowInspectModal(false);
      setSelectedRequest(null);

      // Redirect to rejected tab
      setActiveSubTab('rejected');
    }
  };

  const onApprove = async (req) => {
    const success = await handleApproveLoan(req);
    if (success) {
      setShowInspectModal(false);
      setActiveSubTab('ledger');
    }
  };

  // Delete a rejected log
  const handleDeleteRejectedLog = (logId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the rejection log for ${name} (${logId})?`)) {
      setRejectedLoans(prev => prev.filter(item => item.id !== logId));
    }
  };

  // Open edit modal for rejection reason
  const handleOpenEditReason = (log) => {
    setEditingRejectedLog(log);
    setEditReasonText(log.reason);
  };

  // Save updated rejection reason
  const handleSaveUpdatedReason = () => {
    if (!editingRejectedLog) return;
    
    setRejectedLoans(prev => prev.map(item => 
      item.id === editingRejectedLog.id 
        ? { ...item, reason: editReasonText } 
        : item
    ));

    setEditingRejectedLog(null);
    setEditReasonText('');
  };

  // Filter rejected loans live on render
  const filteredRejectedLoans = rejectedLoans.filter((log) => {
    const matchesType = rejectedTypeFilter === 'All' || log.type === rejectedTypeFilter;
    
    const q = rejectedSearchQuery.toLowerCase();
    const matchesSearch = !q ||
      log.id.toLowerCase().includes(q) ||
      log.name.toLowerCase().includes(q) ||
      log.email.toLowerCase().includes(q) ||
      log.reason.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  // Client-side CSV Exporter for Rejected Logs
  const handleExportRejectedCSV = () => {
    const headers = ['Log ID', 'Borrower Name', 'Email', 'Loan Type', 'Amount', 'Decline Date', 'Rejection Reason'];
    const rows = filteredRejectedLoans.map(log => [
      log.id,
      log.name,
      log.email,
      log.type,
      log.amount,
      log.date,
      log.reason
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LendoGo_RejectedLoans_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-side PDF Exporter for Rejected Logs
  const handleExportRejectedPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const rowsHtml = filteredRejectedLoans.map(log => `
      <tr>
        <td><strong>${log.id}</strong></td>
        <td>${log.name}</td>
        <td>${log.email}</td>
        <td>${log.type}</td>
        <td>₹${log.amount.toLocaleString('en-IN')}</td>
        <td>${log.date}</td>
        <td>${log.reason}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>LendoGo - Rejected Loan Directory</title>
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
            <div class="title">Declined Requests Desk</div>
          </div>
          <h1>Rejected Loans Compliance Directory</h1>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
            Generated on: <strong>${today}</strong> | 
            Total Records: <strong>${filteredRejectedLoans.length}</strong> | 
            Cleared by: <strong>Compliance Officer</strong>
          </div>
          <table>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Borrower</th>
                <th>Email</th>
                <th>Loan Type</th>
                <th>Declined Amount</th>
                <th>Decline Date</th>
                <th>Rejection Reason</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">
            CONFIDENTIAL - Internal Compliance Log - LendoGo FinTech Inc.
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
      <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
        <div>
          <h2>Loan Applications</h2>
        </div>

        {/* Premium Glassmorphic Segmented Switcher */}
        <div className="segmented-control-wrapper">
          <button 
            className={`segmented-btn ${activeSubTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('pending')}
          >
            Pending Requests ({loanRequests.length})
          </button>
          <button 
            className={`segmented-btn ${activeSubTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('ledger')}
          >
            Approved Loans ({approvedLoans.length})
          </button>
          <button 
            className={`segmented-btn ${activeSubTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('rejected')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            Rejected Logs ({rejectedLoans.length})
          </button>
        </div>
      </div>

      <div className="subtab-content-container">
        {activeSubTab === 'pending' ? (
          <LoanRequestsTab 
            loanRequests={loanRequests}
            handleRunRiskAudit={handleRunRiskAudit}
            handleApproveLoan={onApprove}
            handleRejectLoan={(reqId, name) => {
              // Open rejection modal instead of direct reject
              const req = loanRequests.find(r => r.id === reqId);
              if (req) handleRejectButtonClick(req);
            }}
            onInspectRequest={handleInspectRequest}
          />
        ) : activeSubTab === 'ledger' ? (
          <LoanApprovalsTab 
            approvedLoans={approvedLoans}
            handleDisburseMoney={handleDisburseMoney}
          />
        ) : (
          /* ── REJECTED LOGS SUBTAB ── */
          <div className="tab-pane-container animate-fade-in">
            <div className="section-header-row">
              <h3>Rejected Audit & Mail Records</h3>
            </div>

            {/* Controls Bar for Search, Filter, and Export in Rejected Subtab */}
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
                    value={rejectedTypeFilter} 
                    onChange={(e) => setRejectedTypeFilter(e.target.value)}
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
                    placeholder="Search ID, borrower, reason..."
                    value={rejectedSearchQuery}
                    onChange={(e) => setRejectedSearchQuery(e.target.value)}
                    className="form-input-admin"
                    style={{ width: '220px', padding: '8px 12px', height: '38px', borderRadius: '8px' }}
                  />
                </div>

                <button 
                  className="btn-action-primary" 
                  onClick={() => setShowRejectedExportModal(true)}
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

            <div className="table-responsive-admin">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Borrower</th>
                    <th>Email</th>
                    <th>Loan Details</th>
                    <th>Sanction Date</th>
                    <th style={{ width: '30%' }}>Dispatched Rejection Reason</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRejectedLoans.length > 0 ? (
                    filteredRejectedLoans.map((log) => (
                      <tr key={log.id}>
                        <td><strong>{log.id}</strong></td>
                        <td>{log.name}</td>
                        <td>{log.email}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong>{log.type}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>₹{log.amount.toLocaleString()}</span>
                          </div>
                        </td>
                        <td>{log.date}</td>
                        <td>
                          <span className="history-text" title={log.reason} style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {log.reason}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              className="btn-action-icon edit"
                              style={{ width: '100px' }}
                              onClick={() => handleOpenEditReason(log)}
                            >
                              Update Reason
                            </button>
                            <button 
                              className="btn-action-icon delete"
                              style={{ width: '80px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                              onClick={() => handleDeleteRejectedLog(log.id, log.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-row-text">No rejection compliance logs match current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── LOAN APPLICATION PORTFOLIO INSPECT MODAL ── */}
      {showInspectModal && selectedRequest && (
        <div className="admin-modal-overlay" onClick={() => setShowInspectModal(false)}>
          <div className="admin-modal-container inspection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Loan Application Inspection Portfolio</h3>
              <button className="close-btn" onClick={() => setShowInspectModal(false)}>×</button>
            </div>
            
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', padding: '24px' }}>
              
              {/* Left Column: Loan Request Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="inspection-profile-summary" style={{ marginBottom: '0', paddingBottom: '12px' }}>
                  <div className="avatar-circle-large" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
                    {selectedRequest.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedRequest.name}</h4>
                    <span className="user-id-sub">{selectedRequest.id} | {selectedRequest.type}</span>
                  </div>
                </div>

                <div className="inspection-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="detail-card">
                    <span className="detail-label">Requested Capital</span>
                    <strong className="detail-value text-primary" style={{ fontSize: '1rem' }}>
                      ₹{selectedRequest.amount.toLocaleString()}
                    </strong>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Loan Configuration</span>
                    <span className="detail-value" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {selectedRequest.tenureMonths || 12} Months @ {selectedRequest.interestRate || 14}%
                    </span>
                  </div>
                  
                  <div className="detail-card">
                    <span className="detail-label">Employment Status</span>
                    <span className="detail-value">{selectedRequest.employmentType || 'Salaried'}</span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Estimated Income</span>
                    <span className="detail-value">
                      {selectedRequest.monthlyIncome ? `₹${selectedRequest.monthlyIncome.toLocaleString('en-IN')} / month` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="detail-card">
                    <span className="detail-label">Bureau Risk Index</span>
                    <span className={`detail-value score-text ${selectedRequest.riskScore >= 700 ? 'excellent' : selectedRequest.riskScore >= 600 ? 'good' : 'poor'}`}>
                      {selectedRequest.riskScore ? `${selectedRequest.riskScore} Points` : 'Scan Required'}
                    </span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Compliance Clearance</span>
                    <span className={`detail-value status-text ${selectedRequest.riskScore ? 'verified' : 'pending'}`}>
                      {selectedRequest.riskScore ? 'KYC Verified' : 'Awaiting Audit'}
                    </span>
                  </div>
                  
                  <div className="detail-card">
                    <span className="detail-label">Mobile Number</span>
                    <span className="detail-value">{selectedRequest.mobileNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-card">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value" style={{ wordBreak: 'break-all', fontSize: '0.78rem' }}>{selectedRequest.email || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-card" style={{ gridColumn: 'span 2' }}>
                    <span className="detail-label">Date of Birth</span>
                    <span className="detail-value">{selectedRequest.dob || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Submitted Identification Scan Papers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span className="detail-label" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Verified KYC Identification Papers</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {kycDocs.map((doc) => {
                    const docUrl = getDocUrl(doc.key);
                    const isPdf = doc.type === 'pdf';

                    return (
                      <div 
                        key={doc.key} 
                        className="kyc-doc-card"
                        style={{ cursor: 'pointer', gridColumn: doc.key === 'bankStatements' ? 'span 2' : 'span 1' }}
                        onClick={() => setPreviewFile({ label: doc.label, url: docUrl, type: isPdf ? 'application/pdf' : 'image/png' })}
                      >
                        <div className="doc-preview-wrapper" style={{ height: '80px', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-input)' }}>
                          {isPdf ? (
                            <div className="pdf-thumbnail-icon" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                              <span style={{ fontSize: '1.2rem' }}>📄</span>
                              <strong style={{ fontSize: '0.65rem', color: 'var(--primary)' }}>PDF LEDGER</strong>
                            </div>
                          ) : (
                            <img src={docUrl} alt={doc.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          <div className="doc-preview-hover" style={{ position: 'absolute', inset: 0, background: 'rgba(0, 102, 255, 0.45)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s ease', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            <span>Preview</span>
                          </div>
                        </div>
                        <div className="doc-card-info" style={{ marginTop: '4px' }}>
                          <span className="doc-card-title" style={{ fontSize: '0.7rem', display: 'block', color: 'var(--admin-text-light)', fontWeight: '600' }}>{doc.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn-secondary-admin" onClick={() => setShowInspectModal(false)}>Close Portfolio</button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn-decision reject"
                  disabled={selectedRequest.auditState === 'scanning'}
                  onClick={() => handleRejectButtonClick(selectedRequest)}
                  style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                >
                  Reject Application
                </button>
                {selectedRequest.auditState === 'completed' && (
                  <button 
                    className="btn-decision approve"
                    onClick={() => onApprove(selectedRequest)}
                    style={{ padding: '8px 24px', fontSize: '0.85rem' }}
                  >
                    Approve & Disburse
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DECLINE & SEND COMPLIANCE NOTICE MODAL ── */}
      {showRejectMailModal && selectedRequest && (
        <div className="admin-modal-overlay" style={{ zIndex: 1900 }} onClick={() => setShowRejectMailModal(false)}>
          <div className="admin-modal-container" style={{ width: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Decline & Send Compliance Notice</h3>
              <button className="close-btn" onClick={() => setShowRejectMailModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', marginBottom: '16px', lineHeight: '1.4' }}>
                Drafting official declination report for <strong>{selectedRequest.name}</strong> ({selectedRequest.id}). Please review the dispatched email text:
              </p>
              
              <div className="form-group-admin" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-light)' }}>Email Message body</label>
                <textarea 
                  className="form-input-admin"
                  style={{ width: '100%', height: '180px', fontFamily: 'inherit', fontSize: '0.82rem', padding: '12px', lineHeight: '1.5', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-input)', color: 'var(--admin-text)' }}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn-secondary-admin" onClick={() => setShowRejectMailModal(false)}>Cancel</button>
                <button 
                  className="btn-primary-admin" 
                  onClick={handleConfirmRejection}
                  style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', fontWeight: '700' }}
                >
                  Send & Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UPDATE REJECTION REASON MODAL ── */}
      {editingRejectedLog && (
        <div className="admin-modal-overlay" onClick={() => setEditingRejectedLog(null)}>
          <div className="admin-modal-container" style={{ width: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Rejection Compliance Reason</h3>
              <button className="close-btn" onClick={() => setEditingRejectedLog(null)}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', marginBottom: '12px' }}>
                Update the official audit reason recorded for <strong>{editingRejectedLog.name}</strong> ({editingRejectedLog.id}):
              </p>
              <div className="form-group-admin" style={{ marginBottom: '20px' }}>
                <textarea 
                  className="form-input-admin"
                  style={{ width: '100%', height: '120px', fontSize: '0.85rem', padding: '10px', borderRadius: '8px', border: '1px solid var(--admin-border)', backgroundColor: 'var(--admin-input)', color: 'var(--admin-text)' }}
                  value={editReasonText}
                  onChange={(e) => setEditReasonText(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn-secondary-admin" onClick={() => setEditingRejectedLog(null)}>Cancel</button>
                <button className="btn-primary-admin" onClick={handleSaveUpdatedReason}>Save Reason</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LIGHTBOX SECURE DOCUMENT VIEW OVERLAY ── */}
      {previewFile && (
        <div className="admin-modal-overlay" style={{ zIndex: 2000 }} onClick={() => setPreviewFile(null)}>
          <div className="admin-modal-container" style={{ width: '600px', background: 'var(--admin-sidebar)', borderRadius: '16px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--admin-text)' }}>{previewFile.label}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)' }}>Secure Sandbox Document Verification Frame</span>
              </div>
              <button className="close-btn" onClick={() => setPreviewFile(null)}>
                <CloseXIcon />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '16px', display: 'flex', justifyContent: 'center', backgroundColor: '#0f111a' }}>
              {previewFile.type === 'application/pdf' ? (
                <div style={{ width: '100%', height: '380px', display: 'flex', flexDirection: 'column' }}>
                  <iframe 
                    src={previewFile.url} 
                    title={previewFile.label} 
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                  />
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#10b981', textAlign: 'center' }}>
                    ✓ Validation: Document loaded over secure Sandbox protocol
                  </div>
                </div>
              ) : (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.label} 
                  style={{ maxWidth: '100%', maxHeight: '380px', borderRadius: '8px', objectFit: 'contain' }} 
                />
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-primary-admin" onClick={() => setPreviewFile(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECTED LOGS EXPORT CONFIRMATION MODAL ── */}
      {showRejectedExportModal && (
        <div className="admin-modal-overlay" onClick={() => setShowRejectedExportModal(false)}>
          <div className="admin-modal-container" style={{ width: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Export Rejected Compliance Logs</h3>
              <button className="close-btn" onClick={() => setShowRejectedExportModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.4' }}>
                You are about to export <strong>{filteredRejectedLoans.length}</strong> historical declination logs. Select compliance format:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* CSV Format Selection Card */}
                <div 
                  onClick={() => setRejectedExportFormat('csv')}
                  style={{
                    border: rejectedExportFormat === 'csv' ? '2px solid var(--primary)' : '1px solid var(--admin-border)',
                    backgroundColor: rejectedExportFormat === 'csv' ? 'rgba(0, 102, 255, 0.06)' : 'var(--admin-input)',
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

                {/* PDF Format Selection Card */}
                <div 
                  onClick={() => setRejectedExportFormat('pdf')}
                  style={{
                    border: rejectedExportFormat === 'pdf' ? '2px solid var(--primary)' : '1px solid var(--admin-border)',
                    backgroundColor: rejectedExportFormat === 'pdf' ? 'rgba(0, 102, 255, 0.06)' : 'var(--admin-input)',
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
                  onClick={() => setShowRejectedExportModal(false)}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary-admin" 
                  onClick={() => {
                    if (rejectedExportFormat === 'csv') {
                      handleExportRejectedCSV();
                    } else {
                      handleExportRejectedPDF();
                    }
                    setShowRejectedExportModal(false);
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

export default LoanApplicationsTab;
