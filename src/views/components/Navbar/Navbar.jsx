import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import './Navbar.css';
import ConsultationModal from '../ConsultationModal/ConsultationModal';
import TrustScoreView from './TrustScoreView';
import { useAuthController } from '../../../controllers/auth/useAuthController';
import { apiClient } from '../../../utils/apiClient';

// Global sliding profile sidebar React Portal component (Nested Sub-Views System)
const UserSidebar = ({ isOpen, onClose, user, signOut, navigate, initialView = 'menu', showToast }) => {
  // Navigation stack state ('menu', 'profile', 'trustScore', 'loan', 'repayment', 'feedback')
  const [currentView, setCurrentView] = useState(initialView);
  const [walletBalance, setWalletBalance] = useState(0);

  const getStoredScore = () => {
    if (!user || !user.email) return 736;
    const cached = localStorage.getItem(`trust_score_${user.email}`);
    if (cached) return parseInt(cached);
    let hash = 0;
    const email = user.email;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const generated = 620 + Math.abs(hash % 240);
    localStorage.setItem(`trust_score_${user.email}`, generated.toString());
    return generated;
  };

  const fetchBalance = async () => {
    if (!user || !user.isAuthenticated) return;
    try {
      const res = await apiClient('/user/wallet/balance');
      if (res && res.success && res.data) {
        setWalletBalance(res.data.balance || 0);
      }
    } catch (err) {
      console.error("Failed to fetch user wallet balance:", err);
    }
  };

  useEffect(() => {
    if (isOpen && user && user.isAuthenticated) {
      fetchBalance();
    }
  }, [isOpen, user]);

  useEffect(() => {
    window.addEventListener('wallet-balance-changed', fetchBalance);
    return () => {
      window.removeEventListener('wallet-balance-changed', fetchBalance);
    };
  }, [user]);

  // Load profile photo state
  const [profilePhoto, setProfilePhoto] = useState(
    localStorage.getItem('user_dp') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);

  const getFallbackName = () => {
    if (user && user.name && user.name !== 'LendoGO User') {
      return user.name;
    }
    if (user && user.email) {
      const namePart = user.email.split('@')[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const cleanName = capitalized.replace(/[0-9]/g, '');
      return cleanName || namePart;
    }
    return 'LendoGO Borrower';
  };

  // Load state from localStorage or default to empty
  const [fullName, setFullName] = useState(() => {
    return localStorage.getItem('user_full_name') || getFallbackName();
  });
  const [phone, setPhone] = useState(localStorage.getItem('user_phone') || '');
  const [dob, setDob] = useState(localStorage.getItem('user_dob') || '');
  const [pincode, setPincode] = useState(localStorage.getItem('user_pincode') || '');
  const [address, setAddress] = useState(localStorage.getItem('user_address') || '');

  const fetchUserProfile = async () => {
    if (!user || !user.isAuthenticated) return;
    try {
      const res = await apiClient('/user/profile');
      if (res && res.success && res.data) {
        const p = res.data;
        const nameVal = p.full_name || getFallbackName();
        const phoneVal = p.phone_number || '';
        const dobVal = p.date_of_birth || '';
        const pincodeVal = p.pincode || '';
        const addressVal = p.address || '';
        const profileImgUrl = p.profile_image ? `http://localhost:8080${p.profile_image}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

        setFullName(nameVal);
        setPhone(phoneVal);
        setDob(dobVal);
        setPincode(pincodeVal);
        setAddress(addressVal);
        setProfilePhoto(profileImgUrl);

        // Sync to localStorage
        localStorage.setItem('user_full_name', nameVal);
        localStorage.setItem('user_phone', phoneVal);
        localStorage.setItem('user_dob', dobVal);
        localStorage.setItem('user_pincode', pincodeVal);
        localStorage.setItem('user_address', addressVal);
        localStorage.setItem('user_dp', profileImgUrl);

        window.dispatchEvent(new Event('user-dp-changed'));
        window.dispatchEvent(new Event('user-details-changed'));
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    if (isOpen && user && user.isAuthenticated) {
      fetchUserProfile();
    }
  }, [isOpen, user]);

  const wasOpenRef = useRef(false);
  const prevInitialViewRef = useRef(initialView);

  useEffect(() => {
    if ((isOpen && !wasOpenRef.current) || (isOpen && initialView !== prevInitialViewRef.current)) {
      setCurrentView(initialView);
    }
    wasOpenRef.current = isOpen;
    prevInitialViewRef.current = initialView;
  }, [isOpen, initialView]);

  const [panNumber, setPanNumber] = useState(localStorage.getItem('kyc_pan_number') || '');
  const [aadhaarNumber, setAadhaarNumber] = useState(localStorage.getItem('kyc_aadhaar_number') || '');
  const [fatherName, setFatherName] = useState(localStorage.getItem('kyc_father_name') || '');
  const [employmentType, setEmploymentType] = useState(localStorage.getItem('kyc_employment') || 'Salaried');
  const [monthlyIncome, setMonthlyIncome] = useState(localStorage.getItem('kyc_income') || '');
  const [kycAddress, setKycAddress] = useState(localStorage.getItem('kyc_verified_address') || '');

  const [aadharFrontName, setAadharFrontName] = useState(localStorage.getItem('kyc_aadhar_front') || 'No file uploaded');
  const [aadharBackName, setAadharBackName] = useState(localStorage.getItem('kyc_aadhar_back') || 'No file uploaded');
  const [panFileName, setPanFileName] = useState(localStorage.getItem('kyc_pan_file') || 'No file uploaded');

  // Feedback form states
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('English');

  // Collapsible states inside repayment schedules view
  const [expandedRepaymentInstallment, setExpandedRepaymentInstallment] = useState(1);

  // Applied Loan History State
  const [loanHistory, setLoanHistory] = useState([
    { id: 'LGO-1092', type: 'Personal Loan', amount: 50000, status: 'DISBURSED', date: 'May 12, 2026' },
    { id: 'LGO-0871', type: 'Instant Mobile Loan', amount: 15000, status: 'APPROVED', date: 'May 24, 2026' },
    { id: 'LGO-0654', type: 'Credit Builder Loan', amount: 10000, status: 'PENDING', date: 'May 25, 2026' }
  ]);

  // Bank Accounts Coordinates State
  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, bankName: 'State Bank of India', accNum: '•••• •••• 4099', ifsc: 'SBIN0001234', isPrimary: true },
    { id: 2, bankName: 'HDFC Bank Ltd', accNum: '•••• •••• 8812', ifsc: 'HDFC0000124', isPrimary: false }
  ]);

  // Link New Bank Form State
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccNum, setNewAccNum] = useState('');
  const [newIfsc, setNewIfsc] = useState('');

  // Handle Linked Account addition
  const handleAddBankAccount = (e) => {
    e.preventDefault();
    if (!newBankName || !newAccNum || !newIfsc) {
      showToast('Please fill out all bank credentials.', 'error');
      return;
    }
    const maskedAcc = '•••• •••• ' + newAccNum.slice(-4);
    const newBank = {
      id: Date.now(),
      bankName: newBankName,
      accNum: maskedAcc,
      ifsc: newIfsc.toUpperCase(),
      isPrimary: bankAccounts.length === 0
    };
    setBankAccounts([...bankAccounts, newBank]);
    setNewBankName('');
    setNewAccNum('');
    setNewIfsc('');
    setShowAddBank(false);
    showToast('Bank account successfully verified and linked to LendoGo Wallet!', 'success');
  };

  // Set Bank Account as primary
  const handleSetPrimaryBank = (id) => {
    setBankAccounts(prev => prev.map(bank => ({
      ...bank,
      isPrimary: bank.id === id
    })));
  };

  // Remove Bank Account
  const handleRemoveBank = (id) => {
    if (confirm('Are you sure you want to unlink this bank account from LendoGo?')) {
      const bank = bankAccounts.find(b => b.id === id);
      if (bank && bank.isPrimary && bankAccounts.length > 1) {
        showToast('Please select another primary bank before unlinking this one.', 'error');
        return;
      }
      setBankAccounts(prev => prev.filter(b => b.id !== id));
    }
  };

  // Sync state reactively if changes happen elsewhere
  useEffect(() => {
    if (!isOpen) return;
    const syncState = () => {
      setFullName(localStorage.getItem('user_full_name') || getFallbackName());
      setPhone(localStorage.getItem('user_phone') || '');
      setDob(localStorage.getItem('user_dob') || '');
      setPincode(localStorage.getItem('user_pincode') || '');
      setAddress(localStorage.getItem('user_address') || '');
      setPanNumber(localStorage.getItem('kyc_pan_number') || '');
      setAadhaarNumber(localStorage.getItem('kyc_aadhaar_number') || '');
      setFatherName(localStorage.getItem('kyc_father_name') || '');
      setEmploymentType(localStorage.getItem('kyc_employment') || 'Salaried');
      setMonthlyIncome(localStorage.getItem('kyc_income') || '');
      setKycAddress(localStorage.getItem('kyc_verified_address') || '');
      setAadharFrontName(localStorage.getItem('kyc_aadhar_front') || 'No file uploaded');
      setAadharBackName(localStorage.getItem('kyc_aadhar_back') || 'No file uploaded');
      setPanFileName(localStorage.getItem('kyc_pan_file') || 'No file uploaded');
      setProfilePhoto(localStorage.getItem('user_dp') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
    };
    window.addEventListener('user-details-changed', syncState);
    window.addEventListener('user-dp-changed', syncState);
    return () => {
      window.removeEventListener('user-details-changed', syncState);
      window.removeEventListener('user-dp-changed', syncState);
    };
  }, [isOpen]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    const defaultNoDp = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    setProfilePhoto(defaultNoDp);
    setSelectedPhotoFile(null);
    localStorage.removeItem('user_dp');
    window.dispatchEvent(new Event('user-dp-changed'));
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('phone_number', phone);
      formData.append('date_of_birth', dob);
      formData.append('pincode', pincode);
      formData.append('address', address);
      if (selectedPhotoFile) {
        formData.append('profile_image', selectedPhotoFile);
      }

      await apiClient('/user/profile', {
        method: 'PUT',
        body: formData,
      });

      localStorage.setItem('user_full_name', fullName);
      localStorage.setItem('user_phone', phone);
      localStorage.setItem('user_dob', dob);
      localStorage.setItem('user_pincode', pincode);
      localStorage.setItem('user_address', address);

      const res = await apiClient('/user/profile');
      if (res && res.success && res.data) {
        const p = res.data;
        const profileImgUrl = p.profile_image ? `http://localhost:8080${p.profile_image}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        setProfilePhoto(profileImgUrl);
        localStorage.setItem('user_dp', profileImgUrl);
        window.dispatchEvent(new Event('user-dp-changed'));
      }

      window.dispatchEvent(new Event('user-details-changed'));
      setSelectedPhotoFile(null);
      setCurrentView('menu');
      showToast('Profile details updated successfully.', 'success');
    } catch (err) {
      console.error("Failed to save personal details:", err);
      showToast("Failed to save personal details: " + err.message, "error");
    }
  };

  const handleSaveKyc = (e) => {
    e.preventDefault();
    if (panNumber.length < 10 || aadhaarNumber.replace(/\s/g, '').length < 12) {
      showToast('Invalid PAN or Aadhaar format.', 'error');
      return;
    }
    localStorage.setItem('kyc_status', 'VERIFIED');
    localStorage.setItem('kyc_pan_number', panNumber.toUpperCase());
    localStorage.setItem('kyc_aadhaar_number', aadhaarNumber);
    localStorage.setItem('kyc_father_name', fatherName);
    localStorage.setItem('kyc_employment', employmentType);
    localStorage.setItem('kyc_income', monthlyIncome);
    localStorage.setItem('kyc_verified_address', kycAddress);
    window.dispatchEvent(new Event('user-details-changed'));
    showToast('KYC documents submitted and verified.', 'success');
    setCurrentView('menu');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    showToast(`Thank you for your feedback! Rating: ${feedbackRating}/5 stars. Comments submitted.`, 'success');
    setFeedbackComment('');
    setCurrentView('menu');
  };

  // Active Loan parameters
  const activeLoan = {
    id: 'LGO-1092',
    amountApplied: 100000,
    dateApplied: 'May 10, 2026',
    amountDistributed: 100000,
    dateDistributed: 'May 12, 2026',
    dailyInterestRate: '0.05%',
    numberOfEmis: 24,
    emiFrequency: 'Monthly',
    nextEmiAmount: 1532,
    nextEmiDueDate: '1 Jul 2026'
  };

  // Repayments schedule with Principal / Interest breakdowns
  const repaymentSchedule = [
    { 
      installment: 1, 
      date: '1 Jun 2026', 
      amount: 1532, 
      status: 'Paid',
      principal: 1370.17,
      interest: 161.83
    },
    { 
      installment: 2, 
      date: '1 Jul 2026', 
      amount: 1532, 
      status: 'Next Due',
      principal: 1370.17,
      interest: 161.83
    },
    { 
      installment: 3, 
      date: '31 Jul 2026', 
      amount: 1532, 
      status: 'Upcoming',
      principal: 1370.17,
      interest: 161.83
    },
    { 
      installment: 4, 
      date: '30 Aug 2026', 
      amount: 1532, 
      status: 'Upcoming',
      principal: 1370.17,
      interest: 161.83
    },
    { 
      installment: 5, 
      date: '29 Sep 2026', 
      amount: 1532, 
      status: 'Upcoming',
      principal: 1370.17,
      interest: 161.83
    },
    { 
      installment: 6, 
      date: '29 Oct 2026', 
      amount: 1532, 
      status: 'Upcoming',
      principal: 1370.17,
      interest: 161.83
    }
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="navbar-sidebar-wrapper">
      <div className="navbar-sidebar-backdrop" onClick={onClose} />
      <div className="navbar-sidebar-drawer animate-slide-in">
        
        {/* VIEW: MAIN NAVIGATION MENU */}
        {currentView === 'menu' && (
          <>
            <div className="sidebar-header">
              <div className="sidebar-user-card-header">
                <div className="sidebar-avatar-circle">
                  <img src={profilePhoto} alt="User Avatar" />
                </div>
                <div className="sidebar-meta-text">
                  <h4 className="sidebar-username">{fullName || getFallbackName()}</h4>
                  <span className="sidebar-useremail">{user.email}</span>
                  <span className="sidebar-kyc-badge" style={{ backgroundColor: '#eff6ff', color: '#0f66ff' }}>
                    TRUST SCORE: {getStoredScore()}
                  </span>
                </div>
              </div>
              <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="Close Profile Portal">×</button>
            </div>

            {/* High-fidelity Wallet Card Highlight */}
            <div className="sidebar-wallet-highlight-card">
              <div className="wallet-card-overlay-glow" />
              <div className="wallet-card-left-section">
                <span className="wallet-card-label">LendoGo Wallet Balance</span>
                <span className="wallet-card-amount">₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="wallet-card-right-section">
                <span className="wallet-active-pulse-dot"></span>
                <span className="wallet-active-status-text">ACTIVE LIMIT</span>
              </div>
            </div>

            <div className="sidebar-scroll-content">
              <div className="sidebar-navigation-menu-list">
                
                <div className="sidebar-menu-card-item" onClick={() => setCurrentView('profile')}>
                  <div className="sidebar-menu-left-details">
                    <span className="sidebar-menu-title">Profile</span>
                    <span className="sidebar-menu-subtitle">Edit your personal information</span>
                  </div>
                  <span className="sidebar-arrow-chevron">&gt;</span>
                </div>

                <div className="sidebar-menu-card-item" onClick={() => setCurrentView('trustScore')}>
                  <div className="sidebar-menu-left-details">
                    <span className="sidebar-menu-title">Internal Trust Score</span>
                    <span className="sidebar-menu-subtitle">Real-time internal credit score assessment</span>
                  </div>
                  <span className="sidebar-arrow-chevron">&gt;</span>
                </div>

                <div className="sidebar-menu-card-item" onClick={() => setCurrentView('loan')}>
                  <div className="sidebar-menu-left-details">
                    <span className="sidebar-menu-title">Financial Accounts</span>
                    <span className="sidebar-menu-subtitle">Manage bank accounts and active loan metrics</span>
                  </div>
                  <span className="sidebar-arrow-chevron">&gt;</span>
                </div>

                <div className="sidebar-menu-card-item" onClick={() => setCurrentView('repayment')}>
                  <div className="sidebar-menu-left-details">
                    <span className="sidebar-menu-title">Transaction & Repayment History</span>
                    <span className="sidebar-menu-subtitle">View repayment schedules and EMI dates</span>
                  </div>
                  <span className="sidebar-arrow-chevron">&gt;</span>
                </div>

                <div className="sidebar-menu-card-item" onClick={() => setCurrentView('feedback')}>
                  <div className="sidebar-menu-left-details">
                    <span className="sidebar-menu-title">Feedback & App Settings</span>
                    <span className="sidebar-menu-subtitle">Help, push alerts, and submit evaluations</span>
                  </div>
                  <span className="sidebar-arrow-chevron">&gt;</span>
                </div>

              </div>

              {/* Secure exit at the bottom of the main menu */}
              <div className="sidebar-exit-section mt-3">
                <button 
                  type="button" 
                  className="sidebar-logout-btn-unified" 
                  onClick={() => {
                    signOut();
                    onClose();
                    navigate('/');
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}

        {/* VIEW: PERSONAL PROFILE SUB-SCREEN */}
        {currentView === 'profile' && (
          <>
            <div className="sidebar-header subview-header-row">
              <button type="button" className="sidebar-back-nav-btn" onClick={() => setCurrentView('menu')}>← Back</button>
              <h4 className="sidebar-subpage-title-text">Profile Details</h4>
              <div style={{ width: '40px' }} />
            </div>

            <div className="sidebar-scroll-content">
              {/* Profile Photo Upload */}
              <div className="sidebar-photo-container">
                <img src={profilePhoto} alt="Sidebar Profile" className="sidebar-profile-img" />
                <div className="sidebar-photo-actions">
                  <label className="sidebar-photo-btn upload">
                    Upload Photo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                  {profilePhoto !== 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' && (
                    <button type="button" className="sidebar-photo-btn delete" onClick={handleRemovePhoto}>
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSavePersonal} className="sidebar-form">
                <div className="sidebar-input-group">
                  <label>Full Legal Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter legal name"
                    className="sidebar-input-field"
                    required
                  />
                </div>
                <div className="sidebar-input-group">
                  <label>Phone Coordinate</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="sidebar-input-field"
                    required
                  />
                </div>
                <div className="sidebar-input-group">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="sidebar-input-field"
                    required
                  />
                </div>
                <div className="sidebar-input-group">
                  <label>Postal Pincode</label>
                  <input 
                    type="text" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit pincode"
                    className="sidebar-input-field"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="sidebar-input-group">
                  <label>Residential Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter residential address"
                    className="sidebar-textarea-field"
                    required
                  />
                </div>
                <button type="submit" className="sidebar-submit-btn-unified">Save Account Details</button>
              </form>
            </div>
          </>
        )}

        {/* VIEW: TRUST SCORE ASSESSMENT SUB-SCREEN */}
        {currentView === 'trustScore' && (
          <>
            <div className="sidebar-header subview-header-row">
              <button type="button" className="sidebar-back-nav-btn" onClick={() => setCurrentView('menu')}>← Back</button>
              <h4 className="sidebar-subpage-title-text">Trust Score Assessment</h4>
              <div style={{ width: '40px' }} />
            </div>

            <div className="sidebar-scroll-content">
              <TrustScoreView user={user} showToast={showToast} />
            </div>
          </>
        )}

        {/* VIEW: FINANCIAL ACCOUNTS & ACTIVE LOAN DETAILS */}
        {currentView === 'loan' && (
          <>
            <div className="sidebar-header subview-header-row">
              <button type="button" className="sidebar-back-nav-btn" onClick={() => setCurrentView('menu')}>← Back</button>
              <h4 className="sidebar-subpage-title-text">Loans & Portfolio</h4>
              <div style={{ width: '40px' }} />
            </div>

            <div className="sidebar-scroll-content">
              {/* Premium Card matching fourth image */}
              <div className="sidebar-amount-due-premium-card">
                <div className="card-top-amounts">
                  <div className="amount-group">
                    <span className="card-amount-label">Amount Due</span>
                    <h2 className="card-amount-value">₹{activeLoan.nextEmiAmount.toLocaleString('en-IN')}</h2>
                  </div>
                  <div className="amount-group text-right">
                    <span className="card-amount-label">Due On</span>
                    <span className="card-due-date-value">{activeLoan.nextEmiDueDate}</span>
                  </div>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="card-progress-section">
                  <div className="card-progress-bar-track">
                    <div className="card-progress-bar-fill" style={{ width: '100%' }}></div>
                  </div>
                  <div className="card-progress-labels">
                    <span>Paid ₹1,532</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="card-repayment-action-btn"
                  onClick={() => showToast('Redirecting to secure repayment gateway...', 'info')}
                >
                  Make a Repayment
                </button>
              </div>

              {/* Parameter List */}
              <div className="sidebar-loan-parameters-vertical-list">
                <h5 className="sidebar-subpage-sub-title">Active Loan Specifications</h5>

                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">Loan Account ID</span>
                  <span className="param-value-tag">{activeLoan.id}</span>
                </div>
                
                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">Amount Applied</span>
                  <span className="param-value-tag">₹{activeLoan.amountApplied.toLocaleString('en-IN')}</span>
                </div>

                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">Date Applied</span>
                  <span className="param-value-tag">{activeLoan.dateApplied}</span>
                </div>

                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">Amount Distributed</span>
                  <span className="param-value-tag">₹{activeLoan.amountDistributed.toLocaleString('en-IN')}</span>
                </div>

                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">Date Distributed</span>
                  <span className="param-value-tag">{activeLoan.dateDistributed}</span>
                </div>

                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">Daily Interest Rate</span>
                  <span className="param-value-tag highlight-green">{activeLoan.dailyInterestRate}</span>
                </div>

                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">Number of EMIs</span>
                  <span className="param-value-tag">{activeLoan.numberOfEmis} Months</span>
                </div>

                <div className="sidebar-param-row-detail">
                  <span className="param-label-tag">EMI Frequency</span>
                  <span className="param-value-tag">{activeLoan.emiFrequency}</span>
                </div>
              </div>

              {/* Card 2: Applied Loan History */}
              <div style={{ marginTop: '2rem' }}>
                <h5 className="sidebar-subpage-sub-title">Applied Loan History</h5>
                <div className="loan-history-list">
                  {loanHistory.length === 0 ? (
                    <p className="no-loans-text">No active or applied loans found.</p>
                  ) : (
                    loanHistory.map((loan) => (
                      <div key={loan.id} className="loan-history-item">
                        <div className="loan-item-details">
                          <div className="loan-type-row">
                            <span className="loan-icon-bullet">📄</span>
                            <div className="loan-meta-info">
                              <h4>{loan.type}</h4>
                              <span className="loan-id-sub">{loan.id} • {loan.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="loan-status-wrap">
                          <span className={`loan-status-tag ${loan.status.toLowerCase()}`}>
                            {loan.status}
                          </span>
                          <h4 className="loan-amount-val">₹{loan.amount.toLocaleString('en-IN')}</h4>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Card 3: Linked Bank Accounts Coordinates */}
              <div style={{ marginTop: '1.5rem', paddingBottom: '2rem' }}>
                <h5 className="sidebar-subpage-sub-title">Bank Accounts Coordinates</h5>

                {!showAddBank ? (
                  <button 
                    type="button" 
                    className="add-bank-trigger-btn"
                    onClick={() => setShowAddBank(true)}
                  >
                    + Link New Bank Account
                  </button>
                ) : (
                  <form onSubmit={handleAddBankAccount} className="add-bank-form-card">
                    <div className="sidebar-form-grid">
                      <div className="sidebar-input-group" style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.72rem', color: '#64748b' }}>Bank Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. HDFC Bank, SBI, ICICI" 
                          value={newBankName} 
                          onChange={(e) => setNewBankName(e.target.value)} 
                          className="sidebar-input-field"
                          required
                        />
                      </div>
                      <div className="sidebar-form-grid-row">
                        <div className="sidebar-input-group" style={{ marginBottom: '0.5rem' }}>
                          <label style={{ fontSize: '0.72rem', color: '#64748b' }}>Account Number</label>
                          <input 
                            type="password" 
                            placeholder="12-16 digit Account Number" 
                            value={newAccNum} 
                            onChange={(e) => setNewAccNum(e.target.value)} 
                            className="sidebar-input-field"
                            required
                          />
                        </div>
                        <div className="sidebar-input-group" style={{ marginBottom: '0.5rem' }}>
                          <label style={{ fontSize: '0.72rem', color: '#64748b' }}>IFSC Code</label>
                          <input 
                            type="text" 
                            placeholder="e.g. ICIC0000124" 
                            value={newIfsc} 
                            onChange={(e) => setNewIfsc(e.target.value)} 
                            className="sidebar-input-field"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="sidebar-submit-btn-unified" style={{ padding: '0.4rem 0.8rem', fontSize: '0.72rem', marginTop: 0 }}>
                        Verify & Link Bank
                      </button>
                      <button 
                        type="button" 
                        className="sidebar-back-nav-btn" 
                        onClick={() => setShowAddBank(false)}
                        style={{ fontSize: '0.72rem', padding: '0.4rem 0.8rem', background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="linked-banks-list">
                  {bankAccounts.map((bank) => (
                    <div key={bank.id} className={`bank-account-item ${bank.isPrimary ? 'primary-highlight' : ''}`}>
                      <div className="bank-item-left">
                        <div className="bank-avatar-badge">🏦</div>
                        <div className="bank-item-details">
                          <div className="bank-item-name-row">
                            <h4>{bank.bankName}</h4>
                            {bank.isPrimary && <span className="primary-pill">Primary</span>}
                          </div>
                          <p>{bank.accNum} • IFSC: {bank.ifsc}</p>
                        </div>
                      </div>
                      <div className="bank-item-actions">
                        {!bank.isPrimary && (
                          <button 
                            type="button" 
                            className="bank-action-btn primary-trigger"
                            onClick={() => handleSetPrimaryBank(bank.id)}
                            title="Set as primary payout bank"
                          >
                            Set Primary
                          </button>
                        )}
                        <button 
                          type="button" 
                          className="bank-action-btn unlink-trigger"
                          onClick={() => handleRemoveBank(bank.id)}
                          title="Unlink account"
                        >
                          Unlink
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* VIEW: REPAYMENT SCHEDULE */}
        {currentView === 'repayment' && (
          <>
            <div className="sidebar-header subview-header-row">
              <button type="button" className="sidebar-back-nav-btn" onClick={() => setCurrentView('menu')}>← Back</button>
              <h4 className="sidebar-subpage-title-text">Repayment Schedule</h4>
              <div style={{ width: '40px' }} />
            </div>

            <div className="sidebar-scroll-content">
              {/* Top next due card matching third image */}
              <div className="sidebar-repayment-quick-summary-card">
                <div className="summary-col">
                  <span className="summary-lbl">Next EMI</span>
                  <span className="summary-val">₹{activeLoan.nextEmiAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-col">
                  <span className="summary-lbl">Due On</span>
                  <span className="summary-val">{activeLoan.nextEmiDueDate}</span>
                </div>
              </div>

              <h5 className="sidebar-subpage-sub-title">Upcoming & Past Installments</h5>

              {/* Installment dates cards list matching third image exactly */}
              <div className="sidebar-repayment-list-stack">
                {repaymentSchedule.map((emi) => {
                  const isExpanded = expandedRepaymentInstallment === emi.installment;
                  return (
                    <div key={emi.installment} className="sidebar-repayment-card-row">
                      <div 
                        className="repayment-card-row-header"
                        onClick={() => setExpandedRepaymentInstallment(isExpanded ? null : emi.installment)}
                      >
                        <div className="repayment-row-left-group">
                          <span className="repayment-emi-date-lbl">{emi.date}</span>
                          {emi.status === 'Paid' && (
                            <span className="repayment-status-paid-icon">✓</span>
                          )}
                          {emi.status === 'Next Due' && (
                            <span className="repayment-status-badge next-due">Next Due</span>
                          )}
                        </div>
                        <div className="repayment-row-right-group">
                          <span className="repayment-amount-val">
                            {emi.status === 'Paid' ? 'Paid' : `₹${emi.amount.toLocaleString('en-IN')}`}
                          </span>
                          <span className="repayment-arrow-toggle-indicator">
                            {isExpanded ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="repayment-card-row-body-details">
                          <div className="repayment-breakdown-row">
                            <span className="breakdown-lbl">Principal</span>
                            <span className="breakdown-val">₹{emi.principal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="repayment-breakdown-row">
                            <span className="breakdown-lbl">Interest + Fees</span>
                            <span className="breakdown-val">₹{emi.interest.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grand Repayment Button matching third image */}
              <button 
                type="button" 
                className="sidebar-make-repayment-unified-btn mt-3"
                onClick={() => showToast('Launching Secure Repayment Gateway...', 'info')}
              >
                Make a Repayment
              </button>
            </div>
          </>
        )}

        {/* VIEW: FEEDBACK & APP SETTINGS */}
        {currentView === 'feedback' && (
          <>
            <div className="sidebar-header subview-header-row">
              <button type="button" className="sidebar-back-nav-btn" onClick={() => setCurrentView('menu')}>← Back</button>
              <h4 className="sidebar-subpage-title-text">Feedback & Settings</h4>
              <div style={{ width: '40px' }} />
            </div>

            <div className="sidebar-scroll-content">
              <form onSubmit={handleSubmitFeedback} className="sidebar-form">
                <h5 className="sidebar-subpage-sub-title">Rate LendoGo Platform</h5>
                
                <div className="sidebar-input-group">
                  <label>Satisfactory Rating ({feedbackRating} / 5 Stars)</label>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={feedbackRating} 
                    onChange={(e) => setFeedbackRating(parseInt(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: '#0f66ff' }}
                  />
                  <div className="rating-slider-labels">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="sidebar-input-group">
                  <label>Comments / Suggestions</label>
                  <textarea 
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="How can we make your fintech experience better?"
                    className="sidebar-textarea-field"
                    required
                  />
                </div>

                <button type="submit" className="sidebar-submit-btn-unified">Submit Feedback Coordinates</button>
              </form>

              {/* App Settings block */}
              <div className="sidebar-app-settings-card-wrapper mt-3">
                <h5 className="sidebar-subpage-sub-title">Fintech App Configuration</h5>
                
                <div className="sidebar-settings-toggle-row">
                  <label className="toggle-lbl">Language Selection</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="sidebar-input-field"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', minWidth: '110px' }}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>

                <div className="sidebar-settings-toggle-row mt-2">
                  <label className="toggle-lbl">Push App Notifications</label>
                  <input 
                    type="checkbox" 
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0f66ff' }}
                  />
                </div>

                <div className="sidebar-settings-toggle-row mt-2" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <span className="app-version-lbl">Software Version</span>
                  <span className="app-version-val">v1.2.4 (Stable Release)</span>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </div>,
    document.body
  );
};

const Navbar = () => {
  const { user, signOut } = useAuthController();
  const navigate = useNavigate();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [sidebarInitialView, setSidebarInitialView] = useState('menu');
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const navbarRef = useRef(null);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [profileDp, setProfileDp] = useState(
    localStorage.getItem('user_dp') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );

  const getFallbackName = () => {
    if (user && user.name && user.name !== 'LendoGO User') {
      return user.name;
    }
    if (user && user.email) {
      const namePart = user.email.split('@')[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      const cleanName = capitalized.replace(/[0-9]/g, '');
      return cleanName || namePart;
    }
    return 'LendoGO Borrower';
  };

  const [fullName, setFullName] = useState(() => {
    return localStorage.getItem('user_full_name') || getFallbackName();
  });

  useEffect(() => {
    const handleDpChange = () => {
      setProfileDp(
        localStorage.getItem('user_dp') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      );
    };
    const handleDetailsChange = () => {
      setFullName(localStorage.getItem('user_full_name') || getFallbackName());
    };
    window.addEventListener('user-dp-changed', handleDpChange);
    window.addEventListener('user-details-changed', handleDetailsChange);

    if (user && user.isAuthenticated) {
      const fetchProfileInit = async () => {
        try {
          const res = await apiClient('/user/profile');
          if (res && res.success && res.data) {
            const p = res.data;
            const nameVal = p.full_name || getFallbackName();
            const profileImgUrl = p.profile_image ? `http://localhost:8080${p.profile_image}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            
            localStorage.setItem('user_full_name', nameVal);
            localStorage.setItem('user_phone', p.phone_number || '');
            localStorage.setItem('user_dob', p.date_of_birth || '');
            localStorage.setItem('user_pincode', p.pincode || '');
            localStorage.setItem('user_address', p.address || '');
            localStorage.setItem('user_dp', profileImgUrl);

            setProfileDp(profileImgUrl);
            setFullName(nameVal);

            window.dispatchEvent(new Event('user-dp-changed'));
            window.dispatchEvent(new Event('user-details-changed'));
          }
        } catch (err) {
          console.error("Failed to prefetch profile on login:", err);
        }
      };
      fetchProfileInit();
    }

    return () => {
      window.removeEventListener('user-dp-changed', handleDpChange);
      window.removeEventListener('user-details-changed', handleDetailsChange);
    };
  }, [user]);

  const toggleDropdown = (e, dropdownName) => {
    e.preventDefault();
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setActiveDropdown(null);
    setProfileDropdownOpen(false);
    setNotificationsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If click target is inside the portal sidebar, do not close the dropdowns or menu!
      if (event.target.closest('.navbar-sidebar-wrapper')) {
        return;
      }
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setMenuOpen(false);
        setProfileDropdownOpen(false);
        setNotificationsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate(user.isAuthenticated ? '/home' : '/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon"></div>
          <span className="logo-text">LendoGO</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to={user.isAuthenticated ? "/home" : "/"} className="nav-link">Home</Link>

          <div className="dropdown-container">
            <a href="#" className="nav-link dropdown" onClick={(e) => toggleDropdown(e, 'loanProducts')}>Loan Products</a>
            {activeDropdown === 'loanProducts' && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => { navigate('/products/personal'); setActiveDropdown(null); }}>Personal Loans</button>
                <button className="dropdown-item" onClick={() => { navigate('/products/business'); setActiveDropdown(null); }}>Business Loan</button>
                <button className="dropdown-item" onClick={() => { navigate('/products/home'); setActiveDropdown(null); }}>Home Loan</button>
                <button className="dropdown-item" onClick={() => { navigate('/products/property'); setActiveDropdown(null); }}>Loan Against Property</button>
                <button className="dropdown-item" onClick={() => { navigate('/products/instant'); setActiveDropdown(null); }}>Instant Personal Loans</button>
                <button className="dropdown-item" onClick={() => { navigate('/products/credit-builder'); setActiveDropdown(null); }}>Credit Builder Loan</button>
              </div>
            )}
          </div>

          <a 
            href="#" 
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              if (user.isAuthenticated) {
                setSidebarInitialView('repayment');
                setProfileDropdownOpen(true);
              } else {
                navigate('/');
              }
            }}
          >
            Repay Loan
          </a>
          <Link to="/blogs" className="nav-link">Blogs</Link>

          <div className="dropdown-container">
            <a href="#" className="nav-link dropdown" onClick={(e) => toggleDropdown(e, 'support')}>Support</a>
            {activeDropdown === 'support' && (
              <div className="dropdown-menu">
                <Link to="/about" className="dropdown-item">About Us</Link>
                <Link to="/careers" className="dropdown-item">Careers </Link>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <button className="btn-outline" onClick={() => setModalOpen(true)}>Free Consultation</button>
          
          {user.isAuthenticated ? (
            <>
              {/* Notification Bell Dropdown */}
              <div className="notification-bell-container">
                <button 
                  type="button" 
                  className="navbar-bell-btn" 
                  onClick={() => setNotificationsDropdownOpen(!notificationsDropdownOpen)}
                  aria-label="Notifications"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bell-svg">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  <span className="bell-badge-dot">2</span>
                </button>
                
                {notificationsDropdownOpen && (
                  <div className="notifications-dropdown-menu">
                    <div className="notifications-header">
                      <h5>Notifications</h5>
                      <button type="button" className="mark-all-read-btn" onClick={() => showToast('All notifications marked as read!', 'success')}>Mark all read</button>
                    </div>
                    <div className="notifications-list">
                      <div 
                        className="notification-item unread" 
                        onClick={() => { 
                          setSidebarInitialView('trustScore'); 
                          setProfileDropdownOpen(true); 
                          setNotificationsDropdownOpen(false); 
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="notification-dot"></span>
                        <div className="notification-text-group">
                          <p className="notification-msg">Your LendoGo Trust Score was updated.</p>
                          <span className="notification-time">10 mins ago</span>
                        </div>
                      </div>
                      <div 
                        className="notification-item unread" 
                        onClick={() => { 
                          setSidebarInitialView('repayment'); 
                          setProfileDropdownOpen(true); 
                          setNotificationsDropdownOpen(false); 
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="notification-dot"></span>
                        <div className="notification-text-group">
                          <p className="notification-msg">Repayment due: EMI of ₹1,532 on Jul 01, 2026.</p>
                          <span className="notification-time">2 hours ago</span>
                        </div>
                      </div>
                      <div 
                        className="notification-item" 
                        onClick={() => { 
                          setSidebarInitialView('profile'); 
                          setProfileDropdownOpen(true); 
                          setNotificationsDropdownOpen(false); 
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="notification-text-group">
                          <p className="notification-msg">Welcome to LendoGo! Secure your profile coordinates today.</p>
                          <span className="notification-time">2 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-dropdown-container">
                <button 
                  type="button"
                  className="navbar-avatar-btn"
                  onClick={() => {
                    setSidebarInitialView('menu');
                    setProfileDropdownOpen(!profileDropdownOpen);
                  }}
                  aria-label="User Menu"
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <img 
                    src={profileDp} 
                    alt="User Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </button>
                
                <UserSidebar 
                  isOpen={profileDropdownOpen} 
                  onClose={() => setProfileDropdownOpen(false)} 
                  user={user}
                  signOut={signOut}
                  navigate={navigate}
                  initialView={sidebarInitialView}
                  showToast={showToast}
                />
              </div>
            </>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/')}>Sign In</button>
          )}
        </div>

        {/* Hamburger button — mobile only */}
        <button className="navbar-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`ham-bar ${menuOpen ? 'open-1' : ''}`}></span>
          <span className={`ham-bar ${menuOpen ? 'open-2' : ''}`}></span>
          <span className={`ham-bar ${menuOpen ? 'open-3' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <Link to={user.isAuthenticated ? "/home" : "/"} className="mobile-link" onClick={() => setMenuOpen(false)}>Home</Link>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'loanProductsMobile')}>
            Loan Products <span className="mobile-arrow">{activeDropdown === 'loanProductsMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'loanProductsMobile' && (
            <div className="mobile-submenu">
              <button className="mobile-sublink" onClick={() => { navigate('/products/personal'); setMenuOpen(false); }}>Personal Loans</button>
              <button className="mobile-sublink" onClick={() => { navigate('/products/business'); setMenuOpen(false); }}>Business Loan</button>
              <button className="mobile-sublink" onClick={() => { navigate('/products/home'); setMenuOpen(false); }}>Home Loan</button>
              <button className="mobile-sublink" onClick={() => { navigate('/products/property'); setMenuOpen(false); }}>Loan Against Property</button>
              <button className="mobile-sublink" onClick={() => { navigate('/products/instant'); setMenuOpen(false); }}>Instant Personal Loans</button>
              <button className="mobile-sublink" onClick={() => { navigate('/products/credit-builder'); setMenuOpen(false); }}>Credit Builder Loan</button>
            </div>
          )}
        </div>

        <a 
          href="#" 
          className="mobile-link" 
          onClick={(e) => { 
            e.preventDefault(); 
            setMenuOpen(false); 
            if (user.isAuthenticated) {
              setSidebarInitialView('repayment');
              setProfileDropdownOpen(true);
            } else {
              navigate('/');
            }
          }}
        >
          Repay Loan
        </a>
        <Link to="/blogs" className="mobile-link" onClick={() => setMenuOpen(false)}>Blogs</Link>

        <div className="mobile-dropdown">
          <button className="mobile-link mobile-link--toggle" onClick={(e) => toggleDropdown(e, 'supportMobile')}>
            Support <span className="mobile-arrow">{activeDropdown === 'supportMobile' ? '▲' : '▼'}</span>
          </button>
          {activeDropdown === 'supportMobile' && (
            <div className="mobile-submenu">
              <Link to="/about" className="mobile-sublink" onClick={() => setMenuOpen(false)}>About Us</Link>
              <Link to="/careers" className="mobile-sublink" onClick={() => setMenuOpen(false)}>Careers </Link>
            </div>
          )}
        </div>

        <div className="mobile-actions">
          <button className="btn-outline" onClick={() => { setModalOpen(true); setMenuOpen(false); }}>Free Consultation</button>
          
          {user.isAuthenticated ? (
            <div className="mobile-profile-info">
              <div className="mobile-avatar-badge" style={{ overflow: 'hidden', padding: 0 }}>
                <img 
                  src={profileDp} 
                  alt="User Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div className="mobile-user-details">
                <span className="mobile-username">{fullName || getFallbackName()}</span>
                <span className="mobile-useremail">{user.email}</span>
              </div>
              <div className="mobile-profile-links">
                <Link to="/home" className="mobile-profile-link-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button 
                  type="button" 
                  className="mobile-profile-link-item"
                  onClick={() => {
                    setSidebarInitialView('profile');
                    setProfileDropdownOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  My Profile
                </button>
                <button 
                  type="button"
                  className="mobile-profile-link-item mobile-sign-out" 
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                    navigate('/');
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => { navigate('/'); setMenuOpen(false); }}>Sign In</button>
          )}
        </div>
      </div>
    </nav>

    <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

    {toast && (
      <div className="lendogo-toast-container">
        <div className={`lendogo-toast ${toast.type}`}>
          <div className="lendogo-toast-content">{toast.message}</div>
          <button 
            type="button" 
            className="lendogo-toast-close" 
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
