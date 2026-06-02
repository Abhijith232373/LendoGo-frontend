import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../../../utils/apiClient';

export const useAdminController = () => {
  const navigate = useNavigate();

  // Theme & Navigation States
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sliders & Web Config States
  const [minCreditScore, setMinCreditScore] = useState(650);
  const [baseInterestRate, setBaseInterestRate] = useState(14);
  const [isSignupsEnabled, setIsSignupsEnabled] = useState(true);
  const [isConsultationsEnabled, setIsConsultationsEnabled] = useState(true);

  // Dynamic Global Financial Ledger States
  const [activeBalance, setActiveBalance] = useState(0);
  const [disbursedCapital, setDisbursedCapital] = useState(0);

  // Admin Personal Detail States
  const [adminAvatar, setAdminAvatar] = useState('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80');
  const [adminName, setAdminName] = useState('Admin Flow');
  const [adminEmail, setAdminEmail] = useState('admin.flow@lendogo.com');

  // Input States for Settings Forms
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
  const [users, setUsers] = useState([]);

  // 3. Interactive Loan Requests Dataset
  const [loanRequests, setLoanRequests] = useState([]);

  // 4. Approved/Sanctioned Loans Dataset
  const [approvedLoans, setApprovedLoans] = useState([]);

  // Keep audited scores in local memory or track them dynamically to prevent resetting them on page shifts
  const [auditedScores, setAuditedScores] = useState({});

  // 6. Customer Care Consultation Logs State
  const [consultations, setConsultations] = useState([]);

  const fetchWalletBalance = async () => {
    try {
      const res = await apiClient('/admin/wallet/balance');
      if (res && typeof res.balance !== 'undefined') {
        setActiveBalance(res.balance);
      }
    } catch (err) {
      console.error("Failed to fetch wallet balance:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient('/admin/all-users');
      const data = res?.data || res || [];
      const normalized = data.map(u => ({
        id: u.id || '',
        name: u.full_name || u.FullName || 'Unknown',
        email: u.email || '',
        PAN: u.PAN || u.pan || 'Attached',
        rating: u.rating || 'Low Risk',
        status: u.status || 'Active',
        creditScore: u.creditScore || 750,
        loanHistory: u.loanHistory || 'None',
        joined: u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'
      }));
      setUsers(normalized);
    } catch (err) {
      console.error("Failed to fetch users from database:", err);
    }
  };

  const fetchConsultations = async () => {
    try {
      const res = await apiClient('/admin/consultations');
      const data = res?.data || res || [];
      
      const calledIds = JSON.parse(localStorage.getItem('lendogo_called_consultations') || '[]');
      
      const mapped = data.map(item => ({
        id: item.ID || item.id,
        name: item.FullName || item.full_name || 'N/A',
        email: item.Email || item.email || 'N/A',
        phone: item.PhoneNumber || item.phone_number || 'N/A',
        date: item.CreatedAt ? new Date(item.CreatedAt).toLocaleDateString() : 'N/A',
        status: calledIds.includes(item.ID || item.id) ? 'Called' : 'Pending',
        type: 'Free Consultation'
      }));
      setConsultations(mapped);
    } catch (err) {
      console.error("Failed to fetch consultations:", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await apiClient('/admin/applications');
      const data = res?.data || res || [];
      
      const requests = [];
      const approved = [];
      let totalDisbursed = 0;

      data.forEach(app => {
        let docPAN = 'Attached';
        if (app.kyc_documents?.pan_card_path) {
          const filenameWithParams = app.kyc_documents.pan_card_path.split('/').pop() || '';
          const filename = filenameWithParams.split('?')[0] || '';
          if (filename) {
            docPAN = filename.length > 20 ? `${filename.substring(0, 16)}...` : filename;
          }
        }

        const normalizedApp = {
          id: app.id || '',
          referenceNumber: app.reference_number || app.id || '',
          name: app.full_name || 'Unknown',
          type: app.product_category || app.loan_track || 'Personal Loan',
          amount: app.principal_amount || 0,
          PAN: docPAN,
          riskScore: auditedScores[app.id]?.riskScore || app.riskScore || null,
          auditState: auditedScores[app.id]?.auditState || app.auditState || 'idle',
          dob: app.dob || '',
          email: app.email || '',
          mobileNumber: app.mobile_number || '',
          address: app.address || '',
          city: app.city || '',
          state: app.state || '',
          pincode: app.pincode || '',
          tenureMonths: app.tenure_months || 12,
          interestRate: app.interest_rate || 14,
          estimatedEmi: app.estimated_emi || 0,
          employmentType: app.financial_details?.employment_status || 'Salaried',
          monthlyIncome: app.financial_details?.monthly_income || 0,
          raw: app
        };

        if (app.status === 'APPROVED' || app.status === 'DISBURSED') {
          approved.push({
            id: app.id || '',
            name: app.full_name || 'Unknown',
            type: app.product_category || app.loan_track || 'Personal Loan',
            amount: app.principal_amount || 0,
            rate: app.interest_rate || 14,
            date: app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A',
            status: app.status === 'DISBURSED' ? 'Disbursed' : 'Pre-Approved',
            raw: app
          });
          if (app.status === 'DISBURSED') {
            totalDisbursed += app.principal_amount || 0;
          }
        } else if (app.status === 'UNDER_REVIEW') {
          requests.push(normalizedApp);
        }
      });

      setLoanRequests(requests);
      setApprovedLoans(approved);
      setDisbursedCapital(totalDisbursed);
    } catch (err) {
      console.error("Failed to fetch applications from database:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchApplications();
    fetchWalletBalance();
    fetchConsultations();
  }, [auditedScores]);

  const handleToggleUserStatus = (userId, userName, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    addAuditLog(`User ${userName} (${userId}) status updated to ${nextStatus}`, nextStatus === 'Blocked' ? 'warning' : 'success');
  };

  const handleCreateUser = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
    addAuditLog(`User profile created for ${newUser.name} (${newUser.id})`, 'success');
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    addAuditLog(`User profile updated for ${updatedUser.name} (${updatedUser.id})`, 'info');
  };

  const handleDeleteUser = (userId, userName) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    addAuditLog(`User ${userName} (${userId}) deleted from system`, 'warning');
  };

  // KYC Verification Dataset & Handlers (kept for interface match, though KYCVerificationsTab handles it internally)
  const [kycList, setKycList] = useState([]);

  const handleApproveKYC = (kycId, userName) => {
    addAuditLog(`KYC verification approved for ${userName} (${kycId})`, 'success');
    alert(`KYC verification successfully approved for ${userName}.`);
  };

  const handleRejectKYC = (kycId, userName) => {
    addAuditLog(`KYC verification rejected/returned for ${userName} (${kycId})`, 'warning');
    alert(`KYC verification rejected/returned for ${userName}.`);
  };

  // Simulated Audit Scoring Model
  const handleRunRiskAudit = (reqId) => {
    setLoanRequests(prev => prev.map(r => r.id === reqId ? { ...r, auditState: 'scanning' } : r));
    setAuditedScores(prev => ({
      ...prev,
      [reqId]: { auditState: 'scanning', riskScore: null }
    }));
    
    setTimeout(() => {
      const generatedScore = Math.floor(Math.random() * (850 - 580 + 1)) + 580;
      setAuditedScores(prev => ({
        ...prev,
        [reqId]: { auditState: 'completed', riskScore: generatedScore }
      }));
      addAuditLog(`Risk analysis compiled for request ${reqId}. Calculated Credit Score: ${generatedScore}`, 'info');
    }, 1500);
  };

  // Decision Handlers
  const handleApproveLoan = async (request) => {
    try {
      await apiClient(`/admin/applications/${request.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'APPROVED' })
      });
      
      addAuditLog(`Sanctioned loan approval for ${request.name}. Reference: ${request.referenceNumber}`, 'success');
      alert(`Loan successfully approved and moved to disbursements ledger.`);
      
      setLiveMarquee(prev => [
        { name: `${request.name} (PAN: ${request.PAN})`, type: request.type, amount: `₹${request.amount.toLocaleString()}`, status: '⚡' },
        ...prev
      ]);

      fetchApplications();
      await fetchWalletBalance();
    } catch (err) {
      console.error("Failed to approve loan:", err);
      alert(`Failed to approve loan: ${err.message}`);
    }
  };

  const handleRejectLoan = async (reqId, name) => {
    try {
      await apiClient(`/admin/applications/${reqId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'REJECTED' })
      });
      addAuditLog(`Loan application request ${reqId} for ${name} rejected by administrator.`, 'warning');
      alert(`Application ${reqId} rejected.`);
      fetchApplications();
    } catch (err) {
      console.error("Failed to reject loan application:", err);
      alert(`Failed to reject application: ${err.message}`);
    }
  };

  const handleDisburseMoney = async (loanId, feeAmount) => {
    const loan = approvedLoans.find(l => l.id === loanId);
    if (!loan) return;

    const netAmount = loan.amount - feeAmount;

    try {
      await apiClient(`/admin/applications/${loanId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'DISBURSED' })
      });

      await fetchWalletBalance();

      addAuditLog(`Capital Disbursal Settled: Transferred ₹${netAmount.toLocaleString('en-IN')}.00 directly to ${loan.name}'s wallet after charging ₹${feeAmount.toLocaleString('en-IN')}.00 platform fee (Ref: ${loanId}).`, 'success');
      alert(`Loan disbursed successfully.`);
      fetchApplications();
    } catch (err) {
      console.error("Failed to disburse money:", err);
      alert(`Failed to disburse money: ${err.message}`);
    }
  };

  // 5. Careers & Recruiting Dataset
  const [careersOpenings, setCareersOpenings] = useState([
    { id: 'JOB-01', title: 'Senior Credit Analyst', dept: 'Credit & Risk', type: 'Full-Time', status: 'Open', applicants: 12, experience: '3-5 yrs', location: 'Ernakulam, Palarivattom', mode: 'Hybrid', skills: ['Credit Analysis', 'Underwriting'], briefNote: 'Assess borrower credit rating.', aboutRole: 'Analyze income statement profiles...' },
    { id: 'JOB-02', title: 'Loan Officer', dept: 'Operations', type: 'Full-Time', status: 'Open', applicants: 8, experience: '1-3 yrs', location: 'Ernakulam, Palarivattom', mode: 'On-site', skills: ['Customer Support', 'Loan Origination'], briefNote: 'Process customer lending requests.', aboutRole: 'Verify applications details...' },
    { id: 'JOB-03', title: 'Lead Compliance Architect', dept: 'Engineering', type: 'Full-Time', status: 'Closed', applicants: 4, experience: '5+ yrs', location: 'Ernakulam, Palarivattom', mode: 'Remote', skills: ['Regulatory Compliance', 'Fintech Architecture'], briefNote: 'Ensure architecture compliance.', aboutRole: 'Build compliant backend routing...' }
  ]);

  const [jobApplications, setJobApplications] = useState([
    { 
      id: 'APP-901', 
      name: 'Rohan Sharma', 
      firstName: 'Rohan',
      lastName: 'Sharma',
      email: 'rohan.s@gmail.com', 
      phone: '98765 43210',
      address: '12B, Skyline Apartments, Palarivattom',
      city: 'Ernakulam',
      state: 'Kerala',
      zip: '682025',
      cvName: 'cv_rohan_sharma.pdf',
      role: 'Senior Credit Analyst', 
      dept: 'Credit & Risk', 
      applied: '2026-05-24', 
      status: 'Reviewing' 
    },
    { 
      id: 'APP-402', 
      name: 'Divya Iyer', 
      firstName: 'Divya',
      lastName: 'Iyer',
      email: 'divya.iyer@outlook.com', 
      phone: '94471 23456',
      address: 'Apt 4G, Choice Marina, Kundannoor',
      city: 'Ernakulam',
      state: 'Kerala',
      zip: '682304',
      cvName: 'cv_divya_iyer.pdf',
      role: 'Loan Officer', 
      dept: 'Operations', 
      applied: '2026-05-22', 
      status: 'Shortlisted' 
    },
    { 
      id: 'APP-105', 
      name: 'Vikram Seth', 
      firstName: 'Vikram',
      lastName: 'Seth',
      email: 'vikram.seth@yahoo.com', 
      phone: '90012 34567',
      address: 'Plot 88, Kaloor-Kadavanthra Rd',
      city: 'Ernakulam',
      state: 'Kerala',
      zip: '682017',
      cvName: 'resume_vikram_seth.pdf',
      role: 'Senior Credit Analyst', 
      dept: 'Credit & Risk', 
      applied: '2026-05-20', 
      status: 'Interviewing' 
    },
    { 
      id: 'APP-339', 
      name: 'Nisha Varma', 
      firstName: 'Nisha',
      lastName: 'Varma',
      email: 'nisha.v@gmail.com', 
      phone: '97441 55667',
      address: '33C, Olive Heights, Kakkanad',
      city: 'Ernakulam',
      state: 'Kerala',
      zip: '682030',
      cvName: 'cv_nisha_varma.pdf',
      role: 'Lead Compliance Architect', 
      dept: 'Engineering', 
      applied: '2026-05-18', 
      status: 'Rejected' 
    }
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

  const handleRechargeWallet = async (amount) => {
    try {
      // 1. Create Razorpay Order on backend
      const orderData = await apiClient('/admin/wallet/create-order', {
        method: 'POST',
        body: JSON.stringify({ amount })
      });

      if (!orderData || !orderData.order_id) {
        throw new Error("Failed to create Razorpay order.");
      }

      // 2. Configure and Open Razorpay Checkout modal
      const options = {
        key: "rzp_test_SvWORMMdaUGuZO", // Public Key ID from backend
        amount: orderData.amount, // Amount in Paise
        currency: "INR",
        name: "LendoGo Admin Capital",
        description: `Wallet Recharge: ₹${amount.toLocaleString('en-IN')}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // 3. Verify Payment signature on backend
            const verifyData = await apiClient('/admin/wallet/verify-payment', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: amount // Actual INR amount to credit
              })
            });

            // 4. Update balance state and log audit
            await fetchWalletBalance();
            addAuditLog(`Admin wallet recharged by ₹${amount.toLocaleString('en-IN')} via Razorpay (Order ID: ${orderData.order_id})`, 'success');
            alert(verifyData.message || "Admin Wallet recharged successfully!");
          } catch (verifyErr) {
            console.error("Razorpay verification error:", verifyErr);
            alert(`Payment verification failed: ${verifyErr.message}`);
          }
        },
        prefill: {
          name: adminName,
          email: adminEmail,
        },
        theme: {
          color: "#0066ff"
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay Checkout dismissed.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Razorpay recharge failed:", err);
      alert(`Recharge failed: ${err.message}`);
    }
  };

  const handleCreateJobOpening = (job) => {
    const newId = `JOB-0${careersOpenings.length + 1}`;
    const newJob = {
      id: newId,
      title: job.title,
      dept: job.dept,
      type: job.type || 'Full-Time',
      status: 'Open',
      applicants: 0,
      experience: job.experience || '1-3 yrs',
      location: job.location || 'Ernakulam, Palarivattom',
      mode: job.mode || 'Hybrid',
      skills: job.skills || [],
      briefNote: job.briefNote || '',
      aboutRole: job.aboutRole || ''
    };
    setCareersOpenings(prev => [newJob, ...prev]);
    addAuditLog(`Job opening '${job.title}' (${newId}) created successfully`, 'success');
  };

  const handleResolveTicket = (ticketId, customerName) => {
    const calledIds = JSON.parse(localStorage.getItem('lendogo_called_consultations') || '[]');
    if (!calledIds.includes(ticketId)) {
      calledIds.push(ticketId);
      localStorage.setItem('lendogo_called_consultations', JSON.stringify(calledIds));
    }
    
    setConsultations(prev => prev.map(c => c.id === ticketId ? { ...c, status: 'Called' } : c));
    addAuditLog(`Consultation request for ${customerName} has been processed and marked as Called.`, 'success');
    alert(`Consultation request for ${customerName} marked as Called successfully!`);
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
      clearance: newStaffRole === 'Lending Officer' ? 'L3 Admin' : newStaffRole === 'Credit Underwriter' ? 'L2 Compliance' : 'L1 Operations'
    };
    
    setStaffMembers(prev => [...prev, newStaff]);
    addAuditLog(`Created new staff account for ${newStaffName} (${newStaffRole})`, 'success');
    setNewStaffName('');
    setNewStaffEmail('');
  };

  const handleUpdateStaffRole = (staffEmail, nextRole) => {
    const clearanceMap = {
      'Verification Agent': 'L1 Operations',
      'Credit Underwriter': 'L2 Compliance',
      'Lending Officer': 'L3 Admin'
    };
    
    setStaffMembers(prev => prev.map(s => {
      if (s.email === staffEmail) {
        return {
          ...s,
          role: nextRole,
          clearance: clearanceMap[nextRole] || 'L1 Operations'
        };
      }
      return s;
    }));
    
    addAuditLog(`Staff clearance role updated for ${staffEmail} to ${nextRole}`, 'info');
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
    localStorage.removeItem('lendogo_user');
    alert('Logged out from Admin Dashboard successfully.');
    navigate('/');
  };

  return {
    darkMode, setDarkMode,
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    sidebarCollapsed, setSidebarCollapsed,
    minCreditScore, setMinCreditScore,
    baseInterestRate, setBaseInterestRate,
    isSignupsEnabled, setIsSignupsEnabled,
    isConsultationsEnabled, setIsConsultationsEnabled,
    activeBalance, setActiveBalance,
    disbursedCapital, setDisbursedCapital,
    adminAvatar, setAdminAvatar,
    adminName, setAdminName,
    adminEmail, setAdminEmail,
    emailInput, setEmailInput,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    transferEmail, setTransferEmail,
    transferKey, setTransferKey,
    auditLogs, setAuditLogs,
    users, setUsers,
    kycList, setKycList,
    loanRequests, setLoanRequests,
    approvedLoans, setApprovedLoans,
    careersOpenings, setCareersOpenings,
    jobApplications, setJobApplications,
    consultations, setConsultations,
    staffMembers, setStaffMembers,
    newStaffName, setNewStaffName,
    newStaffEmail, setNewStaffEmail,
    newStaffRole, setNewStaffRole,
    liveMarquee, setLiveMarquee,
    showConfigSuccess, setShowConfigSuccess,
    addAuditLog,
    handleToggleUserStatus,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleApproveKYC,
    handleRejectKYC,
    handleRunRiskAudit,
    handleApproveLoan,
    handleRejectLoan,
    handleDisburseMoney,
    handleToggleJobStatus,
    handleCreateJobOpening,
    handleUpdateApplicantStatus,
    handleRechargeWallet,
    handleResolveTicket,
    handleAddStaff,
    handleUpdateStaffRole,
    handleSaveWebConfig,
    handleSimulatePhotoUpload,
    handleUpdateAdminEmail,
    handleUpdateAdminPassword,
    handleTransferOwnership,
    handleAdminLogout
  };
};
