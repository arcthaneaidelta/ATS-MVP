import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { HeroLedger } from '../components/marketing/HeroLedger';
import { ProofStrip } from '../components/marketing/ProofStrip';
import { PinnedSteps } from '../components/marketing/PinnedSteps';
import { FairnessSection } from '../components/marketing/FairnessSection';
import { SecuritySection } from '../components/marketing/SecuritySection';
import { WalletFreeSection } from '../components/marketing/WalletFreeSection';
import { FAQSection } from '../components/marketing/FAQSection';
import { PoolCard } from '../components/app/PoolCard';
import { useAppStore } from '../store';
import { ShieldCheck, ArrowRight, ArrowDown } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { pools } = useAppStore();

  const openPools = pools.filter((p) => p.status === 'open').slice(0, 3);

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-[calc(100vh-72px)] max-h-[880px] flex items-center justify-center pt-24 pb-16 px-6 sm:px-8 max-w-[1200px] mx-auto text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#EDE9E1] border border-[#DDD8CD] text-xs font-semibold tracking-wider uppercase text-[#2C4A3E]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Provably Fair Pools</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-normal text-[#1B2420] leading-[1.05] tracking-tight">
              Join a pool.
              <br />
              The draw is public,
              <br />
              and so is the proof.
            </h1>

            <p className="text-base sm:text-lg text-[#4A5650] max-w-lg leading-relaxed">
              Contribute a fixed amount, see exactly who is in, and watch winners selected by verifiable on-chain randomness. No wallets, no seed phrases, no jargon.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
              >
                <span>Start with email</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <Link to="/verify">
                <Button variant="secondary" size="lg">
                  Watch a draw verify
                </Button>
              </Link>
            </div>

            {/* Trust row */}
            <div className="pt-4 border-t border-[#DDD8CD]/80 text-xs text-[#7C867F] flex items-center gap-2">
              <span>Settled on Base</span>
              <span>·</span>
              <span>Randomness by Chainlink VRF</span>
              <span>·</span>
              <span>Hardware key isolation</span>
            </div>
          </div>

          {/* Right Column: Live Pool Ledger Visualizer */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <HeroLedger />
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-[11px] font-mono text-[#7C867F] opacity-75">
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </section>

      {/* Proof Strip */}
      <ProofStrip />

      {/* Pinned Steps: How it works */}
      <PinnedSteps />

      {/* Fairness & Modulo math */}
      <FairnessSection />

      {/* Pools Preview Section */}
      <section className="w-full py-24 px-6 sm:px-8 max-w-[1200px] mx-auto text-left">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-3 py-1 rounded-sm">
              Live Prize Pools
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420] mt-3">
              Active rounds accepting entries
            </h2>
            <p className="text-base text-[#4A5650] max-w-xl mt-2">
              Select any pool cadence. When the countdown reaches zero, Chainlink VRF derives the winner automatically.
            </p>
          </div>

          <Link to="/app/pools">
            <Button variant="secondary">
              <span>View all pools</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {openPools.map((pool) => (
            <PoolCard
              key={pool.id}
              pool={pool}
              onJoinClick={() => navigate(`/app/pools/${pool.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Security Architecture Section */}
      <SecuritySection />

      {/* Wallet-Free Promise */}
      <WalletFreeSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};
