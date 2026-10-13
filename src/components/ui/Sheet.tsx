import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/lib/a11y';
import { sheetVariants, scrimVariants } from '@/lib/motion';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tall?: boolean;
  showCloseButton?: boolean;
}

export function Sheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  tall = false,
  showCloseButton = true,
}: SheetProps) {
  const containerRef = useFocusTrap(isOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-sheet flex items-end justify-center pointer-events-auto">
          {/* Scrim */}
          <motion.div
            className="absolute inset-0 bg-[#1E2A2B]/35"
            variants={scrimVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet panel */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full max-w-[480px] bg-surface rounded-t-[20px] shadow-sheet z-10 flex flex-col overflow-hidden ${
              tall ? 'max-h-[88dvh] h-[85dvh]' : 'max-h-[82dvh]'
            }`}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-2.5 pb-1 cursor-grab" onClick={onClose}>
              <div className="w-9 h-1 rounded-full bg-line-2" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-line">
              <div>
                <h3 id="sheet-title" className="text-lg font-semibold text-ink font-display">
                  {title}
                </h3>
                {subtitle && <p className="text-xs text-ink-3 mt-0.5">{subtitle}</p>}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close sheet"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink-3 hover:text-ink hover:bg-surface-2 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto no-scrollbar flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
