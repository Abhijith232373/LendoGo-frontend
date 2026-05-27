import React, { useEffect, useState } from 'react';
import './ParallaxShapes.css';

/**
 * ParallaxShapes Component
 * Renders multiple floating, glowing geometric shapes and gradients.
 * Shapes dynamically slide/float as the user scrolls, creating a premium depth effect.
 */
const ParallaxShapes = ({ preset = 'hero' }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once initially
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Define shapes based on the chosen preset
  const getShapes = () => {
    if (preset === 'hero') {
      return [
        {
          id: 'hero-triangle',
          className: 'parallax-shape shape-triangle-purple',
          parallaxSpeed: 0.15,
          color: '#a855f7',
          svg: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 22H22L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          style: { top: '15%', left: '4%' }
        },
        {
          id: 'hero-circle-blue',
          className: 'parallax-shape shape-circle-blue',
          parallaxSpeed: -0.1,
          color: '#3b82f6',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="9"/>
            </svg>
          ),
          style: { top: '65%', left: '8%' }
        },
        {
          id: 'hero-plus-yellow',
          className: 'parallax-shape shape-plus-yellow',
          parallaxSpeed: 0.22,
          color: '#eab308',
          svg: (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          ),
          style: { top: '12%', right: '6%' }
        },
        {
          id: 'hero-square-emerald',
          className: 'parallax-shape shape-square-emerald',
          parallaxSpeed: -0.18,
          color: '#10b981',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="18" height="18" rx="4"/>
            </svg>
          ),
          style: { top: '55%', right: '10%' }
        },
        {
          id: 'hero-circle-orange',
          className: 'parallax-shape shape-dotted-orange',
          parallaxSpeed: 0.08,
          color: '#f97316',
          svg: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="4 4">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          ),
          style: { top: '38%', left: '46%' }
        }
      ];
    } else if (preset === 'side-decor') {
      return [
        {
          id: 'side-circle-indigo',
          className: 'parallax-shape shape-circle-indigo',
          parallaxSpeed: 0.12,
          color: '#6366f1',
          svg: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="9"/>
            </svg>
          ),
          style: { top: '25%', left: '3%' }
        },
        {
          id: 'side-plus-purple',
          className: 'parallax-shape shape-plus-purple',
          parallaxSpeed: -0.15,
          color: '#a855f7',
          svg: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          ),
          style: { top: '70%', right: '4%' }
        },
        {
          id: 'side-triangle-rose',
          className: 'parallax-shape shape-triangle-rose',
          parallaxSpeed: 0.18,
          color: '#f43f5e',
          svg: (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 22H22L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          style: { top: '45%', right: '2%' }
        }
      ];
    }
    return [];
  };

  const shapes = getShapes();

  return (
    <div className="parallax-shapes-container" aria-hidden="true">
      {/* Background soft glowing blobs (Fintech Premium styling) */}
      <div className={`parallax-glow-blob blob-left-${preset}`} />
      <div className={`parallax-glow-blob blob-right-${preset}`} />

      {/* Map through SVGs and apply scroll offset */}
      {shapes.map((shape) => {
        const offset = scrollY * shape.parallaxSpeed;
        
        // Extract individual class names to decouple positioning and rotation
        const classes = shape.className.split(' ');
        const specificClass = classes.find(c => c !== 'parallax-shape');

        return (
          <div
            key={shape.id}
            className="parallax-shape"
            style={{
              ...shape.style,
              color: shape.color,
              transform: `translateY(${offset}px) translateZ(0)`
            }}
          >
            <div className={`parallax-shape-inner ${specificClass}`} style={{ color: 'inherit' }}>
              {shape.svg}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ParallaxShapes;
