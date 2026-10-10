import React, { forwardRef } from 'react';
import { Loader2, Check } from 'lucide-react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
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
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 rounded-sm gap-1.5 h-8',
      md: 'text-sm px-3.5 py-2 rounded-sm gap-2 h-9',
      lg: 'text-base px-5 py-2.5 rounded-md gap-2.5 h-11',
    };

    const variantStyles = {
      primary:
        'bg-primary text-white hover:bg-primary-hover active:bg-primary-active border border-transparent shadow-xs',
      secondary:
        'bg-surface text-ink-900 border border-border-strong hover:bg-surface-sunken hover:border-ink-500 shadow-xs',
      ghost:
        'text-ink-700 hover:text-ink-900 hover:bg-surface-sunken border border-transparent',
      danger:
        'bg-error text-white hover:bg-[#8F3B32] border border-transparent shadow-xs',
      accent:
        'bg-accent text-white hover:bg-accent-hover active:bg-[#8B5125] border border-transparent shadow-xs',
      icon:
        'text-ink-700 hover:text-ink-900 hover:bg-surface-sunken rounded-sm p-2 h-9 w-9 border border-border/40',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading || isSuccess}
        className={clsx(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          isSuccess && 'bg-success text-white border-transparent',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : isSuccess ? (
          <Check className="w-4 h-4 text-current" />
        ) : (
          leftIcon
        )}

        {children && <span className="truncate">{children}</span>}

        {!isLoading && !isSuccess && rightIcon && (
          <span className="transition-transform duration-150 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
