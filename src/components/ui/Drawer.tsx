import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = 'md',
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

  const widthStyles = {
    md: 'max-w-[480px]',
    lg: 'max-w-[640px]',
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2A27]/45 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen ${widthStyles[width]} bg-[#FBF9F4] border-l border-[#C5BCA9] shadow-[0_16px_40px_rgba(31,42,39,0.18)] flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDD6C8] bg-[#F6F3EC]">
            <div>
              {title && (
                <h3 className="font-serif text-xl text-[#1F2A27] font-medium leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && <p className="text-xs text-[#79827D] mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#79827D] hover:text-[#1F2A27] hover:bg-[#EDE8DD] rounded-md transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
