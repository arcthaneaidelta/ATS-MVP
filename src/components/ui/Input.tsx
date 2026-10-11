import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixText?: string;
  isSuccess?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefixText, isSuccess, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[#4A5650]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixText && (
            <span className="absolute left-3.5 text-sm font-mono text-[#7C867F] select-none pointer-events-none">
              {prefixText}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-11 px-3.5 ${prefixText ? 'pl-8' : ''} ${
              error ? 'border-[#A8453A] focus:border-[#A8453A] focus:ring-[#A8453A]/20' : 'border-[#DDD8CD] focus:border-[#2C4A3E] focus:ring-[#E3EBE6]'
            } bg-[#EDE9E1] text-[#1B2420] text-sm rounded-md border transition-colors duration-150 placeholder:text-[#7C867F] focus:outline-none focus:ring-2 disabled:opacity-50 disabled:bg-[#DDD8CD]/40 ${className}`}
            {...props}
          />
          {error && (
            <span className="absolute right-3.5 text-[#A8453A] pointer-events-none">
              <AlertCircle className="w-4 h-4" />
            </span>
          )}
          {isSuccess && !error && (
            <span className="absolute right-3.5 text-[#3E7D5A] pointer-events-none">
              <Check className="w-4 h-4" />
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#A8453A] flex items-center gap-1 font-medium mt-0.5">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[#7C867F] mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
