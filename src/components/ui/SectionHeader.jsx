import React from 'react';
import { cn } from '../../lib/utils';

export const SectionHeader = ({
  badge,
  title,
  highlight,
  subtitle,
  align = 'center', // 'center' | 'left' | 'right'
  badgeColor = 'cyan', // 'cyan' | 'purple' | 'emerald'
  className = '',
}) => {
  const alignClasses = {
    center: 'text-center mx-auto items-center',
    left: 'text-left items-start',
    right: 'text-right ml-auto items-end',
  };

  const badgeStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0.15)]',
  };

  const dotStyles = {
    cyan: 'bg-cyan-400',
    purple: 'bg-purple-400',
    emerald: 'bg-emerald-400',
  };

  return (
    <div className={cn('flex flex-col mb-14 md:mb-16 max-w-3xl', alignClasses[align] || alignClasses.center, className)}>
      {badge && (
        <div
          className={cn(
            'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide uppercase border mb-4',
            badgeStyles[badgeColor] || badgeStyles.cyan
          )}
        >
          <span className={cn('w-2 h-2 rounded-full animate-pulse', dotStyles[badgeColor] || dotStyles.cyan)} />
          {badge}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
        {title}{' '}
        {highlight && (
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500">
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
