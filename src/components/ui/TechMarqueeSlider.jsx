import React from 'react';

const ROW_1_TECHS = [
  { name: 'JavaScript' },
  { name: 'Next.js', highlighted: true },
  { name: 'jQuery' },
  { name: 'Bootstrap' },
  { name: 'Tailwind CSS', highlighted: true },
  { name: 'HTML5' },
  { name: 'CSS3' },
  { name: 'TypeScript' },
  { name: 'React.js', highlighted: true },
  { name: 'Redux Toolkit' },
  { name: 'Framer Motion' },
  { name: 'Three.js / R3F', highlighted: true },
  { name: 'Echarts' },
];

const ROW_2_TECHS = [
  { name: 'Vercel' },
  { name: 'Node.js', highlighted: true },
  { name: 'npm' },
  { name: 'Webpack' },
  { name: 'Figma', highlighted: true },
  { name: 'Git' },
  { name: 'GitHub' },
  { name: 'VS Code' },
  { name: 'Django 5', highlighted: true },
  { name: 'Python' },
  { name: 'REST APIs' },
  { name: 'Postman' },
  { name: 'Docker', highlighted: true },
  { name: 'Vite' },
];

export const TechMarqueeSlider = () => {
  // Duplicate arrays to ensure seamless infinite looping marquee
  const row1Items = [...ROW_1_TECHS, ...ROW_1_TECHS];
  const row2Items = [...ROW_2_TECHS, ...ROW_2_TECHS];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden border-y border-white/[0.06] bg-[#050814]">
      
      {/* Central subtle cyan ambient glow matching live portfolio */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[180px] bg-[radial-gradient(circle,rgba(34,211,238,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Subtitle Header */}
      <div className="relative z-10 text-center mb-8 px-4">
        <p className="text-xs sm:text-sm font-medium text-slate-400 tracking-wide font-sans">
          Technologies I use daily
        </p>
      </div>

      {/* Edge Gradient Fades for Smooth Seamless Sliding */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 md:w-56 z-20 pointer-events-none bg-gradient-to-r from-[#050814] via-[#050814]/90 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 md:w-56 z-20 pointer-events-none bg-gradient-to-l from-[#050814] via-[#050814]/90 to-transparent" />

      {/* Marquee Track Container */}
      <div className="relative w-full flex flex-col gap-4 sm:gap-5 overflow-hidden">
        
        {/* ROW 1: Slides Left to Right (or Right to Left) */}
        <div className="flex overflow-hidden pause-hover select-none">
          <div className="animate-marquee-left flex items-center gap-3 sm:gap-4 shrink-0">
            {row1Items.map((tech, idx) => (
              <div
                key={`r1-${tech.name}-${idx}`}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-default ${
                  tech.highlighted
                    ? 'bg-[#081b29] border border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.25)] hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:scale-105'
                    : 'bg-[#0b1220]/90 border border-white/10 text-slate-300 hover:bg-[#081b29] hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:scale-105'
                }`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Slides in the OPPOSITE Direction */}
        <div className="flex overflow-hidden pause-hover select-none">
          <div className="animate-marquee-right flex items-center gap-3 sm:gap-4 shrink-0">
            {row2Items.map((tech, idx) => (
              <div
                key={`r2-${tech.name}-${idx}`}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-default ${
                  tech.highlighted
                    ? 'bg-[#081b29] border border-cyan-400 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.25)] hover:shadow-[0_0_24px_rgba(34,211,238,0.45)] hover:scale-105'
                    : 'bg-[#0b1220]/90 border border-white/10 text-slate-300 hover:bg-[#081b29] hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:scale-105'
                }`}
              >
                {tech.name}
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};

export default TechMarqueeSlider;
