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
import AIMarkdownRenderer from '../../components/ui/AIMarkdownRenderer.jsx';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: `Hi there! I'm Cypher, Usama's assistant.\n\nFeel free to ask me anything about his work, frontend architectures, projects like Olyra or Dentalook, or how to get in touch.`,
    timestamp: 'NOW',
  },
];

const SUGGESTED_CHIPS = [
  'Explain Olyra Architecture',
  'What is Usama’s Tech Stack?',
  'Dentalook Dashboard Telemetry',
  'How to contact Usama?',
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
          text: `I'm having a little trouble connecting right now. Feel free to try again or reach out to Usama directly via the Contact section!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        {/* Concentric Radar Wave Ripples Animation */}
        <span className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-cyan-400/40 bg-cyan-400/10 animate-wave-1 pointer-events-none" />
        <span className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-cyan-400/30 bg-cyan-400/5 animate-wave-2 pointer-events-none" />
        <span className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-sky-400/20 animate-wave-3 pointer-events-none" />

        {/* Medium-Sized Realistic Robotic Assistant Floating Button */}
        <button
          onClick={() => onToggle && onToggle(true)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-900 via-[#071328] to-[#040914] border-2 border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center text-cyan-400 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
          title="Chat with Cypher"
          aria-label="Chat with Cypher"
        >
          {/* Subtle interior ambient glow */}
          <div className="absolute inset-1 rounded-full bg-cyan-500/10 opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Realistic Robotic Assistant Icon */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 sm:w-9 sm:h-9 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
          >
            <defs>
              <linearGradient id="robotMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="visorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f5ff" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#00f5ff" />
              </linearGradient>
            </defs>

            {/* Cybernetic Antenna */}
            <line x1="20" y1="4" x2="20" y2="9" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="4" r="2.2" fill="#00f5ff" />

            {/* Robot Head Chassis */}
            <rect
              x="8"
              y="9"
              width="24"
              height="22"
              rx="6"
              fill="url(#robotMetal)"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />

            {/* Forehead Circuit Accents */}
            <path d="M14 9 V12.5 M26 9 V12.5" stroke="#67e8f9" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

            {/* Glowing Optic Visor (AI Eyes) */}
            <rect
              x="12"
              y="15.5"
              width="16"
              height="7"
              rx="3"
              fill="#04101e"
              stroke="#00f5ff"
              strokeWidth="1"
            />
            {/* Glowing Visor Laser Sensor */}
            <rect
              x="13.5"
              y="17.5"
              width="13"
              height="3"
              rx="1.5"
              fill="url(#visorGlow)"
            />

            {/* Audio / Neural Speech Grille */}
            <line x1="16" y1="26.5" x2="24" y2="26.5" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="17.5" cy="26.5" r="0.7" fill="#00f5ff" />
            <circle cx="20" cy="26.5" r="0.7" fill="#00f5ff" />
            <circle cx="22.5" cy="26.5" r="0.7" fill="#00f5ff" />

            {/* Side Audio Transceivers (Ear Nodes) */}
            <rect x="5.5" y="16" width="2.5" height="8" rx="1.2" fill="#38bdf8" opacity="0.9" />
            <rect x="32" y="16" width="2.5" height="8" rx="1.2" fill="#38bdf8" opacity="0.9" />
          </svg>

          {/* Active Online Status Indicator */}
          <span className="absolute top-1 right-1 flex h-3 w-3 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border border-slate-950" />
          </span>
        </button>
      </div>
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
              <span className="text-sm font-semibold text-white tracking-wide">
                Cypher
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
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
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5 shadow-[0_0_10px_rgba(34,211,238,0.25)]">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed break-words ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-white rounded-tr-none whitespace-pre-wrap'
                  : 'bg-slate-900/85 border border-white/10 text-slate-200 rounded-tl-none shadow-inner'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5 text-[11px] opacity-75">
                <span className="font-semibold text-cyan-400 font-sans">
                  {msg.sender === 'user' ? 'You' : 'Cypher'}
                </span>
                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>
              <div className="font-sans text-xs leading-normal sm:text-[13px]">
                {msg.sender === 'ai' ? (
                  <AIMarkdownRenderer content={msg.text} />
                ) : (
                  msg.text
                )}
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
            <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3.5 py-2 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs text-slate-300 font-sans">Cypher is typing...</span>
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
            placeholder="Ask Cypher anything..."
            className="w-full bg-slate-900/90 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-sans"
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
