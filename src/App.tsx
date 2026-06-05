import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Workflow } from './components/Workflow';
import { Doctors } from './components/Doctors';
import { Testimonials } from './components/Testimonials';
import { CTA } from './components/CTA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AppointmentModal, ReportModal } from './components/Modals';
import type { Language } from './utils/translations';


const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const handleOpenAppointment = () => setIsAppointmentOpen(true);
  const handleCloseAppointment = () => setIsAppointmentOpen(false);

  const handleOpenReports = () => setIsReportsOpen(true);
  const handleCloseReports = () => setIsReportsOpen(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation */}
      <Navbar 
        language={language}
        setLanguage={setLanguage}
        onOpenAppointment={handleOpenAppointment} 
        onOpenReports={handleOpenReports} 
      />

      {/* Main Content Sections */}
      <main style={{ flexGrow: 1 }}>
        <Hero 
          language={language}
          onOpenAppointment={handleOpenAppointment} 
          onOpenReports={handleOpenReports} 
        />
        <Stats language={language} />
        <Services language={language} />
        <WhyChooseUs language={language} />
        <Workflow language={language} />
        <Doctors language={language} />
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
      <ReportModal 
        language={language}
        isOpen={isReportsOpen} 
        onClose={handleCloseReports} 
      />
    </div>
  );
};

export default App;
