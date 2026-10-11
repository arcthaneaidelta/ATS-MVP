import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need a crypto wallet to participate?',
      a: 'No. You can sign in with your email or standard SSO. When you create an account, a unique deposit address is assigned to you on Base L2. You never need browser wallet extensions, private keys, or seed phrases.',
    },
    {
      q: 'How is the winner chosen?',
      a: 'Every draw triggers an on-chain call to Chainlink VRF (Verifiable Random Function). The oracle provides an unbiasable, tamper-proof 256-bit random number. The smart contract applies a mathematical modulo over the total number of entries to determine the winner.',
    },
    {
      q: 'Can I independently verify past draws?',
      a: 'Yes. Every draw publishes its block height, VRF request ID, random word, and transaction hash. Anyone can visit our public verifier to review the smart contract proof and recompute the arithmetic without needing to trust Meridian.',
    },
    {
      q: 'Where are funds held during open rounds?',
      a: 'All pool contributions are locked inside auditable OpenZeppelin smart contract vaults on Base. Platform operators do not hold arbitrary control over pooled funds once a round begins.',
    },
    {
      q: 'What does it cost to use Meridian?',
      a: 'Entering a pool costs only the fixed contribution amount (e.g. $5, $25, or $100). When a pool settles, a transparent 5% platform fee is deducted from the gross pot to support security infrastructure and oracle gas fees.',
    },
    {
      q: 'How do payouts and withdrawals work?',
      a: 'When you win a pool, the payout is automatically dispatched to your pre-configured withdrawal destination. You can also manually withdraw your available dollar balance at any time with a sub-cent network fee (≈ $0.002).',
    },
  ];

  return (
    <section className="w-full py-24 px-6 sm:px-8 max-w-[800px] mx-auto text-left">
      <div className="text-center mb-14">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-3 py-1 rounded-sm">
          Frequently Answered
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420] mt-3">
          Questions & Answers
        </h2>
        <p className="text-base text-[#4A5650] mt-2">
          Everything you need to know about custody, fairness, and Base L2 settlement.
        </p>
      </div>

      <div className="divide-y divide-[#DDD8CD] border-y border-[#DDD8CD]">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;

          return (
            <div key={idx} className="py-5">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left gap-4 font-display text-lg text-[#1B2420] hover:text-[#2C4A3E] transition-colors cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#7C867F] transform transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#2C4A3E]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="pt-3 text-sm text-[#4A5650] leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
