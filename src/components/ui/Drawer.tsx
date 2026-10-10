import React, { useEffect } from 'react'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  width?: 'sm' | 'md' | 'lg'
  position?: 'right' | 'left'
  showCloseButton?: boolean
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'md',
  position = 'right',
  showCloseButton = true,
}) => {
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

  const widthClasses = {
    sm: 'sm:w-[380px]',
    md: 'sm:w-[420px]',
    lg: 'sm:w-[500px]',
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex overflow-hidden"
    >
      {/* Scrim */}
      <div
        className="fixed inset-0 bg-[#17323A]/45 transition-opacity duration-300 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div
        className={cn(
          'relative ml-auto w-full h-full bg-[#FFFFFF] shadow-[0_24px_48px_-16px_rgba(23,50,58,0.22)] border-l border-[#E3DDD0] flex flex-col z-10 transition-transform duration-380 ease-out',
          widthClasses[width],
          position === 'left' ? 'mr-auto ml-0 border-r border-l-0' : ''
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#E3DDD0] shrink-0 bg-[#FBF9F4]">
          <div>
            {title && (
              <h3 className="text-lg font-serif font-medium text-[#17323A]">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[#4A5755] mt-0.5">{description}</p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6F7A78] hover:text-[#17323A] hover:bg-[#EFEADF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}
