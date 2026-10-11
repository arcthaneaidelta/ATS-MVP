import React, { useState } from 'react';
import { useAppStore } from '../store';
import { formatCurrency } from '../lib/format';
import { ActivityItem } from '../types';
import { Button } from '../components/ui/Button';
import {
  ArrowDownLeft,
  Ticket,
  Trophy,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { activity } = useAppStore();
  const [filter, setFilter] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState<number>(10);

  const filtered = activity.filter((act) => {
    if (filter === 'all') return true;
    return act.type === filter;
  });

  const visibleItems = filtered.slice(0, displayCount);

  // Group by dateGroup
  const groups: { [key: string]: ActivityItem[] } = {};
  visibleItems.forEach((item) => {
    if (!groups[item.dateGroup]) groups[item.dateGroup] = [];
    groups[item.dateGroup].push(item);
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-[#3E7D5A]" />;
      case 'entry':
        return <Ticket className="w-4 h-4 text-[#2C4A3E]" />;
      case 'win':
        return <Trophy className="w-4 h-4 text-[#B08A4E]" />;
      case 'payout':
        return <ArrowUpRight className="w-4 h-4 text-[#7C867F]" />;
      default:
        return <Ticket className="w-4 h-4 text-[#2C4A3E]" />;
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
          Unified Activity Feed
        </h1>
        <p className="text-xs text-[#7C867F] mt-1">
          Chronological audit trail of sub-wallet deposits, pool entries, and prize payouts
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EDE9E1] rounded-md text-xs w-fit">
        {['all', 'deposits', 'entries', 'wins', 'payouts'].map((f) => {
          const typeKey = f === 'deposits' ? 'deposit' : f === 'entries' ? 'entry' : f === 'wins' ? 'win' : f === 'payouts' ? 'payout' : 'all';
          const isActive = filter === typeKey;

          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(typeKey)}
              className={`px-3 py-1.5 rounded capitalize transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#1B2420] font-semibold shadow-sm'
                  : 'text-[#4A5650] hover:text-[#1B2420]'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grouped Feed */}
      {Object.keys(groups).length === 0 ? (
        <div className="p-12 text-center bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg text-xs text-[#7C867F]">
          No activity records found matching the "{filter}" filter.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([dateLabel, items]) => (
            <div key={dateLabel} className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7C867F] px-1">
                {dateLabel}
              </span>

              <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg divide-y divide-[#DDD8CD]/40">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#FBF9F5] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EDE9E1] flex items-center justify-center shrink-0 mt-0.5">
                        {getIcon(it.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1B2420] text-sm">{it.title}</h4>
                        <p className="text-[#4A5650] mt-0.5 leading-relaxed">{it.description}</p>
                        {it.txHash && (
                          <span className="font-mono text-[11px] text-[#7C867F] block mt-1">
                            Tx: {it.txHash}
                          </span>
                        )}
                      </div>
                    </div>

                    {it.amount !== undefined && (
                      <div className="text-left sm:text-right shrink-0">
                        <span
                          className={`font-mono text-sm font-semibold tabular-nums block ${
                            it.isPositive ? 'text-[#3E7D5A]' : 'text-[#1B2420]'
                          }`}
                        >
                          {it.isPositive ? '+' : '-'}{formatCurrency(it.amount)}
                        </span>
                        <span className="text-[11px] text-[#7C867F]">
                          {new Date(it.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filtered.length > displayCount && (
        <div className="flex justify-center pt-4">
          <Button
            variant="secondary"
            onClick={() => setDisplayCount((c) => c + 10)}
          >
            Load older activity records
          </Button>
        </div>
      )}
    </div>
  );
};
