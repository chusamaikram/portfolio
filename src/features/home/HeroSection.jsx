import React from 'react';
import { Download, ArrowRight, Github, Linkedin } from 'lucide-react';
import NeonButton from '../../components/ui/NeonButton.jsx';

import HeroVisualContainer from '../../components/three/HeroVisualContainer.jsx';

export const HeroSection = ({ onOpenAiChat }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 lg:pt-32 lg:pb-20 flex items-center justify-center overflow-hidden">
      {/* Background ambient lighting - pre-computed radial gradients without blur filters */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(34,211,238,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* Grid cyber overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading, Badges, CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-400/40 text-cyan-300 text-xs font-mono tracking-wider uppercase shadow-[0_0_20px_rgba(34,211,238,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Architecture & Engineering Opportunities</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Crafting <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                Future-Ready
              </span>{' '}
              Web Architectures
            </h1>

            {/* Subheading / Bio */}
            <p className="text-lg sm:text-xl text-slate-300/90 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Hello, I’m <strong className="text-cyan-300 font-semibold">Usama Ikram</strong> — Principal Frontend Architect & UI Engineer. Specialized in enterprise React 19 ecosystems, responsive design engineering, and ultra-smooth WebGL interfaces.
            </p>

            {/* Quick Specs telemetry grid - 60 FPS Optimized */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 pt-2 pb-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center lg:text-left">
                <div className="font-mono text-cyan-400 font-bold text-lg sm:text-xl">60 FPS</div>
                <div className="text-[11px] text-slate-400 font-mono">Render Target</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center lg:text-left">
                <div className="font-mono text-cyan-400 font-bold text-lg sm:text-xl">99.8%</div>
                <div className="text-[11px] text-slate-400 font-mono">Clean Code SLA</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 text-center lg:text-left">
                <div className="font-mono text-cyan-400 font-bold text-lg sm:text-xl">React 19</div>
                <div className="text-[11px] text-slate-400 font-mono">Modern Core</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <NeonButton
                size="lg"
                variant="primary"
                onClick={() => scrollTo('projects')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Explore Projects
              </NeonButton>

              <a
                href="/resume.pdf"
                download="Usama_Ikram_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center justify-center gap-2.5 px-6 py-3 text-base rounded-xl font-semibold bg-slate-900/80 hover:bg-slate-800/90 text-white border border-cyan-400/40 hover:border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer group"
                title="Download Usama's Resume (PDF)"
              >
                <Download className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Social links & live availability tag */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-slate-400 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400">Available for Work & Freelance</span>
              </div>
              <span className="text-white/20">•</span>
              <a
                href="https://github.com/chusamaikram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-white/20">•</span>
              <a
                href="https://linkedin.com/in/usama-ikram-252052182"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>

          </div>

          {/* Right Column: Dynamic 3D Visual Showcase (Laptop, Neural Core, or Quantum Sphere) */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            <HeroVisualContainer />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
