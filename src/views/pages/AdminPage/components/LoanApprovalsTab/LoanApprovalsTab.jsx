import React, { useState } from 'react';

const LoanApprovalsTab = ({ approvedLoans, handleDisburseMoney }) => {
  // Filter, Search, and Export states
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' or 'pdf'

  // Send Money state variables
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [feeOption, setFeeOption] = useState('2.5%'); // '2.5%', '5.0%', 'custom'
  const [customFee, setCustomFee] = useState('');
  const [authorizedChecked, setAuthorizedChecked] = useState(false);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [disbursalSuccess, setDisbursalSuccess] = useState(false);
  const [disbursalReceipt, setDisbursalReceipt] = useState(null);

  // Live filter approved dataset
  const filteredLoans = approvedLoans.filter((loan) => {
    const matchesType = typeFilter === 'All' || loan.type === typeFilter;
    
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      loan.id.toLowerCase().includes(q) ||
      loan.name.toLowerCase().includes(q) ||
      loan.type.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  // Client-side CSV Exporter
  const handleExportCSV = () => {
    const headers = ['Loan ID', 'Borrower Name', 'Loan Type', 'Capital Sanctioned', 'Interest Rate', 'Sanction Date', 'Status'];
    const rows = filteredLoans.map(loan => [
      loan.id,
      loan.name,
      loan.type,
      loan.amount,
      `${loan.rate}% Fixed`,
      loan.date,
      loan.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LendoGo_ApprovedLoans_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Client-side PDF Exporter
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const rowsHtml = filteredLoans.map(loan => `
      <tr>
        <td><strong>${loan.id}</strong></td>
        <td>${loan.name}</td>
        <td>${loan.type}</td>
        <td>₹${loan.amount.toLocaleString('en-IN')}</td>
        <td>${loan.rate}% Fixed</td>
        <td>${loan.date}</td>
        <td><span class="status verified">${loan.status}</span></td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>LendoGo - Approved Disbursements Ledger</title>
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
            .status {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .status.verified { background-color: #d1fae5; color: #059669; }
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
            <div class="title">Active Portfolio Desk</div>
          </div>
          <h1>Approved Capital Disbursements Ledger</h1>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 20px;">
            Generated on: <strong>${today}</strong> | 
            Total Approved Loans: <strong>${filteredLoans.length}</strong> | 
            Verified by: <strong>Administrator Portfolio Manager</strong>
          </div>
          <table>
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Borrower Name</th>
                <th>Loan Type</th>
                <th>Capital Sanctioned</th>
                <th>Interest Rate</th>
                <th>Date of Disbursal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <div class="footer">
            CONFIDENTIAL - Internal Financial Audit Ledger - LendoGo FinTech Inc.
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

  // Fee calculation helper
  const getFeeAmount = () => {
    if (!selectedLoan) return 0;
    if (feeOption === '2.5%') return Math.round(selectedLoan.amount * 0.025);
    if (feeOption === '5.0%') return Math.round(selectedLoan.amount * 0.05);
    return Number(customFee) || 0;
  };

  // Payout confirmation handler
  const handleConfirmDisbursal = () => {
    if (!selectedLoan || !authorizedChecked) return;
    setIsDisbursing(true);

    const feeVal = getFeeAmount();
    const netPayout = selectedLoan.amount - feeVal;

    setTimeout(() => {
      // Execute state changes in controller hook
      handleDisburseMoney(selectedLoan.id, feeVal);

      // Store local receipt data to render successful transfer screen
      setDisbursalReceipt({
        id: selectedLoan.id,
        name: selectedLoan.name,
        amount: selectedLoan.amount,
        fee: feeVal,
        net: netPayout,
        date: new Date().toLocaleDateString(),
        ref: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`
      });

      setIsDisbursing(false);
      setDisbursalSuccess(true);
    }, 1800);
  };

  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>Sanctioned Disbursements Ledger</h2>
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
              placeholder="Search by ID, borrower, type..."
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

      <div className="table-responsive-admin">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Borrower</th>
              <th>Type</th>
              <th>Capital Sanctioned</th>
              <th>Interest P.A.</th>
              <th>Sanction Date</th>
              <th>Disbursal Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr key={loan.id}>
                  <td><strong>{loan.id}</strong></td>
                  <td>{loan.name}</td>
                  <td>{loan.type}</td>
                  <td className="text-primary font-weight-bold">₹{loan.amount.toLocaleString('en-IN')}</td>
                  <td>{loan.rate}% Fixed</td>
                  <td>{loan.date}</td>
                  <td>
                    <span className="status-badge" style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'inline-block',
                      backgroundColor: loan.status.toLowerCase() === 'disbursed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: loan.status.toLowerCase() === 'disbursed' ? '#10b981' : '#f59e0b'
                    }}>
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    {loan.status.toLowerCase() === 'pre-approved' ? (
                      <button
                        className="btn-action-primary"
                        onClick={() => {
                          setSelectedLoan(loan);
                          setFeeOption('2.5%');
                          setCustomFee('');
                          setAuthorizedChecked(false);
                          setDisbursalSuccess(false);
                          setDisbursalReceipt(null);
                        }}
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                          color: '#fff',
                          cursor: 'pointer',
                          border: 'none',
                          boxShadow: '0 2px 6px rgba(0,102,255,0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Send Money
                      </button>
                    ) : (
                      <button
                        disabled
                        style={{
                          padding: '6px 14px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          borderRadius: '6px',
                          background: 'rgba(255,255,255,0.04)',
                          color: 'var(--admin-text-light)',
                          border: '1px solid var(--admin-border)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          opacity: 0.6
                        }}
                      >
                        Sent to Wallet
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-row-text">No approved capital records match selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── EXPORT CONFIRMATION MODAL ── */}
      {showExportModal && (
        <div className="admin-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="admin-modal-container" style={{ width: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Export Approved Loans Data</h3>
              <button className="close-btn" onClick={() => setShowExportModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '24px' }}>
              <p style={{ color: 'var(--admin-text-light)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.4' }}>
                You are about to export <strong>{filteredLoans.length}</strong> sanctioned loan records. Select compliance format:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--admin-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: 'var(--admin-text)'
                }}>
                  <input 
                    type="radio" 
                    name="exportFormat" 
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span>Commas Separated Sheet (.CSV)</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--admin-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: 'var(--admin-text)'
                }}>
                  <input 
                    type="radio" 
                    name="exportFormat" 
                    value="pdf"
                    checked={exportFormat === 'pdf'}
                    onChange={(e) => setExportFormat(e.target.value)}
                  />
                  <span>Standard Printable Report (.PDF)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn-action-secondary" onClick={() => setShowExportModal(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-action-primary" 
                  onClick={() => {
                    if (exportFormat === 'csv') {
                      handleExportCSV();
                    } else {
                      handleExportPDF();
                    }
                    setShowExportModal(false);
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#fff',
                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  ✓ Confirm Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SEND MONEY TO WALLET MODAL ── */}
      {selectedLoan && (
        <div className="admin-modal-overlay animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 999
        }} onClick={() => {
          if (!isDisbursing) setSelectedLoan(null);
        }}>
          <div className="admin-modal-container scale-up" style={{
            width: '520px',
            backgroundColor: 'var(--admin-sidebar)',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="modal-header" style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--admin-text)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Wallet Disbursal System
              </h3>
              {!isDisbursing && (
                <button 
                  className="close-btn" 
                  onClick={() => setSelectedLoan(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--admin-text-light)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                >×</button>
              )}
            </div>

            {/* Modal Body */}
            {!disbursalSuccess ? (
              <div className="modal-body" style={{ padding: '24px' }}>
                {/* Borrower Card */}
                <div style={{
                  backgroundColor: 'var(--admin-bg)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)', fontWeight: '700', textTransform: 'uppercase' }}>Recipient Borrower</span>
                    <span style={{ fontSize: '0.8rem', color: '#0066ff', fontWeight: '800' }}>{selectedLoan.id}</span>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--admin-text)', margin: '0 0 4px 0' }}>{selectedLoan.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', margin: 0 }}>{selectedLoan.type}</p>
                </div>

                {/* Calculation Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  {/* Approved Amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-light)' }}>Capital Sanctioned</span>
                    <span style={{ fontSize: '1.1rem', color: 'var(--admin-text)', fontWeight: '800' }}>₹{selectedLoan.amount.toLocaleString('en-IN')}.00</span>
                  </div>

                  {/* Fee Deduction Select */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-light)' }}>Platform Processing Fee</span>
                      <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>Deducted prior to vault payout</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        value={feeOption}
                        onChange={(e) => setFeeOption(e.target.value)}
                        className="form-input-admin"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          height: '34px',
                          cursor: 'pointer',
                          backgroundColor: 'var(--admin-input)',
                          border: '1px solid var(--admin-border)',
                          color: 'var(--admin-text)'
                        }}
                      >
                        <option value="2.5%">Standard (2.5%)</option>
                        <option value="5.0%">Premium (5.0%)</option>
                        <option value="custom">Custom Flat Fee</option>
                      </select>
                      
                      {feeOption === 'custom' && (
                        <input
                          type="number"
                          placeholder="₹ Flat Amount"
                          value={customFee}
                          onChange={(e) => setCustomFee(e.target.value)}
                          className="form-input-admin"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            width: '110px',
                            height: '34px',
                            backgroundColor: 'var(--admin-input)',
                            border: '1px solid var(--admin-border)',
                            color: 'var(--admin-text)'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Fee Amount Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--admin-border)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--admin-text-light)' }}>Platform Fee Charge</span>
                    <span style={{ fontSize: '1rem', color: '#ef4444', fontWeight: '700' }}>- ₹{getFeeAmount().toLocaleString('en-IN')}.00</span>
                  </div>

                  {/* Net Wallet Payout */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,102,255,0.06)',
                    border: '1px solid rgba(0,102,255,0.15)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginTop: '6px'
                  }}>
                    <span style={{ fontSize: '0.95rem', color: 'var(--admin-text)', fontWeight: '700' }}>Net Wallet Payout</span>
                    <span style={{ fontSize: '1.3rem', color: '#10b981', fontWeight: '900' }}>
                      ₹{(selectedLoan.amount - getFeeAmount()).toLocaleString('en-IN')}.00
                    </span>
                  </div>
                </div>

                {/* Routing & Verification info */}
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  color: 'var(--admin-text-light)',
                  lineHeight: '1.4',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontWeight: '700', color: 'var(--admin-text)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Destination Node Verified
                  </div>
                  Destination: <strong>LendoGo Hot-Wallet (LGO-WLT-${selectedLoan.id}-${selectedLoan.name.split(' ')[0].toUpperCase()})</strong>
                </div>

                {/* Authorize checkbox */}
                <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer', marginBottom: '24px' }}>
                  <input
                    type="checkbox"
                    checked={authorizedChecked}
                    onChange={(e) => setAuthorizedChecked(e.target.checked)}
                    disabled={isDisbursing}
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-light)', lineHeight: '1.4' }}>
                    I authorize this immediate vault disbursal. I confirm that all KYC paperwork has been fully audited and platform fee structures are settled.
                  </span>
                </label>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    className="btn-action-secondary"
                    onClick={() => setSelectedLoan(null)}
                    disabled={isDisbursing}
                    style={{
                      height: '42px',
                      padding: '0 20px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDisbursal}
                    disabled={!authorizedChecked || isDisbursing || getFeeAmount() >= selectedLoan.amount}
                    style={{
                      height: '42px',
                      padding: '0 24px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      background: authorizedChecked && !isDisbursing ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255,255,255,0.05)',
                      color: authorizedChecked && !isDisbursing ? '#fff' : 'var(--admin-text-light)',
                      border: 'none',
                      cursor: authorizedChecked && !isDisbursing ? 'pointer' : 'not-allowed',
                      boxShadow: authorizedChecked && !isDisbursing ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.25s'
                    }}
                  >
                    {isDisbursing ? (
                      <>
                        <span className="spinner-dots" style={{ display: 'inline-block' }}>Processing...</span>
                      </>
                    ) : (
                      <>
                        Authorize & Send
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Success Screen */
              <div className="modal-body" style={{ padding: '36px 24px', textAlign: 'center' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginBottom: '20px'
                }}>
                  ✓
                </div>
                
                <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--admin-text)', margin: '0 0 8px 0' }}>
                  Wallet Disbursal Success
                </h4>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--admin-text-light)', margin: '0 0 24px 0', lineHeight: '1.4' }}>
                  Payout transaction authorized and finalized. The capital has been successfully credited directly to the borrower's digital account wallet.
                </p>

                {/* Receipt Card */}
                {disbursalReceipt && (
                  <div style={{
                    backgroundColor: 'var(--admin-bg)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'left',
                    marginBottom: '24px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-light)' }}>Transaction Reference</span>
                      <strong style={{ color: 'var(--admin-text)', fontFamily: 'monospace' }}>{disbursalReceipt.ref}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-light)' }}>Borrower Ledger</span>
                      <strong style={{ color: 'var(--admin-text)' }}>{disbursalReceipt.name} ({disbursalReceipt.id})</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--admin-border)', paddingTop: '10px' }}>
                      <span style={{ color: 'var(--admin-text-light)' }}>Approved Principal</span>
                      <span style={{ color: 'var(--admin-text)', fontWeight: '700' }}>₹{disbursalReceipt.amount.toLocaleString('en-IN')}.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--admin-text-light)' }}>Platform Fee (Settled)</span>
                      <span style={{ color: '#ef4444', fontWeight: '700' }}>₹{disbursalReceipt.fee.toLocaleString('en-IN')}.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--admin-border)', paddingTop: '10px' }}>
                      <span style={{ color: 'var(--admin-text)', fontWeight: '700' }}>Net Credited to Wallet</span>
                      <strong style={{ color: '#10b981', fontSize: '1.05rem', fontWeight: '800' }}>₹{disbursalReceipt.net.toLocaleString('en-IN')}.00</strong>
                    </div>
                  </div>
                )}

                <button
                  className="btn-action-primary"
                  onClick={() => setSelectedLoan(null)}
                  style={{
                    height: '42px',
                    padding: '0 32px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #0066ff 0%, #0052cc 100%)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,102,255,0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApprovalsTab;
