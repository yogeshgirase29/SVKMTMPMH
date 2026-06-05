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

const App: React.FC = () => {
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
        onOpenAppointment={handleOpenAppointment} 
        onOpenReports={handleOpenReports} 
      />

      {/* Main Content Sections */}
      <main style={{ flexGrow: 1 }}>
        <Hero 
          onOpenAppointment={handleOpenAppointment} 
          onOpenReports={handleOpenReports} 
        />
        <Stats />
        <Services />
        <WhyChooseUs />
        <Workflow />
        <Doctors />
        <Testimonials />
        <CTA onOpenAppointment={handleOpenAppointment} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Overlay Modals */}
      <AppointmentModal 
        isOpen={isAppointmentOpen} 
        onClose={handleCloseAppointment} 
      />
      <ReportModal 
        isOpen={isReportsOpen} 
        onClose={handleCloseReports} 
      />
    </div>
  );
};

export default App;
