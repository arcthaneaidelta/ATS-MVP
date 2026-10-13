import React from 'react';
import type { Subscription } from '@/data/types';
import { annualPence, formatMoney } from '@/lib/money';

export interface CostStripProps {
  subscription: Subscription;
}

export function CostStrip({ subscription }: CostStripProps) {
  const annual = annualPence(subscription);
  const fiveYears = annual * 5;
  const tenYears = annual * 10;

  return (
    <div className="p-3 bg-surface-2 rounded-md grid grid-cols-3 gap-2 text-center">
      <div>
        <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-wider">A year</p>
        <p className="text-xs font-semibold text-ink tnum mt-0.5">{formatMoney(annual)}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-wider">5 years</p>
        <p className="text-xs font-semibold text-ink tnum mt-0.5">{formatMoney(fiveYears)}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-wider">10 years</p>
        <p className="text-xs font-semibold text-ink tnum mt-0.5">{formatMoney(tenYears)}</p>
      </div>
    </div>
  );
}
