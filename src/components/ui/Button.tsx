import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  success?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      success = false,
      disabled,
      children,
      icon,
      iconPosition = 'left',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none rounded-md outline-none';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active shadow-sm',
      secondary: 'bg-sand-soft text-ink hover:bg-[#E6DDCB] active:bg-[#DFD4BF] border border-border',
      accent: 'bg-accent text-white hover:bg-accent-hover active:bg-[#8D4D28] shadow-sm',
      ghost: 'text-ink hover:bg-sand-soft/60 active:bg-sand-soft',
      outline: 'border border-border text-ink hover:bg-sand-soft/50 active:bg-sand-soft',
      destructive: 'bg-error text-white hover:bg-[#913A33] active:bg-[#7D322B] shadow-sm',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
      md: 'text-sm px-4 py-2.5 h-10 gap-2',
      lg: 'text-base px-6 py-3.5 h-12 gap-2.5 min-h-[48px]',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : success ? (
          <Check className="h-4 w-4 text-current animate-in zoom-in" />
        ) : (
          <>
            {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5">
                {icon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
