import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isSuccess?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      isSuccess,
      leftAddon,
      rightAddon,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-ink-700 tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 pointer-events-none text-ink-500">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={clsx(
              'w-full text-sm bg-surface rounded-sm border border-border-strong px-3 py-2 text-ink-900 placeholder:text-ink-300 transition-colors duration-150',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
              'disabled:bg-surface-sunken disabled:text-ink-500 disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error/20',
              isSuccess && 'border-success',
              leftAddon && 'pl-9',
              rightAddon || error || isSuccess ? 'pr-9' : '',
              className
            )}
            {...props}
          />
          {error && (
            <div className="absolute right-3 pointer-events-none text-error">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {!error && isSuccess && (
            <div className="absolute right-3 pointer-events-none text-success">
              <Check className="w-4 h-4" />
            </div>
          )}
          {!error && !isSuccess && rightAddon && (
            <div className="absolute right-3 pointer-events-none text-ink-500">
              {rightAddon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-error flex items-center gap-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-ink-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, children, className, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-ink-700 tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full text-sm bg-surface rounded-sm border border-border-strong px-3 py-2 text-ink-900 transition-colors duration-150',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'disabled:bg-surface-sunken disabled:text-ink-500',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-error">{error}</p>}
        {!error && helperText && <p className="text-xs text-ink-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
