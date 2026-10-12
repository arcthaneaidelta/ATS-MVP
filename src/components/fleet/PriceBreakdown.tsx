import React from 'react';
import type { PriceQuoteBreakdown } from '../../types';
import { formatCurrency } from '../../lib/format';
import { InfoTooltip } from '../ui/Tooltip';
import { ShieldCheck, Tag, Info } from 'lucide-react';

interface PriceBreakdownProps {
  breakdown: PriceQuoteBreakdown;
  coverName?: string;
  showSavings?: boolean;
  isQuoteMode?: boolean;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  breakdown,
  coverName = 'Standard Cover',
  showSavings = true,
  isQuoteMode = false,
}) => {
  const {
    days,
    bracket,
    dailyRate,
    rentalTotal,
    coverTotal,
    totalDueNow,
    refundableSecurityDeposit,
    bookingDeposit,
    savingsTotal,
  } = breakdown;

  const bracketLabel = bracket.to
    ? `${bracket.from}–${bracket.to} days tier`
    : `${bracket.from}+ days tier`;

  return (
    <div className="bg-surface-elevated rounded-lg p-5 border border-border space-y-3.5 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-border/70">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            Pricing Breakdown
          </span>
          <InfoTooltip
            title="Transparent Tiered Pricing"
            content="Our daily rates step down automatically for longer journeys across Namibia (at 3, 8, and 21+ days)."
          />
        </div>
        <span className="text-xs font-medium text-accent bg-accent-soft px-2 py-0.5 rounded-sm">
          {bracketLabel}
        </span>
      </div>

      {/* Line items */}
      <div className="space-y-2 text-xs sm:text-sm text-ink-2">
        <div className="flex justify-between items-center">
          <span className="text-ink">
            Vehicle Rental ({days} {days === 1 ? 'day' : 'days'} × {formatCurrency(dailyRate)})
          </span>
          <span className="font-semibold text-ink tabular-nums">
            {formatCurrency(rentalTotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1.5 text-ink">
            <span>Insurance / Waiver ({coverName})</span>
          </span>
          <span className="font-semibold text-ink tabular-nums">
            {coverTotal === 0 ? 'Included' : formatCurrency(coverTotal)}
          </span>
        </div>

        {showSavings && savingsTotal > 0 && (
          <div className="flex justify-between items-center text-success font-medium text-xs bg-success-soft/60 px-2 py-1 rounded">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Duration discount vs standard rate
            </span>
            <span className="tabular-nums">- {formatCurrency(savingsTotal)}</span>
          </div>
        )}
      </div>

      {/* The 3 Distinct Money Lines per Section 10.2 & Section 8 */}
      <div className="pt-3 border-t border-border space-y-2.5">
        {/* Money line 1: Rental Total / Total due now */}
        <div className="flex justify-between items-baseline bg-surface p-3 rounded-md border border-border shadow-sh-1">
          <div>
            <div className="text-xs font-bold text-ink uppercase tracking-wider">
              {isQuoteMode ? 'Estimated Total' : 'Total Due Now (Charged)'}
            </div>
            <div className="text-[11px] text-ink-3">
              {isQuoteMode ? 'Full rental + selected cover' : 'Immediate secure online card payment'}
            </div>
          </div>
          <div className="text-right">
            <span className="font-serif text-xl sm:text-2xl font-semibold text-primary tabular-nums">
              {formatCurrency(totalDueNow)}
            </span>
          </div>
        </div>

        {/* Money line 2: Booking Deposit (For quotes only) */}
        {isQuoteMode && (
          <div className="flex justify-between items-center text-xs p-2.5 rounded bg-amber-50/70 border border-amber-200/60 text-ink-2">
            <div>
              <div className="font-semibold text-ink flex items-center gap-1">
                <span>Required Booking Deposit</span>
                <InfoTooltip
                  title="Booking Deposit (Quotes)"
                  content="For bespoke quotations, a 20% booking deposit secures the reservation upon quote acceptance. Nothing is charged today."
                />
              </div>
              <div className="text-[11px] text-ink-3">Only payable if you accept our quote</div>
            </div>
            <span className="font-semibold text-ink tabular-nums text-sm">
              {formatCurrency(bookingDeposit)}
            </span>
          </div>
        )}

        {/* Money line 3: Refundable Security Deposit (Card hold, NOT charged) */}
        <div className="flex justify-between items-center text-xs p-2.5 rounded bg-sand-soft/50 border border-border/80 text-ink-2">
          <div>
            <div className="font-semibold text-ink flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Refundable Security Deposit</span>
              <InfoTooltip
                title="Security Deposit (Card Pre-Auth)"
                content="A temporary pre-authorisation hold placed on your credit card upon vehicle collection in Windhoek. It is NEVER charged and is fully released within 7 days of vehicle return."
              />
            </div>
            <div className="text-[11px] text-ink-3">
              Pre-authorisation card hold at pick-up (Not charged now)
            </div>
          </div>
          <span className="font-semibold text-ink tabular-nums text-sm">
            {formatCurrency(refundableSecurityDeposit)}
          </span>
        </div>
      </div>
    </div>
  );
};
