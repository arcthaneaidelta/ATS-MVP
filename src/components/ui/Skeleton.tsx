import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#EDE8DD] rounded-[8px] ${className}`}
    />
  );
};
