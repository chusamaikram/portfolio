import { Code2, Heart, ArrowUp } from 'lucide-react';

const footerLinks = [
  {
    title: 'Quick Links',
    links: [
      { name: 'Home', href: '#home' },
      { name: 'About', href: '#about' },
      { name: 'Skills', href: '#skills' },
      { name: 'Projects', href: '#projects' },
      { name: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Web Development', href: '#about' },
      { name: 'UI/UX Design', href: '#about' },
      { name: 'Performance Optimization', href: '#about' },
      { name: 'Consulting', href: '#contact' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { name: 'GitHub', href: 'https://github.com/chusamaikram' },
      { name: 'LinkedIn', href: 'https://github.com/chusamaikram' },
      { name: 'Twitter', href: 'https://twitter.com' },
      { name: 'Email', href: 'mailto:usama.code404@gmail.com' },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative pt-20 pb-8 border-t border-white/5">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }} className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold text-gradient">Usama.Dev</span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Crafting beautiful, responsive, and user-friendly web experiences.
              Let's build something amazing together.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for freelance work
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-foreground font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault();
                          scrollToSection(link.href);
                        }
                      }}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-muted-foreground hover:text-cyan-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} Usama Ikram. All rights reserved.
          </p>

          <button
            type='button'
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-cyan-400 hover:border-cyan-400/30 transition-all duration-300 hover-lift"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
