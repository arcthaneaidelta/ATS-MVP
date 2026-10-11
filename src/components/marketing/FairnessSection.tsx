import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export const FairnessSection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-[#FBF9F5] border-y border-[#DDD8CD] px-6 sm:px-8 text-left">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-3 py-1 rounded-sm">
              Tamper-Proof Math
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420] mt-3">
              Don’t trust us. Check.
            </h2>
            <p className="text-base text-[#4A5650] max-w-xl mt-2">
              Every round generates a verifiable random seed via Chainlink VRF on Base. No administrator, developer, or participant can bias or predict the outcome.
            </p>
          </div>

          <Link to="/verify">
            <Button variant="secondary">
              <span>Verify a real draw</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* 4-Node Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-[#FFFFFF] border border-[#DDD8CD] rounded-md relative">
            <span className="text-xs font-mono font-semibold text-[#B08A4E] block mb-2">01 / CLOSE</span>
            <h4 className="text-base font-semibold text-[#1B2420] mb-2">Pool Closes</h4>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              Smart contract locks participants. No further entries can be accepted or reordered.
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#DDD8CD] rounded-md relative">
            <span className="text-xs font-mono font-semibold text-[#B08A4E] block mb-2">02 / REQUEST</span>
            <h4 className="text-base font-semibold text-[#1B2420] mb-2">Randomness Requested</h4>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              Platform emits a cryptographic request to Chainlink VRF coordinator on Base.
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#DDD8CD] rounded-md relative">
            <span className="text-xs font-mono font-semibold text-[#B08A4E] block mb-2">03 / PROOF</span>
            <h4 className="text-base font-semibold text-[#1B2420] mb-2">VRF Responds</h4>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              Oracle network submits an unforgeable cryptographic proof verified on-chain.
            </p>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#DDD8CD] rounded-md relative">
            <span className="text-xs font-mono font-semibold text-[#B08A4E] block mb-2">04 / WINNER</span>
            <h4 className="text-base font-semibold text-[#1B2420] mb-2">Modulo Derivation</h4>
            <p className="text-xs text-[#4A5650] leading-relaxed">
              Smart contract calculates <code className="font-mono text-xs">randomWord % entries</code> to select the winner.
            </p>
          </div>
        </div>

        {/* Live Mathematical Formula Card */}
        <div className="p-6 sm:p-8 bg-[#EDE9E1] border border-[#DDD8CD] rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2C4A3E]">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifiable Smart Contract Formula</span>
            </div>
            <div className="font-mono text-sm sm:text-base text-[#1B2420] bg-[#FFFFFF] p-3 rounded border border-[#DDD8CD] overflow-x-auto">
              <code>winningEntry = (uint256(keccak256(randomWord)) % totalEntries) + 1</code>
            </div>
            <p className="text-xs text-[#4A5650]">
              Every draw publishes its transaction hash, VRF request ID, and exact random word so you can verify the remainder in any browser or calculator.
            </p>
          </div>

          <div className="shrink-0">
            <Link to="/verify/draw_w_40">
              <Button variant="primary">
                Inspect Week 40 Draw Math
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
