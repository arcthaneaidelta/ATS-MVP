import React, { useState } from 'react';
import { Pool, Entry } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/format';
import { CheckCircle2, AlertCircle, ShieldCheck, Ticket } from 'lucide-react';

export const JoinPoolModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pool: Pool | null;
  onOpenAddFunds: () => void;
}> = ({ isOpen, onClose, pool, onOpenAddFunds }) => {
  const { availableBalance, joinPool } = useAppStore();

  const [acknowledged, setAcknowledged] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEntry, setCreatedEntry] = useState<Entry | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rateLimitCooldown, setRateLimitCooldown] = useState<number | null>(null);

  if (!pool) return null;

  const hasFunds = availableBalance >= pool.entryFee;
  const balanceAfter = Math.max(0, availableBalance - pool.entryFee);

  const handleConfirm = async () => {
    if (!acknowledged || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await joinPool(pool.id);
    setIsSubmitting(false);

    if (result.success && result.entry) {
      setCreatedEntry(result.entry);
    } else if (result.error === 'RATE_LIMITED') {
      setErrorMsg('Slow down. Too many requests. Rate limit active.');
      setRateLimitCooldown(30);
      const timer = setInterval(() => {
        setRateLimitCooldown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (result.error === 'INSUFFICIENT_FUNDS') {
      setErrorMsg('Insufficient dollar balance to join this pool.');
    } else {
      setErrorMsg(result.error || 'Failed to join pool.');
    }
  };

  const handleClose = () => {
    setCreatedEntry(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdEntry ? 'Entry Sealed' : `Join ${pool.name}`}
      description={
        createdEntry
          ? 'Your entry ticket has been locked into the Base L2 smart contract.'
          : 'Contribute fixed amount into this provably fair prize pool.'
      }
    >
      <div className="flex flex-col gap-5 text-left">
        {createdEntry ? (
          /* Success Ticket State */
          <div className="flex flex-col gap-4 animate-in fade-in">
            <div className="p-5 bg-[#FBF9F5] border-2 border-[#2C4A3E] rounded-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CD]">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#2C4A3E]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1B2420]">
                    Verified Entry Ticket
                  </span>
                </div>
                <span className="text-xs font-mono bg-[#E3EBE6] text-[#2C4A3E] px-2 py-0.5 rounded font-medium">
                  {pool.cadence.toUpperCase()}
                </span>
              </div>

              <div className="my-4 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#7C867F] block uppercase tracking-wider font-semibold">
                    Ticket Number
                  </span>
                  <span className="text-3xl font-display font-medium text-[#1B2420]">
                    #{createdEntry.entryNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#7C867F] block uppercase tracking-wider font-semibold">
                    Contribution
                  </span>
                  <span className="text-lg font-mono font-medium text-[#2C4A3E]">
                    {formatCurrency(createdEntry.fee)}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#7C867F] flex items-center justify-between pt-2 border-t border-[#DDD8CD]/60">
                <span>Entry ID: {createdEntry.id}</span>
                <span className="flex items-center gap-1 text-[#3E7D5A]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Sealed On-Chain
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#E3EBE6] rounded text-xs text-[#2C4A3E] leading-relaxed flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Winner will be derived via Chainlink VRF on countdown close. If selected, net payout routes automatically.
              </span>
            </div>

            <Button variant="primary" onClick={handleClose} className="w-full mt-2">
              Done
            </Button>
          </div>
        ) : (
          /* Join Form State */
          <div className="flex flex-col gap-4">
            {/* Price & Balance breakdown */}
            <div className="p-4 bg-[#FBF9F5] border border-[#DDD8CD] rounded-md space-y-2 text-xs">
              <div className="flex justify-between text-[#4A5650]">
                <span>Fixed Entry Contribution</span>
                <span className="font-mono text-[#1B2420] font-semibold">
                  {formatCurrency(pool.entryFee)}
                </span>
              </div>
              <div className="flex justify-between text-[#4A5650]">
                <span>Current Available Balance</span>
                <span className="font-mono text-[#1B2420]">
                  {formatCurrency(availableBalance)}
                </span>
              </div>
              <div className="flex justify-between text-[#4A5650] pt-2 border-t border-[#DDD8CD]">
                <span>Balance After Entry</span>
                <span className={`font-mono font-semibold ${hasFunds ? 'text-[#2C4A3E]' : 'text-[#A8453A]'}`}>
                  {formatCurrency(balanceAfter)}
                </span>
              </div>
            </div>

            {/* Platform Fee Disclosure */}
            <div className="p-3 bg-[#EDE9E1] rounded text-[11px] text-[#4A5650] flex items-center justify-between">
              <span>Transparent platform fee: 5% of gross pot upon draw</span>
              <span className="font-mono text-[#7C867F]">No hidden costs</span>
            </div>

            {/* Insufficient Funds Warning */}
            {!hasFunds && (
              <div className="p-3.5 bg-[#A8453A]/10 border border-[#A8453A]/20 rounded-md flex items-center justify-between text-xs text-[#A8453A]">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You need {formatCurrency(pool.entryFee - availableBalance)} more</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAddFunds();
                  }}
                  className="font-semibold underline cursor-pointer hover:text-[#742F28]"
                >
                  Add funds now →
                </button>
              </div>
            )}

            {/* Error or Rate limit banner */}
            {errorMsg && (
              <div className="p-3 bg-[#A8453A]/10 border border-[#A8453A]/30 rounded text-xs text-[#A8453A] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{errorMsg}</span>
                  {rateLimitCooldown !== null && (
                    <span className="text-[11px] mt-0.5 block">
                      Anti-spam cooldown active: Retry in {rateLimitCooldown}s
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-[#4A5650] cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-0.5 rounded border-[#DDD8CD] text-[#2C4A3E] focus:ring-[#2C4A3E]"
              />
              <span>
                I understand that draws are final and determined solely by decentralized Chainlink VRF on Base L2.
              </span>
            </label>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                className="flex-1"
                disabled={!hasFunds || !acknowledged || isSubmitting || rateLimitCooldown !== null}
                isLoading={isSubmitting}
                onClick={handleConfirm}
              >
                Confirm Entry ({formatCurrency(pool.entryFee)})
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
