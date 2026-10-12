import React from 'react';
import type { InsurancePackage } from '../../types';
import { formatCurrency } from '../../lib/format';
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface CoverCardProps {
  pkg: InsurancePackage;
  isSelected: boolean;
  onSelect: () => void;
  days: number;
}

export const CoverCard: React.FC<CoverCardProps> = ({
  pkg,
  isSelected,
  onSelect,
  days,
}) => {
  const totalCost = pkg.dailyPrice * days;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative bg-surface rounded-lg p-5 border text-left cursor-pointer transition-all duration-200 select-none flex flex-col justify-between',
        isSelected
          ? 'border-primary ring-2 ring-primary/10 bg-accent-soft/30 shadow-sh-2 -translate-y-0.5'
          : 'border-border hover:border-border-strong hover:bg-surface-elevated'
      )}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0',
                isSelected ? 'bg-primary border-primary text-white' : 'border-border-strong bg-white'
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
            </div>
            <h4 className="font-serif text-lg font-normal text-ink">{pkg.name}</h4>
          </div>

          {pkg.popular && (
            <span className="text-[10px] uppercase font-bold tracking-wider bg-accent text-white px-2 py-0.5 rounded-xs">
              Recommended
            </span>
          )}
        </div>

        {/* Excess liability amount */}
        <div className="mb-3 pl-7">
          <div className="text-xs text-ink-3">Customer Excess Liability:</div>
          <div className="font-serif text-xl font-semibold text-primary tabular-nums">
            {pkg.excess === 0 ? 'Zero Excess (N$0)' : formatCurrency(pkg.excess)}
          </div>
          <div className="text-[11px] text-ink-2 mt-0.5">{pkg.description}</div>
        </div>

        {/* Pricing details */}
        <div className="pl-7 pb-3 mb-3 border-b border-border/60 flex items-baseline gap-2">
          <span className="font-semibold text-sm text-ink tabular-nums">
            {formatCurrency(pkg.dailyPrice)}
          </span>
          <span className="text-xs text-ink-3">/ day</span>
          <span className="text-xs text-ink-2 ml-auto tabular-nums font-medium">
            Total: {formatCurrency(totalCost)} ({days}d)
          </span>
        </div>

        {/* Inclusions list */}
        <div className="pl-7 space-y-1.5 text-xs text-ink-2">
          <div className="font-semibold text-[11px] uppercase tracking-wider text-ink-3 mb-1">
            What is covered
          </div>
          {pkg.inclusions.map((inc, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
              <span>{inc}</span>
            </div>
          ))}

          {pkg.exclusions.length > 0 && (
            <div className="pt-2">
              <div className="font-semibold text-[11px] uppercase tracking-wider text-ink-3 mb-1">
                Exclusions
              </div>
              {pkg.exclusions.map((exc, i) => (
                <div key={i} className="flex items-start gap-2 text-ink-3">
                  <X className="w-3.5 h-3.5 text-ink-3 shrink-0 mt-0.5" />
                  <span>{exc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pl-7 pt-4 mt-3 border-t border-border/40 text-[11px]">
        <Link
          to="/terms#insurance"
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="text-accent hover:underline inline-flex items-center gap-1"
        >
          View detailed insurance policy & terms →
        </Link>
      </div>
    </div>
  );
};
