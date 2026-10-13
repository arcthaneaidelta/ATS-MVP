import React from 'react';

export interface CountdownRingProps {
  daysLeft: number;
  totalDays?: number;
  size?: number;
}

export function CountdownRing({
  daysLeft,
  totalDays = 14,
  size = 44,
}: CountdownRingProps) {
  const isUrgent = daysLeft <= 2;
  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  // Clamped ratio for the circle stroke
  const progressRatio = Math.max(0, Math.min(1, daysLeft / totalDays));
  const strokeDashoffset = circumference * (1 - progressRatio);

  const strokeColor = isUrgent ? 'var(--accent)' : 'var(--primary)';

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line-2)"
          strokeWidth={strokeWidth}
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-med ease-out"
        />
      </svg>

      <span
        className={`absolute text-xs font-semibold tnum ${
          isUrgent ? 'text-accent' : 'text-ink'
        }`}
      >
        {daysLeft}d
      </span>
    </div>
  );
}
