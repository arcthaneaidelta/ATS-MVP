import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorBanner({
  message = 'Showing your last update from 13 Oct. Pull to refresh.',
  onRetry,
}: ErrorBannerProps) {
  return (
    <div className="p-3 bg-warning-t text-warning border border-warning/30 rounded-md mb-3 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 pr-2">
        <AlertCircle size={15} className="flex-shrink-0" />
        <span className="font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1 font-semibold underline text-warning hover:opacity-80 flex-shrink-0"
        >
          <RotateCcw size={12} />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
