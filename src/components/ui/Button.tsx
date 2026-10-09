import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-fast select-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 rounded-input gap-1.5',
      md: 'text-sm px-4 py-2.5 rounded-input gap-2',
      lg: 'text-base px-6 py-3 rounded-input gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-primary text-[#FBFAF7] hover:bg-primary-hover active:bg-primary-active shadow-sh-1 hover:shadow-sh-2',
      secondary: 'bg-text text-[#FBFAF7] hover:bg-text-2 active:bg-text shadow-sh-1',
      ghost: 'bg-transparent text-text border border-border-strong hover:bg-sunken active:bg-border/60',
      danger: 'bg-error text-white hover:bg-error/90 active:bg-error shadow-sh-1',
      accent: 'bg-accent text-white hover:bg-accent/90 active:bg-accent shadow-sh-1',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
