import { useEffect, useRef } from 'react';
import { ArrowDown, Github, Linkedin, Twitter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${particle.opacity})`;
        ctx.fill();

        // Connect nearby particles
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">Available for freelance work</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Hi, I'm </span>
            <span className="text-gradient">Usama Ikram</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Frontend Web Developer
          </p>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground/80 mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            I craft beautiful, responsive, and user-friendly web experiences using modern technologies.
            Passionate about creating clean code and stunning designs that make an impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => scrollToSection('#projects')}
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-background font-semibold hover:opacity-90 hover-lift px-8"
            >
              View My Work
            </Button>
            <a
              href="/resume.pdf"
              download="Usama_Ikram_Resume.pdf"
              className="inline-flex items-center border border-white/20 text-foreground 
             px-8 py-3 text-lg hover:bg-white/5 hover:text-gradient rounded-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </a>

          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <a
              href="https://github.com/chusamaikram"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300 hover-lift"
              aria-label='social-link'
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="www.linkedin.com/in/usama-ikram-252052182"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300 hover-lift"
              aria-label='social-link'
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300 hover-lift"
              aria-label='social-link'
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 border border-cyan-400/20 rounded-lg rotate-45 animate-float" />
      <div className="absolute bottom-1/4 right-10 w-16 h-16 border border-blue-500/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-cyan-400/10 rounded-lg rotate-12 animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
}
