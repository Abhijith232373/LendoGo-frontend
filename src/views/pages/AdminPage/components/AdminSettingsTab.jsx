import React from 'react';

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
  );
};

export default AdminSettingsTab;
