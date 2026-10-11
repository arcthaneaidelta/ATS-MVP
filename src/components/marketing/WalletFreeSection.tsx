import React from 'react';
import { Check } from 'lucide-react';

export const WalletFreeSection: React.FC = () => {
  return (
    <section className="w-full py-24 bg-[#EDE9E1]/60 border-y border-[#DDD8CD] px-6 sm:px-8 text-left">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Statement */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-3 py-1 rounded-sm">
            Consumer Simplicity
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-medium text-[#1B2420] leading-[1.1]">
            “Your members never see a seed phrase.”
          </h2>
          <p className="text-base text-[#4A5650] leading-relaxed">
            Traditional pooling apps fail non-crypto users at step one by demanding wallet extensions, network switching, and gas token management.
          </p>
          <p className="text-base text-[#4A5650] leading-relaxed">
            With Meridian, users authenticate via email or SSO, view balances in plain dollars, and withdraw directly to pre-configured addresses when they win.
          </p>

          <div className="pt-2 space-y-3">
            {[
              'Email & SSO onboarding in two taps',
              'Deterministic per-user sub-wallet deposit sweeping',
              'Sub-cent Base L2 transaction costs absorbed or trivialized',
              'Zero gas tokens required in user account',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-[#1B2420]">
                <div className="w-5 h-5 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Clean App Dashboard Preview Crop (No phone frame) */}
        <div className="lg:col-span-6">
          <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 shadow-[0_6px_20px_rgba(27,36,32,0.08)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CD]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center font-display text-xs">
                  AO
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#1B2420] block">Amara Okafor</span>
                  <span className="text-[11px] text-[#7C867F]">Verified Participant</span>
                </div>
              </div>
              <span className="text-xs font-mono bg-[#E3EBE6] text-[#2C4A3E] px-2 py-0.5 rounded">
                Base L2 Connected
              </span>
            </div>

            <div className="my-6">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#7C867F] block">
                Available Balance
              </span>
              <span className="text-4xl font-display font-medium text-[#1B2420] tabular-nums">
                $184.50
              </span>
              <span className="text-xs text-[#7C867F] block mt-1">
                +$50.00 in active entries · Net Payouts $212.40
              </span>
            </div>

            <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1B2420] block">
                  Weekly Pool · Week 41
                </span>
                <span className="text-xs text-[#7C867F]">
                  Entry #238 · Closes Sun 18:00 UTC
                </span>
              </div>
              <span className="text-xs font-semibold text-[#3E7D5A] bg-[#3E7D5A]/10 px-2.5 py-1 rounded">
                Active in Pool
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
