import React from 'react';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';

const CalculatorSection = ({
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  loanTerm,
  setLoanTerm,
  isHolding,
  setIsHolding,
  formattedEmi,
  totalInterest,
  principalPercent,
  interestPercent,
}) => {
  // Exploded slice calculation:
  // Offset the smaller slice (Interest) radially outward
  const absoluteAngleDeg = (principalPercent * 3.6) + (interestPercent * 3.6) / 2 - 90;
  const absoluteAngleRad = (absoluteAngleDeg * Math.PI) / 180;
  const explodeDistance = 8; // Pull out distance in pixels
  const dx = Math.cos(absoluteAngleRad) * explodeDistance;
  const dy = Math.sin(absoluteAngleRad) * explodeDistance;

  return (
    <section className="home-calculator-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Interactive Background Floating Shapes */}
      <ParallaxShapes preset="side-decor" />

      <div className="home-calculator-layout" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Left Column: Universal Calculator Panel */}
        <div className="home-calculator-panel">
          <div className="home-emi-header-wrapper">
            <div className="home-emi-header">
              <h2>Universal Loan EMI Calculator</h2>
              <p className="home-emi-subheader">Adjust parameters in real-time to plan your dynamic financing terms</p>
            </div>
          </div>

          {/* Input Sliders & SVG Chart Container */}
          <div className="home-calculator-workspace">
            
            {/* Sliders Grid */}
            <div className="home-emi-sliders-col">
              
              {/* Slider 1: Loan Amount */}
              <div className="home-emi-slider-card">
                <div className="home-emi-slider-header">
                  <span className="home-emi-slider-title">Loan Amount:</span>
                  <div className="home-emi-input-wrapper">
                    <span className="home-emi-currency-symbol">₹</span>
                    <input 
                      type="number" 
                      min={100}
                      max={1500000}
                      value={loanAmount} 
                      onChange={(e) => {
                        const val = Math.min(1500000, Math.max(0, Number(e.target.value)));
                        setLoanAmount(val);
                      }}
                      className="home-emi-number-input"
                    />
                  </div>
                </div>
                <input 
                  type="range"
                  min={100}
                  max={1500000}
                  step={100}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="home-emi-range-slider"
                />
                <div className="home-emi-slider-ticks">
                  <span>₹100</span>
                  <span>₹3L</span>
                  <span>₹6L</span>
                  <span>₹9L</span>
                  <span>₹12L</span>
                  <span>₹15L</span>
                </div>
              </div>

              {/* Slider 2: Interest Rate */}
              <div className="home-emi-slider-card">
                <div className="home-emi-slider-header">
                  <span className="home-emi-slider-title">Interest Rate:</span>
                  <div className="home-emi-input-wrapper">
                    <span className="home-emi-currency-symbol">%</span>
                    <input 
                      type="number" 
                      step="0.1"
                      min={5}
                      max={30}
                      value={interestRate} 
                      onChange={(e) => {
                        const val = Math.min(30, Math.max(0, Number(e.target.value)));
                        setInterestRate(val);
                      }}
                      className="home-emi-number-input"
                    />
                  </div>
                </div>
                <input 
                  type="range"
                  min={5}
                  max={30}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="home-emi-range-slider"
                />
                <div className="home-emi-slider-ticks">
                  <span>5%</span>
                  <span>10%</span>
                  <span>15%</span>
                  <span>20%</span>
                  <span>25%</span>
                  <span>30%</span>
                </div>
              </div>

              {/* Slider 3: Tenure */}
              <div className="home-emi-slider-card">
                <div className="home-emi-slider-header">
                  <span className="home-emi-slider-title">Tenure (Months):</span>
                  <div className="home-emi-input-wrapper">
                    <span className="home-emi-currency-symbol">Months</span>
                    <input 
                      type="number" 
                      min={3}
                      max={180}
                      value={loanTerm} 
                      onChange={(e) => {
                        const val = Math.min(180, Math.max(1, Number(e.target.value)));
                        setLoanTerm(val);
                      }}
                      className="home-emi-number-input narrow"
                    />
                  </div>
                </div>
                <input 
                  type="range"
                  min={3}
                  max={180}
                  step={1}
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="home-emi-range-slider"
                />
                <div className="home-emi-slider-ticks">
                  <span>3m</span>
                  <span>3Y</span>
                  <span>6Y</span>
                  <span>9Y</span>
                  <span>12Y</span>
                  <span>15Y</span>
                </div>
              </div>

            </div>

            {/* SVG Circular Donut Chart Panel */}
            <div className="home-emi-visual-col">
              
              {/* Dynamic SVG Circular Ring */}
              <div 
                className="home-emi-chart-wrapper"
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                onMouseEnter={() => setIsHolding(true)}
              >
                <div className="home-emi-donut-chart-svg-container">
                  <svg 
                    viewBox="0 0 100 100" 
                    className="home-emi-svg-circle"
                  >
                    {/* Circular track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="circle-track"
                      fill="transparent"
                      stroke="#e2e8f0"
                      strokeWidth="8"
                    />
                    {/* Principal segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="circle-principal"
                      fill="transparent"
                      stroke="var(--primary)"
                      strokeWidth="8"
                      strokeDasharray={`${principalPercent * 2.3876} 238.76`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                      strokeLinecap="round"
                    />
                    {/* Exploded Interest segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      className="circle-interest exploded"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={`${interestPercent * 2.3876} 238.76`}
                      strokeDashoffset={`-${principalPercent * 2.3876}`}
                      style={{
                        transform: `translate(${dx}px, ${dy}px) rotate(-90deg)`,
                        transformOrigin: '50px 50px',
                        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Hole text changes dynamically on holding/hovering */}
                  <div className={`home-emi-donut-hole ${isHolding ? 'holding' : ''}`}>
                    {!isHolding ? (
                      <>
                        <span className="home-donut-center-label">Monthly EMI</span>
                        <strong className="home-donut-center-value">₹{formattedEmi.toLocaleString('en-IN')}</strong>
                        <span className="home-donut-center-sub">Hover to Inspect</span>
                      </>
                    ) : (
                      <>
                        <span className="home-donut-center-label">Principal / Interest</span>
                        <strong className="home-donut-center-value">{principalPercent}% / {interestPercent}%</strong>
                        <span className="home-donut-center-sub">₹{loanAmount.toLocaleString('en-IN')} vs ₹{totalInterest.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="home-emi-chart-legend">
                  <span className="home-legend-item">
                    <span className="home-legend-dot principal" /> Principal ({principalPercent}%)
                  </span>
                  <span className="home-legend-item">
                    <span className="home-legend-dot interest" /> Interest ({interestPercent}%)
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Dynamic Values Breakdown Grid: Placed Below Inputs */}
          <div className="home-emi-details-table">
            <div className="home-emi-details-table-grid">
              <div className="home-emi-table-card">
                <span className="home-emi-row-label">Loan Amount Selected</span>
                <strong className="home-emi-row-value">₹{loanAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="home-emi-table-card">
                <span className="home-emi-row-label">Monthly EMI</span>
                <strong className="home-emi-row-value text-blue">₹{formattedEmi.toLocaleString('en-IN')}</strong>
              </div>
              <div className="home-emi-table-card">
                <span className="home-emi-row-label">Total Interest</span>
                <strong className="home-emi-row-value text-green">₹{totalInterest.toLocaleString('en-IN')}</strong>
              </div>
              <div className="home-emi-table-card total-highlight">
                <span className="home-emi-row-label">Total Repayment Amount</span>
                <strong className="home-emi-row-value text-indigo">₹{(loanAmount + totalInterest).toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CalculatorSection;
