import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#79827D]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-[8px] border bg-[#FBF9F4] text-[#1F2A27] text-sm px-3.5 py-2.5 transition-colors placeholder:text-[#79827D] focus:outline-none focus:ring-2 focus:ring-[#B4684A] focus:ring-offset-1 focus:border-[#2F4A3F] ${
              leftIcon ? 'pl-10' : ''
            } ${
              error
                ? 'border-[#A5473B] text-[#A5473B] focus:border-[#A5473B] focus:ring-[#A5473B]'
                : success
                ? 'border-[#4C7A57]'
                : 'border-[#DDD6C8] hover:border-[#C5BCA9]'
            } ${className}`}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#A5473B]">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {success && !error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#4C7A57]">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-[#A5473B] font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-[#79827D]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
