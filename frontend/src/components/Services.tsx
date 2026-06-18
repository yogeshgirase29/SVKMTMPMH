import React from 'react';
import { FlaskConical, Scan, HeartPulse, Stethoscope, Droplet, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Language, translations } from '../utils/translations';


interface ServicesProps {
  language: Language;
}

export const Services: React.FC<ServicesProps> = ({ language }) => {
  const t = translations[language];

  const servicesData = [
    {
      icon: FlaskConical,
      title: t.servicePathologyTitle,
      desc: t.servicePathologyDesc,
      color: '#0284c7',
      bgLight: 'rgba(2, 132, 199, 0.05)'
    },
    {
      icon: Scan,
      title: t.serviceRadiologyTitle,
      desc: t.serviceRadiologyDesc,
      color: '#06b6d4',
      bgLight: 'rgba(6, 182, 212, 0.05)'
    },
    {
      icon: HeartPulse,
      title: t.servicePedsTitle,
      desc: t.servicePedsDesc,
      color: '#0d9488',
      bgLight: 'rgba(13, 148, 136, 0.05)'
    },
    {
      icon: Stethoscope,
      title: t.serviceOpdTitle,
      desc: t.serviceOpdDesc,
      color: '#4f46e5',
      bgLight: 'rgba(79, 70, 229, 0.05)'
    },
    {
      icon: Droplet,
      title: t.serviceEmergencyTitle,
      desc: t.serviceEmergencyDesc,
      color: '#db2777',
      bgLight: 'rgba(219, 39, 119, 0.05)'
    },
    {
      icon: FileSpreadsheet,
      title: t.servicePmjayTitle,
      desc: t.servicePmjayDesc,
      color: '#0891b2',
      bgLight: 'rgba(8, 145, 178, 0.05)'
    }
  ];

  return (
    <section 
      id="services" 
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.8) 0%, rgba(240, 249, 255, 0.5) 100%)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">{t.servicesTag}</span>
          <h2 className="section-title">{t.servicesTitle}</h2>
          <p className="section-desc">
            {t.servicesDesc}
          </p>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }} className="services-grid">
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass-panel-blue service-card"
                style={{
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  background: 'var(--white)',
                  border: '1px solid rgba(2, 132, 199, 0.05)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'box-shadow var(--transition-normal), border-color var(--transition-normal)'
                }}
              >
                {/* Icon Circle */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: service.bgLight,
                  color: service.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 12px rgba(255,255,255,0.8)'
                }} className="service-icon-container">
                  <Icon size={28} />
                </div>

                {/* Service Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {service.desc}
                  </p>
                </div>

                {/* Link */}
                <a 
                  href="#contact" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--med-blue)',
                    marginTop: 'auto',
                    width: 'fit-content'
                  }}
                  className="service-link"
                >
                  {t.scheduleService} <ArrowRight size={14} className="service-arrow" style={{ transition: 'transform var(--transition-fast)' }} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .service-card:hover {
          box-shadow: var(--shadow-xl) !important;
          border-color: rgba(2, 132, 199, 0.15) !important;
        }
        .service-card:hover .service-arrow {
          transform: translateX(4px);
        }
        @media (max-width: 576px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
          .service-card {
            padding: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};
