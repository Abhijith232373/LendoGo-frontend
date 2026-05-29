import React from 'react';

const DashboardTab = ({ activeBalance, disbursedCapital, setActiveTab }) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="welcome-banner">
        <div className="banner-content">
          <h2>LendoGo Operational Control</h2>
          <p>Welcome back, Officer. Operational metrics, credit portfolio risk audits, and capital flows are updated.</p>
        </div>
      </div>

      <div className="admin-grid-layout">
        <div className="grid-card assets-card">
          <div className="card-header">
            <h4>Active Loan Portfolio</h4>
            <span className="info-icon" title="Aggregated sum of all active loans distributed.">ⓘ</span>
          </div>
          <div className="card-value-wrap">
            <h2>₹{activeBalance.toLocaleString('en-IN')}.00</h2>
            <span className="trend-badge positive">↑ 12% <span className="trend-sub">Operational Safe</span></span>
          </div>
          <div className="asset-dist-bar">
            <div className="dist-segment personal" style={{ width: '65%' }} />
            <div className="dist-segment business" style={{ width: '25%' }} />
            <div className="dist-segment home-auto" style={{ width: '10%' }} />
          </div>
          <ul className="asset-distribution-list">
            <li>
              <span className="legend-dot personal" />
              <span className="dist-label">Personal Loans (65%)</span>
            </li>
            <li>
              <span className="legend-dot business" />
              <span className="dist-label">Business Loans (25%)</span>
            </li>
            <li>
              <span className="legend-dot home-auto" />
              <span className="dist-label">Home & Auto Loans (10%)</span>
            </li>
          </ul>
        </div>

        <div className="grid-card chart-card">
          <div className="card-header">
            <h4>Capital Disbursements vs Repayments</h4>
          </div>
          <div className="card-value-wrap">
            <h2>₹{disbursedCapital.toLocaleString('en-IN')}.00</h2>
          </div>
          {/* SVG Line Chart */}
          <div className="svg-chart-container">
            <svg viewBox="0 0 500 140" className="svg-line-chart">
              <line x1="40" y1="20" x2="480" y2="20" className="chart-grid-line" />
              <line x1="40" y1="70" x2="480" y2="70" className="chart-grid-line" />
              <line x1="40" y1="120" x2="480" y2="120" className="chart-grid-line" />
              
              <defs>
                <linearGradient id="chart-disbursed-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M40,120 L150,90 L260,85 L370,55 L480,25 L480,140 L40,140 Z" fill="url(#chart-disbursed-grad)" />
              <path d="M40,120 L150,90 L260,85 L370,55 L480,25" fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="grid-card robo-advisor-card">
          <div className="advisor-content" style={{ textAlign: 'center' }}>
            <div className="advisor-logo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(0, 102, 255, 0.1)', color: '#0066ff', marginBottom: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>Audit & Verification Index</h3>
            <p>Run automated PAN checks and background system integrity reports directly in the requests tab.</p>
            <button className="btn-advisor-action" onClick={() => setActiveTab('Loan Requests')}>
              Go to Requests Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
