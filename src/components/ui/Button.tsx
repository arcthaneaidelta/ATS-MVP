import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  isSuccess?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      disabled,
      className = '',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [showSuccess, setShowSuccess] = useState(false);

    // Trigger temporary success state if isSuccess is passed
    React.useEffect(() => {
      if (isSuccess) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 1200);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    const baseStyles =
      'inline-flex items-center justify-center font-medium font-body transition-all duration-150 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2 h-10 gap-2',
      lg: 'text-base px-6 py-3 h-12 gap-2.5',
      icon: 'h-10 w-10 p-0 items-center justify-center',
    };

    const variantStyles = {
      primary:
        'bg-[#2C4A3E] text-[#FBF9F5] hover:bg-[#223A30] active:bg-[#1A2D25] focus-visible:ring-[#2C4A3E] border border-transparent shadow-none',
      secondary:
        'bg-transparent text-[#1B2420] border border-[#DDD8CD] hover:bg-[#EDE9E1] hover:border-[#C7C1B3] active:bg-[#DDD8CD] focus-visible:ring-[#2C4A3E]',
      ghost:
        'bg-transparent text-[#4A5650] hover:text-[#1B2420] hover:bg-[#EDE9E1] active:bg-[#DDD8CD] border-transparent focus-visible:ring-[#2C4A3E]',
      danger:
        'bg-[#A8453A] text-white hover:bg-[#8F3B32] active:bg-[#742F28] focus-visible:ring-[#A8453A]',
      accent:
        'bg-[#B08A4E] text-[#1B2420] hover:bg-[#9F7A3E] active:bg-[#8C692F] focus-visible:ring-[#B08A4E]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        onClick={onClick}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Processing...</span>
          </span>
        ) : showSuccess ? (
          <span className="flex items-center gap-2 text-current">
            <Check className="w-4 h-4" />
            <span>Success</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
