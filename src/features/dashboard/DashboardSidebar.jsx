import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Cpu,
  MessageSquareQuote,
  Mail,
  Briefcase,
  Activity,
  Sliders,
  ExternalLink,
  LogOut,
  Code2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import profileImg from '../../images/profile.webp';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban, badgeKey: 'projects' },
  { id: 'skills', label: 'Skills Matrix', icon: Cpu, badgeKey: 'skills' },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, badgeKey: 'testimonials' },
  { id: 'messages', label: 'Inbound Messages', icon: Mail, badgeKey: 'unreadMessages' },
  { id: 'experience', label: 'Experience', icon: Briefcase, badgeKey: 'experience' },
  { id: 'ai_settings', label: 'AI Integrations', icon: Sparkles },
  { id: 'telemetry', label: 'System Telemetry', icon: Activity },
  { id: 'settings', label: 'Settings & Profile', icon: Sliders },
];

export const DashboardSidebar = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  counts = {},
  onLogout,
  user,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#050916] border-r border-cyan-500/20 backdrop-blur-2xl transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 select-none">
          <Link to="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:scale-105 transition-all">
              <Code2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                  Usama<span className="text-cyan-400">.Ops</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
                  CONTROL TOWER v2.4
                </span>
              </div>
            )}
          </Link>

          {/* Collapse toggle (Desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-slate-400 hover:text-cyan-300 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* User Card Pill */}
        <div className="p-3 border-b border-white/5">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <div className="relative shrink-0">
              <img
                src={profileImg}
                alt="Usama Ikram"
                className="w-9 h-9 rounded-lg object-cover object-top border border-cyan-400/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950 animate-pulse" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    {user?.name || 'Usama Ikram'}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>
                <div className="text-[10px] font-mono text-cyan-400/80 truncate">
                  Principal Admin
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1.5 no-scrollbar">
          {!isCollapsed && (
            <div className="px-3 pb-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Management Suites
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badgeCount = item.badgeKey ? counts[item.badgeKey] : null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && badgeCount !== undefined && badgeCount !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      item.id === 'messages' && badgeCount > 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-white/10 space-y-2">
          {/* Public Site Link */}
          <Link
            to="/"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-cyan-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Open Live Portfolio"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
            {!isCollapsed && <span className="truncate">Public Portfolio</span>}
          </Link>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono text-rose-400 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Terminate Session"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Log Out Admin</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
