import React from 'react';
import type { Charge } from '@/data/types';
import { formatMoney } from '@/lib/money';
import { fmtDayYear } from '@/lib/dates';

export interface EvidenceTimelineProps {
  history: Charge[];
  hasPriceChange?: boolean;
}

export function EvidenceTimeline({ history, hasPriceChange = false }: EvidenceTimelineProps) {
  const displayCharges = history.slice(0, 4);

  return (
    <div className="space-y-2 mt-2">
      {displayCharges.map((charge, idx) => {
        const isChanged = hasPriceChange && idx === 0;

        return (
          <div
            key={charge.date}
            className="flex items-center justify-between text-xs py-1.5 border-b border-line/50 last:border-0"
          >
            <div className="flex items-center gap-2">
              {isChanged ? (
                <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" aria-label="Price change" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-line-2 flex-shrink-0" />
              )}
              <span className={`font-medium ${isChanged ? 'text-accent' : 'text-ink-2'}`}>
                {fmtDayYear(charge.date)}
              </span>
            </div>

            <span className={`font-semibold tnum ${isChanged ? 'text-accent' : 'text-ink'}`}>
              {formatMoney(charge.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
