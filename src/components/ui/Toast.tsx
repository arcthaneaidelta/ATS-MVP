import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (options: { type?: 'success' | 'error' | 'info' | 'warning'; title?: string; message: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message }: { type?: 'success' | 'error' | 'info' | 'warning'; title?: string; message: string }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, type, title, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container: top on mobile, bottom-right on desktop */}
      <div
        aria-live="polite"
        className="fixed z-[80] top-4 sm:top-auto sm:bottom-6 right-4 sm:right-6 flex flex-col gap-2 max-w-sm w-[calc(100vw-32px)] sm:w-auto pointer-events-none"
      >
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-[#3E7D5A] shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-[#A8453A] shrink-0" />,
            warning: <AlertCircle className="w-5 h-5 text-[#B7791F] shrink-0" />,
            info: <Info className="w-5 h-5 text-[#3F6B8A] shrink-0" />,
          };

          return (
            <div
              key={t.id}
              className="pointer-events-auto bg-[#FFFFFF] border border-[#DDD8CD] shadow-[0_6px_20px_rgba(27,36,32,0.08)] rounded-md p-3.5 flex items-start gap-3 transform transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
            >
              {icons[t.type]}
              <div className="flex-1 min-w-0 pr-2">
                {t.title && (
                  <h4 className="text-xs font-semibold text-[#1B2420] tracking-wide uppercase mb-0.5">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs text-[#4A5650] leading-relaxed">{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-[#7C867F] hover:text-[#1B2420] p-1 rounded hover:bg-[#EDE9E1] transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
