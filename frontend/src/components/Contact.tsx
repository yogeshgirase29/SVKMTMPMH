import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { type Language, translations } from '../utils/translations';
import { contactsApi } from '../services/api';

interface ContactProps {
  language: Language;
}

export const Contact: React.FC<ContactProps> = ({ language }) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) {
      setErrorMsg(language === 'en' ? 'Please fill in all mandatory fields.' : 'कृपया सर्व आवश्यक फील्ड भरा.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await contactsApi.create(formData);
      if (res.success) {
        setIsSubmitted(true);
        setFormData({ name: '', mobile: '', email: '', message: '' });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || 
        (language === 'en' ? 'Submission failed. Please check connection.' : 'सबमिशन अयशस्वी. कृपया कनेक्शन तपासा.')
      );
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t.contactLoc,
      details: t.contactLocDet
    },
    {
      icon: Phone,
      title: t.contactPhone,
      details: t.contactPhoneDet
    },
    {
      icon: Mail,
      title: t.contactEmail,
      details: t.contactEmailDet
    },
    {
      icon: Clock,
      title: t.contactHours,
      details: t.contactHoursDet
    }
  ];

  return (
    <section 
      id="contact" 
      style={{
        padding: '100px 0',
        background: 'var(--white)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">{t.contactTag}</span>
          <h2 className="section-title">{t.contactTitle}</h2>
          <p className="section-desc">
            {t.contactDesc}
          </p>
        </div>

        {/* Contact Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1.2fr',
          gap: '40px',
          alignItems: 'stretch'
        }} className="contact-grid">
          
          {/* Left Block: Info & Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} className="contact-info-block">
            {/* Info cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '20px'
            }}>
              {contactInfo.map((info, idx) => {
                const Icon = info.icon;
                return (
                  <div key={idx} className="glass-panel" style={{
                    padding: '20px',
                    display: 'flex',
                    gap: '14px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-muted)',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      background: 'var(--med-blue-light)',
                      color: 'var(--med-blue)',
                      padding: '8px',
                      borderRadius: '8px',
                      display: 'flex',
                      flexShrink: 0
                    }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                        {info.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {info.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Embedded Google Map Frame */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-muted)',
              flexGrow: 1,
              minHeight: '260px',
              position: 'relative'
            }}>
              <iframe 
                title="SVKM Tapanbhai Mukeshbhai Patel Hospital Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3715.4206584285705!2d74.88607147589255!3d21.363406380369804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd8a9582d921b71%3A0xe54d6fa7c6d66e7!2sSVKM's%20Tapanbhai%20Mukeshbhai%20Patel%20Memorial%20Hospital%20%26%20Research%20Centre!5e0!3m2!1sen!2sin!4v1717618239010!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '260px', display: 'block' }} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Block: Message Form */}
          <div className="glass-panel" style={{
            padding: '36px',
            background: 'var(--white)',
            border: '1px solid rgba(2, 132, 199, 0.08)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                  {t.formTitle}
                </h3>
                
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.formName}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-muted)',
                      fontSize: '0.92rem'
                    }}
                    className="form-input"
                  />
                </div>

                {/* Mobile */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Mobile Number *' : 'मोबाईल नंबर *'}
                  </label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. +91 99693 79023"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-muted)',
                      fontSize: '0.92rem'
                    }}
                    className="form-input"
                  />
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Email Address' : 'ईमेल पत्ता'}
                  </label>
                  <input 
                    type="email" 
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-muted)',
                      fontSize: '0.92rem'
                    }}
                    className="form-input"
                  />
                </div>

                {/* Message */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.formMessage}</label>
                  <textarea 
                    rows={4}
                    required 
                    placeholder={t.formMessagePlaceholder}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-muted)',
                      fontSize: '0.92rem',
                      resize: 'none'
                    }}
                    className="form-input"
                  />
                </div>

                {/* Error Prompt */}
                {errorMsg && (
                  <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', height: '48px', gap: '8px', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Send size={16} /> {loading ? (language === 'en' ? 'Sending...' : 'पाठवत आहे...') : t.formSubmit}
                </button>
              </form>
            ) : (
              /* Success alert */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '40px 10px',
                  height: '100%'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  color: 'var(--med-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>{t.formSuccessTitle}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '300px', marginBottom: '24px' }}>
                  {t.formSuccessDesc}
                </p>
                <button onClick={() => setIsSubmitted(false)} className="btn btn-secondary" style={{ width: '140px' }}>
                  {t.formSuccessBtn}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .form-input {
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .form-input:focus {
          border-color: var(--med-blue) !important;
          box-shadow: 0 0 0 3px var(--med-blue-glow) !important;
        }
        @media (max-width: 991px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  );
};
