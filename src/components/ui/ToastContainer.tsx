import React, { useEffect } from 'react';
import { useAppStore } from '../../store';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      removeToast(toasts[toasts.length - 1].id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div 
      role="status" 
      aria-live="polite" 
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const icon = toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-error shrink-0" />
        ) : toast.type === 'info' ? (
          <Info className="w-5 h-5 text-info shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-surface-elevated border border-border rounded-card p-3.5 shadow-sh-2 flex items-start gap-3 transition-all duration-fast transform translate-y-0"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-text leading-tight">{toast.title}</h4>
              <p className="text-xs text-text-2 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-muted hover:text-text p-1 -mr-1 -mt-1 rounded hover:bg-sunken transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
