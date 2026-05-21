import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SetPasswordForm.css';

const requirements = [
  { label: 'atleast 8 characters',                    test: (p) => p.length >= 8 },
  { label: 'atleast 1 number (eg. 1,2,3 etc)',        test: (p) => /[0-9]/.test(p) },
  { label: 'atleast 1 alphabet (eg. a,b,c etc)',      test: (p) => /[a-zA-Z]/.test(p) },
  { label: 'atleast 1 special character (eg. @,#,% etc)', test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const EyeIcon = ({ visible }) =>
  visible ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

const SetPasswordForm = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { fullName, email } = location.state || {};

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);

  const allMet = requirements.every((r) => r.test(password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allMet) {
      setError('Password does not meet all requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    // TODO: wire up to actual registration API
    console.log('Register:', { fullName, email, password });
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="spf-container">
      <h2 className="spf-title">Set New Password</h2>

      <form className="spf-form" onSubmit={handleSubmit} noValidate>
        {/* New Password */}
        <div className="spf-group">
          <label className="spf-label" htmlFor="spfNewPw">new password</label>
          <div className="spf-input-wrap">
            <input
              id="spfNewPw"
              type={showPw ? 'text' : 'password'}
              className="spf-input"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="spf-eye-btn"
              onClick={() => setShowPw(!showPw)}
              aria-label="Toggle password visibility"
            >
              <EyeIcon visible={showPw} />
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="spf-group">
          <label className="spf-label" htmlFor="spfConfirmPw">confirm password</label>
          <div className="spf-input-wrap">
            <input
              id="spfConfirmPw"
              type={showConfirm ? 'text' : 'password'}
              className="spf-input"
              placeholder="enter confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="spf-eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label="Toggle confirm password visibility"
            >
              <EyeIcon visible={showConfirm} />
            </button>
          </div>
        </div>

        {/* Requirements checklist */}
        <div className="spf-requirements">
          <p className="spf-req-title">your password must contain</p>
          <ul className="spf-req-list">
            {requirements.map((req) => {
              const met = req.test(password);
              return (
                <li key={req.label} className={`spf-req-item ${met ? 'met' : ''}`}>
                  <span className="spf-req-dot" />
                  {req.label}
                </li>
              );
            })}
          </ul>
        </div>

        {error && <div className="spf-error">{error}</div>}

        <button
          type="submit"
          id="setPasswordProceedBtn"
          className="spf-btn-proceed"
          disabled={loading}
        >
          {loading ? <><span className="spf-spinner" /> processing…</> : 'proceed'}
        </button>
      </form>
    </div>
  );
};

export default SetPasswordForm;
