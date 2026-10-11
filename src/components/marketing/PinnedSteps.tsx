import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, ArrowDownLeft } from 'lucide-react';

export const PinnedSteps: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: '01',
      title: 'Add funds without a crypto wallet',
      description:
        'Every account receives a dedicated sub-wallet deposit address. Simply send USDC or deposit via regular checkout. Balances are detected and credited automatically.',
    },
    {
      num: '02',
      title: 'Join fixed-contribution pools',
      description:
        'Choose Daily ($5), Weekly ($25), or Monthly ($100) pools. All participants contribute the exact same fixed amount into an auditable smart contract vault.',
    },
    {
      num: '03',
      title: 'Provable draw & automatic payout',
      description:
        'Winners are derived deterministically using Chainlink VRF oracles. When your number hits, your net payout is routed directly to your saved withdrawal destination.',
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-24 px-6 sm:px-8 max-w-[1200px] mx-auto text-left">
      <div className="mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-3 py-1 rounded-sm">
          Frictionless Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420] mt-3">
          Three steps. Zero crypto vocabulary.
        </h2>
        <p className="text-base text-[#4A5650] max-w-xl mt-2">
          Your members never manage gas tokens, bridge assets, or write down seed phrases. Everything feels like modern banking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Step navigation / selectors */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {steps.map((st, idx) => {
            const stepNum = idx + 1;
            const isActive = activeStep === stepNum;

            return (
              <div
                key={st.num}
                onClick={() => setActiveStep(stepNum)}
                className={`p-6 rounded-md border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FFFFFF] border-[#2C4A3E] shadow-[0_1px_2px_rgba(27,36,32,0.05)]'
                    : 'bg-[#FBF9F5] border-[#DDD8CD] hover:border-[#C7C1B3]'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                      isActive ? 'bg-[#2C4A3E] text-white' : 'bg-[#EDE9E1] text-[#7C867F]'
                    }`}
                  >
                    {st.num}
                  </span>
                  <h3 className="text-lg font-display font-medium text-[#1B2420]">
                    {st.title}
                  </h3>
                </div>
                <p className="text-sm text-[#4A5650] leading-relaxed">
                  {st.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Component Mock Preview */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,36,32,0.05)] min-h-[380px] flex items-center justify-center">
          {activeStep === 1 && (
            <div className="w-full max-w-md flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CD]">
                <span className="text-xs font-semibold text-[#1B2420] uppercase tracking-wider">
                  Sub-Wallet Deposit Address
                </span>
                <span className="text-xs font-mono bg-[#E3EBE6] text-[#2C4A3E] px-2 py-0.5 rounded">
                  Base Network
                </span>
              </div>
              <div className="p-4 bg-[#EDE9E1] rounded-md font-mono text-xs text-[#1B2420] break-all">
                0x7A1fC920aD88B57D84bF1482fBEe6d1959C1c3D9
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#FBF9F5] border border-[#DDD8CD] rounded text-xs text-[#4A5650]">
                <ArrowDownLeft className="w-4 h-4 text-[#3E7D5A] shrink-0" />
                <span>
                  Incoming USDC detected within 1.2 seconds. Automatically credited to your dollar balance.
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#7C867F] pt-2">
                <span>Minimum deposit: $5.00</span>
                <span>Network fee: ≈ $0.002</span>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="w-full max-w-md flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CD]">
                <span className="text-xs font-semibold text-[#1B2420] uppercase tracking-wider">
                  Weekly Pool · Week 41
                </span>
                <span className="text-xs font-mono text-[#7C867F]">Entry #239</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7C867F] block">Fixed Contribution</span>
                  <span className="text-2xl font-display font-medium text-[#1B2420]">$25.00</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#7C867F] block">Guaranteed Pot</span>
                  <span className="text-2xl font-display font-medium text-[#2C4A3E]">$5,975.00</span>
                </div>
              </div>
              <div className="p-3 bg-[#E3EBE6] border border-[#2C4A3E]/20 rounded text-xs text-[#2C4A3E] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2C4A3E] shrink-0" />
                <span>One-tap entry. Draw executes automatically on Sunday 18:00 UTC.</span>
              </div>
              <div className="flex justify-between text-xs text-[#7C867F] pt-2">
                <span>Available balance after: $159.50</span>
                <span>Transparent platform fee: 5%</span>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="w-full max-w-md flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CD]">
                <span className="text-xs font-semibold text-[#1B2420] uppercase tracking-wider">
                  Automated Payout Timeline
                </span>
                <span className="text-xs text-[#3E7D5A] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3E7D5A]" />
                  Settled
                </span>
              </div>
              <div className="p-4 bg-[#F1E7D3] border border-[#B08A4E]/30 rounded-md">
                <span className="text-xs text-[#B08A4E] font-semibold uppercase tracking-wider block">
                  Net Prize Dispatched
                </span>
                <span className="text-2xl font-display font-medium text-[#1B2420]">
                  $5,676.25 USDC
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#4A5650]">
                  <span>Destination:</span>
                  <span className="font-medium text-[#1B2420]">Kraken · USDC (0x9C4d…E21a)</span>
                </div>
                <div className="flex items-center justify-between text-[#4A5650]">
                  <span>Verification:</span>
                  <span className="font-mono text-[#2C4A3E]">Chainlink VRF Block 38,219,842</span>
                </div>
                <div className="flex items-center justify-between text-[#4A5650]">
                  <span>Execution speed:</span>
                  <span>Instant L2 Broadcast</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
