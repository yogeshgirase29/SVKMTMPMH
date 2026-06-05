import React from 'react';
import { Mail, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const Twitter = ({ size, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || "1.2em"} height={size || "1.2em"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Linkedin = ({ size, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || "1.2em"} height={size || "1.2em"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export const Doctors: React.FC = () => {
  const doctorsData = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Medical Superintendent & Chief Surgeon',
      experience: '16 Years Experience',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
      socials: { twitter: '#', linkedin: '#', email: 'mailto:ms@tmpmhospital.svkm.ac.in' }
    },
    {
      name: 'Dr. Robert Chen',
      role: 'Professor & Head of Radiology',
      experience: '14 Years Experience',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
      socials: { twitter: '#', linkedin: '#', email: 'mailto:radiology@tmpmhospital.svkm.ac.in' }
    },
    {
      name: 'Dr. Emily Taylor',
      role: 'HOD of Laboratory Diagnostics',
      experience: '12 Years Experience',
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
      socials: { twitter: '#', linkedin: '#', email: 'mailto:pathology@tmpmhospital.svkm.ac.in' }
    },
    {
      name: 'Dr. Michael Stone',
      role: 'Chief of ICU & Critical Care',
      experience: '15 Years Experience',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      socials: { twitter: '#', linkedin: '#', email: 'mailto:icu@tmpmhospital.svkm.ac.in' }
    }
  ];

  return (
    <section 
      id="doctors" 
      style={{
        padding: '100px 0',
        background: 'var(--white)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">OUR SPECIALISTS</span>
          <h2 className="section-title">Meet Our Medical Directors & Experts</h2>
          <p className="section-desc">
            Consult with our NABL-certified laboratory directors and clinical practitioners for specialized health opinions.
          </p>
        </div>

        {/* Doctors Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px'
        }} className="doctors-grid">
          {doctorsData.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="glass-panel doctor-card"
              style={{
                padding: '16px',
                background: 'var(--white)',
                border: '1px solid rgba(2, 132, 199, 0.05)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              {/* Doctor Image Block */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '0.92',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '18px',
                background: 'var(--bg-primary)'
              }}>
                <img 
                  src={doc.image} 
                  alt={doc.name} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Social Overlay on Hover */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%) y(10px)',
                  display: 'flex',
                  gap: '10px',
                  opacity: 0,
                  transition: 'all var(--transition-normal)'
                }} className="doctor-social-bar">
                  <a href={doc.socials.twitter} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: 'var(--med-blue)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <Twitter size={16} />
                  </a>
                  <a href={doc.socials.linkedin} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: 'var(--med-blue)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <Linkedin size={16} />
                  </a>
                  <a href={doc.socials.email} style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: 'var(--med-blue)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <Mail size={16} />
                  </a>
                </div>
              </div>

              {/* Doctor Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 700 }}>
                  {doc.name}
                </h3>
                <div style={{ color: 'var(--med-blue)', fontWeight: 600, fontSize: '0.88rem' }}>
                  {doc.role}
                </div>
                
                {/* Exp Tag */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginTop: '8px',
                  background: 'var(--bg-primary)',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  width: 'fit-content'
                }}>
                  <Award size={14} style={{ color: 'var(--cyan)' }} />
                  <span>{doc.experience}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .doctor-card {
          transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
        }
        .doctor-card:hover {
          border-color: rgba(2, 132, 199, 0.12) !important;
          box-shadow: var(--shadow-xl) !important;
        }
        .doctor-card:hover .doctor-social-bar {
          opacity: 1 !important;
          transform: translate(-50%, 0px) !important;
        }
        @media (max-width: 576px) {
          .doctors-grid {
            grid-template-columns: 1fr !important;
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};
