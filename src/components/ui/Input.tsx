import React from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-ink-3 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-white text-ink border border-border-strong rounded-md px-3.5 py-2.5 text-sm md:text-base min-h-[44px] md:min-h-[46px] transition-all duration-150 placeholder:text-ink-3',
              'focus:border-primary focus:ring-3 focus:ring-primary/10 focus:outline-none',
              'disabled:bg-bg disabled:text-ink-3 disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              (rightIcon || error || success) && 'pr-10',
              error && 'border-error focus:border-error focus:ring-error/15',
              success && 'border-success focus:border-success focus:ring-success/15',
              className
            )}
            {...props}
          />

          <div className="absolute right-3.5 flex items-center pointer-events-none">
            {error ? (
              <AlertCircle className="w-4 h-4 text-error" />
            ) : success ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : (
              rightIcon
            )}
          </div>
        </div>

        {error ? (
          <p className="text-xs text-error font-medium flex items-center gap-1 animate-in fade-in-50">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-ink-3">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
