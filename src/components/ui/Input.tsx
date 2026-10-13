import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  isValid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, isValid, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const helperId = helper && inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-ink-2 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={errorId || helperId}
            className={`field-input ${error ? 'is-error' : ''} ${className}`}
            {...props}
          />
          {isValid && !error && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-success pointer-events-none">
              <Check size={18} strokeWidth={2} />
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-xs text-error font-medium">
            {error}
          </p>
        )}
        {!error && helper && (
          <p id={helperId} className="mt-1 text-xs text-ink-3">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
