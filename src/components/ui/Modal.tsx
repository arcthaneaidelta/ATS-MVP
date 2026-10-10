import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-[560px]',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Scrim */}
      <div
        className="fixed inset-0 bg-[#17323A]/50 transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-[#FFFFFF] rounded-t-[16px] sm:rounded-[16px] shadow-[0_24px_48px_-16px_rgba(23,50,58,0.22)] border border-[#E3DDD0] max-h-[90svh] flex flex-col overflow-hidden transform transition-all duration-280 animate-in fade-in zoom-in-[0.98]',
          maxWidthClasses[maxWidth]
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-5 pb-3 border-b border-[#E3DDD0] shrink-0">
            <div>
              {title && (
                <h3 id="modal-title" className="text-xl font-serif font-medium text-[#17323A]">
                  {title}
                </h3>
              )}
              {description && (
                <p id="modal-description" className="text-sm text-[#4A5755] mt-1">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6F7A78] hover:text-[#17323A] hover:bg-[#EFEADF] transition-colors -mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
