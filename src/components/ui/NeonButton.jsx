import React from 'react';
import { cn } from '../../lib/utils';

export const NeonButton = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon = null,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-7 py-3 text-base rounded-xl gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-semibold shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
    outline:
      'bg-transparent text-cyan-400 border border-cyan-400/50 hover:bg-cyan-400/10 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]',
    danger:
      'bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center justify-center font-medium transition-all duration-300 select-none disabled:opacity-50 disabled:pointer-events-none disabled:transform-none cursor-pointer',
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.primary,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />
      )}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
};

export default NeonButton;
