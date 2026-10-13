import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`p-8 text-center border border-dashed border-line rounded-lg bg-surface/50 max-w-md mx-auto my-6 ${className}`}
    >
      {icon && <div className="text-ink-3 mb-3 flex justify-center">{icon}</div>}
      <h3 className="text-base font-serif text-ink mb-1">{title}</h3>
      <p className="text-sm font-sans text-ink-3 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="ghost" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
