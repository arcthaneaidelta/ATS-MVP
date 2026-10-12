import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDemoStore } from '../store/useDemoStore';
import { VehicleCard } from '../components/fleet/VehicleCard';
import { VehicleDrawer } from '../components/fleet/VehicleDrawer';
import { DateRangePicker } from '../components/ui/DateRangePicker';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { isAvailable, nextAvailable } from '../lib/availability';
import { quotePrice } from '../lib/pricing';
import { Filter, RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Vehicle, VehicleCategory } from '../types';

export const Fleet: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { vehicles, searchContext, setSearchContext, clearSearchDates, bookings, blocks } = useDemoStore();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loadingShimmer, setLoadingShimmer] = useState(false);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('type') || searchContext.type || 'all'
  );
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc'>('recommended');

  // Sync dates with URL query params if present on mount
  useEffect(() => {
    const qFrom = searchParams.get('from');
    const qTo = searchParams.get('to');
    const qType = searchParams.get('type');

    if (qFrom && qTo) {
      setSearchContext({ from: qFrom, to: qTo, type: qType || 'all' });
    }
  }, [searchParams, setSearchContext]);

  // Simulate smooth skeleton check when dates or filters change
  const handleDatesChange = (from: string, to: string) => {
    setLoadingShimmer(true);
    setSearchContext({ from, to });
    setTimeout(() => {
      setLoadingShimmer(false);
    }, 320);
  };

  // Filter and sort vehicles
  const hasDates = Boolean(searchContext.from && searchContext.to);

  const filteredVehicles = vehicles.filter((v) => {
    if (!v.active) return false;
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (selectedTransmission !== 'all' && v.transmission.toLowerCase() !== selectedTransmission) return false;
    return true;
  });

  // Sort available first, then by chosen sort rule
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (hasDates) {
      const aAvail = isAvailable(a.id, searchContext.from, searchContext.to, bookings, blocks);
      const bAvail = isAvailable(b.id, searchContext.from, searchContext.to, bookings, blocks);
      if (aAvail && !bAvail) return -1;
      if (!aAvail && bAvail) return 1;
    }

    if (sortBy === 'price_asc') {
      return a.brackets[0].dailyRate - b.brackets[0].dailyRate;
    }
    if (sortBy === 'price_desc') {
      return b.brackets[0].dailyRate - a.brackets[0].dailyRate;
    }
    return 0; // recommended order
  });

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Fleet' },
    { id: '4x4', label: '4x4 Off-Road' },
    { id: 'suv', label: 'SUV 4x4' },
    { id: 'compact', label: 'Compact Cars' },
    { id: 'van', label: '9-Seater Van' },
  ];

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-content mx-auto text-left">
      {/* Page Header */}
      <div className="space-y-2 mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
          Namibia Self-Drive Fleet
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-ink">
          Our Fleet & Rates
        </h1>
        <p className="text-sm sm:text-base text-ink-2 max-w-2xl leading-relaxed">
          {hasDates
            ? `Displaying dynamic prices calculated for ${searchContext.from} to ${searchContext.to}. Longer rentals automatically trigger lower daily rates.`
            : 'Select your trip dates above to view live availability and calculate your tiered duration rate.'}
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md rounded-xl p-4 border border-border shadow-sh-1 mb-10 space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Dates Picker */}
          <div className="w-full lg:w-96">
            <DateRangePicker
              startDate={searchContext.from}
              endDate={searchContext.to}
              onChange={handleDatesChange}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'text-xs px-3 py-1.5 rounded-full font-medium transition-colors select-none',
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-sand-soft text-ink-2 hover:bg-sand'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Transmission & Sort Selects */}
          <div className="flex items-center gap-2.5 shrink-0">
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="bg-white text-xs border border-border-strong rounded px-2.5 py-1.5 text-ink focus:outline-none"
            >
              <option value="all">Any Gearbox</option>
              <option value="manual">Manual Only</option>
              <option value="automatic">Automatic Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white text-xs border border-border-strong rounded px-2.5 py-1.5 text-ink focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filters Clear Bar */}
        {(selectedCategory !== 'all' || selectedTransmission !== 'all' || hasDates) && (
          <div className="flex items-center justify-between text-xs text-ink-3 pt-2 border-t border-border/60">
            <span className="flex items-center gap-2">
              <span className="font-semibold text-ink">{sortedVehicles.length}</span> vehicle
              {sortedVehicles.length === 1 ? '' : 's'} matching criteria
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTransmission('all');
                clearSearchDates();
              }}
              className="text-accent hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Fleet Cards Grid */}
      {loadingShimmer ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-lg border border-border p-4 space-y-4">
              <Skeleton className="w-full aspect-[4/3]" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : sortedVehicles.length === 0 ? (
        <div className="bg-surface rounded-xl p-12 text-center border border-border max-w-lg mx-auto space-y-4">
          <h3 className="font-serif text-2xl font-normal text-ink">
            No matching vehicles
          </h3>
          <p className="text-sm text-ink-2">
            Nothing matches those filter criteria. Try selecting fewer filters or adjusting your trip dates.
          </p>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTransmission('all');
              clearSearchDates();
            }}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onOpenDetail={(v) => setSelectedVehicle(v)}
            />
          ))}
        </div>
      )}

      {/* Vehicle Detail Drawer */}
      <VehicleDrawer
        vehicle={selectedVehicle}
        isOpen={Boolean(selectedVehicle)}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  );
};
