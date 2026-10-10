import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSpreadsheet,
  TrendingUp,
  Percent,
  AlertCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatMoney, formatPercent, getRelativeTime } from '../../lib/format';
import { ENTITIES } from '../../config/brand';
import clsx from 'clsx';

export function DashboardPage() {
  const {
    currentEntity,
    attentionItems,
    markAttentionDone,
    clearedAttentionCount,
    quotations,
    invoices,
    notifications,
  } = useStore();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<'30d' | 'quarter' | 'year'>('30d');
  const entity = ENTITIES[currentEntity] || ENTITIES['peru'];

  // Attention items filtered
  const activeAttentionItems = attentionItems.filter((i) => !i.done);

  // OEM Margin data for right 4 cols
  const oemMarginData = [
    { oem: 'Sandvik', margin: 28.4, partsCount: 1420 },
    { oem: 'Epiroc', margin: 26.2, partsCount: 1890 },
    { oem: 'RESEMIN', margin: 25.1, partsCount: 940 },
    { oem: 'Caterpillar', margin: 22.8, partsCount: 880 },
    { oem: 'Komatsu', margin: 21.5, partsCount: 680 },
  ];

  // Pipeline stages
  const pipelineStages = [
    { label: 'Draft', count: 4, value: 48200, color: 'bg-ink-300' },
    { label: 'Sent', count: 9, value: 142000, color: 'bg-secondary' },
    { label: 'Negotiating', count: 8, value: 114000, color: 'bg-accent' },
    { label: 'Won', count: 6, value: 114000, color: 'bg-primary' },
  ];
  const totalPipelineVal = pipelineStages.reduce((acc, s) => acc + s.value, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Good morning, Valeria
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Commercial cockpit · Operating territory:{' '}
            <strong className="text-ink-900 font-semibold">{entity.name}</strong> ({entity.baseCurrency})
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-sm text-xs">
          {(
            [
              { id: '30d', label: 'Last 30 days' },
              { id: 'quarter', label: 'This Quarter' },
              { id: 'year', label: 'Year to Date' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDateRange(item.id)}
              className={clsx(
                'px-3 py-1 rounded-xs transition-colors font-medium',
                dateRange === item.id
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'text-ink-500 hover:text-ink-900'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: KPI Cards (4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Open Quotations */}
        <div
          onClick={() => navigate('/app/rfq')}
          className="p-4 bg-surface border border-border rounded-md hover:border-ink-500 transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
            <span>Open Quotations</span>
            <span className="text-success font-mono font-semibold">+12.4% vs last mo</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-ink-900">27</span>
            <span className="text-xs font-mono font-medium text-ink-700">
              USD 418,200
            </span>
          </div>
        </div>

        {/* Card 2: Win Rate (30d) with Sparkline */}
        <div className="p-4 bg-surface border border-border rounded-md shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
            <span>Win Rate (30d)</span>
            <span className="text-primary font-mono font-semibold">Tgt: 35%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-ink-900">38%</span>
            {/* Hand-rolled Mini Sparkline SVG */}
            <svg className="w-20 h-7" viewBox="0 0 80 28">
              <path
                d="M 2 24 L 18 20 L 34 22 L 50 14 L 66 16 L 78 4"
                fill="none"
                stroke="#2E4A42"
                strokeWidth="2"
              />
              <circle cx="78" cy="4" r="2.5" fill="#2E4A42" />
            </svg>
          </div>
        </div>

        {/* Card 3: Average Margin on Quotes */}
        <div className="p-4 bg-surface border border-border rounded-md shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
            <span>Average Margin on Quotes</span>
            <span className="text-accent font-mono font-semibold">+2.6% vs target</span>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-bold font-mono text-accent">24.6%</span>
              <span className="text-[10.5px] font-mono text-ink-500">Target 22.0%</span>
            </div>
            {/* Target comparison bar */}
            <div className="h-1.5 w-full bg-surface-sunken rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        {/* Card 4: Overdue Receivables (Click filters Finance) */}
        <div
          onClick={() => navigate('/app/finance')}
          className="p-4 bg-error-tint/40 border border-error/30 rounded-md hover:bg-error-tint/60 transition-colors cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-error mb-2">
            <span className="font-semibold">Overdue Receivables</span>
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-error">
              USD 63,480
            </span>
            <span className="text-[10px] font-mono text-error underline">View filtered</span>
          </div>
        </div>
      </div>

      {/* Row 2: Action Center "Needs your attention" (8 cols) & Margin by OEM (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Needs Your Attention List (Most prominent block - PRD Spec 12.1) */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-md p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900">
                Needs Your Attention
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-500">
              <span>{activeAttentionItems.length} active exceptions</span>
              {clearedAttentionCount > 0 && (
                <span className="text-success bg-success-tint px-2 py-0.5 rounded-xs">
                  {clearedAttentionCount} cleared today
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {activeAttentionItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 bg-surface-elevated border border-border rounded-sm hover:border-ink-500 transition-colors flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    <div>
                      <p className="font-medium text-ink-900">{item.title}</p>
                      <span className="text-[10.5px] text-ink-500 font-mono">
                        Territory: {item.entityId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(item.actionRoute)}
                      rightIcon={<ArrowRight className="w-3 h-3" />}
                    >
                      {item.actionText}
                    </Button>
                    <button
                      type="button"
                      onClick={() => markAttentionDone(item.id)}
                      className="p-1.5 text-ink-500 hover:text-success rounded-xs hover:bg-surface-sunken"
                      title="Mark as resolved"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {activeAttentionItems.length === 0 && (
              <div className="p-8 text-center text-xs text-ink-500 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="font-semibold text-ink-900">All attention queue items resolved!</p>
                <p>No critical quotation or overdue exceptions pending review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Margin by OEM Bar Chart (Right 4 cols) */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-md p-5 space-y-4 shadow-xs">
          <div className="pb-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
              Realized Margin by OEM
            </h3>
            <p className="text-[11px] text-ink-500 mt-0.5">Average margin across last 100 sales</p>
          </div>

          <div className="space-y-3 text-xs">
            {oemMarginData.map((item) => (
              <div key={item.oem} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-ink-900">{item.oem}</span>
                  <span className="font-mono font-bold text-primary">
                    {formatPercent(item.margin)}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-sunken rounded-xs overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-xs transition-all duration-500"
                    style={{ width: `${(item.margin / 32) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Quotation Pipeline (7 cols) & Recent Activity (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quotation Pipeline (Left 7 cols) */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-md p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
                Quotation Conversion Pipeline
              </h3>
              <p className="text-[11px] text-ink-500 mt-0.5">Commercial value in active negotiation</p>
            </div>
            <span className="text-xs font-mono font-bold text-ink-900">
              USD {totalPipelineVal.toLocaleString()}
            </span>
          </div>

          {/* Stacked Segmented Pipeline Bar */}
          <div className="h-4 w-full bg-surface-sunken rounded-xs overflow-hidden flex border border-border">
            {pipelineStages.map((st) => {
              const pct = (st.value / totalPipelineVal) * 100;
              return (
                <div
                  key={st.label}
                  style={{ width: `${pct}%` }}
                  className={clsx('h-full transition-all', st.color)}
                  title={`${st.label}: USD ${st.value.toLocaleString()} (${st.count} quotes)`}
                />
              );
            })}
          </div>

          {/* Pipeline Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {pipelineStages.map((st) => (
              <div key={st.label} className="p-2 bg-surface-sunken rounded-xs border border-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={clsx('w-2 h-2 rounded-full', st.color)} />
                  <span className="font-semibold text-ink-700 text-[11px]">{st.label}</span>
                </div>
                <span className="font-mono font-bold text-ink-900 block text-xs">
                  USD {st.value.toLocaleString()}
                </span>
                <span className="text-[10px] text-ink-500 font-mono">{st.count} quotes</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Commercial Activity (Right 5 cols) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-md p-5 space-y-4 shadow-xs">
          <div className="pb-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
              Recent Commercial Feed
            </h3>
            <p className="text-[11px] text-ink-500 mt-0.5">Real-time audit log of quotes and receipts</p>
          </div>

          <div className="space-y-3 text-xs">
            {notifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-2.5 pb-2.5 border-b border-border/50 last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-ink-900 leading-snug">{n.title}</p>
                  <span className="text-[10px] text-ink-500 font-mono mt-0.5 block">
                    {getRelativeTime(n.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
