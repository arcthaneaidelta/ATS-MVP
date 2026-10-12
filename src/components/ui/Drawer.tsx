import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { drawerVariants, sheetVariants } from '../../lib/motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'max-w-lg',
  footer,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-drawer flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#141A17]/55 backdrop-blur-[2px]"
          />

          {/* Drawer container (Desktop: right drawer, Mobile: bottom sheet) */}
          <motion.div
            variants={isMobile ? sheetVariants : drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative z-10 bg-surface shadow-sh-3 border-border flex flex-col overflow-hidden text-left',
              isMobile
                ? 'w-full self-end max-h-[92dvh] rounded-t-xl border-t'
                : cn('h-full w-full border-l', width)
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Drag Handle */}
            {isMobile && (
              <div className="w-full pt-3 pb-1 flex justify-center">
                <div className="w-12 h-1.5 bg-border-strong rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between px-6 py-5 border-b border-border/70 shrink-0">
                <div className="pr-4">
                  {title && (
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink leading-tight">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs sm:text-sm text-ink-2 mt-1">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-sand-soft transition-colors shrink-0"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-5 border-t border-border/80 bg-surface-elevated shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
