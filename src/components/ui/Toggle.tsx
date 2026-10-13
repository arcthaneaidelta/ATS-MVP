import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
      }`}
    >
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`w-9 h-5 rounded-full transition-colors duration-150 relative p-0.5 outline-none focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${
          checked ? 'bg-primary' : 'bg-line-2'
        }`}
      >
        <span
          className={`block w-4 h-4 rounded-full bg-white transition-transform duration-120 shadow-sm active:scale-x-110 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      {label && <span className="text-xs font-sans font-medium text-ink">{label}</span>}
    </label>
  );
};
