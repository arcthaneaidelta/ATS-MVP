import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  'aria-label': string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
  className = '',
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`switch ${className}`}
    >
      <span className="switch-thumb" aria-hidden="true" />
    </button>
  );
}
