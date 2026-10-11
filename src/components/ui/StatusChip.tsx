import React from 'react';

export interface StatusChipProps {
  status?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  isPulsing?: boolean;
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status = 'neutral',
  label,
  isPulsing = false,
  className = '',
}) => {
  const styles = {
    success: 'bg-[#3E7D5A]/10 text-[#3E7D5A] border-[#3E7D5A]/20',
    warning: 'bg-[#B7791F]/10 text-[#B7791F] border-[#B7791F]/20',
    error: 'bg-[#A8453A]/10 text-[#A8453A] border-[#A8453A]/20',
    info: 'bg-[#3F6B8A]/10 text-[#3F6B8A] border-[#3F6B8A]/20',
    neutral: 'bg-[#EDE9E1] text-[#4A5650] border-[#DDD8CD]',
  };

  const dotColors = {
    success: 'bg-[#3E7D5A]',
    warning: 'bg-[#B7791F]',
    error: 'bg-[#A8453A]',
    info: 'bg-[#3F6B8A]',
    neutral: 'bg-[#7C867F]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border text-xs font-medium tracking-wide ${styles[status]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColors[status]} ${
          isPulsing ? 'animate-pulse' : ''
        }`}
      />
      <span>{label}</span>
    </span>
  );
};
