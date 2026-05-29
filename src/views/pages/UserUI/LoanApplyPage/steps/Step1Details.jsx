import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoanApplyLayout from '../LoanApplyLayout';
import { useLoanApplication } from '../LoanApplicationContext';

const LOAN_TYPE_MAP = {
  personal:        'Personal Loan',
  business:        'Business Loan',
  home:            'Home Loan',
  property:        'Loan Against Property',
  instant:         'Instant Personal Loan',
  'credit-builder': 'Credit Builder Loan',
};

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli','Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

const Step1Details = () => {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    loanType, setLoanType, setLoanTypeLabel,
    fullName, setFullName,
    dob, setDob,
    email, setEmail,
    phone, setPhone,
    address, setAddress,
    city, setCity,
    stateName, setStateName,
    pincode, setPincode,
    markStepComplete,
  } = useLoanApplication();

  useEffect(() => {
    const type = searchParams.get('type') || 'personal';
    setLoanType(type);
    setLoanTypeLabel(LOAN_TYPE_MAP[type] || 'Personal Loan');
  }, []);

  const loanLabel = LOAN_TYPE_MAP[loanType] || LOAN_TYPE_MAP[searchParams.get('type')] || 'Personal Loan';

  const isValid =
    fullName.trim().length > 2 &&
    dob &&
    email.includes('@') &&
    phone.replace(/\D/g, '').length === 10 &&
    address.trim().length > 5 &&
    city.trim().length > 1 &&
    stateName &&
    pincode.replace(/\D/g, '').length === 6;

  const handleContinue = () => {
    markStepComplete('step1');
    navigate('/loan/apply/offer');
  };

  const UserOutlineIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d97706' }}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  return (
    <LoanApplyLayout>
      <div className="loan-step-card compact-card shadow-sm">
        {/* Roadoz Style Header Row */}
        <div className="step-card-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
          <UserOutlineIcon />
          <h2 className="step-card-title-flat" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            1. Personal Setup
          </h2>
        </div>

        <div className="form-compact-grid">
          {/* Row 1: Full Name and DOB */}
          <div className="form-row-multi">
            <div className="form-group flex-2">
              <label className="form-label-flat">FULL LEGAL NAME*</label>
              <input
                type="text"
                className="form-input-flat"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label-flat">DATE OF BIRTH*</label>
              <input
                type="date"
                className="form-input-flat"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Row 2: Email and Mobile */}
          <div className="form-row-multi">
            <div className="form-group flex-1">
              <label className="form-label-flat">EMAIL ADDRESS*</label>
              <input
                type="email"
                className="form-input-flat"
                placeholder="e.g. rahul@lendogo.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label-flat">MOBILE NUMBER*</label>
              <input
                type="tel"
                className="form-input-flat"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div className="form-group full-width">
            <label className="form-label-flat">CURRENT RESIDENTIAL ADDRESS*</label>
            <input
              type="text"
              className="form-input-flat"
              placeholder="e.g. Apartment / Street Name, Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Row 4: City, State, PIN */}
          <div className="form-row-multi">
            <div className="form-group flex-1">
              <label className="form-label-flat">CITY*</label>
              <input
                type="text"
                className="form-input-flat"
                placeholder="e.g. Kochi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label-flat">STATE*</label>
              <select
                className="form-select-flat"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label className="form-label-flat">PINCODE*</label>
              <input
                type="text"
                className="form-input-flat"
                placeholder="e.g. 682021"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>
          </div>
        </div>

        {/* Roadoz Style Navigation Action Bar */}
        <div className="step-navigation-bar" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
          <button
            type="button"
            className="btn-step-prev"
            onClick={() => navigate('/home')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 28px', fontSize: '0.86rem', fontWeight: 700, color: '#64748b', cursor: 'pointer' }}
          >
            &lt; CANCEL
          </button>

          <button
            type="button"
            className="btn-step-next"
            disabled={!isValid}
            onClick={handleContinue}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isValid ? '#0f172a' : '#e2e8f0', border: 'none', borderRadius: '8px', padding: '14px 32px', fontSize: '0.86rem', fontWeight: 700, color: isValid ? '#ffffff' : '#94a3b8', cursor: isValid ? 'pointer' : 'not-allowed', boxShadow: isValid ? '0 4px 12px rgba(15,23,42,0.15)' : 'none', transition: 'all 0.2s' }}
          >
            NEXT STEP &gt;
          </button>
        </div>
      </div>
    </LoanApplyLayout>
  );
};

export default Step1Details;
