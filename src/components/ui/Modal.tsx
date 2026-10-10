import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalScale, drawerSlide, bottomSheetSlide } from '../../styles/motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink-900/40 backdrop-blur-none"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            variants={modalScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full ${maxWClasses[maxWidth]} bg-surface-elevated rounded-lg shadow-lg border border-border overflow-hidden z-10 my-auto`}
          >
            {(title || description) && (
              <div className="flex items-start justify-between p-5 border-b border-border bg-surface">
                <div>
                  {title && <h3 className="text-base font-semibold text-ink-900">{title}</h3>}
                  {description && <p className="text-xs text-ink-500 mt-1">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="w-8 h-8 rounded-sm inline-flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-surface-sunken transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-2xl',
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink-900/35"
            onClick={onClose}
          />

          {/* Desktop Right Drawer / Mobile Bottom Sheet */}
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
            {/* Desktop Drawer */}
            <motion.div
              role="dialog"
              aria-modal="true"
              variants={drawerSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`hidden md:flex flex-col w-screen ${width} bg-surface-elevated border-l border-border shadow-lg z-10`}
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-surface">
                <div>
                  {typeof title === 'string' ? (
                    <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
                  ) : (
                    title
                  )}
                  {subtitle && <div className="text-xs text-ink-500 mt-1">{subtitle}</div>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="w-9 h-9 rounded-sm inline-flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-surface-sunken transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </motion.div>

            {/* Mobile Bottom Sheet (Section 15) */}
            <motion.div
              role="dialog"
              aria-modal="true"
              variants={bottomSheetSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden fixed inset-x-0 bottom-0 max-h-[92vh] flex flex-col bg-surface-elevated rounded-t-lg border-t border-border shadow-lg z-10"
            >
              <div className="w-12 h-1 bg-border-strong rounded-full mx-auto my-2.5" />
              <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
                <div>
                  {typeof title === 'string' ? (
                    <h2 className="text-base font-semibold text-ink-900">{title}</h2>
                  ) : (
                    title
                  )}
                  {subtitle && <div className="text-xs text-ink-500 mt-0.5">{subtitle}</div>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close bottom sheet"
                  className="w-11 h-11 inline-flex items-center justify-center text-ink-500 hover:text-ink-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
