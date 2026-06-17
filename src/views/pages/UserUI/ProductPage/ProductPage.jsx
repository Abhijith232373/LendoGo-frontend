import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import './ProductPage.css';

const PRODUCT_DATA_MAP = {
  personal: {
    title: "Elite Personal Funding",
    badge: "FAST & UNSECURED",
    headline: "Simple, Unsecured Financing Mapped to Your Life Goals",
    intro: "Whether it is handling unforeseen medical needs, consolidating existing high-interest bills, planning a grand marriage, or taking that dream trip, our elite personal funding gives you rapid capital without the drag of traditional banking red tape.",
    thought: "A personal loan is not just a debt—it is a strategic bridge that empowers you to capture life's opportunities and handle its surprises with dignity, clarity, and control.",
    features: [
      "Interest starting at 8.99% annually",
      "Unsecured credit - No collateral or guarantor required",
      "Instant e-KYC approval with disbursal under 24 hours",
      "Flexible repayments with tenures ranging up to 60 months",
      "100% digital trace-free compliance verification"
    ],
    imgLeft: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686368/personal_loan_visual_mei861.png',
    imgRight: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686367/personal_loan_secondary_vr20ul.png'
  },
  business: {
    title: "Strategic Business Capital",
    badge: "ENTERPRISE SCALING",
    headline: "Fuelling Scalable Growth, Equipment, and Working Capital",
    intro: "Propel your corporate ambitions, stock up seasonal inventory, acquire state-of-the-art machinery, or expand physical coordinates with high-fidelity, customized commercial credit plans mapped directly to your revenue streams.",
    thought: "Business capital is the fuel of innovation. It transforms ambitious concepts into market-leading enterprises, enabling scale at the precise moment opportunity knocks.",
    features: [
      "High credit tickets ranging up to ₹50 Lakhs",
      "Customized monthly or seasonal EMI payment models",
      "Zero-collateral unsecured operational credit facilities",
      "Tax savings advantages on asset-backed equipment loans",
      "Priority customer help desk with dedicated credit analysts"
    ],
    imgLeft: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686368/business_loan_visual_q5n2m9.png',
    imgRight: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686368/business_loan_secondary_wf9gzd.png'
  },
  home: {
    title: "Premium Home Mortgages",
    badge: "GENERATIONAL EQUITY",
    headline: "Own the Spaces You Deserve with Transparent Long-Term Mortgages",
    intro: "Stop paying rent and build long-term generational equity. Our tailored housing credit products offer transparent interest terms to help you acquire, build, or remodel your residential coordinates with total peace of mind.",
    thought: "A home loan is an investment in stability and belonging. It is the foundation upon which families build memories and write their future stories.",
    features: [
      "Extended repayment periods stretching up to 30 years",
      "Highly competitive interest schemes synced with RBI repo rates",
      "Fast-track digital property valuation and title checks",
      "Up to 90% funding of the total property registration cost",
      "Home balance transfer coordinates with zero processing fees"
    ],
    imgLeft: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686370/home_loan_visual_ivaztw.png',
    imgRight: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686369/home_loan_secondary_mt6fj4.png'
  },
  property: {
    title: "Sovereign Asset Liquidity",
    badge: "ASSET LEVERAGE",
    headline: "Unlock the Latent Financial Potential of Your Real Estate",
    intro: "Transform static real estate wealth into liquid working capital. Retain complete ownership and usage coordinates of your property while securing large-ticket funding to scale operations or consolidate leverage.",
    thought: "Real estate is a powerful tool for wealth generation. Leveraging property equity is a sophisticated way to unlock liquidity without sacrificing ownership.",
    features: [
      "High LTV financing options covering up to 75% of market value",
      "Extremely low interest rate metrics compared to personal loans",
      "Long-term repayments with tenures reaching up to 15 years",
      "Accepted coordinates: Commercial, residential, or raw plots",
      "Symmetric balance settlement schedules with flexible auto-debit"
    ],
    imgLeft: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686369/property_loan_visual_uwdagy.png',
    imgRight: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686368/property_loan_secondary_ory7cb.png'
  },
  instant: {
    title: "Nano Instant Credit",
    badge: "MICRO-LIQUIDITY",
    headline: "Lightning-Fast Cash Drops Mapped Directly to Your Mobile Wallet",
    intro: "Need urgent liquidity to cover a flash expense, buy a premium gadget, or plug a cash gap? LendoGo’s state-of-the-art e-KYC risk scanner matches details in seconds, pushing money directly to your account in under 10 minutes.",
    thought: "Instant liquidity is financial agility. It provides peace of mind, knowing that a minor cash crunch will not interrupt your lifestyle or life's momentum.",
    features: [
      "Guaranteed disbursal to bank account in under 10 minutes",
      "100% digital e-KYC flow requiring just Aadhaar and PAN",
      "Short-term flexible repayments from 3 to 12 months",
      "Zero prepayment penalty fees after the first installment",
      "Auto-credit upgrade coordinate limits upon prompt repayment"
    ],
    imgLeft: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686370/instant_loan_visual_mjoce2.png',
    imgRight: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686370/instant_loan_secondary_wdurpx.png'
  },
  'credit-builder': {
    title: "Credit Catalyst Builder",
    badge: "FINANCIAL ELEVATION",
    headline: "Engineer Your Premium Credit History with Automated Reporting",
    intro: "Struggling with a low credit score or completely new to borrowing coordinates? Our credit catalyst builder is engineered to build your rating. Make prompt micropayments and watch your financial trust score rise in real-time.",
    thought: "A strong credit score is the key to financial freedom. Building credit is a step-by-step commitment that opens doors to premium financial products.",
    features: [
      "Zero minimum credit score coordinates needed to qualify",
      "Active automated reporting to CIBIL, Equifax, and Experian",
      "Direct auto-debit scheduling preventing past-due errors",
      "Proven boost to credit score access coordinates within 90 days",
      "Refundable deposit terms with high-yield interest options"
    ],
    imgLeft: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686368/credit_builder_visual_jbzuju.png',
    imgRight: 'https://res.cloudinary.com/dfyhke26f/image/upload/q_auto/f_auto/v1781686368/credit_builder_secondary_z2kfvc.png'
  }
};

const ProductPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = React.useState(false);

  // Safe fallback if type is invalid
  const productKey = PRODUCT_DATA_MAP[type] ? type : 'personal';
  const data = PRODUCT_DATA_MAP[productKey];

  // Scroll reveal animation handler
  useEffect(() => {
    // Reset loaded state to re-trigger landing transitions on route parameter change
    setPageLoaded(false);

    const observerOptions = {
      root: null,
      rootMargin: '0px -30px',
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        } else {
          entry.target.classList.remove('reveal-active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    // Scroll to top instantly
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Trigger entry landing animations on a minor delay
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 80);

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      clearTimeout(timer);
    };
  }, [type]);

  const handleApplyClick = () => {
    // Check if there is an active loan that is not closed
    const activeLoanStr = localStorage.getItem('lendogo_active_loan');
    if (activeLoanStr) {
      try {
        const activeLoan = JSON.parse(activeLoanStr);
        if (activeLoan && activeLoan.status === 'ACTIVE') {
          window.dispatchEvent(new CustomEvent('lendogo-toast', {
            detail: {
              message: `You already have an active loan (${activeLoan.id}). Please pay it off entirely to unlock the ability to apply for a new loan!`,
              type: 'error'
            }
          }));
          return;
        }
      } catch (err) {
        console.error("Error reading active loan state:", err);
      }
    }
    // Navigates directly to our core 5-step wizard with the corresponding product query param
    navigate(`/loan/apply/details?type=${productKey}`);
  };

  return (
    <div className={`product-page-wrapper ${pageLoaded ? 'page-loaded' : ''}`}>
      <Navbar />

      {/* HERO SECTION */}
      <section className="product-hero-section">
        <ParallaxShapes preset="hero" />
        <div className="product-hero-container">
          <div className="product-hero-text landing-animate-left">
            <span className="product-badge-pill">{data.badge}</span>
            <h1 className="product-hero-title">
              {data.title}
            </h1>
            <p className="product-hero-headline">
              {data.headline}
            </p>
            <p className="product-hero-description">
              {data.intro}
            </p>
            <button className="product-apply-cta-btn" onClick={handleApplyClick}>
              Apply Now
            </button>
            <div className="product-hero-trust-badges">
              <span className="hero-trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px', color: '#0f66ff' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Bank-grade Security
              </span>
              <span className="hero-trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px', color: '#0f66ff' }}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/><path d="M9 6h6"/><path d="M9 10h6"/></svg>
                RBI Regulated NBFCs
              </span>
              <span className="hero-trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '5px', color: '#0f66ff' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                24h Approval Deciders
              </span>
            </div>
          </div>
          <div className="product-hero-visual landing-animate-right">
            <div className="hero-gradient-overlay" />
            <img src={data.imgLeft} alt={data.title} className="product-main-hero-image" />
          </div>
        </div>
      </section>

      {/* THOUGHT / PERSPECTIVE CARD CALLOUT */}
      {data.thought && (
        <section className="product-thought-section reveal-on-scroll fade-in-up">
          <div className="thought-container">
            <span className="thought-quote-icon">“</span>
            <p className="thought-text">{data.thought}</p>
            <div className="thought-author-line">
              <span className="thought-dash"></span>
              <span className="thought-attribution">LendoGo Smart Borrowing Philosophy</span>
            </div>
          </div>
        </section>
      )}

      {/* DETAILS SECTION (ALTERNATING ROWS: LEFT & RIGHT ALIGNED) */}
      <section className="product-alternating-details-section">
        <div className="details-container">
          
          {/* Row 1: Image Left, Text Right */}
          <div className="details-alt-row">
            <div className="details-row-visual reveal-on-scroll fade-in-left" style={{ '--delay': '0.1s' }}>
              <div className="alt-row-gradient-glow blue" />
              <img src={data.imgLeft} alt="Fintech Specifications" className="alt-row-spec-image" />
            </div>
            
            <div className="details-row-info reveal-on-scroll fade-in-right" style={{ '--delay': '0.2s' }}>
              <span className="row-pretitle">SPECIFICATIONS</span>
              <h2 className="row-main-title">Why Choose Our {data.title}?</h2>
              <p className="row-description">
                LendoGo did away with the complex broker grids to engineer an direct client-funding mechanism. 
                Everything is done directly inside our high-security portal with immediate notifications.
              </p>
              
              <ul className="spec-features-checklist">
                {data.features.slice(0, 3).map((feat, idx) => (
                  <li key={idx} className="spec-feature-item">
                    <span className="spec-check-icon">✓</span>
                    <span className="spec-feature-text">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 2: Text Left, Image Right (Alternated!) */}
          <div className="details-alt-row reverse">
            <div className="details-row-info reveal-on-scroll fade-in-left" style={{ '--delay': '0.1s' }}>
              <span className="row-pretitle">HOW IT WORKS</span>
              <h2 className="row-main-title">Transparent & Secure Process</h2>
              <p className="row-description">
                Skip long physical lines. Secure your identity credentials digitally, review dynamic customized offers, 
                and receive immediate bank account transfers without any processing fee surprises.
              </p>
              
              <ul className="spec-features-checklist">
                {data.features.slice(3).map((feat, idx) => (
                  <li key={idx} className="spec-feature-item">
                    <span className="spec-check-icon">✓</span>
                    <span className="spec-feature-text">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="details-row-visual reveal-on-scroll fade-in-right" style={{ '--delay': '0.2s' }}>
              <div className="alt-row-gradient-glow green" />
              <img src={data.imgRight} alt="LendoGo Platform Safety" className="alt-row-spec-image" />
            </div>
          </div>

        </div>
      </section>

      {/* PILLARS OF FINANCIAL TRUST SECTION */}
      <section className="product-trust-pillars-section">
        <div className="pillars-container">
          <div className="pillars-header reveal-on-scroll fade-in-up">
            <span className="pillars-pretitle">TRUST & ASSURANCE</span>
            <h2 className="pillars-title">Borrow With Complete Confidence</h2>
            <p className="pillars-subtitle">
              We stand by transparent credit structures. No fine-print surprises, no broker markups, and absolute safety.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card reveal-on-scroll fade-in-up">
              <div className="pillar-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3 className="pillar-card-title">256-Bit Data Encryption</h3>
              <p className="pillar-card-desc">Your personal coordinates and KYC scans are guarded by state-of-the-art secure layers.</p>
            </div>
            
            <div className="pillar-card reveal-on-scroll fade-in-up" style={{ '--delay': '0.15s' }}>
              <div className="pillar-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg-icon"><path d="M3 22h18"/><path d="M6 18V9"/><path d="M10 18V9"/><path d="M14 18V9"/><path d="M18 18V9"/><path d="M4 6h16l-8-4-8 4z"/></svg>
              </div>
              <h3 className="pillar-card-title">RBI-Regulated NBFCs</h3>
              <p className="pillar-card-desc">LendoGo operates in total compliance with central mandates to secure your borrower rights.</p>
            </div>

            <div className="pillar-card reveal-on-scroll fade-in-up" style={{ '--delay': '0.3s' }}>
              <div className="pillar-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg-icon"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="pillar-card-title">Zero Hidden Surcharges</h3>
              <p className="pillar-card-desc">What you see on the dashboard is what you pay. Zero broker fees, zero hidden fines.</p>
            </div>

            <div className="pillar-card reveal-on-scroll fade-in-up" style={{ '--delay': '0.45s' }}>
              <div className="pillar-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pillar-svg-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <h3 className="pillar-card-title">Flexible Prepayments</h3>
              <p className="pillar-card-desc">Repay early or modify monthly EMI tenures at zero penalty surcharges after 3 terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER SUCCESS TESTIMONIAL QUOTE BLOCK */}
      <section className="product-testimonial-section">
        <div className="testimonial-container reveal-on-scroll scale-in">
          <div className="testimonial-glow" />
          <span className="testimonial-stars">★★★★★</span>
          <p className="testimonial-quote">
            "Applying with LendoGo was incredibly simple. The transparent parameters and e-KYC validation meant my loan was approved and disbursed in under 24 hours without any stressful branch office visits."
          </p>
          <div className="testimonial-author">
            <span className="author-name">Siddharth Sharma</span>
            <span className="author-role">Verified Borrower (Elite Personal Funding)</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductPage;
