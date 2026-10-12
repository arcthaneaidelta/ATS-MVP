import React from 'react';
import type { Vehicle } from '../../types';
import { Users, Gauge, Fuel, Briefcase } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SpecChips: React.FC<{ vehicle: Vehicle; className?: string }> = ({
  vehicle,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-2 gap-2 text-xs text-ink-2', className)}>
      <div className="flex items-center gap-2 bg-sand-soft/50 px-2.5 py-1.5 rounded-sm border border-border/50">
        <Users className="w-3.5 h-3.5 text-ink-3 shrink-0" />
        <span>{vehicle.seats} seats</span>
      </div>
      <div className="flex items-center gap-2 bg-sand-soft/50 px-2.5 py-1.5 rounded-sm border border-border/50">
        <Gauge className="w-3.5 h-3.5 text-ink-3 shrink-0" />
        <span>{vehicle.transmission}</span>
      </div>
      <div className="flex items-center gap-2 bg-sand-soft/50 px-2.5 py-1.5 rounded-sm border border-border/50">
        <Fuel className="w-3.5 h-3.5 text-ink-3 shrink-0" />
        <span>{vehicle.fuel}</span>
      </div>
      <div className="flex items-center gap-2 bg-sand-soft/50 px-2.5 py-1.5 rounded-sm border border-border/50">
        <Briefcase className="w-3.5 h-3.5 text-ink-3 shrink-0" />
        <span className="truncate">{vehicle.luggage}</span>
      </div>
    </div>
  );
};

export const AvailabilityBadge: React.FC<{
  available: boolean;
  nextDate?: string;
  hasDates: boolean;
}> = ({ available, nextDate, hasDates }) => {
  if (!hasDates) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-ink-3">
        <span className="w-2 h-2 rounded-full bg-border-strong" />
        <span>Select dates to check availability</span>
      </div>
    );
  }

  if (available) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-success">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span>Available for selected dates</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-left">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-error">
        <span className="w-2 h-2 rounded-full bg-error" />
        <span>Not available for your dates</span>
      </div>
      {nextDate && (
        <span className="text-[11px] text-ink-2 mt-0.5 font-medium">
          Next free: from {nextDate}
        </span>
      )}
    </div>
  );
};
