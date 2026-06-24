import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorsApi } from '../services/api';
import { 
  X, 
  AlertTriangle, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getISTDateString, formatISTDate } from '../utils/dateUtils';

interface LeaveType {
  _id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Active' | 'Cancelled';
  createdAt: string;
}

interface DoctorType {
  _id: string;
  doctorName: { en: string; mr: string };
  specialization: { en: string; mr: string };
  department: string;
  image: string;
  available: boolean;
}

const DoctorLeaveManagement: React.FC = () => {
  const { id: doctorId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State Variables
  const [doctor, setDoctor] = useState<DoctorType | null>(null);
  const [leaves, setLeaves] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeaveId, setEditingLeaveId] = useState<string | null>(null);
  const [form, setForm] = useState({
    leaveType: 'Annual Leave',
    startDate: getISTDateString(),
    endDate: getISTDateString(),
    reason: '',
    status: 'Active' as 'Active' | 'Cancelled'
  });

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    leaveId: string;
  }>({
    isOpen: false,
    leaveId: ''
  });

  // Show Toast Notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Doctor & Leaves Data
  const fetchData = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const [docRes, leavesRes] = await Promise.all([
        doctorsApi.getById(doctorId),
        doctorsApi.getLeaves(doctorId)
      ]);
      
      if (docRes.success) {
        setDoctor(docRes.doctor);
      }
      if (leavesRes.success) {
        setLeaves(leavesRes.leaves || []);
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to fetch doctor leave details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [doctorId]);

  // Open Add Leave Modal
  const handleOpenAdd = () => {
    setEditingLeaveId(null);
    setForm({
      leaveType: 'Annual Leave',
      startDate: getISTDateString(),
      endDate: getISTDateString(),
      reason: '',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  // Open Edit Leave Modal
  const handleOpenEdit = (leave: LeaveType) => {
    setEditingLeaveId(leave._id);
    setForm({
      leaveType: leave.leaveType,
      startDate: getISTDateString(new Date(leave.startDate)),
      endDate: getISTDateString(new Date(leave.endDate)),
      reason: leave.reason || '',
      status: leave.status
    });
    setIsModalOpen(true);
  };

  // Handle Save Leave (Create/Update)
  const handleSaveLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId) return;

    if (!form.startDate || !form.endDate) {
      showNotification('error', 'Start and End dates are required.');
      return;
    }

    const todayStr = getISTDateString();
    const startVal = form.startDate;
    const endVal = form.endDate;

    // Start Date validation (Only if creating new or changing date)
    if (!editingLeaveId && startVal < todayStr) {
      showNotification('error', 'Start date cannot be in the past.');
      return;
    }

    if (endVal < startVal) {
      showNotification('error', 'End date must be greater than or equal to start date.');
      return;
    }

    if (form.reason.length > 250) {
      showNotification('error', 'Reason must be 250 characters or less.');
      return;
    }

    setActionLoading(true);
    try {
      let res: any;
      if (editingLeaveId) {
        res = await doctorsApi.updateLeave(doctorId, editingLeaveId, form);
        if (res.success) {
          showNotification('success', 'Leave schedule updated successfully.');
        }
      } else {
        res = await doctorsApi.addLeave(doctorId, form);
        if (res.success) {
          showNotification('success', 'Leave scheduled successfully.');
        }
      }
      setLeaves(res.leaves || []);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.response?.data?.message || 'Failed to save leave schedule.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Leave
  const handleDeleteLeave = async () => {
    if (!doctorId || !deleteConfirm.leaveId) return;
    setActionLoading(true);
    try {
      const res = await doctorsApi.deleteLeave(doctorId, deleteConfirm.leaveId);
      if (res.success) {
        setLeaves(res.leaves || []);
        showNotification('success', 'Leave schedule deleted successfully.');
        setDeleteConfirm({ isOpen: false, leaveId: '' });
      }
    } catch (err: any) {
      console.error(err);
      showNotification('error', err.response?.data?.message || 'Failed to delete leave.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Toast Notifications */}
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
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
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
          onClick={() => navigate('/admin/dashboard', { state: { activeTab: 'doctors' } })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: '4px' }}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700 }}>
          Manage Doctor Leave & Availability
        </h1>
      </header>

      {/* Main Content Workspace */}
      <main style={{ padding: '32px 24px', flexGrow: 1, maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <Loader2 size={36} className="spin-animation" style={{ color: 'var(--med-blue)' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Doctor Profile Banner Card */}
            {doctor && (
              <div className="glass-panel" style={{
                padding: '24px',
                background: 'white',
                border: '1px solid var(--border-muted)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <img 
                  src={doctor.image} 
                  alt={doctor.doctorName.en}
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover', background: 'var(--bg-primary)' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: 800, margin: 0 }}>
                    {doctor.doctorName.en}
                  </h2>
                  <p style={{ color: 'var(--med-blue)', fontWeight: 600, margin: '4px 0 0 0', fontSize: '0.95rem' }}>
                    {doctor.specialization.en} • Dept: {doctor.department}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                    <span className={`status-pill ${doctor.available ? 'confirmed' : 'cancelled'}`} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                      {doctor.available ? 'Active / Available' : 'Inactive / Unavailable'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={handleOpenAdd}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', height: '42px', fontSize: '0.9rem' }}
                >
                  <Plus size={16} />
                  <span>Schedule Leave</span>
                </button>
              </div>
            )}

            {/* Leave History Table Section */}
            <div className="glass-panel" style={{
              padding: '24px',
              background: 'white',
              border: '1px solid var(--border-muted)',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '20px' }}>
                Leave & Unavailability Log
              </h3>

              <div style={{ overflowX: 'auto' }}>
                {leaves.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No leaves scheduled for this doctor yet. Click "Schedule Leave" to add one.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-muted)' }}>
                        <th style={{ padding: '14px 12px' }}>Leave Type</th>
                        <th style={{ padding: '14px 12px' }}>Start Date</th>
                        <th style={{ padding: '14px 12px' }}>End Date</th>
                        <th style={{ padding: '14px 12px' }}>Reason</th>
                        <th style={{ padding: '14px 12px' }}>Status</th>
                        <th style={{ padding: '14px 12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map(l => (
                        <tr key={l._id} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                          <td style={{ padding: '14px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {l.leaveType}
                          </td>
                          <td style={{ padding: '14px 12px' }}>{formatISTDate(l.startDate)}</td>
                          <td style={{ padding: '14px 12px' }}>{formatISTDate(l.endDate)}</td>
                          <td style={{ padding: '14px 12px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.reason}>
                            {l.reason || '-'}
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            <span className={`status-pill ${l.status.toLowerCase()}`}>
                              {l.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleOpenEdit(l)}
                                title="Edit Leave"
                                className="action-icon-btn edit"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm({ isOpen: true, leaveId: l._id })}
                                title="Delete Leave"
                                className="action-icon-btn delete"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content glass-panel-blue" 
              style={{ maxWidth: '500px', background: 'white' }}
            >
              <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>
                  {editingLeaveId ? 'Edit Leave Schedule' : 'Schedule Future Leave'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveLeave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Leave Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Leave Type</label>
                  <select 
                    value={form.leaveType}
                    onChange={e => setForm({ ...form, leaveType: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'white' }}
                  >
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Conference">Conference</option>
                    <option value="Training">Training</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Hospital Duty Outside Campus">Hospital Duty Outside Campus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Dates Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Start Date</label>
                    <input 
                      type="date"
                      required
                      min={editingLeaveId ? undefined : getISTDateString()}
                      value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>End Date</label>
                    <input 
                      type="date"
                      required
                      min={form.startDate}
                      value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })}
                      style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Status Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Leave Status</label>
                  <select 
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as any })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'white' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Reason Text */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Reason / Note</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide comments or notes (max 250 characters)..."
                    maxLength={250}
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', resize: 'none' }}
                  />
                  <div style={{ alignSelf: 'flex-end', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {form.reason.length}/250
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={actionLoading} 
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '44px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {actionLoading && <Loader2 size={16} className="spin-animation" />}
                  <span>{editingLeaveId ? 'Save Changes' : 'Confirm Schedule'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="modal-overlay" style={{ zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                border: '1px solid var(--border-muted)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <AlertTriangle size={20} color="white" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                  Delete Leave Schedule
                </h3>
              </div>
              
              <div style={{ padding: '24px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Are you sure you want to remove this leave entry? This will immediately reopen the slots for patient appointments.
              </div>
              
              <div style={{
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                background: '#f8fafc',
                borderTop: '1px solid var(--border-muted)'
              }}>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, leaveId: '' })}
                  disabled={actionLoading}
                  className="btn btn-secondary"
                  style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteLeave}
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    background: '#ef4444',
                    borderColor: '#ef4444',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {actionLoading && <Loader2 size={16} className="spin-animation" />}
                  <span>Delete Entry</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shared Style tags */}
      <style>{`
        .status-pill {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-pill.active { background: #dbeafe; color: #1d4ed8; }
        .status-pill.cancelled { background: #fee2e2; color: #b91c1c; }
        .status-pill.confirmed { background: #ccfbf1; color: #0f766e; }
        
        .action-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid var(--border-muted);
          display: inline-flex;
          align-items: center;
          justifyContent: center;
          cursor: pointer;
          transition: var(--transition-fast);
          background: white;
        }
        .action-icon-btn.edit { color: #4b5563; border-color: var(--border-muted); }
        .action-icon-btn.edit:hover { background: var(--primary); color: white; }
        .action-icon-btn.delete { color: #dc2626; border-color: rgba(220, 38, 38, 0.15); background: #fef2f2; }
        .action-icon-btn.delete:hover { background: #dc2626; color: white; }
        
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>

    </div>
  );
};

export default DoctorLeaveManagement;
