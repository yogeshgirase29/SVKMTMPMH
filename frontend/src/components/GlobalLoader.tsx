import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addLoadingListener, removeLoadingListener } from '../services/api';

export const GlobalLoader: React.FC = () => {
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: any = null;
    const handleLoading = (loading: boolean) => {
      if (loading) {
        setIsBlocking(true);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setIsLoading(true);
        }, 150);
      } else {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        setIsLoading(false);
        setIsBlocking(false);
      }
    };
    addLoadingListener(handleLoading);
    return () => {
      removeLoadingListener(handleLoading);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Click Blocking Overlay (rendered instantly, transparent) */}
      {isBlocking && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'transparent',
            zIndex: 99998, // just below the visible loader
            pointerEvents: 'auto'
          }}
        />
      )}

      {/* Visible Loader Spinner */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(4px)',
              zIndex: 99999, // Make sure it sits on top of all modals/elements
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto' // Prevent user click-throughs
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 360 }}
              style={{
                background: 'white',
                border: '1px solid rgba(2, 132, 199, 0.1)',
                borderRadius: '16px',
                padding: '24px 40px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Loader2 size={36} className="spin-animation" style={{ color: 'var(--med-blue)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.3px' }}>
                Processing...
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
