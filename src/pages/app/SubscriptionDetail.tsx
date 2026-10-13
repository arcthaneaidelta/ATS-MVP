import React, { useState } from 'react';
import { ArrowLeft, Check, Calendar, CreditCard } from 'lucide-react';
import { MerchantTile } from '@/components/app/MerchantTile';
import { CostStrip } from '@/components/app/CostStrip';
import { EvidenceTimeline } from '@/components/app/EvidenceTimeline';
import { CancelSheet } from '@/components/app/CancelSheet';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { formatMoney, cycleLong } from '@/lib/money';
import { fmtDayYear, fmtMonthYear } from '@/lib/dates';
import type { Subscription } from '@/data/types';
import { getWorthALookReason } from '@/components/app/WorthALookRow';

export interface SubscriptionDetailProps {
  subscription: Subscription;
  onBack: () => void;
  onShowToast: (msg: string, actionLabel?: string, onAction?: () => void) => void;
}

export function SubscriptionDetail({
  subscription,
  onBack,
  onShowToast,
}: SubscriptionDetailProps) {
  const [isCancelSheetOpen, setIsCancelSheetOpen] = useState(false);
  const keepSubscription = useAppStore((state) => state.keepSubscription);
  const snoozeSubscription = useAppStore((state) => state.snoozeSubscription);
  const cancelSubscription = useAppStore((state) => state.cancelSubscription);
  const undoCancel = useAppStore((state) => state.undoCancel);

  const isCancelled = subscription.status === 'cancelled';
  const reason = getWorthALookReason(subscription);
  const hasPriceChange = subscription.flag?.kind === 'price-rise';

  const handleKeep = () => {
    keepSubscription(subscription.id);
    onShowToast('Marked as keep');
    onBack();
  };

  const handleReviewLater = () => {
    snoozeSubscription(subscription.id);
    onShowToast('Review snoozed for 30 days');
    onBack();
  };

  const handleConfirmCancel = () => {
    setIsCancelSheetOpen(false);
    cancelSubscription(subscription.id);
    onShowToast('Marked as cancelled', 'Undo', () => undoCancel());
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar bg-bg p-5 pb-16">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to subscriptions"
          className="w-8 h-8 rounded-full flex items-center justify-center text-ink-2 hover:bg-surface-2 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-ink-3">Subscription detail</span>
      </div>

      {/* Hero: Large Monogram & Amount */}
      <div className="flex flex-col items-center text-center my-2">
        <MerchantTile name={subscription.name} size="lg" className="mb-3 shadow-1" />
        <h2 className="text-xl font-display font-medium text-ink">{subscription.name}</h2>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-3xl font-display font-normal text-ink tnum">
            {formatMoney(subscription.amount)}
          </span>
          <span className="text-xs text-ink-2 font-medium">
            {cycleLong(subscription.cycle)}
          </span>
        </div>
      </div>

      {/* Cost Over Time Strip */}
      <div className="my-4">
        <CostStrip subscription={subscription} />
      </div>

      {/* Why It's Here Card (Evidence) */}
      {subscription.flag && (
        <div className="card p-4 bg-surface mb-3 border-accent/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
              Why it&apos;s worth a look
            </h4>
          </div>
          <p className="text-xs text-ink-2 font-medium mb-3">{reason}</p>

          <div className="pt-2 border-t border-line/60">
            <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-1">
              Payment evidence
            </p>
            <EvidenceTimeline
              history={subscription.history}
              hasPriceChange={hasPriceChange}
            />
          </div>
        </div>
      )}

      {/* Details Box */}
      <div className="card p-4 bg-surface mb-5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-ink-3 flex items-center gap-1.5">
            <Calendar size={13} />
            <span>Next charge</span>
          </span>
          <span className="font-semibold text-ink">{fmtDayYear(subscription.nextCharge)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-ink-3">First seen</span>
          <span className="font-semibold text-ink">{fmtMonthYear(subscription.firstSeen)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-ink-3 flex items-center gap-1.5">
            <CreditCard size={13} />
            <span>Payment method</span>
          </span>
          <span className="font-semibold text-ink font-mono text-[11px]">
            {subscription.paymentMethod}
          </span>
        </div>
      </div>

      {/* Action Buttons (Max 3) */}
      <div className="mt-auto space-y-2 pt-2">
        {!isCancelled ? (
          <>
            <Button
              variant="primary"
              fullWidth
              leftIcon={<Check size={16} />}
              onClick={handleKeep}
            >
              Keep
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                fullWidth
                onClick={handleReviewLater}
              >
                Review later
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={() => setIsCancelSheetOpen(true)}
              >
                Cancel…
              </Button>
            </div>
          </>
        ) : (
          <div className="p-3 bg-surface-2 text-center rounded-md text-xs text-ink-3">
            This subscription is marked as cancelled.
          </div>
        )}
      </div>

      {/* Cancel Confirmation Sheet */}
      <CancelSheet
        subscription={subscription}
        isOpen={isCancelSheetOpen}
        onClose={() => setIsCancelSheetOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
