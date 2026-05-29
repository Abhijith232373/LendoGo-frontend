import React from 'react';
import homeImg from '../../../../../assets/home.jpg';
import ParallaxShapes from '../../../../components/ParallaxShapes/ParallaxShapes';

const HeroSection = ({ navigate }) => {
  return (
    <section className="homepage-premium-hero">
      {/* Interactive Floating Parallax Shapes & Glow Blobs */}
      <ParallaxShapes preset="hero" />

      <div className="hero-inner-container">
        <div className="hero-left-content">
          <span className="hero-prime-badge animate-slide-up">Verified Prime Account</span>
          <h1 className="hero-headline animate-slide-up delay-1">Premium Personal Loans & Credit Made Simple</h1>
          <p className="hero-description animate-slide-up delay-2">
            LendoGo simplifies premium personal credit by offering instantly approved digital applications, exceptionally low fixed interest rates, and tailored financial packages designed to fuel your life ambitions with complete security and peace of mind.
          </p>
          <button
            onClick={() => navigate('/loan/apply/details?type=personal')}
            className="btn-hero-apply animate-slide-up delay-3"
          >
            Apply Now &rarr;
          </button>

          {/* Social Ratings Proof Row */}
          <div className="hero-social-proof animate-slide-up delay-4">
            <div className="social-avatars-row">
              <span className="avatar-circle-pic c1">A</span>
              <span className="avatar-circle-pic c2">R</span>
              <span className="avatar-circle-pic c3">S</span>
            </div>
            <div className="proof-metrics">
              <span className="metric-number">2,291</span>
              <span className="metric-sub">Happy Customers</span>
            </div>
            <div className="proof-divider" />
            <div className="proof-ratings">
              <span className="rating-number">4.8/5</span>
              <div className="stars-row">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <span className="rating-sub">Trust Score</span>
            </div>
          </div>
        </div>

        <div className="hero-right-image animate-fade-in-right">
          <div className="hero-image-backdrop" />
          <img src={homeImg} alt="LendoGo Success Couple" className="hero-banner-img" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
