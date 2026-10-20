import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Code2, Bot } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = ({ onOpenAiChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  // 1. Lightweight Scroll Listener for navbar background
  useEffect(() => {
    let currentScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 30;
      if (scrolled !== currentScrolled) {
        currentScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. High-Performance Asynchronous IntersectionObserver for active section
    // ZERO getBoundingClientRect(), ZERO layout thrashing, 100% smooth 60 FPS scrolling
    if (isHomePage) {
      const sectionIds = ['home', 'about', 'projects', 'testimonials', 'contact'];
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: '-20% 0px -55% 0px', threshold: 0 }
      );

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (!isHomePage) {
      navigate('/' + href);
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060a16]/95 border-b border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => {
              if (isHomePage) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:scale-105 transition-all">
              <Code2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Usama<span className="text-cyan-400">.Code</span>
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1">
                ARCHITECT
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const isActive = isHomePage && activeSection === link.href.slice(1);
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* Action Hub: Only Keep Robotic AI Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onOpenAiChat && onOpenAiChat()}
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500/15 text-cyan-400 border border-cyan-400/40 hover:border-cyan-300 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.2)] group"
              title="Chat with Cypher"
              aria-label="Chat with Cypher"
            >
              {/* Subtle top optic indicator */}
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <Bot className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenAiChat && onOpenAiChat()}
              className="p-2 rounded-xl bg-slate-900/90 border border-cyan-400/30 text-cyan-400"
              title="Chat with Cypher"
              aria-label="Chat with Cypher"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle Mobile Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-3 px-4 pb-4 bg-[#060a16]/95 border-b border-cyan-500/20 backdrop-blur-2xl">
          <div className="flex flex-col gap-2 pt-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-2.5 rounded-xl text-sm font-mono text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                {link.name}
              </button>
            ))}

            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenAiChat) onOpenAiChat();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-mono text-cyan-400 hover:bg-cyan-500/10"
            >
              <Bot className="w-4 h-4" />
              <span>Chat with Cypher</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
