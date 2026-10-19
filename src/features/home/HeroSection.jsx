import React, { Suspense } from 'react';
import { Download, Sparkles, Terminal, ArrowRight, Github, Linkedin, ExternalLink } from 'lucide-react';
import HologramLoader from '../../components/three/HologramLoader.jsx';
import NeonButton from '../../components/ui/NeonButton.jsx';
import GlassCard from '../../components/ui/GlassCard.jsx';

// Lazy-load the heavy 3D WebGL bundle to ensure initial paint is instant
const HeroHologram = React.lazy(() => import('../../components/three/HeroHologram.jsx'));

export const HeroSection = ({ onOpenAiChat }) => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 md:py-32 flex items-center justify-center overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid cyber overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Badges, CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-wider uppercase shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>USAMA-OS v2.4 // ARCHITECTURE STACK ONLINE</span>
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
              Hello, I’m <strong className="text-cyan-300 font-semibold">Usama Ikram</strong> — Frontend Web Developer & UI Architect. I specialize in enterprise React 19 ecosystems, responsive design engineering, and ultra-smooth WebGL interfaces.
            </p>

            {/* Quick Specs telemetry grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 pt-2 pb-2">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 backdrop-blur-sm text-center lg:text-left">
                <div className="font-mono text-cyan-400 font-bold text-lg sm:text-xl">60 FPS</div>
                <div className="text-[11px] text-slate-400 font-mono">Render Target</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 backdrop-blur-sm text-center lg:text-left">
                <div className="font-mono text-cyan-400 font-bold text-lg sm:text-xl">99.8%</div>
                <div className="text-[11px] text-slate-400 font-mono">Uptime SLA</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 backdrop-blur-sm text-center lg:text-left">
                <div className="font-mono text-cyan-400 font-bold text-lg sm:text-xl">React 19</div>
                <div className="text-[11px] text-slate-400 font-mono">Modern Core</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <NeonButton
                size="lg"
                variant="primary"
                onClick={() => scrollTo('projects')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Explore Projects
              </NeonButton>

              <NeonButton
                size="lg"
                variant="secondary"
                onClick={() => {
                  if (onOpenAiChat) onOpenAiChat();
                }}
                icon={Terminal}
              >
                Launch AI Assistant
              </NeonButton>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-cyan-400/40 text-sm font-medium transition-all"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Resume.pdf</span>
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

          {/* Right Column: 3D Holographic Model Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-[480px]">
              <Suspense fallback={<HologramLoader />}>
                <HeroHologram />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
