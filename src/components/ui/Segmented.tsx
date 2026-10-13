import React from 'react';

export interface SegmentOption<T extends string = string> {
  id: T;
  label: string;
}

export interface SegmentedProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
  name?: string;
}

export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  name,
}: SegmentedProps<T>) {
  const activeIndex = options.findIndex((o) => o.id === value);
  const widthPct = options.length > 0 ? 100 / options.length : 100;

  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={`seg ${className}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
    >
      <div
        className="seg-thumb"
        style={{
          width: `calc(${widthPct}% - 6px)`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
        aria-hidden="true"
      />
      {options.map((opt) => {
        const isSelected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.id)}
            className="seg-item flex items-center justify-center text-center"
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
