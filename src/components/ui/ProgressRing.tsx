import React from 'react';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showText?: boolean;
  className?: string;
  subtext?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 64,
  strokeWidth = 5,
  color = 'var(--primary)',
  trackColor = 'var(--line)',
  showText = true,
  className = '',
  subtext,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-mono font-semibold text-ink tabular-nums">
            {Math.round(clamped)}%
          </span>
          {subtext && <span className="text-[9px] text-ink-3 uppercase">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
