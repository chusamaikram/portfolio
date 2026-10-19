import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2,
  Cpu,
} from 'lucide-react';
import aiService from '../../services/ai.service.js';
import NeonButton from '../../components/ui/NeonButton.jsx';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: `[CORE ONLINE // PROTOCOL v2.4]\nGreetings! I am Usama Ikram's autonomous portfolio intelligence agent.\nAsk me anything regarding Usama's engineering architecture, React/Next.js projects, or availability for enterprise roles.`,
    timestamp: 'NOW',
  },
];

const SUGGESTED_CHIPS = [
  'Explain Olyra Architecture',
  'What is Usama’s Tech Stack?',
  'Dentalook Dashboard Telemetry',
  'How to hire Usama?',
];

export const AIChatTerminal = ({ isOpen, onClose, onToggle }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  // Listen for global custom events to trigger AI with pre-selected prompts (e.g. from Project cards)
  useEffect(() => {
    const handleTrigger = (e) => {
      const { prompt, open } = e.detail || {};
      if (open) {
        if (!isOpen && onToggle) onToggle(true);
      }
      if (prompt) {
        handleSendPrompt(prompt);
      }
    };

    window.addEventListener('open-ai-chat', handleTrigger);
    return () => window.removeEventListener('open-ai-chat', handleTrigger);
  }, [isOpen, onToggle]);

  const handleSendPrompt = async (promptToSend) => {
    const prompt = (promptToSend || inputValue).trim();
    if (!prompt || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await aiService.sendChatMessage(prompt, history);

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `[SYSTEM ALERT]: Failed to query neural node. Offline heuristic fallback active.`,
          timestamp: 'ERR',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendPrompt();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => onToggle && onToggle(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/90 text-cyan-400 border border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.3)] backdrop-blur-xl hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
        aria-label="Open Usama AI Assistant"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
        </span>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span className="font-mono text-xs font-semibold tracking-wider text-slate-100">
            USAMA-AI TERMINAL
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 flex flex-col rounded-2xl bg-[#080e1e]/95 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden ${
        isExpanded
          ? 'w-[94vw] sm:w-[680px] h-[85vh]'
          : 'w-[94vw] sm:w-[440px] h-[540px]'
      }`}
    >
      {/* Top Cyber Window Chrome Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-cyan-500/20 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white tracking-wide">
                USAMA-AI CORE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                v2.4
              </span>
            </div>
            <p className="text-[10px] font-mono text-cyan-400/70 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: READY // 60 FPS SYNC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Close Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Chips */}
      <div className="px-3 py-2 bg-slate-900/40 border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {SUGGESTED_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSendPrompt(chip)}
            className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed whitespace-pre-wrap break-words ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white rounded-tr-none'
                  : 'bg-slate-900/80 border border-white/10 text-slate-200 rounded-tl-none shadow-inner'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-60">
                <span className="font-semibold text-cyan-400">
                  {msg.sender === 'user' ? 'YOU // GUEST' : 'USAMA-AI CORE'}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="font-sans text-xs leading-normal sm:text-[13px]">
                {msg.text}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-center text-cyan-400 font-mono text-xs">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex items-center gap-1 bg-slate-900/80 border border-white/10 px-3 py-2 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] text-slate-400">PROCESSING QUERY STREAM...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Terminal Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-950/90 border-t border-cyan-500/20 flex gap-2 items-center"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type query or command... (e.g. 'skills', 'contact', 'olyra')"
            className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
          />
        </div>
        <NeonButton
          type="submit"
          size="sm"
          disabled={!inputValue.trim() || isTyping}
          className="px-4 py-2.5"
        >
          <Send className="w-3.5 h-3.5" />
        </NeonButton>
      </form>
    </div>
  );
};

export default AIChatTerminal;
