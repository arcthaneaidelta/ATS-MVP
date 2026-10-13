import React from 'react';
import { Check } from 'lucide-react';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  count?: number;
  className?: string;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  count,
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-sans font-medium transition-all duration-150 border outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
        selected
          ? 'bg-primary text-white border-primary shadow-sm'
          : 'bg-surface text-ink-2 border-line hover:border-line-2 hover:text-ink hover:bg-elevated'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'} ${className}`}
    >
      {selected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            selected ? 'bg-white/20 text-white' : 'bg-bg text-ink-3'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
