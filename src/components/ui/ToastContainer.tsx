import React from 'react';
import { useDemoStore } from '../../store/demoStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useDemoStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        const bgBorder = isSuccess
          ? 'bg-[#E3EEE4] border-[#C2DEC5] text-[#1F2A27]'
          : isError
          ? 'bg-[#F3DEDA] border-[#E4B8B0] text-[#1F2A27]'
          : isWarning
          ? 'bg-[#F5EBD0] border-[#E8D4A2] text-[#1F2A27]'
          : 'bg-[#FBF9F4] border-[#DDD6C8] text-[#1F2A27]';

        const iconColor = isSuccess
          ? 'text-[#4C7A57]'
          : isError
          ? 'text-[#A5473B]'
          : isWarning
          ? 'text-[#B98A2E]'
          : 'text-[#4B6A82]';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[12px] border shadow-[0_4px_12px_rgba(31,42,39,0.08)] transition-all animate-in slide-in-from-bottom-2 duration-200 ${bgBorder}`}
          >
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
              {isSuccess && <CheckCircle2 className="w-4 h-4" />}
              {isError && <AlertCircle className="w-4 h-4" />}
              {isWarning && <AlertCircle className="w-4 h-4" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold">{toast.title}</h4>
              <p className="text-xs text-[#4A5550] mt-0.5 leading-relaxed">{toast.description}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#79827D] hover:text-[#1F2A27] p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
