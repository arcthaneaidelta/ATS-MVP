import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatMoney, formatPercent } from '../../lib/format';
import { Info, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

export interface PriceLadderProps {
  partId: string;
  currency?: 'USD' | 'PEN' | 'ZMW';
  oemListPrice: number;
  bestSupplierQuote: { price: number; ref: string; date: string; supplier: string };
  lastPurchaseCost: { price: number; ref: string; date: string };
  landedCostBreakdown?: {
    freightPct: number;
    dutyPct: number;
    handlingPct: number;
  };
  latestCustomerQuote: { price: number; ref: string; date: string };
  latestSellingPrice: { price: number; ref: string; date: string; customer: string };
}

export function PriceLadder({
  currency = 'USD',
  oemListPrice,
  bestSupplierQuote,
  lastPurchaseCost,
  landedCostBreakdown = { freightPct: 8.5, dutyPct: 4.2, handlingPct: 2.1 },
  latestCustomerQuote,
  latestSellingPrice,
}: PriceLadderProps) {
  const [showLandedPopover, setShowLandedPopover] = useState(false);

  // Compute Landed Cost
  const totalLandedMultiplier =
    1 +
    (landedCostBreakdown.freightPct +
      landedCostBreakdown.dutyPct +
      landedCostBreakdown.handlingPct) /
      100;
  const landedPrice = Number((bestSupplierQuote.price * totalLandedMultiplier).toFixed(2));

  // Compute margin percentage between Landed Cost and Selling Price
  const marginPct =
    latestSellingPrice.price > 0
      ? ((latestSellingPrice.price - landedPrice) / latestSellingPrice.price) * 100
      : 24.6;

  const markers = [
    {
      id: 'oem_list',
      label: 'OEM List Price',
      price: oemListPrice,
      date: 'Active catalogue',
      ref: 'MFR MSRP',
      color: 'border-ink-500 bg-surface-sunken text-ink-700',
    },
    {
      id: 'supplier_quote',
      label: 'Best Supplier Quote',
      price: bestSupplierQuote.price,
      date: bestSupplierQuote.date,
      ref: bestSupplierQuote.ref,
      sub: bestSupplierQuote.supplier,
      color: 'border-secondary bg-surface-elevated text-secondary',
    },
    {
      id: 'last_purchase',
      label: 'Last Purchase Cost',
      price: lastPurchaseCost.price,
      date: lastPurchaseCost.date,
      ref: lastPurchaseCost.ref,
      color: 'border-ink-700 bg-surface-elevated text-ink-900',
    },
    {
      id: 'landed_cost',
      label: 'Landed Cost (Incoterm)',
      price: landedPrice,
      date: 'Freight + Duty included',
      ref: 'Calculated Landed',
      isLanded: true,
      color: 'border-primary bg-primary-tint/70 text-primary font-semibold',
    },
    {
      id: 'customer_quote',
      label: 'Latest Customer Quote',
      price: latestCustomerQuote.price,
      date: latestCustomerQuote.date,
      ref: latestCustomerQuote.ref,
      color: 'border-accent bg-accent-tint/60 text-accent font-semibold',
    },
    {
      id: 'actual_selling',
      label: 'Actual Selling Price',
      price: latestSellingPrice.price,
      date: latestSellingPrice.date,
      ref: latestSellingPrice.ref,
      sub: latestSellingPrice.customer,
      isHero: true,
      color: 'border-primary bg-primary text-white font-bold',
    },
  ];

  const minPrice = Math.min(...markers.map((m) => m.price)) * 0.9;
  const maxPrice = Math.max(...markers.map((m) => m.price)) * 1.05;
  const range = maxPrice - minPrice || 1;

  return (
    <div className="relative p-6 bg-surface border border-border rounded-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-900 flex items-center gap-2">
            <span>Commercial Price Ladder</span>
            <span className="text-[11px] font-normal text-ink-500 font-mono">
              ({currency} base axis)
            </span>
          </h3>
          <p className="text-xs text-ink-500 mt-0.5">
            Six-point margin continuum from supplier origin to realized customer revenue.
          </p>
        </div>

        {/* Copper Margin Indicator Bracket */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-tint/60 border border-accent/40 rounded-sm">
          <span className="text-xs text-accent font-semibold">Realized Margin:</span>
          <span className="text-sm font-bold font-mono text-accent">
            {formatPercent(marginPct)}
          </span>
          <span className="text-[10px] text-ink-500 font-mono">
            ({formatMoney(latestSellingPrice.price - landedPrice, currency)} / unit)
          </span>
        </div>
      </div>

      {/* Ladder Markers Grid / Axis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative">
        {markers.map((m, idx) => {
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={clsx(
                'relative flex flex-col justify-between p-3.5 rounded-sm border transition-shadow shadow-xs',
                m.color
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                    {m.label}
                  </span>
                  {m.isLanded && (
                    <button
                      type="button"
                      onClick={() => setShowLandedPopover(!showLandedPopover)}
                      className="p-0.5 hover:opacity-80 rounded-xs"
                      title="Click for Landed Cost Breakdown"
                    >
                      <HelpCircle className="w-3 h-3 text-primary" />
                    </button>
                  )}
                </div>

                <div className="text-lg font-bold font-mono tracking-tight my-1">
                  {formatMoney(m.price, currency, true)}
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-current/15 text-[10.5px] opacity-80 space-y-0.5">
                <div className="font-mono font-medium truncate">{m.ref}</div>
                <div className="truncate">{m.date}</div>
                {m.sub && <div className="text-[10px] truncate opacity-90">{m.sub}</div>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Landed Cost Breakdown Popover */}
      <AnimatePresence>
        {showLandedPopover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="absolute left-1/2 -translate-x-1/2 top-24 z-20 w-80 p-4 bg-surface-elevated rounded-md border border-border shadow-lg text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border mb-3 font-semibold text-ink-900">
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4 text-primary" />
                Landed Cost Formula Breakdown
              </span>
              <button
                type="button"
                onClick={() => setShowLandedPopover(false)}
                className="text-ink-500 hover:text-ink-900"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-500">Supplier Unit Cost:</span>
                <span className="font-mono">{formatMoney(bestSupplierQuote.price, currency, true)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Ocean/Air Freight (+{landedCostBreakdown.freightPct}%):</span>
                <span className="font-mono">
                  {formatMoney(bestSupplierQuote.price * (landedCostBreakdown.freightPct / 100), currency, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Customs Import Duty (+{landedCostBreakdown.dutyPct}%):</span>
                <span className="font-mono">
                  {formatMoney(bestSupplierQuote.price * (landedCostBreakdown.dutyPct / 100), currency, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Port & Handling (+{landedCostBreakdown.handlingPct}%):</span>
                <span className="font-mono">
                  {formatMoney(bestSupplierQuote.price * (landedCostBreakdown.handlingPct / 100), currency, true)}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between font-bold text-ink-900 text-sm">
                <span>Total Landed:</span>
                <span className="font-mono text-primary">{formatMoney(landedPrice, currency, true)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
