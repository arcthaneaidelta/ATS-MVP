import React from 'react'
import { cn } from '@/lib/cn'
import { Loader2, Check } from 'lucide-react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  isSuccess?: boolean
  loadingText?: string
  successText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      loadingText,
      successText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-[8px] transition-all duration-[140ms] cursor-pointer select-none active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'

    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs gap-1.5',
      md: 'h-11 px-5 text-[15px] gap-2',
      lg: 'h-12 px-7 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    }

    const variantStyles = {
      primary:
        'bg-[#17323A] text-[#F6F3EC] hover:bg-[#10252B] active:bg-[#0B1A1F] shadow-[0_1px_2px_rgba(23,50,58,0.06)]',
      secondary:
        'border border-[#CFC7B6] bg-transparent text-[#17323A] hover:bg-[#EFEADF] hover:border-[#17323A] active:bg-[#E6DFD0]',
      ghost:
        'bg-transparent text-[#17323A] hover:bg-[#EFEADF] active:bg-[#E6DFD0]',
      danger:
        'bg-[#A94438] text-white hover:bg-[#8F392E] active:bg-[#752D24]',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{loadingText || children}</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successText || 'Done'}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0 transition-transform duration-140 group-hover:translate-x-1">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
