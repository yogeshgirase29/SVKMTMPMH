import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, FileText, CheckCircle2, Download, Search, Lock, AlertCircle, Printer, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Language, translations } from '../utils/translations';
import { doctorsApi, departmentsApi, appointmentsApi } from '../services/api';

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
    department: 'General Medicine',
    doctor: '',
    date: '',
    time: '09:00 AM',
    notes: ''
  });

  const [dbDepartments, setDbDepartments] = useState<any[]>([]);
  const [dbDoctors, setDbDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Fetch doctors and departments on modal open
  useEffect(() => {
    if (isOpen) {
      const loadFields = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
          const [deptRes, docRes] = await Promise.all([
            departmentsApi.getAll(),
            doctorsApi.getAll(true) // Available only
          ]);
          
          if (deptRes.success && deptRes.departments.length > 0) {
            setDbDepartments(deptRes.departments);
            const initialDept = deptRes.departments[0].departmentName.en;
            
            if (docRes.success && docRes.doctors.length > 0) {
              setDbDoctors(docRes.doctors);
              // Find first doctor in that department
              const matchedDoc = docRes.doctors.find((d: any) => d.department.toLowerCase() === initialDept.toLowerCase());
              const selectedDoc = matchedDoc ? matchedDoc.doctorName.en : docRes.doctors[0].doctorName.en;
              
              setFormData({
                name: '',
                phone: '',
                email: '',
                department: initialDept,
                doctor: selectedDoc,
                date: '',
                time: '',
                notes: ''
              });
            } else {
              setFormData({
                name: '',
                phone: '',
                email: '',
                department: initialDept,
                doctor: '',
                date: '',
                time: '',
                notes: ''
              });
            }
          }
        } catch (err) {
          console.error('Failed to load form parameters:', err);
          setErrorMsg(language === 'en' ? 'Failed to connect to clinic server.' : 'वैद्यकीय सर्व्हरशी कनेक्ट करण्यात अयशस्वी.');
        } finally {
          setLoading(false);
        }
      };
      loadFields();
    }
  }, [isOpen, language]);

  // Fetch available slots when date or doctor changes
  useEffect(() => {
    const loadSlots = async () => {
      if (!formData.date || !formData.doctor || dbDoctors.length === 0) {
        setAvailableSlots([]);
        return;
      }
      
      setSlotsLoading(true);
      try {
        const doc = dbDoctors.find((d: any) => d.doctorName.en.toLowerCase() === formData.doctor.toLowerCase());
        if (doc) {
          const res = await appointmentsApi.getAvailableSlots(doc._id, formData.date);
          if (res.success) {
            setAvailableSlots(res.slots);
            // Auto-select first slot if available and not set or if current selected slot is no longer available
            if (res.slots.length > 0) {
              if (!formData.time || !res.slots.includes(formData.time)) {
                setFormData(prev => ({ ...prev, time: res.slots[0] }));
              }
            } else {
              setFormData(prev => ({ ...prev, time: '' }));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [formData.date, formData.doctor, dbDoctors]);

  // Handle department change - auto filter/select matching doctor
  const handleDepartmentChange = (deptName: string) => {
    setFormData(prev => {
      const matchedDoc = dbDoctors.find((d: any) => d.department.toLowerCase() === deptName.toLowerCase());
      return {
        ...prev,
        department: deptName,
        doctor: matchedDoc ? matchedDoc.doctorName.en : (dbDoctors[0]?.doctorName.en || ''),
        time: ''
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.doctor || !formData.department || !formData.time) {
      setErrorMsg(language === 'en' ? 'Please fill in all mandatory fields, including the time slot.' : 'कृपया वेळ स्लॉटसह सर्व आवश्यक फील्ड भरा.');
      return;
    }
    
    setSubmitLoading(true);
    setErrorMsg('');

    try {
      const selectedDept = dbDepartments.find(
        (d: any) => d.departmentName.en.toLowerCase() === formData.department.toLowerCase()
      );
      const selectedDoc = dbDoctors.find(
        (d: any) => d.doctorName.en.toLowerCase() === formData.doctor.toLowerCase()
      );

      const payload = {
        patientName: formData.name,
        mobile: formData.phone,
        email: formData.email,
        department: formData.department,
        departmentMr: selectedDept ? selectedDept.departmentName.mr : formData.department,
        doctor: formData.doctor,
        doctorMr: selectedDoc ? selectedDoc.doctorName.mr : formData.doctor,
        appointmentDate: formData.date,
        appointmentSlot: formData.time,
        message: formData.notes
      };

      const res = await appointmentsApi.create(payload);
      if (res.success) {
        setSuccessData(res.appointment);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || 
        (language === 'en' ? 'Failed to submit appointment. Check connection.' : 'अपॉइंटमेंट पाठवण्यात अयशस्वी. कनेक्शन तपासा.')
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      department: dbDepartments[0]?.departmentName.en || 'General Medicine',
      doctor: dbDoctors[0]?.doctorName.en || '',
      date: '',
      time: '',
      notes: ''
    });
    setIsSubmitted(false);
    setSuccessData(null);
    setErrorMsg('');
    setAvailableSlots([]);
    onClose();
  };

  // Filter doctors list based on selected department
  const filteredDoctors = dbDoctors.filter(
    (doc: any) => doc.department.toLowerCase() === formData.department.toLowerCase()
  );
  const displayDoctors = filteredDoctors.length > 0 ? filteredDoctors : dbDoctors;

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
              
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
                  <Loader2 size={36} className="spin-animation" style={{ color: 'var(--med-blue)' }} />
                </div>
              ) : errorMsg && !submitLoading && !isSubmitted ? (
                <div style={{ padding: '20px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <AlertCircle size={36} style={{ color: '#ef4444' }} />
                  <p style={{ fontWeight: 600 }}>{errorMsg}</p>
                  <button onClick={onClose} className="btn btn-secondary">{t.modalClose}</button>
                </div>
              ) : !isSubmitted ? (
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
                        onChange={e => handleDepartmentChange(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-muted)',
                          fontSize: '0.95rem',
                          backgroundColor: 'white'
                        }}
                      >
                        {dbDepartments.map(dept => (
                          <option key={dept._id} value={dept.departmentName.en}>
                            {dept.departmentName[language] || dept.departmentName.en}
                          </option>
                        ))}
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
                        {displayDoctors.map(doc => (
                          <option key={doc._id} value={doc.doctorName.en}>
                            {doc.doctorName[language] || doc.doctorName.en} ({doc.specialization[language] || doc.specialization.en})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                      {!formData.date ? (
                        <div style={{
                          fontSize: '0.88rem',
                          color: 'var(--text-muted)',
                          padding: '12px',
                          border: '1px dashed var(--border-muted)',
                          borderRadius: '8px',
                          textAlign: 'center',
                          background: 'rgba(0,0,0,0.02)'
                        }}>
                          {language === 'en' ? 'Please select an appointment date first.' : 'कृपया आधी अपॉइंटमेंटची तारीख निवडा.'}
                        </div>
                      ) : slotsLoading ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '16px',
                          border: '1px solid var(--border-muted)',
                          borderRadius: '8px',
                          background: 'white'
                        }}>
                          <Loader2 size={18} className="spin-animation" style={{ color: 'var(--med-blue)' }} />
                          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                            {language === 'en' ? 'Fetching available slots...' : 'उपलब्ध वेळा शोधत आहे...'}
                          </span>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div style={{
                          fontSize: '0.88rem',
                          color: '#ef4444',
                          fontWeight: 600,
                          padding: '12px',
                          border: '1px solid #fee2e2',
                          borderRadius: '8px',
                          textAlign: 'center',
                          background: '#fef2f2'
                        }}>
                          {language === 'en' ? 'No slots available for this date. Please choose another date.' : 'या तारखेसाठी एकही वेळ उपलब्ध नाही. कृपया दुसरी तारीख निवडा.'}
                        </div>
                      ) : (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))',
                          gap: '8px',
                          maxHeight: '180px',
                          overflowY: 'auto',
                          padding: '4px',
                          border: '1px solid var(--border-muted)',
                          borderRadius: '8px',
                          background: 'rgba(0,0,0,0.01)'
                        }} className="slots-scroll-grid">
                          {availableSlots.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setFormData({ ...formData, time: slot })}
                              style={{
                                padding: '8px 4px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                borderRadius: '6px',
                                border: formData.time === slot ? '2px solid var(--med-blue)' : '1px solid var(--border-muted)',
                                background: formData.time === slot ? 'var(--med-blue-light)' : 'white',
                                color: formData.time === slot ? 'var(--med-blue)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                textAlign: 'center',
                                boxShadow: formData.time === slot ? 'var(--shadow-sm)' : 'none'
                              }}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
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

                  {/* Error Prompt */}
                  {errorMsg && (
                    <div style={{ color: '#ef4444', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <AlertCircle size={14} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitLoading}
                    style={{ width: '100%', marginTop: '10px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  >
                    {submitLoading && <Loader2 size={16} className="spin-animation" />}
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
                        Thank you, <strong>{formData.name}</strong>. Your appointment has been booked for <strong>{new Date(successData?.appointmentDate).toLocaleDateString()}</strong> at <strong>{formData.time}</strong> with <strong>{formData.doctor}</strong>. {t.modalAppSuccessDesc}
                      </>
                    ) : (
                      <>
                        धन्यवाद, <strong>{formData.name}</strong>. आपली अपॉइंटमेंट <strong>{new Date(successData?.appointmentDate).toLocaleDateString()}</strong> रोजी <strong>{formData.time}</strong> वाजता <strong>{formData.doctor}</strong> यांच्यासोबत बुक झाली आहे. {t.modalAppSuccessDesc}
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
                      <div><strong>{t.modalBookingRef}:</strong> <span style={{ color: 'var(--med-blue)', fontWeight: 700 }}>{successData?.appointmentId}</span></div>
                      <div><strong>{language === 'en' ? 'Dept' : 'विभाग'}:</strong> {successData?.departmentMr && language === 'mr' ? successData.departmentMr : successData?.department}</div>
                      <div><strong>{language === 'en' ? 'Phone' : 'फोन'}:</strong> {formData.phone}</div>
                      <div><strong>{t.modalStatus}:</strong> <span style={{ color: '#0d9488', fontWeight: 600 }}>{successData?.status || t.modalConfirmed}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                    <button 
                      onClick={() => printVoucher(successData, language)}
                      className="btn btn-primary"
                      style={{ width: '170px', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Download size={16} />
                      {language === 'en' ? 'Download PDF' : 'पीडीएफ डाउनलोड करा'}
                    </button>
                    <button 
                      onClick={handleReset}
                      className="btn btn-secondary"
                      style={{ width: '120px' }}
                    >
                      {t.modalClose}
                    </button>
                  </div>
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

export const printVoucher = (app: any, language: Language = 'en') => {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  const titleText = language === 'mr' ? 'अपॉइंटमेंट पावती' : 'Appointment Voucher';
  const appNoLabel = language === 'mr' ? 'अपॉइंटमेंट संदर्भ क्रमांक' : 'Appointment Number';
  const statusLabel = language === 'mr' ? 'स्थिती' : 'Status';
  const patientLabel = language === 'mr' ? 'रुग्णाचे नाव' : 'Patient Name';
  const phoneLabel = language === 'mr' ? 'मोबाईल नंबर' : 'Mobile Number';
  const deptLabel = language === 'mr' ? 'वैद्यकीय विभाग' : 'Department';
  const docLabel = language === 'mr' ? 'पंसतीचे डॉक्टर' : 'Specialist Doctor';
  const dateLabel = language === 'mr' ? 'अपॉइंटमेंट तारीख' : 'Appointment Date';
  const notesLabel = language === 'mr' ? 'विशेष सूचना / लक्षणे' : 'Instructions / Notes';
  const footerText = language === 'mr' 
    ? 'कृपया नियोजित वेळेच्या १५ मिनिटे आधी रुग्णालयाच्या स्वागत कक्षात ही पावती सादर करावी.' 
    : 'Please present this voucher at the hospital reception 15 minutes before the scheduled time slot.';
  const printBtnText = language === 'mr' ? 'प्रिंट करा / पीडीएफ म्हणून जतन करा' : 'Print / Save as PDF';

  const deptVal = language === 'mr' ? (app.departmentMr || app.department) : app.department;
  const docVal = language === 'mr' ? (app.doctorMr || app.doctor) : app.doctor;

  printWindow.document.write(`
    <html>
      <head>
        <title>Appointment Receipt - ${app.appointmentId}</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; padding: 40px; color: #0f172a; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #0284c7; }
          .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
          .title { font-size: 20px; margin: 20px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 40px; margin-bottom: 30px; }
          .field { display: flex; flex-direction: column; }
          .label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { font-size: 15px; font-weight: 700; margin-top: 4px; }
          .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; font-size: 12px; }
          .status.pending { background: #fef3c7; color: #b45309; }
          .status.confirmed { background: #ccfbf1; color: #0f766e; }
          .status.completed { background: #dbeafe; color: #1d4ed8; }
          .status.cancelled { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center; }
          .btn-print { display: block; width: 250px; margin: 30px auto; padding: 12px; background: #0284c7; color: white; border: none; font-weight: bold; border-radius: 6px; cursor: pointer; text-align: center; text-decoration: none; font-size: 14px; }
          @media print {
            .btn-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SVKM'S TMPM HOSPITAL</div>
          <div class="subtitle">Kharde BK, Shirpur, Dhule, Maharashtra - 425405</div>
          <div class="title">${titleText}</div>
        </div>
        <div class="grid">
          <div class="field">
            <div class="label">${appNoLabel}</div>
            <div class="value" style="color: #0284c7;">${app.appointmentId}</div>
          </div>
          <div class="field">
            <div class="label">${statusLabel}</div>
            <div class="value">
              <span class="status ${app.status.toLowerCase()}">${app.status}</span>
            </div>
          </div>
          <div class="field">
            <div class="label">${patientLabel}</div>
            <div class="value">${app.patientName}</div>
          </div>
          <div class="field">
            <div class="label">${phoneLabel}</div>
            <div class="value">${app.mobile}</div>
          </div>
          <div class="field">
            <div class="label">${deptLabel}</div>
            <div class="value">${deptVal}</div>
          </div>
          <div class="field">
            <div class="label">${docLabel}</div>
            <div class="value">${docVal}</div>
          </div>
          <div class="field" style="grid-column: span 2;">
            <div class="label">${dateLabel}</div>
            <div class="value">${new Date(app.appointmentDate).toLocaleDateString()}</div>
          </div>
          ${app.message ? `
          <div class="field" style="grid-column: span 2;">
            <div class="label">${notesLabel}</div>
            <div class="value" style="font-weight: normal; font-style: italic;">"${app.message}"</div>
          </div>` : ''}
        </div>
        <div class="footer">
          ${footerText}
        </div>
        <button class="btn-print" onclick="window.print()">${printBtnText}</button>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const AppointmentStatusModal: React.FC<ModalProps> = ({ isOpen, onClose, language }) => {

  const [appointmentNo, setAppointmentNo] = useState('');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'success' | 'failed'>('idle');
  const [retrievedAppointment, setRetrievedAppointment] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentNo.trim()) return;

    setSearchStatus('searching');
    setErrorMsg('');
    try {
      const res = await appointmentsApi.getStatus(appointmentNo.trim());
      if (res.success) {
        setRetrievedAppointment(res.appointment);
        setSearchStatus('success');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to find appointment.');
      setSearchStatus('failed');
    }
  };

  const handleReset = () => {
    setSearchStatus('idle');
    setAppointmentNo('');
    setRetrievedAppointment(null);
    setErrorMsg('');
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
              maxWidth: searchStatus === 'success' ? '540px' : '440px',
              padding: 0,
              maxHeight: '92vh'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'var(--gradient-primary)',
              padding: '20px 24px',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} style={{ color: 'white' }} />
                <h3 style={{ color: 'white', fontSize: '1.25rem' }}>
                  {language === 'en' ? 'Check Appointment Status' : 'अपॉइंटमेंट स्थिती तपासा'}
                </h3>
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
            <div style={{ padding: '24px', overflowY: 'auto' }}>
              {searchStatus === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                      {language === 'en' ? 'Track Your Appointment' : 'तुमची अपॉइंटमेंट ट्रॅक करा'}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                      {language === 'en' 
                        ? 'Enter the appointment reference number (e.g. AP2606070001) to verify your schedule status.' 
                        : 'तुमच्या अपॉइंटमेंटचे वेळापत्रक तपासण्यासाठी अपॉइंटमेंट संदर्भ क्रमांक प्रविष्ट करा (उदा. AP2606070001).'}
                    </p>
                  </div>

                  <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {language === 'en' ? 'Appointment ID' : 'अपॉइंटमेंट संदर्भ क्रमांक'}
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. AP2606070001"
                        value={appointmentNo}
                        onChange={e => setAppointmentNo(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-muted)',
                          fontSize: '0.98rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      style={{ height: '46px' }}
                    >
                      {language === 'en' ? 'Check Status' : 'स्थिती तपासा'}
                    </button>
                  </form>
                </div>
              )}

              {searchStatus === 'searching' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 0' }}>
                  <Loader2 size={36} className="spin-animation" style={{ color: 'var(--med-blue)', marginBottom: '16px' }} />
                  <p style={{ fontWeight: 600 }}>
                    {language === 'en' ? 'Retrieving appointment details...' : 'अपॉइंटमेंट तपशील शोधत आहे...'}
                  </p>
                </div>
              )}

              {searchStatus === 'failed' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', textAlign: 'center', gap: '16px' }}>
                  <AlertCircle size={28} style={{ color: '#ef4444' }} />
                  <div>
                    <h4 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>
                      {language === 'en' ? 'No Appointment Found' : 'अपॉइंटमेंट आढळली नाही'}
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {errorMsg}
                    </p>
                  </div>
                  <button onClick={handleReset} className="btn btn-secondary" style={{ width: '140px' }}>
                    {language === 'en' ? 'Try Again' : 'पुन्हा प्रयत्न करा'}
                  </button>
                </div>
              )}

              {searchStatus === 'success' && retrievedAppointment && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Voucher Preview */}
                  <div className="glass-panel" style={{
                    padding: '20px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-muted)', paddingBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {language === 'en' ? 'APPOINTMENT NO' : 'अपॉइंटमेंट संदर्भ क्रमांक'}
                        </span>
                        <div style={{ fontWeight: 800, color: 'var(--med-blue)', fontSize: '1.1rem' }}>{retrievedAppointment.appointmentId}</div>
                      </div>
                      <span className={`status-pill ${retrievedAppointment.status.toLowerCase()}`}>
                        {retrievedAppointment.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {language === 'en' ? 'Patient Name' : 'रुग्णाचे नाव'}
                        </span>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>{retrievedAppointment.patientName}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {language === 'en' ? 'Mobile Number' : 'मोबाईल नंबर'}
                        </span>
                        <div style={{ fontWeight: 600, marginTop: '2px' }}>{retrievedAppointment.mobile}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {language === 'en' ? 'Department' : 'वैद्यकीय विभाग'}
                        </span>
                        <div style={{ fontWeight: 600, marginTop: '2px' }}>
                          {language === 'mr' ? (retrievedAppointment.departmentMr || retrievedAppointment.department) : retrievedAppointment.department}
                        </div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {language === 'en' ? 'Specialist Doctor' : 'पसंतीचे डॉक्टर'}
                        </span>
                        <div style={{ fontWeight: 600, marginTop: '2px' }}>
                          {language === 'mr' ? (retrievedAppointment.doctorMr || retrievedAppointment.doctor) : retrievedAppointment.doctor}
                        </div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {language === 'en' ? 'Appointment Date' : 'अपॉइंटमेंट तारीख'}
                        </span>
                        <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>{new Date(retrievedAppointment.appointmentDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button onClick={handleReset} className="btn btn-secondary">
                      {language === 'en' ? 'Back' : 'मागे'}
                    </button>
                    <button 
                      onClick={() => printVoucher(retrievedAppointment, language)}
                      className="btn btn-primary"
                      style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                      <Download size={16} />
                      {language === 'en' ? 'Download PDF' : 'पीडीएफ डाउनलोड करा'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
