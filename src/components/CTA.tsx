import React from 'react';
import { Calendar, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

interface CTAProps {
  onOpenAppointment: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenAppointment }) => {
  return (
    <section 
      style={{
        padding: '80px 0',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7 }}
          className="glass-panel"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--med-blue-hover) 100%)',
            padding: '60px 40px',
            borderRadius: 'var(--radius-xl)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Subtle light blobs */}
          <div style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            background: 'var(--cyan)',
            filter: 'blur(100px)',
            opacity: 0.25,
            top: '-50px',
            left: '-50px',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            width: '260px',
            height: '260px',
            background: 'var(--med-blue)',
            filter: 'blur(100px)',
            opacity: 0.25,
            bottom: '-50px',
            right: '-50px',
            pointerEvents: 'none'
          }} />

          {/* Icon alert */}
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            color: 'var(--cyan)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <ShieldAlert size={14} />
            Prioritize Preventative Health Packages
          </div>

          <h2 style={{
            fontSize: '2.5rem',
            color: 'var(--white)',
            fontWeight: 800,
            maxWidth: '620px',
            lineHeight: 1.25
          }} className="cta-title">
            Take Charge of Your Health & Wellness Today
          </h2>

          <p style={{
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '540px',
            fontSize: '1.05rem',
            lineHeight: 1.6
          }}>
            Schedule your laboratory diagnostics, radiology bookings, or routine checkups with our certified clinical experts. Receive smart, actionable reports directly on your device.
          </p>

          <button
            onClick={onOpenAppointment}
            className="btn btn-primary cta-btn-hover"
            style={{
              background: 'var(--white)',
              color: 'var(--primary)',
              padding: '14px 32px',
              fontSize: '1rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              border: '1px solid var(--white)'
            }}
          >
            <Calendar size={18} /> Schedule Appointment Now
          </button>
        </motion.div>
      </div>

      <style>{`
        .cta-btn-hover {
          transition: all var(--transition-normal);
        }
        .cta-btn-hover:hover {
          background: var(--med-blue-light) !important;
          color: var(--med-blue) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(2, 132, 199, 0.3) !important;
        }
        @media (max-width: 768px) {
          .cta-title {
            font-size: 1.85rem !important;
          }
          .glass-panel {
            padding: 40px 20px !important;
          }
        }
      `}</style>
    </section>
  );
};
