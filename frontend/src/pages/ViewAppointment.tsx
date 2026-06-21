import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsApi } from '../services/api';
import { 
  Calendar, 
  ArrowLeft, 
  Download, 
  Check, 
  CheckCircle, 
  X, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  ShieldAlert, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ViewAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load appointment details
  const fetchDetails = async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await appointmentsApi.getById(id);
      if (res.success) {
        setAppointment(res.appointment);
      } else {
        setErrorMsg('Failed to retrieve appointment details.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to fetch appointment details. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchDetails();
    }
  }, [isAuthenticated, id]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUpdateStatus = async (newStatus: 'Confirmed' | 'Completed' | 'Cancelled') => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await appointmentsApi.updateStatus(id, newStatus);
      if (res.success) {
        setAppointment(res.appointment);
        showNotification('success', `Appointment status updated to ${newStatus}`);
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!appointment) return;
    try {
      await appointmentsApi.downloadPdf(appointment._id, appointment.appointmentId || 'voucher');
      showNotification('success', 'PDF downloaded successfully');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to generate PDF confirmation voucher.');
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <Loader2 size={36} className="spin-animation" style={{ color: 'var(--med-blue)' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Loading appointment records...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !appointment) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '480px', width: '90%', textAlign: 'center', background: 'white', border: '1px solid var(--border-muted)', borderRadius: '12px' }}>
          <ShieldAlert size={48} style={{ color: '#ef4444', marginBottom: '16px', display: 'inline-block' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '8px' }}>Access Error</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>{errorMsg || 'Could not locate any matching appointment record.'}</p>
          <button onClick={() => navigate('/admin/dashboard', { state: { activeTab: 'appointments' } })} className="btn btn-secondary" style={{ width: '100%' }}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Dynamic Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              zIndex: 9999,
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              background: notification.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: notification.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : '#fca5a5'}`,
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '0.92rem'
            }}
          >
            {notification.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid var(--border-muted)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 800
      }}>
        <button 
          onClick={() => navigate('/admin/dashboard', { state: { activeTab: 'appointments' } })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', padding: '6px', borderRadius: '50%', transition: 'background 0.2s' }}
          className="hover-bg-gray"
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Appointments</span>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          <h1 style={{ fontSize: '1.25rem', color: 'var(--primary)', margin: 0 }}>
            Details for {appointment.appointmentId}
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '32px 24px', flexGrow: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Main Details Panel */}
        <div className="glass-panel" style={{ padding: '32px', background: 'white', border: '1px solid var(--border-muted)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section 1: Appointment Info */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--med-blue-light)', color: 'var(--med-blue)', padding: '10px', borderRadius: '10px' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Appointment Reference</div>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', margin: '2px 0 0 0', fontWeight: 800 }}>{appointment.appointmentId}</h2>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`status-pill ${appointment.status.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '6px 16px', borderRadius: '20px' }}>
                  {appointment.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>BOOKING DATE</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', display: 'block' }}>
                  {new Date(appointment.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>LAST UPDATED</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', display: 'block' }}>
                  {new Date(appointment.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Patient Info */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--med-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> Patient Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Full Name</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {appointment.fullName || `${appointment.title} ${appointment.firstName} ${appointment.lastName}`}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Title / Gender Prefix</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{appointment.title}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>First Name</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{appointment.firstName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Middle Name</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{appointment.middleName || '-'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Last Name</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{appointment.lastName}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Date of Birth</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {new Date(appointment.dateOfBirth).toLocaleDateString('en-IN', { timeZone: 'UTC' })}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Age</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{appointment.age} Years</div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mobile Number</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--med-blue)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} /> {appointment.mobile}
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Email Address</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} /> {appointment.email || 'No email address registered'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Schedule Details */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--med-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} /> Appointment Schedule details
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Service Department</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {appointment.department} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>({appointment.departmentMr})</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Preferred Specialist Doctor</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {appointment.doctor} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>({appointment.doctorMr})</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Appointment Date</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {new Date(appointment.appointmentDate).toLocaleDateString('en-IN', { timeZone: 'UTC' })}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Preferred Time Slot</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--med-blue)', marginTop: '4px' }}>
                  {appointment.appointmentSlot}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Message / Symptoms */}
          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--med-blue)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} /> Medical Symptoms / Special Instructions
            </h4>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-muted)', fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: appointment.message ? 'normal' : 'italic' }}>
              {appointment.message ? `"${appointment.message}"` : 'No symptoms or instructions provided.'}
            </div>
          </div>

        </div>

        {/* Administrative Actions Panel */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-muted)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {appointment.status === 'Pending' && (
              <button 
                onClick={() => handleUpdateStatus('Confirmed')}
                disabled={actionLoading}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <Check size={16} /> Confirm Appointment
              </button>
            )}
            {appointment.status === 'Confirmed' && (
              <button 
                onClick={() => handleUpdateStatus('Completed')}
                disabled={actionLoading}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.88rem', background: '#0d9488', borderColor: '#0d9488' }}
              >
                <CheckCircle size={16} /> Mark Completed
              </button>
            )}
            {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
              <button 
                onClick={() => handleUpdateStatus('Cancelled')}
                disabled={actionLoading}
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}
              >
                <X size={16} /> Cancel Appointment
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleDownloadPdf}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} /> Download Voucher PDF
            </button>
            <button 
              onClick={() => navigate('/admin/dashboard', { state: { activeTab: 'appointments' } })}
              className="btn btn-secondary"
            >
              Back to Appointments
            </button>
          </div>
        </div>

      </main>

      {/* Embedded Global Styles to override hover and switch triggers */}
      <style>{`
        .status-pill.pending { background: #fef3c7; color: #d97706; }
        .status-pill.confirmed { background: #ccfbf1; color: #0d9488; }
        .status-pill.completed { background: #dbeafe; color: #2563eb; }
        .status-pill.cancelled { background: #fee2e2; color: #ef4444; }
        .hover-bg-gray:hover { background: rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
};

export default ViewAppointment;
