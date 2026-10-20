import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Sparkles, Bot, Terminal, Code2, ArrowUpRight, Layers } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import TechBadge from '../../components/ui/TechBadge.jsx';
import NeonButton from '../../components/ui/NeonButton.jsx';
import portfolioService from '../../services/portfolio.service.js';

const CATEGORIES = ['All', 'Featured', 'Web App', 'Dashboard', 'Portfolio'];

// High-Performance 60FPS Project Card with pure hardware-accelerated CSS transforms
const ProjectCard = ({ project, onAskAi }) => {
  return (
    <div className="h-full transition-all duration-300 hover:-translate-y-2">
      <GlassCard
        cyberCorners
        glowColor="cyan"
        className="h-full flex flex-col justify-between overflow-hidden group border-white/10 hover:border-cyan-400/50"
      >
        <div>
          {/* Project Image Viewport */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 border-b border-white/10">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 border border-white/15 text-slate-300 font-mono text-[11px]">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-semibold flex items-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  FEATURED
                </span>
              )}
            </div>

            {/* Gradient shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080e1e] via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>

          {/* Project Details */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1 flex items-center justify-between">
              <span>{project.title}</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>

            <p className="text-slate-300/80 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3 font-light">
              {project.description}
            </p>

            {/* Architecture Highlights */}
            {project.architecture && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 mb-4 text-[11px] font-mono text-cyan-400/90 flex items-start gap-1.5">
                <Code2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                <span className="line-clamp-2">{project.architecture}</span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tags?.map((tag) => (
                <TechBadge key={tag} name={tag} variant="default" className="text-[11px]" />
              ))}
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="px-6 pb-6 pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[100px]"
            >
              <NeonButton
                size="sm"
                variant="primary"
                className="w-full text-xs"
                icon={ExternalLink}
                iconPosition="right"
              >
                Live Demo
              </NeonButton>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
              title="View Repository"
            >
              <NeonButton size="sm" variant="secondary" className="px-3 text-xs">
                <Github className="w-4 h-4" />
              </NeonButton>
            </a>
          )}

          {/* Ask Cypher Trigger Button */}
          <button
            onClick={() => onAskAi(project.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer ml-auto"
            title="Ask Cypher to explain this project's architecture"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask Cypher</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export const ProjectsGrid = ({ onOpenAiChat }) => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await portfolioService.getProjects();
        if (isMounted) setProjects(data);
      } catch (err) {
        console.warn('Projects fallback engaged:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAskAi = (projectTitle) => {
    window.dispatchEvent(
      new CustomEvent('open-ai-chat', {
        detail: {
          prompt: `Analyze the architecture and technical highlights of ${projectTitle}`,
          open: true,
        },
      })
    );
    if (onOpenAiChat) onOpenAiChat();
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Featured') return Boolean(p.featured);
    return p.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <section id="projects" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="FEATURED WORK"
          title="Featured"
          highlight="Engineering Work"
          subtitle="A curated showcase of responsive platforms, dashboard analytics, and UI/UX replicas built to high architectural standards."
        />

        {/* Filter Categories Toolbar */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? projects.length
                : cat === 'Featured'
                ? projects.filter((p) => p.featured).length
                : projects.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 hover:border-cyan-400/30'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat ? 'bg-slate-950/20 text-slate-900 font-bold' : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-cyan-400">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <span className="font-mono text-xs uppercase tracking-widest">
              HYDRATING REPOSITORIES & ASSETS...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onAskAi={handleAskAi}
              />
            ))}
          </div>
        )}

        {/* GitHub Repositories Link */}
        <div className="text-center mt-14">
          <a
            href="https://github.com/chusamaikram"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <NeonButton size="md" variant="outline" icon={Github}>
              Inspect 15+ Repositories on GitHub
            </NeonButton>
          </a>
        </div>

      </div>
    </section>
  );
};

export default ProjectsGrid;
