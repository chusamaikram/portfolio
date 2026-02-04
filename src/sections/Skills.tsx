import { useEffect, useRef, useState } from 'react';

const skillCategories = [
  {
    name: 'Frontend Core',
    skills: [
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 92 },
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 50 },
    ],
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'React.js', level: 92 },
      { name: 'Next.js', level: 25 },
      { name: 'jQuery', level: 80 },
      { name: 'Bootstrap', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'Framer Motion', level: 50 },
    ],
  },
  {
    name: 'Tools & Platforms',
    skills: [
      { name: 'Git', level: 70 },
      { name: 'GitHub', level: 60 },
      { name: 'VS Code', level: 92 },
      { name: 'Vercel', level: 85 },
    ],
  },
];

// Split technologies into 2 rows
const row1Technologies = [
  'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React.js', 'Next.js',
  'jQuery', 'Bootstrap', 'Tailwind CSS',
];

const row2Technologies = [
  'Git', 'GitHub', 'VS Code', 'Vercel', 'Node.js', 'npm', 
  'Webpack', 'Figma', 
];

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => {
            setWidth(level);
          }, delay);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [level, delay]);

  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-sm text-cyan-400 font-medium">{level}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// Marquee Row Component
function MarqueeRow({ 
  technologies, 
  direction = 'left',
  speed = 30 
}: { 
  technologies: string[]; 
  direction?: 'left' | 'right';
  speed?: number;
}) {
  // Duplicate the array for seamless looping
  const duplicatedTechs = [...technologies, ...technologies, ...technologies];
  
  return (
    <div className="relative overflow-hidden py-3">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div 
        className={`flex gap-4 ${direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'}`}
        style={{ 
          width: 'max-content',
          animationDuration: `${speed}s`
        }}
      >
        {duplicatedTechs.map((tech, index) => (
          <div
            key={`${tech}-${index}`}
            className="px-6 py-3 rounded-xl glass text-foreground font-medium whitespace-nowrap hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300"
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 md:py-32 relative">
      {/* Add marquee animations to global styles */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-4">
            My Skills
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Technologies I <span className="text-gradient">Work With</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            I've worked with a variety of technologies in the web development world.
            Here's a comprehensive overview of my technical skills and proficiency levels.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.name}
              className="glass rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 text-sm font-bold">{categoryIndex + 1}</span>
                </div>
                {category.name}
              </h3>
              <div>
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={categoryIndex * 200 + skillIndex * 100}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Auto-scrolling Tech Stack Marquee */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">
            My <span className="text-gradient">Tech Stack</span>
          </h3>
          <p className="text-muted-foreground text-sm">
            Technologies I use daily
          </p>
        </div>
        
        <div className="space-y-2 mb-16">
          {/* Row 1 - Moving Left */}
          <MarqueeRow technologies={row1Technologies} direction="left" speed={35} />
          {/* Row 2 - Moving Right */}
          <MarqueeRow technologies={row2Technologies} direction="right" speed={30} />
        </div>

        {/* Learning Section */}
        <div className="glass rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Always Learning</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Technology evolves rapidly, and I'm committed to continuous learning.
            Currently exploring advanced React patterns, server-side rendering,
            and modern CSS features to stay at the forefront of web development.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 rounded-full bg-cyan-400/10 text-cyan-400 text-sm font-medium">
              React Server Components
            </span>
            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium">
              Next.js 14
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium">
              AI Integration
            </span>
            <span className="px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
              Web Performance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
