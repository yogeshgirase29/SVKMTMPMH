import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home as HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
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
      <div className="floating-blob blob-blue" style={{ width: '300px', height: '300px' }}></div>
      <div className="floating-blob blob-cyan" style={{ width: '250px', height: '250px', bottom: '10%', right: '10%' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '40px 30px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid var(--border-glass-blue)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--med-blue-light)',
          color: 'var(--med-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: 'var(--shadow-md)'
        }}>
          <AlertCircle size={36} />
        </div>

        <h1 style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          background: 'var(--gradient-primary)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '10px'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '1.5rem',
          color: 'var(--primary)',
          marginBottom: '16px'
        }}>
          Page Not Found
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.98rem',
          marginBottom: '32px',
          lineHeight: 1.6
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link 
          to="/" 
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            width: '100%',
            justifyContent: 'center',
            height: '48px',
            gap: '10px'
          }}
        >
          <HomeIcon size={18} />
          Back to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
