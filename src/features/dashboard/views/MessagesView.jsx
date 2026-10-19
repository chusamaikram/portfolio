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
  Bot,
  RefreshCw,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import GlassCard from '../../../components/ui/GlassCard.jsx';
import NeonButton from '../../../components/ui/NeonButton.jsx';
import aiService from '../../../services/ai.service.js';

export const MessagesView = ({
  messages = [],
  searchQuery = '',
  onMarkRead,
  onDeleteMessage,
}) => {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'read'
  const [activeMessage, setActiveMessage] = useState(null);

  // AI Copilot: Inbox Analysis State
  const [inboxInsights, setInboxInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInsightsDrawer, setShowInsightsDrawer] = useState(false);

  // AI Copilot: Personalized Reply Drafting State
  const [replyDraft, setReplyDraft] = useState(null);
  const [isDraftingReply, setIsDraftingReply] = useState(false);
  const [selectedTone, setSelectedTone] = useState('warm_professional');
  const [editableBody, setEditableBody] = useState('');

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

  const handleRunInboxAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const data = await aiService.analyzeInbox();
      setInboxInsights(data);
      setShowInsightsDrawer(true);
      toast.success('AI Inbox Analysis Complete!', {
        description: data.summary,
      });
    } catch {
      toast.error('Failed to run AI inbox analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDraftAIReply = async (msg = activeMessage, tone = selectedTone) => {
    if (!msg) return;
    setIsDraftingReply(true);
    try {
      const data = await aiService.draftReply({
        message_id: msg.id,
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        tone: tone,
      });
      setReplyDraft(data);
      setEditableBody(data.reply_body);
      toast.success(`Personalized AI Reply Drafted for ${msg.name}!`);
    } catch {
      toast.error('Failed to draft AI reply');
    } finally {
      setIsDraftingReply(false);
    }
  };

  const handleCopyDraft = () => {
    if (!editableBody) return;
    navigator.clipboard.writeText(editableBody);
    toast.success('Reply copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & AI Copilot Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            Inbound Communications Stream ({messages.length})
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Encrypted client inquiries & employment communications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Copilot Action */}
          <button
            type="button"
            onClick={handleRunInboxAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-medium transition-all cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bot className="w-3.5 h-3.5" />
            )}
            <span>AI Inbox Insights</span>
          </button>

          {/* Filter Pills */}
          <div className="flex gap-1 font-mono text-xs">
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
      </div>

      {/* AI Inbox Insights Drawer */}
      {showInsightsDrawer && inboxInsights && (
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 p-5 space-y-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI INBOX TRIAGE & PRIORITY ANALYSIS</span>
            </div>
            <button
              onClick={() => setShowInsightsDrawer(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Dismiss
            </button>
          </div>

          <p className="text-sm text-slate-200 font-sans">
            {inboxInsights.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <span className="text-[10px] font-mono text-slate-400">UNREAD INQUIRIES</span>
              <div className="text-xl font-bold font-mono text-amber-400">
                {inboxInsights.unread_count}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <span className="text-[10px] font-mono text-slate-400">REQUIRES ACTION / REPLY</span>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {inboxInsights.needs_reply_count}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60">
              <span className="text-[10px] font-mono text-slate-400">TOTAL INBOUND STREAM</span>
              <div className="text-xl font-bold font-mono text-slate-200">
                {inboxInsights.total_messages}
              </div>
            </div>
          </div>

          {/* Messages Breakdown */}
          {inboxInsights.messages && inboxInsights.messages.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                AI Classified Messages:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {inboxInsights.messages.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const fullMsg = messages.find((m) => m.id === item.id);
                      if (fullMsg) {
                        setActiveMessage(fullMsg);
                        setReplyDraft(null);
                        if (!fullMsg.isRead) onMarkRead(fullMsg.id);
                      }
                    }}
                    className="cursor-pointer p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/40 transition-all flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">{item.name}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                            item.priority === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono truncate">{item.category}</div>
                      <p className="text-[11px] text-slate-400 truncate">{item.snippet}</p>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-300 shrink-0 hover:underline">
                      Inspect →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messages List & Preview Split */}
      {filtered.length === 0 ? (
        <GlassCard className="p-16 text-center text-slate-400 font-mono text-xs">
          NO CORRESPONDENCE FOUND IN INBOX ARCHIVE.
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Message List Column */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map((msg) => (
              <GlassCard
                key={msg.id}
                onClick={() => {
                  setActiveMessage(msg);
                  setReplyDraft(null);
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
                    {new Date(msg.timestamp || msg.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-cyan-300 truncate mb-1">
                  {msg.subject || 'No Subject'}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {msg.message}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Full Message Inspector */}
          <div className="lg:col-span-7">
            {activeMessage ? (
              <GlassCard cyberCorners glowColor="cyan" className="p-6 sm:p-8 space-y-6 sticky top-24">
                {/* Header details */}
                <div className="border-b border-white/10 pb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {activeMessage.subject || 'Inbound Message'}
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
                        <span>Received: {new Date(activeMessage.timestamp || activeMessage.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onDeleteMessage(activeMessage.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer"
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

                {/* Action Bar with AI Draft Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDraftAIReply(activeMessage)}
                      disabled={isDraftingReply}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isDraftingReply ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                      )}
                      <span>Draft AI Reply</span>
                    </button>

                    <a
                      href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || 'Inquiry')}`}
                      className="inline-flex"
                    >
                      <NeonButton size="sm" variant="secondary" icon={Send} iconPosition="right">
                        Open in Email
                      </NeonButton>
                    </a>
                  </div>

                  <div className="text-xs font-mono text-slate-500">
                    ID #{activeMessage.id} • Verified Inbound
                  </div>
                </div>

                {/* AI Generated Personalized Email Draft Drawer */}
                {replyDraft && (
                  <div className="p-5 rounded-2xl border border-cyan-500/30 bg-slate-950/90 space-y-4 animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-bold">
                        <Bot className="w-4 h-4" />
                        <span>PERSONALIZED AI EMAIL DRAFT (FOR {replyDraft.name.toUpperCase()})</span>
                      </div>

                      {/* Tone selector */}
                      <div className="flex items-center gap-1 text-[10px] font-mono">
                        <span className="text-slate-500">Tone:</span>
                        {['warm_professional', 'concise', 'technical'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setSelectedTone(t);
                              handleDraftAIReply(activeMessage, t);
                            }}
                            className={`px-2 py-0.5 rounded capitalize transition-all ${
                              selectedTone === t
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {t.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs font-mono text-slate-400 space-y-1">
                      <div>To: <span className="text-white">{replyDraft.email}</span></div>
                      <div>Subject: <span className="text-cyan-300">{replyDraft.subject}</span></div>
                    </div>

                    {/* Editable Email Body */}
                    <textarea
                      rows={9}
                      value={editableBody}
                      onChange={(e) => setEditableBody(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-cyan-400"
                    />

                    {/* Dispatch Options */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${replyDraft.email}?subject=${encodeURIComponent(replyDraft.subject)}&body=${encodeURIComponent(editableBody)}`}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send via Email Client</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleCopyDraft}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 font-mono transition-all cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDraftAIReply(activeMessage, selectedTone)}
                        disabled={isDraftingReply}
                        className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 ${isDraftingReply ? 'animate-spin' : ''}`} />
                        <span>Regenerate Draft</span>
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-16 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center">
                <Mail className="w-10 h-10 text-slate-600 mb-3" />
                <span>SELECT AN INBOUND MESSAGE FROM THE STREAM TO INSPECT AND DRAFT AI REPLIES.</span>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
