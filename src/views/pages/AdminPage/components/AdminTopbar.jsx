import React from 'react';

const AdminTopbar = ({ 
  disbursedCapital, 
  searchQuery, 
  setSearchQuery, 
  activeBalance, 
  adminAvatar, 
  adminName, 
  adminEmail 
}) => {
  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <div className="metric-box">
          <span className="metric-label">Total Capital Disbursed</span>
          <h3 className="metric-value">₹{disbursedCapital.toLocaleString('en-IN')}.00</h3>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Filter listings, PAN, emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topbar-search-input"
          />
        </div>

        <div className="topbar-actions-container">
          {/* Dynamic Wallet Capital Pill */}
          <button 
            className="topbar-action-btn wallet-action-pill" 
            title={`Available Capital Reserves: ₹${activeBalance.toLocaleString('en-IN')}`}
            onClick={() => alert(`Operational Vault Capital Reserves: ₹${activeBalance.toLocaleString('en-IN')}`)}
          >
            <span className="action-icon">💳</span>
            <span className="wallet-amount-text">₹{(activeBalance / 100000).toFixed(2)}L</span>
          </button>

          {/* Notification Bell Toggle */}
          <button 
            className="topbar-action-btn notification-bell-btn" 
            title="Platform Operations Alert Log"
            onClick={() => alert('All lending operations systems are operating normally. No unread compliance flags.')}
          >
            <span className="action-icon">🔔</span>
            <span className="bell-badge-pulse" />
          </button>
        </div>

        <div className="admin-profile-card">
          <div className="profile-avatar">
            {adminAvatar.startsWith('data:') || adminAvatar.startsWith('http') ? (
              <img src={adminAvatar} alt="Avatar" className="admin-custom-avatar-img" />
            ) : (
              <span className="default-avatar-initials">{adminName.charAt(0)}</span>
            )}
          </div>
          <div className="profile-details">
            <span className="profile-name">{adminName}</span>
            <span className="profile-role">{adminEmail}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
