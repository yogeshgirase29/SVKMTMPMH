import React from 'react';
import { Target, Zap, Cpu, Award, FileCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Language, translations } from '../utils/translations';


interface WhyChooseUsProps {
  language: Language;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ language }) => {
  const t = translations[language];

  const features = [
    {
      icon: Target,
      title: t.whyTrustTitle,
      desc: t.whyTrustDesc
    },
    {
      icon: Zap,
      title: t.whyAccessTitle,
      desc: t.whyAccessDesc
    },
    {
      icon: Cpu,
      title: t.whyInfraTitle,
      desc: t.whyInfraDesc
    },
    {
      icon: Award,
      title: t.whyTeachingTitle,
      desc: t.whyTeachingDesc
    },
    {
      icon: FileCheck,
      title: t.whyPmjayTitle,
      desc: t.whyPmjayDesc
    },
    {
      icon: Heart,
      title: t.whyIcuTitle,
      desc: t.whyIcuDesc
    }
  ];

  return (
    <section 
      id="why-us" 
      style={{
        padding: '100px 0',
        background: 'var(--white)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">{t.whyTag}</span>
          <h2 className="section-title">{t.whyTitle}</h2>
          <p className="section-desc">
            {t.whyDesc}
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }} className="why-us-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="glass-panel why-us-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start',
                  border: '1px solid rgba(2, 132, 199, 0.04)',
                  background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Icon wrapper */}
                <div style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(6, 182, 212, 0.2)',
                  flexShrink: 0
                }}>
                  <Icon size={22} />
                </div>

                {/* Text content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .why-us-card {
          transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
        }
        .why-us-card:hover {
          border-color: rgba(6, 182, 212, 0.25) !important;
          box-shadow: var(--shadow-md) !important;
        }
      `}</style>
    </section>
  );
};
