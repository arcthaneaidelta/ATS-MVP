import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ShieldAlert, Cpu, Eye, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const SecuritySection: React.FC = () => {
  const pillars = [
    {
      icon: <KeyRound className="w-5 h-5 text-[#2C4A3E]" />,
      title: 'KMS / HSM Key Isolation',
      desc: 'Operator keys are locked in FIPS 140-2 Level 3 hardware security modules. Private keys are never exposed in memory or code.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-[#2C4A3E]" />,
      title: 'OpenZeppelin Contracts',
      desc: 'Tested battle-hardened standards including ReentrancyGuard, Pausable emergency switches, and AccessControl.',
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-[#2C4A3E]" />,
      title: 'Anti-Bot & Rate Limits',
      desc: 'Token-bucket rate limiters at the edge prevent automated script sybils and enforce human participation cadences.',
    },
    {
      icon: <Eye className="w-5 h-5 text-[#2C4A3E]" />,
      title: 'Public On-Chain Auditing',
      desc: 'All pool balances, entry timestamps, and winner derivations are publicly auditable on Base L2 block explorers.',
    },
  ];

  return (
    <section className="w-full py-24 px-6 sm:px-8 max-w-[1200px] mx-auto text-left">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2C4A3E] bg-[#E3EBE6] px-3 py-1 rounded-sm">
            Institutional Custody
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420] mt-3">
            Built like a vault. Runs like an app.
          </h2>
          <p className="text-base text-[#4A5650] max-w-xl mt-2">
            Eliminating web3 friction doesn’t mean compromising security. Meridian utilizes defense-in-depth across every layer.
          </p>
        </div>

        <Link to="/trust">
          <Button variant="secondary">
            <span>Read the Trust Center</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            className="p-6 bg-[#FFFFFF] border border-[#DDD8CD] rounded-md shadow-[0_1px_2px_rgba(27,36,32,0.05)] hover:border-[#C7C1B3] transition-colors"
          >
            <div className="w-10 h-10 rounded bg-[#EDE9E1] flex items-center justify-center mb-4">
              {p.icon}
            </div>
            <h3 className="text-base font-semibold text-[#1B2420] mb-2">{p.title}</h3>
            <p className="text-xs text-[#4A5650] leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
