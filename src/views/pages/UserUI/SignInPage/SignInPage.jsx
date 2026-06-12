import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import SignInForm from '../../../components/SignInForm/SignInForm';
import WhatWeOffer from '../../../components/WhatWeOffer/WhatWeOffer';
import Testimonials from '../../../components/Testimonials/Testimonials';
import Footer from '../../../components/Footer/Footer';
import ScrollReveal from '../../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import { useAuthController } from '../../../../controllers/auth/useAuthController';
import illustration from '../../../../assets/loan_illustration.png';
import WhyChooseUs from '../../../components/WhyChooseUs/WhyChooseUs';
import { StaggerFeatures } from '../../../components/StaggerFeatures/StaggerFeatures';
import './SignInPage.css';

const SignInPage = () => {
  const { signIn, loading, error, user } = useAuthController();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isAuthenticated) {
      if (user.role !== 'user') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [user.isAuthenticated, user.role, navigate]);

  const handleSignIn = async (email, password) => {
    try {
      const loggedInUser = await signIn(email, password);
      console.log('Signed in successfully');
      if (loggedInUser && loggedInUser.role !== 'user') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
      return loggedInUser;
    } catch (err) {
      console.error('Sign in failed:', err);
      throw err;
    }
  };

  return (
    <div className="page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      
      <main className="main-content" style={{ position: 'relative', overflow: 'hidden' }}>
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Dynamic Parallax Shapes floating in the Hero Background */}
          <ParallaxShapes preset="hero" />
          
          <div className="hero-left" style={{ position: 'relative', zIndex: 2 }}>
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
          <div className="hero-right" style={{ position: 'relative', zIndex: 2 }}>
            <img src={illustration} alt="Loan Approval Illustration" className="hero-illustration" />
          </div>
        </section>
      </main>

      <div className="bottom-sections" style={{ width: '100%', position: 'relative', zIndex: 2 }}>
        <ScrollReveal variant="fade-up">
          <WhyChooseUs />
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={0.1}>
          <WhatWeOffer />
        </ScrollReveal>
        <ScrollReveal variant="fade-up" delay={0.1}>
          <StaggerFeatures />
        </ScrollReveal>
        <Testimonials />
      </div>
      
      <Footer />
    </div>
  );
};

export default SignInPage;
