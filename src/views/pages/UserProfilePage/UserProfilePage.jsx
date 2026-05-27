import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../components/ParallaxShapes/ParallaxShapes';
import { useAuthController } from '../../../controllers/auth/useAuthController';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { user } = useAuthController();
  const navigate = useNavigate();

  // Redirect to Sign-In page if not authenticated
  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate('/');
    }
  }, [user.isAuthenticated, navigate]);

  // Profile Details State
  const [fullName, setFullName] = useState(user.name || 'Prime User');
  const [email, setEmail] = useState(user.email || 'user@lendogo.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [dob, setDob] = useState('1995-08-15');
  const [address, setAddress] = useState('123 Financial District, Tech Park, Bangalore, KA');
  const [pincode, setPincode] = useState('560001');
  const [profilePhoto, setProfilePhoto] = useState(
    localStorage.getItem('user_dp') || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );

  // Fintech KYC State
  const [kycStatus, setKycStatus] = useState('VERIFIED'); // VERIFIED, PENDING
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [aadhaarNumber, setAadhaarNumber] = useState('•••• •••• 5678');
  const [fatherName, setFatherName] = useState('Srinivas Murthy');
  const [employmentType, setEmploymentType] = useState('Salaried'); // Salaried, Self-Employed
  const [monthlyIncome, setMonthlyIncome] = useState('75000');
  const [kycAddress, setKycAddress] = useState('123 Tech Park, Bangalore, KA - 560001');

  // Temp editing states for KYC
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [tempPan, setTempPan] = useState('ABCDE1234F');
  const [tempAadhaar, setTempAadhaar] = useState('1234 5678 9012');
  const [tempFather, setTempFather] = useState('Srinivas Murthy');
  const [tempEmpType, setTempEmpType] = useState('Salaried');
  const [tempIncome, setTempIncome] = useState('75000');
  const [tempKycAddress, setTempKycAddress] = useState('123 Tech Park, Bangalore, KA - 560001');

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

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        localStorage.setItem('user_dp', reader.result);
        window.dispatchEvent(new Event('user-dp-changed'));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Photo Delete
  const handleRemovePhoto = () => {
    const defaultNoDp = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    setProfilePhoto(defaultNoDp);
    localStorage.removeItem('user_dp');
    window.dispatchEvent(new Event('user-dp-changed'));
  };

  // Handle Linked Account addition
  const handleAddBankAccount = (e) => {
    e.preventDefault();
    if (!newBankName || !newAccNum || !newIfsc) {
      alert('Please fill out all bank credentials.');
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
    alert('Bank account successfully verified and linked to LendoGo Wallet!');
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
        alert('Please select another primary bank before unlinking this one.');
        return;
      }
      setBankAccounts(prev => prev.filter(b => b.id !== id));
    }
  };

  // Update KYC simulation
  const handleSaveKyc = (e) => {
    e.preventDefault();
    if (tempPan.length < 10 || tempAadhaar.replace(/\s/g, '').length < 12) {
      alert('Invalid PAN or Aadhaar format coordinates.');
      return;
    }
    setPanNumber(tempPan.toUpperCase());
    setAadhaarNumber('•••• •••• ' + tempAadhaar.slice(-4));
    setFatherName(tempFather);
    setEmploymentType(tempEmpType);
    setMonthlyIncome(tempIncome);
    setKycAddress(tempKycAddress);
    setKycStatus('VERIFIED');
    setIsEditingKyc(false);
    alert('KYC verification credentials updated and encrypted in database ledger!');
  };

  if (!user.isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Dynamic ambient moving shapes background */}
      <ParallaxShapes preset="side-decor" />

      <main className="profile-main-content animate-fade-in" style={{ position: 'relative', zIndex: 2 }}>
        {/* Profile Premium Header Hero */}
        <section className="profile-hero-section">
          <div className="profile-hero-left">
            <div className="profile-avatar-container">
              <img src={profilePhoto} alt="Profile" className="user-profile-img" />
              <label className="user-photo-upload-badge" title="Upload Custom Photo">
                📷
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="profile-file-input"
                />
              </label>
              {profilePhoto !== 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' && (
                <button 
                  type="button" 
                  className="user-photo-delete-badge" 
                  onClick={handleRemovePhoto} 
                  title="Remove Profile Photo"
                >
                  🗑️
                </button>
              )}
            </div>
            <div className="profile-name-details">
              <div className="profile-name-row">
                <h2>{fullName}</h2>
                <span className={`kyc-badge ${kycStatus.toLowerCase()}`}>
                  {kycStatus === 'VERIFIED' ? '✓ KYC Verified' : '⚠️ KYC Pending'}
                </span>
              </div>
              <p className="profile-email-sub">{email}</p>
              <p className="profile-since-sub">Member since: May 2026</p>
            </div>
          </div>
          <div className="profile-hero-right">
            <div className="fintech-score-card">
              <span className="fintech-score-label">LendoGo Trust Score</span>
              <h3>Excellent</h3>
              <div className="score-badge-circle">98%</div>
            </div>
          </div>
        </section>

        {/* 2-Column Responsive Congested Dashboard Body */}
        <div className="profile-grid-container animate-fade-in">
          {/* Left Column: Personal Details & Loan History */}
          <div className="profile-column-left">
            {/* Card 1: Account Settings */}
            <div className="profile-section-card">
              <div className="card-header-bar">
                <span className="card-icon-tag">👤</span>
                <h3>Personal Coordinates</h3>
              </div>
              <form className="profile-inner-form" onSubmit={(e) => { e.preventDefault(); alert('Personal coordinates saved successfully!'); }}>
                <div className="form-row-split">
                  <div className="profile-input-group">
                    <label>Full Legal Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      className="profile-input-field"
                      required
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Phone Coordinate</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="profile-input-field"
                      required
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="profile-input-group">
                    <label>Date of Birth (DOB)</label>
                    <input 
                      type="date" 
                      value={dob} 
                      onChange={(e) => setDob(e.target.value)} 
                      className="profile-input-field"
                      required
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Postal Pincode</label>
                    <input 
                      type="text" 
                      value={pincode} 
                      onChange={(e) => setPincode(e.target.value)} 
                      className="profile-input-field"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                <div className="profile-input-group">
                  <label>Residential Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="profile-input-field"
                    required
                  />
                </div>

                <button type="submit" className="btn-save-profile mt-2">
                  Update Account Coordinates
                </button>
              </form>
            </div>

            {/* Card 2: Applied Loan History */}
            <div className="profile-section-card">
              <div className="card-header-bar">
                <span className="card-icon-tag">🕒</span>
                <h3>Applied Loan History</h3>
              </div>
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
          </div>

          {/* Right Column: Linked Bank Accounts & KYC Validation */}
          <div className="profile-column-right">
            {/* Card 3: KYC Verification Credentials */}
            <div className="profile-section-card">
              <div className="card-header-bar flex-between">
                <div className="flex-align-center gap-2">
                  <span className="card-icon-tag">🛡️</span>
                  <h3>Fintech KYC Identity</h3>
                </div>
                <button 
                  type="button" 
                  className="btn-add-bank-trigger"
                  onClick={() => {
                    if (!isEditingKyc) {
                      setTempPan(panNumber);
                      setTempAadhaar(aadhaarNumber);
                      setTempFather(fatherName);
                      setTempEmpType(employmentType);
                      setTempIncome(monthlyIncome);
                      setTempKycAddress(kycAddress);
                    }
                    setIsEditingKyc(!isEditingKyc);
                  }}
                >
                  {isEditingKyc ? 'Cancel' : 'Edit KYC'}
                </button>
              </div>

              {isEditingKyc ? (
                <form className="kyc-edit-form mt-2" onSubmit={handleSaveKyc}>
                  <div className="form-row-split">
                    <div className="profile-input-group">
                      <label>PAN Card Number</label>
                      <input 
                        type="text" 
                        value={tempPan} 
                        onChange={(e) => setTempPan(e.target.value)} 
                        className="profile-input-field"
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="profile-input-group">
                      <label>Aadhaar Card Number</label>
                      <input 
                        type="text" 
                        value={tempAadhaar} 
                        onChange={(e) => setTempAadhaar(e.target.value)} 
                        className="profile-input-field"
                        maxLength={14}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-split">
                    <div className="profile-input-group">
                      <label>Father's Full Name</label>
                      <input 
                        type="text" 
                        value={tempFather} 
                        onChange={(e) => setTempFather(e.target.value)} 
                        className="profile-input-field"
                        required
                      />
                    </div>
                    <div className="profile-input-group">
                      <label>Employment Status</label>
                      <select 
                        value={tempEmpType} 
                        onChange={(e) => setTempEmpType(e.target.value)} 
                        className="profile-input-field"
                        style={{ height: '43px' }}
                        required
                      >
                        <option value="Salaried">Salaried</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Student">Student</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-split">
                    <div className="profile-input-group">
                      <label>Monthly Income (₹)</label>
                      <input 
                        type="number" 
                        value={tempIncome} 
                        onChange={(e) => setTempIncome(e.target.value)} 
                        className="profile-input-field"
                        required
                      />
                    </div>
                    <div className="profile-input-group">
                      <label>Permanent Verification Address</label>
                      <input 
                        type="text" 
                        value={tempKycAddress} 
                        onChange={(e) => setTempKycAddress(e.target.value)} 
                        className="profile-input-field"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-save-profile mt-2">
                    Submit KYC Identity Verification
                  </button>
                </form>
              ) : (
                <div className="kyc-verified-details mt-2">
                  <div className="kyc-success-row">
                    <span className="kyc-checked-icon">✓</span>
                    <div>
                      <h4>Aadhaar, PAN & Income Identity Linked</h4>
                      <p className="kyc-verified-subtext">Verified on LendoGo Platform via UIDAI Database</p>
                    </div>
                  </div>

                  <div className="kyc-details-box mt-3">
                    <div className="kyc-detail-row">
                      <span className="kyc-label">PAN Coordinate</span>
                      <span className="kyc-value">{panNumber}</span>
                    </div>
                    <div className="kyc-detail-row mt-2">
                      <span className="kyc-label">Aadhaar Coordinate</span>
                      <span className="kyc-value">{aadhaarNumber}</span>
                    </div>
                    <div className="kyc-detail-row mt-2">
                      <span className="kyc-label">Father's Name</span>
                      <span className="kyc-value">{fatherName}</span>
                    </div>
                    <div className="kyc-detail-row mt-2">
                      <span className="kyc-label">Employment Status</span>
                      <span className="kyc-value">{employmentType}</span>
                    </div>
                    <div className="kyc-detail-row mt-2">
                      <span className="kyc-label">Monthly Income</span>
                      <span className="kyc-value">₹{Number(monthlyIncome).toLocaleString('en-IN')} / month</span>
                    </div>
                    <div className="kyc-detail-row mt-2">
                      <span className="kyc-label">Permanent Address</span>
                      <span className="kyc-value">{kycAddress}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Card 4: Linked Bank Accounts Register */}
            <div className="profile-section-card">
              <div className="card-header-bar flex-between">
                <div className="flex-align-center gap-2">
                  <span className="card-icon-tag">💳</span>
                  <h3>Linked Bank Accounts</h3>
                </div>
                <button 
                  type="button" 
                  className="btn-add-bank-trigger"
                  onClick={() => setShowAddBank(!showAddBank)}
                >
                  {showAddBank ? 'Cancel' : '+ Add Bank'}
                </button>
              </div>

              {showAddBank && (
                <form className="add-bank-inner-form mt-2 mb-2 animate-fade-in" onSubmit={handleAddBankAccount}>
                  <h4>Link New Account Coordinates</h4>
                  <div className="profile-input-group">
                    <label>Bank Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ICICI Bank Ltd" 
                      value={newBankName} 
                      onChange={(e) => setNewBankName(e.target.value)} 
                      className="profile-input-field"
                      required
                    />
                  </div>
                  <div className="form-row-split">
                    <div className="profile-input-group">
                      <label>Account Number</label>
                      <input 
                        type="password" 
                        placeholder="12-16 digit Account Number" 
                        value={newAccNum} 
                        onChange={(e) => setNewAccNum(e.target.value)} 
                        className="profile-input-field"
                        required
                      />
                    </div>
                    <div className="profile-input-group">
                      <label>IFSC Code</label>
                      <input 
                        type="text" 
                        placeholder="e.g. ICIC0000124" 
                        value={newIfsc} 
                        onChange={(e) => setNewIfsc(e.target.value)} 
                        className="profile-input-field"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-save-profile mt-1">
                    Verify & Authenticate Bank Account
                  </button>
                </form>
              )}

              <div className="linked-banks-list mt-2">
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
                          Make Primary
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
