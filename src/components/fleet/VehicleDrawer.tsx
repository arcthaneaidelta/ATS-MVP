import React, { useState } from 'react';
import type { Vehicle } from '../../types';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/format';
import { SpecChips, AvailabilityBadge } from './SpecChips';
import { useDemoStore } from '../../store/useDemoStore';
import { quotePrice, getBracket } from '../../lib/pricing';
import { isAvailable, nextAvailable } from '../../lib/availability';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Check, ShieldCheck, Info } from 'lucide-react';
import { InfoTooltip } from '../ui/Tooltip';
import { cn } from '../../lib/utils';

interface VehicleDrawerProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleDrawer: React.FC<VehicleDrawerProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { searchContext, bookings, blocks } = useDemoStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  if (!vehicle) return null;

  const hasDates = Boolean(searchContext.from && searchContext.to);
  const available = hasDates
    ? isAvailable(vehicle.id, searchContext.from, searchContext.to, bookings, blocks)
    : true;

  const nextFreeDate = !available && searchContext.from
    ? nextAvailable(vehicle.id, searchContext.from, bookings, blocks)
    : undefined;

  const breakdown = hasDates
    ? quotePrice(vehicle, null, searchContext.from, searchContext.to)
    : null;

  const currentBracket = hasDates && breakdown
    ? breakdown.bracket
    : null;

  const mainImage = selectedImg || vehicle.images[0];

  const handleBook = () => {
    onClose();
    const query = new URLSearchParams({
      vehicle: vehicle.id,
      from: searchContext.from || '',
      to: searchContext.to || '',
    });
    navigate(`/book?${query.toString()}`);
  };

  const handleQuote = () => {
    onClose();
    const query = new URLSearchParams({
      vehicle: vehicle.id,
      from: searchContext.from || '',
      to: searchContext.to || '',
    });
    navigate(`/quote?${query.toString()}`);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle.name}
      description={`${vehicle.type} · Ready for Namibian Terrain`}
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-ink-3">
              {hasDates ? `${breakdown?.days} Days Rental` : 'Standard Day Rate'}
            </div>
            <div className="font-serif text-2xl font-semibold text-primary tabular-nums">
              {hasDates && breakdown
                ? formatCurrency(breakdown.rentalTotal)
                : `${formatCurrency(vehicle.brackets[0].dailyRate)}/day`}
            </div>
          </div>

          <div className="flex gap-2">
            {available ? (
              <>
                <Button variant="secondary" size="md" onClick={handleQuote}>
                  Get Quote
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleBook}
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Book Now
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="md" onClick={handleQuote}>
                Enquire for Other Dates
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-left">
        {/* Photo Gallery with Thumbnails */}
        <div className="space-y-2.5">
          <div className="aspect-[16/10] bg-sand-soft rounded-lg overflow-hidden border border-border">
            <img
              src={mainImage}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
          </div>

          {vehicle.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {vehicle.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImg(img)}
                  className={cn(
                    'w-20 h-14 rounded-md overflow-hidden border-2 shrink-0 transition-all',
                    mainImage === img ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Availability status line */}
        <div className="p-3 bg-surface-elevated rounded-md border border-border flex items-center justify-between">
          <AvailabilityBadge
            available={available}
            nextDate={nextFreeDate}
            hasDates={hasDates}
          />
          {hasDates && (
            <span className="text-xs text-ink-2">
              {searchContext.from} to {searchContext.to}
            </span>
          )}
        </div>

        {/* Specs Overview */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            Vehicle Specifications
          </h4>
          <SpecChips vehicle={vehicle} />
        </div>

        {/* Narrative Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            Overview & Suitable Routes
          </h4>
          <p className="text-sm text-ink-2 leading-relaxed">
            {vehicle.description}
          </p>
        </div>

        {/* Features list */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            Included Safari Equipment & Features
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-2">
            {vehicle.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rate brackets table (Highlighting current bracket) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-2 flex items-center gap-1.5">
              <span>Automatic Tiered Rental Rates</span>
              <InfoTooltip
                title="Duration Discounts"
                content="Our system automatically rewards longer safari trips with lower daily rates. All rates include 15% VAT."
              />
            </h4>
            <span className="text-[11px] text-ink-3">Per day rates</span>
          </div>

          <div className="border border-border rounded-lg overflow-hidden divide-y divide-border text-xs">
            {vehicle.brackets.map((b, i) => {
              const isSelectedBracket = currentBracket && currentBracket.from === b.from;
              return (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between p-3 transition-colors',
                    isSelectedBracket
                      ? 'bg-accent-soft font-semibold text-ink border-l-4 border-l-accent'
                      : 'bg-surface text-ink-2 hover:bg-surface-elevated'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {b.to ? `${b.from} – ${b.to} Days Rental` : `${b.from}+ Days (Extended safari)`}
                    </span>
                    {isSelectedBracket && (
                      <span className="text-[10px] bg-accent text-white px-1.5 py-0.5 rounded-xs uppercase">
                        Current Tier
                      </span>
                    )}
                  </div>
                  <span className="font-serif text-sm font-semibold tabular-nums text-primary">
                    {formatCurrency(b.dailyRate)} / day
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security deposit note */}
        <div className="p-4 bg-sand-soft/50 rounded-lg border border-border text-xs text-ink-2 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-ink">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Refundable Security Deposit: {formatCurrency(vehicle.securityDeposit)}</span>
          </div>
          <p className="text-ink-3 leading-relaxed">
            Held as a pre-authorisation hold on credit card at handover in Windhoek. Not charged. Released within 7 days post-inspection.
          </p>
        </div>
      </div>
    </Drawer>
  );
};
