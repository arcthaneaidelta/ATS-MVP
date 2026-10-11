import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  preventClose?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  preventClose = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg', // ~480-512px
    lg: 'max-w-xl', // ~560px
    xl: 'max-w-2xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B2420]/45 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={() => !preventClose && onClose()}
      />

      {/* Modal Dialog Content */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg shadow-[0_20px_48px_rgba(27,36,32,0.14)] z-10 overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95`}
      >
        {(title || !preventClose) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-[#DDD8CD]/60 bg-[#FBF9F5]">
            <div>
              {title && (
                <h3 className="text-xl font-display font-medium text-[#1B2420]">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-[#4A5650] mt-1">{description}</p>
              )}
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
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
