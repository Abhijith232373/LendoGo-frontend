import React from 'react';
import "./AdminSettingsTab.css";

const AdminSettingsTab = ({
  adminAvatar,
  adminName,
  setAdminName,
  adminEmail,
  handleSimulatePhotoUpload,
  handleUpdateAdminEmail,
  emailInput,
  setEmailInput,
  handleUpdateAdminPassword,
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleTransferOwnership,
  transferEmail,
  setTransferEmail,
  transferKey,
  setTransferKey,
  handleAdminLogout
}) => {
  return (
    <div className="tab-pane-container settings-dashboard-view animate-fade-in">
      <div className="section-header-row">
        <h2>Administrative Control Center</h2>
        <p>Configure officer profiles, system credentials, integrations, and platform ownership in a single unified cockpit.</p>
      </div>

      <div className="settings-unified-grid">
        
        {/* CARD 1: PROFILE & BRANDING */}
        <div className="settings-group-card profile-branding-card">
          <div className="settings-card-header">
            <span className="card-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </span>
            <h3>Profile & Branding</h3>
          </div>
          
          <div className="settings-account-hero-card dense-hero">
            <div className="hero-avatar-wrapper">
              {adminAvatar.startsWith('data:') || adminAvatar.startsWith('http') ? (
                <img src={adminAvatar} alt="Avatar" className="admin-custom-avatar-img-large" />
              ) : (
                <span className="default-avatar-initials">{adminName.charAt(0)}</span>
              )}
              <label className="avatar-edit-badge" title="Upload custom photo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
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
            <span className="card-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
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
            <span className="card-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
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
            <span className="card-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </span>
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
            <span className="card-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </span>
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
                <button type="submit" className="btn-transfer-ownership-submit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Transfer Master Clearances
                </button>
              </form>
            </div>

            <div className="danger-logout-column">
              <div className="logout-prompt-box">
                <h4>Administrative Session Control</h4>
                <p>Close operational session registers and secure audit ledgers locally.</p>
                <button type="button" className="btn-admin-logout-trigger mt-2" onClick={handleAdminLogout} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign Out of Admin Panel
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettingsTab;
