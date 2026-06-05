import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, Download, Search, Lock, AlertCircle, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
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
    'General Diagnostic',
    'Radiology & MRI',
    'Cardiology Desk',
    'Pathology Lab',
    'Specialist Consultation',
    'Home Sample Collection'
  ];

  const doctors = [
    'Dr. Sarah Jenkins (Cardiologist)',
    'Dr. Robert Chen (Radiologist)',
    'Dr. Emily Taylor (Pathologist)',
    'Dr. Michael Stone (Internal Medicine)',
    'Dr. Alisha Patel (Pediatric Specialist)'
  ];

  const times = [
    '09:00 AM', '10:30 AM', '11:45 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) return;
    
    setIsSubmitted(true);
    setTimeout(() => {
      // Simulate API call delay
    }, 1000);
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
                <h3 style={{ color: 'white', fontSize: '1.4rem' }}>Book Medical Appointment</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginTop: '4px' }}>Fill in the details to schedule your visit</p>
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
                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        required
                        placeholder="John Doe"
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
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Phone Number *</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="tel" 
                          required
                          placeholder="+1 (555) 000-0000"
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
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Email Address</label>
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
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Service Department</label>
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
                        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Preferred Specialist</label>
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
                        {doctors.map(doc => <option key={doc} value={doc}>{doc}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Preferred Date *</label>
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
                      <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Preferred Time Slot</label>
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
                          {times.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Special Instructions / Symptoms</label>
                    <textarea 
                      rows={3}
                      placeholder="Specify any symptom or special requirements here..."
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
                    Confirm & Schedule Appointment
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
                  <h4 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Appointment Scheduled!</h4>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '380px' }}>
                    Thank you, <strong>{formData.name}</strong>. Your appointment has been booked for <strong>{formData.date}</strong> at <strong>{formData.time}</strong> with <strong>{formData.doctor}</strong>.
                  </p>

                  <div className="glass-panel" style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(2, 132, 199, 0.03)',
                    border: '1px dashed rgba(2, 132, 199, 0.2)',
                    textAlign: 'left',
                    marginBottom: '30px'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>APPOINTMENT RECEIPT</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.9rem' }}>
                      <div><strong>Booking Ref:</strong> #SVKM-{Math.floor(100000 + Math.random() * 900000)}</div>
                      <div><strong>Dept:</strong> {formData.department}</div>
                      <div><strong>Phone:</strong> {formData.phone}</div>
                      <div><strong>Status:</strong> <span style={{ color: '#0d9488', fontWeight: 600 }}>Confirmed</span></div>
                    </div>
                  </div>

                  <button 
                    onClick={handleReset}
                    className="btn btn-secondary"
                    style={{ width: '150px' }}
                  >
                    Close Window
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

export const ReportModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [reportCode, setReportCode] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'success' | 'failed'>('idle');
  const [retrievedReport, setRetrievedReport] = useState<any>(null);

  const mockReports: Record<string, any> = {
    'REP-2026': {
      code: 'REP-2026',
      patientName: 'Sarah Jenkins',
      age: 34,
      gender: 'Female',
      date: 'June 02, 2026',
      testType: 'Comprehensive Blood Panel & Metabolic Test',
      labTechnician: 'Robert Chen, MD',
      status: 'Verified & Approved',
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
      patientName: 'Alex Mercer',
      age: 29,
      gender: 'Male',
      date: 'May 28, 2026',
      testType: 'Executive Health & Fitness Assay',
      labTechnician: 'Emily Taylor, PhD',
      status: 'Verified & Approved',
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
                <h3 style={{ color: 'white', fontSize: '1.25rem' }}>Secure Patient Report Portal</h3>
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
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Access Lab & Test Reports</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                      Enter the secure report verification code provided during registration to retrieve your clinical diagnostics.
                    </p>
                  </div>

                  <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Security Verification Code</label>
                      <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. REP-2026, FIT-99"
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
                      <Lock size={16} /> Authenticate & Search
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
                    <span>Try testing with <strong>REP-2026</strong> or <strong>FIT-99</strong> for mockup report visuals.</span>
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
                  <p style={{ fontWeight: 600 }}>Locating laboratory database records...</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Decrypting encrypted patient file records</p>
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
                    <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Invalid Verification Code</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '320px' }}>
                      We couldn't locate reports for the code "{reportCode}". Please check your code and try again.
                    </p>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Hint: Use standard codes <strong>REP-2026</strong> or <strong>FIT-99</strong>.
                  </div>
                  <button onClick={handleReset} className="btn btn-secondary" style={{ width: '140px' }}>
                    Try Again
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
                      <span style={{ color: 'var(--text-muted)' }}>PATIENT NAME</span>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>{retrievedReport.patientName}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>AGE / GENDER</span>
                      <div style={{ fontWeight: 600 }}>{retrievedReport.age} / {retrievedReport.gender}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>REPORT CODE</span>
                      <div style={{ fontWeight: 600, color: 'var(--med-blue)' }}>{retrievedReport.code}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>APPROVED DATE</span>
                      <div style={{ fontWeight: 600 }}>{retrievedReport.date}</div>
                    </div>
                  </div>

                  {/* Diagnosis type */}
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '4px' }}>{retrievedReport.testType}</h4>
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
                      <span style={{ color: 'var(--text-muted)' }}>Processed by: {retrievedReport.labTechnician}</span>
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
                          <th style={{ padding: '10px 14px', fontWeight: 600 }}>Test Metric</th>
                          <th style={{ padding: '10px 14px', fontWeight: 600 }}>Your Level</th>
                          <th style={{ padding: '10px 14px', fontWeight: 600 }}>Reference Range</th>
                          <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {retrievedReport.metrics.map((metric: any, index: number) => {
                          const isNormal = metric.status.toLowerCase() === 'normal';
                          return (
                            <tr key={index} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                              <td style={{ padding: '12px 14px', fontWeight: 500 }}>{metric.name}</td>
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
                                  {metric.status}
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
                    <strong style={{ color: 'var(--cyan-hover)', display: 'block', marginBottom: '4px' }}>Specialist Doctor Summary Notes:</strong>
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      "{retrievedReport.summary}"
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
                      Search Another Report
                    </button>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handlePrint} className="btn btn-secondary" style={{ padding: '10px 14px', fontSize: '0.9rem', display: 'flex', gap: '6px' }}>
                        <Printer size={16} /> Print
                      </button>
                      <button 
                        onClick={() => alert('Downloaded file mockup successfully!')} 
                        className="btn btn-primary" 
                        style={{ padding: '10px 18px', fontSize: '0.9rem', display: 'flex', gap: '6px' }}
                      >
                        <Download size={16} /> Download PDF
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
