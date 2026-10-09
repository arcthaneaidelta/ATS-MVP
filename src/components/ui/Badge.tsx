import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'clay' | 'pine';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 leading-tight',
    md: 'text-xs px-2.5 py-1 leading-normal',
  };

  const variantStyles = {
    neutral: 'bg-[#EDE8DD] text-[#4A5550] border border-[#DDD6C8]',
    success: 'bg-[#E3EEE4] text-[#4C7A57] border border-[#C2DEC5]',
    warning: 'bg-[#F5EBD0] text-[#8C6418] border border-[#E8D4A2]',
    error: 'bg-[#F3DEDA] text-[#A5473B] border border-[#E4B8B0]',
    info: 'bg-[#E1EAF0] text-[#36566E] border border-[#BFD4E4]',
    clay: 'bg-[#F0DFD5] text-[#9B553B] border border-[#DFC3B3]',
    pine: 'bg-[#E0E8E3] text-[#2F4A3F] border border-[#C5D5CC]',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
