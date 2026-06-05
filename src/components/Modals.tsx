import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, Download, Search, Lock, AlertCircle, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Language, translations } from '../utils/translations';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AppointmentModal: React.FC<ModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'General Diagnostic',
    doctor: 'Dr. Sarah Jenkins',
    date: '',
    time: '09:00 AM',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const departments = [
    { value: 'General Diagnostic', label: language === 'en' ? 'General Diagnostic' : 'सामान्य निदान (General Diagnostic)' },
    { value: 'Radiology & MRI', label: language === 'en' ? 'Radiology & MRI' : 'रेडिओलॉजी आणि एमआरआय (Radiology & MRI)' },
    { value: 'Cardiology Desk', label: language === 'en' ? 'Cardiology Desk' : 'हृदयरोग विभाग (Cardiology Desk)' },
    { value: 'Pathology Lab', label: language === 'en' ? 'Pathology Lab' : 'पॅथॉलॉजी लॅब (Pathology Lab)' },
    { value: 'Specialist Consultation', label: language === 'en' ? 'Specialist Consultation' : 'तज्ञ सल्ला (Specialist Consultation)' },
    { value: 'Home Sample Collection', label: language === 'en' ? 'Home Sample Collection' : 'घरपोच नमुना संकलन (Home Sample Collection)' }
  ];

  const doctors = [
    { value: 'Dr. Sarah Jenkins', label: language === 'en' ? 'Dr. Sarah Jenkins (Cardiologist)' : 'डॉ. सारा जेन्किन्स (हृदयरोग तज्ञ)' },
    { value: 'Dr. Robert Chen', label: language === 'en' ? 'Dr. Robert Chen (Radiologist)' : 'डॉ. रॉबर्ट चेन (रेडिओलॉजिस्ट)' },
    { value: 'Dr. Emily Taylor', label: language === 'en' ? 'Dr. Emily Taylor (Pathologist)' : 'डॉ. एमिली टेलर (पॅथॉलॉजिस्ट)' },
    { value: 'Dr. Michael Stone', label: language === 'en' ? 'Dr. Michael Stone (Internal Medicine)' : 'डॉ. मायकेल स्टोन (इंटर्नल मेडिसिन)' },
    { value: 'Dr. Alisha Patel', label: language === 'en' ? 'Dr. Alisha Patel (Pediatric Specialist)' : 'डॉ. अलीशा पटेल (बालरोग तज्ञ)' }
  ];

  const times = [
    '09:00 AM', '10:30 AM', '11:45 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) return;
    
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      department: 'General Diagnostic',
      doctor: 'Dr. Sarah Jenkins',
      date: '',
      time: '09:00 AM',
      notes: ''
    });
    setIsSubmitted(false);
    onClose();
  };

  const selectedDoctorLabel = doctors.find(d => d.value === formData.doctor)?.label || formData.doctor;
  const selectedDeptLabel = departments.find(d => d.value === formData.department)?.label || formData.department;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content glass-panel-blue"
            style={{ padding: 0 }}
          >
            {/* Header */}
            <div style={{
              background: 'var(--gradient-primary)',
              padding: '24px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '1.4rem' }}>{t.modalAppTitle}</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginTop: '4px' }}>{t.modalAppSubtitle}</p>
              </div>
              <button 
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-fast)'
                }}
                className="hover-bright"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppName}</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        required
                        placeholder={language === 'en' ? 'John Doe' : 'उदा. जॉन डो'}
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 12px 12px 38px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-muted)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Contact Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppPhone}</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="tel" 
                          required
                          placeholder={language === 'en' ? '+91 99693 79023' : '+९१ ९९६९३ ७९०२३'}
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 12px 12px 38px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-muted)',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppEmail}</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="email" 
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 12px 12px 38px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-muted)',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dropdowns Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppDept}</label>
                      <select 
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-muted)',
                          fontSize: '0.95rem',
                          backgroundColor: 'white'
                        }}
                      >
                        {departments.map(dept => <option key={dept.value} value={dept.value}>{dept.label}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppDoc}</label>
                      <select 
                        value={formData.doctor}
                        onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-muted)',
                          fontSize: '0.95rem',
                          backgroundColor: 'white'
                        }}
                      >
                        {doctors.map(doc => <option key={doc.value} value={doc.value}>{doc.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppDate}</label>
                      <div style={{ position: 'relative' }}>
                        <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="date" 
                          required
                          value={formData.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setFormData({ ...formData, date: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 12px 12px 38px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-muted)',
                            fontSize: '0.95rem'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppSlot}</label>
                      <div style={{ position: 'relative' }}>
                        <Clock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <select 
                          value={formData.time}
                          onChange={e => setFormData({ ...formData, time: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '12px 12px 12px 38px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-muted)',
                            fontSize: '0.95rem',
                            backgroundColor: 'white'
                          }}
                        >
                          {times.map(timeSlot => <option key={timeSlot} value={timeSlot}>{timeSlot}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t.modalAppNotes}</label>
                    <textarea 
                      rows={3}
                      placeholder={t.modalAppNotesPlaceholder}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-muted)',
                        fontSize: '0.95rem',
                        resize: 'none'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '10px', height: '48px' }}
                  >
                    {t.modalAppSubmit}
                  </button>
                </form>
              ) : (
                /* Success Layout */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '30px 10px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#e0f2fe',
                    color: 'var(--med-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t.modalAppSuccess}</h4>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '380px' }}>
                    {language === 'en' ? (
                      <>
                        Thank you, <strong>{formData.name}</strong>. Your appointment has been booked for <strong>{formData.date}</strong> at <strong>{formData.time}</strong> with <strong>{selectedDoctorLabel}</strong>. {t.modalAppSuccessDesc}
                      </>
                    ) : (
                      <>
                        धन्यवाद, <strong>{formData.name}</strong>. आपली अपॉइंटमेंट <strong>{formData.date}</strong> रोजी <strong>{formData.time}</strong> वाजता <strong>{selectedDoctorLabel}</strong> यांच्यासोबत बुक झाली आहे. {t.modalAppSuccessDesc}
                      </>
                    )}
                  </p>

                  <div className="glass-panel" style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(2, 132, 199, 0.03)',
                    border: '1px dashed rgba(2, 132, 199, 0.2)',
                    textAlign: 'left',
                    marginBottom: '30px'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{t.modalReceipt}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.9rem' }}>
                      <div><strong>{t.modalBookingRef}:</strong> #SVKM-{Math.floor(100000 + Math.random() * 900000)}</div>
                      <div><strong>{language === 'en' ? 'Dept' : 'विभाग'}:</strong> {selectedDeptLabel}</div>
                      <div><strong>{language === 'en' ? 'Phone' : 'फोन'}:</strong> {formData.phone}</div>
                      <div><strong>{t.modalStatus}:</strong> <span style={{ color: '#0d9488', fontWeight: 600 }}>{t.modalConfirmed}</span></div>
                    </div>
                  </div>

                  <button 
                    onClick={handleReset}
                    className="btn btn-secondary"
                    style={{ width: '150px' }}
                  >
                    {t.modalClose}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ReportModal: React.FC<ModalProps> = ({ isOpen, onClose, language }) => {
  const t = translations[language];

  const [reportCode, setReportCode] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'success' | 'failed'>('idle');
  const [retrievedReport, setRetrievedReport] = useState<any>(null);

  const getMetricName = (name: string, lang: Language) => {
    if (lang === 'en') return name;
    const dict: Record<string, string> = {
      'Hemoglobin': 'हिमोग्लोबिन',
      'Total Cholesterol': 'एकूण कोलेस्ट्रॉल',
      'Blood Glucose (Fasting)': 'रक्त शर्करा (उपाशी पोटी)',
      'Vitamin D (25-OH)': 'व्हिटॅमिन डी (25-OH)',
      'White Blood Cell Count': 'पांढऱ्या रक्त पेशींची संख्या',
      'Thyroid Stimulating Hormone (TSH)': 'थायरॉईड उत्तेजक संप्रेरक (TSH)',
      'Triglycerides': 'ट्रायग्लिसराईड्स',
      'Creatinine': 'क्रिएटिनिन'
    };
    return dict[name] || name;
  };

  const getMetricStatus = (status: string, lang: Language) => {
    if (lang === 'en') return status;
    const dict: Record<string, string> = {
      'Normal': 'सामान्य',
      'High border': 'उच्च सीमा',
      'Deficient': 'कमतरता'
    };
    return dict[status] || status;
  };

  const getSummaryTranslation = (summary: string, lang: Language) => {
    if (lang === 'en') return summary;
    if (summary.includes('All vital systems functional')) {
      return 'सर्व महत्वाची कार्ये सुरळीत आहेत. व्हिटॅमिन डी पातळी थोडी कमी आहे. कोलेस्ट्रॉल पातळी सीमेजवळ आहे.';
    }
    if (summary.includes('Excellent overall cardio-metabolic')) {
      return 'एकूण हृदय आणि चयापचय आरोग्य उत्कृष्ट आहे. शारीरिक कार्यक्षमता चांगली आहे. हायड्रेशन पातळी योग्य आहे.';
    }
    return summary;
  };

  const getTestTypeTranslation = (testType: string, lang: Language) => {
    if (lang === 'en') return testType;
    if (testType.includes('Comprehensive Blood Panel')) {
      return 'सर्वसमावेशक रक्त तपासणी आणि चयापचय चाचणी';
    }
    if (testType.includes('Executive Health')) {
      return 'कार्यकारी आरोग्य आणि तंदुरुस्ती चाचणी';
    }
    return testType;
  };

  const getTechnicianName = (techName: string, lang: Language) => {
    if (lang === 'en') return techName;
    if (techName.includes('Robert Chen')) {
      return 'डॉ. रॉबर्ट चेन, एमडी';
    }
    if (techName.includes('Emily Taylor')) {
      return 'डॉ. एमिली टेलर, पीएचडी';
    }
    return techName;
  };

  const mockReports: Record<string, any> = {
    'REP-2026': {
      code: 'REP-2026',
      patientName: language === 'en' ? 'Sarah Jenkins' : 'डॉ. सारा जेन्किन्स (Sarah Jenkins)',
      age: 34,
      gender: language === 'en' ? 'Female' : 'महिला',
      date: language === 'en' ? 'June 02, 2026' : '०२ जून, २०२६',
      testType: 'Comprehensive Blood Panel & Metabolic Test',
      labTechnician: 'Robert Chen, MD',
      status: language === 'en' ? 'Verified & Approved' : 'सत्यापित आणि मंजूर',
      summary: 'All vital systems functional. Slight low levels of Vitamin D. Cholesterol values are near boundary ranges.',
      metrics: [
        { name: 'Hemoglobin', value: 13.8, min: 12.0, max: 15.5, unit: 'g/dL', status: 'Normal' },
        { name: 'Total Cholesterol', value: 215, min: 100, max: 200, unit: 'mg/dL', status: 'High border' },
        { name: 'Blood Glucose (Fasting)', value: 88, min: 70, max: 100, unit: 'mg/dL', status: 'Normal' },
        { name: 'Vitamin D (25-OH)', value: 24, min: 30, max: 100, unit: 'ng/mL', status: 'Deficient' },
        { name: 'White Blood Cell Count', value: 6.4, min: 4.5, max: 11.0, unit: 'x10^3/µL', status: 'Normal' },
        { name: 'Thyroid Stimulating Hormone (TSH)', value: 2.1, min: 0.4, max: 4.0, unit: 'µIU/mL', status: 'Normal' }
      ]
    },
    'FIT-99': {
      code: 'FIT-99',
      patientName: language === 'en' ? 'Alex Mercer' : 'अॅलेक्स मर्सर (Alex Mercer)',
      age: 29,
      gender: language === 'en' ? 'Male' : 'पुरुष',
      date: language === 'en' ? 'May 28, 2026' : '२८ मे, २०२६',
      testType: 'Executive Health & Fitness Assay',
      labTechnician: 'Emily Taylor, PhD',
      status: language === 'en' ? 'Verified & Approved' : 'सत्यापित आणि मंजूर',
      summary: 'Excellent overall cardio-metabolic health. High physical performance values. Hydration index optimal.',
      metrics: [
        { name: 'Hemoglobin', value: 15.4, min: 13.5, max: 17.5, unit: 'g/dL', status: 'Normal' },
        { name: 'Total Cholesterol', value: 165, min: 100, max: 200, unit: 'mg/dL', status: 'Normal' },
        { name: 'Blood Glucose (Fasting)', value: 82, min: 70, max: 100, unit: 'mg/dL', status: 'Normal' },
        { name: 'Triglycerides', value: 110, min: 0, max: 150, unit: 'mg/dL', status: 'Normal' },
        { name: 'Creatinine', value: 0.95, min: 0.6, max: 1.2, unit: 'mg/dL', status: 'Normal' }
      ]
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportCode.trim()) return;

    setSearchStatus('searching');
    
    setTimeout(() => {
      const code = reportCode.trim().toUpperCase();
      if (mockReports[code]) {
        setRetrievedReport(mockReports[code]);
        setSearchStatus('success');
      } else {
        setSearchStatus('failed');
      }
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setSearchStatus('idle');
    setReportCode('');
    setRetrievedReport(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content glass-panel-blue"
            style={{ 
              maxWidth: searchStatus === 'success' ? '720px' : '480px',
              padding: 0,
              maxHeight: '92vh'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'var(--gradient-secondary)',
              padding: '20px 24px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={18} style={{ color: 'var(--cyan)' }} />
                <h3 style={{ color: 'white', fontSize: '1.25rem' }}>{t.modalPortalTitle}</h3>
              </div>
              <button 
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-fast)'
                }}
                className="hover-bright"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px', overflowY: 'auto' }} className="no-print">
              {searchStatus === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(2, 132, 199, 0.05)',
                      color: 'var(--med-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px auto'
                    }}>
                      <FileText size={28} />
                    </div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{t.modalPortalSubtitle}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                      {t.modalPortalDesc}
                    </p>
                  </div>

                  <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.modalPortalCodeLabel}</label>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          required
                          placeholder={t.modalPortalPlaceholder}
                          value={reportCode}
                          onChange={e => setReportCode(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 12px 12px 38px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-muted)',
                            fontSize: '0.98rem',
                            letterSpacing: '0.5px'
                          }}
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ height: '46px', gap: '10px' }}
                    >
                      <Lock size={16} /> {t.modalPortalBtn}
                    </button>
                  </form>

                  <div style={{ 
                    marginTop: '8px', 
                    padding: '12px', 
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-primary)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    border: '1px solid var(--border-muted)'
                  }}>
                    <AlertCircle size={16} style={{ color: 'var(--med-blue)', flexShrink: 0 }} />
                    <span>{t.modalPortalHint}</span>
                  </div>
                </div>
              )}

              {searchStatus === 'searching' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 0' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(2, 132, 199, 0.15)',
                    borderTopColor: 'var(--med-blue)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                  }} />
                  <p style={{ fontWeight: 600 }}>{t.modalPortalSearching}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.modalPortalDecrypting}</p>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}

              {searchStatus === 'failed' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', textAlign: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#fef2f2',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{t.modalPortalFailedTitle}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '320px' }}>
                      {language === 'en' ? (
                        <>We couldn't locate reports for the code "{reportCode}". Please check your code and try again.</>
                      ) : (
                        <>आम्हाला "{reportCode}" या कोडसाठी रिपोर्ट आढळले नाहीत. कृपया तुमचा कोड तपासून पुन्हा प्रयत्न करा.</>
                      )}
                    </p>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {language === 'en' ? 'Hint: Use standard codes REP-2026 or FIT-99.' : 'संकेत: REP-2026 किंवा FIT-99 कोड वापरा.'}
                  </div>
                  <button onClick={handleReset} className="btn btn-secondary" style={{ width: '140px' }}>
                    {t.modalPortalFailedBtn}
                  </button>
                </div>
              )}

              {searchStatus === 'success' && retrievedReport && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Patient Info Card */}
                  <div className="glass-panel" style={{
                    padding: '16px',
                    background: 'var(--bg-primary)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '12px',
                    fontSize: '0.85rem',
                    border: '1px solid var(--border-muted)'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{t.modalReportPatient}</span>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{retrievedReport.patientName}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{t.modalReportAge}</span>
                      <div style={{ fontWeight: 600 }}>{retrievedReport.age} / {retrievedReport.gender}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{t.modalReportCode}</span>
                      <div style={{ fontWeight: 600, color: 'var(--med-blue)' }}>{retrievedReport.code}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>{t.modalReportDate}</span>
                      <div style={{ fontWeight: 600 }}>{retrievedReport.date}</div>
                    </div>
                  </div>

                  {/* Diagnosis type */}
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '4px' }}>
                      {getTestTypeTranslation(retrievedReport.testType, language)}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                      <span style={{
                        padding: '2px 8px',
                        background: '#e0f2fe',
                        color: 'var(--med-blue)',
                        fontWeight: 700,
                        borderRadius: '4px'
                      }}>
                        {retrievedReport.status}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {t.modalReportProcessed}: {getTechnicianName(retrievedReport.labTechnician, language)}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Table */}
                  <div style={{
                    border: '1px solid var(--border-muted)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden'
                  }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.9rem',
                      textAlign: 'left'
                    }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-muted)' }}>
                          <th style={{ padding: '10px 14px', fontWeight: 600 }}>{t.modalReportMetric}</th>
                          <th style={{ padding: '10px 14px', fontWeight: 600 }}>{t.modalReportLevel}</th>
                          <th style={{ padding: '10px 14px', fontWeight: 600 }}>{t.modalReportRange}</th>
                          <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>{t.modalReportStatus}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retrievedReport.metrics.map((metric: any, index: number) => {
                          const isNormal = metric.status.toLowerCase() === 'normal';
                          return (
                            <tr key={index} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                              <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                                {getMetricName(metric.name, language)}
                              </td>
                              <td style={{ padding: '12px 14px', color: isNormal ? 'var(--text-primary)' : '#b91c1c', fontWeight: 700 }}>
                                {metric.value} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>{metric.unit}</span>
                              </td>
                              <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                {metric.min} - {metric.max} {metric.unit}
                              </td>
                              <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                <span style={{
                                  display: 'inline-block',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  background: isNormal ? '#f0fdf4' : '#fef2f2',
                                  color: isNormal ? '#166534' : '#991b1b'
                                }}>
                                  {getMetricStatus(metric.status, language)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary/Notes */}
                  <div style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(6, 182, 212, 0.03)',
                    border: '1px solid rgba(6, 182, 212, 0.1)',
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ color: 'var(--cyan-hover)', display: 'block', marginBottom: '4px' }}>{t.modalReportNotes}:</strong>
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{getSummaryTranslation(retrievedReport.summary, language)}"
                    </p>
                  </div>

                  {/* Action row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '10px',
                    gap: '12px'
                  }}>
                    <button onClick={handleReset} className="btn btn-secondary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                      {t.modalReportAnother}
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handlePrint} className="btn btn-secondary" style={{ padding: '10px 14px', fontSize: '0.9rem', display: 'flex', gap: '6px' }}>
                        <Printer size={16} /> {t.modalReportPrint}
                      </button>
                      <button 
                        onClick={() => alert(t.modalReportDownloaded)} 
                        className="btn btn-primary" 
                        style={{ padding: '10px 18px', fontSize: '0.9rem', display: 'flex', gap: '6px' }}
                      >
                        <Download size={16} /> {t.modalReportPdf}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Print layout style overrides (only targets screen prints) */}
            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .modal-overlay, .modal-content, .modal-content * {
                  visibility: visible;
                }
                .modal-overlay {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  background: white !important;
                }
                .no-print {
                  padding: 10px !important;
                }
                .btn, button, .no-print .btn {
                  display: none !important;
                }
              }
            `}</style>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
