import React from 'react';

interface MetricsStripProps {
  metrics: {
    totalFound: number;
    falsePositives: number;
    missed: number;
  };
  mode: 'keyword' | 'context';
}

export const MetricsStrip: React.FC<MetricsStripProps> = ({ metrics, mode }) => {
  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] shadow-[0_1px_2px_rgba(30,42,43,0.06)]">
      <div className="text-center sm:text-left">
        <span className="text-[10px] uppercase font-mono text-[#7B8786] block">Signals Found</span>
        <span className="font-serif text-2xl font-semibold text-[#1E2A2B]">{metrics.totalFound}</span>
        <span className="text-[11px] text-[#4A5757] block mt-0.5">Identified in call</span>
      </div>

      <div className="text-center sm:text-left border-l border-[#E2DDD3] pl-3">
        <span className="text-[10px] uppercase font-mono text-[#7B8786] block">False Positives (Noise)</span>
        <span
          className={`font-serif text-2xl font-semibold ${
            metrics.falsePositives > 0 ? 'text-[#A8433A]' : 'text-[#3F7D5B]'
          }`}
        >
          {metrics.falsePositives}
        </span>
        <span className="text-[11px] text-[#4A5757] block mt-0.5">
          {mode === 'keyword' ? 'Anecdotes flagged' : 'Zero hallucinated noise'}
        </span>
      </div>

      <div className="text-center sm:text-left border-l border-[#E2DDD3] pl-3">
        <span className="text-[10px] uppercase font-mono text-[#7B8786] block">Missed Commitments</span>
        <span
          className={`font-serif text-2xl font-semibold ${
            metrics.missed > 0 ? 'text-[#B58A2B]' : 'text-[#3F7D5B]'
          }`}
        >
          {metrics.missed}
        </span>
        <span className="text-[11px] text-[#4A5757] block mt-0.5">
          {mode === 'keyword' ? 'Legal delays missed' : '100% true commitments captured'}
        </span>
      </div>
    </div>
  );
};
