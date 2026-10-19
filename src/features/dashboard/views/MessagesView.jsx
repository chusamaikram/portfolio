import React, { useState } from 'react';
import {
  Mail,
  Trash2,
  Eye,
  MailCheck,
  Send,
  Calendar,
  User,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';

export const MessagesView = ({
  messages = [],
  searchQuery = '',
  onMarkRead,
  onDeleteMessage,
}) => {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'read'
  const [activeMessage, setActiveMessage] = useState(null);

  const filtered = messages.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'unread'
        ? !m.isRead
        : m.isRead;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            Inbound Communications Stream ({messages.length})
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Messages recorded via portfolio encrypted contact channel
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 font-mono text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterType('unread')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'unread'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Unread ({messages.filter((m) => !m.isRead).length})
          </button>
          <button
            onClick={() => setFilterType('read')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === 'read'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Read ({messages.filter((m) => m.isRead).length})
          </button>
        </div>
      </div>

      {/* Messages List & Preview Split */}
      {filtered.length === 0 ? (
        <GlassCard className="p-16 text-center text-slate-400 font-mono text-xs">
          NO CORRESPONDENCE FOUND IN INBOX ARCHIVE.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Message List Column (Spans 5 cols on lg) */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map((msg) => (
              <GlassCard
                key={msg.id}
                onClick={() => {
                  setActiveMessage(msg);
                  if (!msg.isRead) onMarkRead(msg.id);
                }}
                glowColor={activeMessage?.id === msg.id ? 'cyan' : msg.isRead ? 'none' : 'amber'}
                className={`p-4 cursor-pointer transition-all ${
                  activeMessage?.id === msg.id
                    ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    : msg.isRead
                    ? 'opacity-75'
                    : 'border-amber-400/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                    )}
                    <span className="truncate">{msg.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-cyan-300 truncate mb-1">
                  {msg.subject}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Full Message Inspector (Spans 7 cols on lg) */}
          <div className="lg:col-span-7">
            {activeMessage ? (
              <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8 space-y-6 sticky top-24">
                
                {/* Header details */}
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {activeMessage.subject}
                    </h3>

                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex items-center gap-2 text-slate-300">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sender: <strong>{activeMessage.name}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email: <a href={`mailto:${activeMessage.email}`} className="underline hover:text-cyan-300">{activeMessage.email}</a></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Received: {new Date(activeMessage.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onDeleteMessage(activeMessage.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 text-sm text-slate-200 font-sans leading-relaxed whitespace-pre-wrap">
                  {activeMessage.message}
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                    className="inline-flex"
                  >
                    <NeonButton size="md" variant="primary" icon={Send} iconPosition="right">
                      Direct Reply via Email
                    </NeonButton>
                  </a>

                  <div className="text-xs font-mono text-slate-500">
                    ID #{activeMessage.id} • Verified Handshake
                  </div>
                </div>

              </GlassCard>
            ) : (
              <GlassCard className="p-16 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center">
                <Mail className="w-10 h-10 text-slate-600 mb-3" />
                <span>SELECT AN INBOUND MESSAGE FROM THE STREAM TO INSPECT FULL PAYLOAD.</span>
              </GlassCard>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default MessagesView;
