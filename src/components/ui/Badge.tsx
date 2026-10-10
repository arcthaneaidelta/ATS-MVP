import React, { useState } from 'react';
import clsx from 'clsx';
import { Copy, Check } from 'lucide-react';
import { getPriceFreshness } from '../../lib/format';

export interface BadgeProps {
  variant?: 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  children,
  className,
}: BadgeProps) {
  const variantStyles = {
    neutral: 'bg-surface-sunken text-ink-700 border-border',
    primary: 'bg-primary-tint text-primary border-primary/20',
    accent: 'bg-accent-tint text-accent border-accent/20',
    success: 'bg-success-tint text-success border-success/20',
    warning: 'bg-warning-tint text-warning border-warning/20',
    error: 'bg-error-tint text-error border-error/20',
    info: 'bg-info-tint text-info border-info/20',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 rounded-xs font-medium',
    md: 'text-xs px-2 py-0.5 rounded-xs font-medium',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 border border-solid leading-normal tracking-tight',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  let variant: BadgeProps['variant'] = 'neutral';
  const lower = status.toLowerCase();

  if (
    lower.includes('won') ||
    lower.includes('paid') ||
    lower.includes('matched') ||
    lower.includes('delivered') ||
    lower.includes('approved')
  ) {
    variant = 'success';
  } else if (
    lower.includes('review') ||
    lower.includes('warning') ||
    lower.includes('multiple') ||
    lower.includes('partial') ||
    lower.includes('transit') ||
    lower.includes('expire')
  ) {
    variant = 'warning';
  } else if (
    lower.includes('overdue') ||
    lower.includes('lost') ||
    lower.includes('unmatched') ||
    lower.includes('error') ||
    lower.includes('not found') ||
    lower.includes('cancelled')
  ) {
    variant = 'error';
  } else if (lower.includes('sent') || lower.includes('issued') || lower.includes('active') || lower.includes('negotiat')) {
    variant = 'info';
  } else if (lower.includes('draft') || lower.includes('pending')) {
    variant = 'neutral';
  }

  return (
    <Badge variant={variant} size="sm">
      <span
        className={clsx('w-1.5 h-1.5 rounded-full inline-block', {
          'bg-success': variant === 'success',
          'bg-warning': variant === 'warning',
          'bg-error': variant === 'error',
          'bg-info': variant === 'info',
          'bg-ink-500': variant === 'neutral',
        })}
      />
      {status}
    </Badge>
  );
}

export function FreshnessDot({ dateStr }: { dateStr: string }) {
  const { color, label } = getPriceFreshness(dateStr);

  const dotColors = {
    green: 'bg-success',
    amber: 'bg-warning',
    grey: 'bg-ink-300',
  };

  return (
    <span
      title={label}
      className="inline-flex items-center gap-1.5 cursor-help"
      aria-label={label}
    >
      <span className={clsx('w-2 h-2 rounded-full inline-block', dotColors[color])} />
    </span>
  );
}

export function LatestBadge({
  date,
  reference,
}: {
  date?: string;
  reference?: string;
}) {
  return (
    <span
      title={date && reference ? `Latest quotation: ${reference} (${date})` : 'Latest recorded price'}
      className="inline-flex items-center gap-1 bg-accent-tint text-accent border border-accent/30 text-[10.5px] font-semibold px-1.5 py-0.5 rounded-xs uppercase tracking-wider"
    >
      Latest
    </span>
  );
}

export function PartNumber({
  value,
  className,
  showCopy = true,
}: {
  value: string;
  className?: string;
  showCopy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <span
      className={clsx(
        'group inline-flex items-center gap-1.5 font-mono text-ink-900 font-medium tracking-tight',
        className
      )}
    >
      <span className="tabular-nums">{value}</span>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          title="Copy part number"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-ink-500 hover:text-ink-900 rounded-xs"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-success" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </span>
  );
}
