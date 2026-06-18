import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Language, translations } from '../utils/translations';
import { testimonialsApi } from '../services/api';

interface TestimonialsProps {
  language: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ language }) => {
  const t = translations[language];

  const staticReviews = [
    {
      name: t.rev1Name,
      role: t.rev1Role,
      rating: 5,
      comment: t.rev1Comment,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: t.rev2Name,
      role: t.rev2Role,
      rating: 5,
      comment: t.rev2Comment,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
    },
    {
      name: t.rev3Name,
      role: t.rev3Role,
      rating: 5,
      comment: t.rev3Comment,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
    }
  ];

  const [dbReviews, setDbReviews] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await testimonialsApi.getAll();
        if (res.success && res.testimonials.length > 0) {
          const mapped = res.testimonials.map((item: any) => ({
            name: item.patientName,
            role: language === 'en' ? 'Verified Patient' : 'सत्यापित रुग्ण',
            rating: item.rating || 5,
            comment: item.feedback,
            image: item.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
          }));
          setDbReviews(mapped);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    };
    fetchTestimonials();
  }, [language]);

  const displayReviews = dbReviews.length > 0 ? dbReviews : staticReviews;

  // Auto scroll testimonials
  useEffect(() => {
    if (displayReviews.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayReviews.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [displayReviews.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayReviews.length);
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
          <span className="section-tag">{t.testimonialsTag}</span>
          <h2 className="section-title">{t.testimonialsTitle}</h2>
          <p className="section-desc">
            {t.testimonialsDesc}
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
                {displayReviews[activeIndex] && [...Array(displayReviews[activeIndex].rating)].map((_, i) => (
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
                "{displayReviews[activeIndex]?.comment}"
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
                    src={displayReviews[activeIndex]?.image} 
                    alt={displayReviews[activeIndex]?.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {displayReviews[activeIndex]?.name}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--med-blue)', fontWeight: 600 }}>
                    {displayReviews[activeIndex]?.role}
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
          {displayReviews.map((_, index) => (
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
