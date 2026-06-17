import React from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import SetPasswordForm from '../../../components/SetPasswordForm/SetPasswordForm';
import Footer from '../../../components/Footer/Footer';
import ScrollReveal from '../../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import './SetPasswordPage.css';

const SetPasswordPage = () => {
  return (
    <div className="sppage-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Dynamic ambient moving shapes background */}
      <ParallaxShapes preset="hero" />

      <main className="sppage-main-content" style={{ position: 'relative', zIndex: 2 }}>
        <section className="sppage-hero-section">

          {/* ── Left: Image ── */}
          <ScrollReveal variant="fade-right" className="sppage-hero-left">
            <div className="sppage-img-block">
              <img
                src="https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686366/password_hwbh4i.jpg"
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
          </ScrollReveal>

          {/* ── Right: Form ── */}
          <ScrollReveal variant="fade-left" className="sppage-hero-right">
            <SetPasswordForm />
          </ScrollReveal>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SetPasswordPage;
