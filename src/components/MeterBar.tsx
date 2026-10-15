import React from 'react';

interface MeterBarProps {
  label: string;
  current: number;
  max: number;
  unitPrefix?: string;
  unitSuffix?: string;
  showPercent?: boolean;
  className?: string;
}

export const MeterBar: React.FC<MeterBarProps> = ({
  label,
  current,
  max,
  unitPrefix = '',
  unitSuffix = '',
  showPercent = true,
  className = '',
}) => {
  const percent = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  const isNearLimit = percent >= 80 && percent < 100;
  const isAtLimit = percent >= 100;

  let barColor = 'bg-meridian-primary';
  let badgeColor = 'text-meridian-text-secondary';

  if (isAtLimit) {
    barColor = 'bg-meridian-error';
    badgeColor = 'text-meridian-error font-semibold';
  } else if (isNearLimit) {
    barColor = 'bg-meridian-warning';
    badgeColor = 'text-meridian-warning font-medium';
  }

  const formattedCurrent =
    unitPrefix === '$' ? `$${current.toLocaleString()}` : `${current.toLocaleString()}${unitSuffix}`;
  const formattedMax =
    unitPrefix === '$' ? `$${max.toLocaleString()}` : `${max.toLocaleString()}${unitSuffix}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-meridian-text-secondary">{label}</span>
        <span className={`tabular-nums ${badgeColor}`}>
          {max === 0 ? (
            <span className="text-meridian-text-muted">0 / 0 (Locked on Free)</span>
          ) : (
            <>
              {formattedCurrent} <span className="text-meridian-text-muted">/ {formattedMax}</span>
              {showPercent && <span className="ml-1.5 opacity-80">({percent}%)</span>}
            </>
          )}
        </span>
      </div>

      <div className="relative h-2 w-full bg-meridian-surface-sunken rounded-full overflow-hidden border border-meridian-border/60">
        <div
          className={`h-full ${barColor} origin-left transition-transform duration-500 ease-out rounded-full`}
          style={{ transform: `scaleX(${max === 0 ? 0 : percent / 100})` }}
        />
      </div>

      {isAtLimit && max > 0 && (
        <p className="text-[11px] text-meridian-error leading-tight animate-in fade-in">
          Monthly allowance exhausted. Bookings above quota require plan tier upgrade.
        </p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="text-[11px] text-meridian-warning leading-tight">
          Approaching monthly limit ({percent}% consumed).
        </p>
      )}
    </div>
  );
};
