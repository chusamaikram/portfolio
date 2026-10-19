import React, { useState } from 'react';
import {
  Code,
  Palette,
  Zap,
  Coffee,
  Award,
  Layers,
  Cpu,
  Server,
  Globe,
  Terminal,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import TechBadge from '../../components/ui/TechBadge.jsx';
import profileImg from '../../images/profile.webp';

const STATS = [
  { icon: Code, value: '8+', label: 'Shipped Projects', sub: 'Production & Replicas' },
  { icon: Coffee, value: '350+', label: 'Caffeine Units', sub: 'Burned in Late Commits' },
  { icon: Award, value: '3+', label: 'Months Experience', sub: 'Intensive Frontend Dev' },
  { icon: Zap, value: '60 FPS', label: 'Performance Metric', sub: 'Optimized Animations' },
];

const SKILL_CATEGORIES = [
  {
    id: 'core',
    name: 'Frontend Core',
    items: [
      { name: 'HTML5 Semantic', level: 95, icon: Code },
      { name: 'CSS3 / Modern Layouts', level: 92, icon: Palette },
      { name: 'JavaScript (ES6+)', level: 90, icon: Terminal },
      { name: 'TypeScript', level: 65, icon: ShieldCheck },
    ],
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Libs',
    items: [
      { name: 'React.js 19', level: 92, icon: Cpu },
      { name: 'Tailwind CSS', level: 95, icon: Sparkles },
      { name: 'Next.js 14/15', level: 45, icon: Layers },
      { name: 'Framer Motion', level: 60, icon: Sparkles },
      { name: 'Three.js / R3F', level: 50, icon: Globe },
    ],
  },
  {
    id: 'tools',
    name: 'Tools & Ecosystem',
    items: [
      { name: 'Git & GitHub', level: 80, icon: Server },
      { name: 'Vite Bundler', level: 92, icon: Zap },
      { name: 'Axios & Interceptors', level: 90, icon: ShieldCheck },
      { name: 'Vercel Deployment', level: 88, icon: Globe },
    ],
  },
];

const SERVICES = [
  {
    icon: Code,
    title: 'Enterprise Web Development',
    description:
      'Building performant, accessible single-page web applications with React 19, strict type patterns, and modular architectures.',
  },
  {
    icon: Palette,
    title: 'High-Fidelity UI/UX Replicas',
    description:
      'Translating Figma or real-world web studio designs into pixel-perfect responsive layouts with zero layout shifts.',
  },
  {
    icon: Zap,
    title: 'Performance & 3D Visuals',
    description:
      'Integrating lightweight WebGL holograms, smooth micro-interactions, and high-efficiency CSS/Tailwind animations.',
  },
];

export const AboutBento = () => {
  const [activeTab, setActiveTab] = useState('core');

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="SYSTEM TELEMETRY // PROFILE MATRIX"
          title="Engineering &"
          highlight="Architectural Philosophy"
          subtitle="A dedicated frontend engineer crafting scalable user interfaces with clean abstractions, micro-interactions, and robust state management."
        />

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16">
          
          {/* Bento Item 1: Profile HUD Card (Spans 5 cols on lg) */}
          <GlassCard
            cyberCorners
            glowColor="cyan"
            className="md:col-span-12 lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              {/* Profile Image with Cyber Ring */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.25)] bg-slate-900">
                  <img
                    src={profileImg}
                    alt="Usama Ikram"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                  ACTIVE
                </span>
              </div>

              {/* Identity telemetry */}
              <div className="text-center sm:text-left space-y-1">
                <div className="font-mono text-xs text-cyan-400">OPERATOR ID #0404</div>
                <h3 className="text-2xl font-bold text-white">Usama Ikram</h3>
                <p className="text-sm text-slate-300">Frontend Web Developer</p>
                <p className="text-xs text-slate-400 font-mono">Lahore, Pakistan • GMT+5</p>
              </div>
            </div>

            <p className="text-sm text-slate-300/90 leading-relaxed mb-6 font-light">
              Specialized in engineering sleek, modular frontend components with modern React, Tailwind CSS, and lightweight 3D graphics. Committed to continuous learning, zero technical debt, and pixel precision.
            </p>

            {/* Quick telemetry specs */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-4 border-t border-white/10">
              <div className="p-2.5 rounded-lg bg-white/5">
                <div className="text-slate-400 text-[10px]">CORE SPECIALTY</div>
                <div className="text-cyan-300 font-semibold">React & Tailwind</div>
              </div>
              <div className="p-2.5 rounded-lg bg-white/5">
                <div className="text-slate-400 text-[10px]">CURRENT FOCUS</div>
                <div className="text-cyan-300 font-semibold">Next.js & AI UI</div>
              </div>
            </div>
          </GlassCard>

          {/* Bento Item 2: Interactive Skill Matrix (Spans 7 cols on lg) */}
          <GlassCard
            cyberCorners
            glowColor="blue"
            className="md:col-span-12 lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    Technical Proficiency Matrix
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Real-time skill levels based on production code & UI replicas
                  </p>
                </div>

                {/* Category Switcher Tabs */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10">
                  {SKILL_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveTab(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        activeTab === cat.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Bars */}
              <div className="space-y-4">
                {SKILL_CATEGORIES.find((c) => c.id === activeTab)?.items.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2 text-slate-200">
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span>{skill.name}</span>
                        </div>
                        <span className="text-cyan-400 font-bold">{skill.level}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matrix Tags */}
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10">
              <TechBadge name="React 19" variant="glow" />
              <TechBadge name="Next.js" variant="default" />
              <TechBadge name="Tailwind CSS" variant="glow" />
              <TechBadge name="Three.js" variant="default" />
              <TechBadge name="Axios Client" variant="default" />
              <TechBadge name="Framer Motion" variant="default" />
            </div>
          </GlassCard>

          {/* Bento Item 3: Live Stats Grid (Spans 12 cols) */}
          <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <GlassCard
                  key={stat.label}
                  glowColor="cyan"
                  className="p-5 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 mb-0.5">{stat.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{stat.sub}</div>
                </GlassCard>
              );
            })}
          </div>

          {/* Bento Item 4: Services Spectrum (Spans 12 cols) */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <GlassCard
                  key={srv.title}
                  cyberCorners
                  glowColor="blue"
                  className="p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{srv.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{srv.description}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutBento;
