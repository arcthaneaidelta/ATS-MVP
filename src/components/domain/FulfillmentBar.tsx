import { motion } from 'framer-motion';

export interface FulfillmentBarProps {
  ordered: number;
  delivered: number;
  inTransit?: number;
  showLabels?: boolean;
}

export function FulfillmentBar({
  ordered,
  delivered,
  inTransit = 0,
  showLabels = true,
}: FulfillmentBarProps) {
  const total = Math.max(ordered, 1);
  const deliveredPct = Math.min(100, Math.round((delivered / total) * 100));
  const inTransitPct = Math.min(100 - deliveredPct, Math.round((inTransit / total) * 100));
  const pendingPct = Math.max(0, 100 - deliveredPct - inTransitPct);

  return (
    <div className="w-full space-y-1">
      {/* Segmented bar track */}
      <div className="h-2.5 w-full bg-surface-sunken rounded-xs overflow-hidden flex border border-border/50">
        {deliveredPct > 0 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: `${deliveredPct}%`, transformOrigin: 'left' }}
            className="h-full bg-success"
            title={`Delivered: ${delivered} (${deliveredPct}%)`}
          />
        )}
        {inTransitPct > 0 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: `${inTransitPct}%`, transformOrigin: 'left' }}
            className="h-full bg-warning"
            title={`In Transit: ${inTransit} (${inTransitPct}%)`}
          />
        )}
        {pendingPct > 0 && (
          <div
            style={{ width: `${pendingPct}%` }}
            className="h-full bg-surface-sunken"
            title={`Pending: ${ordered - delivered - inTransit}`}
          />
        )}
      </div>

      {showLabels && (
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            <span className="text-ink-700 font-medium">{delivered}</span> delivered
          </span>
          {inTransit > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block" />
              <span>{inTransit} in transit</span>
            </span>
          )}
          <span>
            <span className="text-ink-900 font-semibold">{ordered}</span> total
          </span>
        </div>
      )}
    </div>
  );
}
