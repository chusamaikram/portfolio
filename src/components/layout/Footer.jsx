import React from 'react';
import { ArrowUp, Code2, Github, Linkedin, Twitter, Terminal, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-cyan-500/20 bg-[#040814] pt-16 pb-12 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950">
                <Code2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Usama<span className="text-cyan-400">.Code</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed font-light">
              High-performance frontend architectures, responsive UI replicas, and modular design systems built for modern web excellence.
            </p>

            <div className="flex items-center gap-3 text-xs font-mono text-cyan-400/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>STACK: REACT 19 • THREE.JS • TAILWIND CSS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li>
                <a href="#home" className="hover:text-cyan-300 transition-colors">
                  01 // Overview
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-cyan-300 transition-colors">
                  02 // Bento & Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-cyan-300 transition-colors">
                  03 // Projects Catalog
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-cyan-300 transition-colors">
                  04 // Secure Contact
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-300 transition-colors">
                  05 // Admin Gateway
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct channels */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Public Repositories
            </h4>
            <div className="flex flex-col gap-2 text-xs font-mono text-slate-400">
              <a
                href="https://github.com/chusamaikram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
              >
                <Github className="w-4 h-4 text-cyan-400" />
                <span>github.com/chusamaikram</span>
              </a>
              <a
                href="https://linkedin.com/in/usama-ikram-252052182"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-cyan-400" />
                <span>linkedin.com/in/usama-ikram</span>
              </a>
              <a
                href="mailto:usama.code404@gmail.com"
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors"
              >
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>usama.code404@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright & scroll-to-top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs font-mono text-slate-500">
          <div>
            © {new Date().getFullYear()} Usama Ikram. Enterprise Portfolio Architecture.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Top of Page</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
