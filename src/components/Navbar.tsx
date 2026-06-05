import React, { useState, useEffect } from 'react';
import { Stethoscope, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenAppointment: () => void;
  onOpenReports: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAppointment, onOpenReports }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Workflow', href: '#workflow' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Reviews', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
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
    <>
      <nav 
        className={`glass-navbar`} 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 900,
          transition: 'all var(--transition-normal)',
          padding: scrolled ? '12px 0' : '20px 0',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)',
          borderBottom: scrolled ? '1px solid rgba(2, 132, 199, 0.08)' : '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.4rem' }}
          >
            <div style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              padding: '6px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Stethoscope size={24} />
            </div>
            <span style={{ letterSpacing: '-0.5px' }}>
              SVKM | <span style={{ color: 'var(--med-blue)', fontWeight: 600 }}>TMPM HOSPITAL</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div style={{ display: 'none' }} className="desktop-menu-wrapper">
            {/* Will show via inline styles / media query injected styling */}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="nav-actions-desktop">
            <div className="nav-links-container" style={{ display: 'flex', gap: '28px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  style={{
                    fontWeight: 500,
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                  className="nav-link-item"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button 
                onClick={onOpenReports}
                className="btn btn-secondary" 
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                View Reports
              </button>
              
              <button 
                onClick={onOpenAppointment}
                className="btn btn-primary" 
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              display: 'none',
              padding: '6px'
            }}
            className="mobile-menu-toggle"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Global style injection for responsiveness of navbar */}
        <style>{`
          @media (max-width: 991px) {
            .nav-actions-desktop {
              display: none !important;
            }
            .mobile-menu-toggle {
              display: block !important;
            }
          }
          .nav-link-item:hover {
            color: var(--med-blue) !important;
          }
        `}</style>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              zIndex: 899,
              boxShadow: 'var(--shadow-lg)',
              borderBottom: '1px solid var(--border-muted)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    padding: '8px 0',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  {link.name}
                </a>
              ))}
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                <button 
                  onClick={() => { setIsOpen(false); onOpenReports(); }}
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '12px' }}
                >
                  View Reports
                </button>
                <button 
                  onClick={() => { setIsOpen(false); onOpenAppointment(); }}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px' }}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
