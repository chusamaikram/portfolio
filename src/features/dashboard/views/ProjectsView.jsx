import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  RotateCcw,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';
import TechBadge from '../../../components/ui/TechBadge.jsx';

export const ProjectsView = ({
  projects = [],
  searchQuery = '',
  onAddProject,
  onEditProject,
  onDeleteProject,
  onResetProjects,
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat =
      categoryFilter === 'All'
        ? true
        : categoryFilter === 'Featured'
        ? Boolean(p.featured)
        : p.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {['All', 'Featured', 'Web App', 'Dashboard', 'Portfolio'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                  : 'text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Toggle & Actions */}
        <div className="flex items-center gap-2">
          {/* Grid / Table toggle */}
          <div className="flex p-1 rounded-lg bg-slate-950 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onResetProjects}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-slate-500 text-slate-300 text-xs font-mono transition-colors"
            title="Reset to default baseline projects"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Catalog</span>
          </button>

          <NeonButton
            size="sm"
            variant="primary"
            onClick={onAddProject}
            icon={Plus}
          >
            New Project
          </NeonButton>
        </div>

      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <GlassCard className="p-16 text-center text-slate-400 font-mono text-xs">
          NO MATCHING PROJECTS FOUND IN REPOSITORY CATALOG.
        </GlassCard>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <GlassCard key={proj.id} cyberCorners glowColor="blue" className="p-5 flex flex-col justify-between">
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10 bg-slate-950">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 border border-white/10 text-cyan-400">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      FEATURED
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-slate-300/80 line-clamp-2 mb-3 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {proj.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-2">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 text-xs"
                      title="Open Demo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-400 text-xs"
                      title="Open GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onEditProject(proj)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDeleteProject(proj.id, proj.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        /* Table Layout */
        <GlassCard cyberCorners className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 uppercase">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Category</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Tags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-12 h-8 rounded object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-white font-sans">{proj.title}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{proj.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-400">
                      {proj.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {proj.featured ? (
                      <span className="text-emerald-400 font-bold">YES</span>
                    ) : (
                      <span className="text-slate-500">NO</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {proj.tags?.slice(0, 3).map((t) => (
                        <span key={t} className="px-1.5 py-0.2 rounded bg-white/5 text-[9px] text-slate-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => onEditProject(proj)}
                      className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-400/30"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteProject(proj.id, proj.title)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
};

export default ProjectsView;
