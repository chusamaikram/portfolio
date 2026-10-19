import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Code2, Terminal, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import NeonButton from '../ui/NeonButton.jsx';

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
  const { isAuthenticated, logout, user } = useAuth();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      if (isHomePage) {
        const sections = ['contact', 'testimonials', 'projects', 'about', 'home'];
        for (const s of sections) {
          const el = document.getElementById(s);
          if (el && el.getBoundingClientRect().top <= 160) {
            setActiveSection(s);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
          ? 'bg-[#060a16]/85 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-3'
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

          {/* Action Hub */}
          <div className="hidden md:flex items-center gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={() => onOpenAiChat && onOpenAiChat()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 text-xs font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              title="Launch AI Terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>

            {/* Admin Dashboard / Login Gateway */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <NeonButton size="sm" variant="outline" icon={LayoutDashboard}>
                    Dashboard
                  </NeonButton>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-400/40 transition-colors"
                  title="Log Out Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <NeonButton size="sm" variant="secondary" icon={Shield}>
                  Admin
                </NeonButton>
              </Link>
            )}

            {/* Hire Me CTA */}
            <NeonButton
              size="sm"
              variant="primary"
              onClick={() => handleNavClick('#contact')}
            >
              Hire Me
            </NeonButton>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle Mobile Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
              <Terminal className="w-4 h-4" />
              <span>Launch AI Terminal</span>
            </button>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-400/40"
                  >
                    Control Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full py-2 text-rose-400 text-xs font-mono"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white/10 text-white font-mono text-xs border border-white/10"
                >
                  Admin Security Gateway
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
