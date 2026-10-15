import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight,
  Shield,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { mockApi } from '../../server/mockApi';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { MeterBar } from '../../components/MeterBar';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { PlanId } from '../../data/types';

export const SubscriptionPage: React.FC = () => {
  const { addToast } = useToast();
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const buyers = useStore((s) => s.buyers);
  const plans = useStore((s) => s.plans);

  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);
  const currentPlan = plans.find((p) => p.id === currentBuyer?.planId) || plans[0];
  const isExplorer = currentBuyer?.planId === 'explorer';

  // Checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [targetPlanId, setTargetPlanId] = useState<PlanId>('professional');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!currentBuyer) return null;

  const targetPlan = plans.find((p) => p.id === targetPlanId) || plans[1];

  const handleOpenCheckout = (planId: PlanId) => {
    setTargetPlanId(planId);
    setCheckoutStep(1);
    setPaymentError(null);
    setCheckoutModalOpen(true);
  };

  const handleTestCardPrefill = (endsIn0002 = false) => {
    if (endsIn0002) {
      setCardNumber('4000 0000 0000 0002');
    } else {
      setCardNumber('4242 4242 4242 4242');
    }
  };

  const handleCompleteActivation = async () => {
    setProcessing(true);
    setPaymentError(null);

    // Simulated 1.4s checkout delay (PRD 6.1)
    const res = await mockApi.updateBuyerPlan(currentBuyer.id, targetPlanId, cardNumber);
    setProcessing(false);

    if (res.status === 200) {
      setCheckoutModalOpen(false);
      addToast(
        'success',
        `${targetPlan.name} Plan Activated!`,
        'All booking restrictions have dissolved. You can now submit direct bookings.'
      );
    } else {
      setPaymentError(res.error || 'Payment declined by test card network.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-text-muted">
          Agency Account & Allowances
        </span>
        <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-0.5">
          Subscription & Capacity Limits
        </h1>
        <p className="text-xs text-meridian-text-secondary mt-1">
          Review volume quotas, billing cycle schedules, and lift booking restrictions through tier upgrades.
        </p>
      </div>

      {/* Free Tier Callout if on Explorer */}
      {isExplorer && (
        <div className="bg-meridian-surface border-2 border-meridian-accent rounded-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sh-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-meridian-accent-tint text-meridian-accent rounded-full shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-meridian-text-primary">
                Direct Booking is Currently Locked (Explorer Free Tier)
              </h2>
              <p className="text-xs text-meridian-text-secondary mt-0.5">
                Activate Professional tier ($149/mo) to unlock 12 monthly bookings ($60,000 allowance) and lift padlocks immediately.
              </p>
            </div>
          </div>

          <Button
            variant="accent"
            size="md"
            onClick={() => handleOpenCheckout('professional')}
            className="shrink-0"
            icon={<Sparkles className="w-4 h-4" />}
          >
            Activate Professional
          </Button>
        </div>
      )}

      {/* Current Plan Card & Allowances */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Active Tier Summary */}
        <div className="md:col-span-5 bg-meridian-surface border border-meridian-border rounded-card p-6 space-y-5 shadow-sh-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-meridian-text-muted">
                Active Subscription
              </span>
              <StatusChip kind="subscription" status={currentBuyer.subscriptionStatus} />
            </div>

            <div>
              <h2 className="font-serif text-3xl font-medium text-meridian-text-primary">
                {currentPlan.name} Tier
              </h2>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-serif text-2xl font-bold text-meridian-primary">
                  ${currentPlan.pricePerMonth}
                </span>
                <span className="text-xs text-meridian-text-muted">/ month USD</span>
              </div>
            </div>

            <p className="text-xs text-meridian-text-secondary leading-relaxed">
              {currentPlan.notes}
            </p>

            <div className="pt-2 border-t border-meridian-border space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-meridian-text-muted">Renewal Date:</span>
                <span className="font-mono font-medium">{currentBuyer.renewalDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-meridian-text-muted">Registered Seats:</span>
                <span className="font-mono font-medium">{currentBuyer.seatCount} of {currentPlan.seats}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-meridian-border flex gap-2">
            {isExplorer ? (
              <Button
                variant="accent"
                className="w-full"
                onClick={() => handleOpenCheckout('professional')}
              >
                Activate Paid Tier
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  handleOpenCheckout(currentPlan.id === 'professional' ? 'enterprise' : 'professional')
                }
              >
                Change Plan Tier
              </Button>
            )}
          </div>
        </div>

        {/* Right: Live Allowance Meters (PRD 6.1) */}
        <div className="md:col-span-7 bg-meridian-surface border border-meridian-border rounded-card p-6 space-y-6 shadow-sh-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-meridian-border pb-3">
              <h3 className="font-serif text-lg font-medium text-meridian-text-primary">
                Monthly Allowance Consumption
              </h3>
              <span className="text-xs font-mono text-meridian-text-muted">
                Cycle: 01 Oct – 31 Oct 2026
              </span>
            </div>

            <div className="space-y-5">
              <MeterBar
                label="Monthly Booking Volume (Count Limit)"
                current={currentBuyer.bookingsThisMonth}
                max={currentPlan.bookingsPerMonth}
                unitSuffix=" bookings"
              />

              <MeterBar
                label="Monthly Booking Gross Value (USD Cap)"
                current={currentBuyer.valueThisMonth}
                max={currentPlan.bookingValuePerMonth}
                unitPrefix="$"
              />
            </div>

            <div className="p-3.5 bg-meridian-surface-sunken rounded border border-meridian-border text-xs text-meridian-text-secondary space-y-1">
              <p className="font-semibold text-meridian-text-primary">Server Enforcement Rule:</p>
              <p className="leading-relaxed text-[11px]">
                Bookings submitted above your allowance will fail server-side eligibility checks (Rule 04 & 05). Unused quotas do not roll over to subsequent months.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-meridian-border flex items-center justify-between text-xs text-meridian-text-muted">
            <span>Primary contact: {currentBuyer.contactName}</span>
            <span>{currentBuyer.email}</span>
          </div>
        </div>
      </div>

      {/* Invoice History (3 mock rows) */}
      <div className="bg-meridian-surface border border-meridian-border rounded-card p-6 space-y-4 shadow-sh-1">
        <h3 className="font-serif text-lg font-medium text-meridian-text-primary">
          Subscription Invoices
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                <th className="py-2.5 px-4">Invoice #</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4">Amount</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meridian-border">
              <tr className="hover:bg-meridian-surface-sunken/50">
                <td className="py-3 px-4 font-mono font-medium">INV-2026-10</td>
                <td className="py-3 px-4 text-meridian-text-secondary">01 Oct 2026</td>
                <td className="py-3 px-4 text-meridian-text-primary">
                  {currentPlan.name} Monthly Subscription
                </td>
                <td className="py-3 px-4 font-mono font-semibold">
                  ${currentPlan.pricePerMonth}.00
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-meridian-success-tint text-meridian-success font-medium">
                    Paid
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => addToast('info', 'Invoice Download', 'Downloaded PDF receipt for INV-2026-10.')}
                    className="text-meridian-primary hover:underline font-medium"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-meridian-surface-sunken/50">
                <td className="py-3 px-4 font-mono font-medium">INV-2026-09</td>
                <td className="py-3 px-4 text-meridian-text-secondary">01 Sep 2026</td>
                <td className="py-3 px-4 text-meridian-text-primary">
                  {currentPlan.name} Monthly Subscription
                </td>
                <td className="py-3 px-4 font-mono font-semibold">
                  ${currentPlan.pricePerMonth}.00
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-meridian-success-tint text-meridian-success font-medium">
                    Paid
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => addToast('info', 'Invoice Download', 'Downloaded PDF receipt for INV-2026-09.')}
                    className="text-meridian-primary hover:underline font-medium"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-meridian-surface-sunken/50">
                <td className="py-3 px-4 font-mono font-medium">INV-2026-08</td>
                <td className="py-3 px-4 text-meridian-text-secondary">01 Aug 2026</td>
                <td className="py-3 px-4 text-meridian-text-primary">
                  {currentPlan.name} Monthly Subscription
                </td>
                <td className="py-3 px-4 font-mono font-semibold">
                  ${currentPlan.pricePerMonth}.00
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-meridian-success-tint text-meridian-success font-medium">
                    Paid
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => addToast('info', 'Invoice Download', 'Downloaded PDF receipt for INV-2026-08.')}
                    className="text-meridian-primary hover:underline font-medium"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-Step Simulated Checkout Modal (PRD 6.1) */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title={checkoutStep === 1 ? 'Step 1: Plan Tier Summary' : 'Step 2: Payment Details'}
        description={`Activate ${targetPlan.name} Plan for ${currentBuyer.name}`}
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCheckoutModalOpen(false)}
            >
              Cancel
            </Button>
            {checkoutStep === 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCheckoutStep(2)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Proceed to Payment
              </Button>
            ) : (
              <Button
                variant="accent"
                size="sm"
                loading={processing}
                onClick={handleCompleteActivation}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Confirm & Activate (${targetPlan.pricePerMonth}/mo)
              </Button>
            )}
          </div>
        }
      >
        {checkoutStep === 1 ? (
          <div className="space-y-4">
            <div className="p-4 bg-meridian-surface-sunken rounded-card border border-meridian-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-meridian-text-primary">Selected Tier:</span>
                <span className="font-serif text-lg font-bold text-meridian-primary">
                  {targetPlan.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-meridian-text-secondary">Monthly Rate:</span>
                <span className="font-mono font-semibold">${targetPlan.pricePerMonth} USD / month</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-meridian-text-secondary">Booking Allowance:</span>
                <span className="font-medium text-meridian-primary">{targetPlan.bookingsPerMonth} direct bookings</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-meridian-text-secondary">Value Cap:</span>
                <span className="font-medium text-meridian-primary">${targetPlan.bookingValuePerMonth.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="p-3 bg-meridian-primary-tint/40 border border-meridian-primary/20 rounded text-xs text-meridian-primary leading-relaxed">
              Upon successful payment, all booking padlocks across the portal will dissolve automatically.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentError && (
              <div className="p-3 bg-meridian-error-tint border border-meridian-error/30 rounded text-xs text-meridian-error flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-semibold text-meridian-text-primary">Card Number</label>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleTestCardPrefill(false)}
                      className="text-meridian-primary hover:underline"
                    >
                      Prefill Valid Card
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleTestCardPrefill(true)}
                      className="text-meridian-error hover:underline"
                    >
                      Prefill Decline (..0002)
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-meridian-text-primary block mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-meridian-text-primary block mb-1">
                    CVC Code
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input font-mono"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-meridian-text-muted">
              Simulated sandbox checkout. Charges will not be applied to real financial institutions.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
