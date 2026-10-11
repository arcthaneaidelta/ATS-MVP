import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { PoolCard } from '../components/app/PoolCard';
import { JoinPoolModal } from '../components/app/JoinPoolModal';
import { AddFundsDrawer } from '../components/app/AddFundsDrawer';
import { Pool, PoolCadence } from '../types';
import { formatCurrency } from '../lib/format';
import { Search, ShieldCheck } from 'lucide-react';

export const PoolsPage: React.FC = () => {
  const navigate = useNavigate();
  const { pools } = useAppStore();

  const [cadenceFilter, setCadenceFilter] = useState<'all' | PoolCadence>('all');
  const [sortOption, setSortOption] = useState<'closing_soon' | 'largest_pot'>('closing_soon');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoolForJoin, setSelectedPoolForJoin] = useState<Pool | null>(null);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  // Filter open pools
  const openPools = pools.filter((p) => {
    if (p.status !== 'open') return false;
    if (cadenceFilter !== 'all' && p.cadence !== cadenceFilter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort
  openPools.sort((a, b) => {
    if (sortOption === 'largest_pot') return b.pot - a.pot;
    return new Date(a.closesAt).getTime() - new Date(b.closesAt).getTime();
  });

  const settledPools = pools.filter((p) => p.status === 'settled');

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
          Prize Pools
        </h1>
        <p className="text-xs text-[#7C867F] mt-1">
          Fixed-contribution pools. Provable Chainlink VRF winner derivation on Base L2.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg">
        {/* Cadence Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#EDE9E1] rounded-md">
          {(['all', 'daily', 'weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setCadenceFilter(tab)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors cursor-pointer ${
                cadenceFilter === tab
                  ? 'bg-[#FFFFFF] text-[#1B2420] shadow-sm font-semibold'
                  : 'text-[#4A5650] hover:text-[#1B2420]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Search and Sort */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-[#7C867F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pools..."
              className="w-full h-9 pl-9 pr-3 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs text-[#1B2420] placeholder:text-[#7C867F] focus:outline-none focus:border-[#2C4A3E]"
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="h-9 px-3 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs text-[#1B2420] focus:outline-none focus:border-[#2C4A3E] cursor-pointer"
          >
            <option value="closing_soon">Closing soon</option>
            <option value="largest_pot">Largest pot</option>
          </select>
        </div>
      </div>

      {/* Open Pools Grid */}
      <div>
        <h2 className="text-lg font-display font-medium text-[#1B2420] mb-4">
          Open Pools ({openPools.length})
        </h2>

        {openPools.length === 0 ? (
          <div className="p-12 text-center bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg text-xs text-[#7C867F]">
            No pools match the selected criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openPools.map((pool) => (
              <PoolCard
                key={pool.id}
                pool={pool}
                onJoinClick={(p) => setSelectedPoolForJoin(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Settled Pools History Table */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CD] mb-4">
          <div>
            <h3 className="text-base font-display font-medium text-[#1B2420]">
              Settled Pools Archive
            </h3>
            <p className="text-xs text-[#7C867F]">
              Review transparent past draw outcomes and verify VRF seeds on BaseScan
            </p>
          </div>
          <Link to="/verify" className="text-xs text-[#2C4A3E] hover:underline font-medium">
            Open Verifier →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DDD8CD] text-[#7C867F] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Pool Name</th>
                <th className="py-2.5 px-3">Cadence</th>
                <th className="py-2.5 px-3">Total Pot</th>
                <th className="py-2.5 px-3">Participants</th>
                <th className="py-2.5 px-3">Winning Ticket</th>
                <th className="py-2.5 px-3">Winner</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD8CD]/40">
              {settledPools.map((sp) => (
                <tr
                  key={sp.id}
                  onClick={() => sp.drawId && navigate(`/app/draws/${sp.drawId}`)}
                  className="hover:bg-[#FBF9F5] transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-medium text-[#1B2420]">{sp.name}</td>
                  <td className="py-3 px-3 uppercase text-[11px] font-mono text-[#7C867F]">
                    {sp.cadence}
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-[#2C4A3E]">
                    {formatCurrency(sp.pot)}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#7C867F]">{sp.currentEntries}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-[#B08A4E]">
                    #{sp.winnerEntryNumber}
                  </td>
                  <td className="py-3 px-3 text-[#4A5650]">{sp.winnerMaskedName}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[#2C4A3E] font-medium hover:underline">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify Proof</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
