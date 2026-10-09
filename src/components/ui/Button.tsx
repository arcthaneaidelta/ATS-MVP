import React from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'clay';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#B4684A] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] rounded-[8px]';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5 h-8',
      md: 'text-sm px-4 py-2 gap-2 h-10',
      lg: 'text-base px-6 py-3 gap-2.5 h-12',
    };

    const variantStyles = {
      primary:
        'bg-[#2F4A3F] text-white hover:bg-[#243A31] active:bg-[#1B2D26] shadow-sm',
      secondary:
        'bg-transparent text-[#1F2A27] border border-[#DDD6C8] hover:bg-[#EDE8DD] hover:border-[#C5BCA9]',
      clay:
        'bg-[#B4684A] text-white hover:bg-[#9B553B] active:bg-[#85452E] shadow-sm',
      ghost:
        'bg-transparent text-[#4A5550] hover:text-[#1F2A27] hover:bg-[#EDE8DD]',
      danger:
        'bg-[#A5473B] text-white hover:bg-[#8C3A30] active:bg-[#732F27]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Processing...</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-4 h-4 text-current" />
            <span>Done</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
