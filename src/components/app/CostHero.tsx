import React from 'react';
import { Segmented } from '@/components/ui/Segmented';
import { RollingNumber } from './RollingNumber';
import {
  HORIZONS,
  type Horizon,
  formatMoney,
  totalForHorizon,
  type Totals,
} from '@/lib/money';

export interface CostHeroProps {
  totals: Totals;
  activeHorizon: Horizon;
  onHorizonChange: (h: Horizon) => void;
  count: number;
}

export function CostHero({
  totals,
  activeHorizon,
  onHorizonChange,
  count,
}: CostHeroProps) {
  const currentTotal = totalForHorizon(totals, activeHorizon);
  const formattedFigure = formatMoney(currentTotal);
  const currentHorizonObj = HORIZONS.find((h) => h.id === activeHorizon) || HORIZONS[0];

  const segOptions = HORIZONS.map((h) => ({
    id: h.id,
    label: h.label,
  }));

  return (
    <div className="card p-5 bg-surface text-center shadow-1">
      <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-2">
        You&apos;re paying
      </p>

      {/* Hero Money Figure */}
      <div className="flex items-baseline justify-center gap-1.5 my-1">
        <span className="text-4xl sm:text-5xl font-display font-normal text-ink tracking-tight tnum">
          <RollingNumber formattedValue={formattedFigure} />
        </span>
        <span className="text-sm font-medium text-ink-2 lowercase">
          {currentHorizonObj.unit}
        </span>
      </div>

      {/* Horizon Scrubber */}
      <div className="mt-4 mb-3 max-w-[320px] mx-auto">
        <Segmented
          options={segOptions}
          value={activeHorizon}
          onChange={onHorizonChange}
          name="Cost Horizon"
        />
      </div>

      <p className="text-xs text-ink-3">
        At today&apos;s prices. {count} subscription{count === 1 ? '' : 's'}.
      </p>
    </div>
  );
}
