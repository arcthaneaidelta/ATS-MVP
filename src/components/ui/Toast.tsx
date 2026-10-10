import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  const iconMap = {
    success: <CheckCircle2 className="w-4 h-4 text-success shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-warning shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-error shrink-0" />,
    info: <Info className="w-4 h-4 text-info shrink-0" />,
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-surface-elevated border border-border shadow-md rounded-md text-sm text-ink-900"
          >
            <div className="flex items-center gap-2.5">
              {iconMap[t.type]}
              <span className="text-xs font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-ink-300 hover:text-ink-700 p-0.5 rounded-xs"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
