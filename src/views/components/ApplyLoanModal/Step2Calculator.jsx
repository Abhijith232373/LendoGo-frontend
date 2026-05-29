import React from 'react';

const Step2Calculator = ({
  loanType,
  loanAmount,
  setLoanAmount,
  interestRate,
  setInterestRate,
  tenure,
  setTenure,
  emi,
  totalInterest
}) => {
  return (
    <div className="loan-step-pane pane-2 emi-calculator-container animate-slide-up">
      <div className="emi-calculator-header">
        <h3>Calculate your EMI</h3>
      </div>

      <div className="emi-calculator-grid">
        {/* Left Column: Sliders */}
        <div className="emi-sliders-col">
          {/* Slider 1: Loan Amount */}
          <div className="emi-slider-card">
            <div className="emi-slider-header">
              <span className="emi-slider-title">Loan Amount:</span>
              <div className="emi-input-wrapper">
                <span className="emi-currency-symbol">₹</span>
                <input 
                  type="number" 
                  value={loanAmount} 
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setLoanAmount(val);
                  }}
                  className="emi-number-input"
                />
              </div>
            </div>
            <input 
              type="range"
              min={loanType === 'micro' ? 5000 : (loanType === 'home' ? 50000 : 20000)}
              max={loanType === 'micro' ? 100000 : (loanType === 'home' ? 1000000 : 500000)}
              step={loanType === 'micro' ? 1000 : 5000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="emi-range-slider"
            />
            <div className="emi-slider-ticks">
              <span>0.0L</span>
              <span>2L</span>
              <span>4L</span>
              <span>6L</span>
              <span>8L</span>
              <span>10L</span>
            </div>
          </div>

          {/* Slider 2: Interest Rate */}
          <div className="emi-slider-card">
            <div className="emi-slider-header">
              <span className="emi-slider-title">Interest Rate:</span>
              <div className="emi-input-wrapper">
                <span className="emi-currency-symbol">%</span>
                <input 
                  type="number" 
                  step="0.1"
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="emi-number-input"
                />
              </div>
            </div>
            <input 
              type="range"
              min={10}
              max={30}
              step={0.5}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="emi-range-slider"
            />
            <div className="emi-slider-ticks">
              <span>10%</span>
              <span>15%</span>
              <span>20%</span>
              <span>25%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Slider 3: Tenure */}
          <div className="emi-slider-card">
            <div className="emi-slider-header">
              <span className="emi-slider-title">Tenure:</span>
              <div className="emi-input-wrapper">
                <span className="emi-currency-symbol">Months</span>
                <input 
                  type="number" 
                  value={tenure} 
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="emi-number-input narrow"
                />
              </div>
            </div>
            <input 
              type="range"
              min={1}
              max={60}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="emi-range-slider"
            />
            <div className="emi-slider-ticks">
              <span>1</span>
              <span>12</span>
              <span>24</span>
              <span>36</span>
              <span>48</span>
              <span>60</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Donut Chart + Table */}
        <div className="emi-visual-col">
          <div className="emi-chart-wrapper">
            <div 
              className="emi-donut-chart"
              style={{
                background: `conic-gradient(#10b981 0% ${100 - (totalInterest / (loanAmount + totalInterest) * 100)}%, #3b82f6 ${100 - (totalInterest / (loanAmount + totalInterest) * 100)}% 100%)`
              }}
            >
              <div className="emi-donut-hole">
                <span className="donut-center-label">Monthly EMI</span>
                <strong className="donut-center-value">₹{emi.toLocaleString('en-IN')}</strong>
              </div>
            </div>
            
            <div className="emi-chart-legend">
              <span className="legend-item"><span className="legend-dot principal" /> Principal Amount</span>
              <span className="legend-item"><span className="legend-dot interest" /> Total Interest</span>
            </div>
          </div>

          <div className="emi-details-table">
            <div className="emi-table-row">
              <span className="emi-row-label">Loan Amount selected</span>
              <span className="emi-row-value font-bold text-primary">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="emi-table-row">
              <span className="emi-row-label">EMI</span>
              <span className="emi-row-value font-bold text-primary">₹{emi.toLocaleString('en-IN')}</span>
            </div>
            <div className="emi-table-row">
              <span className="emi-row-label">Total Interest</span>
              <span className="emi-row-value font-bold text-primary">₹{totalInterest.toLocaleString('en-IN')}</span>
            </div>
            <div className="emi-table-row total-highlight">
              <span className="emi-row-label">Total Amount</span>
              <span className="emi-row-value">₹{(loanAmount + totalInterest).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Calculator;
