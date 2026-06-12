import React, { useState, useEffect } from 'react';
import './TrustScoreView.css';

const TrustScoreView = ({ user, showToast }) => {
  // Retrieve score from localStorage, or generate a deterministic one for the user
  const getStoredScore = () => {
    if (!user || !user.email) return 763; // Default fallback
    const cached = localStorage.getItem(`trust_score_${user.email}`);
    if (cached) return parseInt(cached);
    
    // Hash email to get a deterministic score
    let hash = 0;
    const email = user.email;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const generated = 650 + Math.abs(hash % 200); // Range: 650 to 850
    localStorage.setItem(`trust_score_${user.email}`, generated.toString());
    return generated;
  };

  const [targetScore, setTargetScore] = useState(() => getStoredScore());

  useEffect(() => {
    const handleUpdate = () => {
      setTargetScore(getStoredScore());
    };
    window.addEventListener('user-details-changed', handleUpdate);
    window.addEventListener('loan-state-changed', handleUpdate);
    return () => {
      window.removeEventListener('user-details-changed', handleUpdate);
      window.removeEventListener('loan-state-changed', handleUpdate);
    };
  }, [user]);

  const [score, setScore] = useState(600); // Start animation from 600
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [activePage, setActivePage] = useState(0); // 0: Gauge scoreboard, 1: GPay Line graph
  const [graphKey, setGraphKey] = useState(0); // Trigger graph re-draw animation on refresh/page load

  // Smooth Count-Up Animation
  const animateScore = (targetVal) => {
    const startVal = 600;
    const duration = 1500; // Calmer 1.5 seconds animation
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const current = Math.floor(startVal + (targetVal - startVal) * easeOut);
      setScore(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    animateScore(targetScore);
    setGraphKey(prev => prev + 1); // Trigger line chart redraw
  }, [targetScore]);

  useEffect(() => {
    // Reset graph animation when switching to Page 1
    if (activePage === 1) {
      setGraphKey(prev => prev + 1);
    }
  }, [activePage]);

  // Generate dynamic months list (past 5 months)
  const getPastMonths = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const d = new Date();
    for (let i = 4; i >= 0; i--) {
      const tempDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      result.push(months[tempDate.getMonth()]);
    }
    return result;
  };

  const pastMonths = getPastMonths();

  // Dynamic history scores relative to the animated current score
  const historyScores = [
    Math.round(score * 1.015), // 4 months ago
    Math.round(score * 0.98),  // 3 months ago
    Math.round(score * 0.982), // 2 months ago
    Math.round(score * 0.99),  // 1 month ago
    score                      // Current month
  ];

  // Dynamically calculate graph min & max to auto-scale SVG lines
  const minVal = Math.min(...historyScores) - 15;
  const maxVal = Math.max(...historyScores) + 15;
  const getYForScore = (s) => {
    const minY = 110;
    const maxY = 35;
    return minY - ((s - minVal) / (maxVal - minVal)) * (minY - maxY);
  };

  // Coordinates for X axis points in SVG
  const xCoords = [60, 110, 160, 210, 260];

  // Create SVG path string from points
  const points = xCoords.map((x, i) => `${x},${getYForScore(historyScores[i])}`);
  const pathD = `M ${points.join(' L ')}`;

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setScore(600); // Reset for animating again
    
    setTimeout(() => {
      const currentVal = getStoredScore();
      const drift = Math.floor(Math.random() * 21) - 10; // +/- 10 drift
      const newScore = Math.max(300, Math.min(900, currentVal + drift));
      localStorage.setItem(`trust_score_${user.email}`, newScore.toString());
      
      setIsRefreshing(false);
      animateScore(newScore);
      setGraphKey(prev => prev + 1);
      showToast('Credit history and trust score refreshed.', 'success');
    }, 1000);
  };

  // Determine dynamic ratings based on score
  const getRatingStatus = (val) => {
    if (val >= 750) return { history: 'Excellent', mix: 'Good', label: 'Excellent', color: '#1e7e34', class: 'score-excellent' };
    if (val >= 680) return { history: 'Good', mix: 'Good', label: 'Good', color: '#b06000', class: 'score-good' };
    return { history: 'Fair', mix: 'Fair', label: 'Fair', color: '#c5221f', class: 'score-fair' };
  };

  const ratings = getRatingStatus(score);

  // Dynamic payment history breakdown values based on score
  const getPaymentHistoryPercentage = () => {
    if (score >= 750) return { percent: '100%', delayCount: 0 };
    if (score >= 680) return { percent: '98%', delayCount: 1 };
    return { percent: '92%', delayCount: 3 };
  };

  const payHistory = getPaymentHistoryPercentage();

  // Dynamic loan counts
  const getLoanCounts = () => {
    if (score >= 750) return { loans: 3, cards: 2 };
    if (score >= 680) return { loans: 2, cards: 1 };
    return { loans: 1, cards: 0 };
  };

  const loanMix = getLoanCounts();

  // Polar coordinates conversion helper for SVG arcs (Gauge)
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  // 5 distinct segment arcs for the gauge
  const segments = [
    { start: 4, end: 36, color: '#e15241', label: 'Poor' },
    { start: 40, end: 72, color: '#f28c28', label: 'Fair' },
    { start: 76, end: 108, color: '#ffd700', label: 'Good' },
    { start: 112, end: 144, color: '#a3e635', label: 'Very Good' },
    { start: 148, end: 176, color: '#22c55e', label: 'Excellent' }
  ];

  // needle rotation for Gauge: 300 score is -90deg, 900 score is 90deg
  // Uses a calmer 1.2s smooth glide animation
  const rotation = ((score - 300) / 600) * 180 - 90;

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="trust-score-container">
      {/* Credit Card Container with Carousel Paging */}
      <div className="credit-report-card">
        
        {/* Navigation Arrow Left */}
        <button 
          type="button" 
          className="carousel-nav-btn left" 
          onClick={() => setActivePage(0)}
          disabled={activePage === 0}
          aria-label="Previous Page"
        >
          <svg viewBox="0 0 24 24" className="nav-arrow-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Navigation Arrow Right */}
        <button 
          type="button" 
          className="carousel-nav-btn right" 
          onClick={() => setActivePage(1)}
          disabled={activePage === 1}
          aria-label="Next Page"
        >
          <svg viewBox="0 0 24 24" className="nav-arrow-svg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* PAGE 0: SCORE BOARD GAUGE */}
        {activePage === 0 && (
          <div className="carousel-page-content animate-fade">
            <span className="report-title-label">Your Trust Score</span>
            
            {/* SVG Gauge */}
            <div className="gauge-wrapper">
              <svg className="gauge-svg" viewBox="0 0 200 120" width="100%">
                {/* Background Track */}
                <path 
                  d={describeArc(100, 100, 80, 0, 180)} 
                  fill="none" 
                  stroke="#f1f5f9" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                />

                {/* Colored Segments */}
                {segments.map((seg, idx) => (
                  <path
                    key={idx}
                    d={describeArc(100, 100, 80, seg.start, seg.end)}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                ))}

                {/* Scale End Labels */}
                <text x="20" y="115" className="gauge-label-text" textAnchor="middle">300</text>
                <text x="180" y="115" className="gauge-label-text" textAnchor="middle">900</text>

                {/* Needle Pivot Base */}
                <circle cx="100" cy="100" r="14" fill="#e2e8f0" />
                <circle cx="100" cy="100" r="9" fill="#ffffff" />
                
                {/* Rotating Needle - Calm Glide Easing */}
                <g style={{ 
                  transform: `rotate(${rotation}deg)`, 
                  transformOrigin: '100px 100px',
                  transition: 'transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)' 
                }}>
                  <line 
                    x1="100" 
                    y1="100" 
                    x2="100" 
                    y2="25" 
                    stroke="#1e293b" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />
                  <polygon points="97,30 100,20 103,30" fill="#1e293b" />
                </g>
                <circle cx="100" cy="100" r="3.5" fill="#1e293b" />
              </svg>
            </div>

            {/* Score Numbers Display */}
            <div className="gauge-score-value-box">
              <h2 className="gauge-big-number">{score}</h2>
              <span className={`gauge-status-badge ${ratings.class}`}>
                {ratings.label}
              </span>
            </div>

            {/* Disclaimer under the score */}
            <p className="gauge-banks-disclaimer">
              7000+ banks & financial institutions rely on LendoGo Score to approve loans & credit cards
            </p>
          </div>
        )}

        {/* PAGE 1: DUAL CHARTS DASHBOARD (LINE GRAPH ONLY) */}
        {activePage === 1 && (
          <div className="carousel-page-content animate-fade">
            <span className="report-title-label">Your credit report dashboard</span>
            
            <div className="report-dashboard-grid" key={graphKey}>
              {/* Line Graph */}
              <div className="report-dashboard-col line-graph-col">
                <span className="col-chart-title">Score Trend</span>
                <svg className="credit-chart-svg" viewBox="0 0 320 140" width="100%">
                  {/* Grid horizontal lines */}
                  <line x1="30" y1="35" x2="290" y2="35" stroke="#f1f3f4" strokeWidth="1" />
                  <line x1="30" y1="72" x2="290" y2="72" stroke="#f1f3f4" strokeWidth="1" />
                  <line x1="30" y1="110" x2="290" y2="110" stroke="#f1f3f4" strokeWidth="1" />

                  {/* Y Axis Grid values */}
                  <text x="22" y="39" className="y-axis-label">{maxVal - 5}</text>
                  <text x="22" y="76" className="y-axis-label">{Math.round((minVal + maxVal) / 2)}</text>
                  <text x="22" y="114" className="y-axis-label">{minVal + 5}</text>

                  {/* Connecting Score Trend Path Line with Calm Draw-in Animation */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1a73e8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="credit-chart-path"
                  />

                  {/* Dashed vertical indicator line for the current month */}
                  <line
                    x1="260"
                    y1={getYForScore(score)}
                    x2="260"
                    y2="125"
                    stroke="#1a73e8"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    className="dashed-indicator-line"
                  />

                  {/* Historical dots & text values - sequentially loaded */}
                  {xCoords.map((x, idx) => {
                    const isActive = idx === 4;
                    const yVal = getYForScore(historyScores[idx]);
                    return (
                      <g key={idx} className="chart-dot-group">
                        {isActive && (
                          <circle cx={x} cy={yVal} r="6" fill="rgba(26, 115, 232, 0.18)" className="active-glow-ring" />
                        )}
                        <circle
                          cx={x}
                          cy={yVal}
                          r={isActive ? "4" : "3"}
                          fill="#1a73e8"
                          stroke="#ffffff"
                          strokeWidth="1.2"
                        />
                        <text
                          x={x}
                          y="136"
                          textAnchor="middle"
                          className={`x-axis-label ${isActive ? 'active' : ''}`}
                        >
                          {pastMonths[idx]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Dynamic tool tip pill above current score */}
                  <g className="chart-tooltip-group">
                    <rect
                      x="242"
                      y={getYForScore(score) - 30}
                      width="36"
                      height="18"
                      rx="5"
                      fill="#1a73e8"
                    />
                    <polygon
                      points={`256,${getYForScore(score) - 12} 260,${getYForScore(score) - 7} 264,${getYForScore(score) - 12}`}
                      fill="#1a73e8"
                    />
                    <text
                      x="260"
                      y={getYForScore(score) - 17}
                      textAnchor="middle"
                      className="tooltip-score-text"
                    >
                      {score}
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Credit Report Next Update & Date */}
            <p className="report-update-caption" style={{ marginTop: '0.75rem' }}>
              Next credit report in 30 days • Updated {formattedDate}
            </p>
          </div>
        )}

        {/* Carousel indicators dots below content */}
        <div className="report-carousel-dots">
          <span 
            className={`carousel-dot ${activePage === 0 ? 'active' : ''}`} 
            onClick={() => setActivePage(0)}
            style={{ cursor: 'pointer' }}
          />
          <span 
            className={`carousel-dot ${activePage === 1 ? 'active' : ''}`} 
            onClick={() => setActivePage(1)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Credit Factors List Section */}
      <div className="impact-section">
        <h5 className="impact-section-title">What's impacting your score?</h5>
        
        <div className="factor-list">
          {/* Payment History Card */}
          <div className="factor-item-row" onClick={() => showToast(`Payment History: ${payHistory.percent} of all payments made on time.`, 'success')}>
            <div className="factor-item-icon-wrapper">
              <svg viewBox="0 0 24 24" className="factor-svg-icon" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <polyline points="9 16 11 18 15 14" />
              </svg>
            </div>
            <div className="factor-item-details">
              <div className="factor-item-top">
                <span className="factor-item-name">Payment history</span>
                <span className={`factor-item-badge ${ratings.history.toLowerCase()}`}>{ratings.history}</span>
              </div>
              <p className="factor-item-subtext">
                {payHistory.percent} on-time payments • {payHistory.delayCount} times broken due
              </p>
            </div>
            <svg viewBox="0 0 24 24" className="chevron-right-svg" fill="none" stroke="#5f6368" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          {/* Credit Mix & Loans */}
          <div className="factor-item-row" onClick={() => setShowLoanDetails(!showLoanDetails)}>
            <div className="factor-item-icon-wrapper">
              <svg viewBox="0 0 24 24" className="factor-svg-icon" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="factor-item-details">
              <div className="factor-item-top">
                <span className="factor-item-name">Credit mix & total loans</span>
                <span className={`factor-item-badge ${ratings.mix.toLowerCase()}`}>{ratings.mix}</span>
              </div>
              <p className="factor-item-subtext">
                {loanMix.loans} active loans • {loanMix.cards} credit cards
              </p>
            </div>
            <svg viewBox="0 0 24 24" className={`chevron-right-svg ${showLoanDetails ? 'rotated' : ''}`} fill="none" stroke="#5f6368" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          {/* Hidden Loan Details */}
          {showLoanDetails && (
            <div className="inline-loans-details-panel">
              <h6 className="details-panel-title">Active Loan Accounts</h6>
              <div className="loans-list-compact">
                <div className="loan-compact-item">
                  <span className="loan-compact-name">LGO-1092 Personal Loan</span>
                  <span className="loan-compact-val">Active • ₹50,000</span>
                </div>
                {loanMix.loans >= 2 && (
                  <div className="loan-compact-item">
                    <span className="loan-compact-name">LGO-0871 Mobile Loan</span>
                    <span className="loan-compact-val">Active • ₹15,000</span>
                  </div>
                )}
                {loanMix.loans >= 3 && (
                  <div className="loan-compact-item">
                    <span className="loan-compact-name">LGO-0654 Builder Loan</span>
                    <span className="loan-compact-val">Active • ₹10,000</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Toggle Button */}
        <button
          type="button"
          className="show-cards-btn"
          onClick={() => {
            setShowLoanDetails(!showLoanDetails);
            showToast('Toggled details of active credit card and loan registers.', 'success');
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Show credit cards and loans
        </button>

        {/* Refresh Score Button */}
        <button 
          type="button" 
          className={`score-refresh-btn-gpay ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="15" 
            height="15" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="refresh-icon-gpay"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          {isRefreshing ? 'Refreshing report...' : 'Refresh Score Metrics'}
        </button>
      </div>
    </div>
  );
};

export default TrustScoreView;
