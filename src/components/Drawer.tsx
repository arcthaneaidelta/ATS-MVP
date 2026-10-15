import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  side?: 'right' | 'bottom';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'max-w-md md:max-w-xl',
  side = 'right',
}) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-meridian-text-primary/35 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 flex max-w-full ${
          side === 'bottom' ? 'bottom-0 inset-x-0 inset-y-auto max-h-[85vh]' : ''
        }`}
      >
        <div
          role="dialog"
          aria-modal="true"
          className={`w-screen ${width} bg-meridian-surface border-l border-meridian-border shadow-sh-3 flex flex-col animate-in slide-in-from-right duration-250`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-meridian-border bg-meridian-surface-elevated">
            <div>
              <h2 className="text-lg font-serif font-medium text-meridian-text-primary">
                {title}
              </h2>
              {description && (
                <p className="text-xs text-meridian-text-secondary mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-meridian-text-muted hover:text-meridian-text-primary hover:bg-meridian-surface-sunken transition-colors"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">{children}</div>

          {footer && (
            <div className="border-t border-meridian-border px-6 py-4 bg-meridian-surface-sunken/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
