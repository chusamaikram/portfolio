import React, { useState, useEffect } from 'react';
import {
  Code,
  Palette,
  Zap,
  Award,
  Layers,
  Cpu,
  Server,
  Globe,
  Terminal,
  ShieldCheck,
  Sparkles,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  ExternalLink,
  ChevronRight,
  Sliders,
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import TechBadge from '../../components/ui/TechBadge.jsx';
import profileImg from '../../images/profile.webp';
import portfolioService, { INITIAL_PROFILE_INFO } from '../../services/portfolio.service.js';

const TELEMETRY_STATS = [
  { icon: Code, value: '8+', label: 'Production Systems', sub: 'Shipped & Live Deployments' },
  { icon: Zap, value: '60 FPS', label: 'Frame Budget', sub: 'Hardware-Accelerated WebGL' },
  { icon: ShieldCheck, value: '99.4%', label: 'Performance SLA', sub: 'Google Lighthouse Audit' },
  { icon: Cpu, value: '< 150KB', label: 'Initial Payload', sub: 'Tree-Shaken Modular Chunks' },
];

const SKILL_CATEGORIES = [
  {
    id: 'core',
    name: 'Frontend Core',
    items: [
      { name: 'HTML5 Semantic DOM & A11y', level: 95, icon: Code },
      { name: 'CSS3 / Modern Flex & Grid', level: 92, icon: Palette },
      { name: 'JavaScript (ES6+ / Modern)', level: 90, icon: Terminal },
      { name: 'TypeScript Strict Mode', level: 68, icon: ShieldCheck },
    ],
  },
  {
    id: 'frameworks',
    name: 'Frameworks & Libs',
    items: [
      { name: 'React.js 19 Concurrent Core', level: 94, icon: Cpu },
      { name: 'Tailwind CSS Utility Engine', level: 96, icon: Sparkles },
      { name: 'Next.js 14/15 App Router', level: 55, icon: Layers },
      { name: 'Framer Motion & Spring Physics', level: 65, icon: Sparkles },
      { name: 'Three.js / WebGL Shaders', level: 58, icon: Globe },
    ],
  },
  {
    id: 'backend_cloud',
    name: 'Backend & Cloud',
    items: [
      { name: 'Django 5 REST Framework', level: 82, icon: Server },
      { name: 'Python Enterprise Core', level: 80, icon: Terminal },
      { name: 'Vite HMR & Bundler Tuning', level: 92, icon: Zap },
      { name: 'Git Trunk & CI/CD Pipelines', level: 85, icon: Server },
    ],
  },
];

const DIRECTIVES = [
  {
    icon: Code,
    title: 'Enterprise Architecture',
    description:
      'Designing component hierarchies that scale cleanly. Leveraging compound component patterns, custom hooks, and decoupled state machines.',
    tag: 'ARCHITECTURE',
    metric: 'Zero Layout Shift',
  },
  {
    icon: Zap,
    title: 'Kinetic 3D & Micro-Interactions',
    description:
      'Infusing interfaces with high-performance Three.js shaders and smooth CSS transforms that maintain solid 60 FPS frame rates.',
    tag: 'INTERACTIONS',
    metric: 'Sub-16ms Budget',
  },
  {
    icon: ShieldCheck,
    title: 'Resilient API Integration',
    description:
      'Implementing interceptor-backed Axios pipelines with automatic JWT cookie rotation, offline heuristic caching, and graceful failure boundaries.',
    tag: 'INFRASTRUCTURE',
    metric: 'HttpOnly Strict',
  },
];

export const AboutBento = () => {
  const [profile, setProfile] = useState(() =>
    portfolioService.getProfileInfoSync ? portfolioService.getProfileInfoSync() : INITIAL_PROFILE_INFO
  );
  const [activeConsoleTab, setActiveConsoleTab] = useState('skills'); // 'skills' | 'directives' | 'manifest'
  const [skillCategoryTab, setSkillCategoryTab] = useState('core');
  const [copiedManifest, setCopiedManifest] = useState(false);

  useEffect(() => {
    let isMounted = true;
    portfolioService.getProfileInfo().then((data) => {
      if (isMounted && data) {
        setProfile(data);
      }
    });

    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_profile_info') {
        try {
          const parsed = JSON.parse(e.newValue);
          setProfile(parsed);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const avatarSrc = profile?.avatar || profileImg;

  const manifestJSON = JSON.stringify(
    {
      operator: profile?.name || 'Usama Ikram',
      designation: profile?.title || 'Principal Frontend Architect & Web Engineer',
      location: profile?.location || 'Lahore, Pakistan',
      status: profile?.status || 'Online // Ready for Deployment',
      architecture_standards: ['Strict DRY', 'Atomic Components', 'Sub-16ms Frame Budget'],
      core_stack: ['React 19', 'Tailwind CSS', 'Django 5 DRF', 'Three.js', 'Vite'],
      telemetry: {
        latency: '12ms',
        security: 'JWT HttpOnly Strict',
        lighthouse: '99/100',
      },
    },
    null,
    2
  );

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestJSON);
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <SectionHeader
          badge="CYBER TELEMETRY // OPERATOR PROTOCOL"
          title="Engineering &"
          highlight="Architectural Matrix"
          subtitle="A dedicated frontend engineer crafting scalable user interfaces with clean abstractions, micro-interactions, and robust state management."
        />

        {/* Master Command Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          
          {/* Left Column: Operator Identity HUD Card (5 cols on lg) */}
          <GlassCard
            cyberCorners
            glowColor="cyan"
            className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient subtle light glow without expensive blur filters */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(34,211,238,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div>
              {/* Header Telemetry Status Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="tracking-widest font-bold">OPERATOR HUD</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400 font-semibold tracking-wider">
                    {profile?.status ? 'ACTIVE // ONLINE' : 'READY // ONLINE'}
                  </span>
                </div>
              </div>

              {/* Headshot with Cyber Reticle & Scanner */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                
                <div className="relative group shrink-0">
                  {/* Decorative Outer Cyber Brackets */}
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-cyan-400 z-20 pointer-events-none" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-400 z-20 pointer-events-none" />

                  {/* Main Avatar Container */}
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.25)] bg-slate-950 relative">
                    <img
                      src={avatarSrc}
                      alt={profile?.name || 'Usama Ikram'}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Animated Scanning Laser Line */}
                    <div
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 shadow-[0_0_12px_#22d3ee] pointer-events-none"
                      style={{
                        animation: 'float 3.5s ease-in-out infinite alternate',
                      }}
                    />

                    {/* Holographic Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  </div>

                  {/* Holographic Pill Indicator */}
                  <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-mono text-[9px] uppercase font-bold tracking-wider shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                    #0404
                  </span>
                </div>

                {/* Identity telemetry */}
                <div className="text-center sm:text-left space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-[10px] font-mono text-cyan-300">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>VERIFIED OPERATOR</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile?.name || 'Usama Ikram'}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-200/90 font-medium">
                    {profile?.title || 'Principal Frontend Architect & Web Engineer'}
                  </p>
                  <p className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-1">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{profile?.location || 'Lahore, Pakistan • GMT+5'}</span>
                  </p>
                </div>
              </div>

              {/* Bio Statement */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 mb-6">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  "{profile?.bio || 'Specialized in engineering sleek, modular frontend components with modern React, Tailwind CSS, and lightweight 3D graphics. Committed to continuous learning, zero technical debt, and pixel precision.'}"
                </p>
              </div>
            </div>

            {/* Quick Architecture Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-4 border-t border-white/10">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">CORE ARCHITECTURE</div>
                <div className="text-cyan-300 font-semibold text-xs mt-0.5">React 19 & Next.js</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">STYLING ENGINE</div>
                <div className="text-cyan-300 font-semibold text-xs mt-0.5">Tailwind CSS & CSS3</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">BACKEND SERVICES</div>
                <div className="text-cyan-300 font-semibold text-xs mt-0.5">Django 5 DRF & JWT</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-slate-400 text-[10px] uppercase">VISUALS & MOTION</div>
                <div className="text-cyan-300 font-semibold text-xs mt-0.5">Three.js / WebGL</div>
              </div>
            </div>
          </GlassCard>

          {/* Right Column: Multi-View Command Console (7 cols on lg) */}
          <GlassCard
            cyberCorners
            glowColor="blue"
            className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient blue light */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div>
              {/* Header with 3 Console Switcher Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                      Architectural Command Deck
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Technical telemetry, mission directives & machine manifest
                  </p>
                </div>

                {/* 3 Console View Tabs */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10">
                  <button
                    onClick={() => setActiveConsoleTab('skills')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeConsoleTab === 'skills'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Skills Matrix
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('directives')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      activeConsoleTab === 'directives'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Directives
                  </button>
                  <button
                    onClick={() => setActiveConsoleTab('manifest')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1 ${
                      activeConsoleTab === 'manifest'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    Manifest
                  </button>
                </div>
              </div>

              {/* VIEW 1: Skills Proficiency Matrix */}
              {activeConsoleTab === 'skills' && (
                <div>
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {SKILL_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSkillCategoryTab(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          skillCategoryTab === cat.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                            : 'bg-white/[0.03] text-slate-400 border border-white/5 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* High-Performance Progress Bars */}
                  <div className="space-y-4">
                    {SKILL_CATEGORIES.find((c) => c.id === skillCategoryTab)?.items.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <div key={skill.name} className="space-y-1.5 group">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <div className="flex items-center gap-2 text-slate-200 group-hover:text-cyan-300 transition-colors">
                              <Icon className="w-4 h-4 text-cyan-400" />
                              <span className="font-medium">{skill.name}</span>
                            </div>
                            <span className="text-cyan-400 font-bold">{skill.level}%</span>
                          </div>

                          <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-white/10 p-[1px]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIEW 2: Architectural Directives */}
              {activeConsoleTab === 'directives' && (
                <div className="space-y-3.5">
                  {DIRECTIVES.map((directive) => {
                    const Icon = directive.icon;
                    return (
                      <div
                        key={directive.title}
                        className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-white tracking-wide">
                              {directive.title}
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30">
                            {directive.metric}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300/80 leading-relaxed pl-10 font-light">
                          {directive.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW 3: Machine-Readable Manifest Terminal */}
              {activeConsoleTab === 'manifest' && (
                <div className="rounded-xl bg-slate-950/90 border border-cyan-500/20 p-4 font-mono text-xs relative group">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] text-slate-400">
                    <span className="text-cyan-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5" />
                      operator_manifest.json
                    </span>
                    <button
                      onClick={handleCopyManifest}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                    >
                      {copiedManifest ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-cyan-400" />
                          <span>COPY CONFIG</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="text-cyan-200 text-[11px] leading-relaxed overflow-x-auto max-h-56 scrollbar-thin">
                    {manifestJSON}
                  </pre>
                </div>
              )}
            </div>

            {/* Matrix Quick Badges */}
            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10">
              <TechBadge name="React 19" variant="glow" />
              <TechBadge name="Tailwind CSS" variant="glow" />
              <TechBadge name="Next.js" variant="default" />
              <TechBadge name="Django 5 DRF" variant="glow" />
              <TechBadge name="Three.js / WebGL" variant="default" />
              <TechBadge name="JWT Auth" variant="default" />
              <TechBadge name="Vite Bundler" variant="default" />
            </div>
          </GlassCard>

          {/* Full-Width Telemetry KPI Dock (12 cols) */}
          <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TELEMETRY_STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <GlassCard
                  key={stat.label}
                  glowColor="cyan"
                  className="p-5 text-center flex flex-col items-center justify-center hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 mb-2.5 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mb-1 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mb-0.5">{stat.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{stat.sub}</div>
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
