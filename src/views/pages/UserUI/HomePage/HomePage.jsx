import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import Testimonials from '../../../components/Testimonials/Testimonials';
import ScrollReveal from '../../../components/ScrollReveal/ScrollReveal';
import { useAuthController } from '../../../../controllers/auth/useAuthController';

// Import modular homepage sub-components
import HeroSection from './components/HeroSection';
import CalculatorSection from './components/CalculatorSection';
import AutoLoanSection from './components/AutoLoanSection';
import BusinessFundingSection from './components/BusinessFundingSection';

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

  // Interactive Loan Calculator State (Universal Configuration)
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12.5);
  const [loanTerm, setLoanTerm] = useState(36);
  const [isHolding, setIsHolding] = useState(false);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = interestRate / 12 / 100;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1);
  const formattedEmi = Math.round(emi) || 0;
  const totalRepayment = Math.round(emi * loanTerm) || 0;
  const totalInterest = Math.max(0, totalRepayment - loanAmount);

  const principalPercent = totalRepayment > 0 ? Math.round((loanAmount / totalRepayment) * 100) : 0;
  const interestPercent = 100 - principalPercent;

  if (!user.isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="home-page-wrapper">
      <Navbar />

      {/* Modular High-Fidelity Hero Section */}
      <HeroSection navigate={navigate} />

      <main className="home-main-content">
        {/* Modular Universal Full-Page Calculator Section */}
        <ScrollReveal variant="fade-right">
          <CalculatorSection
            loanAmount={loanAmount}
            setLoanAmount={setLoanAmount}
            interestRate={interestRate}
            setInterestRate={setInterestRate}
            loanTerm={loanTerm}
            setLoanTerm={setLoanTerm}
            isHolding={isHolding}
            setIsHolding={setIsHolding}
            formattedEmi={formattedEmi}
            totalInterest={totalInterest}
            principalPercent={principalPercent}
            interestPercent={interestPercent}
          />
        </ScrollReveal>

        {/* Modular High-Fidelity Auto Loans Showcase Section */}
        <ScrollReveal variant="fade-left" delay={0.15}>
          <AutoLoanSection navigate={navigate} />
        </ScrollReveal>

        {/* Modular High-Fidelity Business Funding Showcase Section */}
        <ScrollReveal variant="fade-right" delay={0.1}>
          <BusinessFundingSection navigate={navigate} />
        </ScrollReveal>

        {/* Dynamic High-Fidelity Animated Testimonials Section */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
