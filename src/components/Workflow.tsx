import React from 'react';
import { ClipboardList, Droplet, Microscope, ShieldCheck, FileCheck, Send, ArrowRight, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const Workflow: React.FC = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Patient Registration',
      desc: 'Book online or walk in. Quick profile setup and test configuration.',
      stepNum: '01'
    },
    {
      icon: Droplet,
      title: 'Sample Collection',
      desc: 'Quick, painless blood withdrawal or swab test by certified specialists.',
      stepNum: '02'
    },
    {
      icon: Microscope,
      title: 'Lab Processing',
      desc: 'Samples barcoded and loaded into state-of-the-art automated analysers.',
      stepNum: '03'
    },
    {
      icon: ShieldCheck,
      title: 'Verification',
      desc: 'Pathologists audit the values against strict controls.',
      stepNum: '04'
    },
    {
      icon: FileCheck,
      title: 'Final Approval',
      desc: 'Clinicians sign off on verified findings. Report is digitally generated.',
      stepNum: '05'
    },
    {
      icon: Send,
      title: 'Digital Delivery',
      desc: 'SMS notification and email dispatch with PDF download link.',
      stepNum: '06'
    }
  ];

  return (
    <section 
      id="workflow" 
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, rgba(240, 249, 255, 0.5) 0%, rgba(248, 250, 252, 0.8) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">THE PROCESS</span>
          <h2 className="section-title">Our Smart Diagnostic Timeline</h2>
          <p className="section-desc">
            How your samples travel from collection to certified digital results. Efficiency and accuracy built into every step.
          </p>
        </div>

        {/* Steps Timeline Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '20px',
          position: 'relative'
        }} className="workflow-timeline-grid">
          
          {/* Horizontal Line Connector (Desktop only) */}
          <div style={{
            position: 'absolute',
            top: '45px',
            left: '8%',
            right: '8%',
            height: '2px',
            background: 'linear-gradient(90deg, var(--med-blue) 0%, var(--cyan) 100%)',
            opacity: 0.15,
            zIndex: 0
          }} className="desktop-timeline-line" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10
                  }}
                  className="workflow-step-item"
                >
                  {/* Step Bubble Icon */}
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'var(--white)',
                    border: '3px solid var(--white)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--med-blue)',
                    marginBottom: '20px',
                    position: 'relative',
                    transition: 'all var(--transition-normal)'
                  }} className="workflow-icon-bubble">
                    <Icon size={28} />
                    
                    {/* Number Badge */}
                    <span style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(6, 182, 212, 0.3)'
                    }}>
                      {step.stepNum}
                    </span>
                  </div>

                  {/* Text Details */}
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--primary)' }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, maxWidth: '170px' }}>
                    {step.desc}
                  </p>

                  {/* Desktop Step arrow indicator (except last step) */}
                  {index < steps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '40px',
                      right: '-16px',
                      color: 'var(--cyan)',
                      opacity: 0.4,
                      zIndex: 20
                    }} className="desktop-connector-arrow">
                      <ArrowRight size={18} />
                    </div>
                  )}

                  {/* Mobile Step arrow indicator */}
                  {index < steps.length - 1 && (
                    <div style={{
                      display: 'none',
                      margin: '16px 0',
                      color: 'var(--med-blue)'
                    }} className="mobile-connector-arrow">
                      <ArrowDown size={20} />
                    </div>
                  )}
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <style>{`
        .workflow-step-item:hover .workflow-icon-bubble {
          color: var(--cyan) !important;
          transform: scale(1.08);
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.25) !important;
          border-color: var(--cyan-light) !important;
        }
        @media (max-width: 991px) {
          .workflow-timeline-grid {
            grid-template-columns: 1fr !important;
            gap: 0px !important;
          }
          .desktop-timeline-line, .desktop-connector-arrow {
            display: none !important;
          }
          .mobile-connector-arrow {
            display: block !important;
          }
          .workflow-step-item {
            margin-bottom: 8px;
          }
          .workflow-step-item p {
            max-width: 280px !important;
          }
        }
      `}</style>
    </section>
  );
};
