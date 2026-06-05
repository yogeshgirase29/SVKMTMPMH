import React from 'react';
import { Target, Zap, Cpu, Award, FileCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'SVKM Legacy of Trust',
      desc: 'Backed by the Shri Vile Parle Kelavani Mandal, a premier trust with a history of clinical and academic excellence.'
    },
    {
      icon: Zap,
      title: 'Regional Accessibility',
      desc: 'Located in Shirpur, serving Nandurbar, Dhule, Jalgaon, and neighboring regions, eliminating metro travels.'
    },
    {
      icon: Cpu,
      title: 'Advanced Medical Infrastructure',
      desc: 'Built with international standards, featuring advanced Siemens & GE diagnostic imaging and multi-slice CT/MRI.'
    },
    {
      icon: Award,
      title: 'Integrated Teaching Hospital',
      desc: 'Facilitates a highly skilled panel of professors, resident doctors, and clinical researchers working in unison.'
    },
    {
      icon: FileCheck,
      title: 'PMJAY Cashless Schemes',
      desc: 'Empanelled under Ayushman Bharat (PMJAY) and Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY).'
    },
    {
      icon: Heart,
      title: 'Patient-Centered ICU Care',
      desc: 'Equipped with North Maharashtra\'s largest ICU ward, offering high-fidelity critical care monitoring 24/7.'
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
          <span className="section-tag">WHY AURA CLINIC</span>
          <h2 className="section-title">Setting Standards in Diagnostic & Clinical Excellence</h2>
          <p className="section-desc">
            We merge cutting-edge laboratory systems with clinical dedication to offer a patient experience that prioritizes safety and accuracy.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
