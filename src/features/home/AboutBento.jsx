import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Zap,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Box,
} from 'lucide-react';
import profileImg from '../../images/profile.webp';
import aboutImg from '../../images/about.webp';
import portfolioService, {
  INITIAL_PROFILE_INFO,
  INITIAL_SKILLS,
} from '../../services/portfolio.service.js';

export const AboutBento = () => {
  const [profile, setProfile] = useState(() =>
    portfolioService.getProfileInfoSync
      ? portfolioService.getProfileInfoSync()
      : INITIAL_PROFILE_INFO
  );
  const [skillsData, setSkillsData] = useState(INITIAL_SKILLS);
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    portfolioService.getProfileInfo().then((data) => {
      if (isMounted && data) setProfile(data);
    });

    portfolioService.getSkills().then((cats) => {
      if (isMounted && cats && cats.length > 0) {
        setSkillsData(cats);
      }
    });

    const handleStorageChange = (e) => {
      if (e.key === 'portfolio_profile_info') {
        try {
          const parsed = JSON.parse(e.newValue);
          setProfile(parsed);
        } catch { }
      }
      if (e.key === 'portfolio_skills_data') {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSkillsData(parsed);
          }
        } catch { }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Ensure no parent wrapper (like App, main, or body) has overflow:hidden that breaks native GPU sticky
  useEffect(() => {
    let el = sectionRef.current?.parentElement;
    while (el && el !== document.documentElement) {
      const style = window.getComputedStyle(el);
      if (style.overflowX === 'hidden' || style.overflow === 'hidden') {
        el.style.overflowX = 'clip';
      }
      el = el.parentElement;
    }
  }, []);

  const cutoutSrc = aboutImg || profile?.avatar || profileImg;

  const scrollToContact = () => {
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProjects = () => {
    const projects = document.getElementById('projects');
    if (projects) {
      projects.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const coreServices = [
    {
      icon: Box,
      title: 'PROTOTYPING',
      description:
        'Rapid interactive prototyping and high-fidelity functional concepts that bring ideas to life before full-scale engineering.',
    },
    {
      icon: Layers,
      title: 'FRONTEND ARCHITECTURE',
      description:
        'Scalable component hierarchies, robust design systems, strict TypeScript interfaces, and zero layout shift web apps.',
    },
    {
      icon: Zap,
      title: 'DESIGN CONSULTING',
      description:
        'Expert guidance on modern UI/UX engineering, sub-16ms WebGL motion performance, and enterprise frontend scalability.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-[260vh] bg-background text-foreground [overflow-x:clip]"
    >
      {/* ============================================================== */}
      {/* 1. FOREGROUND STICKY LAYER — GPU LOCKED PORTRAIT (z-20)        */}
      {/* Uses h-[100svh] so mobile address bars never cause a jump      */}
      {/* ============================================================== */}
      <div className="sticky top-0 left-0 h-[100svh] w-full flex items-end justify-center z-20 pointer-events-none overflow-hidden [transform:translate3d(0,0,0)] will-change-transform">
        <img
          src={cutoutSrc}
          alt={profile?.name || 'Usama Ikram'}
          className="h-[80svh] lg:h-[90svh] w-auto max-w-[90vw] object-contain object-bottom pointer-events-none select-none [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]"
        />
      </div>

      {/* ============================================================== */}
      {/* 2. BACKGROUND WATERMARK TYPOGRAPHY LAYER (z-0, clipped safely) */}
      {/* ============================================================== */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      >
        <div
          className="absolute top-[28vh] left-1/2 -translate-x-1/2 text-[15vw] lg:text-[11vw] font-black uppercase tracking-tighter text-transparent opacity-10 whitespace-nowrap"
          style={{ WebkitTextStroke: '2px currentColor', color: 'var(--primary, #e2f163)' }}
        >
          {profile?.name || 'USAMA IKRAM'}
        </div>

        <div
          className="absolute top-[115vh] left-1/2 -translate-x-1/2 text-[15vw] lg:text-[11vw] font-black uppercase tracking-tighter text-transparent opacity-15 whitespace-nowrap"
          style={{ WebkitTextStroke: '2px currentColor' }}
        >
          WEB ARCHITECT
        </div>

        <div
          className="absolute top-[195vh] left-1/2 -translate-x-1/2 text-[15vw] lg:text-[11vw] font-black uppercase tracking-tighter text-transparent opacity-10 whitespace-nowrap"
          style={{ WebkitTextStroke: '2px currentColor', color: 'var(--primary, #e2f163)' }}
        >
          FULL STACK
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MIDGROUND SCROLLING CONTENT TRACK (z-10)                    */}
      {/* Pulls up by -mt-[100svh] to align exactly with the portrait    */}
      {/* ============================================================== */}
      <div className="relative z-10 -mt-[100svh] max-w-7xl mx-auto px-6 md:px-12 pb-[20vh]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

          {/* ========================================================== */}
          {/* LEFT COLUMN: Headings, Bio, CTAs, Stats & Story Cards      */}
          {/* ========================================================== */}
          <div className="lg:col-span-4 flex flex-col gap-[20vh] lg:gap-[40vh] pt-[12vh] lg:pt-[18vh]">

            {/* Block 1 (Initial Viewport): Master Headline, Bio, Buttons, Metrics */}
            <div className="space-y-6 rounded-xl border border-border bg-background/80 backdrop-blur-md p-6 lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.08]">
                {profile?.name || 'Usama Ikram'} is <br />
                <span className="text-primary">Right Here!</span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm font-normal">
                {profile?.bio ||
                  'With a seasoned eye for design and architecture, I transform complex ideas into elegant, high-performance web products that speak through their fluid functionality.'}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <button
                  onClick={scrollToContact}
                  className="px-6 py-3.5 rounded-md bg-primary text-primary-foreground font-extrabold text-xs tracking-wider uppercase hover:opacity-90 transition-opacity cursor-pointer shadow-lg pointer-events-auto"
                >
                  CHAT WITH ME
                </button>

                <button
                  onClick={scrollToProjects}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground tracking-wider uppercase hover:text-primary transition-colors cursor-pointer pointer-events-auto"
                >
                  <span>START A PROJECT</span>
                  <ArrowUpRight className="w-4 h-4 text-primary" />
                </button>
              </div>

              {/* 2-Column Metrics Counter Row */}
              <div className="grid grid-cols-2 gap-8 pt-6 border-t border-border">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-primary font-sans">
                    98%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase font-mono tracking-wider">
                    Satisfaction Rate
                  </div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-primary font-sans">
                    100+
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase font-mono tracking-wider">
                    Projects Delivered
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2 (Scroll Continuation): Engineering Philosophy */}
            <div className="space-y-4 rounded-xl border border-border bg-background/80 backdrop-blur-md p-6 lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold">
                PHILOSOPHY // 01
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Engineering with <br />
                <span className="text-primary">Purpose & Rigor.</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                Every line of code is treated as a component of an overall system. I specialize in crafting decoupled UI hierarchies with strict type safety, zero layout shifts, and predictable state flow.
              </p>
              <div className="space-y-2 pt-2 text-xs font-mono text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Decoupled Atomic Component Hierarchies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Zero Layout Shift (CLS &lt; 0.01)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Sub-16ms GPU-Accelerated Frame Budgets</span>
                </div>
              </div>
            </div>

            {/* Block 3 (Scroll Continuation): Performance Standards */}
            <div className="space-y-4 rounded-xl border border-border bg-background/80 backdrop-blur-md p-6 lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold">
                STANDARDS // 02
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Architectural <br />
                <span className="text-primary">Performance First.</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                By optimizing asset pipelines, eliminating render bottlenecks, and enforcing resilient API error boundaries, applications remain responsive and accessible under heavy production scale.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="text-primary font-bold">100% WCAG</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Accessibility
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="text-primary font-bold">60 FPS</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    WebGL Budget
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================== */}
          {/* CENTER SPACER COLUMN: Keeps Lane Clear For Sticky Portrait */}
          {/* ========================================================== */}
          <div
            className="hidden lg:block lg:col-span-4 h-full pointer-events-none"
            aria-hidden="true"
          />

          {/* ========================================================== */}
          {/* RIGHT COLUMN: Services Stack & Technical Domains           */}
          {/* ========================================================== */}
          <div className="lg:col-span-4 flex flex-col gap-[20vh] lg:gap-[40vh] pt-[4vh] lg:pt-[18vh]">

            {/* Block 1 (Initial Viewport): 3 Services Stack */}
            <div className="space-y-10 rounded-xl border border-border bg-background/80 backdrop-blur-md p-6 lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              {coreServices.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div key={service.title} className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-border rounded-lg bg-card/50 text-primary">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-black tracking-widest uppercase text-primary">
                        {service.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 font-normal">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Block 2 (Scroll Continuation): Core Tech Stack */}
            <div className="space-y-4 rounded-xl border border-border bg-background/80 backdrop-blur-md p-6 lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold">
                STACK // 01
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Core Technologies & <br />
                <span className="text-primary">Modern Frameworks.</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                Extensive production experience delivering web apps across modern frontend and backend architectures:
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {(skillsData && skillsData.length > 0
                  ? skillsData.flatMap((cat) =>
                    Array.isArray(cat.skills)
                      ? cat.skills.map((s) => (typeof s === 'string' ? s : s.name))
                      : []
                  ).slice(0, 10)
                  : [
                    'React.js 19',
                    'Next.js',
                    'TypeScript',
                    'Tailwind CSS',
                    'Three.js / WebGL',
                    'Framer Motion',
                    'Django 5 DRF',
                    'Python Core',
                    'Vite Bundler',
                    'Git & CI/CD',
                  ]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-md text-xs font-mono border border-border bg-card/60 text-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Block 3 (Scroll Continuation): Delivery & Workflow */}
            <div className="space-y-4 rounded-xl border border-border bg-background/80 backdrop-blur-md p-6 lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0">
              <span className="text-xs font-mono text-primary uppercase tracking-widest font-semibold">
                WORKFLOW // 02
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Seamless <br />
                <span className="text-primary">Workflow & Delivery.</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-normal">
                From initial Figma wireframes to production deployment, every phase is managed with transparent communication, automated test suites, and strict milestone adherence.
              </p>

              <div className="p-4 rounded-lg border border-border bg-card/40 space-y-2">
                <div className="text-xs font-mono text-primary font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Production-Ready SLA</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Clean code reviews, modular pull requests, and verified cross-browser viewport compliance.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutBento;