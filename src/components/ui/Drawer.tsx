import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  preventClose?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  preventClose = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
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
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B2420]/45 transition-opacity duration-200"
        onClick={() => !preventClose && onClose()}
      />

      {/* Drawer content: right sheet on desktop (440px), bottom sheet on mobile (<640px) */}
      <div className="relative z-10 w-full sm:w-[440px] max-w-full h-full max-h-[92vh] sm:max-h-full mt-auto sm:mt-0 bg-[#FFFFFF] border-t sm:border-t-0 sm:border-l border-[#DDD8CD] rounded-t-lg sm:rounded-none shadow-[0_20px_48px_rgba(27,36,32,0.14)] flex flex-col transform transition-transform duration-260 ease-out">
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-[#DDD8CD] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#DDD8CD]/60 bg-[#FBF9F5]">
          <div>
            <h3 className="text-xl font-display font-medium text-[#1B2420]">{title}</h3>
            {subtitle && <p className="text-xs text-[#7C867F] mt-1">{subtitle}</p>}
          </div>
          {!preventClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#7C867F] hover:text-[#1B2420] p-1.5 rounded-md hover:bg-[#EDE9E1] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="p-6 border-t border-[#DDD8CD]/60 bg-[#FBF9F5]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
