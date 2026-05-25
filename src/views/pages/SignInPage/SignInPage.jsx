import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import SignInForm from '../../components/SignInForm/SignInForm';
import WhatWeOffer from '../../components/WhatWeOffer/WhatWeOffer';
import Testimonials from '../../components/Testimonials/Testimonials';
import Footer from '../../components/Footer/Footer';
import { useAuthController } from '../../../controllers/auth/useAuthController';
import illustration from '../../../assets/loan_illustration.png';
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs';
import { StaggerFeatures } from '../../components/StaggerFeatures/StaggerFeatures';
import './SignInPage.css';

const SignInPage = () => {
  const { signIn, loading, error, user } = useAuthController();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuthenticated) {
      navigate('/home');
    }
  }, [user.isAuthenticated, navigate]);

  const handleSignIn = async (email, password) => {
    try {
      await signIn(email, password);
      console.log('Signed in successfully');
      navigate('/home');
    } catch (err) {
      console.error('Sign in failed:', err);
      throw err;
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-left">
            {user.isAuthenticated ? (
              <div className="success-state">
                <h2>Welcome back, {user.name}!</h2>
                <p>You have successfully signed in.</p>
                <button className="btn-primary" onClick={() => window.location.reload()}>Sign Out</button>
              </div>
            ) : (
              <SignInForm onSignIn={handleSignIn} loading={loading} error={error} />
            )}
          </div>
          <div className="hero-right">
            <img src={illustration} alt="Loan Approval Illustration" className="hero-illustration" />
          </div>
        </section>
      </main>

      <div className="bottom-sections" style={{ width: '100%' }}>
        <WhyChooseUs />
        <WhatWeOffer />
        <StaggerFeatures />
        <Testimonials />
      </div>
      
      <Footer />
    </div>
  );
};

export default SignInPage;
