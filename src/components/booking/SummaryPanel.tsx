import React from 'react';
import type { Vehicle, InsurancePackage, PriceQuoteBreakdown } from '../../types';
import { PriceBreakdown } from '../fleet/PriceBreakdown';
import { HoldTimer } from './Stepper';
import { formatDate } from '../../lib/format';
import { Calendar, Shield, Edit3 } from 'lucide-react';

interface SummaryPanelProps {
  vehicle: Vehicle;
  cover: InsurancePackage | null;
  startDate: string;
  endDate: string;
  breakdown: PriceQuoteBreakdown;
  holdExpiresAt: number | null;
  onEditDates?: () => void;
  onEditVehicle?: () => void;
  onEditCover?: () => void;
  onHoldExpire?: () => void;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  vehicle,
  cover,
  startDate,
  endDate,
  breakdown,
  holdExpiresAt,
  onEditDates,
  onEditVehicle,
  onEditCover,
  onHoldExpire,
}) => {
  return (
    <aside className="space-y-4 text-left">
      {/* Hold timer alert chip */}
      {holdExpiresAt && (
        <div className="flex justify-end">
          <HoldTimer expiresAt={holdExpiresAt} onExpire={onHoldExpire} />
        </div>
      )}

      {/* Vehicle Compact Card */}
      <div className="bg-surface rounded-lg p-4 border border-border shadow-sh-1 flex items-start gap-4">
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          className="w-24 h-18 sm:w-28 sm:h-20 rounded-md object-cover border border-border shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent block">
                {vehicle.type}
              </span>
              <h4 className="font-serif text-base sm:text-lg font-normal text-ink leading-snug truncate">
                {vehicle.name}
              </h4>
            </div>
            {onEditVehicle && (
              <button
                type="button"
                onClick={onEditVehicle}
                className="text-[11px] text-accent hover:underline flex items-center gap-1 shrink-0"
              >
                <Edit3 className="w-3 h-3" />
                Change
              </button>
            )}
          </div>

          <div className="text-xs text-ink-3 mt-1">
            {vehicle.seats} seats · {vehicle.transmission} · {vehicle.fuel}
          </div>
        </div>
      </div>

      {/* Trip Dates Row */}
      <div className="bg-surface rounded-lg p-3.5 border border-border shadow-sh-1 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs text-ink">
          <Calendar className="w-4 h-4 text-accent shrink-0" />
          <div>
            <div className="font-medium">
              {formatDate(startDate)} – {formatDate(endDate)}
            </div>
            <div className="text-[11px] text-ink-3">
              {breakdown.days} {breakdown.days === 1 ? 'day rental' : 'days rental'}
            </div>
          </div>
        </div>

        {onEditDates && (
          <button
            type="button"
            onClick={onEditDates}
            className="text-[11px] text-accent hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            Edit
          </button>
        )}
      </div>

      {/* Selected Cover Row */}
      {cover && (
        <div className="bg-surface rounded-lg p-3.5 border border-border shadow-sh-1 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs text-ink">
            <Shield className="w-4 h-4 text-primary shrink-0" />
            <div>
              <div className="font-medium">{cover.name}</div>
              <div className="text-[11px] text-ink-3">
                Excess: {cover.excess === 0 ? 'N$0 (Zero liability)' : `N$${cover.excess.toLocaleString()}`}
              </div>
            </div>
          </div>

          {onEditCover && (
            <button
              type="button"
              onClick={onEditCover}
              className="text-[11px] text-accent hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              Change
            </button>
          )}
        </div>
      )}

      {/* Price breakdown */}
      <PriceBreakdown
        breakdown={breakdown}
        coverName={cover ? cover.name : 'Standard Cover'}
      />
    </aside>
  );
};
