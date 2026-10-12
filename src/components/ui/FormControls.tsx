import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-white text-ink border border-border-strong rounded-md px-3.5 py-2.5 text-sm md:text-base min-h-[44px] md:min-h-[46px] transition-all duration-150 appearance-none pr-10 cursor-pointer',
              'focus:border-primary focus:ring-3 focus:ring-primary/10 focus:outline-none',
              'disabled:bg-bg disabled:text-ink-3 disabled:cursor-not-allowed',
              error && 'border-error focus:border-error focus:ring-error/15',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3.5 w-4 h-4 text-ink-3 pointer-events-none" />
        </div>

        {error ? (
          <p className="text-xs text-error font-medium flex items-center gap-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-ink-3">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink-2"
          >
            {label}
            {props.required && <span className="text-accent ml-1">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-white text-ink border border-border-strong rounded-md p-3.5 text-sm md:text-base transition-all duration-150 placeholder:text-ink-3',
            'focus:border-primary focus:ring-3 focus:ring-primary/10 focus:outline-none',
            'disabled:bg-bg disabled:text-ink-3 disabled:cursor-not-allowed',
            error && 'border-error focus:border-error focus:ring-error/15',
            className
          )}
          {...props}
        />

        {error ? (
          <p className="text-xs text-error font-medium flex items-center gap-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-ink-3">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const checkId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="text-left space-y-1">
        <label className="flex items-start gap-3 cursor-pointer select-none group">
          <input
            id={checkId}
            ref={ref}
            type="checkbox"
            className={cn(
              'mt-0.5 h-4 w-4 rounded text-primary border-border-strong transition focus:ring-primary/20 accent-primary cursor-pointer',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-xs sm:text-sm text-ink-2 group-hover:text-ink transition-colors leading-relaxed">
              {label}
            </span>
          )}
        </label>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
