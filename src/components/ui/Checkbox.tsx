import React from 'react'
import { cn } from '@/lib/cn'
import { Check, AlertCircle } from 'lucide-react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode
  error?: string
  hint?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, hint, id, checked, ...props }, ref) => {
    const checkboxId = id || 'cb-' + Math.random().toString(36).substring(2, 7)

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className="flex items-start gap-3 cursor-pointer select-none group text-left"
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              checked={checked}
              aria-invalid={Boolean(error)}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                'w-5 h-5 rounded-[4px] border transition-all duration-[140ms] flex items-center justify-center bg-white',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-[#3F6C8C]/50 peer-focus-visible:ring-offset-1',
                error
                  ? 'border-[#A94438]'
                  : 'border-[#CFC7B6] group-hover:border-[#17323A]',
                'peer-checked:bg-[#17323A] peer-checked:border-[#17323A]'
              )}
            >
              <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-[#1B2625] leading-snug">{label}</span>
            {hint && <span className="text-xs text-[#6F7A78] mt-0.5">{hint}</span>}
          </div>
        </label>

        {error && (
          <p role="alert" className="text-xs text-[#A94438] flex items-center gap-1 font-medium ml-8">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
