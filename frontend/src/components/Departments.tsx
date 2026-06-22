import React, { useState, useEffect } from 'react';
import { Heart, Camera, FlaskConical, Baby, Bone, Activity, Stethoscope, Brain, Eye, Shield, Droplet, Ear, Scissors, Syringe, Sparkles, HeartPulse, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Language } from '../utils/translations';
import { departmentsApi } from '../services/api';

interface DepartmentsProps {
  language: Language;
}

const localT = {
  en: {
    tag: "CLINICAL DEPARTMENTS",
    title: "Our Specialized Medical Departments",
    desc: "Explore our state-of-the-art clinical divisions, equipped with next-generation medical systems and managed by senior resident specialists.",
    viewDoctors: "View Specialists",
    noDepts: "No departments are currently available."
  },
  mr: {
    tag: "वैद्यकीय विभाग",
    title: "आमचे विशेष वैद्यकीय विभाग",
    desc: "अत्याधुनिक वैद्यकीय प्रणालींनी सुसज्ज आणि वरिष्ठ निवासी तज्ज्ञांच्या मार्गदर्शनाखाली चालणाऱ्या आमच्या क्लिनिकल विभागांबद्दल जाणून घ्या.",
    viewDoctors: "तज्ञ डॉक्टर पहा",
    noDepts: "सध्या कोणतेही विभाग उपलब्ध नाहीत."
  }
};

const iconMap: Record<string, React.ComponentType<any>> = {
  Heart,
  Camera,
  FlaskConical,
  Baby,
  Bone,
  Activity,
  Stethoscope,
  Brain,
  Eye,
  Shield,
  Droplet,
  Ear,
  Scissors,
  Syringe,
  Sparkles,
  HeartPulse
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Stethoscope;
};

export const Departments: React.FC<DepartmentsProps> = ({ language }) => {
  const lt = localT[language];
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentsApi.getAll();
        if (res.success) {
          setDepartments(res.departments);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleScrollToDoctors = () => {
    const element = document.querySelector('#doctors');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="departments"
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
          <span className="section-tag">{lt.tag}</span>
          <h2 className="section-title">{lt.title}</h2>
          <p className="section-desc">
            {lt.desc}
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
        ) : departments.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            {lt.noDepts}
          </div>
        ) : (
          /* Departments Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }} className="departments-grid">
            {departments.map((dept, index) => {
              const IconComponent = getIcon(dept.icon);
              return (
                <motion.div
                  key={dept._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-panel department-card"
                  style={{
                    background: 'var(--white)',
                    border: '1px solid rgba(2, 132, 199, 0.05)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Department Image & Floating Icon */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                    background: 'var(--bg-primary)'
                  }}>
                    <img
                      src={dept.image}
                      alt={dept.departmentName?.[language] || dept.departmentName?.en || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                      className="dept-image"
                    />
                    
                    {/* Floating Icon Box */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--med-blue)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-md)',
                      zIndex: 10
                    }}>
                      <IconComponent size={24} />
                    </div>
                  </div>

                  {/* Department Info */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
                        {dept.departmentName?.[language] || dept.departmentName?.en || ''}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {dept.description?.[language] || dept.description?.en || ''}
                      </p>
                    </div>

                    {/* Navigation Link to Doctors */}
                    <button
                      onClick={handleScrollToDoctors}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--med-blue)',
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'color var(--transition-fast)',
                        width: 'fit-content'
                      }}
                      className="dept-link"
                    >
                      <span>{lt.viewDoctors}</span>
                      <ArrowRight size={14} className="arrow-icon" style={{ transition: 'transform 0.2s ease' }} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .department-card:hover {
          border-color: rgba(2, 132, 199, 0.12) !important;
          box-shadow: var(--shadow-xl) !important;
        }
        .department-card:hover .dept-image {
          transform: scale(1.06);
        }
        .department-card:hover .dept-link {
          color: var(--cyan) !important;
        }
        .department-card:hover .arrow-icon {
          transform: translateX(4px);
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 576px) {
          .departments-grid {
            grid-template-columns: 1fr !important;
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};
