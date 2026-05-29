import React from 'react';

const AdminTopbar = ({ 
  disbursedCapital, 
  searchQuery, 
  setSearchQuery, 
  activeBalance, 
  adminAvatar, 
  adminName, 
  adminEmail,
  handleRechargeWallet
}) => {
  
  const handleRechargeClick = (e) => {
    e.stopPropagation();
    const amtStr = prompt("Enter wallet recharge amount (₹):", "1000000");
    if (!amtStr) return;
    
    // Clean any user input formatting like commas
    const cleanedAmt = amtStr.replace(/,/g, '').trim();
    const amt = parseFloat(cleanedAmt);
    
    if (isNaN(amt) || amt <= 0) {
      alert("Invalid amount entered. Please enter a valid positive numeric value.");
      return;
    }
    
    handleRechargeWallet(amt);
    alert(`Wallet successfully recharged by ₹${amt.toLocaleString('en-IN')}.00!`);
  };

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
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Filter listings, PAN, emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topbar-search-input"
          />
        </div>

        <div className="topbar-actions-container">
          {/* Dynamic Wallet Capital Pill with SVG card icon & recharge button */}
          <div 
            className="topbar-action-btn wallet-action-pill" 
            title={`Available Capital Reserves: ₹${activeBalance.toLocaleString('en-IN')}.00`}
            style={{ display: 'flex', alignItems: 'center', cursor: 'default' }}
          >
            <span className="action-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </span>
            <span className="wallet-amount-text">₹{activeBalance.toLocaleString('en-IN')}</span>
            
            {/* Recharge Icon/Button */}
            <button 
              onClick={handleRechargeClick}
              title="Recharge Admin Wallet"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '4px',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                padding: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>

          {/* Notification Bell Toggle (Clean SVG) */}
          <button 
            className="topbar-action-btn notification-bell-btn" 
            title="Platform Operations Alert Log"
            onClick={() => alert('All lending operations systems are operating normally. No unread compliance flags.')}
          >
            <span className="action-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </span>
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
