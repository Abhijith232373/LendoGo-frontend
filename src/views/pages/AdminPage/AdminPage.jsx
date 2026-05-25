import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // SVG Chart states
  const [hoveredYear, setHoveredYear] = useState('2024');
  const [auditState, setAuditState] = useState('idle'); // idle | scanning | completed
  const [auditScore, setAuditScore] = useState(null);

  // Trigger scanning audit effect
  const runCreditAudit = () => {
    setAuditState('scanning');
    setTimeout(() => {
      setAuditState('completed');
      setAuditScore(Math.floor(Math.random() * (850 - 680 + 1)) + 680); // random score between 680 and 850
    }, 2500);
  };

  const navItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Loan Requests', icon: '📋' },
    { name: 'Approved Loans', icon: '✅' },
    { name: 'Disbursed Capital', icon: '💰' },
    { name: 'Borrowers Directory', icon: '👥' },
    { name: 'Analytics', icon: '📈' },
  ];

  const recentApprovals = [
    { name: 'Rahul S. (PAN: A****32P)', type: 'Personal Loan', amount: '₹1,50,000', status: '⚡' },
    { name: 'Aarav M. (PAN: B****91K)', type: 'Business Loan', amount: '₹5,00,000', status: '💼' },
    { name: 'Priya K. (PAN: D****84D)', type: 'Auto Loan', amount: '₹3,50,000', status: '🚗' },
    { name: 'Sneha R. (PAN: C****74S)', type: 'Home Loan', amount: '₹12,00,000', status: '🏠' },
    { name: 'Kabir D. (PAN: G****15M)', type: 'Student Loan', amount: '₹2,50,000', status: '🎓' },
  ];

  const yearStats = {
    '2018': { disbursed: '₹1,20,000', collected: '₹40,000' },
    '2019': { disbursed: '₹1,80,000', collected: '₹75,000' },
    '2020': { disbursed: '₹2,10,000', collected: '₹95,000' },
    '2021': { disbursed: '₹2,90,000', collected: '₹1,10,000' },
    '2022': { disbursed: '₹3,40,000', collected: '₹1,30,000' },
    '2023': { disbursed: '₹4,10,000', collected: '₹1,75,000' },
    '2024': { disbursed: '₹4,50,000', collected: '₹2,10,000' },
    '2025': { disbursed: '₹5,20,000', collected: '₹2,80,000' },
    '2026': { disbursed: '₹5,80,000', collected: '₹3,40,000' },
  };

  return (
    <div className={`admin-dashboard-wrapper ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      
      {/* ── TOP MARQUEE (LIVE APPROVAL TICKERS) ── */}
      <div className="admin-marquee-bar">
        <div className="marquee-label">
          <span className="live-pulse" />
          LIVE DISBURSEMENTS
        </div>
        <div className="marquee-content">
          <div className="marquee-slider">
            {recentApprovals.map((item, idx) => (
              <span key={idx} className="marquee-item">
                <span className="badge-bullet">{item.status}</span>
                <strong>{item.name}</strong> approved for {item.type}: <span className="highlight-text">{item.amount}</span>
              </span>
            ))}
            {/* Duplicate for infinite loop */}
            {recentApprovals.map((item, idx) => (
              <span key={`dup-${idx}`} className="marquee-item">
                <span className="badge-bullet">{item.status}</span>
                <strong>{item.name}</strong> approved for {item.type}: <span className="highlight-text">{item.amount}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-main-container">
        
        {/* ── LEFT SIDEBAR ── */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <div className="admin-logo-icon">L</div>
            <span className="admin-logo-text">LendoGO <span className="admin-badge-pill">Admin</span></span>
          </div>

          <nav className="sidebar-nav">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    className={`nav-btn ${activeTab === item.name ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.name)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="sidebar-divider" />

            <ul className="nav-list secondary-list">
              <li>
                <button className="nav-btn">
                  <span className="nav-icon">⚙️</span>
                  <span className="nav-text">Settings</span>
                </button>
              </li>
              <li>
                <button className="nav-btn">
                  <span className="nav-icon">📞</span>
                  <span className="nav-text">Help & Support</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Upgrade Audit Widget */}
          <div className="sidebar-widget">
            <div className="widget-glow" />
            <div className="widget-content">
              <span className="widget-icon">⚡</span>
              <h4>Automate Risk Audits</h4>
              <p>Scan PAN history and credit registry checks instantly with our automated API scoring model.</p>
              <button className="widget-btn" onClick={runCreditAudit}>Run System Audit</button>
            </div>
          </div>

          {/* Theme Switcher Toggle */}
          <div className="sidebar-theme-toggle">
            <span className="toggle-label">🌙 Dark Mode</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider-round" />
            </label>
          </div>
        </aside>

        {/* ── MAIN DASHBOARD CONTENT AREA ── */}
        <main className="admin-content-area">
          
          {/* Top Navbar */}
          <header className="admin-topbar">
            <div className="topbar-left">
              <div className="metric-box">
                <span className="metric-label">Total Capital Disbursed</span>
                <h3 className="metric-value">₹45,28,450.00</h3>
              </div>
              <div className="topbar-actions">
                <button className="btn-add-loan" onClick={() => alert('New borrower application wizard coming soon!')}>
                  <span>＋</span> New Request
                </button>
                <button className="btn-action-outline">Sanction Capital</button>
                <button className="btn-action-outline">Sync Records</button>
              </div>
            </div>

            <div className="topbar-right">
              <div className="topbar-search-wrap">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search borrowers, PAN, loan IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="topbar-search-input"
                />
              </div>

              <button className="topbar-notif-btn" aria-label="Notifications" onClick={() => alert('KYC Audit Register: 3 pending profiles to review.')}>
                <span className="notif-bell">🔔</span>
                <span className="notif-badge" />
              </button>

              <div className="admin-profile-card">
                <div className="profile-avatar">👨‍💻</div>
                <div className="profile-details">
                  <span className="profile-name">Admin Flow</span>
                  <span className="profile-role">Lending Officer</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Dashboard tab */}
          <div className="dashboard-scroll-container">
            
            {/* Banner */}
            <div className="welcome-banner">
              <div className="banner-content">
                <h2>LendoGo Operational Control</h2>
                <p>Welcome back, Officer. Operational metrics, credit portfolio risk audits, and capital flows are updated.</p>
              </div>
              <div className="banner-actions">
                <button className="btn-banner-action">+ Create Request</button>
                <select className="banner-select">
                  <option>This Month</option>
                  <option>Last Quarter</option>
                  <option>All Time</option>
                </select>
                <button className="btn-banner-export">Export Report</button>
              </div>
            </div>

            {/* Grid Layout Cards */}
            <div className="admin-grid-layout">
              
              {/* Card 1: Total Assets Distribution */}
              <div className="grid-card assets-card">
                <div className="card-header">
                  <h4>Active Loan Portfolio</h4>
                  <span className="info-icon" title="Aggregated sum of all active loans distributed.">ⓘ</span>
                </div>
                <div className="card-value-wrap">
                  <h2>₹32,59,800.65</h2>
                  <span className="trend-badge positive">↑ 12% <span className="trend-sub">₹3,91,170.67 this year</span></span>
                </div>

                <div className="asset-dist-bar">
                  <div className="dist-segment personal" style={{ width: '65%' }} />
                  <div className="dist-segment business" style={{ width: '25%' }} />
                  <div className="dist-segment home-auto" style={{ width: '10%' }} />
                </div>

                <ul className="asset-distribution-list">
                  <li>
                    <span className="legend-dot personal" />
                    <span className="dist-label">Personal Loans</span>
                    <span className="dist-val">₹21,18,870.42 (65%)</span>
                  </li>
                  <li>
                    <span className="legend-dot business" />
                    <span className="dist-label">Business Loans</span>
                    <span className="dist-val">₹8,14,950.16 (25%)</span>
                  </li>
                  <li>
                    <span className="legend-dot home-auto" />
                    <span className="dist-label">Home & Auto Loans</span>
                    <span className="dist-val">₹3,25,980.06 (10%)</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Total Investments (Dynamic SVG Line Chart) */}
              <div className="grid-card chart-card">
                <div className="card-header">
                  <div className="header-titles">
                    <h4>Capital Disbursements vs Repayments</h4>
                    <span className="info-icon">ⓘ</span>
                  </div>
                  <div className="chart-actions">
                    <button className="chart-btn active">📈 Line</button>
                    <button className="chart-btn">📊 Bar</button>
                    <button className="chart-btn">📷 Capture</button>
                  </div>
                </div>

                <div className="card-value-wrap">
                  <h2>₹27,05,600.20</h2>
                  <span className="trend-badge positive">↑ 20% <span className="trend-sub">₹5,41,120.04 in this year</span></span>
                </div>

                {/* High Fidelity SVG Line Chart */}
                <div className="svg-chart-container">
                  <svg viewBox="0 0 500 200" className="svg-line-chart">
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="480" y2="20" className="chart-grid-line" />
                    <line x1="40" y1="70" x2="480" y2="70" className="chart-grid-line" />
                    <line x1="40" y1="120" x2="480" y2="120" className="chart-grid-line" />
                    <line x1="40" y1="170" x2="480" y2="170" className="chart-grid-line" />

                    {/* Chart Gradient Shading Area */}
                    <defs>
                      <linearGradient id="chart-disbursed-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="chart-collected-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Shaded Areas */}
                    <path d="M40,150 L95,140 L150,110 L205,90 L260,85 L315,65 L370,55 L425,35 L480,25 L480,170 L40,170 Z" fill="url(#chart-disbursed-grad)" />
                    <path d="M40,165 L95,160 L150,145 L205,130 L260,125 L315,115 L370,95 L425,75 L480,65 L480,170 L40,170 Z" fill="url(#chart-collected-grad)" />

                    {/* Disbursement trend path */}
                    <path
                      d="M40,150 L95,140 L150,110 L205,90 L260,85 L315,65 L370,55 L425,35 L480,25"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Repayments collected trend path */}
                    <path
                      d="M40,165 L95,160 L150,145 L205,130 L260,125 L315,115 L370,95 L425,75 L480,65"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      strokeLinecap="round"
                    />

                    {/* Interactive points */}
                    <circle cx="370" cy="55" r="5" className="chart-dot primary" onClick={() => setHoveredYear('2024')} />
                    <circle cx="370" cy="95" r="4" className="chart-dot secondary" onClick={() => setHoveredYear('2024')} />
                    
                    <circle cx="425" cy="35" r="5" className="chart-dot primary" onClick={() => setHoveredYear('2025')} />
                    <circle cx="425" cy="75" r="4" className="chart-dot secondary" onClick={() => setHoveredYear('2025')} />

                    {/* Hover detail guidelines vertical line */}
                    {hoveredYear === '2024' && <line x1="370" y1="20" x2="370" y2="170" className="chart-hover-line" />}
                    {hoveredYear === '2025' && <line x1="425" y1="20" x2="425" y2="170" className="chart-hover-line" />}
                  </svg>
                  
                  {/* Custom HTML tooltip embedded inside chart container */}
                  <div className={`chart-tooltip ${hoveredYear === '2025' ? 'pos-2025' : 'pos-2024'}`}>
                    <span className="tooltip-year">{hoveredYear} Operational Audit</span>
                    <div className="tooltip-row">
                      <span className="dot disb" /> Disbursed: <strong>{yearStats[hoveredYear].disbursed}</strong>
                    </div>
                    <div className="tooltip-row">
                      <span className="dot coll" /> Collected: <strong>{yearStats[hoveredYear].collected}</strong>
                    </div>
                  </div>
                </div>

                <div className="chart-x-axis">
                  <span onClick={() => setHoveredYear('2018')}>2018</span>
                  <span onClick={() => setHoveredYear('2019')}>2019</span>
                  <span onClick={() => setHoveredYear('2020')}>2020</span>
                  <span onClick={() => setHoveredYear('2021')}>2021</span>
                  <span onClick={() => setHoveredYear('2022')}>2022</span>
                  <span onClick={() => setHoveredYear('2023')}>2023</span>
                  <span className={hoveredYear === '2024' ? 'highlight' : ''} onClick={() => setHoveredYear('2024')}>2024</span>
                  <span className={hoveredYear === '2025' ? 'highlight' : ''} onClick={() => setHoveredYear('2025')}>2025</span>
                  <span onClick={() => setHoveredYear('2026')}>2026</span>
                </div>
              </div>

              {/* Card 3: Total Profits Multi-series Bar Chart */}
              <div className="grid-card profits-card">
                <div className="card-header">
                  <h4>Operational Profits</h4>
                  <span className="info-icon">ⓘ</span>
                </div>
                <div className="card-value-wrap">
                  <h2>₹5,54,200.45</h2>
                  <span className="trend-badge positive">↑ 7% <span className="trend-sub">₹96,790.43 in this year</span></span>
                </div>

                {/* SVG Multiple Bars Profit Chart */}
                <div className="svg-chart-container">
                  <svg viewBox="0 0 500 160" className="svg-bar-chart">
                    {/* Grid lines */}
                    <line x1="30" y1="20" x2="480" y2="20" className="chart-grid-line" />
                    <line x1="30" y1="80" x2="480" y2="80" className="chart-grid-line" />
                    <line x1="30" y1="140" x2="480" y2="140" className="chart-grid-line" />

                    {/* Columns representing years (2018-2024) */}
                    {/* 2018 */}
                    <rect x="50" y="100" width="16" height="40" rx="3" fill="var(--primary)" />
                    <rect x="70" y="115" width="16" height="25" rx="3" fill="#a855f7" />
                    
                    {/* 2019 */}
                    <rect x="110" y="85" width="16" height="55" rx="3" fill="var(--primary)" />
                    <rect x="130" y="100" width="16" height="40" rx="3" fill="#a855f7" />

                    {/* 2020 */}
                    <rect x="170" y="90" width="16" height="50" rx="3" fill="var(--primary)" />
                    <rect x="190" y="110" width="16" height="30" rx="3" fill="#a855f7" />

                    {/* 2021 */}
                    <rect x="230" y="70" width="16" height="70" rx="3" fill="var(--primary)" />
                    <rect x="250" y="95" width="16" height="45" rx="3" fill="#a855f7" />

                    {/* 2022 */}
                    <rect x="290" y="60" width="16" height="80" rx="3" fill="var(--primary)" />
                    <rect x="310" y="80" width="16" height="60" rx="3" fill="#a855f7" />

                    {/* 2023 */}
                    <rect x="350" y="45" width="16" height="95" rx="3" fill="var(--primary)" />
                    <rect x="370" y="75" width="16" height="65" rx="3" fill="#a855f7" />

                    {/* 2024 */}
                    <rect x="410" y="30" width="16" height="110" rx="3" fill="var(--primary)" />
                    <rect x="430" y="60" width="16" height="80" rx="3" fill="#a855f7" />
                  </svg>
                </div>

                <div className="chart-legend-bottom">
                  <div className="legend-item">
                    <span className="leg-square" style={{ backgroundColor: 'var(--primary)' }} />
                    Disbursed Capital
                  </div>
                  <div className="legend-item">
                    <span className="leg-square" style={{ backgroundColor: '#a855f7' }} />
                    Interest Profits
                  </div>
                </div>

                <div className="chart-x-axis-bars">
                  <span>2018</span>
                  <span>2019</span>
                  <span>2020</span>
                  <span>2021</span>
                  <span>2022</span>
                  <span>2023</span>
                  <span className="highlight">2024</span>
                </div>
              </div>

              {/* Card 4: AI Audit Widget */}
              <div className="grid-card robo-advisor-card">
                <div className="advisor-glow" />
                <div className="advisor-content">
                  <div className="advisor-logo">🤖</div>
                  <h3>Invest Smarter with Our AI-Robo Advisor!</h3>
                  <p>Get automated borrower scans, real-time credit metrics scoring, and personalized compliance advice.</p>
                  
                  {auditState === 'scanning' && (
                    <div className="audit-scanner-box">
                      <div className="spinner" />
                      <span>Scanning KYC databases & credit scores...</span>
                    </div>
                  )}

                  {auditState === 'completed' && (
                    <div className="audit-result-box">
                      <span className="result-score">Risk Index: <strong>Low</strong> ({auditScore}/850)</span>
                      <p>✓ All sanction criteria met. Automated approval is recommended.</p>
                    </div>
                  )}

                  <button className="btn-advisor-action" onClick={runCreditAudit}>
                    {auditState === 'scanning' ? 'Scanning...' : 'Try Now'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminPage;
