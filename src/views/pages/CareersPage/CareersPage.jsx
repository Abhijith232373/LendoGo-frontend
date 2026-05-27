import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../components/ParallaxShapes/ParallaxShapes';
import hiringImg from '../../../assets/hiring.jpg';
import './CareersPage.css';

const perks = [
  { icon: '🚀', title: 'High Growth', desc: 'Accelerate your career in a fast-moving fintech startup.' },
  { icon: '🏠', title: 'Flexible Work', desc: 'Hybrid & remote-friendly culture that respects your life.' },
  { icon: '💡', title: 'Innovation First', desc: 'Ship real features that reach millions of borrowers.' },
  { icon: '🎓', title: 'Learning Budget', desc: '₹50,000/year for courses, books, and conferences.' },
  { icon: '❤️', title: 'Health Cover', desc: 'Comprehensive medical insurance for you and your family.' },
  { icon: '🤝', title: 'Inclusive Culture', desc: 'Diverse teams, zero-hierarchy, and open communication.' },
];

const CareersPage = () => {
  const navigate = useNavigate();

  return (
    <div className="careers-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="careers-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <ParallaxShapes preset="hero" />
        
        <ScrollReveal variant="fade-right" className="careers-hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <span className="careers-badge">We're Hiring 🎉</span>
          <h1 className="careers-hero-title">
            Build the Future of <br />
            <span className="careers-highlight">Finance in India</span>
          </h1>
          <p className="careers-hero-sub">
            Join the LendoGO team and help millions of Indians access credit instantly, fairly, and transparently.
          </p>
          <button
            id="see-openings-btn"
            className="careers-cta-btn"
            onClick={() => navigate('/careers/openings')}
          >
            <span>See Current Openings</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </ScrollReveal>

        <ScrollReveal variant="fade-left" delay={0.15} className="careers-hero-image-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="careers-hero-image-glow" />
          <img
            src={hiringImg}
            alt="LendoGO is Hiring"
            className="careers-hero-image"
          />
        </ScrollReveal>
      </section>

      {/* ── PERKS ── */}
      <section className="careers-perks" style={{ position: 'relative', overflow: 'hidden' }}>
        <ParallaxShapes preset="side-decor" />
        
        <div className="careers-section-inner" style={{ position: 'relative', zIndex: 2 }}>
          <ScrollReveal variant="fade-up">
            <h2 className="careers-section-title">Why Work With Us?</h2>
            <p className="careers-section-sub">More than a job — a mission you'll be proud of.</p>
          </ScrollReveal>
          
          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="perks-grid">
              {perks.map((perk) => (
                <div key={perk.title} className="perk-card">
                  <div className="perk-icon">{perk.icon}</div>
                  <h3 className="perk-title">{perk.title}</h3>
                  <p className="perk-desc">{perk.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="careers-cta-band">
        <ScrollReveal variant="zoom-in" className="careers-section-inner" style={{ textAlign: 'center' }}>
          <h2 className="careers-section-title" style={{ color: '#fff' }}>Ready to Make an Impact?</h2>
          <p className="careers-section-sub" style={{ color: 'rgba(255,255,255,0.72)' }}>
            We have 6 open roles across Product, Engineering, Finance, and Design.
          </p>
          <button
            className="careers-cta-btn"
            style={{ margin: '0 auto' }}
            onClick={() => navigate('/careers/openings')}
          >
            <span>Browse All Openings</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;
