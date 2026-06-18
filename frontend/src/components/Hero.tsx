import React from 'react';
import { Calendar, CheckCircle2, HeartPulse, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Language, translations } from '../utils/translations';


interface HeroProps {
  language: Language;
  onOpenAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onOpenAppointment }) => {
  const t = translations[language];

  return (
    <section 
      id="home" 
      style={{
        padding: '140px 0 90px 0',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(224, 242, 254, 0.4) 0%, rgba(248, 250, 252, 0.8) 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Floating Blobs */}
      <div className="floating-blob blob-cyan" />
      <div className="floating-blob blob-blue" />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          gap: '48px'
        }} className="hero-grid">
          
          {/* Left Text Block */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Tagline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: 'rgba(2, 132, 199, 0.08)',
                color: 'var(--med-blue)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: '1px solid rgba(2, 132, 199, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <HeartPulse size={14} style={{ color: 'var(--cyan)' }} />
                {t.certifiedTag}
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: '3.3rem',
              color: 'var(--primary)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1px'
            }} className="hero-headline">
              {t.heroTitleFirst} <span className="text-gradient">{t.heroTitleSecond}</span> & {t.heroTitleThird} <span className="text-gradient">{t.heroTitleFourth}</span>
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '540px'
            }}>
              {t.heroDesc}
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }} className="hero-btns">
              <button 
                onClick={onOpenAppointment}
                className="btn btn-primary"
                style={{ padding: '14px 28px', gap: '8px', fontSize: '0.95rem' }}
              >
                <Calendar size={18} /> {t.bookAppointment}
              </button>
            </div>

            {/* Benefits Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginTop: '16px'
            }} className="hero-benefits">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.heroBenefitBeds}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} style={{ color: 'var(--cyan)' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.heroBenefitCashless}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Graphics Block */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            className="hero-graphics-container"
          >
            {/* Visual Frame wrapper */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              aspectRatio: '0.95',
              borderRadius: 'var(--radius-xl)',
              background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
              padding: '12px'
            }}>
              {/* Doctor Main Image */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid rgba(255,255,255,0.7)',
                position: 'relative'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=700" 
                  alt="Specialist Doctor Consulting" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(360deg, rgba(15, 23, 42, 0.4) 0%, transparent 60%)'
                }} />
              </div>

              {/* Float Widget 1: Lab Speed */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '15%',
                  left: '-15%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{
                  background: 'var(--cyan-light)',
                  color: 'var(--cyan-hover)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Activity size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.heroWidgetCapacity}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{t.heroWidgetBeds}</div>
                </div>
              </motion.div>

              {/* Float Widget 2: Security */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  bottom: '12%',
                  right: '-10%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{
                  background: 'var(--med-blue-light)',
                  color: 'var(--med-blue)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.heroWidgetSchemes}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{t.heroWidgetPmjay}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Global CSS adjustments for Hero responsive sizing */}
      <style>{`
        @media (max-width: 991px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .hero-headline {
            font-size: 2.3rem !important;
          }
          .hero-btns, .hero-benefits {
            justify-content: center !important;
          }
          .hero-benefits {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
          }
          .hero-graphics-container {
            margin-top: 24px;
          }
        }
        @media (max-width: 576px) {
          .hero-headline {
            font-size: 1.95rem !important;
          }
          .glass-panel {
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </section>
  );
};
