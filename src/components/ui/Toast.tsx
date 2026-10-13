import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toastVariants } from '@/lib/motion';

export interface ToastProps {
  message: string | null;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <div className="absolute bottom-[72px] left-0 right-0 z-toast flex justify-center px-4 pointer-events-none">
          <motion.div
            role="status"
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-auto h-11 px-4 bg-ink text-surface rounded-pill shadow-sheet flex items-center gap-3 text-sm font-medium"
          >
            <span>{message}</span>
            {actionLabel && onAction && (
              <button
                type="button"
                onClick={onAction}
                className="text-primary-t hover:underline font-semibold text-xs ml-1 focus-visible:outline-none"
              >
                {actionLabel}
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
