import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Info, ShieldCheck, Tag } from 'lucide-react';

export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'accent';

interface StatusChipProps {
  label: string;
  variant?: StatusVariant;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  label,
  variant = 'neutral',
  icon,
  size = 'md',
  className
}) => {
  const styles: Record<StatusVariant, string> = {
    success: 'bg-success-soft text-success border-success/20',
    warning: 'bg-warning-soft text-warning border-warning/20',
    error: 'bg-error-soft text-error border-error/20',
    info: 'bg-info-soft text-info border-info/20',
    neutral: 'bg-sand-soft text-ink-2 border-border',
    accent: 'bg-accent-soft text-accent border-accent/20',
  };

  const defaultIcons: Record<StatusVariant, React.ReactNode> = {
    success: <CheckCircle2 className="w-3.5 h-3.5" />,
    warning: <Clock className="w-3.5 h-3.5" />,
    error: <XCircle className="w-3.5 h-3.5" />,
    info: <Info className="w-3.5 h-3.5" />,
    neutral: <Tag className="w-3.5 h-3.5" />,
    accent: <ShieldCheck className="w-3.5 h-3.5" />,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border border-solid transition-colors select-none',
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        styles[variant],
        className
      )}
    >
      <span className="shrink-0">{icon !== undefined ? icon : defaultIcons[variant]}</span>
      <span>{label}</span>
    </span>
  );
};
