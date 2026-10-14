import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-[8px] transition-all duration-150 cursor-pointer disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2 min-h-[36px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[44px]'
  }[size];

  const variantClasses = {
    primary: 'bg-[#1F4B4A] text-[#F6F3EE] hover:bg-[#173A39] active:bg-[#112C2B] disabled:opacity-50 disabled:bg-[#1F4B4A] shadow-[0_1px_2px_rgba(30,42,43,0.06)] active:scale-[0.98]',
    secondary: 'bg-transparent border border-[#CFC8BB] text-[#1E2A2B] hover:bg-[#E3EDEB] hover:border-[#1F4B4A] active:bg-[#D4E4E1] disabled:opacity-50 disabled:border-[#E2DDD3]',
    ghost: 'bg-transparent text-[#4A5757] hover:bg-[#E3EDEB] hover:text-[#1E2A2B] active:bg-[#D4E4E1] disabled:opacity-40',
    danger: 'bg-[#A8433A] text-white hover:bg-[#8D362E] active:bg-[#722A23] disabled:opacity-50',
    accent: 'bg-[#B4643C] text-white hover:bg-[#9B5330] active:bg-[#834324] disabled:opacity-50'
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
