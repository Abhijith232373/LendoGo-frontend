import React, { createContext, useContext, useState } from 'react';

const LoanApplicationContext = createContext(null);

export const LoanApplicationProvider = ({ children }) => {
  // Loan type
  const [loanType, setLoanType] = useState('personal');
  const [loanTypeLabel, setLoanTypeLabel] = useState('Personal Loan');

  // Step 1: Personal Details
  const [fullName, setFullName]       = useState('');
  const [dob, setDob]                 = useState('');
  const [email, setEmail]             = useState('');
  const [phone, setPhone]             = useState('');
  const [address, setAddress]         = useState('');
  const [city, setCity]               = useState('');
  const [stateName, setStateName]     = useState('');
  const [pincode, setPincode]         = useState('');

  // Step 2: Loan Offer
  const [loanAmount, setLoanAmount]         = useState(50000);
  const [tenure, setTenure]                 = useState(12);
  const [isTrustedUpgrade, setIsTrustedUpgrade] = useState(false);

  // Step 3: KYC
  const [aadhaarFront, setAadhaarFront]         = useState(null);
  const [aadhaarBack, setAadhaarBack]           = useState(null);
  const [panCard, setPanCard]                   = useState(null);
  const [liveSelfie, setLiveSelfie]             = useState(null);
  const [incomeProof, setIncomeProof]           = useState(null);
  const [propertyDoc, setPropertyDoc]           = useState(null);
  const [registrationDoc, setRegistrationDoc]   = useState(null);
  const [agreementDoc, setAgreementDoc]         = useState(null);
  const [creditHistory, setCreditHistory]       = useState(null);
  const [employmentType, setEmploymentType]     = useState('');
  const [monthlyIncome, setMonthlyIncome]       = useState('');

  // Step 4: Terms & E-Sign
  const [termsAccepted, setTermsAccepted]       = useState(false);
  const [signature, setSignature]               = useState('');
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);

  // Step completion guards
  const [completedSteps, setCompletedSteps] = useState({
    step1: false, step2: false, step3: false, step4: false,
  });
  const markStepComplete = (step) =>
    setCompletedSteps(prev => ({ ...prev, [step]: true }));

  // Derived interest rate based on loan type
  const interestRate =
    loanType === 'home'     ? 8.5  :
    loanType === 'property' ? 9.5  :
    loanType === 'business' ? 13   :
    loanType === 'credit-builder' ? 16 :
    loanType === 'instant'  ? 18   : 14; // personal / default

  const calcEmi = (amount, months, rate) => {
    if (loanType === 'instant' || loanType === 'credit-builder') {
      const interest = amount * (months === 3 ? 0.08 : 0.16);
      return Math.round((amount + interest) / months);
    }
    const r = rate / 12 / 100;
    if (r === 0) return Math.round(amount / months);
    return Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const emi = calcEmi(loanAmount, tenure, interestRate);

  return (
    <LoanApplicationContext.Provider value={{
      loanType, setLoanType,
      loanTypeLabel, setLoanTypeLabel,
      // Step 1
      fullName, setFullName, dob, setDob,
      email, setEmail, phone, setPhone,
      address, setAddress, city, setCity,
      stateName, setStateName, pincode, setPincode,
      // Step 2
      loanAmount, setLoanAmount, tenure, setTenure,
      isTrustedUpgrade, setIsTrustedUpgrade,
      // Step 3
      aadhaarFront, setAadhaarFront,
      aadhaarBack, setAadhaarBack,
      panCard, setPanCard,
      liveSelfie, setLiveSelfie,
      incomeProof, setIncomeProof,
      propertyDoc, setPropertyDoc,
      registrationDoc, setRegistrationDoc,
      agreementDoc, setAgreementDoc,
      creditHistory, setCreditHistory,
      employmentType, setEmploymentType,
      monthlyIncome, setMonthlyIncome,
      // Step 4
      termsAccepted, setTermsAccepted,
      signature, setSignature,
      hasDrawnSignature, setHasDrawnSignature,
      // Guards & computed
      completedSteps, markStepComplete,
      interestRate, emi, calcEmi,
    }}>
      {children}
    </LoanApplicationContext.Provider>
  );
};

export const useLoanApplication = () => {
  const ctx = useContext(LoanApplicationContext);
  if (!ctx) throw new Error('useLoanApplication must be inside LoanApplicationProvider');
  return ctx;
};
