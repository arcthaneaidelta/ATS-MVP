import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { VerifyStepper } from '../components/draw/VerifyStepper';
import { FormulaBox } from '../components/draw/FormulaBox';
import { formatCurrency, formatTxHash } from '../lib/format';
import { ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const DrawDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { draws } = useAppStore();
  const { toast } = useToast();

  const draw = draws.find((d) => d.id === id) || draws[0];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      type: 'success',
      title: 'Link Copied',
      message: 'Draw proof link copied to clipboard.'
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/pools"
          className="text-xs text-[#7C867F] hover:text-[#1B2420] flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to pools</span>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="text-xs text-[#2C4A3E] hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Proof Link</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg p-6 sm:p-8 shadow-[0_1px_2px_rgba(27,36,32,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DDD8CD] gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3E7D5A] bg-[#E3EBE6] px-2.5 py-0.5 rounded">
                Verified Draw Result
              </span>
              <span className="text-xs font-mono text-[#7C867F]">{draw.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420]">
              {draw.poolName}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-[#7C867F] block uppercase tracking-wider font-semibold">
              Winning Ticket
            </span>
            <span className="text-3xl font-display font-medium text-[#B08A4E]">
              Entry #{draw.winningEntryNumber}
            </span>
            <span className="text-xs text-[#4A5650] block mt-0.5">
              Holder: {draw.winnerMaskedName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div>
            <span className="text-xs text-[#7C867F] block">Total Sealed Entries</span>
            <span className="text-lg font-mono font-medium text-[#1B2420]">
              {draw.entriesCount}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#7C867F] block">Net Winner Payout</span>
            <span className="text-lg font-display font-medium text-[#2C4A3E]">
              {formatCurrency(draw.winnerPayout)}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#7C867F] block">Platform Fee (5%)</span>
            <span className="text-lg font-mono text-[#7C867F]">
              {formatCurrency(draw.platformFee)}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#7C867F] block">Base Block</span>
            <span className="text-lg font-mono text-[#1B2420]">
              #{draw.blockNumber.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Breakdown */}
      <VerifyStepper draw={draw} />

      {/* Interactive Modulo Recompute Box */}
      <FormulaBox
        initialRandomWord={draw.randomWord}
        initialEntriesCount={draw.entriesCount}
      />
    </div>
  );
};
