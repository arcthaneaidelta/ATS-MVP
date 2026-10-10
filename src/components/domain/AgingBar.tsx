import { motion } from 'framer-motion';
import { formatMoney } from '../../lib/format';
import clsx from 'clsx';

export interface AgingBucket {
  id: 'current' | '1-30' | '31-60' | '61-90' | '90+';
  label: string;
  amount: number;
  count: number;
  color: string;
  barColor: string;
  textColor: string;
}

export interface AgingBarProps {
  buckets: AgingBucket[];
  activeBucket?: string | null;
  onSelectBucket?: (bucketId: string | null) => void;
  currency?: 'USD' | 'PEN' | 'ZMW';
}

export function AgingBar({
  buckets,
  activeBucket,
  onSelectBucket,
  currency = 'USD',
}: AgingBarProps) {
  const totalAmount = buckets.reduce((acc, b) => acc + b.amount, 0) || 1;

  return (
    <div className="p-5 bg-surface border border-border rounded-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
            Receivables Aging Buckets
          </h4>
          <p className="text-xs text-ink-500 mt-0.5">
            Click any aging category to filter active commercial invoices below.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-ink-500 uppercase tracking-wider block">Total Outstanding</span>
          <span className="text-base font-bold font-mono text-ink-900">
            {formatMoney(totalAmount, currency)}
          </span>
        </div>
      </div>

      {/* Segmented Progress Track */}
      <div className="h-4 w-full bg-surface-sunken rounded-xs overflow-hidden flex border border-border">
        {buckets.map((b) => {
          const pct = Math.round((b.amount / totalAmount) * 100);
          if (pct === 0 && b.amount === 0) return null;
          return (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => onSelectBucket?.(activeBucket === b.id ? null : b.id)}
              style={{ width: `${Math.max(pct, 2)}%` }}
              className={clsx(
                'h-full transition-opacity cursor-pointer relative group',
                b.barColor,
                activeBucket && activeBucket !== b.id ? 'opacity-35' : 'opacity-100'
              )}
              title={`${b.label}: ${formatMoney(b.amount, currency)} (${pct}%)`}
            />
          );
        })}
      </div>

      {/* Bucket Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {buckets.map((b) => {
          const isSelected = activeBucket === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBucket?.(isSelected ? null : b.id)}
              className={clsx(
                'text-left p-3 rounded-sm border transition-all select-none',
                b.color,
                isSelected
                  ? 'ring-2 ring-primary ring-offset-1 border-primary font-semibold shadow-xs'
                  : 'hover:bg-surface-elevated border-border'
              )}
            >
              <div className="flex items-center justify-between text-[11px] font-medium text-ink-700 mb-1">
                <span>{b.label}</span>
                <span className="text-[10px] text-ink-500 font-mono">({b.count})</span>
              </div>
              <div className={clsx('text-sm font-bold font-mono tracking-tight', b.textColor)}>
                {formatMoney(b.amount, currency)}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
