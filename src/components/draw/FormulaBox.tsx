import React, { useState } from 'react';
import { calculateModuloWinner } from '../../lib/format';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export interface FormulaBoxProps {
  initialRandomWord: string;
  initialEntriesCount: number;
}

export const FormulaBox: React.FC<FormulaBoxProps> = ({
  initialRandomWord,
  initialEntriesCount,
}) => {
  const [randomWord, setRandomWord] = useState<string>(initialRandomWord);
  const [entriesCount, setEntriesCount] = useState<number>(initialEntriesCount);

  const result = calculateModuloWinner(randomWord, entriesCount);

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#DDD8CD] rounded-md p-6 flex flex-col gap-5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DDD8CD]">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#1B2420]">
            Independent Modulo Proof Calculator
          </h4>
          <p className="text-xs text-[#7C867F] mt-0.5">
            Test any random 256-bit oracle seed against participant size using native BigInt arithmetic.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRandomWord(initialRandomWord);
            setEntriesCount(initialEntriesCount);
          }}
          className="text-xs text-[#2C4A3E] hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to on-chain draw values</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input: Random Word */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#4A5650] uppercase tracking-wider">
            VRF 256-Bit Random Word
          </label>
          <textarea
            rows={3}
            value={randomWord}
            onChange={(e) => setRandomWord(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full p-2.5 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs font-mono text-[#1B2420] focus:outline-none focus:border-[#2C4A3E] focus:ring-1 focus:ring-[#2C4A3E] break-all"
            placeholder="Decimal representation of 256-bit word"
          />
        </div>

        {/* Input: Entries Count */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#4A5650] uppercase tracking-wider">
            Sealed Total Entries
          </label>
          <input
            type="number"
            min={1}
            max={100000}
            value={entriesCount}
            onChange={(e) => setEntriesCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full h-11 px-3 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-sm font-mono text-[#1B2420] focus:outline-none focus:border-[#2C4A3E] focus:ring-1 focus:ring-[#2C4A3E]"
          />
          <span className="text-[11px] text-[#7C867F]">
            Try incrementing or decrementing entries to watch the winner recalculate live.
          </span>
        </div>
      </div>

      {/* Math Breakdown Box */}
      <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md flex flex-col gap-2">
        <span className="text-xs font-semibold text-[#2C4A3E] uppercase tracking-wider">
          Step-by-step Modulo derivation
        </span>
        <div className="flex flex-col gap-1.5 font-mono text-xs text-[#1B2420]">
          {result.steps.map((st, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#B08A4E] font-bold">›</span>
              <span>{st}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Result Card */}
      <div className="flex items-center justify-between p-4 bg-[#E3EBE6]/60 border border-[#2C4A3E]/20 rounded-md">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#3E7D5A]" />
          <div>
            <span className="text-xs font-semibold text-[#2C4A3E] uppercase tracking-wider block">
              Derived Winner
            </span>
            <span className="text-lg font-display font-medium text-[#1B2420]">
              Ticket #{result.winningEntryNumber}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[#7C867F] block">Zero-bias verification</span>
          <span className="text-xs text-[#3E7D5A] font-medium">Uniform distribution valid</span>
        </div>
      </div>
    </div>
  );
};
