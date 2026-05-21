"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, Wrench, Building2, FastForward, GraduationCap, Heart, Stethoscope } from 'lucide-react';
import { cn } from '../../../lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const features = [
  {
    tempId: 0,
    title: "Instant Loan for Financial Shortfalls",
    description: "When faced with an unforeseen financial crunch and multiple obligations, our instant loans can provide the necessary relief. With quick disbursal and competitive interest rates, our loans are an excellent solution when waiting for funds is not an option.",
    icon: Briefcase
  },
  {
    tempId: 1,
    title: "Instant Loan for Home Repairs",
    description: "There are times when urgent home repairs are necessary, whether it's fixing leaky walls, repairing the roof, addressing damage from external factors, or exceeding your planned budget. In such cases, you can apply for an instant personal loan to cover these unexpected expenses.",
    icon: Wrench
  },
  {
    tempId: 2,
    title: "Instant Loan for Emergencies",
    description: "Medical emergencies can occur unexpectedly, making it crucial to have immediate financial support. Our instant personal loans can help cover urgent medical costs, such as hospitalization or surgical procedures. They are also beneficial in scenarios where cashless claims are unavailable or when there is a shortfall in your insurance coverage.",
    icon: Building2
  },
  {
    tempId: 3,
    title: "Instant Loan for Relocation",
    description: "The need to relocate to a different city can arise suddenly, often accompanied by various expenses, including hiring packers and movers, securing temporary accommodation, and paying rental deposits. Our instant loans can help you manage all these costs effectively.",
    icon: FastForward
  },
  {
    tempId: 4,
    title: "Instant Loan for Medical Bills",
    description: "Health emergencies shouldn't drain your savings. Whether it's a planned surgery, unexpected medical bills, or medication costs, our instant loans ensure that you get the care you need without worrying about finances.",
    icon: Stethoscope
  },
  {
    tempId: 5,
    title: "Instant Loan for Weddings",
    description: "Make your dream wedding a reality without compromising on the details. From booking the perfect venue to catering and decorations, an instant loan provides the financial flexibility you need for your special day.",
    icon: Heart
  },
  {
    tempId: 6,
    title: "Instant Loan for Education",
    description: "Invest in your future with our education loans. Whether it's for higher studies, professional certifications, or skill development courses, we provide quick financial support to help you achieve your academic goals.",
    icon: GraduationCap
  }
];

interface FeatureCardProps {
  position: number;
  feature: typeof features[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  position, 
  feature, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;
  const IconComponent = feature.icon;
  const clipCorner = Math.max(20, cardSize * 0.12);

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 transition-all duration-500 ease-in-out flex flex-col items-center text-center",
        isCenter 
          ? "z-10 bg-[#E6F0FA] text-primary border-primary" 
          : "z-0 bg-card text-card-foreground border-border"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        padding: Math.max(16, cardSize * 0.07),
        clipPath: `polygon(${clipCorner}px 0%, calc(100% - ${clipCorner}px) 0%, 100% ${clipCorner}px, 100% 100%, calc(100% - ${clipCorner}px) 100%, ${clipCorner}px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -40 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
          scale(${isCenter ? 1 : Math.abs(position) === 1 ? 0.88 : 0.75})
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent",
        opacity: isCenter ? 1 : Math.abs(position) === 1 ? 0.5 : 0,
        pointerEvents: isCenter ? 'auto' : 'none',
        zIndex: isCenter ? 10 : Math.abs(position) === 1 ? 5 : 0,
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: clipCorner,
          width: SQRT_5000,
          height: 2
        }}
      />
      <div className={cn(
        "flex items-center justify-center",
        isCenter ? "text-primary" : "text-foreground"
      )}
        style={{ marginBottom: Math.max(12, cardSize * 0.05) }}
      >
        <IconComponent size={Math.max(24, cardSize * 0.1)} strokeWidth={1.5} />
      </div>
      <h3
        className={cn(
          "font-bold leading-snug",
          isCenter ? "text-primary" : "text-foreground"
        )}
        style={{
          fontSize: Math.max(14, cardSize * 0.05),
          marginBottom: Math.max(8, cardSize * 0.03)
        }}
      >
        {feature.title}
      </h3>
      <p
        className={cn(
          "leading-relaxed",
          isCenter ? "text-primary/90" : "text-muted-foreground"
        )}
        style={{ fontSize: Math.max(11, cardSize * 0.036) }}
      >
        {feature.description}
      </p>
    </div>
  );
};

const getCardSize = (width: number) => {
  if (width < 360) return Math.min(width - 32, 260);   // tiny phones
  if (width < 480) return Math.min(width - 32, 300);   // small phones
  if (width < 640) return Math.min(width - 48, 340);   // phones
  if (width < 768) return 360;                          // large phones / small tablets
  if (width < 1024) return 380;                         // tablets
  return 420;                                           // desktop
};

const getContainerHeight = (cardSize: number) => cardSize + 120;

export const StaggerFeatures: React.FC = () => {
  const [cardSize, setCardSize] = useState(420);
  const [featuresList, setFeaturesList] = useState(features);

  const updateSize = useCallback(() => {
    setCardSize(getCardSize(window.innerWidth));
  }, []);

  const handleMove = (steps: number) => {
    const newList = [...featuresList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setFeaturesList(newList);
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  const containerHeight = getContainerHeight(cardSize);

  return (
    <div
      className="w-full flex flex-col items-center justify-center py-10 md:py-16"
      style={{ background: 'linear-gradient(180deg, #F4F9FF 0%, #E6F0FA 100%)' }}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-foreground px-4">
        Use Your Loan for Anything
      </h2>

      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: containerHeight, width: '100%', maxWidth: '100vw' }}
      >
        {featuresList.map((feature, index) => {
          const position = index - Math.floor(featuresList.length / 2);
          return (
            <FeatureCard
              key={feature.tempId}
              feature={feature}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          );
        })}

        {/* Nav buttons — positioned below the card */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-4"
          style={{ bottom: 16 }}
        >
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-colors",
              "bg-white border border-border text-foreground shadow-sm",
              "hover:bg-primary hover:text-white hover:border-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label="Previous feature"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-colors",
              "bg-white border border-border text-foreground shadow-sm",
              "hover:bg-primary hover:text-white hover:border-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label="Next feature"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
