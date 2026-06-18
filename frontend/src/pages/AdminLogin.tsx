import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await login({ username, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || 'Login failed. Please verify credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blobs */}
      <div className="floating-blob blob-blue" style={{ width: '400px', height: '400px' }}></div>
      <div className="floating-blob blob-cyan" style={{ width: '350px', height: '350px', bottom: '15%', right: '5%' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '40px 32px',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid var(--border-glass-blue)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            marginBottom: '16px'
          }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary)', fontWeight: 800 }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
            Enter your credentials to access the hospital dashboard
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                disabled={isSubmitting}
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-muted)',
                  fontSize: '0.95rem',
                  transition: 'var(--transition-fast)',
                  backgroundColor: 'white'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-muted)',
                  fontSize: '0.95rem',
                  transition: 'var(--transition-fast)',
                  backgroundColor: 'white'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || loading}
            style={{
              width: '100%',
              height: '48px',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="spin-animation" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <style>{`
          .spin-animation {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
