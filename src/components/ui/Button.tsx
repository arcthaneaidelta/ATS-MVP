import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'destructive' | 'inverted';
  size?: 'md' | 'sm';
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      isError = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    let baseClass = 'btn';
    if (variant === 'primary') baseClass += ' btn-primary';
    else if (variant === 'secondary') baseClass += ' btn-secondary';
    else if (variant === 'text') baseClass += ' btn-text';
    else if (variant === 'destructive') baseClass += ' btn-destructive';
    else if (variant === 'inverted') baseClass += ' btn-inverted';

    if (size === 'sm') baseClass += ' btn-sm';
    if (fullWidth) baseClass += ' btn-block';
    if (isLoading) baseClass += ' is-loading';
    if (isSuccess) baseClass += ' is-success';
    if (isError) baseClass += ' is-error';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClass} ${className}`}
        {...props}
      >
        <span className="btn-label">
          {leftIcon}
          {children}
          {rightIcon && <span className="nudge">{rightIcon}</span>}
        </span>

        {isLoading && (
          <span className="btn-state" aria-hidden="true">
            <span className="spinner" />
          </span>
        )}

        {isSuccess && !isLoading && (
          <span className="btn-state" aria-hidden="true">
            <Check size={18} strokeWidth={2} />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
