import { useEffect, useRef, useState } from 'react';
import { Code, Palette, Zap, Award, Coffee } from 'lucide-react';
import profile from '../images/profile.jpg';

const stats = [
  { icon: Code, value: 8, suffix: '+', label: 'Projects Created' },
  { icon: Coffee, value: 300, suffix: '+', label: 'Cups of Coffee' },
  { icon: Award, value: 3, suffix: '+', label: 'Months of Coding' },
];

const services = [
  {
    icon: Code,
    title: 'Web Development',
    description: 'Building responsive and performant websites using modern frameworks like React, Next.js, and Vue.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Creating intuitive and visually appealing user interfaces that provide excellent user experiences.',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    description: 'Optimizing web applications for speed, SEO, and accessibility to reach wider audiences.',
  },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="py-10 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-cyan-400 text-sm font-medium mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Passionate About <span className="text-gradient">Creating</span>
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
            I'm a dedicated frontend developer with a love for clean code and beautiful design.
            My goal is to build web experiences that are both functional and delightful.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 text-center hover-lift group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4 group-hover:from-cyan-400/30 group-hover:to-blue-500/30 transition-all">
                <stat.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* About Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Image/Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-pulse-glow" />
              <div className="absolute inset-4 rounded-full border-2 border-blue-500/20 animate-pulse-glow" style={{ animationDelay: '1s' }} />

              {/* Profile placeholder with gradient */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/10 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <img
                    src={profile}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute top-4 right-4 px-4 py-2 rounded-xl glass text-sm font-medium text-cyan-400 animate-float">
                React.js
              </div>
              <div className="absolute bottom-8 left-0 px-4 py-2 rounded-xl glass text-sm font-medium text-blue-400 animate-float" style={{ animationDelay: '1s' }}>
                Next.js
              </div>
              <div className="absolute top-1/2 -right-4 px-4 py-2 rounded-xl glass text-sm font-medium text-purple-400 animate-float" style={{ animationDelay: '2s' }}>
               Tailwind Css
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Transforming Ideas Into{' '}
              <span className="text-gradient">Digital Reality</span>
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                I'm a frontend developer with a growing passion for creating clean and interactive web applications.
                Over the past few months, I've been exploring web development, building personal projects and UI/UX replicas
                to sharpen my skills and understand real-world design and functionality.
              </p>
              <p>
                I primarily work with React and Tailwind CSS, and I'm currently learning Next.js to expand my capabilities in building modern, scalable web applications.
                My focus is on translating designs into responsive, user-friendly websites while practicing efficient code structure and dynamic functionality.
              </p>
              <p>
                When I'm not coding, I enjoy experimenting with new web technologies, learning from online communities,
                and improving my workflow by building small projects that challenge my skills.
              </p>
            </div>


            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Location</div>
                <div className="font-medium text-foreground">Lahore, Pakistan</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-medium text-foreground">usama.code404@gmail.com</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Experience</div>
                <div className="font-medium text-foreground">3+ Months</div>
              </div>
              <div className="glass rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-1">Availability</div>
                <div className="font-medium text-cyan-400">Open to Work</div>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10">
            What I <span className="text-gradient">Offer</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="glass rounded-2xl p-8 hover-lift group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:from-cyan-400/30 group-hover:to-blue-500/30 transition-all group-hover:scale-110">
                  <service.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">{service.title}</h4>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
