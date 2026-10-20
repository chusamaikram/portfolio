import React from 'react';
import {
  FolderKanban,
  Cpu,
  Mail,
  MessageSquareQuote,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';

export const OverviewView = ({
  projects = [],
  skills = [],
  messages = [],
  testimonials = [],
  onNavigate,
}) => {
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
  const featuredProjectsCount = projects.filter((p) => p.featured).length;

  // Flatten total skills
  const totalSkillsCount = skills.reduce(
    (acc, cat) => acc + (cat.skills?.length || 0),
    0
  );

  const STATS_CARDS = [
    {
      title: 'Active Projects',
      value: projects.length,
      sub: `${featuredProjectsCount} Featured Work`,
      icon: FolderKanban,
      color: 'cyan',
      tab: 'projects',
    },
    {
      title: 'Skills Matrix',
      value: totalSkillsCount,
      sub: `${skills.length} Technology Sectors`,
      icon: Cpu,
      color: 'blue',
      tab: 'skills',
    },
    {
      title: 'Inbound Inquiries',
      value: messages.length,
      sub: `${unreadMessagesCount} Unread Messages`,
      icon: Mail,
      color: unreadMessagesCount > 0 ? 'amber' : 'cyan',
      tab: 'messages',
    },
    {
      title: 'Testimonials',
      value: testimonials.length,
      sub: '5.0★ Engineering Rating',
      icon: MessageSquareQuote,
      color: 'purple',
      tab: 'testimonials',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Telemetry Banner */}
      <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              USAMA-OPERATIONS TOWER ONLINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise Portfolio Mission Control
            </h1>
            <p className="text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Real-time administrative command for projects, dynamic skill calibrations, client endorsements, and visitor inquiries with resilient offline persistence.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <NeonButton
              size="md"
              variant="primary"
              onClick={() => onNavigate('projects')}
              icon={FolderKanban}
            >
              Deploy Project
            </NeonButton>
            <NeonButton
              size="md"
              variant="secondary"
              onClick={() => onNavigate('messages')}
              icon={Mail}
            >
              Check Inbox
            </NeonButton>
          </div>
        </div>
      </GlassCard>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard
              key={stat.title}
              glowColor={stat.color}
              onClick={() => onNavigate(stat.tab)}
              className="p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-cyan-500/15 border border-white/10 group-hover:border-cyan-400/30 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 transition-all">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-white font-mono mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{stat.sub}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Two Columns: Recent Inquiries & System Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Inquiries (7 cols) */}
        <GlassCard cyberCorners glowColor="blue" className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  Latest Inbound Messages
                </h2>
              </div>
              <button
                onClick={() => onNavigate('messages')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-400">
                NO INBOUND INQUIRIES LOGGED YET.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onNavigate('messages')}
                    className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-cyan-400/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        {!m.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                        {m.subject}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(m.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      From: {m.name} ({m.email})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Runtime Architecture Specs (5 cols) */}
        <GlassCard cyberCorners glowColor="cyan" className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
              Runtime Architecture
            </h2>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-slate-400">Core Framework:</span>
              <span className="text-cyan-300 font-semibold">React 19 & Vite 7</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-slate-400">3D WebGL Pipeline:</span>
              <span className="text-cyan-300 font-semibold">Three.js / R3F (60 FPS)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-slate-400">Security Gateways:</span>
              <span className="text-emerald-400 font-semibold">Protected & Guest Routes</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-white/5">
              <span className="text-slate-400">Persistence SLA:</span>
              <span className="text-cyan-300 font-semibold">API + LocalStorage Fallback</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full text-center py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-mono transition-colors cursor-pointer"
          >
            Open Settings & Profile →
          </button>
        </GlassCard>

      </div>
    </div>
  );
};

export default OverviewView;
