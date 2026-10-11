import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { formatCurrency, getTimeRemaining, formatTxHash } from '../lib/format';
import { Button } from '../components/ui/Button';
import { DrawOverlay } from '../components/draw/DrawOverlay';
import { JoinPoolModal } from '../components/app/JoinPoolModal';
import { AddFundsDrawer } from '../components/app/AddFundsDrawer';
import { Draw } from '../types';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  Ticket,
  Play,
  RotateCcw,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

export const PoolDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pools, entries, availableBalance, runDraw, demoSettings, setDemoSetting } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'entries' | 'fairness' | 'rules'>('overview');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isDrawOverlayOpen, setIsDrawOverlayOpen] = useState(false);
  const [activeDrawResult, setActiveDrawResult] = useState<Draw | null>(null);
  const [isRunningDraw, setIsRunningDraw] = useState(false);

  const pool = pools.find((p) => p.id === id) || pools[0];
  const timeLeft = getTimeRemaining(pool.closesAt);
  const userEntry = entries.find((e) => e.poolId === pool.id && e.status === 'active');

  const handleRunDrawNow = async () => {
    setIsRunningDraw(true);
    try {
      const result = await runDraw(pool.id);
      setActiveDrawResult(result);
      setIsDrawOverlayOpen(true);
    } finally {
      setIsRunningDraw(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Back button */}
      <div>
        <Link
          to="/app/pools"
          className="text-xs text-[#7C867F] hover:text-[#1B2420] flex items-center gap-1 font-medium w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to pools</span>
        </Link>
      </div>

      {/* Main Grid: Left 8 cols, Right 4 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header Card */}
          <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CD]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-2.5 py-0.5 rounded">
                {pool.cadence.toUpperCase()} POOL
              </span>
              <div className="flex items-center gap-2 text-xs font-mono text-[#7C867F]">
                <Clock className="w-3.5 h-3.5 text-[#B7791F]" />
                <span>{timeLeft.formatted} remaining</span>
              </div>
            </div>

            <div className="my-4">
              <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
                {pool.name}
              </h1>
              <p className="text-xs text-[#4A5650] mt-1 leading-relaxed">
                {pool.description || 'Fixed entry prize pool on Base L2.'}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DDD8CD]/60">
              <div>
                <span className="text-xs text-[#7C867F] block">Total Pot</span>
                <span className="text-2xl font-display font-medium text-[#1B2420] tabular-nums">
                  {formatCurrency(pool.pot)}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#7C867F] block">Entry Price</span>
                <span className="text-2xl font-display font-medium text-[#2C4A3E] tabular-nums">
                  ${pool.entryFee}.00
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-[#7C867F] block">Sealed Entries</span>
                <span className="text-2xl font-display font-medium text-[#1B2420] tabular-nums font-mono">
                  {pool.currentEntries}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#DDD8CD] text-xs font-medium">
            {(['overview', 'entries', 'fairness', 'rules'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-3 uppercase tracking-wider transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'border-b-2 border-[#2C4A3E] text-[#1B2420] font-semibold'
                    : 'text-[#7C867F] hover:text-[#1B2420]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          {activeTab === 'overview' && (
            <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 space-y-4">
              <h3 className="text-base font-display font-medium text-[#1B2420]">
                Round Mechanics & Settlement
              </h3>
              <p className="text-xs text-[#4A5650] leading-relaxed">
                When the countdown timer reaches zero, entries are immutably sealed by the Base L2 smart contract. An automated trigger initiates a Chainlink VRF randomness request.
              </p>
              <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md text-xs space-y-2">
                <div className="flex justify-between text-[#4A5650]">
                  <span>Contract Architecture:</span>
                  <span className="font-mono text-[#1B2420]">MeridianPoolVault.sol (OpenZeppelin)</span>
                </div>
                <div className="flex justify-between text-[#4A5650]">
                  <span>Randomness Source:</span>
                  <span className="text-[#2C4A3E] font-medium">Chainlink VRF v2.5 Direct Fulfillment</span>
                </div>
                <div className="flex justify-between text-[#4A5650]">
                  <span>Platform Fee:</span>
                  <span>5% (Allocated to oracle gas and maintenance)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'entries' && (
            <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-medium text-[#1B2420]">
                  Participants ({pool.currentEntries})
                </h3>
                <span className="text-xs text-[#7C867F]">Names masked for privacy</span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#DDD8CD]/40 text-xs">
                {Array.from({ length: 25 }).map((_, i) => {
                  const entryNum = pool.currentEntries - i;
                  const isUser = userEntry && userEntry.entryNumber === entryNum;
                  return (
                    <div
                      key={i}
                      className={`py-2.5 px-3 flex items-center justify-between rounded ${
                        isUser ? 'bg-[#E3EBE6] font-semibold text-[#2C4A3E]' : 'hover:bg-[#FBF9F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#7C867F]">Ticket #{entryNum}</span>
                        <span>{isUser ? 'Amara Okafor (You)' : `Participant ${String.fromCharCode(65 + (i % 26))}****${i}`}</span>
                      </div>
                      <span className="font-mono text-[#7C867F]">${pool.entryFee}.00</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'fairness' && (
            <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 space-y-4">
              <h3 className="text-base font-display font-medium text-[#1B2420]">
                Cryptographic Verifiability
              </h3>
              <p className="text-xs text-[#4A5650] leading-relaxed">
                The winning index is computed on-chain using:
              </p>
              <div className="p-3 bg-[#EDE9E1] rounded font-mono text-xs text-[#1B2420]">
                winningEntry = (uint256(randomWord) % {pool.currentEntries}) + 1
              </div>
              <p className="text-xs text-[#4A5650] leading-relaxed">
                Because neither the platform nor participants know the future VRF block seed in advance, results cannot be manipulated.
              </p>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 space-y-3 text-xs text-[#4A5650] leading-relaxed">
              <h3 className="text-base font-display font-medium text-[#1B2420]">
                Participation Rules
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Fixed contributions only; no variable or speculative betting sizes.</li>
                <li>One winner selected per sealed pool round.</li>
                <li>Net payout = Gross pot minus 5% transparent platform maintenance fee.</li>
                <li>Prizes auto-route to the winner’s saved withdrawal destination.</li>
              </ul>
            </div>
          )}

          {/* Demo Controls Section (Dashed Box per PRD Section 14.6) */}
          <div className="p-6 bg-[#FBF9F5] border-2 border-dashed border-[#C7C1B3] rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#B08A4E]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1B2420]">
                  Client Review Demo Controls
                </span>
              </div>
              <span className="text-[10px] font-mono bg-[#EDE9E1] px-2 py-0.5 rounded text-[#7C867F]">
                Antigravity Demo Harness
              </span>
            </div>

            <p className="text-xs text-[#4A5650]">
              Trigger the signature 4-step live Chainlink VRF draw sequence right now without waiting for the timer to expire.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                size="md"
                isLoading={isRunningDraw}
                onClick={handleRunDrawNow}
                className="flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Next Draw Now</span>
              </Button>

              <button
                type="button"
                onClick={() => setDemoSetting('simulateVrfDelay', !demoSettings.simulateVrfDelay)}
                className={`px-3 py-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  demoSettings.simulateVrfDelay
                    ? 'bg-[#B7791F]/10 border-[#B7791F] text-[#B7791F]'
                    : 'bg-[#EDE9E1] border-[#DDD8CD] text-[#4A5650] hover:bg-[#DDD8CD]'
                }`}
              >
                {demoSettings.simulateVrfDelay ? 'VRF Delay: ON (4s extra)' : 'Simulate VRF Delay: OFF'}
              </button>

              <button
                type="button"
                onClick={() => setDemoSetting('userWinsNextDraw', !demoSettings.userWinsNextDraw)}
                className={`px-3 py-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  demoSettings.userWinsNextDraw
                    ? 'bg-[#3E7D5A]/10 border-[#3E7D5A] text-[#3E7D5A]'
                    : 'bg-[#EDE9E1] border-[#DDD8CD] text-[#4A5650] hover:bg-[#DDD8CD]'
                }`}
              >
                {demoSettings.userWinsNextDraw ? 'Outcome: You Win' : 'Outcome: Participant Wins'}
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Sticky Join Panel */}
        <div className="lg:col-span-4 sticky top-24 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 shadow-[0_1px_2px_rgba(27,36,32,0.05)] space-y-6">
          <div className="pb-4 border-b border-[#DDD8CD]">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F] block">
              Entry Price
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-display font-medium text-[#1B2420]">
                ${pool.entryFee}.00
              </span>
              <span className="text-xs text-[#7C867F]">fixed contribution</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-[#4A5650]">
              <span>Your Available Balance:</span>
              <span className="font-mono text-[#1B2420] font-semibold">
                {formatCurrency(availableBalance)}
              </span>
            </div>
            <div className="flex justify-between text-[#4A5650]">
              <span>Guaranteed Gross Pot:</span>
              <span className="font-mono text-[#2C4A3E]">
                {formatCurrency(pool.pot)}
              </span>
            </div>
            <div className="flex justify-between text-[#4A5650]">
              <span>Network fee:</span>
              <span className="font-mono text-[#7C867F]">≈ $0.002 on Base</span>
            </div>
          </div>

          {userEntry ? (
            <div className="p-4 bg-[#E3EBE6] rounded-md text-xs text-[#2C4A3E] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>You’re in this pool</span>
              </div>
              <p>
                Ticket <strong className="font-mono">#{userEntry.entryNumber}</strong> is locked. Draw runs automatically when countdown finishes.
              </p>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setIsJoinModalOpen(true)}
            >
              Join for ${pool.entryFee}
            </Button>
          )}

          <div className="p-3 bg-[#FBF9F5] border border-[#DDD8CD] rounded text-[11px] text-[#7C867F] leading-relaxed">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2C4A3E] inline mr-1" />
            Zero custody abuse risk. Winner payout dispatches automatically via Base L2 batch routing.
          </div>
        </div>
      </div>

      {/* Global Overlays */}
      <JoinPoolModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        pool={pool}
        onOpenAddFunds={() => setIsAddFundsOpen(true)}
      />

      <AddFundsDrawer
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />

      <DrawOverlay
        isOpen={isDrawOverlayOpen}
        onClose={() => setIsDrawOverlayOpen(false)}
        pool={pool}
        drawResult={activeDrawResult}
        isDelayed={demoSettings.simulateVrfDelay}
      />
    </div>
  );
};
