import React from 'react';
import { cn } from '../../lib/utils';
import type { ActivityItem } from '../../types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Clock, FileText } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  sparklineData?: number[];
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  sparklineData = [20, 35, 25, 45, 40, 60, 55, 75],
  className,
}) => {
  // SVG sparkline path calculation
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const width = 80;
  const height = 24;

  const points = sparklineData
    .map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={cn(
        'bg-surface rounded-lg p-5 border border-border shadow-sh-1 text-left flex flex-col justify-between space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-ink-3">
        <span className="font-medium uppercase tracking-wider text-[11px]">{label}</span>
        {change && (
          <span
            className={cn(
              'font-mono text-[11px] font-semibold',
              isPositive ? 'text-success' : 'text-ink-3'
            )}
          >
            {change}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-serif text-2xl sm:text-3xl font-semibold text-primary tabular-nums">
          {value}
        </span>

        {/* Quiet sparkline in ink-3 per PRD §12.1 */}
        <div className="shrink-0 opacity-60">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke="#8A8E86"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const ActivityFeed: React.FC<{ activities: ActivityItem[] }> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'payment_verified':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'overlap_prevented':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'quote_received':
        return <FileText className="w-4 h-4 text-info" />;
      case 'maintenance_scheduled':
        return <ShieldCheck className="w-4 h-4 text-accent" />;
      default:
        return <Clock className="w-4 h-4 text-ink-3" />;
    }
  };

  return (
    <div className="bg-surface rounded-lg p-5 border border-border shadow-sh-1 text-left space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h4 className="font-serif text-base font-normal text-ink">
          Recent Activity & Security Audit Log
        </h4>
        <span className="text-[11px] text-ink-3 font-mono">Real-time store</span>
      </div>

      <div className="divide-y divide-border/60">
        {activities.slice(0, 7).map((act) => (
          <div key={act.id} className="py-3 flex items-start gap-3 text-xs">
            <div className="mt-0.5 shrink-0">{getIcon(act.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-ink leading-tight">{act.title}</span>
                <span className="text-[10px] text-ink-3 whitespace-nowrap">{act.timestamp}</span>
              </div>
              <p className="text-ink-2 text-[11px] mt-0.5 leading-relaxed">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
