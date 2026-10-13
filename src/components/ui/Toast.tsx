import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info', action?: { label: string; onClick: () => void }) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info', action?: { label: string; onClick: () => void }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info', action?: { label: string; onClick: () => void }) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, type, action }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, addToast: toast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-ink text-surface rounded-md shadow-lg border border-line-2 text-sm font-sans animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-ok shrink-0 stroke-[2.5]" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-err shrink-0 stroke-[2.5]" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-clay shrink-0 stroke-[2.5]" />}
              <span className="text-surface font-medium">{t.message}</span>
            </div>
            <div className="flex items-center gap-2">
              {t.action && (
                <button
                  type="button"
                  onClick={() => {
                    t.action?.onClick();
                    removeToast(t.id);
                  }}
                  className="text-xs font-semibold text-clay hover:underline uppercase tracking-wider"
                >
                  {t.action.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-ink-3 hover:text-surface p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
