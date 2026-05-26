import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

// Import Modular Components
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/AdminTopbar';
import DashboardTab from './components/DashboardTab';
import UserManagementTab from './components/UserManagementTab';
import LoanRequestsTab from './components/LoanRequestsTab';
import LoanApprovalsTab from './components/LoanApprovalsTab';
import CareersManagementTab from './components/CareersManagementTab';
import CustomerCareTab from './components/CustomerCareTab';
import StaffManagementTab from './components/StaffManagementTab';
import WebConfigurationTab from './components/WebConfigurationTab';
import AuditLogsTab from './components/AuditLogsTab';
import AdminSettingsTab from './components/AdminSettingsTab';

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
        
        {/* Sidebar Component */}
        <AdminSidebar 
          navItems={navItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* ── MAIN DASHBOARD CONTENT AREA ── */}
        <main className="admin-content-area">
          
          {/* Topbar Component */}
          <AdminTopbar 
            disbursedCapital={disbursedCapital}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeBalance={activeBalance}
            adminAvatar={adminAvatar}
            adminName={adminName}
            adminEmail={adminEmail}
          />

          <div className="dashboard-scroll-container">

            {/* Conditional Tab Views rendering */}
            {activeTab === 'Dashboard' && (
              <DashboardTab 
                activeBalance={activeBalance}
                disbursedCapital={disbursedCapital}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'User Management' && (
              <UserManagementTab 
                filteredUsers={filteredUsers}
                handleToggleUserStatus={handleToggleUserStatus}
              />
            )}

            {activeTab === 'Loan Requests' && (
              <LoanRequestsTab 
                loanRequests={loanRequests}
                handleRunRiskAudit={handleRunRiskAudit}
                handleApproveLoan={handleApproveLoan}
                handleRejectLoan={handleRejectLoan}
              />
            )}

            {activeTab === 'Loan Approvals' && (
              <LoanApprovalsTab 
                approvedLoans={approvedLoans}
              />
            )}

            {activeTab === 'Careers Management' && (
              <CareersManagementTab 
                careersOpenings={careersOpenings}
                handleToggleJobStatus={handleToggleJobStatus}
                jobApplications={jobApplications}
                handleUpdateApplicantStatus={handleUpdateApplicantStatus}
              />
            )}

            {activeTab === 'Customer Care' && (
              <CustomerCareTab 
                consultations={consultations}
                handleResolveTicket={handleResolveTicket}
              />
            )}

            {activeTab === 'Staff Management' && (
              <StaffManagementTab 
                handleAddStaff={handleAddStaff}
                newStaffName={newStaffName}
                setNewStaffName={setNewStaffName}
                newStaffEmail={newStaffEmail}
                setNewStaffEmail={setNewStaffEmail}
                newStaffRole={newStaffRole}
                setNewStaffRole={setNewStaffRole}
                staffMembers={staffMembers}
              />
            )}

            {activeTab === 'Web Configuration' && (
              <WebConfigurationTab 
                showConfigSuccess={showConfigSuccess}
                minCreditScore={minCreditScore}
                setMinCreditScore={setMinCreditScore}
                baseInterestRate={baseInterestRate}
                setBaseInterestRate={setBaseInterestRate}
                isSignupsEnabled={isSignupsEnabled}
                setIsSignupsEnabled={setIsSignupsEnabled}
                isConsultationsEnabled={isConsultationsEnabled}
                setIsConsultationsEnabled={setIsConsultationsEnabled}
                handleSaveWebConfig={handleSaveWebConfig}
              />
            )}

            {activeTab === 'Audit Logs' && (
              <AuditLogsTab 
                auditLogs={auditLogs}
                setAuditLogs={setAuditLogs}
              />
            )}

            {activeTab === 'Admin Settings' && (
              <AdminSettingsTab 
                adminAvatar={adminAvatar}
                adminName={adminName}
                setAdminName={setAdminName}
                adminEmail={adminEmail}
                handleSimulatePhotoUpload={handleSimulatePhotoUpload}
                handleUpdateAdminEmail={handleUpdateAdminEmail}
                emailInput={emailInput}
                setEmailInput={setEmailInput}
                handleUpdateAdminPassword={handleUpdateAdminPassword}
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                handleTransferOwnership={handleTransferOwnership}
                transferEmail={transferEmail}
                setTransferEmail={setTransferEmail}
                transferKey={transferKey}
                setTransferKey={setTransferKey}
                handleAdminLogout={handleAdminLogout}
              />
            )}

          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminPage;
