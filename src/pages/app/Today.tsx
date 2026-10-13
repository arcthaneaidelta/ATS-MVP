import React, { useState } from 'react';
import { CostHero } from '@/components/app/CostHero';
import { WorthALookRow } from '@/components/app/WorthALookRow';
import { EmptyState } from '@/components/app/EmptyState';
import { ErrorBanner } from '@/components/app/ErrorBanner';
import { useAppStore } from '@/store/useAppStore';
import { type Horizon, formatMoney } from '@/lib/money';
import { CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import type { Subscription } from '@/data/types';
import { fmtDay } from '@/lib/dates';

export interface TodayPageProps {
  onSelectSubscription: (sub: Subscription) => void;
  onNavigateToSubscriptions: () => void;
}

export function TodayPage({
  onSelectSubscription,
  onNavigateToSubscriptions,
}: TodayPageProps) {
  const [horizon, setHorizon] = useState<Horizon>('month');
  const [showAllWorth, setShowAllWorth] = useState(false);
  const getTotals = useAppStore((state) => state.getTotals);
  const getWorthALook = useAppStore((state) => state.getWorthALook);
  const subscriptions = useAppStore((state) => state.subscriptions);
  const savedPerYear = useAppStore((state) => state.savedPerYear);
  const demoFlags = useAppStore((state) => state.demoFlags);

  const totals = getTotals();
  const worthItems = getWorthALook();
  const activeSubs = subscriptions.filter((s) => s.status !== 'cancelled');

  // Next 3 upcoming charges sorted by nextCharge date
  const nextUp = [...activeSubs]
    .sort((a, b) => a.nextCharge.localeCompare(b.nextCharge))
    .slice(0, 3);

  const visibleWorth = showAllWorth ? worthItems : worthItems.slice(0, 3);
  const hasMoreWorth = worthItems.length > 3 && !showAllWorth;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-20 space-y-5">
      {/* Error state toggle banner */}
      {demoFlags.showErrorState && (
        <ErrorBanner message="Showing your last update from 13 Oct. Pull to refresh." />
      )}

      {/* Hero Cost Scrubber Card */}
      <CostHero
        totals={totals}
        activeHorizon={horizon}
        onHorizonChange={setHorizon}
        count={activeSubs.length}
      />

      {/* Saved Counter Pill (Ticks up after cancellation) */}
      {savedPerYear > 0 && (
        <div className="bg-primary-t/80 text-primary border border-primary/20 rounded-pill px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold shadow-1 animate-pulse">
          <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
          <span>Saved {formatMoney(savedPerYear)} a year</span>
        </div>
      )}

      {/* Worth a Look Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider">
            Worth a look ({worthItems.length})
          </h2>
          {worthItems.length > 0 && (
            <span className="text-[11px] text-accent font-semibold">
              Review suggested
            </span>
          )}
        </div>

        {demoFlags.showEmptyState || worthItems.length === 0 ? (
          <EmptyState
            title="Nothing needs a look. Enjoy the quiet."
            description="All active subscriptions are steady and predictable."
          />
        ) : (
          <div className="space-y-2">
            {visibleWorth.map((sub) => (
              <WorthALookRow
                key={sub.id}
                subscription={sub}
                onClick={() => onSelectSubscription(sub)}
              />
            ))}

            {hasMoreWorth && (
              <button
                type="button"
                onClick={() => setShowAllWorth(true)}
                className="w-full py-2 text-center text-xs font-medium text-primary hover:underline"
              >
                See 1 more (Amazon Prime)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Next Up Section */}
      {nextUp.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h2 className="text-xs font-semibold text-ink-3 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} />
              <span>Next up</span>
            </h2>
            <button
              type="button"
              onClick={onNavigateToSubscriptions}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-0.5"
            >
              <span>See all</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="card bg-surface divide-y divide-line overflow-hidden">
            {nextUp.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubscription(sub)}
                className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-surface-2/60 transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-ink truncate">{sub.name}</p>
                  <p className="text-[11px] text-ink-3">Due {fmtDay(sub.nextCharge)}</p>
                </div>
                <span className="text-xs font-semibold text-ink tnum">
                  {formatMoney(sub.amount)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
