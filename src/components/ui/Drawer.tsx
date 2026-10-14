import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-[480px]'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
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
    <div
      className="fixed inset-0 z-40 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Scrim backdrop */}
      <div
        className="fixed inset-0 bg-[#1E2A2B]/35 transition-opacity duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${width} bg-[#FFFFFF] border-l border-[#CFC8BB] shadow-[0_16px_40px_rgba(30,42,43,0.14)] flex flex-col transform transition-transform duration-260 ease-out animate-in slide-in-from-right`}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E2DDD3] bg-[#FBF9F6] flex items-start justify-between">
            <div>
              <h3 className="font-serif text-xl font-medium text-[#1E2A2B]">{title}</h3>
              {subtitle && <p className="text-xs text-[#4A5757] mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#7B8786] hover:text-[#1E2A2B] hover:bg-[#E3EDEB] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="p-4 px-6 border-t border-[#E2DDD3] bg-[#FBF9F6] flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
