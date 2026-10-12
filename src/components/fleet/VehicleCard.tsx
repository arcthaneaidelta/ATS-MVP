import React, { useState } from 'react';
import type { Vehicle } from '../../types';
import { formatCurrency } from '../../lib/format';
import { SpecChips, AvailabilityBadge } from './SpecChips';
import { Button } from '../ui/Button';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { quotePrice } from '../../lib/pricing';
import { useDemoStore } from '../../store/useDemoStore';
import { isAvailable, nextAvailable } from '../../lib/availability';
import { useNavigate } from 'react-router-dom';

interface VehicleCardProps {
  vehicle: Vehicle;
  onOpenDetail?: (vehicle: Vehicle) => void;
  featured?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onOpenDetail,
  featured = false,
}) => {
  const navigate = useNavigate();
  const { searchContext, bookings, blocks } = useDemoStore();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const hasDates = Boolean(searchContext.from && searchContext.to);
  const available = hasDates
    ? isAvailable(vehicle.id, searchContext.from, searchContext.to, bookings, blocks)
    : true;

  const nextFreeDate = !available && searchContext.from
    ? nextAvailable(vehicle.id, searchContext.from, bookings, blocks)
    : undefined;

  // Price calculations
  const breakdown = hasDates
    ? quotePrice(vehicle, null, searchContext.from, searchContext.to)
    : null;

  // Lowest bracket daily rate (e.g. 21+ days or from 1-2 days)
  const lowestRate = vehicle.brackets.reduce(
    (min, b) => (b.dailyRate < min ? b.dailyRate : min),
    vehicle.brackets[0].dailyRate
  );

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1));
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = new URLSearchParams({
      vehicle: vehicle.id,
      from: searchContext.from || '',
      to: searchContext.to || '',
    });
    navigate(`/book?${query.toString()}`);
  };

  const handleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const query = new URLSearchParams({
      vehicle: vehicle.id,
      from: searchContext.from || '',
      to: searchContext.to || '',
    });
    navigate(`/quote?${query.toString()}`);
  };

  return (
    <article
      onClick={() => onOpenDetail && onOpenDetail(vehicle)}
      className={cn(
        'group bg-surface rounded-lg border border-border overflow-hidden flex flex-col transition-all duration-200 text-left cursor-pointer',
        available
          ? 'hover:shadow-sh-2 hover:-translate-y-0.5'
          : 'opacity-80 bg-surface/70 border-border/80'
      )}
    >
      {/* 4:3 Image Container with Hover Carousel Controls */}
      <div className="relative aspect-[4/3] bg-sand-soft overflow-hidden select-none">
        <img
          src={vehicle.images[activeImageIdx] || vehicle.images[0]}
          alt={`${vehicle.name} - ${vehicle.type}`}
          loading="lazy"
          className={cn(
            'w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]',
            !available && 'grayscale-[65%] contrast-90'
          )}
        />

        {/* Category tag */}
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider bg-primary/90 text-white backdrop-blur-xs px-2.5 py-1 rounded-sm">
            {vehicle.type}
          </span>
          {featured && (
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-accent text-white px-2 py-1 rounded-sm">
              Popular
            </span>
          )}
        </div>

        {/* Multi-image indicators and arrows */}
        {vehicle.images.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handlePrevImage}
                className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={handleNextImage}
                className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {vehicle.images.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-200',
                    idx === activeImageIdx
                      ? 'bg-white w-3'
                      : 'bg-white/50'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title & Description preview */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg sm:text-xl font-normal text-ink group-hover:text-primary transition-colors leading-snug">
              {vehicle.name}
            </h3>
          </div>

          <p className="text-xs text-ink-2 line-clamp-2 mt-1 leading-relaxed">
            {vehicle.description}
          </p>

          {/* Specs row */}
          <div className="mt-3.5">
            <SpecChips vehicle={vehicle} />
          </div>
        </div>

        {/* Pricing & Availability Bottom Section */}
        <div className="pt-3 border-t border-border/70 space-y-3">
          {/* Availability badge */}
          <AvailabilityBadge
            available={available}
            nextDate={nextFreeDate}
            hasDates={hasDates}
          />

          {/* Price display block */}
          <div className="flex items-baseline justify-between">
            {hasDates && breakdown ? (
              <div className="text-left">
                <div className="font-serif text-xl sm:text-2xl font-semibold text-primary tabular-nums">
                  {formatCurrency(breakdown.rentalTotal)}
                </div>
                <div className="text-[11px] text-ink-2">
                  {breakdown.days} days @ {formatCurrency(breakdown.dailyRate)}/day
                </div>
              </div>
            ) : (
              <div className="text-left">
                <span className="text-xs text-ink-3">from</span>{' '}
                <span className="font-serif text-xl sm:text-2xl font-semibold text-primary tabular-nums">
                  {formatCurrency(lowestRate)}
                </span>
                <span className="text-xs text-ink-2"> / day</span>
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail && onOpenDetail(vehicle);
              }}
              className="text-xs text-accent hover:text-accent-hover font-medium underline underline-offset-2"
            >
              Specs & Rates →
            </button>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {available ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBook}
                  className="w-full"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Book Now
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleQuote}
                  className="w-full"
                  icon={<FileText className="w-3.5 h-3.5" />}
                >
                  Get Quote
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="w-full opacity-60 cursor-not-allowed"
                >
                  Not Available
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    const el = document.getElementById('search-dates-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    else window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full"
                >
                  Change Dates
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
