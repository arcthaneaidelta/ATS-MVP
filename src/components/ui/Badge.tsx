import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'ok' | 'warn' | 'err' | 'info' | 'clay' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  dot = false,
}) => {
  const variants = {
    neutral: 'bg-surface text-ink-2 border-line',
    ok: 'bg-ok-tint text-ok border-ok/20',
    warn: 'bg-warn-tint text-warn border-warn/30',
    err: 'bg-err-tint text-err border-err/20',
    info: 'bg-info-tint text-info border-info/20',
    clay: 'bg-clay-tint text-clay border-clay/30',
    slate: 'bg-slate/10 text-slate border-slate/20',
  };

  const dotColors = {
    neutral: 'bg-ink-3',
    ok: 'bg-ok',
    warn: 'bg-warn',
    err: 'bg-err',
    info: 'bg-info',
    clay: 'bg-clay',
    slate: 'bg-slate',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-sans font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
