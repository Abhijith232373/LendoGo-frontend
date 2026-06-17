import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import ScrollReveal from '../../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import { 
  TrendingUp, 
  Building, 
  Lightbulb, 
  BookOpen, 
  ShieldPlus, 
  Users,
  Briefcase,
  Target,
  Award
} from 'lucide-react';
import './CareersPage.css';

const perks = [
  { icon: <TrendingUp size={28} />, title: 'High Growth Trajectory', desc: 'Accelerate your career in a fast-moving, high-impact fintech ecosystem.' },
  { icon: <Building size={28} />, title: 'Flexible Infrastructure', desc: 'Hybrid and remote-friendly infrastructure designed for professional autonomy.' },
  { icon: <Lightbulb size={28} />, title: 'Innovation First', desc: 'Engineer sophisticated financial products that empower millions of borrowers.' },
  { icon: <BookOpen size={28} />, title: 'Professional Development', desc: 'Comprehensive annual budget for continuous education and certification.' },
  { icon: <ShieldPlus size={28} />, title: 'Premium Health Coverage', desc: 'Top-tier medical insurance securing the health of you and your dependents.' },
  { icon: <Users size={28} />, title: 'Collaborative Environment', desc: 'Cross-functional teams, transparent communication, and meritocratic culture.' },
];

const values = [
  { icon: <Target size={32} />, title: 'Data-Driven Precision', desc: 'Every decision we make is backed by rigorous data analysis and institutional metrics, ensuring robust and scalable financial solutions.' },
  { icon: <Briefcase size={32} />, title: 'Uncompromising Integrity', desc: 'Trust is our primary currency. We uphold the highest ethical standards in every transaction, code deployment, and customer interaction.' },
  { icon: <Award size={32} />, title: 'Excellence in Execution', desc: 'We do not settle for average. From our engineering architecture to our customer service protocols, we demand excellence.' },
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
          <span className="careers-badge">Join the Institution</span>
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
            src="https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686369/hiring_e1e1ee.jpg"
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

      {/* ── CORE VALUES ── */}
      <section className="careers-values" style={{ position: 'relative', overflow: 'hidden', padding: '100px 5%', background: '#ffffff' }}>
        <div className="careers-section-inner" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
          <ScrollReveal variant="fade-up">
            <h2 className="careers-section-title">Our Institutional Core Values</h2>
            <p className="careers-section-sub">The foundational principles that guide our architecture and our culture.</p>
          </ScrollReveal>
          
          <ScrollReveal variant="fade-up" delay={0.15}>
            <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '50px' }}>
              {values.map((value) => (
                <div key={value.title} className="value-card" style={{ background: '#fafbff', padding: '40px', borderRadius: '16px', border: '1px solid rgba(0, 102, 255, 0.12)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                  <div className="value-icon" style={{ 
                    color: 'var(--primary)', 
                    marginBottom: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '60px',
                    height: '60px',
                    background: 'rgba(0, 102, 255, 0.08)',
                    borderRadius: '12px'
                  }}>{value.icon}</div>
                  <h3 className="value-title" style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '16px', color: 'var(--text-dark)' }}>{value.title}</h3>
                  <p className="value-desc" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-light)' }}>{value.desc}</p>
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
