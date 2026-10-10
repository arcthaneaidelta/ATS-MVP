import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  TrendingUp,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { PriceLadder } from '../../components/domain/PriceLadder';
import { Button } from '../../components/ui/Button';
import { PartNumber, Badge, StatusBadge, LatestBadge, FreshnessDot } from '../../components/ui/Badge';
import { formatMoney, formatDate, formatNumber, formatPercent } from '../../lib/format';
import { convertCurrency, FX_RATES } from '../../mock/fx';
import clsx from 'clsx';

export function PricingPage() {
  const { parts, commercialEvents } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected Part
  const queryPart = searchParams.get('part');
  const defaultPart = parts.find((p) => p.id === queryPart) || parts[0];
  const [selectedPartId, setSelectedPartId] = useState<string>(defaultPart?.id || 'STR-000412');
  const [currency, setCurrency] = useState<'USD' | 'PEN' | 'ZMW'>('USD');
  const [showLandedCost, setShowLandedCost] = useState(true);
  const [partSearch, setPartSearch] = useState('');

  const currentPart = parts.find((p) => p.id === selectedPartId) || parts[0];

  // Suggested quick parts (the 6 rich parts)
  const suggestedParts = useMemo(() => {
    return parts.slice(0, 6);
  }, [parts]);

  // Commercial events for the selected part
  const partEvents = useMemo(() => {
    return commercialEvents
      .filter((e) => e.partId === currentPart.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [commercialEvents, currentPart.id]);

  // Best supplier quote & last purchase & latest customer quote
  const supplierQuotes = partEvents.filter((e) => e.type === 'supplier_quote');
  const bestSupplierQuote = supplierQuotes[0] || {
    unitPrice: currentPart.lastSupplierCost,
    reference: 'Q-SUP-2291',
    date: '2026-08-02',
    counterparty: 'Hartmann Drilling Supply',
  };

  const supplierPurchases = partEvents.filter((e) => e.type === 'supplier_purchase');
  const lastPurchase = supplierPurchases[0] || {
    unitPrice: currentPart.lastSupplierCost,
    reference: 'SPO-PE-0391',
    date: '2026-08-08',
  };

  const customerQuotes = partEvents.filter((e) => e.type === 'customer_quote');
  const latestCustomerQuote = customerQuotes[0] || {
    unitPrice: currentPart.lastQuotedPrice,
    reference: currentPart.lastQuotedRef,
    date: currentPart.lastQuotedDate,
  };

  const customerSales = partEvents.filter((e) => e.type === 'customer_sale');
  const latestSellingPrice = customerSales[0] || {
    unitPrice: currentPart.lastQuotedPrice,
    reference: 'INV-PE-0418',
    date: '2026-08-22',
    counterparty: 'Minera Andaluz S.A.C.',
  };

  // Currency conversions
  const oemListConverted = convertCurrency(currentPart.oemListPrice, 'USD', currency);
  const bestSupplierPriceConverted = convertCurrency(bestSupplierQuote.unitPrice, 'USD', currency);
  const lastPurchasePriceConverted = convertCurrency(lastPurchase.unitPrice, 'USD', currency);
  const latestCustomerPriceConverted = convertCurrency(latestCustomerQuote.unitPrice, 'USD', currency);
  const latestSellingPriceConverted = convertCurrency(latestSellingPrice.unitPrice, 'USD', currency);

  // Filtered selector parts
  const filteredSelectorParts = parts.filter(
    (p) =>
      p.id.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(partSearch.toLowerCase()) ||
      p.oemReferences.some((r) => r.number.toLowerCase().includes(partSearch.toLowerCase()))
  );

  // SVG Price Timeline Chart Data Points
  const timelinePoints = useMemo(() => {
    // Generate chronological timeline points from quotes
    const points = [
      { date: 'Nov 2025', quotePrice: 128, supplierPrice: 84, ref: 'QT-PE-0150' },
      { date: 'Feb 2026', quotePrice: 134, supplierPrice: 86, ref: 'QT-PE-0174' },
      { date: 'May 2026', quotePrice: 142, supplierPrice: 91, ref: 'QT-ZM-0082' },
      { date: 'Aug 2026', quotePrice: 136, supplierPrice: 88.5, ref: 'QT-PE-0211' },
      { date: 'Sep 2026', quotePrice: 138, supplierPrice: 89, ref: 'QT-PE-0231' },
    ];
    return points.map((p) => ({
      ...p,
      quotePriceConverted: convertCurrency(p.quotePrice, 'USD', currency),
      supplierPriceConverted: convertCurrency(p.supplierPrice, 'USD', currency),
      landedPriceConverted: convertCurrency(p.supplierPrice * 1.148, 'USD', currency),
    }));
  }, [currency]);

  // Chart coordinates
  const svgWidth = 640;
  const svgHeight = 200;
  const paddingX = 48;
  const paddingY = 28;
  const maxPriceTimeline = Math.max(...timelinePoints.map((p) => p.quotePriceConverted)) * 1.15 || 100;
  const minPriceTimeline = Math.min(...timelinePoints.map((p) => p.supplierPriceConverted)) * 0.85 || 50;
  const rangeY = maxPriceTimeline - minPriceTimeline || 1;

  const getSvgY = (val: number) => {
    return svgHeight - paddingY - ((val - minPriceTimeline) / rangeY) * (svgHeight - paddingY * 2);
  };
  const getSvgX = (index: number) => {
    return paddingX + (index / (timelinePoints.length - 1)) * (svgWidth - paddingX * 2);
  };

  const quotePath = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i)} ${getSvgY(p.quotePriceConverted)}`)
    .join(' ');
  const supplierPath = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i)} ${getSvgY(p.supplierPriceConverted)}`)
    .join(' ');
  const landedPath = timelinePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getSvgX(i)} ${getSvgY(p.landedPriceConverted)}`)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900 flex items-center gap-2">
            <span>Pricing Intelligence & Memory</span>
            <span className="text-xs font-mono font-normal bg-accent-tint text-accent border border-accent/30 px-2 py-0.5 rounded-xs">
              Auto-Identifies Latest Quote
            </span>
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Historical pricing preserved with full reference traceability, landed-cost modeling and multi-currency conversion.
          </p>
        </div>

        {/* Currency Switcher & FX Caption */}
        <div className="flex flex-col sm:items-end gap-1">
          <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-sm">
            {(['USD', 'PEN', 'ZMW'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={clsx(
                  'px-3 py-1 text-xs font-mono font-semibold rounded-xs transition-colors',
                  currency === c
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-500 hover:text-ink-900'
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-ink-500 font-mono">
            {currency === 'USD'
              ? 'Base currency USD'
              : currency === 'PEN'
              ? `FX Rate: 1 USD = ${FX_RATES.USD_TO_PEN} PEN (Demo)`
              : `FX Rate: 1 USD = ${FX_RATES.USD_TO_ZMW} ZMW (Demo)`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Part Picker & Suggested Parts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-surface border border-border rounded-md space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-700 block">
              Select Canonical Part
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-ink-500" />
              <input
                type="text"
                value={partSearch}
                onChange={(e) => setPartSearch(e.target.value)}
                placeholder="Search part ID or OEM number..."
                className="w-full bg-surface-elevated text-xs font-mono pl-8 pr-3 py-1.5 border border-border rounded-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pt-1">
              {filteredSelectorParts.map((p) => {
                const isSelected = p.id === currentPart.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedPartId(p.id);
                      setSearchParams({ part: p.id });
                    }}
                    className={clsx(
                      'w-full text-left p-2.5 rounded-sm border transition-colors flex flex-col gap-0.5 text-xs',
                      isSelected
                        ? 'bg-primary-tint/70 border-primary shadow-xs'
                        : 'bg-surface-elevated hover:bg-surface-sunken border-border'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-ink-900">{p.id}</span>
                      <span className="text-[10.5px] font-mono text-ink-700 font-semibold">
                        {formatMoney(convertCurrency(p.lastQuotedPrice, 'USD', currency), currency)}
                      </span>
                    </div>
                    <span className="text-ink-700 truncate">{p.description}</span>
                    <span className="text-[10px] text-ink-500 font-mono truncate">
                      {p.oemReferences.map((r) => r.number).join(' · ')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-3.5 bg-surface-sunken/60 border border-border rounded-md text-xs space-y-2">
            <span className="text-[11px] font-semibold text-ink-700 uppercase tracking-wider block">
              Suggested High-Volume Parts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedParts.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => {
                    setSelectedPartId(sp.id);
                    setSearchParams({ part: sp.id });
                  }}
                  className={clsx(
                    'px-2 py-1 rounded-xs border text-[11px] font-mono transition-colors',
                    sp.id === currentPart.id
                      ? 'bg-primary text-white border-primary font-bold'
                      : 'bg-surface border-border text-ink-700 hover:border-ink-500'
                  )}
                >
                  {sp.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Area: Ladder, Chart & History Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero of the page: Price Ladder Component */}
          <PriceLadder
            partId={currentPart.id}
            currency={currency}
            oemListPrice={oemListConverted}
            bestSupplierQuote={{
              price: bestSupplierPriceConverted,
              ref: bestSupplierQuote.reference,
              date: formatDate(bestSupplierQuote.date),
              supplier: bestSupplierQuote.counterparty,
            }}
            lastPurchaseCost={{
              price: lastPurchasePriceConverted,
              ref: lastPurchase.reference,
              date: formatDate(lastPurchase.date),
            }}
            latestCustomerQuote={{
              price: latestCustomerPriceConverted,
              ref: latestCustomerQuote.reference,
              date: formatDate(latestCustomerQuote.date),
            }}
            latestSellingPrice={{
              price: latestSellingPriceConverted,
              ref: latestSellingPrice.reference,
              date: formatDate(latestSellingPrice.date),
              customer: latestSellingPrice.counterparty,
            }}
          />

          {/* Price Timeline Chart */}
          <div className="p-5 bg-surface border border-border rounded-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
                  Price History Trendline (2025 – 2026)
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Customer quote price vs. supplier purchase cost vs. landed benchmark.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-ink-700">
                  <input
                    type="checkbox"
                    checked={showLandedCost}
                    onChange={(e) => setShowLandedCost(e.target.checked)}
                    className="rounded-xs text-primary focus:ring-primary"
                  />
                  <span>Show Landed Cost</span>
                </label>
              </div>
            </div>

            {/* Hand-rolled SVG Line Chart */}
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 select-none">
                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
                  const y = paddingY + pct * (svgHeight - paddingY * 2);
                  const priceVal = maxPriceTimeline - pct * rangeY;
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#E2DDD3"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#7B857F"
                        fontFamily="monospace"
                      >
                        {formatMoney(priceVal, currency)}
                      </text>
                    </g>
                  );
                })}

                {/* Landed Cost Line (Dashed Green-Slate) */}
                {showLandedCost && (
                  <path
                    d={landedPath}
                    fill="none"
                    stroke="#2E4A42"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                )}

                {/* Supplier Cost Line (Slate Grey) */}
                <path d={supplierPath} fill="none" stroke="#5B6B76" strokeWidth="2" />

                {/* Customer Quote Line (Oxidized Copper Accent) */}
                <path d={quotePath} fill="none" stroke="#B4713B" strokeWidth="2.5" />

                {/* Data Points */}
                {timelinePoints.map((p, idx) => {
                  const x = getSvgX(idx);
                  const yQuote = getSvgY(p.quotePriceConverted);
                  const ySupplier = getSvgY(p.supplierPriceConverted);

                  return (
                    <g key={idx}>
                      {/* X axis labels */}
                      <text
                        x={x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#47524D"
                        fontFamily="monospace"
                      >
                        {p.date}
                      </text>

                      {/* Supplier Dot */}
                      <circle cx={x} cy={ySupplier} r="3.5" fill="#5B6B76" />

                      {/* Quote Dot */}
                      <circle
                        cx={x}
                        cy={yQuote}
                        r="4.5"
                        fill="#B4713B"
                        stroke="#FBFAF7"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-2 border-t border-border text-xs text-ink-700">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-accent inline-block rounded-full" />
                <span>Customer Quote Price</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-secondary inline-block rounded-full" />
                <span>Supplier Origin Cost</span>
              </span>
              {showLandedCost && (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary border-b border-primary border-dashed inline-block" />
                  <span>Calculated Landed Cost (+14.8%)</span>
                </span>
              )}
            </div>
          </div>

          {/* Quotation History Table with "Latest" Badge */}
          <div className="p-5 bg-surface border border-border rounded-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
                  Quotations & Transaction Log
                </h3>
                <p className="text-xs text-ink-500 mt-0.5">
                  Every quote preserved chronologically. The newest row is automatically flagged.
                </p>
              </div>
              <span className="text-xs font-mono text-ink-500">{partEvents.length} transactions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-700 font-semibold bg-surface-sunken">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Counterparty</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Qty</th>
                    <th className="py-2.5 px-3 text-right">Unit Price</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {partEvents.map((ev, idx) => {
                    const isLatest = idx === 0 && ev.type === 'customer_quote';
                    return (
                      <tr
                        key={ev.id}
                        className={clsx(
                          'hover:bg-primary-tint/20 transition-colors',
                          isLatest && 'bg-accent-tint/30'
                        )}
                      >
                        <td className="py-2.5 px-3 text-ink-500 font-mono whitespace-nowrap">
                          {formatDate(ev.date)}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-ink-900">
                          <div className="flex items-center gap-1.5">
                            <span>{ev.reference}</span>
                            {isLatest && <LatestBadge date={formatDate(ev.date)} reference={ev.reference} />}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-ink-900 font-medium">{ev.counterparty}</td>
                        <td className="py-2.5 px-3 text-ink-700">
                          {ev.type.replace('_', ' ')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-ink-700">{ev.qty}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-900">
                          {formatMoney(
                            convertCurrency(ev.unitPrice, ev.currency, currency),
                            currency,
                            true
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <StatusBadge status={ev.status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
