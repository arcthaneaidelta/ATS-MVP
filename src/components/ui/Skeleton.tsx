import React from 'react';
import clsx from 'clsx';
import { Button } from './Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'skeleton-shimmer rounded-xs bg-surface-sunken',
        className
      )}
    />
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}: {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-dashed border-border rounded-md">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center text-ink-500 mb-3">
          <Icon className="w-6 h-6 stroke-[1.5]" />
        </div>
      )}
      <h4 className="text-base font-semibold text-ink-900 mb-1">{title}</h4>
      <p className="text-xs text-ink-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  message = "We couldn't load this record. Your data hasn't changed.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-error-tint/60 border border-error/30 rounded-sm text-sm text-error">
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span className="text-xs font-medium">{message}</span>
      </div>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-error hover:bg-error-tint hover:text-error"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
