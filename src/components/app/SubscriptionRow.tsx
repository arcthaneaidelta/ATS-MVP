import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MerchantTile } from './MerchantTile';
import type { Subscription } from '@/data/types';
import { cycleShort, formatMoney } from '@/lib/money';
import { fmtDay } from '@/lib/dates';

export interface SubscriptionRowProps {
  subscription: Subscription;
  onClick: () => void;
  compact?: boolean;
}

export function SubscriptionRow({
  subscription,
  onClick,
  compact = false,
}: SubscriptionRowProps) {
  const isCancelled = subscription.status === 'cancelled';
  const hasAttention = subscription.flag && subscription.status === 'active';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`row-btn card mb-2 flex items-center justify-between text-left ${
        compact ? 'p-2.5' : 'p-3.5'
      } ${isCancelled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <MerchantTile name={subscription.name} size={compact ? 'sm' : 'md'} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {hasAttention && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
                aria-label="Worth a look"
              />
            )}
            <h4
              className={`text-sm font-semibold truncate ${
                isCancelled ? 'line-through text-ink-3' : 'text-ink'
              }`}
            >
              {subscription.name}
            </h4>
          </div>
          <p className="text-xs text-ink-3 truncate">
            {isCancelled ? 'Cancelled' : `Renews ${fmtDay(subscription.nextCharge)}`}
          </p>
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
