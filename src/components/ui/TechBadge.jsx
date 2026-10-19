import React from 'react';
import { cn } from '../../lib/utils';

export const TechBadge = ({
  name,
  variant = 'default', // 'default' | 'glow' | 'active' | 'outline'
  icon: Icon = null,
  level = null,
  className = '',
  onClick,
}) => {
  const variantStyles = {
    default:
      'bg-slate-900/60 text-slate-300 border-white/10 hover:border-cyan-400/30 hover:text-cyan-300 hover:bg-slate-800/80',
    glow:
      'bg-cyan-500/10 text-cyan-300 border-cyan-400/30 shadow-[0_0_12px_rgba(34,211,238,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    active:
      'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-semibold border-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)]',
    outline:
      'bg-transparent text-slate-400 border-white/15 hover:border-cyan-400/40 hover:text-white',
  };

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border backdrop-blur-sm transition-all duration-200 select-none',
        variantStyles[variant] || variantStyles.default,
        onClick && 'cursor-pointer hover:scale-105 active:scale-95',
        className
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{name}</span>
      {level !== null && (
        <span className="font-mono text-[10px] opacity-75 ml-0.5">
          {level}%
        </span>
      )}
    </span>
  );
};

export default TechBadge;
