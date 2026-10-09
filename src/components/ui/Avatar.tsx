import React from 'react';

export interface AvatarProps {
  initials: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, name, size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  // Consistent background color based on initials
  const hash = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  const colorCombos = [
    'bg-[#E0E8E3] text-[#2F4A3F] border-[#C5D5CC]',
    'bg-[#F0DFD5] text-[#9B553B] border-[#DFC3B3]',
    'bg-[#E1EAF0] text-[#36566E] border-[#BFD4E4]',
    'bg-[#EDE8DD] text-[#4A5550] border-[#DDD6C8]',
  ];
  const colorClass = colorCombos[hash % colorCombos.length];

  return (
    <div
      title={name}
      className={`inline-flex items-center justify-center font-medium rounded-full border select-none shrink-0 ${sizeStyles[size]} ${colorClass} ${className}`}
    >
      {initials}
    </div>
  );
};
