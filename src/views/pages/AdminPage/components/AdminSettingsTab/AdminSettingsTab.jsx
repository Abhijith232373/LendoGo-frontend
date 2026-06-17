import React from 'react';
import "./AdminSettingsTab.css";

const AdminSettingsTab = ({
  adminAvatar,
  adminName,
  setAdminName,
  adminEmail,
  handlePhotoUpload,
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
  darkMode,
  setDarkMode,
  handleAdminLogout
}) => {
  return (
    <div className="tab-pane-container settings-dashboard-view animate-fade-in">
      <div className="section-header-row">
        <h2>Administrative Control Center</h2>
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
                  onChange={handlePhotoUpload}
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
          <form onSubmit={handleUpdateAdminEmail} className="settings-inner-form mt-1" style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
              <div className="form-input-group">
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
            </div>
            <button type="submit" className="btn-save-web-config" style={{ width: 'fit-content' }}>
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
          <form className="settings-inner-form mt-1" onSubmit={handleUpdateAdminPassword} style={{ maxWidth: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
              <div className="form-input-group">
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
              <div className="form-input-group">
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
            </div>
            <button type="submit" className="btn-save-web-config" style={{ width: 'fit-content' }}>
              Save Operations Key
            </button>
          </form>
        </div>


        {/* CARD 4: SESSION & PREFERENCES */}
        <div className="settings-group-card danger-zone-group">
          <div className="settings-card-header">
            <span className="card-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </span>
            <h3>Session & Preferences</h3>
          </div>
          
          <div className="danger-dashboard-row">
            <div className="danger-form-column">
              <div className="logout-prompt-box" style={{ borderColor: 'var(--admin-border)', background: 'transparent' }}>
                <h4>Interface Appearance</h4>
                <p>Toggle between light and dark visualization modes.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--admin-text)' }}>Dark Mode</span>
                  <label className="toggle-switch" style={{ margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={darkMode} 
                      onChange={() => setDarkMode(!darkMode)} 
                    />
                    <span className="slider-round" />
                  </label>
                </div>
              </div>
            </div>

            <div className="danger-logout-column">
              <div className="logout-prompt-box" style={{ borderColor: 'var(--admin-border)' }}>
                <h4 className="text-red">Administrative Session Control</h4>
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
