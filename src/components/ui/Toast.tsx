import React from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDemoStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error'
            ? AlertCircle
            : toast.type === 'warning'
            ? AlertTriangle
            : Info;

        const borderBg =
          toast.type === 'success'
            ? 'border-[#C8E1D2] bg-[#FFFFFF] text-[#1E2A2B]'
            : toast.type === 'error'
            ? 'border-[#EBC2BC] bg-[#FFFFFF] text-[#1E2A2B]'
            : toast.type === 'warning'
            ? 'border-[#E8DCBF] bg-[#FFFFFF] text-[#1E2A2B]'
            : 'border-[#C3D7E5] bg-[#FFFFFF] text-[#1E2A2B]';

        const iconColor =
          toast.type === 'success'
            ? 'text-[#3F7D5B]'
            : toast.type === 'error'
            ? 'text-[#A8433A]'
            : toast.type === 'warning'
            ? 'text-[#B58A2B]'
            : 'text-[#3E6A8A]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-[12px] border ${borderBg} shadow-[0_4px_16px_rgba(30,42,43,0.12)] flex items-start gap-3 transform transition-all duration-200 animate-in slide-in-from-bottom-2`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${iconColor} mt-0.5`} />
            <div className="flex-1 text-sm">
              <h4 className="font-medium text-[#1E2A2B]">{toast.title}</h4>
              {toast.message && <p className="text-xs text-[#4A5757] mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded text-[#7B8786] hover:text-[#1E2A2B] hover:bg-[#E3EDEB] transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
