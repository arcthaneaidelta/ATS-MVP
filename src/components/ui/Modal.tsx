import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg'
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Scrim backdrop */}
      <div
        className="fixed inset-0 bg-[#1E2A2B]/40 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] shadow-[0_16px_40px_rgba(30,42,43,0.14)] overflow-hidden transition-all duration-200 transform scale-100 animate-in fade-in zoom-in-95`}
      >
        <div className="flex items-start justify-between p-6 border-b border-[#E2DDD3] bg-[#FBF9F6]">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1E2A2B]">{title}</h3>
            {subtitle && <p className="text-xs text-[#4A5757] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#7B8786] hover:text-[#1E2A2B] hover:bg-[#E3EDEB] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 px-6 border-t border-[#E2DDD3] bg-[#FBF9F6]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
