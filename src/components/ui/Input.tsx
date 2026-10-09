import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, helperText, error, success, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-text-2 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={`w-full px-3.5 py-2.5 text-sm rounded-input bg-sunken border transition-all duration-fast text-text placeholder:text-text-muted outline-none
              ${error ? 'border-error focus:ring-2 focus:ring-error/20 bg-surface-elevated' : 'border-border focus:border-primary focus:bg-surface-elevated focus:ring-2 focus:ring-primary/20'}
              ${className}`}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-error">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {success && !error && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-success">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-error flex items-center gap-1 mt-1">
            <span>{error}</span>
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-text-muted mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
