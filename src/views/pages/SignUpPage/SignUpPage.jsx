import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SignUpForm from '../../components/SignUpForm/SignUpForm';
import Footer from '../../components/Footer/Footer';
import signupImg from '../../../assets/signup.jpg';
import './SignUpPage.css';

const SignUpPage = () => {
  return (
    <div className="signup-page-wrapper">
      <Navbar />

      <main className="signup-main-content">
        <section className="signup-hero-section">

          {/* ── Left: Form ── */}
          <div className="signup-hero-left">
            <SignUpForm />
          </div>

          {/* ── Right: Image ── */}
          <div className="signup-hero-right">
            <div className="signup-img-block">
              <img
                src={signupImg}
                alt="Join LendoGO — Your Trusted Loan Partner"
                className="signup-hero-img"
              />
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
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SignUpPage;
