import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Eleanor Vance',
      role: 'Chronic Health Program',
      rating: 5,
      comment: 'The home sample collection service was exceptionally professional. The phlebotomist arrived on time, was extremely gentle, and I received my diagnostic blood panel online in just under 6 hours!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Marcus Brody',
      role: 'Executive Fitness Checkup',
      rating: 5,
      comment: 'Entering my security code in the patient portal loaded an incredibly detailed dashboard of my lipid and blood levels. The slider visualizer charts made it simple to understand which values needed exercise changes.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: 'Dr. Clara Sterling',
      role: 'External Physician Partner',
      rating: 5,
      comment: 'As a private consultant, I require high precision from partner laboratories. Aura Clinic provides outstanding radiology accuracy, consistent calibrations, and swift service which my patients value greatly.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section 
      id="testimonials" 
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(224, 242, 254, 0.3) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">TESTIMONIALS</span>
          <h2 className="section-title">What Our Patients Say About Us</h2>
          <p className="section-desc">
            Read stories of reliable healthcare experience, swift digital deliveries, and patient-first diagnostics.
          </p>
        </div>

        {/* Carousel Block */}
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          position: 'relative',
          padding: '0 40px'
        }} className="carousel-wrapper">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="glass-panel"
              style={{
                padding: '40px 48px',
                background: 'var(--white)',
                border: '1px solid rgba(2, 132, 199, 0.06)',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              {/* Quote Mark */}
              <Quote size={56} style={{
                position: 'absolute',
                top: '24px',
                right: '32px',
                color: 'rgba(2, 132, 199, 0.05)',
                pointerEvents: 'none'
              }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: '4px', color: '#fbbf24' }}>
                {[...Array(reviews[activeIndex].rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#fbbf24" stroke="none" />
                ))}
              </div>

              {/* Text */}
              <p style={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontStyle: 'italic'
              }}>
                "{reviews[activeIndex].comment}"
              </p>

              {/* Patient Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--white)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  <img 
                    src={reviews[activeIndex].image} 
                    alt={reviews[activeIndex].name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {reviews[activeIndex].name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--med-blue)', fontWeight: 600 }}>
                    {reviews[activeIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          <button 
            onClick={handlePrev}
            style={{
              position: 'absolute',
              left: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--white)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-primary)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)',
              zIndex: 30
            }}
            className="carousel-nav-btn"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            style={{
              position: 'absolute',
              right: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--white)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-primary)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-fast)',
              zIndex: 30
            }}
            className="carousel-nav-btn"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Indicator dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '28px'
        }}>
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                width: activeIndex === index ? '28px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                background: activeIndex === index ? 'var(--med-blue)' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .carousel-nav-btn:hover {
          background: var(--med-blue) !important;
          color: var(--white) !important;
          border-color: var(--med-blue) !important;
        }
        @media (max-width: 768px) {
          .carousel-wrapper {
            padding: 0 10px !important;
          }
          .carousel-nav-btn {
            display: none !important;
          }
          .glass-panel {
            padding: 30px 24px !important;
          }
        }
      `}</style>
    </section>
  );
};
