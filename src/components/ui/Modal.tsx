import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
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
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2A27]/45 transition-opacity"
        onClick={onClose}
      />

      {/* Dialog container */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-[#FBF9F4] rounded-[16px] border border-[#C5BCA9] shadow-[0_16px_40px_rgba(31,42,39,0.14)] z-10 overflow-hidden my-auto`}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-6 border-b border-[#DDD6C8] bg-[#F6F3EC]">
            <div>
              {title && (
                <h3 className="font-serif text-xl text-[#1F2A27] font-medium leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-xs text-[#79827D] mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#79827D] hover:text-[#1F2A27] rounded-md transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
