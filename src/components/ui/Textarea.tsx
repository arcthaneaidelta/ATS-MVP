import React from 'react'
import { cn } from '@/lib/cn'
import { AlertCircle } from 'lucide-react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  isRequired?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, isRequired, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
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

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          className={cn(
            'w-full min-h-[100px] rounded-[8px] bg-white border p-3 text-base text-[#1B2625] placeholder:text-[#6F7A78] transition-all duration-[140ms]',
            'focus:border-[#17323A] focus:outline-none focus:ring-2 focus:ring-[#3F6C8C]/35',
            error
              ? 'border-[#A94438] focus:border-[#A94438] focus:ring-[#A94438]/20'
              : 'border-[#CFC7B6] hover:border-[#17323A]/60',
            className
          )}
          {...props}
        />

        {error ? (
          <p
            id={`${textareaId}-error`}
            role="alert"
            className="text-xs text-[#A94438] flex items-center gap-1 font-medium mt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={`${textareaId}-hint`} className="text-xs text-[#6F7A78] mt-0.5">
            {hint}
          </p>
        ) : null}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
