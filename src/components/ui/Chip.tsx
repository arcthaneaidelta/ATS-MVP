import React from 'react';

export interface ChipProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  onClick,
  selected,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const variantClasses = {
    neutral: 'bg-sunken text-text-2 border-border',
    primary: 'bg-primary-soft text-primary border-primary/20',
    accent: 'bg-accent-soft text-accent border-accent/20',
    success: 'bg-[#3F7A57]/15 text-success border-[#3F7A57]/20',
    warning: 'bg-warning/15 text-[#8F661B] border-warning/20',
    error: 'bg-error/15 text-error border-error/20',
    info: 'bg-info/15 text-info border-info/20',
  };

  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-transform' 
    : '';

  const selectedClasses = selected 
    ? 'ring-2 ring-primary ring-offset-1 font-semibold' 
    : '';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium rounded-chip border ${sizeClasses} ${variantClasses[variant]} ${interactiveClasses} ${selectedClasses} ${className}`}
    >
      {children}
    </span>
  );
};
