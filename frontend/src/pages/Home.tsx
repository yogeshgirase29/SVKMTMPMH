import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Stats } from '../components/Stats';
import { Services } from '../components/Services';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Departments } from '../components/Departments';
import { Doctors } from '../components/Doctors';
import { Gallery } from '../components/Gallery';
import { News } from '../components/News';
import { Testimonials } from '../components/Testimonials';
import { CTA } from '../components/CTA';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { AppointmentModal, AppointmentStatusModal } from '../components/Modals';
import type { Language } from '../utils/translations';

const Home: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('statusId')) {
      setIsStatusOpen(true);
    }
  }, [location]);

  const handleOpenAppointment = () => setIsAppointmentOpen(true);
  const handleCloseAppointment = () => setIsAppointmentOpen(false);

  const handleOpenStatus = () => setIsStatusOpen(true);
  const handleCloseStatus = () => setIsStatusOpen(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation */}
      <Navbar 
        language={language}
        setLanguage={setLanguage}
        onOpenAppointment={handleOpenAppointment} 
        onOpenStatus={handleOpenStatus}
      />

      {/* Main Content Sections */}
      <main style={{ flexGrow: 1 }}>
        <Hero 
          language={language}
          onOpenAppointment={handleOpenAppointment} 
        />
        <Stats language={language} />
        <Services language={language} />
        <WhyChooseUs language={language} />
        <Departments language={language} />
        <Doctors language={language} />
        <Gallery language={language} />
        <News language={language} />
        <Testimonials language={language} />
        <CTA language={language} onOpenAppointment={handleOpenAppointment} />
        <Contact language={language} />
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Interactive Overlay Modals */}
      <AppointmentModal 
        language={language}
        isOpen={isAppointmentOpen} 
        onClose={handleCloseAppointment} 
      />
      <AppointmentStatusModal 
        language={language}
        isOpen={isStatusOpen} 
        onClose={handleCloseStatus} 
      />
    </div>
  );
};

export default Home;
