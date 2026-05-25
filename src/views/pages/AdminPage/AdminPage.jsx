import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();

  // Theme & Navigation States
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Sliders & Web Config States
  const [minCreditScore, setMinCreditScore] = useState(650);
  const [baseInterestRate, setBaseInterestRate] = useState(14);
  const [isSignupsEnabled, setIsSignupsEnabled] = useState(true);
  const [isConsultationsEnabled, setIsConsultationsEnabled] = useState(true);

  // Simulated Global Financial Ledger States
  const [activeBalance, setActiveBalance] = useState(3259800);
  const [disbursedCapital, setDisbursedCapital] = useState(4528450);

  // ─── ADMIN PERSONAL DETAIL STATES ───
  const [adminAvatar, setAdminAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [adminName, setAdminName] = useState('Admin Flow');
  const [adminEmail, setAdminEmail] = useState('admin.flow@lendogo.com');

  // ─── INPUT STATES FOR SETTINGS FORMS ───
  const [emailInput, setEmailInput] = useState('admin.flow@lendogo.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [transferKey, setTransferKey] = useState('');

  // 1. Audit Logs Dataset State
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: '2026-05-25 15:42:01', user: 'System Sentinel', action: 'KYC Auto-Sync completed successfully', type: 'info' },
    { id: 2, timestamp: '2026-05-25 14:15:30', user: 'Lending Officer (Admin)', action: 'Interest rate minimum index set to 14%', type: 'info' },
    { id: 3, timestamp: '2026-05-25 11:20:10', user: 'Security Bot', action: 'Failed login warning: 3 incorrect attempts for user test@lendo.go', type: 'warning' },
    { id: 4, timestamp: '2026-05-25 09:05:12', user: 'System Sentinel', action: 'Cron Ledger backup archived to cloud container', type: 'success' }
  ]);

  const addAuditLog = (action, type = 'info') => {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
    setAuditLogs(prev => [
      { id: Date.now(), timestamp: timeStr, user: 'Lending Officer (Admin)', action, type },
      ...prev
    ]);
  };

  // 2. User Directory dataset
  const [users, setUsers] = useState([
    { id: 'USR-8812', name: 'Rahul S.', email: 'rahul.s@gmail.com', PAN: 'APM***32P', rating: 'Low Risk', status: 'Active', joined: 'Jan 12, 2026' },
    { id: 'USR-9021', name: 'Aarav Mehta', email: 'aarav.m@yahoo.com', PAN: 'BFK***91K', rating: 'Low Risk', status: 'Active', joined: 'Feb 18, 2026' },
    { id: 'USR-3042', name: 'Priya Kapoor', email: 'priya.k@gmail.com', PAN: 'DKL***84D', rating: 'Medium Risk', status: 'Active', joined: 'Mar 05, 2026' },
    { id: 'USR-6651', name: 'Sneha Rao', email: 'sneha.rao@hotmail.com', PAN: 'CPS***74S', rating: 'High Risk', status: 'Active', joined: 'Apr 24, 2026' },
    { id: 'USR-1190', name: 'Kabir Das', email: 'kabir.d@outlook.com', PAN: 'GMS***15M', rating: 'Low Risk', status: 'Suspended', joined: 'May 02, 2026' }
  ]);

  const handleToggleUserStatus = (userId, userName, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    addAuditLog(`User ${userName} (${userId}) status updated to ${nextStatus}`, nextStatus === 'Suspended' ? 'warning' : 'success');
  };

  // 3. Interactive Loan Requests Dataset
  const [loanRequests, setLoanRequests] = useState([
    { id: 'REQ-104', name: 'Devendra P.', type: 'Personal Loan', amount: 150000, PAN: 'AR***44P', riskScore: null, auditState: 'idle' },
    { id: 'REQ-209', name: 'Ananya Sen', type: 'Business Loan', amount: 500000, PAN: 'BR***18K', riskScore: null, auditState: 'idle' },
    { id: 'REQ-312', name: 'Gaurav Gill', type: 'Auto Loan', amount: 350000, PAN: 'DR***92D', riskScore: null, auditState: 'idle' },
    { id: 'REQ-455', name: 'Megha Varma', type: 'Home Loan', amount: 1200000, PAN: 'CR***07S', riskScore: null, auditState: 'idle' }
  ]);

  // Simulated Audit Scoring Model
  const handleRunRiskAudit = (reqId) => {
    setLoanRequests(prev => prev.map(r => r.id === reqId ? { ...r, auditState: 'scanning' } : r));
    
    setTimeout(() => {
      const generatedScore = Math.floor(Math.random() * (850 - 580 + 1)) + 580; // between 580 and 850
      setLoanRequests(prev => prev.map(r => {
        if (r.id === reqId) {
          return {
            ...r,
            riskScore: generatedScore,
            auditState: 'completed'
          };
        }
        return r;
      }));
      addAuditLog(`Risk analysis compiled for request ${reqId}. Calculated Credit Score: ${generatedScore}`, 'info');
    }, 1500);
  };

  // Decision Handlers
  const handleApproveLoan = (request) => {
    const newApproval = {
      id: `LN-${Math.floor(10000 + Math.random() * 90000)}`,
      name: request.name,
      type: request.type,
      amount: request.amount,
      rate: baseInterestRate,
      date: new Date().toLocaleDateString(),
      status: 'Pre-Approved'
    };
    
    setApprovedLoans(prev => [newApproval, ...prev]);
    setLoanRequests(prev => prev.filter(r => r.id !== request.id));
    setActiveBalance(prev => prev + request.amount);
    setDisbursedCapital(prev => prev + request.amount);
    setLiveMarquee(prev => [
      { name: `${request.name} (PAN: ${request.PAN})`, type: request.type, amount: `₹${request.amount.toLocaleString()}`, status: '⚡' },
      ...prev
    ]);
    
    addAuditLog(`Sanctioned loan approval for ${request.name}. Disbursed Capital: ₹${request.amount.toLocaleString()}`, 'success');
    alert(`Loan ${request.id} successfully approved and moved to disbursements ledger.`);
  };

  const handleRejectLoan = (reqId, name) => {
    setLoanRequests(prev => prev.filter(r => r.id !== reqId));
    addAuditLog(`Loan application request ${reqId} for ${name} rejected by administrator.`, 'warning');
    alert(`Application ${reqId} rejected.`);
  };

  // 4. Approved/Sanctioned Loans Dataset
  const [approvedLoans, setApprovedLoans] = useState([
    { id: 'LN-99120', name: 'Rahul S.', type: 'Personal Loan', amount: 150000, rate: 14, date: '05/17/2026', status: 'Disbursed' },
    { id: 'LN-84092', name: 'Aarav Mehta', type: 'Business Loan', amount: 500000, rate: 12, date: '05/10/2026', status: 'Disbursed' },
    { id: 'LN-44219', name: 'Priya Kapoor', type: 'Auto Loan', amount: 350000, rate: 13, date: '04/28/2026', status: 'Disbursed' },
    { id: 'LN-77401', name: 'Sneha Rao', type: 'Home Loan', amount: 1200000, rate: 11, date: '04/15/2026', status: 'Disbursed' }
  ]);

  // 5. Careers & Recruiting Dataset
  const [careersOpenings, setCareersOpenings] = useState([
    { id: 'JOB-01', title: 'Senior Credit Analyst', dept: 'Risk Assessment', type: 'Full-Time', status: 'Open', applicants: 12 },
    { id: 'JOB-02', title: 'Loan Officer', dept: 'Customer Sanctions', type: 'Full-Time', status: 'Open', applicants: 8 },
    { id: 'JOB-03', title: 'Lead Compliance Architect', dept: 'Legal Operations', type: 'Full-Time', status: 'Closed', applicants: 4 }
  ]);

  const [jobApplications, setJobApplications] = useState([
    { id: 'APP-901', name: 'Rohan Sharma', email: 'rohan.s@gmail.com', role: 'Senior Credit Analyst', applied: '2026-05-24', status: 'Reviewing' },
    { id: 'APP-402', name: 'Divya Iyer', email: 'divya.iyer@outlook.com', role: 'Loan Officer', applied: '2026-05-22', status: 'Shortlisted' },
    { id: 'APP-105', name: 'Vikram Seth', email: 'vikram.seth@yahoo.com', role: 'Senior Credit Analyst', applied: '2026-05-20', status: 'Interviewing' },
    { id: 'APP-339', name: 'Nisha Varma', email: 'nisha.v@gmail.com', role: 'Lead Compliance Architect', applied: '2026-05-18', status: 'Rejected' }
  ]);

  const handleToggleJobStatus = (jobId, title, currentStatus) => {
    const nextStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
    setCareersOpenings(prev => prev.map(j => j.id === jobId ? { ...j, status: nextStatus } : j));
    addAuditLog(`Job opening '${title}' (${jobId}) status set to ${nextStatus}`, 'info');
  };

  const handleUpdateApplicantStatus = (appId, applicantName, nextStatus) => {
    setJobApplications(prev => prev.map(a => a.id === appId ? { ...a, status: nextStatus } : a));
    addAuditLog(`Application ${appId} for ${applicantName} updated to ${nextStatus}`, 'info');
  };

  // 6. Customer Care Consultation Logs State
  const [consultations, setConsultations] = useState([
    { id: 'TKT-1081', name: 'Amit Roy', email: 'amit.roy@gmail.com', phone: '+91 98765 43210', date: '2026-05-25', status: 'Pending', type: 'Personal Loan Advisor' },
    { id: 'TKT-1044', name: 'Sonal Sen', email: 'sonal.sen@yahoo.com', phone: '+91 88472 90123', date: '2026-05-24', status: 'Contacted', type: 'Business Credit Builder' },
    { id: 'TKT-0931', name: 'Vijay K.', email: 'vijay.k@outlook.com', phone: '+91 76543 21098', date: '2026-05-21', status: 'Contacted', type: 'Home Loan Refinancing' }
  ]);

  const handleResolveTicket = (ticketId, customerName) => {
    setConsultations(prev => prev.map(c => c.id === ticketId ? { ...c, status: 'Contacted' } : c));
    addAuditLog(`Consultation ticket ${ticketId} for ${customerName} marked resolved.`, 'success');
  };

  // 7. Staff Management State
  const [staffMembers, setStaffMembers] = useState([
    { name: 'Admin Flow', email: 'admin.flow@lendogo.com', role: 'Lending Officer', status: 'Active', clearance: 'L3 Admin' },
    { name: 'Nikhil Nair', email: 'nikhil.n@lendogo.com', role: 'Credit Underwriter', status: 'Active', clearance: 'L2 Compliance' },
    { name: 'Sameer Sen', email: 'sameer.s@lendogo.com', role: 'Verification Agent', status: 'Away', clearance: 'L1 Operations' }
  ]);

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Verification Agent');

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    
    const newStaff = {
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: 'Active',
      clearance: newStaffRole === 'Credit Underwriter' ? 'L2 Compliance' : 'L1 Operations'
    };
    
    setStaffMembers(prev => [...prev, newStaff]);
    addAuditLog(`Created new staff account for ${newStaffName} (${newStaffRole})`, 'success');
    setNewStaffName('');
    setNewStaffEmail('');
  };

  // 8. Live Marquee approvals
  const [liveMarquee, setLiveMarquee] = useState([
    { name: 'Rahul S. (PAN: A****32P)', type: 'Personal Loan', amount: '₹1,50,000', status: '⚡' },
    { name: 'Aarav M. (PAN: B****91K)', type: 'Business Loan', amount: '₹5,00,000', status: '💼' },
    { name: 'Priya K. (PAN: D****84D)', type: 'Auto Loan', amount: '₹3,50,000', status: '🚗' },
    { name: 'Sneha R. (PAN: C****74S)', type: 'Home Loan', amount: '₹12,00,000', status: '🏠' }
  ]);

  // Web Config save success alert
  const [showConfigSuccess, setShowConfigSuccess] = useState(false);
  const handleSaveWebConfig = () => {
    setShowConfigSuccess(true);
    addAuditLog(`System web configurations saved: Min Credit Score set to ${minCreditScore}, Base Rate set to ${baseInterestRate}%.`, 'success');
    setTimeout(() => setShowConfigSuccess(false), 3000);
  };

  // ─── SETTINGS HANDLERS ───

  // 1. Simulated Custom Photo Upload
  const handleSimulatePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setAdminAvatar(uploadEvent.target.result);
        addAuditLog('Admin updated profile picture via custom image upload', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Email Address Change
  const handleUpdateAdminEmail = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setAdminEmail(emailInput);
    addAuditLog(`Admin email updated to ${emailInput}`, 'info');
    alert(`Lending Officer email successfully set to ${emailInput}.`);
  };

  // 3. Password Reset
  const handleUpdateAdminPassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Please enter your current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Confirm password does not match new password.');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    addAuditLog('Admin administrative password updated successfully', 'success');
    alert('Administrative credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // 4. Platform Ownership Transfer
  const handleTransferOwnership = (e) => {
    e.preventDefault();
    if (!transferEmail || !transferKey) {
      alert('Please fill out all transfer verification details.');
      return;
    }
    const confirmed = window.confirm(
      `⚠️ CRITICAL DESTRUCTIVE TRIGGER ⚠️\n\nAre you absolutely sure you want to transfer total LendoGo platform ownership to ${transferEmail}?\n\nThis action is irreversible and will immediately revoke your credentials, record this event in the compliance log, and sign you out.`
    );
    if (confirmed) {
      addAuditLog(`SYSTEM CLEARANCE TRANSFER: Platform master ownership transferred to ${transferEmail}`, 'warning');
      alert(`Master ownership successfully assigned to ${transferEmail}. Closing your session.`);
      handleAdminLogout();
    }
  };

  // 5. System Logout
  const handleAdminLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('lendogo_user');
    alert('Logged out from Admin Dashboard successfully.');
    // Redirect to landing page
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'User Management', icon: '👥' },
    { name: 'Loan Requests', icon: '📥' },
    { name: 'Loan Approvals', icon: '✅' },
    { name: 'Careers Management', icon: '💼' },
    { name: 'Customer Care', icon: '📞' },
    { name: 'Staff Management', icon: '👮' },
    { name: 'Web Configuration', icon: '🌐' },
    { name: 'Audit Logs', icon: '🔒' },
    { name: 'Admin Settings', icon: '⚙️' }
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.PAN.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`admin-dashboard-wrapper ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      
      {/* ── TOP MARQUEE (LIVE APPROVAL TICKERS) ── */}
      <div className="admin-marquee-bar">
        <div className="marquee-label">
          <span className="live-pulse" />
          LIVE DISBURSEMENTS
        </div>
        <div className="marquee-content">
          <div className="marquee-slider">
            {liveMarquee.map((item, idx) => (
              <span key={idx} className="marquee-item">
                <span className="badge-bullet">{item.status}</span>
                <strong>{item.name}</strong> approved for {item.type}: <span className="highlight-text">{item.amount}</span>
              </span>
            ))}
            {/* Duplicate for infinite loop */}
            {liveMarquee.map((item, idx) => (
              <span key={`dup-${idx}`} className="marquee-item">
                <span className="badge-bullet">{item.status}</span>
                <strong>{item.name}</strong> approved for {item.type}: <span className="highlight-text">{item.amount}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-main-container">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <div className="admin-logo-icon">L</div>
            <span className="admin-logo-text">LendoGO <span className="admin-badge-pill">Admin</span></span>
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    className={`nav-btn ${activeTab === item.name ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.name)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme Switcher Toggle */}
          <div className="sidebar-theme-toggle">
            <span className="toggle-label">{darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider-round" />
            </label>
          </div>
        </aside>

        {/* ── MAIN DASHBOARD CONTENT AREA ── */}
        <main className="admin-content-area">
          
          {/* Top Navbar */}
          <header className="admin-topbar">
            <div className="topbar-left">
              <div className="metric-box">
                <span className="metric-label">Total Capital Disbursed</span>
                <h3 className="metric-value">₹{disbursedCapital.toLocaleString('en-IN')}.00</h3>
              </div>
            </div>

            <div className="topbar-right">
              <div className="topbar-search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Filter listings, PAN, emails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="topbar-search-input"
                />
              </div>

              <div className="topbar-actions-container">
                {/* Dynamic Wallet Capital Pill */}
                <button 
                  className="topbar-action-btn wallet-action-pill" 
                  title={`Available Capital Reserves: ₹${activeBalance.toLocaleString('en-IN')}`}
                  onClick={() => alert(`Operational Vault Capital Reserves: ₹${activeBalance.toLocaleString('en-IN')}`)}
                >
                  <span className="action-icon">💳</span>
                  <span className="wallet-amount-text">₹{(activeBalance / 100000).toFixed(2)}L</span>
                </button>

                {/* Notification Bell Toggle */}
                <button 
                  className="topbar-action-btn notification-bell-btn" 
                  title="Platform Operations Alert Log"
                  onClick={() => alert('All lending operations systems are operating normally. No unread compliance flags.')}
                >
                  <span className="action-icon">🔔</span>
                  <span className="bell-badge-pulse" />
                </button>
              </div>

              <div className="admin-profile-card">
                <div className="profile-avatar">
                  {adminAvatar.startsWith('data:') || adminAvatar.startsWith('http') ? (
                    <img src={adminAvatar} alt="Avatar" className="admin-custom-avatar-img" />
                  ) : (
                    <span className="default-avatar-initials">{adminName.charAt(0)}</span>
                  )}
                </div>
                <div className="profile-details">
                  <span className="profile-name">{adminName}</span>
                  <span className="profile-role">{adminEmail}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="dashboard-scroll-container">

            {/* TAB VIEW 1: DASHBOARD */}
            {activeTab === 'Dashboard' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="welcome-banner">
                  <div className="banner-content">
                    <h2>LendoGo Operational Control</h2>
                    <p>Welcome back, Officer. Operational metrics, credit portfolio risk audits, and capital flows are updated.</p>
                  </div>
                </div>

                <div className="admin-grid-layout">
                  <div className="grid-card assets-card">
                    <div className="card-header">
                      <h4>Active Loan Portfolio</h4>
                      <span className="info-icon" title="Aggregated sum of all active loans distributed.">ⓘ</span>
                    </div>
                    <div className="card-value-wrap">
                      <h2>₹{activeBalance.toLocaleString('en-IN')}.00</h2>
                      <span className="trend-badge positive">↑ 12% <span className="trend-sub">Operational Safe</span></span>
                    </div>
                    <div className="asset-dist-bar">
                      <div className="dist-segment personal" style={{ width: '65%' }} />
                      <div className="dist-segment business" style={{ width: '25%' }} />
                      <div className="dist-segment home-auto" style={{ width: '10%' }} />
                    </div>
                    <ul className="asset-distribution-list">
                      <li>
                        <span className="legend-dot personal" />
                        <span className="dist-label">Personal Loans (65%)</span>
                      </li>
                      <li>
                        <span className="legend-dot business" />
                        <span className="dist-label">Business Loans (25%)</span>
                      </li>
                      <li>
                        <span className="legend-dot home-auto" />
                        <span className="dist-label">Home & Auto Loans (10%)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid-card chart-card">
                    <div className="card-header">
                      <h4>Capital Disbursements vs Repayments</h4>
                    </div>
                    <div className="card-value-wrap">
                      <h2>₹{disbursedCapital.toLocaleString('en-IN')}.00</h2>
                    </div>
                    {/* SVG Line Chart */}
                    <div className="svg-chart-container">
                      <svg viewBox="0 0 500 140" className="svg-line-chart">
                        <line x1="40" y1="20" x2="480" y2="20" className="chart-grid-line" />
                        <line x1="40" y1="70" x2="480" y2="70" className="chart-grid-line" />
                        <line x1="40" y1="120" x2="480" y2="120" className="chart-grid-line" />
                        
                        <defs>
                          <linearGradient id="chart-disbursed-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M40,120 L150,90 L260,85 L370,55 L480,25 L480,140 L40,140 Z" fill="url(#chart-disbursed-grad)" />
                        <path d="M40,120 L150,90 L260,85 L370,55 L480,25" fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid-card robo-advisor-card">
                    <div className="advisor-content">
                      <div className="advisor-logo">🔒</div>
                      <h3>Audit & Verification Index</h3>
                      <p>Run automated PAN checks and background system integrity reports directly in the requests tab.</p>
                      <button className="btn-advisor-action" onClick={() => setActiveTab('Loan Requests')}>
                        Go to Requests Tab
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 2: USER MANAGEMENT */}
            {activeTab === 'User Management' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="section-header-row">
                  <h2>Borrower Directory</h2>
                  <p>Check active borrow histories, email verifications, and credit standing indexes.</p>
                </div>

                <div className="table-responsive-admin">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>PAN Number</th>
                        <th>Risk Index</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td><strong>{user.id}</strong></td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><code className="pan-code">{user.PAN}</code></td>
                            <td>
                              <span className={`risk-tag ${user.rating.toLowerCase().replace(' ', '-')}`}>
                                {user.rating}
                              </span>
                            </td>
                            <td>
                              <span className={`status-tag ${user.status.toLowerCase()}`}>
                                {user.status}
                              </span>
                            </td>
                            <td>{user.joined}</td>
                            <td>
                              <button 
                                className={`btn-action-status ${user.status === 'Active' ? 'suspend' : 'activate'}`}
                                onClick={() => handleToggleUserStatus(user.id, user.name, user.status)}
                              >
                                {user.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="empty-row-text">No registered users match your search queries.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB VIEW 3: LOAN REQUESTS */}
            {activeTab === 'Loan Requests' && (
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
            )}

            {/* TAB VIEW 4: LOAN APPROVALS */}
            {activeTab === 'Loan Approvals' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="section-header-row">
                  <h2>Sanctioned Disbursements Ledger</h2>
                  <p>Verify bank transfer completions, locked interest rates, and loan payment timelines.</p>
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
                      </tr>
                    </thead>
                    <tbody>
                      {approvedLoans.map((loan) => (
                        <tr key={loan.id}>
                          <td><strong>{loan.id}</strong></td>
                          <td>{loan.name}</td>
                          <td>{loan.type}</td>
                          <td className="text-primary font-weight-bold">₹{loan.amount.toLocaleString('en-IN')}</td>
                          <td>{loan.rate}% Fixed</td>
                          <td>{loan.date}</td>
                          <td>
                            <span className="status-badge completed">
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB VIEW 5: CAREERS MANAGEMENT */}
            {activeTab === 'Careers Management' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="section-header-row">
                  <h2>Careers & Staff Recruitment</h2>
                  <p>Create mock openings and review candidate applications for LendoGo operations.</p>
                </div>

                <div className="double-subtab-container">
                  <div className="sub-panel">
                    <h3>Active Job Postings</h3>
                    <table className="admin-data-table mini-table">
                      <thead>
                        <tr>
                          <th>Job Code</th>
                          <th>Role Title</th>
                          <th>Department</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {careersOpenings.map(job => (
                          <tr key={job.id}>
                            <td><strong>{job.id}</strong></td>
                            <td>{job.title}</td>
                            <td>{job.dept}</td>
                            <td>
                              <span className={`status-tag ${job.status.toLowerCase()}`}>{job.status}</span>
                            </td>
                            <td>
                              <button 
                                className="btn-action-toggle-job"
                                onClick={() => handleToggleJobStatus(job.id, job.title, job.status)}
                              >
                                {job.status === 'Open' ? 'Close' : 'Reopen'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="sub-panel">
                    <h3>Received Applications</h3>
                    <table className="admin-data-table mini-table">
                      <thead>
                        <tr>
                          <th>Candidate</th>
                          <th>Target Role</th>
                          <th>Applied Date</th>
                          <th>Progress Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobApplications.map(app => (
                          <tr key={app.id}>
                            <td>
                              <div className="applicant-profile-cell">
                                <strong>{app.name}</strong>
                                <span>{app.email}</span>
                              </div>
                            </td>
                            <td>{app.role}</td>
                            <td>{app.applied}</td>
                            <td>
                              <span className={`recru-status ${app.status.toLowerCase()}`}>{app.status}</span>
                            </td>
                            <td>
                              <select 
                                className="applicant-status-select"
                                value={app.status}
                                onChange={(e) => handleUpdateApplicantStatus(app.id, app.name, e.target.value)}
                              >
                                <option value="Reviewing">Reviewing</option>
                                <option value="Shortlisted">Shortlist</option>
                                <option value="Interviewing">Interview</option>
                                <option value="Rejected">Reject</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 6: CUSTOMER CARE */}
            {activeTab === 'Customer Care' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="section-header-row">
                  <h2>Free Consultations Inquiries</h2>
                  <p>Connect with prospective borrowers who requested assistance from the Consultation forms.</p>
                </div>

                <div className="table-responsive-admin">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Client Name</th>
                        <th>Email Contact</th>
                        <th>Phone Number</th>
                        <th>Requested Category</th>
                        <th>Registered Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations.map(ticket => (
                        <tr key={ticket.id}>
                          <td><strong>{ticket.id}</strong></td>
                          <td>{ticket.name}</td>
                          <td>{ticket.email}</td>
                          <td>{ticket.phone}</td>
                          <td>{ticket.type}</td>
                          <td>{ticket.date}</td>
                          <td>
                            <span className={`status-tag ${ticket.status === 'Contacted' ? 'active' : 'suspended'}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            {ticket.status === 'Pending' ? (
                              <button 
                                className="btn-action-status activate"
                                onClick={() => handleResolveTicket(ticket.id, ticket.name)}
                              >
                                Mark Contacted
                              </button>
                            ) : (
                              <span className="contact-check">✓ Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB VIEW 7: STAFF MANAGEMENT */}
            {activeTab === 'Staff Management' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="section-header-row">
                  <h2>Staff Accounts & Permissions</h2>
                  <p>Manage operating lending credentials, compliance officer clearances, and staff audits.</p>
                </div>

                <div className="double-subtab-container">
                  <div className="sub-panel flex-1">
                    <h3>Add New Operational Staff</h3>
                    <form className="staff-form" onSubmit={handleAddStaff}>
                      <div className="form-input-group">
                        <label>Employee Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={newStaffName} 
                          onChange={(e) => setNewStaffName(e.target.value)} 
                          placeholder="e.g. Anand Sharma" 
                          className="staff-field"
                        />
                      </div>
                      <div className="form-input-group">
                        <label>LendoGo Office Email</label>
                        <input 
                          type="email" 
                          required
                          value={newStaffEmail} 
                          onChange={(e) => setNewStaffEmail(e.target.value)} 
                          placeholder="e.g. anand.s@lendogo.com" 
                          className="staff-field"
                        />
                      </div>
                      <div className="form-input-group">
                        <label>Assigned Staff Role</label>
                        <select 
                          value={newStaffRole} 
                          onChange={(e) => setNewStaffRole(e.target.value)}
                          className="staff-field"
                        >
                          <option value="Verification Agent">Verification Agent (L1 Ops)</option>
                          <option value="Credit Underwriter">Credit Underwriter (L2 Compliance)</option>
                        </select>
                      </div>
                      <button type="submit" className="btn-add-staff-submit">
                        ＋ Save Staff Member
                      </button>
                    </form>
                  </div>

                  <div className="sub-panel flex-2">
                    <h3>Current Active Team</h3>
                    <table className="admin-data-table mini-table">
                      <thead>
                        <tr>
                          <th>Staff Officer</th>
                          <th>Assigned Role</th>
                          <th>Clearance Level</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffMembers.map((staff, idx) => (
                          <tr key={idx}>
                            <td>
                              <div className="applicant-profile-cell">
                                <strong>{staff.name}</strong>
                                <span>{staff.email}</span>
                              </div>
                            </td>
                            <td>{staff.role}</td>
                            <td><code>{staff.clearance}</code></td>
                            <td>
                              <span className={`status-tag ${staff.status === 'Active' ? 'active' : 'suspended'}`}>
                                {staff.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 8: WEB CONFIGURATION */}
            {activeTab === 'Web Configuration' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="section-header-row">
                  <h2>System Web Configurations</h2>
                  <p>Configure borrowing constraints, approval credit rules, and active application parameters.</p>
                </div>

                <div className="web-config-card-box">
                  {showConfigSuccess && (
                    <div className="config-success-banner animate-scale-up">
                      ✓ Platform parameters updated in secure database.
                    </div>
                  )}

                  <div className="config-row-item">
                    <div className="config-info-text">
                      <h4>Minimum Scoring Index Requirement</h4>
                      <p>Incoming borrowers must achieve this score on simulated database scans to unlock instant approvals.</p>
                    </div>
                    <div className="config-action-control">
                      <div className="range-score-wrap">
                        <input 
                          type="range"
                          min={300}
                          max={850}
                          value={minCreditScore}
                          onChange={(e) => setMinCreditScore(Number(e.target.value))}
                          className="config-slider-range"
                        />
                        <strong className="slider-score-indicator">{minCreditScore}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="config-row-item">
                    <div className="config-info-text">
                      <h4>Platform Base Interest Rate P.A.</h4>
                      <p>Global baseline interest index applied to newly approved credit contracts.</p>
                    </div>
                    <div className="config-action-control">
                      <div className="range-score-wrap">
                        <input 
                          type="range"
                          min={5}
                          max={25}
                          value={baseInterestRate}
                          onChange={(e) => setBaseInterestRate(Number(e.target.value))}
                          className="config-slider-range"
                        />
                        <strong className="slider-score-indicator">{baseInterestRate}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="config-row-item">
                    <div className="config-info-text">
                      <h4>Enable Public Account Sign-ups</h4>
                      <p>Disabling blocks new user registration endpoints on the server (maintenance mode).</p>
                    </div>
                    <div className="config-action-control">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          checked={isSignupsEnabled}
                          onChange={() => setIsSignupsEnabled(!isSignupsEnabled)}
                        />
                        <span className="slider-round" />
                      </label>
                    </div>
                  </div>

                  <div className="config-row-item">
                    <div className="config-info-text">
                      <h4>Enable Free Consultation Dialogs</h4>
                      <p>Controls visibility of consultation query prompts in public site footers.</p>
                    </div>
                    <div className="config-action-control">
                      <label className="toggle-switch">
                        <input 
                          type="checkbox"
                          checked={isConsultationsEnabled}
                          onChange={() => setIsConsultationsEnabled(!isConsultationsEnabled)}
                        />
                        <span className="slider-round" />
                      </label>
                    </div>
                  </div>

                  <button className="btn-save-web-config" onClick={handleSaveWebConfig}>
                    Save System Parameters
                  </button>
                </div>
              </div>
            )}

            {/* TAB VIEW 9: AUDIT LOGS */}
            {activeTab === 'Audit Logs' && (
              <div className="tab-pane-container animate-fade-in">
                <div className="section-header-row">
                  <h2>Platform Activity & Audit Logs</h2>
                  <p>Real-time security log captures access tokens, admin updates, and system events.</p>
                </div>

                <div className="audit-ledger-box">
                  <div className="ledger-header-row">
                    <span>SECURITY CHRONICLE</span>
                    <button className="btn-clear-logs" onClick={() => { setAuditLogs([]); alert('Platform log wiped locally.'); }}>
                      Wipe Logs
                    </button>
                  </div>

                  <div className="audit-scroll-ledger">
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log) => (
                        <div className={`log-item-row ${log.type}`} key={log.id}>
                          <span className="log-time">{log.timestamp}</span>
                          <span className={`log-badge-type ${log.type}`}>{log.type.toUpperCase()}</span>
                          <span className="log-operator">[{log.user}]</span>
                          <span className="log-action">{log.action}</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-ledger-view">
                        <p>No platform logs captured.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 10: SETTINGS (EXTENDED WORKFLOWS) */}
            {activeTab === 'Admin Settings' && (
              <div className="tab-pane-container settings-dashboard-view animate-fade-in">
                <div className="section-header-row">
                  <h2>Administrative Control Center</h2>
                  <p>Configure officer profiles, system credentials, integrations, and platform ownership in a single unified cockpit.</p>
                </div>

                <div className="settings-unified-grid">
                  
                  {/* CARD 1: PROFILE & BRANDING */}
                  <div className="settings-group-card profile-branding-card">
                    <div className="settings-card-header">
                      <span className="card-icon">📸</span>
                      <h3>Profile & Branding</h3>
                    </div>
                    
                    <div className="settings-account-hero-card dense-hero">
                      <div className="hero-avatar-wrapper">
                        {adminAvatar.startsWith('data:') || adminAvatar.startsWith('http') ? (
                          <img src={adminAvatar} alt="Avatar" className="admin-custom-avatar-img-large" />
                        ) : (
                          <span className="default-avatar-initials">{adminName.charAt(0)}</span>
                        )}
                        <label className="avatar-edit-badge" title="Upload custom photo">
                          📷
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleSimulatePhotoUpload}
                            className="file-input-hidden"
                          />
                        </label>
                      </div>
                      <div className="hero-identity-wrap">
                        <span className="owner-badge">Lending Owner</span>
                        <h2>{adminName}</h2>
                        <p>{adminEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* CARD 2: OFFICER PROFILE DETAILS */}
                  <div className="settings-group-card profile-details-card">
                    <div className="settings-card-header">
                      <span className="card-icon">👤</span>
                      <h3>Profile Settings</h3>
                    </div>
                    <form onSubmit={handleUpdateAdminEmail} className="settings-inner-form mt-1">
                      <div className="form-input-group mb-2">
                        <label>Officer Name</label>
                        <input 
                          type="text"
                          required
                          value={adminName}
                          onChange={(e) => setAdminName(e.target.value)}
                          className="staff-field"
                        />
                      </div>
                      <div className="form-input-group">
                        <label>Officer Email Coordinate</label>
                        <input 
                          type="email" 
                          required
                          value={emailInput} 
                          onChange={(e) => setEmailInput(e.target.value)} 
                          className="staff-field"
                        />
                      </div>
                      <button type="submit" className="btn-save-web-config mt-2">
                        Save Profile Details
                      </button>
                    </form>
                  </div>

                  {/* CARD 3: SECURITY KEY SETTINGS */}
                  <div className="settings-group-card security-credentials-card">
                    <div className="settings-card-header">
                      <span className="card-icon">🔒</span>
                      <h3>Security Key Credentials</h3>
                    </div>
                    <form className="settings-inner-form mt-1" onSubmit={handleUpdateAdminPassword}>
                      <div className="form-input-group mb-2">
                        <label>Current Key Pass</label>
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          className="staff-field"
                        />
                      </div>
                      <div className="form-input-group mb-2">
                        <label>New Strong Password</label>
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          className="staff-field"
                        />
                      </div>
                      <div className="form-input-group">
                        <label>Confirm New Password</label>
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          className="staff-field"
                        />
                      </div>
                      <button type="submit" className="btn-save-web-config mt-2">
                        Save Operations Key
                      </button>
                    </form>
                  </div>

                  {/* CARD 4: PLATFORM INTEGRATIONS */}
                  <div className="settings-group-card system-integrations-card">
                    <div className="settings-card-header">
                      <span className="card-icon">🌐</span>
                      <h3>Platform Integrations</h3>
                    </div>
                    
                    <div className="integrations-fields-wrap mt-1">
                      <div className="integration-row mb-2">
                        <div className="row-text">
                          <h4>2-Factor Verification</h4>
                          <p>For transfers &gt; ₹5,00,000</p>
                        </div>
                        <label className="toggle-switch">
                          <input type="checkbox" defaultChecked />
                          <span className="slider-round" />
                        </label>
                      </div>

                      <div className="integration-row mb-2">
                        <div className="row-text">
                          <h4>Database Synchronization</h4>
                          <p>Cloud offshore replicas</p>
                        </div>
                        <select className="settings-select-field">
                          <option>Every 1 Hour (Realtime)</option>
                          <option>Every 12 Hours</option>
                          <option>Every 24 Hours</option>
                        </select>
                      </div>

                      <div className="integration-row">
                        <div className="row-text">
                          <h4>Amazon SES Mailer</h4>
                          <p>Dispatch transaction alerts</p>
                        </div>
                        <strong className="text-green font-weight-bold">● Connected</strong>
                      </div>
                    </div>
                  </div>

                  {/* CARD 5: DANGER ZONE & CLEARANCES (FULL WIDTH) */}
                  <div className="settings-group-card danger-zone-group full-width-card">
                    <div className="settings-card-header text-red">
                      <span className="card-icon">⚠️</span>
                      <h3>Master Clearances & Danger Operations</h3>
                    </div>
                    
                    <div className="danger-dashboard-row">
                      <div className="danger-form-column">
                        <p>Transfer master administrative clearances to a new coordinate. Your clearances will instantly revoke.</p>
                        <form className="settings-inner-form mt-2" onSubmit={handleTransferOwnership}>
                          <div className="form-input-group mb-2">
                            <label>Designated Recipient Email</label>
                            <input 
                              type="email" 
                              required
                              placeholder="new.owner@lendogo.com"
                              value={transferEmail} 
                              onChange={(e) => setTransferEmail(e.target.value)} 
                              className="staff-field danger-field"
                            />
                          </div>
                          <div className="form-input-group mb-2">
                            <label>Master Security Clearance Code</label>
                            <input 
                              type="password" 
                              required
                              placeholder="Clearance ID Code"
                              value={transferKey} 
                              onChange={(e) => setTransferKey(e.target.value)} 
                              className="staff-field danger-field"
                            />
                          </div>
                          <button type="submit" className="btn-transfer-ownership-submit">
                            ⚠️ Transfer Master Clearances
                          </button>
                        </form>
                      </div>

                      <div className="danger-logout-column">
                        <div className="logout-prompt-box">
                          <h4>Administrative Session Control</h4>
                          <p>Close operational session registers and secure audit ledgers locally.</p>
                          <button type="button" className="btn-admin-logout-trigger mt-2" onClick={handleAdminLogout}>
                            🚪 Sign Out of Admin Panel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminPage;
