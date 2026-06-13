import React from 'react';
import { motion } from 'motion/react';

/**
 * ScrollReveal Component
 * Wraps children with motion to trigger hardware-accelerated entrance animations
 * when the element scrolls into view.
 */
const ScrollReveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 1.3,
  threshold = 0.1,
  once = false,
  className = '',
  style = {}
}) => {
  const getVariants = () => {
    switch (variant) {
      case 'fade-up':
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fade-down':
        return {
          hidden: { opacity: 0, y: -40 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fade-left':
        return {
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0 }
        };
      case 'fade-right':
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0 }
        };
      case 'zoom-in':
        return {
          hidden: { opacity: 0, scale: 0.92 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'zoom-out':
        return {
          hidden: { opacity: 0, scale: 1.08 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      default:
        return {
          hidden: {},
          visible: {}
        };
    }
  };

  const animVariants = getVariants();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={animVariants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] // Custom ultra-smooth easeOutCubic/easeOutQuart curve
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
