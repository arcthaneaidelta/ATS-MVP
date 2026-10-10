import React from 'react'
import { cn } from '@/lib/cn'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
  id?: string
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
}) => {
  const switchId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      {label && (
        <div className="flex flex-col">
          <label
            htmlFor={switchId}
            className="text-sm font-semibold text-[#17323A] cursor-pointer"
          >
            {label}
          </label>
          {description && (
            <span className="text-xs text-[#6F7A78] mt-0.5">{description}</span>
          )}
        </div>
      )}

      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6C8C] focus-visible:ring-offset-2',
          checked ? 'bg-[#17323A]' : 'bg-[#CFC7B6]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}
