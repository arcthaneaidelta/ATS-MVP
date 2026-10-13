import React, { forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  block?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      loadingText,
      successText,
      block = false,
      icon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-medium transition-all duration-150 relative select-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2';

    const variants = {
      primary: 'bg-clay text-white hover:bg-clay-h active:bg-clay-a rounded-md shadow-sm',
      secondary: 'bg-primary text-white hover:bg-primary-h active:bg-primary-a rounded-md shadow-sm',
      ghost: 'bg-transparent text-ink border border-line-2 hover:bg-surface hover:border-ink-3 rounded-md',
      danger: 'bg-err text-white hover:bg-red-700 active:bg-red-800 rounded-md',
      icon: 'p-2 text-ink-2 hover:text-ink hover:bg-surface rounded-full',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2.5 h-10 gap-2',
      lg: 'text-base px-6 py-3 h-12 gap-2.5',
    };

    const sizeClass = variant === 'icon' ? '' : sizes[size];
    const widthClass = block ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading || isSuccess}
        className={`${baseStyles} ${variants[variant]} ${sizeClass} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{loadingText || children}</span>
          </span>
        ) : isSuccess ? (
          <span className="flex items-center gap-2 text-white">
            <Check className="w-4 h-4 shrink-0 text-white stroke-[2.5]" />
            <span>{successText || 'Completed'}</span>
          </span>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
