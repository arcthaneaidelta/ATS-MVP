import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pool } from '../../types';
import { formatCurrency, getTimeRemaining } from '../../lib/format';
import { Button } from '../ui/Button';
import { ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useAppStore } from '../../store';

export const PoolCard: React.FC<{
  pool: Pool;
  onJoinClick?: (pool: Pool) => void;
}> = ({ pool, onJoinClick }) => {
  const navigate = useNavigate();
  const { entries } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(pool.closesAt));

  useEffect(() => {
    if (pool.status !== 'open') return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining(pool.closesAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [pool.closesAt, pool.status]);

  // Check if user already entered this pool
  const userEntry = entries.find((e) => e.poolId === pool.id && e.status === 'active');

  // 12-segment participation visualizer
  const maxVisualEntries = pool.maxEntries || (pool.currentEntries > 200 ? 300 : 250);
  const segmentsFilled = Math.min(12, Math.round((pool.currentEntries / maxVisualEntries) * 12));

  return (
    <div
      onClick={() => navigate(`/app/pools/${pool.id}`)}
      className="bg-[#FFFFFF] border border-[#DDD8CD] hover:border-[#C7C1B3] rounded-lg p-6 shadow-[0_1px_2px_rgba(27,36,32,0.05)] hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left cursor-pointer group select-none"
    >
      <div>
        {/* Top meta tags */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CD]/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-2.5 py-0.5 rounded">
            {pool.cadence.toUpperCase()}
          </span>

          {pool.status === 'open' ? (
            <span className="text-xs font-mono text-[#7C867F] flex items-center gap-1 tabular-nums">
              <Clock className="w-3.5 h-3.5 text-[#B7791F]" />
              <span>{timeLeft.formatted}</span>
            </span>
          ) : (
            <span className="text-xs font-medium text-[#3E7D5A] bg-[#3E7D5A]/10 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Settled</span>
            </span>
          )}
        </div>

        {/* Title & Entry fee badge */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-display font-medium text-[#1B2420] group-hover:text-[#2C4A3E] transition-colors">
            {pool.name}
          </h3>
          <span className="text-xs font-mono font-semibold bg-[#EDE9E1] text-[#1B2420] px-2 py-0.5 rounded shrink-0">
            ${pool.entryFee} entry
          </span>
        </div>

        {/* Big Pot Numeral */}
        <div className="my-5">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F] block">
            Guaranteed Pool Pot
          </span>
          <span className="text-3xl font-display font-medium text-[#1B2420] tabular-nums tracking-tight">
            {formatCurrency(pool.pot)}
          </span>
          <span className="text-[11px] text-[#7C867F] block mt-0.5">
            Net payout ≈ {formatCurrency(pool.pot * 0.95)} after 5% fee
          </span>
        </div>

        {/* 12-Segment Progress Bar */}
        <div className="space-y-1.5 my-4">
          <div className="flex justify-between text-xs text-[#7C867F]">
            <span>Sealed Entries</span>
            <span className="font-mono text-[#1B2420] font-medium tabular-nums">
              {pool.currentEntries} participants
            </span>
          </div>
          <div className="grid grid-cols-12 gap-1 h-1.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-colors ${
                  i < segmentsFilled ? 'bg-[#2C4A3E]' : 'bg-[#DDD8CD]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action / State footer */}
      <div className="pt-4 border-t border-[#DDD8CD]/60 mt-2">
        {pool.status === 'open' ? (
          userEntry ? (
            <div className="w-full py-2 bg-[#E3EBE6] rounded text-center text-xs text-[#2C4A3E] font-medium flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2C4A3E]" />
              <span>You’re in · Entry #{userEntry.entryNumber}</span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                if (onJoinClick) {
                  onJoinClick(pool);
                } else {
                  navigate(`/app/pools/${pool.id}`);
                }
              }}
            >
              Join for ${pool.entryFee}
            </Button>
          )
        ) : (
          <div className="flex items-center justify-between text-xs text-[#4A5650]">
            <span>Winner: <strong className="text-[#1B2420] font-mono">#{pool.winnerEntryNumber}</strong></span>
            <span className="text-[#2C4A3E] hover:underline font-medium">Verify Draw Math →</span>
          </div>
        )}
      </div>
    </div>
  );
};
