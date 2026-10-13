import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, hint, helperText, prefix, suffix, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const displayHint = error ? undefined : hint || helperText;

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs uppercase tracking-wider font-semibold text-ink-2 mb-1.5 font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none flex items-center">
              {prefix}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-11 bg-elevated text-ink placeholder:text-ink-3/70 rounded-md border text-base sm:text-sm font-sans transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:bg-surface disabled:text-ink-3 ${
              prefix ? 'pl-9' : 'pl-3.5'
            } ${suffix || error || success ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-err focus-visible:border-err focus-visible:ring-err/20'
                : success
                ? 'border-ok focus-visible:border-ok focus-visible:ring-ok/20'
                : 'border-line-2 hover:border-ink-3'
            } ${className}`}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-err pointer-events-none flex items-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {success && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ok pointer-events-none flex items-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {!error && !success && suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 flex items-center pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-err font-sans flex items-center gap-1">{error}</p>
        ) : displayHint ? (
          <p className="mt-1 text-xs text-ink-3 font-sans">{displayHint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charCount?: number;
  maxChars?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, charCount, maxChars, className = '', id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left">
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-xs uppercase tracking-wider font-semibold text-ink-2 font-sans"
            >
              {label}
            </label>
          )}
          {maxChars !== undefined && charCount !== undefined && (
            <span
              className={`text-xs font-mono tabular-nums ${
                charCount > maxChars ? 'text-err font-medium' : 'text-ink-3'
              }`}
            >
              {charCount}/{maxChars}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full p-3 bg-elevated text-ink placeholder:text-ink-3/70 rounded-md border text-base sm:text-sm font-sans transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:bg-surface disabled:text-ink-3 ${
            error
              ? 'border-err focus-visible:border-err focus-visible:ring-err/20'
              : 'border-line-2 hover:border-ink-3'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-err font-sans flex items-center gap-1">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-ink-3 font-sans">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs uppercase tracking-wider font-semibold text-ink-2 mb-1.5 font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full h-11 px-3.5 pr-10 bg-elevated text-ink rounded-md border text-base sm:text-sm font-sans appearance-none transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:bg-surface disabled:text-ink-3 ${
              error
                ? 'border-err focus-visible:border-err'
                : 'border-line-2 hover:border-ink-3'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="mt-1 text-xs text-err font-sans">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-xs text-ink-3 font-sans">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
