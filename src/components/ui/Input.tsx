import React from 'react'
import { cn } from '@/lib/cn'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  isRequired?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      isRequired,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-sm font-semibold text-[#17323A] flex items-center gap-1.5"
            >
              <span>{label}</span>
              {isRequired && (
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#8A5F2B]">
                  Required
                </span>
              )}
            </label>
          </div>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#6F7A78] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              'w-full h-12 rounded-[8px] bg-white border px-3.5 text-base text-[#1B2625] placeholder:text-[#6F7A78] transition-all duration-[140ms]',
              'focus:border-[#17323A] focus:outline-none focus:ring-2 focus:ring-[#3F6C8C]/35',
              error
                ? 'border-[#A94438] focus:border-[#A94438] focus:ring-[#A94438]/20'
                : 'border-[#CFC7B6] hover:border-[#17323A]/60',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-[#6F7A78] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-[#A94438] flex items-center gap-1 font-medium mt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-[#6F7A78] mt-0.5">
            {hint}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
