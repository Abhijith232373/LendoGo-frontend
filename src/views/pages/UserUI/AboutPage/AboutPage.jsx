import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, FileText, Percent, Lock, Target, ShieldCheck, Award, CheckCircle, Users } from 'lucide-react';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import aboutHeroImg from '../../../../assets/about_hero.png';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const [activeTrustIndex, setActiveTrustIndex] = useState(null);

  // Scroll reveal animation handler
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px -50px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        } else {
          // Remove class when out of view so it animates again when scrolling back
          entry.target.classList.remove('reveal-active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleTrustAccordion = (index) => {
    setActiveTrustIndex(activeTrustIndex === index ? null : index);
  };

  const differences = [
    {
      icon: <Zap size={28} />,
      title: 'Lightning-Fast Approval',
      highlight: '24-48 Hours',
      desc: 'Our automated risk-assessment engine scans applications instantly, delivering credit decisions in hours, not weeks.',
      color: 'rgba(0, 102, 255, 0.1)',
    },
    {
      icon: <FileText size={28} />,
      title: 'Minimal Documentation',
      highlight: 'Just the Essentials',
      desc: 'Skip the endless paperwork. We verify your details digitally with absolute security, requesting only what is vital.',
      color: 'rgba(74, 222, 128, 0.1)',
    },
    {
      icon: <Percent size={28} />,
      title: 'Competitive Interest Rates',
      highlight: 'Best in Market',
      desc: 'Enjoy transparent interest plans tailored to your financial profile with absolutely no hidden broker fees.',
      color: 'rgba(251, 191, 36, 0.1)',
    },
    {
      icon: <Lock size={28} />,
      title: '100% Secure & Transparent',
      highlight: 'No Hidden Charges',
      desc: 'Protected by banking-grade encryption. Every charge, interest, and term is clearly spelled out on day one.',
      color: 'rgba(168, 85, 247, 0.1)',
    },
    {
      icon: <Target size={28} />,
      title: 'Loan for Every Need',
      highlight: '5 Product Categories',
      desc: 'Tailored borrowing solutions spanning Personal, Business, Home, Student, and Auto Loans, built to match your terms.',
      color: 'rgba(244, 63, 94, 0.1)',
    },
  ];

  const termsOfTrust = [
    {
      title: 'Velocity Principle',
      desc: 'We guarantee a loan decision timeline of 24-48 hours. If we delay, our grievance team actively tracks your priority. We value your time above all.',
    },
    {
      title: 'The Zero-Friction Agreement',
      desc: 'No heavy paper trails, no physical office visits, and no collateral for qualifying personal loans. Financial access should be a breeze, not a burden.',
    },
    {
      title: 'Total Cost Transparency',
      desc: 'What you see is what you pay. Zero processing fee surprises, zero fine-print interest hikes. If a loan carries a fee, it is fully itemized before you sign.',
    },
    {
      title: 'Absolute Data Security',
      desc: 'Your personal information is heavily encrypted in transit and at rest. We never sell, share, or monetize your KYC data with third-party aggregators.',
    },
  ];

  return (
    <div className="about-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="about-hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <ParallaxShapes preset="hero" />
        <div className="about-hero-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="about-hero-left reveal-on-scroll fade-in-left">
            <span className="about-badge">MEET LENDOGO</span>
            <h1 className="about-hero-title">
              Financial Solutions <br />
              <span className="text-gradient">Shouldn't Be Complicated.</span>
            </h1>
            <p className="about-hero-desc">
              Welcome to LendoGo – India's premier digital lending platform engineered for speed, transparency, and absolute financial security. Whether you are scaling a business, buying a home, or managing personal expenses, we deliver hyper-personalized loan products with zero hidden fees and lightning-fast approvals.
            </p>
            <div className="about-hero-stats">
              <div className="stat-item">
                <span className="stat-number">24h</span>
                <span className="stat-label">Avg. Approval</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Digital KYC</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Hidden Charges</span>
              </div>
            </div>
          </div>

          <div className="about-hero-right reveal-on-scroll fade-in-right">
            <div className="image-backdrop-gradient" />
            <img src={aboutHeroImg} alt="LendoGo Fintech Team" className="about-hero-image" />
          </div>
        </div>
      </section>

      {/* ── WHY WE ARE DIFFERENT (THE 5 PILLARS) ── */}
      <section className="about-diff" style={{ position: 'relative', overflow: 'hidden' }}>
        <ParallaxShapes preset="side-decor" />
        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header reveal-on-scroll fade-in-up">
            <span className="section-pretitle">OUR ADVANTAGE</span>
            <h2 className="section-title">What Makes LendoGo Different?</h2>
            <p className="section-subtitle">
              We did away with old banking bureaucracies to engineer a lending platform that actually works for you.
            </p>
          </div>

          <div className="diff-grid">
            {differences.map((item, index) => (
              <div
                key={index}
                className="diff-card reveal-on-scroll fade-in-up"
                style={{ '--delay': `${index * 0.15}s` }}
              >
                <div className="diff-icon-wrap" style={{ backgroundColor: item.color }}>
                  <span className="diff-icon">{item.icon}</span>
                </div>
                <span className="diff-highlight">{item.highlight}</span>
                <h3 className="diff-title">{item.title}</h3>
                <p className="diff-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROMISE SECTION ── */}
      <section className="about-promise">
        <div className="promise-container reveal-on-scroll fade-in-up">
          <div className="promise-glow" />
          <div className="promise-content">
            <span className="promise-badge">OUR CREED</span>
            <h2 className="promise-title">Our Promise to You</h2>
            <p className="promise-desc">
              "We're a young, energetic team dedicated to revolutionizing lending. We believe in transparency, speed, and accessibility. Your financial goals are not just metrics—they are our mission."
            </p>
            <div className="promise-team-foot">
              <div className="team-avatars">
                <span className="avatar-dot" />
                <span className="avatar-dot" />
                <span className="avatar-dot" />
                <span className="avatar-dot" />
              </div>
              <span className="team-signature">The LendoGo Team</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TERMS OF TRUST (BUILD IN OUR TERMS) ── */}
      <section className="about-trust" style={{ position: 'relative', overflow: 'hidden' }}>
        <ParallaxShapes preset="side-decor" />
        <div className="section-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="trust-split">
            <div className="trust-left reveal-on-scroll fade-in-left">
              <span className="section-pretitle">OUR CODE</span>
              <h2 className="section-title">Built On Our Terms of Trust</h2>
              <p className="section-subtitle">
                At LendoGo, lending is a pledge. We operate under strict ethical standards so that you always remain in full control of your credit journey.
              </p>
              <div className="trust-badge-group" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
                <div className="trust-badge-item" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', padding: '10px', borderRadius: '50%', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={20} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937' }}>Bank-grade 256-bit Encryption</span>
                </div>
                <div className="trust-badge-item" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '10px', borderRadius: '50%', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937' }}>ISO Certified NBFC Partner</span>
                </div>
                <div className="trust-badge-item" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', padding: '10px', borderRadius: '50%', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={20} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1f2937' }}>Strictly RBI Compliant</span>
                </div>
              </div>
            </div>

            <div className="trust-right reveal-on-scroll fade-in-right">
              <div className="accordion-wrapper">
                {termsOfTrust.map((item, index) => {
                  const isOpen = activeTrustIndex === index;
                  return (
                    <div key={index} className={`accordion-item ${isOpen ? 'active' : ''}`}>
                      <button className="accordion-header" onClick={() => toggleTrustAccordion(index)}>
                        <span className="accordion-title">{item.title}</span>
                        <span className="accordion-arrow">{isOpen ? '−' : '+'}</span>
                      </button>
                      <div className="accordion-content">
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST METRICS SECTION ── */}
      <section className="about-trust-metrics reveal-on-scroll fade-in-up" style={{ padding: '80px 5%', backgroundColor: '#ffffff', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <div className="section-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ marginBottom: '60px' }}>Trusted by Thousands Nationwide</h2>
          <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 30px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'transform 0.3s ease', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', padding: '20px', borderRadius: '20px', color: 'var(--primary)' }}>
                  <Users size={40} strokeWidth={2} />
                </div>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-1.5px', lineHeight: 1 }}>50K+</h3>
              <p style={{ color: '#64748b', margin: 0, fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.4 }}>Active<br/>Borrowers</p>
            </div>
            <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 30px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'transform 0.3s ease', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', padding: '20px', borderRadius: '20px', color: 'var(--primary)' }}>
                  <ShieldCheck size={40} strokeWidth={2} />
                </div>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-1.5px', lineHeight: 1 }}>₹500Cr+</h3>
              <p style={{ color: '#64748b', margin: 0, fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.4 }}>Capital<br/>Disbursed</p>
            </div>
            <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 30px', backgroundColor: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'transform 0.3s ease', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'rgba(0, 102, 255, 0.1)', padding: '20px', borderRadius: '20px', color: 'var(--primary)' }}>
                  <Award size={40} strokeWidth={2} />
                </div>
              </div>
              <h3 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-1.5px', lineHeight: 1 }}>4.9/5</h3>
              <p style={{ color: '#64748b', margin: 0, fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.4 }}>Average<br/>User Rating</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
