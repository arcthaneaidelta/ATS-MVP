import React from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#4A5757] tracking-wider uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-[#7B8786] pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#FFFFFF] border border-[#CFC8BB] text-[#1E2A2B] text-sm rounded-[8px] py-2 ${
            icon ? 'pl-9 pr-3' : 'px-3'
          } placeholder-[#7B8786] focus:border-[#1F4B4A] focus:outline-none transition-colors duration-150 ${
            error ? 'border-[#A8433A] focus:border-[#A8433A]' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-[#A8433A] mt-0.5">{error}</span>}
    </div>
  );
};

export const SearchInput: React.FC<Omit<InputProps, 'icon'>> = (props) => {
  return <Input icon={<Search className="w-4 h-4" />} {...props} />;
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-[#4A5757] tracking-wider uppercase">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`bg-[#FFFFFF] border border-[#CFC8BB] text-[#1E2A2B] text-sm rounded-[8px] py-2 px-3 focus:border-[#1F4B4A] focus:outline-none transition-colors duration-150 cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
