import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'Nothing needs a look. Enjoy the quiet.',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-12 px-6 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-primary-t text-primary flex items-center justify-center mb-3">
        <CheckCircle2 size={24} strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-semibold text-ink font-display">{title}</h3>
      {description && <p className="text-xs text-ink-3 mt-1 max-w-[28ch]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
