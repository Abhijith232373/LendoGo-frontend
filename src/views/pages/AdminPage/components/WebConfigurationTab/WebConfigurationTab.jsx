import React from 'react';
import "./WebConfigurationTab.css";

const WebConfigurationTab = ({ 
  showConfigSuccess, 
  minCreditScore, 
  setMinCreditScore, 
  baseInterestRate, 
  setBaseInterestRate, 
  isSignupsEnabled, 
  setIsSignupsEnabled, 
  isConsultationsEnabled, 
  setIsConsultationsEnabled, 
  handleSaveWebConfig 
}) => {
  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="section-header-row">
        <h2>System Web Configurations</h2>
        <p>Configure borrowing constraints, approval credit rules, and active application parameters.</p>
      </div>

      <div className="web-config-card-box">
        {showConfigSuccess && (
          <div className="config-success-banner animate-scale-up">
            ✓ Platform parameters updated in secure database.
          </div>
        )}

        <div className="config-row-item">
          <div className="config-info-text">
            <h4>Minimum Scoring Index Requirement</h4>
            <p>Incoming borrowers must achieve this score on simulated database scans to unlock instant approvals.</p>
          </div>
          <div className="config-action-control">
            <div className="range-score-wrap">
              <input 
                type="range"
                min={300}
                max={850}
                value={minCreditScore}
                onChange={(e) => setMinCreditScore(Number(e.target.value))}
                className="config-slider-range"
              />
              <strong className="slider-score-indicator">{minCreditScore}</strong>
            </div>
          </div>
        </div>

        <div className="config-row-item">
          <div className="config-info-text">
            <h4>Platform Base Interest Rate P.A.</h4>
            <p>Global baseline interest index applied to newly approved credit contracts.</p>
          </div>
          <div className="config-action-control">
            <div className="range-score-wrap">
              <input 
                type="range"
                min={5}
                max={25}
                value={baseInterestRate}
                onChange={(e) => setBaseInterestRate(Number(e.target.value))}
                className="config-slider-range"
              />
              <strong className="slider-score-indicator">{baseInterestRate}%</strong>
            </div>
          </div>
        </div>

        <div className="config-row-item">
          <div className="config-info-text">
            <h4>Enable Public Account Sign-ups</h4>
            <p>Disabling blocks new user registration endpoints on the server (maintenance mode).</p>
          </div>
          <div className="config-action-control">
            <label className="toggle-switch">
              <input 
                type="checkbox"
                checked={isSignupsEnabled}
                onChange={() => setIsSignupsEnabled(!isSignupsEnabled)}
              />
              <span className="slider-round" />
            </label>
          </div>
        </div>

        <div className="config-row-item">
          <div className="config-info-text">
            <h4>Enable Free Consultation Dialogs</h4>
            <p>Controls visibility of consultation query prompts in public site footers.</p>
          </div>
          <div className="config-action-control">
            <label className="toggle-switch">
              <input 
                type="checkbox"
                checked={isConsultationsEnabled}
                onChange={() => setIsConsultationsEnabled(!isConsultationsEnabled)}
              />
              <span className="slider-round" />
            </label>
          </div>
        </div>

        <button className="btn-save-web-config" onClick={handleSaveWebConfig}>
          Save System Parameters
        </button>
      </div>
    </div>
  );
};

export default WebConfigurationTab;
