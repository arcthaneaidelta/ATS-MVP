import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'sand' | 'elevated';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#FBF9F4] border border-[#DDD6C8]',
    sand: 'bg-[#EDE8DD] border border-[#DDD6C8]',
    elevated: 'bg-white border border-[#DDD6C8] shadow-[0_1px_2px_rgba(31,42,39,0.06)]',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-[#C5BCA9] hover:shadow-[0_4px_12px_rgba(31,42,39,0.08)] hover:-translate-y-0.5 transition-all duration-200'
    : '';

  return (
    <div
      className={`rounded-[12px] p-5 ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
