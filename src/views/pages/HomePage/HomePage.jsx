import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useAuthController } from '../../../controllers/auth/useAuthController';
import homeImg from '../../../assets/home.jpg';

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

  // Interactive Loan Calculator State (CreditSea style)
  const [loanAmount, setLoanAmount] = useState(20000);
  const [interestRate, setInterestRate] = useState(18.5);
  const [loanTerm, setLoanTerm] = useState(18);
  const [walletBalance, setWalletBalance] = useState(25000); // Simulated Personal Wallet Balance

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

  // E-Sign Loan Modal State & Transactions List

  const [recentTransactions, setRecentTransactions] = useState([
    { date: 'May 17, 2026', title: 'Loan Disbursal #32991', desc: 'Transfer to ending **4099', status: 'Completed', amount: 14250.00, isCredit: true },
    { date: 'May 05, 2026', title: 'EMI Auto-Debit', desc: 'LendoGo Auto-Debit Auth', status: 'Completed', amount: 412.50, isCredit: false },
    { date: 'Apr 05, 2026', title: 'EMI Auto-Debit', desc: 'LendoGo Auto-Debit Auth', status: 'Completed', amount: 412.50, isCredit: false },
    { date: 'Mar 24, 2026', title: 'Processing Fee Credit', desc: 'Waived for Prime Club', status: 'Completed', amount: 150.00, isCredit: true },
  ]);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const formattedEmi = Math.round(emi) || 0;
  const totalRepayment = Math.round(emi * loanTerm) || 0;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  // Handle simulated "Apply Now" progression from the standard side calc
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
          // Add to recent transactions ledger
          const newTx = {
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            title: 'Personal Loan Disbursal',
            desc: `Sanctioned Ref ID: LN-${Math.floor(100000 + Math.random() * 900000)}`,
            status: 'Completed',
            amount: loanAmount,
            isCredit: true
          };
          setRecentTransactions(prev => [newTx, ...prev]);
          setWalletBalance(prev => prev + loanAmount);
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

  // Handler for successful wizard modal loan payout requests
  const handleLoanApplySuccess = (newLoan) => {
    setWalletBalance(prev => prev + newLoan.amount);
    
    const newTx = {
      date: newLoan.date,
      title: `${newLoan.type} Disbursal`,
      desc: `Sanctioned Ref ID: LN-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Completed',
      amount: newLoan.amount,
      isCredit: true
    };
    
    setRecentTransactions(prev => [newTx, ...prev]);
  };

  // Mock dashboard stats
  const creditScore = 765;
  const totalCreditLimit = 100000;
  const activeBalance = 14250;
  const totalDisbursals = recentTransactions.filter(tx => tx.isCredit).reduce((sum, tx) => sum + tx.amount, 0);
  const availableLimit = totalCreditLimit - activeBalance - totalDisbursals;

  if (!user.isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="home-page-wrapper">
      <Navbar />

      {/* High-Fidelity Roadoz & Fintech Premium Hero Area (Full Width Header Section) */}
      <section className="homepage-premium-hero">
        {/* Dynamic Glowing Background Blobs */}
        <div className="hero-bg-blob blob-1" />
        <div className="hero-bg-blob blob-2" />
        <div className="hero-bg-blob blob-3" />

        {/* Interactive Floating Geometric Shapes (InstaMoney Aesthetic) */}
        <div className="floating-shape shape-triangle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
            <path d="M12 2L2 22H22L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="floating-shape shape-circle-blue">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="#0066ff" strokeWidth="3">
            <circle cx="10" cy="10" r="8"/>
          </svg>
        </div>
        <div className="floating-shape shape-circle-purple">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="3 3">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
        <div className="floating-shape shape-plus">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="3.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <div className="floating-shape shape-square-yellow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#eab308" strokeWidth="2.5">
            <rect x="2" y="2" width="16" height="16" rx="3"/>
          </svg>
        </div>
        <div className="floating-shape shape-circle-green">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#10b981" strokeWidth="3">
            <circle cx="10" cy="10" r="7"/>
          </svg>
        </div>
        <div className="floating-shape shape-triangle-orange">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5">
            <path d="M12 2L2 22H22L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="hero-inner-container">
          <div className="hero-left-content">
            <span className="hero-prime-badge animate-slide-up">Verified Prime Account</span>
            <h1 className="hero-headline animate-slide-up delay-1">Premium Personal Loans & Credit Made Simple</h1>
            <p className="hero-description animate-slide-up delay-2">
              LendoGo simplifies premium personal credit by offering instantly approved digital applications, exceptionally low fixed interest rates, and tailored financial packages designed to fuel your life ambitions with complete security and peace of mind.
            </p>
            <button
              onClick={() => navigate('/loan/apply/details?type=personal')}
              className="btn-hero-apply animate-slide-up delay-3"
            >
              Apply Now &rarr;
            </button>

            {/* Social Ratings Proof Row */}
            <div className="hero-social-proof animate-slide-up delay-4">
              <div className="social-avatars-row">
                <span className="avatar-circle-pic c1">A</span>
                <span className="avatar-circle-pic c2">R</span>
                <span className="avatar-circle-pic c3">S</span>
              </div>
              <div className="proof-metrics">
                <span className="metric-number">2,291</span>
                <span className="metric-sub">Happy Customers</span>
              </div>
              <div className="proof-divider" />
              <div className="proof-ratings">
                <span className="rating-number">4.8/5</span>
                <div className="stars-row">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
                <span className="rating-sub">Trust Score</span>
              </div>
            </div>
          </div>

          <div className="hero-right-image animate-fade-in-right">
            <div className="hero-image-backdrop" />
            <img src={homeImg} alt="LendoGo Success Couple" className="hero-banner-img" />
          </div>
        </div>
      </section>

      <main className="home-main-content">
        <section className="home-calculator-section animate-slide-up">
          
          <div className="home-calculator-card">
            
            {appState === 'idle' && (
              <div className="home-emi-container">
                <div className="home-emi-header">
                  <h2>Calculate your EMI</h2>
                </div>

                <div className="home-emi-grid">
                  
                  {/* Left Column: Sliders */}
                  <div className="home-emi-sliders-col">
                    
                    {/* Slider 1: Loan Amount */}
                    <div className="home-emi-slider-card">
                      <div className="home-emi-slider-header">
                        <span className="home-emi-slider-title">Loan Amount:</span>
                        <div className="home-emi-input-wrapper">
                          <span className="home-emi-currency-symbol">₹</span>
                          <input 
                            type="number" 
                            value={loanAmount} 
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setLoanAmount(val);
                            }}
                            className="home-emi-number-input"
                          />
                        </div>
                      </div>
                      <input 
                        type="range"
                        min={5000}
                        max={100000}
                        step={1000}
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="home-emi-range-slider"
                      />
                      <div className="home-emi-slider-ticks">
                        <span>0.0L</span>
                        <span>2L</span>
                        <span>4L</span>
                        <span>6L</span>
                        <span>8L</span>
                        <span>10L</span>
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
                            value={interestRate} 
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="home-emi-number-input"
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
                        className="home-emi-range-slider"
                      />
                      <div className="home-emi-slider-ticks">
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
                        <span className="home-emi-slider-title">Tenure:</span>
                        <div className="home-emi-input-wrapper">
                          <span className="home-emi-currency-symbol">Months</span>
                          <input 
                            type="number" 
                            value={loanTerm} 
                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                            className="home-emi-number-input narrow"
                          />
                        </div>
                      </div>
                      <input 
                        type="range"
                        min={1}
                        max={60}
                        step={1}
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="home-emi-range-slider"
                      />
                      <div className="home-emi-slider-ticks">
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
                  <div className="home-emi-visual-col">
                    
                    {/* Dynamic Conic Donut Chart */}
                    <div className="home-emi-chart-wrapper">
                      <div 
                        className="home-emi-donut-chart"
                        style={{
                          background: `conic-gradient(#10b981 0% ${100 - (totalInterest / (loanAmount + totalInterest) * 100)}%, #3b82f6 ${100 - (totalInterest / (loanAmount + totalInterest) * 100)}% 100%)`
                        }}
                      >
                        <div className="home-emi-donut-hole">
                          <span className="home-donut-center-label">Monthly EMI</span>
                          <strong className="home-donut-center-value">₹{formattedEmi.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="home-emi-chart-legend">
                        <span className="home-legend-item"><span className="home-legend-dot principal" /> Principal Amount</span>
                        <span className="home-legend-item"><span className="home-legend-dot interest" /> Total Interest</span>
                      </div>
                    </div>

                    {/* Dynamic Values Breakdown Grid */}
                    <div className="home-emi-details-table">
                      <div className="home-emi-table-row">
                        <span className="home-emi-row-label">Loan Amount selected</span>
                        <span className="home-emi-row-value font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="home-emi-table-row">
                        <span className="home-emi-row-label">EMI</span>
                        <span className="home-emi-row-value font-bold">₹{formattedEmi.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="home-emi-table-row">
                        <span className="home-emi-row-label">Total Interest</span>
                        <span className="home-emi-row-value font-bold">₹{totalInterest.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="home-emi-table-row total-highlight">
                        <span className="home-emi-row-label">Total Amount</span>
                        <span className="home-emi-row-value">₹{(loanAmount + totalInterest).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Action Apply Button */}
                    <button 
                      type="button" 
                      className="btn-home-apply-now"
                      onClick={handleApplyNow}
                    >
                      Apply Now for Instant Approval
                    </button>

                  </div>

                </div>
              </div>
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
                  Congratulations! Your requested loan amount of **₹{loanAmount.toLocaleString('en-IN')}** has been approved at a locked rate of **{interestRate}% Fixed P.A.** 
                </p>

                <div className="success-recap-box">
                  <div className="recap-row">
                    <span>Monthly Installment (EMI):</span>
                    <strong className="text-primary">₹{formattedEmi.toLocaleString('en-IN')}/mo</strong>
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
                  className="btn-home-apply-now btn-reset" 
                  onClick={handleResetApplication}
                >
                  Calculate Another Loan
                </button>
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
