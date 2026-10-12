import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDemoStore } from '../store/useDemoStore';
import { DateRangePicker } from '../components/ui/DateRangePicker';
import { VehicleCard } from '../components/fleet/VehicleCard';
import { VehicleDrawer } from '../components/fleet/VehicleDrawer';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../lib/format';
import { quotePrice } from '../lib/pricing';
import { isAvailable } from '../lib/availability';
import { 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  CreditCard, 
  Clock, 
  MapPin, 
  Sparkles,
  Sliders,
  Calendar,
  Compass,
  FileText
} from 'lucide-react';
import type { Vehicle } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, searchContext, setSearchContext, bookings, blocks } = useDemoStore();

  const [selectedVehicleForDrawer, setSelectedVehicleForDrawer] = useState<Vehicle | null>(null);

  // Search Bar State
  const [fromDate, setFromDate] = useState(searchContext.from);
  const [toDate, setToDate] = useState(searchContext.to);
  const [vehicleType, setVehicleType] = useState(searchContext.type || 'all');

  // Pricing Teaser State (Wow Moment #2)
  const [teaserVehicleId, setTeaserVehicleId] = useState('hilux-dc');
  const [teaserDays, setTeaserDays] = useState(10);

  const teaserVehicle = vehicles.find((v) => v.id === teaserVehicleId) || vehicles[0];
  const teaserBreakdown = quotePrice(
    teaserVehicle,
    null,
    '2026-11-01',
    new Date(new Date('2026-11-01').getTime() + teaserDays * 86400000)
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchContext({ from: fromDate, to: toDate, type: vehicleType });
    navigate(`/fleet?from=${fromDate}&to=${toDate}&type=${vehicleType}`);
  };

  // Featured vehicles (first 3)
  const featuredVehicles = vehicles.filter((v) => v.featured || ['hilux-dc', 'fortuner', 'corolla-cross'].includes(v.id)).slice(0, 3);

  // Calculate live ticker count for the upcoming weekend
  const availableThisWeekendCount = vehicles.filter((v) =>
    isAvailable(v.id, searchContext.from || '2026-11-06', searchContext.to || '2026-11-09', bookings, blocks)
  ).length;

  return (
    <div className="w-full">
      {/* 7.1 HERO SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between text-white overflow-hidden bg-[#1D2522]">
        {/* Ambient Visual Background with Desert Atmosphere */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=85"
            alt="Toyota 4x4 driving along gravel road in the Namib Desert"
            className="w-full h-full object-cover object-center filter saturate-[0.92] motion-safe:animate-slowzoom"
            fetchPriority="high"
          />
          {/* Gradient Scrim per §7.1 */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141A17]/85 via-[#141A17]/55 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141A17]/90 via-transparent to-[#141A17]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-content mx-auto w-full px-4 sm:px-8 pt-36 sm:pt-44 pb-16 flex-1 flex flex-col justify-center text-left">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sand text-[11px] font-semibold uppercase tracking-[0.2em]">
              <Compass className="w-3.5 h-3.5 text-accent" />
              <span>Self-Drive Rentals · Namibia</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.04] tracking-tight text-white">
              The road is the destination.
            </h1>

            <p className="text-base sm:text-xl text-white/85 font-normal leading-relaxed max-w-xl">
              Reliable, well-maintained 4x4s and city cars, priced clearly by the day, ready when you land in Windhoek.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="accent"
                size="lg"
                onClick={() => {
                  const el = document.getElementById('search-dates-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Check Availability
              </Button>

              <Link
                to="/quote"
                className="text-sm font-semibold text-sand hover:text-white transition-colors flex items-center gap-1.5 py-2 px-1"
              >
                <span>Request a quotation</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Ticker Chip at Hero Bottom-Right per §7.1 */}
        <div className="relative z-10 max-w-content mx-auto w-full px-4 sm:px-8 pb-12 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-xs text-sand/70">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>Windhoek Hosea Kutako Airport handovers available 24/7</span>
          </div>

          <div className="ml-auto inline-flex items-center gap-2 bg-[#1A2420]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-sand">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span>{vehicles.length} fleet vehicles · {availableThisWeekendCount} available for selected dates</span>
          </div>
        </div>
      </section>

      {/* 7.1 SEARCH BAR (The Interactive Centrepiece, Anchored & Overlapping) */}
      <section id="search-dates-anchor" className="relative z-20 max-w-content mx-auto px-4 sm:px-8 -mt-8 sm:-mt-12">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-surface rounded-xl p-4 sm:p-5 shadow-sh-2 border border-border flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4 text-left"
        >
          {/* Date Picker Range */}
          <div className="flex-1 min-w-[260px]">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-1">
              Pick-up & Return Dates
            </label>
            <DateRangePicker
              startDate={fromDate}
              endDate={toDate}
              onChange={(s, e) => {
                setFromDate(s);
                setToDate(e);
              }}
            />
          </div>

          {/* Vehicle Type Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-1">
              Vehicle Category
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full bg-white text-ink border border-border-strong rounded-md px-3 py-2.5 text-xs sm:text-sm font-medium focus:border-primary focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="4x4">4x4 Expeditions</option>
              <option value="suv">SUV 4x4</option>
              <option value="compact">Compact & City</option>
              <option value="van">9-Seater Van</option>
            </select>
          </div>

          {/* Submit Search Button */}
          <div className="lg:self-end pt-1 sm:pt-0">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full lg:w-auto px-7"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Search Vehicles
            </Button>
          </div>
        </form>
      </section>

      {/* 7.2 SECTION 1: BRIEF INTRODUCTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-content mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
              Namibia Without Surprises
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-ink">
              A smaller fleet, looked after properly.
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <p className="text-base sm:text-lg text-ink-2 font-normal leading-relaxed">
              We specialise in robust, safari-proven vehicles equipped for the gravel roads of Etosha, the dunes of Sossusvlei, and the vast spaces in between. Every rental is serviced thoroughly before you collect it.
            </p>

            {/* Three quiet stats per §7.2 */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-border">
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-primary">14</div>
                <div className="text-xs text-ink-3 mt-1 leading-snug">Years on Namibian roads</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-primary">100%</div>
                <div className="text-xs text-ink-3 mt-1 leading-snug">Pre-rental mechanical inspection</div>
              </div>
              <div>
                <div className="font-serif text-2xl sm:text-3xl font-semibold text-primary">24/7</div>
                <div className="text-xs text-ink-3 mt-1 leading-snug">Countrywide breakdown backup</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.2 SECTION 2: FEATURED VEHICLES */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-surface-elevated border-y border-border text-left">
        <div className="max-w-content mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent block mb-1">
                Featured Models
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink">
                Popular Self-Drive Choices
              </h2>
            </div>
            <Link to="/fleet">
              <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                View All {vehicles.length} Vehicles
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                featured
                onOpenDetail={(v) => setSelectedVehicleForDrawer(v)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7.2 SECTION 3: HOW BOOKING WORKS (The 2 Booking Paths side-by-side) */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-content mx-auto text-left space-y-12">
        <div className="max-w-xl space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent block">
            Clear & Simple Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink">
            Two ways to arrange your vehicle
          </h2>
          <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
            Choose instant online reservation if your dates are fixed, or request a quotation if you need extra gear or custom advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Instant Online Booking */}
          <div className="bg-surface rounded-xl p-8 border border-border shadow-sh-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-primary text-white flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink">
                Option A — Book Instantly Online
              </h3>
              <p className="text-sm text-ink-2 leading-relaxed">
                Choose your dates, pick your damage waiver, and pay in full via secure simulated DPO gateway. Your vehicle is immediately locked in.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-ink-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Real-time availability verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>10-minute hold while entering driver details</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Immediate confirmation reference issued</span>
                </li>
              </ul>
            </div>

            <Link to="/fleet">
              <Button variant="primary" size="lg" className="w-full">
                Browse & Book Online
              </Button>
            </Link>
          </div>

          {/* Card B: Tailored Quotation */}
          <div className="bg-surface-elevated rounded-xl p-8 border border-border shadow-sh-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-sand-soft text-accent border border-border flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-ink">
                Option B — Request a Quotation
              </h3>
              <p className="text-sm text-ink-2 leading-relaxed">
                Tell us about your route and camping needs. We review availability and email a tailored proposal. Nothing is reserved until accepted.
              </p>

              <ul className="space-y-2.5 pt-2 text-xs text-ink-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>No payment required to enquire</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>Custom equipment bundles (rooftop tents, fridges)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-accent shrink-0" />
                  <span>20% booking deposit only when you accept</span>
                </li>
              </ul>
            </div>

            <Link to="/quote">
              <Button variant="secondary" size="lg" className="w-full">
                Request a Custom Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7.2 SECTION 4: TRANSPARENT PRICING TEASER (WOW MOMENT #2) */}
      <section className="py-20 sm:py-24 px-4 sm:px-8 bg-sand-soft/50 border-y border-border text-left">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
                Automatic Duration Discount
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-ink">
                Longer trips cost less per day.
              </h2>
              <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
                No coupon codes or manual bargaining needed. As your Namibian journey extends across 3, 8, and 21+ days, our pricing tiers step down automatically.
              </p>
            </div>

            {/* Interactive Slider Teaser Box */}
            <div className="lg:col-span-7 bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-2 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-2">
                  Interactive Rate Simulator
                </span>
                <select
                  value={teaserVehicleId}
                  onChange={(e) => setTeaserVehicleId(e.target.value)}
                  className="bg-surface text-xs font-medium border border-border-strong rounded px-2.5 py-1.5 focus:outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slider Component */}
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-ink-3">Drag duration:</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-accent bg-accent-soft px-2.5 py-0.5 rounded">
                    {teaserDays} {teaserDays === 1 ? 'Day' : 'Days Rental'}
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={30}
                  value={teaserDays}
                  onChange={(e) => setTeaserDays(Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-sand rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-ink-3 font-mono">
                  <span>1-2 days</span>
                  <span>3-7 days</span>
                  <span>8-20 days</span>
                  <span>21+ days</span>
                </div>
              </div>

              {/* Rate Result */}
              <div className="p-4 bg-surface-elevated rounded-lg border border-border space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-2">Applied Rate Tier:</span>
                  <span className="font-semibold text-accent">
                    {teaserBreakdown.bracket.to
                      ? `${teaserBreakdown.bracket.from}–${teaserBreakdown.bracket.to} days bracket`
                      : `${teaserBreakdown.bracket.from}+ days extended bracket`}
                  </span>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-ink-3">Daily Rate:</span>
                  <span className="font-serif text-2xl font-semibold text-primary tabular-nums">
                    {formatCurrency(teaserBreakdown.dailyRate)} / day
                  </span>
                </div>

                {teaserBreakdown.savingsTotal > 0 && (
                  <div className="flex justify-between items-center text-xs text-success font-medium bg-success-soft/70 px-3 py-1.5 rounded">
                    <span>You save vs standard 1-2 day rate:</span>
                    <span className="tabular-nums font-bold">
                      {formatCurrency(teaserBreakdown.savingsTotal)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7.2 SECTION 5: TRUST STRIP */}
      <section className="py-16 px-4 sm:px-8 max-w-content mx-auto text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-md bg-sand-soft flex items-center justify-center shrink-0 text-primary">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-normal text-ink">
                Secure Payments via DPO
              </h4>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                Card payments processed securely through DPO Group. We never hold sensitive cardholder data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-md bg-sand-soft flex items-center justify-center shrink-0 text-primary">
              <Compass className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-normal text-ink">
                Three Transparent Cover Options
              </h4>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                Choose between Standard, Reduced excess, or full Zero Excess protection for total peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-md bg-sand-soft flex items-center justify-center shrink-0 text-primary">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-normal text-ink">
                Separate Security Deposit Hold
              </h4>
              <p className="text-xs text-ink-2 mt-1 leading-relaxed">
                Refundable pre-authorisation hold taken on card at handover. Released promptly within 7 days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Drawer for Quick Specs */}
      <VehicleDrawer
        vehicle={selectedVehicleForDrawer}
        isOpen={Boolean(selectedVehicleForDrawer)}
        onClose={() => setSelectedVehicleForDrawer(null)}
      />
    </div>
  );
};
