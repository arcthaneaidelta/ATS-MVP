import React from 'react';
import type { OutcomeType, PlatformType } from '../../types';
import { getOutcomeBadge, getPlatformBadge, getSeverityBadge } from '../../lib/format';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'clay';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  const variantClasses = {
    neutral: 'bg-[#E3EDEB] text-[#1E2A2B] border border-[#CFC8BB]',
    success: 'bg-[#E1EEE6] text-[#3F7D5B] border border-[#C8E1D2]',
    warning: 'bg-[#F4EAD0] text-[#B58A2B] border border-[#E8DCBF]',
    error: 'bg-[#F5DEDA] text-[#A8433A] border border-[#EBC2BC]',
    info: 'bg-[#DEE9F1] text-[#3E6A8A] border border-[#C3D7E5]',
    clay: 'bg-[#F3E3D8] text-[#B4643C] border border-[#E6C7B6]'
  }[variant];

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${variantClasses} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export const OutcomeChip: React.FC<{ outcome: OutcomeType; size?: 'sm' | 'md' }> = ({ outcome, size = 'sm' }) => {
  const badge = getOutcomeBadge(outcome);
  const Icon = outcome === 'Recorded' ? CheckCircle2 : XCircle;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${badge.bg} ${badge.text} ${badge.border} ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{badge.label}</span>
    </span>
  );
};

export const PlatformChip: React.FC<{ platform: PlatformType }> = ({ platform }) => {
  const badge = getPlatformBadge(platform);
  return (
    <span className={`inline-flex items-center text-[11px] font-mono px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
      {platform}
    </span>
  );
};

export const SeverityChip: React.FC<{ severity: 'High' | 'Medium' | 'Low' }> = ({ severity }) => {
  const badge = getSeverityBadge(severity);
  const Icon = severity === 'High' ? AlertTriangle : severity === 'Medium' ? AlertTriangle : ShieldCheck;

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
      <Icon className="w-3 h-3" />
      <span>{severity}</span>
    </span>
  );
};
