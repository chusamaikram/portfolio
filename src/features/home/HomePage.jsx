import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';
import HeroSection from './HeroSection.jsx';
import TechMarqueeSlider from '../../components/ui/TechMarqueeSlider.jsx';
import AboutBento from './AboutBento.jsx';
import ProjectsGrid from './ProjectsGrid.jsx';
import TestimonialsSection from './TestimonialsSection.jsx';
import ContactSection from './ContactSection.jsx';
import AIChatTerminal from './AIChatTerminal.jsx';

export const HomePage = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Dynamic ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <Navbar onOpenAiChat={() => setIsAiOpen(true)} />

      <main className="relative z-10">
        <HeroSection onOpenAiChat={() => setIsAiOpen(true)} />
        <TechMarqueeSlider />
        <AboutBento />
        <ProjectsGrid onOpenAiChat={() => setIsAiOpen(true)} />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Floating Holographic AI Terminal */}
      <AIChatTerminal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onToggle={(state) => setIsAiOpen(state !== undefined ? state : !isAiOpen)}
      />
    </div>
  );
};

export default HomePage;
