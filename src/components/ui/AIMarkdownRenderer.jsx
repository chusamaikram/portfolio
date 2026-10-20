import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-white/10 text-[10px] text-slate-400">
        <span className="text-cyan-400 font-semibold">{language || 'CODE'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-cyan-200 scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Parses inline tokens: bold (**text**), inline code (`code`), markdown links ([label](url)), raw URLs, and italics (*text*)
function renderInlineText(text) {
  if (!text) return null;

  const pattern = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s,)]+|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Markdown link [label](url)
    const mdLinkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (mdLinkMatch) {
      const [, label, url] = mdLinkMatch;
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mx-0.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-400/40 hover:border-cyan-300 text-xs font-mono transition-all shadow-[0_0_12px_rgba(34,211,238,0.2)] group"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      );
    }

    // 2. Raw URL (e.g. https://olyra-v02.vercel.app/)
    if (/^https?:\/\/[^\s,)]+$/.test(part)) {
      const displayUrl = part.replace(/^https?:\/\//, '').replace(/\/$/, '');
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mx-0.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-400/40 hover:border-cyan-300 text-xs font-mono transition-all shadow-[0_0_12px_rgba(34,211,238,0.2)] group"
        >
          <span>{displayUrl}</span>
          <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      );
    }

    // 3. Bold **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // 4. Inline code `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // 5. Italic *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="text-slate-300 italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Normal text
    return <span key={index}>{part}</span>;
  });
}

export const AIMarkdownRenderer = ({ content }) => {
  if (!content) return null;

  // Split content by fenced code blocks first
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', language: match[1], value: match[2] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: 'text', value: content.slice(lastIndex) });
  }

  return (
    <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-200 font-sans">
      {segments.map((seg, sIdx) => {
        if (seg.type === 'code') {
          return <CodeBlock key={sIdx} language={seg.language} code={seg.value} />;
        }

        const lines = seg.value.split('\n');
        const elements = [];

        for (let i = 0; i < lines.length; i++) {
          const rawLine = lines[i];
          const trimmed = rawLine.trim();

          if (!trimmed) {
            elements.push(<div key={`empty-${i}`} className="h-1.5" />);
            continue;
          }

          // Header levels
          if (trimmed.startsWith('### ')) {
            elements.push(
              <h5 key={i} className="text-xs font-bold text-cyan-300 font-mono uppercase tracking-wider pt-1">
                {renderInlineText(trimmed.slice(4))}
              </h5>
            );
            continue;
          }
          if (trimmed.startsWith('## ')) {
            elements.push(
              <h4 key={i} className="text-sm font-bold text-white font-mono pt-1.5 border-b border-cyan-500/20 pb-0.5">
                {renderInlineText(trimmed.slice(3))}
              </h4>
            );
            continue;
          }
          if (trimmed.startsWith('# ')) {
            elements.push(
              <h3 key={i} className="text-base font-extrabold text-white font-mono pt-2 border-b border-cyan-500/30 pb-1">
                {renderInlineText(trimmed.slice(2))}
              </h3>
            );
            continue;
          }

          // Structured Key-Value Bullet: • **Key**: Value or - **Key**: Value
          const kvMatch = trimmed.match(/^(?:[•*-]|\d+\.)\s+\*\*([^*]+)\*\*:\s*(.*)$/);
          if (kvMatch) {
            const [, key, val] = kvMatch;
            elements.push(
              <div key={i} className="flex items-start gap-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                <div className="leading-relaxed">
                  <span className="font-semibold text-cyan-300 font-mono text-[11px] sm:text-xs tracking-wide">
                    {key}:{' '}
                  </span>
                  <span>{renderInlineText(val)}</span>
                </div>
              </div>
            );
            continue;
          }

          // Standard Bullet: • item or - item or * item
          const bulletMatch = trimmed.match(/^(?:[•*-])\s+(.*)$/);
          if (bulletMatch) {
            elements.push(
              <div key={i} className="flex items-start gap-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
                <div className="leading-relaxed">{renderInlineText(bulletMatch[1])}</div>
              </div>
            );
            continue;
          }

          // Numbered item: 1. item
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            elements.push(
              <div key={i} className="flex items-start gap-2 py-0.5">
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-400/30 shrink-0 mt-0.5">
                  {numMatch[1]}
                </span>
                <div className="leading-relaxed">{renderInlineText(numMatch[2])}</div>
              </div>
            );
            continue;
          }

          // Regular paragraph line
          elements.push(
            <p key={i} className="leading-relaxed">
              {renderInlineText(rawLine)}
            </p>
          );
        }

        return <div key={sIdx} className="space-y-1">{elements}</div>;
      })}
    </div>
  );
};

export default AIMarkdownRenderer;
