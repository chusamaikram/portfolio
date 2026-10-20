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
      
      {/* Dynamic ambient background gradients - GPU-accelerated pre-rasterized radial glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden gpu-layer">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(34,211,238,0.12)_0%,transparent_70%)]" />
        <div className="absolute top-1/3 right-1/4 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(59,130,246,0.10)_0%,transparent_70%)]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_70%)]" />
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
