import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Compass, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '../ui/Button';

export const GuidedTour: React.FC<{
  onOpenAddFunds: () => void;
}> = ({ onOpenAddFunds }) => {
  const navigate = useNavigate();
  const { isTourOpen, tourStep, setTourStep, closeTour, openTour } = useAppStore();

  const tourStops = [
    {
      step: 1,
      title: 'Welcome to Meridian',
      desc: 'Experience a Web2-feeling custodial pooling platform powered by verifiable Base L2 smart contracts and Chainlink VRF.',
      actionLabel: 'Explore Dashboard',
      action: () => navigate('/app'),
    },
    {
      step: 2,
      title: 'Unique Sub-Wallets',
      desc: 'Users receive unique deposit addresses. Deposits are automatically detected and swept without handling seed phrases.',
      actionLabel: 'Test Deposit Simulation',
      action: onOpenAddFunds,
    },
    {
      step: 3,
      title: 'Fixed-Contribution Pools',
      desc: 'Browse Daily ($5), Weekly ($25), or Monthly ($100) pools with transparent pot balances and real-time countdowns.',
      actionLabel: 'View Pools',
      action: () => navigate('/app/pools'),
    },
    {
      step: 4,
      title: 'Signature Live Draw Flow',
      desc: 'Inspect how rounds resolve through a 4-step VRF sequence and slot-free numeral roll.',
      actionLabel: 'Open Weekly Pool Draw',
      action: () => navigate('/app/pools/pool_w_41'),
    },
    {
      step: 5,
      title: 'Independent Modulo Verifier',
      desc: 'Verify that winner = randomWord % entries using unforgeable cryptographic seeds and native BigInt math.',
      actionLabel: 'Open Verifier',
      action: () => navigate('/verify'),
    },
    {
      step: 6,
      title: 'Trust Center & Anti-Abuse',
      desc: 'Explore the 5-layer architecture diagram (KMS/HSM isolation) and interact with the edge rate-limit simulator.',
      actionLabel: 'Open Trust Center',
      action: () => navigate('/trust'),
    },
  ];

  const current = tourStops[tourStep - 1] || tourStops[0];

  if (!isTourOpen) {
    return (
      <button
        type="button"
        onClick={openTour}
        className="fixed bottom-6 left-6 z-40 bg-[#FFFFFF] border border-[#DDD8CD] hover:border-[#2C4A3E] shadow-[0_6px_20px_rgba(27,36,32,0.08)] rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium text-[#1B2420] transition-transform hover:scale-105 cursor-pointer"
        aria-label="Open guided demo tour"
      >
        <Compass className="w-4 h-4 text-[#2C4A3E]" />
        <span>Guided Demo Tour (6 Stops)</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 w-80 bg-[#FFFFFF] border border-[#2C4A3E] rounded-lg shadow-[0_20px_48px_rgba(27,36,32,0.14)] p-4 text-left animate-in fade-in slide-in-from-bottom-2 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD8CD]/60 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2C4A3E]">
          <Compass className="w-3.5 h-3.5" />
          <span>Stop {tourStep} of 6</span>
        </div>
        <button
          type="button"
          onClick={closeTour}
          className="text-[#7C867F] hover:text-[#1B2420] p-1 rounded hover:bg-[#EDE9E1] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <h4 className="text-sm font-display font-medium text-[#1B2420] mb-1">
        {current.title}
      </h4>
      <p className="text-xs text-[#4A5650] leading-relaxed mb-4">
        {current.desc}
      </p>

      <div className="flex flex-col gap-2">
        <Button
          variant="primary"
          size="sm"
          className="w-full text-xs"
          onClick={current.action}
        >
          {current.actionLabel}
        </Button>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            disabled={tourStep <= 1}
            onClick={() => setTourStep(Math.max(1, tourStep - 1))}
            className="text-xs text-[#7C867F] hover:text-[#1B2420] disabled:opacity-40 flex items-center gap-1 cursor-pointer font-medium"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-[11px] font-mono text-[#7C867F]">
            {tourStep} / 6
          </span>

          <button
            type="button"
            disabled={tourStep >= 6}
            onClick={() => setTourStep(Math.min(6, tourStep + 1))}
            className="text-xs text-[#2C4A3E] hover:underline disabled:opacity-40 flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
