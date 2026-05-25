import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuthController } from '../../../controllers/auth/useAuthController';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuthController();
  const navigate = useNavigate();

  // Redirect to Sign-In page if not authenticated
  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate('/');
    }
  }, [user.isAuthenticated, navigate]);

  // Interactive Loan Calculator State
  const [loanAmount, setLoanAmount] = useState(15000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [walletBalance, setWalletBalance] = useState(25000); // Simulated Personal Wallet Balance
  const interestRate = 14; // Starting at 14%

  // Simulated Application Workflow State
  const [appState, setAppState] = useState('idle'); // idle, processing, success
  const [processingStep, setProcessingStep] = useState(0);
  const processingMessages = [
    "Analyzing credit profile...",
    "Validating secure digital signature...",
    "Generating loan proposal contract...",
    "Performing database ledger sync...",
    "Securing instant approval..."
  ];

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const formattedEmi = Math.round(emi);
  const totalRepayment = Math.round(emi * loanTerm);
  const totalInterest = totalRepayment - loanAmount;

  // Handle simulated "Apply Now" progression
  const handleApplyNow = (e) => {
    e.preventDefault();
    setAppState('processing');
    setProcessingStep(0);
  };

  useEffect(() => {
    let timer;
    if (appState === 'processing') {
      if (processingStep < processingMessages.length) {
        timer = setTimeout(() => {
          setProcessingStep((prev) => prev + 1);
        }, 800);
      } else {
        timer = setTimeout(() => {
          setAppState('success');
        }, 500);
      }
    }
    return () => clearTimeout(timer);
  }, [appState, processingStep]);

  const handleResetApplication = () => {
    setAppState('idle');
    setLoanAmount(15000);
    setLoanTerm(36);
  };

  // Mock dashboard stats
  const creditScore = 765;
  const totalCreditLimit = 50000;
  const activeBalance = 14250;
  const availableLimit = totalCreditLimit - activeBalance - (appState === 'success' ? loanAmount : 0);

  if (!user.isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="home-page-wrapper">
      <Navbar />

      <main className="home-main-content">
        {/* Dynamic Welcoming Header */}
        <section className="welcome-banner-section">
          <div className="welcome-banner-content">
            <span className="banner-badge">Verified Prime Account</span>
            <h1 className="banner-title">Welcome Back, {user.name}!</h1>
            <p className="banner-subtitle">
              Manage your instant personal loans, check credit statements, and apply for flexible financing below.
            </p>
          </div>
          <div className="welcome-banner-avatar">
            <div className="banner-avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </section>

        {/* Dashboard Financial Metrics Grid */}
        <section className="metrics-section">
          <div className="metrics-grid">
            <div className="metric-card limit-card">
              <div className="metric-icon-wrap limit-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">Available Credit Limit</span>
                <h3 className="metric-value">${availableLimit.toLocaleString()}</h3>
                <div className="metric-progress-bg">
                  <div 
                    className="metric-progress-bar" 
                    style={{ width: `${(availableLimit / totalCreditLimit) * 100}%` }}
                  />
                </div>
                <span className="metric-subtext">Total Approved Limit: ${totalCreditLimit.toLocaleString()}</span>
              </div>
            </div>

            <div className="metric-card active-card">
              <div className="metric-icon-wrap active-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">Active Loan Balance</span>
                <h3 className="metric-value">${activeBalance.toLocaleString()}</h3>
                <span className="metric-status-tag paid">Auto-Debit Active</span>
                <span className="metric-subtext text-green">Next EMI Auto-Debits in 8 days</span>
              </div>
            </div>

            <div className="metric-card score-card">
              <div className="metric-icon-wrap score-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12A10 10 0 1 1 12 2v10z"/><path d="M12 2a10 10 0 0 1 10 10H12V2z"/></svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">Your Credit Score</span>
                <h3 className="metric-value">{creditScore} <span className="score-rating">Excellent</span></h3>
                <div className="score-meter">
                  <div className="score-dot" style={{ left: `${((creditScore - 300) / (850 - 300)) * 100}%` }} />
                </div>
                <span className="metric-subtext">Updated on May 25, 2026</span>
              </div>
            </div>

            <div className="metric-card wallet-card">
              <div className="metric-icon-wrap wallet-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
              </div>
              <div className="metric-info">
                <span className="metric-label">Personal Wallet Balance</span>
                <h3 className="metric-value">₹{walletBalance.toLocaleString('en-IN')}</h3>
                <div className="wallet-actions-row">
                  <button 
                    type="button" 
                    className="btn-wallet-action add" 
                    onClick={() => {
                      const amount = prompt("Enter deposit amount to load wallet (₹):");
                      if (amount && !isNaN(amount) && Number(amount) > 0) {
                        setWalletBalance(prev => prev + Number(amount));
                      }
                    }}
                  >
                    + Load Cash
                  </button>
                  <button 
                    type="button" 
                    className="btn-wallet-action withdraw" 
                    onClick={() => {
                      const amount = prompt("Enter withdrawal amount (₹):");
                      if (amount && !isNaN(amount) && Number(amount) > 0) {
                        if (Number(amount) <= walletBalance) {
                          setWalletBalance(prev => prev - Number(amount));
                        } else {
                          alert("Insufficient wallet capital reserves.");
                        }
                      }
                    }}
                  >
                    Withdraw
                  </button>
                </div>
                <span className="metric-subtext">Linked account: SBI (**4099)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Grid: Interactive Loan Calculator (Left) vs Ledger (Right) */}
        <div className="dashboard-body-grid">
          <section className="calculator-section">
            <div className="calc-card">
              <h2 className="calc-title">Instant Financing Portal</h2>
              
              {appState === 'idle' && (
                <form className="calc-form" onSubmit={handleApplyNow}>
                  {/* Slider 1: Loan Amount */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label className="slider-label">Request Loan Amount</label>
                      <span className="slider-value">${loanAmount.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range"
                      min={1000}
                      max={50000}
                      step={500}
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="calc-slider"
                    />
                    <div className="slider-bounds">
                      <span>Min: $1,000</span>
                      <span>Max: $50,000</span>
                    </div>
                  </div>

                  {/* Slider 2: Loan Term */}
                  <div className="slider-group">
                    <div className="slider-header">
                      <label className="slider-label">Repayment Tenure</label>
                      <span className="slider-value">{loanTerm} Months</span>
                    </div>
                    <input 
                      type="range"
                      min={12}
                      max={60}
                      step={6}
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      className="calc-slider"
                    />
                    <div className="slider-bounds">
                      <span>Min: 12 mos</span>
                      <span>Max: 60 mos</span>
                    </div>
                  </div>

                  {/* Interest rate indicator */}
                  <div className="rate-indicator-row">
                    <span className="rate-badge-title">Flexible Interest Rate</span>
                    <span className="rate-badge-value">{interestRate}% Fixed P.A.</span>
                  </div>

                  {/* Real-time Calculation Details */}
                  <div className="calc-summary-box">
                    <div className="summary-row">
                      <span className="summary-label">Estimated Monthly Payment (EMI)</span>
                      <span className="summary-value highlight-emi">${formattedEmi}/mo</span>
                    </div>
                    <div className="summary-separator" />
                    <div className="summary-row">
                      <span className="summary-label">Total Interest Payable</span>
                      <span className="summary-value">${totalInterest.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Total Repayment Amount</span>
                      <span className="summary-value">${totalRepayment.toLocaleString()}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn-apply-portal">
                    Apply Now for Instant Approval
                  </button>
                </form>
              )}

              {appState === 'processing' && (
                <div className="simulated-loader-container">
                  <div className="circular-progress-spinner">
                    <div className="spinner-ring" />
                    <div className="spinner-inner-circle" />
                  </div>
                  <h3 className="processing-title">Processing Application</h3>
                  <div className="processing-status-wrapper">
                    <p className="processing-status-text animate-pulse">
                      {processingMessages[Math.min(processingStep, processingMessages.length - 1)]}
                    </p>
                  </div>
                  <div className="simulated-bar">
                    <div 
                      className="simulated-bar-fill" 
                      style={{ width: `${(processingStep / processingMessages.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {appState === 'success' && (
                <div className="simulated-success-container animate-scale-up">
                  <div className="calc-success-badge">
                    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-scale-up">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  
                  <h3 className="calc-success-title">Loan Pre-Approved!</h3>
                  <p className="calc-success-desc">
                    Congratulations! Your requested loan amount of **${loanAmount.toLocaleString()}** has been approved at a locked rate of **{interestRate}% Fixed P.A.** 
                  </p>

                  <div className="success-recap-box">
                    <div className="recap-row">
                      <span>Monthly Installment (EMI):</span>
                      <strong className="text-primary">${formattedEmi}/mo</strong>
                    </div>
                    <div className="recap-row">
                      <span>Tenure:</span>
                      <strong>{loanTerm} Months</strong>
                    </div>
                    <div className="recap-row">
                      <span>Estimated Disbursal:</span>
                      <strong className="text-green">Within 24 Hours</strong>
                    </div>
                  </div>

                  <p className="congrats-subtext">
                    Our credit officers are finalizing the transfers. We will email the contract agreement shortly.
                  </p>

                  <button 
                    type="button" 
                    className="btn-apply-portal btn-reset" 
                    onClick={handleResetApplication}
                  >
                    Calculate Another Loan
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Statement / Transaction Ledger */}
          <section className="ledger-section">
            <div className="ledger-card">
              <h2 className="ledger-title">Statement & Recent Activity</h2>
              <div className="table-responsive">
                <table className="ledger-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Transaction Details</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appState === 'success' && (
                      <tr className="ledger-row-new animate-fade-in">
                        <td>May 25, 2026</td>
                        <td>
                          <div className="tx-info">
                            <span className="tx-title">Pre-Approved Disbursal</span>
                            <span className="tx-desc">Ref ID: LN-99432</span>
                          </div>
                        </td>
                        <td><span className="status-badge pending">Pending Transfer</span></td>
                        <td className="tx-amount credit">+${loanAmount.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr>
                      <td>May 17, 2026</td>
                      <td>
                        <div className="tx-info">
                          <span className="tx-title">Loan Disbursal #32991</span>
                          <span className="tx-desc">Transfer to ending **4099</span>
                        </div>
                      </td>
                      <td><span className="status-badge completed">Completed</span></td>
                      <td className="tx-amount credit">+$14,250.00</td>
                    </tr>
                    <tr>
                      <td>May 05, 2026</td>
                      <td>
                        <div className="tx-info">
                          <span className="tx-title">EMI Auto-Debit</span>
                          <span className="tx-desc">LendoGo Auto-Debit Auth</span>
                        </div>
                      </td>
                      <td><span className="status-badge completed">Completed</span></td>
                      <td className="tx-amount debit">-$412.50</td>
                    </tr>
                    <tr>
                      <td>Apr 05, 2026</td>
                      <td>
                        <div className="tx-info">
                          <span className="tx-title">EMI Auto-Debit</span>
                          <span className="tx-desc">LendoGo Auto-Debit Auth</span>
                        </div>
                      </td>
                      <td><span className="status-badge completed">Completed</span></td>
                      <td className="tx-amount debit">-$412.50</td>
                    </tr>
                    <tr>
                      <td>Mar 24, 2026</td>
                      <td>
                        <div className="tx-info">
                          <span className="tx-title">Processing Fee Credit</span>
                          <span className="tx-desc">Waived for Prime Club</span>
                        </div>
                      </td>
                      <td><span className="status-badge completed">Completed</span></td>
                      <td className="tx-amount credit">+$150.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
