import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SetPasswordForm.css';

/* ─── Password requirements ─────────────────────────────────── */
const requirements = [
  { label: 'atleast 8 characters',                        test: (p) => p.length >= 8 },
  { label: 'atleast 1 number (eg. 1,2,3 etc)',            test: (p) => /[0-9]/.test(p) },
  { label: 'atleast 1 alphabet (eg. a,b,c etc)',          test: (p) => /[a-zA-Z]/.test(p) },
  { label: 'atleast 1 special character (eg. @,#,% etc)', test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

/* ─── Strong password generator ─────────────────────────────── */
const generateStrongPassword = () => {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower   = 'abcdefghjkmnpqrstuvwxyz';
  const digits  = '23456789';
  const special = '@#$%&*!';
  const all     = upper + lower + digits + special;
  const pick    = (src) => src[Math.floor(Math.random() * src.length)];
  // guarantee at least one from each category
  const base = [pick(upper), pick(lower), pick(digits), pick(special)];
  for (let i = 0; i < 8; i++) base.push(pick(all));
  return base.sort(() => Math.random() - 0.5).join('');
};

/* ─── Eye icon ───────────────────────────────────────────────── */
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

/* ─── Refresh icon ───────────────────────────────────────────── */
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

/* ─── Shield icon ────────────────────────────────────────────── */
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

/* ─── Component ──────────────────────────────────────────────── */
const SetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName, email } = location.state || {};

  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw,          setShowPw]          = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);

  // suggestion state
  const [showSuggestion,   setShowSuggestion]   = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState('');
  const [suggestionShown,   setSuggestionShown]   = useState(false); // only once per session
  const [copied,            setCopied]            = useState(false);
  const suggestionRef = useRef(null);

  const allMet = requirements.every((r) => r.test(password));

  /* ── Generate a new suggestion ── */
  const refreshSuggestion = useCallback(() => {
    setSuggestedPassword(generateStrongPassword());
    setCopied(false);
  }, []);

  /* ── Show suggestion popup on first focus ── */
  const handlePasswordFocus = () => {
    if (!suggestionShown && password === '') {
      const pw = generateStrongPassword();
      setSuggestedPassword(pw);
      setShowSuggestion(true);
      setSuggestionShown(true);
    }
  };

  /* ── Apply suggested password to both fields ── */
  const handleApplySuggestion = () => {
    setPassword(suggestedPassword);
    setConfirmPassword(suggestedPassword);
    setShowPw(true);      // show so user can see what was applied
    setShowConfirm(true);
    setShowSuggestion(false);
  };

  /* ── Cancel — just dismiss ── */
  const handleCancelSuggestion = () => {
    setShowSuggestion(false);
  };

  /* ── Copy to clipboard ── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(suggestedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) { /* ignore */ }
  };

  /* ── Form submit ── */
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

        {/* ── New Password ── */}
        <div className="spf-group">
          <label className="spf-label" htmlFor="spfNewPw">new password</label>
          <div className="spf-input-wrap" style={{ position: 'relative' }}>
            <input
              id="spfNewPw"
              type={showPw ? 'text' : 'password'}
              className="spf-input"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
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

            {/* ── Suggestion Popup ── */}
            {showSuggestion && (
              <div className="spf-suggestion-popup" ref={suggestionRef}>
                <div className="spf-suggestion-header">
                  <span className="spf-suggestion-icon"><ShieldIcon /></span>
                  <div>
                    <p className="spf-suggestion-title">Use a strong password</p>
                    <p className="spf-suggestion-subtitle">We generated a secure password for you</p>
                  </div>
                </div>

                <div className="spf-suggestion-pw-row">
                  <span className="spf-suggestion-pw">{suggestedPassword}</span>
                  <div className="spf-suggestion-pw-actions">
                    <button
                      type="button"
                      className="spf-suggestion-copy"
                      onClick={handleCopy}
                      title="Copy to clipboard"
                    >
                      {copied ? '✓' : '⧉'}
                    </button>
                    <button
                      type="button"
                      className="spf-suggestion-refresh"
                      onClick={refreshSuggestion}
                      title="Generate another"
                    >
                      <RefreshIcon />
                    </button>
                  </div>
                </div>

                <p className="spf-suggestion-note">
                  ✓ 12+ chars &nbsp;·&nbsp; ✓ uppercase &nbsp;·&nbsp; ✓ number &nbsp;·&nbsp; ✓ symbol
                </p>

                <div className="spf-suggestion-btns">
                  <button
                    type="button"
                    className="spf-suggestion-btn-cancel"
                    onClick={handleCancelSuggestion}
                  >
                    No thanks
                  </button>
                  <button
                    type="button"
                    className="spf-suggestion-btn-apply"
                    onClick={handleApplySuggestion}
                  >
                    Use this password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Confirm Password ── */}
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

        {/* ── Requirements checklist ── */}
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
