import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SetPasswordForm from '../../components/SetPasswordForm/SetPasswordForm';
import Footer from '../../components/Footer/Footer';
import passwordImg from '../../../assets/password.jpg';
import './SetPasswordPage.css';

const SetPasswordPage = () => {
  return (
    <div className="sppage-wrapper">
      <Navbar />

      <main className="sppage-main-content">
        <section className="sppage-hero-section">

          {/* ── Left: Image ── */}
          <div className="sppage-hero-left">
            <div className="sppage-img-block">
              <img
                src={passwordImg}
                alt="Secure your LendoGO account"
                className="sppage-hero-img"
              />
              <div className="sppage-trust-badges">
                <div className="sppage-trust-item">
                  <span>🔒</span><span>256-bit Encryption</span>
                </div>
                <div className="sppage-trust-item">
                  <span>🛡️</span><span>100% Secure</span>
                </div>
                <div className="sppage-trust-item">
                  <span>✅</span><span>Bank-grade Safety</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="sppage-hero-right">
            <SetPasswordForm />
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SetPasswordPage;
