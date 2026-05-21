import React from 'react';
import { motion } from 'motion/react';
import './Testimonials.css';

const testimonials = [
  {
    text: "LendoGo made getting a personal loan so simple. The entire process was online and the funds were in my account within hours!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Briana Patton",
    role: "Small Business Owner",
  },
  {
    text: "The interest rates are incredibly competitive. I managed to consolidate my debt easily thanks to their transparent terms.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Bilal Ahmed",
    role: "Software Engineer",
  },
  {
    text: "I loved how quick the approval process was. The app interface is super user-friendly and customer support was always there to help.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Saman Malik",
    role: "Marketing Specialist",
  },
  {
    text: "Best loan experience I've had. No hidden fees, clear communication, and a seamless digital journey.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Omar Raza",
    role: "Freelance Designer",
  },
  {
    text: "LendoGo's flexible repayment options took a huge weight off my shoulders. Highly recommend for quick financial support.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    name: "Zainab Hussain",
    role: "Teacher",
  },
  {
    text: "I needed funds for a medical emergency and LendoGo delivered instantly. Truly a lifesaver with minimal documentation.",
    image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face",
    name: "Aliza Khan",
    role: "Nurse",
  },
  {
    text: "The personal loan I got helped me renovate my home. The whole application took just a few minutes.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Farhan Siddiqui",
    role: "Architect",
  },
  {
    text: "I've tried other lenders before, but LendoGo is unmatched in speed and transparency. Customer service is top-notch.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Sana Sheikh",
    role: "Sales Executive",
  },
  {
    text: "Applying for a loan used to be a hassle. LendoGo revolutionized it for me. Quick, secure, and highly reliable.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    name: "Hassan Ali",
    role: "Entrepreneur",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props) => {
  return (
    <div className={`testimonials-column ${props.className || ''}`}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="testimonials-column-inner"
      >
        {[...new Array(2).fill(0)].map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-text">{text}</div>
                <div className="testimonial-author">
                  <img src={image} alt={name} className="testimonial-image" />
                  <div className="testimonial-author-info">
                    <div className="testimonial-name">{name}</div>
                    <div className="testimonial-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="testimonials-section relative">
      <div className="testimonials-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="testimonials-header"
        >
          <div className="testimonials-badge-wrapper">
            <div className="testimonials-badge">Testimonials</div>
          </div>
          <h2 className="testimonials-title">What our users say</h2>
          <p className="testimonials-subtitle">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="testimonials-columns-wrapper">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden-md" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden-lg" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
