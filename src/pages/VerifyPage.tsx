import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { VerifyStepper } from '../components/draw/VerifyStepper';
import { FormulaBox } from '../components/draw/FormulaBox';
import { formatCurrency } from '../lib/format';
import { ShieldCheck, Search } from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const { drawId } = useParams<{ drawId?: string }>();
  const navigate = useNavigate();
  const { draws } = useAppStore();

  const selectedDraw =
    (drawId && draws.find((d) => d.id === drawId)) ||
    draws[0];

  const [activeDrawId, setActiveDrawId] = useState(selectedDraw.id);

  const handleSelect = (id: string) => {
    setActiveDrawId(id);
    navigate(`/verify/${id}`);
  };

  const draw = draws.find((d) => d.id === activeDrawId) || selectedDraw;

  return (
    <div className="py-12 px-6 sm:px-8 max-w-[1200px] mx-auto flex flex-col gap-8 text-left">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#E3EBE6] text-[#2C4A3E] text-xs font-semibold tracking-wider uppercase mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Independent Cryptographic Auditing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-medium text-[#1B2420]">
          Public Draw Verifier
        </h1>
        <p className="text-sm text-[#4A5650] max-w-2xl mt-1">
          Anyone can independently verify that draw outcomes are mathematically determined by unbiasable Chainlink VRF oracle randomness without trusting Meridian.
        </p>
      </div>

      {/* Draw Selector Toolbar */}
      <div className="p-4 bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#7C867F]">
          Select Draw to Audit:
        </label>
        <select
          value={activeDrawId}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full sm:w-auto h-10 px-3 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs font-mono text-[#1B2420] focus:outline-none focus:border-[#2C4A3E] cursor-pointer"
        >
          {draws.map((d) => (
            <option key={d.id} value={d.id}>
              {d.poolName} ({d.id}) — Winner Ticket #{d.winningEntryNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Banner */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD8CD] gap-2">
          <div>
            <h2 className="text-2xl font-display font-medium text-[#1B2420]">
              {draw.poolName}
            </h2>
            <span className="text-xs font-mono text-[#7C867F]">Draw ID: {draw.id}</span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-[#7C867F] block uppercase tracking-wider font-semibold">
              Winning Ticket
            </span>
            <span className="text-3xl font-display font-medium text-[#B08A4E]">
              Entry #{draw.winningEntryNumber}
            </span>
            <span className="text-xs text-[#4A5650] block mt-0.5">
              Net Prize: {formatCurrency(draw.winnerPayout)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-[#7C867F] block">Total Participants</span>
            <span className="font-mono text-sm font-medium text-[#1B2420]">
              {draw.entriesCount}
            </span>
          </div>
          <div>
            <span className="text-[#7C867F] block">Settlement Layer</span>
            <span className="font-mono text-sm font-medium text-[#2C4A3E]">
              Base L2
            </span>
          </div>
          <div>
            <span className="text-[#7C867F] block">Randomness Protocol</span>
            <span className="font-mono text-sm font-medium text-[#1B2420]">
              Chainlink VRF v2.5
            </span>
          </div>
          <div>
            <span className="text-[#7C867F] block">Block Height</span>
            <span className="font-mono text-sm font-medium text-[#1B2420]">
              #{draw.blockNumber.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* The 4-Phase Stepper */}
      <VerifyStepper draw={draw} />

      {/* Interactive Modulo Recompute Box */}
      <FormulaBox
        initialRandomWord={draw.randomWord}
        initialEntriesCount={draw.entriesCount}
      />
    </div>
  );
};
