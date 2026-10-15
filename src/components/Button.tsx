import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  disabledTooltip?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  success = false,
  disabled = false,
  disabledTooltip,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-input transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-meridian-primary focus:ring-offset-2 select-none active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
  };

  const variantStyles = {
    primary:
      'bg-meridian-primary text-white hover:bg-meridian-primary-hover active:bg-meridian-primary-active disabled:bg-meridian-border-strong disabled:text-meridian-text-muted',
    accent:
      'bg-meridian-accent text-white hover:opacity-95 active:opacity-90 disabled:bg-meridian-border-strong disabled:text-meridian-text-muted',
    secondary:
      'bg-meridian-surface text-meridian-secondary border border-meridian-border hover:bg-meridian-surface-sunken hover:border-meridian-border-strong active:bg-meridian-border',
    ghost:
      'bg-transparent text-meridian-text-secondary hover:bg-meridian-surface-sunken hover:text-meridian-text-primary active:bg-meridian-border-strong',
    danger:
      'bg-meridian-error text-white hover:opacity-90 active:opacity-95 disabled:bg-meridian-border-strong',
  };

  const isBlocked = disabled || loading;

  const content = (
    <button
      {...props}
      disabled={isBlocked}
      onClick={onClick}
      onMouseEnter={() => disabledTooltip && isBlocked && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        isBlocked ? 'opacity-60' : ''
      } ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : success ? (
        <>
          <Check className="w-4 h-4 text-current animate-in zoom-in-75 duration-200" />
          <span>Done</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );

  if (disabledTooltip && (disabled || isBlocked)) {
    return (
      <div className="relative inline-block">
        {content}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-2.5 py-1 text-xs text-white bg-meridian-text-primary rounded shadow-sh-2 whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
            {disabledTooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-meridian-text-primary" />
          </div>
        )}
      </div>
    );
  }

  return content;
};
