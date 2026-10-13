import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MerchantTile } from './MerchantTile';
import type { Subscription } from '@/data/types';
import { cycleShort, formatMoney } from '@/lib/money';

export interface WorthALookRowProps {
  subscription: Subscription;
  onClick: () => void;
}

export function getWorthALookReason(sub: Subscription): string {
  if (sub.id === 'puregym') {
    return 'Went up £3.00 in September';
  }
  if (sub.id === 'now') {
    return 'You have 3 streaming services (£30.97 a month)';
  }
  if (sub.id === 'dropbox') {
    return 'Overlaps with iCloud+ storage';
  }
  if (sub.id === 'amazon') {
    return 'Renews £95 on 18 Nov (36 days)';
  }
  if (sub.flag?.kind === 'price-rise') {
    const diff = sub.flag.to - sub.flag.from;
    return `Went up ${formatMoney(diff)} in September`;
  }
  if (sub.flag?.kind === 'annual-renewal') {
    return 'Upcoming annual renewal';
  }
  return 'Review suggested';
}

export function WorthALookRow({ subscription, onClick }: WorthALookRowProps) {
  const reason = getWorthALookReason(subscription);

  return (
    <button
      type="button"
      onClick={onClick}
      className="row-btn p-3.5 card mb-2 flex items-center justify-between text-left group"
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="relative">
          <MerchantTile name={subscription.name} size="md" />
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-surface"
            aria-label="Worth a look"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-ink truncate">{subscription.name}</h4>
          <p className="text-xs text-ink-2 truncate">{reason}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-semibold text-ink tnum">
          {formatMoney(subscription.amount)}
          <span className="text-xs font-normal text-ink-3">
            {cycleShort(subscription.cycle)}
          </span>
        </span>
        <ChevronRight size={16} className="chev" />
      </div>
    </button>
  );
}
