import React from 'react';
import { Mail, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Language, translations } from '../utils/translations';
import { doctorsApi } from '../services/api';


interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const TwitterIcon = ({ size, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || "1.2em"} height={size || "1.2em"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
);

const LinkedinIcon = ({ size, ...props }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || "1.2em"} height={size || "1.2em"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

interface DoctorsProps {
  language: Language;
}

export const Doctors: React.FC<DoctorsProps> = ({ language }) => {
  const t = translations[language];
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorsApi.getAll(true); // Only fetch available doctors
        if (res.success) {
          setDoctors(res.doctors);
        }
      } catch (err) {
        console.error('Failed to load doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const getDoctorRole = (doc: any) => {
    const nameEn = doc.doctorName?.en || '';
    if (nameEn.includes('Sarah Jenkins')) return t.docSarahRole;
    if (nameEn.includes('Robert Chen')) return t.docRobertRole;
    if (nameEn.includes('Emily Taylor')) return t.docEmilyRole;
    if (nameEn.includes('Michael Stone')) return t.docMichaelRole;
    return doc.specialization?.[language] || doc.specialization?.en || '';
  };

  const getDoctorExp = (exp: any) => {
    if (exp && typeof exp === 'object') {
      return exp[language] || exp.en || '';
    }
    return exp || '';
  };

  const getDoctorEmail = (doc: any) => {
    const nameEn = doc.doctorName?.en || '';
    if (nameEn.includes('Sarah Jenkins')) return 'mailto:ms@tmpmhospital.svkm.ac.in';
    if (nameEn.includes('Robert Chen')) return 'mailto:radiology@tmpmhospital.svkm.ac.in';
    if (nameEn.includes('Emily Taylor')) return 'mailto:pathology@tmpmhospital.svkm.ac.in';
    if (nameEn.includes('Michael Stone')) return 'mailto:icu@tmpmhospital.svkm.ac.in';
    return 'mailto:info.tmpmhospital@svkm.ac.in';
  };

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
          <span className="section-tag">{t.doctorsTag}</span>
          <h2 className="section-title">{t.doctorsTitle}</h2>
          <p className="section-desc">
            {t.doctorsDesc}
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(2, 132, 199, 0.15)',
              borderTopColor: 'var(--med-blue)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            {language === 'en' ? 'No doctors are currently available.' : 'सध्या कोणतेही डॉक्टर उपलब्ध नाहीत.'}
          </div>
        ) : (
          /* Doctors Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '30px'
          }} className="doctors-grid">
            {doctors.map((doc, index) => (
              <motion.div
                key={doc._id || index}
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
                    alt={doc.doctorName?.[language] || doc.doctorName?.en || ''}
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
                    <a href="#" style={{
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
                      <TwitterIcon size={16} />
                    </a>
                    <a href="#" style={{
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
                      <LinkedinIcon size={16} />
                    </a>
                    <a href={getDoctorEmail(doc)} style={{
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
                    {doc.doctorName?.[language] || doc.doctorName?.en || ''}
                  </h3>
                  <div style={{ color: 'var(--med-blue)', fontWeight: 600, fontSize: '0.88rem' }}>
                    {getDoctorRole(doc)}
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
                    <span>{getDoctorExp(doc.experience)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
