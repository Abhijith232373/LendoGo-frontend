import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import Footer from '../../components/Footer/Footer';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../components/ParallaxShapes/ParallaxShapes';
import signupImg from '../../../assets/signup.jpg';
import './SignUpPage.css';

const SignUpPage = () => {
  return (
    <div className="signup-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      <main className="signup-main-content" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Ambient background parallax decorations */}
        <ParallaxShapes preset="side-decor" />

        <section className="signup-hero-section" style={{ position: 'relative', zIndex: 2 }}>

          {/* ── Left: Form ── */}
          <ScrollReveal variant="fade-right" className="signup-hero-left">
            <SignUpForm />
          </ScrollReveal>

          {/* ── Right: Image ── */}
          <ScrollReveal variant="fade-left" delay={0.15} className="signup-hero-right">
            <div className="signup-img-block">
              <img
                src={signupImg}
                alt="Join LendoGO — Your Trusted Loan Partner"
                className="signup-hero-img"
              />
              <ScrollReveal variant="fade-up" delay={0.35}>
                <div className="signup-trust-badges">
                  <div className="signup-trust-item">
                    <span>⚡</span><span>Instant Approval</span>
                  </div>
                  <div className="signup-trust-item">
                    <span>🔒</span><span>100% Secure</span>
                  </div>
                  <div className="signup-trust-item">
                    <span>💸</span><span>Low Interest Rates</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SignUpPage;
