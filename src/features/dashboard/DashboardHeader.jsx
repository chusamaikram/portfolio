import React from 'react';
import { Menu, Search, Plus, Bell, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import NeonButton from '../../components/ui/NeonButton.jsx';

export const DashboardHeader = ({
  activeTabTitle,
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
  onQuickAction,
  quickActionLabel = '+ Add New',
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between gap-4">
      
      {/* Left: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              DASHBOARD //
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {activeTabTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search filter input */}
      <div className="hidden md:flex items-center flex-1 max-w-xs relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`Search ${activeTabTitle.toLowerCase()}...`}
          className="w-full bg-slate-900/90 border border-white/10 focus:border-cyan-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
        />
      </div>

      {/* Right: Quick Action, Refresh, Public Link */}
      <div className="flex items-center gap-2.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        )}

        {onQuickAction && (
          <NeonButton
            size="sm"
            variant="primary"
            onClick={onQuickAction}
            icon={Plus}
            className="text-xs"
          >
            {quickActionLabel}
          </NeonButton>
        )}

        <Link to="/" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex">
          <NeonButton size="sm" variant="secondary" icon={ExternalLink} className="text-xs">
            Live Site
          </NeonButton>
        </Link>
      </div>

    </header>
  );
};

export default DashboardHeader;
