import React, { useState, useMemo } from 'react';
import { SubscriptionRow } from '@/components/app/SubscriptionRow';
import { Segmented } from '@/components/ui/Segmented';
import { useAppStore } from '@/store/useAppStore';
import { formatMoney, monthlyPence } from '@/lib/money';
import { Search, ArrowUpDown, X } from 'lucide-react';
import type { Subscription } from '@/data/types';

export interface SubscriptionsPageProps {
  onSelectSubscription: (sub: Subscription) => void;
}

type FilterType = 'all' | 'monthly' | 'yearly' | 'worth';
type SortType = 'date' | 'cost';

export function SubscriptionsPage({ onSelectSubscription }: SubscriptionsPageProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const subscriptions = useAppStore((state) => state.subscriptions);
  const activeSubs = subscriptions.filter((s) => s.status !== 'cancelled');
  const cancelledSubs = subscriptions.filter((s) => s.status === 'cancelled');

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
    { id: 'worth', label: 'Worth a look' },
  ];

  const filteredList = useMemo(() => {
    let result = [...activeSubs];

    // Filter
    if (filter === 'monthly') {
      result = result.filter((s) => s.cycle === 'monthly');
    } else if (filter === 'yearly') {
      result = result.filter((s) => s.cycle === 'yearly');
    } else if (filter === 'worth') {
      result = result.filter((s) => !!s.flag && s.status === 'active');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sort === 'cost') {
        return monthlyPence(b) - monthlyPence(a);
      }
      return a.nextCharge.localeCompare(b.nextCharge);
    });

    return result;
  }, [activeSubs, filter, searchQuery, sort]);

  // Overall monthly total of active
  const monthlyTotal = activeSubs.reduce((acc, s) => acc + monthlyPence(s), 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-16">
      {/* Search & Sort Controls Bar */}
      <div className="p-4 pb-2 space-y-3 bg-bg flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Search Bar / Trigger */}
          {isSearchOpen ? (
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                placeholder="Search subscriptions…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-8 rounded-pill bg-surface border border-line text-xs text-ink focus:outline-none focus:border-primary"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-3" />
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1.5 text-xs text-ink-3 hover:text-ink px-2.5 py-1.5 rounded-pill bg-surface border border-line"
            >
              <Search size={13} />
              <span>Search</span>
            </button>
          )}

          {/* Sort Button & Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink px-2.5 py-1.5 rounded-pill bg-surface border border-line"
            >
              <ArrowUpDown size={13} />
              <span>{sort === 'date' ? 'Next charge' : 'Highest cost'}</span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-line rounded-md shadow-2 z-30 py-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSort('date');
                    setIsSortOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left hover:bg-surface-2 ${
                    sort === 'date' ? 'font-semibold text-primary' : 'text-ink-2'
                  }`}
                >
                  Next charge
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSort('cost');
                    setIsSortOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left hover:bg-surface-2 ${
                    sort === 'cost' ? 'font-semibold text-primary' : 'text-ink-2'
                  }`}
                >
                  Highest cost
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Segmented Row */}
        <Segmented
          options={filterOptions}
          value={filter}
          onChange={(val) => setFilter(val as FilterType)}
          name="Filter subscriptions"
        />
      </div>

      {/* Subscription List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-2">
        {filteredList.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-ink-2">Nothing matches.</p>
            <button
              type="button"
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs text-primary font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredList.map((sub) => (
              <SubscriptionRow
                key={sub.id}
                subscription={sub}
                onClick={() => onSelectSubscription(sub)}
              />
            ))}
          </div>
        )}

        {/* Cancelled section at bottom */}
        {cancelledSubs.length > 0 && filter === 'all' && (
          <div className="mt-6 pt-4 border-t border-line/60">
            <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider mb-2">
              Cancelled ({cancelledSubs.length})
            </p>
            <div className="space-y-1">
              {cancelledSubs.map((sub) => (
                <SubscriptionRow
                  key={sub.id}
                  subscription={sub}
                  onClick={() => onSelectSubscription(sub)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pinned Total Strip */}
      <div className="h-10 px-5 bg-surface border-t border-line flex items-center justify-between text-xs text-ink-2 flex-shrink-0 z-10 shadow-1">
        <span>{activeSubs.length} subscriptions</span>
        <span className="font-semibold text-ink tnum">
          {formatMoney(monthlyTotal)} a month
        </span>
      </div>
    </div>
  );
}
