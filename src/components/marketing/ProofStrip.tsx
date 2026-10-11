import React from 'react';

export const ProofStrip: React.FC = () => {
  const stats = [
    { value: '$2.4M', label: 'Total Contributed' },
    { value: '18,420', label: 'Draws Verified on Base' },
    { value: '≈ $0.002', label: 'Average Network Fee' },
    { value: '0', label: 'Crypto Wallets Required' },
  ];

  return (
    <section className="w-full border-y border-[#DDD8CD] bg-[#FBF9F5] py-12 px-6 sm:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#DDD8CD]">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                idx > 0 ? 'sm:pl-8 pt-6 sm:pt-0' : ''
              }`}
            >
              <span className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420] tabular-nums tracking-tight">
                {s.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7C867F] mt-1.5">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-mono text-[#7C867F] text-center mt-8">
          * Figures demonstrate platform capacity and simulated testnet economics.
        </p>
      </div>
    </section>
  );
};
