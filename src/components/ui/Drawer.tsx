import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
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

  const widthClasses = {
    md: 'max-w-[520px]',
    lg: 'max-w-[640px]',
    xl: 'max-w-[760px]',
  };

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div 
        className="fixed inset-0 bg-[#1F2420]/40 transition-opacity duration-base" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div 
          role="dialog"
          aria-modal="true"
          className={`w-screen ${widthClasses[width]} bg-surface-elevated shadow-sh-3 border-l border-border flex flex-col transform transition-transform duration-base ease-out-custom`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-start justify-between bg-surface shrink-0">
            <div>
              {title && <h2 className="text-lg font-semibold text-text">{title}</h2>}
              {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-input text-text-muted hover:text-text hover:bg-sunken transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
