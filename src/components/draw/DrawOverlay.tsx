import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldCheck, ArrowRight, X, Clock } from 'lucide-react';
import { Draw, Pool } from '../../types';
import { formatCurrency, formatTxHash } from '../../lib/format';
import { Button } from '../ui/Button';

export interface DrawOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pool: Pool;
  drawResult?: Draw | null;
  isDelayed?: boolean;
}

export const DrawOverlay: React.FC<DrawOverlayProps> = ({
  isOpen,
  onClose,
  pool,
  drawResult,
  isDelayed = false,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [displayNumber, setDisplayNumber] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setIsRolling(false);
      return;
    }

    // Step 1: Pool Locked (0s - 1.5s)
    setStep(1);

    // Step 2: Randomness requested (1.5s)
    const t2 = setTimeout(() => {
      setStep(2);
    }, 1500);

    // Step 3: Chainlink VRF responding (3.0s or delayed)
    const delayBonus = isDelayed ? 3500 : 0;
    const t3 = setTimeout(() => {
      setStep(3);
    }, 3000);

    // Step 4: Randomness verified & start roll
    const t4 = setTimeout(() => {
      setStep(4);
      setIsRolling(true);

      const target = drawResult?.winningEntryNumber || 117;
      let rollCount = 0;
      const rollInterval = setInterval(() => {
        rollCount++;
        // Slot-free tabular numeral roll
        setDisplayNumber(Math.floor(Math.random() * pool.currentEntries) + 1);
        if (rollCount > 16) {
          clearInterval(rollInterval);
          setDisplayNumber(target);
          setIsRolling(false);
          setStep(5); // Final settled state
        }
      }, 50);
    }, 4500 + delayBonus);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isOpen, drawResult, isDelayed, pool.currentEntries]);

  if (!isOpen) return null;

  const isUserWinner = drawResult?.isUserWinner ?? false;
  const payout = drawResult?.winnerPayout ?? Number((pool.pot * 0.95).toFixed(2));
  const txHash = drawResult?.txHash || '0x4be17f9814cebf7a1094038a9010e9c4091ac09a';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-[#F5F2EC]/96 backdrop-blur-[2px] transition-all"
    >
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg shadow-[0_20px_48px_rgba(27,36,32,0.14)] p-6 sm:p-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95">
        {/* Close button */}
        {step >= 5 && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-[#7C867F] hover:text-[#1B2420] p-1.5 rounded-md hover:bg-[#EDE9E1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#EDE9E1] text-[#2C4A3E] text-xs font-semibold tracking-wider uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Chainlink VRF Provable Draw</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-medium text-[#1B2420] mb-1">
          {pool.name}
        </h2>
        <p className="text-xs text-[#7C867F] mb-8">
          Total Prize Pot: {formatCurrency(pool.pot)} · {pool.currentEntries} sealed entries
        </p>

        {/* 4-Step Vertical Timeline */}
        <div className="w-full max-w-md flex flex-col gap-4 text-left my-2">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                step >= 1 ? 'bg-[#2C4A3E] text-[#FFFFFF]' : 'bg-[#EDE9E1] text-[#7C867F]'
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className="flex-1 pt-0.5">
              <h4 className="text-sm font-semibold text-[#1B2420]">Pool locked</h4>
              <p className="text-xs text-[#4A5650] mt-0.5">
                {pool.currentEntries} entries cryptographically sealed into smart contract.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                step >= 2 ? 'bg-[#2C4A3E] text-[#FFFFFF]' : 'bg-[#EDE9E1] text-[#7C867F]'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[#1B2420]">Randomness requested</h4>
                {step >= 2 && (
                  <span className="font-mono text-[11px] bg-[#EDE9E1] px-1.5 py-0.5 rounded text-[#2C4A3E]">
                    {formatTxHash(txHash)}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A5650] mt-0.5">
                Dispatched request to Chainlink VRF coordinator contract on Base.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                step >= 3
                  ? step > 3
                    ? 'bg-[#2C4A3E] text-[#FFFFFF]'
                    : 'bg-[#B08A4E] text-[#FFFFFF] animate-pulse'
                  : 'bg-[#EDE9E1] text-[#7C867F]'
              }`}
            >
              {step > 3 ? <Check className="w-4 h-4" /> : '3'}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[#1B2420]">
                  Chainlink VRF fulfillment
                </h4>
                {step === 3 && (
                  <span className="text-[11px] text-[#B7791F] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 animate-spin" />
                    {isDelayed ? 'Waiting for randomness (taking longer than usual)...' : 'Verifying proof...'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4A5650] mt-0.5">
                {step > 3
                  ? 'Cryptographic proof verified on-chain via elliptic curve math.'
                  : 'Awaiting decentralized VRF oracle consensus.'}
              </p>
            </div>
          </div>

          {/* Step 4: Numeral Roll & Selection */}
          <div className="flex items-start gap-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                step >= 4 ? 'bg-[#B08A4E] text-[#FFFFFF]' : 'bg-[#EDE9E1] text-[#7C867F]'
              }`}
            >
              {step >= 5 ? <Check className="w-4 h-4" /> : '4'}
            </div>
            <div className="flex-1 pt-0.5">
              <h4 className="text-sm font-semibold text-[#1B2420]">Winner derived on-chain</h4>
              <p className="text-xs text-[#4A5650] mt-0.5">
                Executing formula: <code className="font-mono text-xs">randomWord % entries</code>
              </p>
            </div>
          </div>
        </div>

        {/* Numeral Roll Reveal Box */}
        {step >= 4 && (
          <div className="w-full my-6 p-6 rounded-md bg-[#FBF9F5] border border-[#DDD8CD] flex flex-col items-center animate-in fade-in">
            <span className="text-xs uppercase tracking-wider text-[#7C867F] font-semibold mb-1">
              Winning Ticket
            </span>
            <div className="relative inline-block my-2">
              <span className="text-5xl font-display font-medium text-[#1B2420] tabular-nums tracking-tight">
                Entry #{displayNumber}
              </span>
              {/* Brass underline draws */}
              <div
                className={`h-1 bg-[#B08A4E] mt-1 transition-all duration-500 rounded-full ${
                  isRolling ? 'w-8 mx-auto opacity-50' : 'w-full opacity-100'
                }`}
              />
            </div>
            {!isRolling && (
              <span className="text-xs text-[#4A5650] mt-1 font-medium">
                Holder: {drawResult?.winnerMaskedName || 'Selected Participant'}
              </span>
            )}
          </div>
        )}

        {/* Outcome Box when Settled */}
        {step >= 5 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-2">
            {isUserWinner ? (
              <div className="p-4 bg-[#F1E7D3] border border-[#B08A4E]/40 rounded-md text-left mb-6">
                <div className="flex items-center gap-2 text-[#B08A4E] font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Congratulations! You won the draw</span>
                </div>
                <p className="text-xs text-[#1B2420] mt-1 font-medium">
                  Net prize of <span className="font-semibold">{formatCurrency(payout)}</span> has been automatically routed to your default saved withdrawal destination.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-[#EDE9E1] border border-[#DDD8CD] rounded-md text-xs text-[#4A5650] text-left mb-6">
                Entry #{drawResult?.winningEntryNumber || 117} selected by on-chain VRF. Your entry was not drawn this round. You can independently verify the cryptographic randomness proof.
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  onClose();
                  if (drawResult?.id) {
                    navigate(`/app/draws/${drawResult.id}`);
                  }
                }}
              >
                <span>Inspect Cryptographic Proof</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
