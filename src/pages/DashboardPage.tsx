import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { formatCurrency, formatTxHash } from '../lib/format';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/ui/StatusChip';
import { PoolCard } from '../components/app/PoolCard';
import { CustomLineChart } from '../components/ui/CustomLineChart';
import { JoinPoolModal } from '../components/app/JoinPoolModal';
import { AddFundsDrawer } from '../components/app/AddFundsDrawer';
import { Pool } from '../types';
import {
  Wallet,
  ArrowUpRight,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Ticket
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    availableBalance,
    activeEntriesBalance,
    pools,
    entries,
    activity,
  } = useAppStore();

  const [selectedPoolForJoin, setSelectedPoolForJoin] = useState<Pool | null>(null);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const openPools = pools.filter((p) => p.status === 'open');
  const userEntries = entries.slice(0, 3);
  const recentActivity = activity.slice(0, 5);

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
          Participant Dashboard
        </h1>
        <p className="text-xs text-[#7C867F] mt-1">
          Settled on Base L2 · Verified by Chainlink VRF
        </p>
      </div>

      {/* 1. Balance Hero Card */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,36,32,0.05)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F] block">
            Available Dollar Balance
          </span>
          <div className="flex items-baseline gap-3 my-1">
            <span className="text-4xl sm:text-5xl font-display font-normal text-[#1B2420] tabular-nums tracking-tight">
              {formatCurrency(availableBalance)}
            </span>
            <span className="text-xs font-mono text-[#3E7D5A] bg-[#3E7D5A]/10 px-2 py-0.5 rounded font-medium">
              USDC on Base
            </span>
          </div>
          <span className="text-xs text-[#4A5650] block mt-1">
            Available to enter pools ·{' '}
            <strong className="text-[#1B2420]">{formatCurrency(activeEntriesBalance)}</strong> in active entries
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddFundsOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add funds</span>
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/app/withdrawals')}
            className="flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </Button>
        </div>
      </div>

      {/* 2. "Needs Attention" Strip */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 p-3.5 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#1B2420]">
            <Clock className="w-4 h-4 text-[#B7791F] shrink-0" />
            <span>
              Daily Pool closes in <strong>03:42:10</strong>. You haven’t entered yet.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const daily = pools.find((p) => p.cadence === 'daily' && p.status === 'open');
              if (daily) setSelectedPoolForJoin(daily);
            }}
            className="font-semibold text-[#2C4A3E] hover:underline cursor-pointer ml-3 shrink-0"
          >
            Join for $5 →
          </button>
        </div>

        <div className="flex-1 p-3.5 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#4A5650]">
            <ShieldCheck className="w-4 h-4 text-[#3E7D5A] shrink-0" />
            <span>Coinbase withdrawal destination activates in 23h 59m (cooling-off).</span>
          </div>
          <Link
            to="/app/withdrawals"
            className="font-semibold text-[#2C4A3E] hover:underline shrink-0 ml-3"
          >
            View →
          </Link>
        </div>
      </div>

      {/* 3. Your Active Entries */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CD] mb-4">
          <div>
            <h3 className="text-base font-display font-medium text-[#1B2420]">
              Your Entries
            </h3>
            <p className="text-xs text-[#7C867F]">
              Cryptographically sealed tickets entered into pending and past draws
            </p>
          </div>
          <Link
            to="/app/pools"
            className="text-xs text-[#2C4A3E] hover:underline font-medium"
          >
            Browse all pools →
          </Link>
        </div>

        <div className="divide-y divide-[#DDD8CD]/50">
          {userEntries.map((ent) => (
            <div
              key={ent.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#EDE9E1] flex items-center justify-center font-mono text-[#2C4A3E] font-semibold shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#1B2420]">{ent.poolName}</h4>
                  <span className="text-[#7C867F] font-mono">
                    Ticket #{ent.entryNumber} · {formatCurrency(ent.fee)} contribution
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusChip
                  status={ent.status === 'won' ? 'success' : ent.status === 'active' ? 'warning' : 'neutral'}
                  label={ent.status === 'won' ? 'Winner' : ent.status === 'active' ? 'Active in Draw' : 'Not Selected'}
                  isPulsing={ent.status === 'active'}
                />
                <button
                  type="button"
                  onClick={() => navigate(`/app/pools/${ent.poolId}`)}
                  className="text-xs text-[#2C4A3E] hover:underline font-medium cursor-pointer"
                >
                  View Pool →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Open Pools Preview Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-display font-medium text-[#1B2420]">
              Open Pools
            </h3>
            <p className="text-xs text-[#7C867F]">
              Fixed amounts, provable on-chain draws
            </p>
          </div>
          <Link to="/app/pools" className="text-xs text-[#2C4A3E] hover:underline font-medium">
            View All Pools →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {openPools.slice(0, 3).map((p) => (
            <PoolCard
              key={p.id}
              pool={p}
              onJoinClick={(pool) => setSelectedPoolForJoin(pool)}
            />
          ))}
        </div>
      </div>

      {/* 5. SVG Trajectory Chart (8-Week Contributions vs Winnings) */}
      <CustomLineChart />

      {/* 6. Recent Activity Feed */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CD] mb-4">
          <div>
            <h3 className="text-base font-display font-medium text-[#1B2420]">
              Recent Activity
            </h3>
            <p className="text-xs text-[#7C867F]">
              Live log of deposits, pool entries, and payouts
            </p>
          </div>
          <Link to="/app/activity" className="text-xs text-[#2C4A3E] hover:underline font-medium">
            View full log →
          </Link>
        </div>

        <div className="divide-y divide-[#DDD8CD]/50">
          {recentActivity.map((act) => (
            <div
              key={act.id}
              className="py-3 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-[#1B2420] block">
                  {act.title}
                </span>
                <span className="text-[#7C867F]">
                  {act.description} · {act.dateGroup}
                </span>
              </div>

              {act.amount !== undefined && (
                <span
                  className={`font-mono font-semibold ${
                    act.isPositive ? 'text-[#3E7D5A]' : 'text-[#1B2420]'
                  }`}
                >
                  {act.isPositive ? '+' : '-'}{formatCurrency(act.amount)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals & Drawers */}
      <JoinPoolModal
        isOpen={!!selectedPoolForJoin}
        onClose={() => setSelectedPoolForJoin(null)}
        pool={selectedPoolForJoin}
        onOpenAddFunds={() => setIsAddFundsOpen(true)}
      />

      <AddFundsDrawer
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />
    </div>
  );
};
