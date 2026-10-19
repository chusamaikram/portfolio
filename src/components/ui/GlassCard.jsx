import React from 'react';
import { cn } from '../../lib/utils';

export const GlassCard = ({
  children,
  className = '',
  glowColor = 'cyan', // 'cyan' | 'blue' | 'purple' | 'emerald' | 'amber' | 'none'
  hoverEffect = true,
  cyberCorners = false,
  onClick,
  ...props
}) => {
  const glowStyles = {
    cyan: 'hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]',
    blue: 'hover:border-blue-400/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    purple: 'hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    emerald: 'hover:border-emerald-400/40 hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]',
    amber: 'hover:border-amber-400/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]',
    none: '',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-2xl bg-[#0b1329]/70 backdrop-blur-xl border border-white/10 transition-all duration-300',
        hoverEffect && 'hover:-translate-y-1',
        glowStyles[glowColor] || glowStyles.cyan,
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Subtle interior gradient reflection */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />

      {/* Futuristic Cyber Corner Accents */}
      {cyberCorners && (
        <>
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-sm pointer-events-none" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-sm pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-sm pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/60 rounded-br-sm pointer-events-none" />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
