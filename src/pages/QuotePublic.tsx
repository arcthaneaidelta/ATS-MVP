import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '../store/useDemoStore';
import { formatCurrency, formatDate } from '../lib/format';
import { Button } from '../components/ui/Button';
import { StatusChip } from '../components/ui/StatusChip';
import { PaymentSheet } from '../components/booking/PaymentSheet';
import { useToast } from '../components/ui/Toast';
import { 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuotePublic: React.FC = () => {
  const { ref } = useParams<{ ref: string }>();
  const { quotations, vehicles, updateQuotation } = useDemoStore();
  const { toast } = useToast();

  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);

  const quote = quotations.find((q) => q.reference === ref) || quotations[0];
  const vehicle = vehicles.find((v) => quote?.vehiclePreference.includes(v.id)) || vehicles[0];

  if (!quote) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-md mx-auto text-center space-y-4">
        <h2 className="font-serif text-2xl font-normal text-ink">Quotation Not Found</h2>
        <Link to="/quote"><Button variant="primary">Request a New Quote</Button></Link>
      </div>
    );
  }

  const depositAmount = quote.bookingDepositAmount || Math.round((quote.quotedAmount || 10000) * 0.2);

  const handleDepositSuccess = () => {
    setPaymentSheetOpen(false);
    updateQuotation(quote.id, {
      status: 'deposit_paid',
    });
    try {
      confetti({ particleCount: 70, spread: 55, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    toast({
      type: 'success',
      title: 'Booking Deposit Paid',
      message: `${formatCurrency(depositAmount)} verified via simulated DPO. Status updated.`,
    });
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-3xl mx-auto text-left">
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Customer Quotation Proposal
          </span>
          <StatusChip
            label={quote.status.replace('_', ' ').toUpperCase()}
            variant={
              quote.status === 'confirmed'
                ? 'success'
                : quote.status === 'deposit_paid'
                ? 'info'
                : quote.status === 'quoted'
                ? 'warning'
                : 'neutral'
            }
          />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink">
          Quotation {quote.reference}
        </h1>
        <p className="text-xs sm:text-sm text-ink-2">
          Prepared for <strong>{quote.customerName}</strong> ({quote.customerEmail})
        </p>
      </div>

      <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-1 space-y-6">
        {/* Status Explanation Banner */}
        {quote.status === 'new' || quote.status === 'in_review' ? (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-medium text-amber-950 mb-0.5">
                Quotation Under Review
              </strong>
              Our fleet scheduling team is reviewing your requested dates ({formatDate(quote.startDate)} to {formatDate(quote.endDate)}). You will receive an email once rates and deposit requirements are issued.
            </div>
          </div>
        ) : quote.status === 'deposit_paid' ? (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-medium text-emerald-950 mb-0.5">
                Booking Deposit Paid ({formatCurrency(depositAmount)})
              </strong>
              Your 20% booking deposit is verified. Our admin operator will complete the final handover booking registration shortly.
            </div>
          </div>
        ) : quote.status === 'confirmed' ? (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-medium text-emerald-950 mb-0.5">
                Confirmed Safari Reservation
              </strong>
              Your quotation has been formally converted into a confirmed fleet booking.
            </div>
          </div>
        ) : null}

        {/* Vehicle & Trip Specs */}
        <div className="p-4 bg-surface-elevated rounded-lg border border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={vehicle.images[0]}
              alt={vehicle.name}
              className="w-16 h-12 rounded object-cover border border-border shrink-0"
            />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                {vehicle.type}
              </span>
              <h3 className="font-serif text-lg font-semibold text-ink">
                {vehicle.name}
              </h3>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-medium text-ink">
              {formatDate(quote.startDate)} – {formatDate(quote.endDate)}
            </div>
            <div className="text-[11px] text-ink-3">
              Route: {quote.pickupLocation}
            </div>
          </div>
        </div>

        {/* Itemised line items (if quoted) */}
        {quote.quotedAmount && (
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-ink-3">
              Itemised Rental Breakdown
            </h4>

            <div className="border border-border rounded-lg overflow-hidden divide-y divide-border text-xs">
              {quote.lineItems && quote.lineItems.length > 0 ? (
                quote.lineItems.map((li) => (
                  <div key={li.id} className="p-3 flex justify-between items-center bg-surface">
                    <span className="text-ink">{li.description}</span>
                    <span className="font-serif font-semibold text-primary tabular-nums">
                      {formatCurrency(li.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 flex justify-between items-center bg-surface">
                  <span className="text-ink">Vehicle Rental Package & Standard Cover</span>
                  <span className="font-serif font-semibold text-primary tabular-nums">
                    {formatCurrency(quote.quotedAmount)}
                  </span>
                </div>
              )}

              {quote.discountAmount && quote.discountAmount > 0 && (
                <div className="p-3 flex justify-between items-center bg-success-soft/60 text-success font-medium">
                  <span>Special Discount ({quote.discountNote || 'Promotional Tier'})</span>
                  <span className="tabular-nums">- {formatCurrency(quote.discountAmount)}</span>
                </div>
              )}
            </div>

            {/* Total Due & Deposit Schedule */}
            <div className="p-4 bg-sand-soft/50 rounded-lg border border-border space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-ink-2">Total Estimated Quotation:</span>
                <span className="font-serif text-xl font-bold text-primary tabular-nums">
                  {formatCurrency(quote.quotedAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <div>
                  <span className="font-semibold text-ink">Deposit to Secure Vehicle (Charged Today):</span>
                  <span className="text-[11px] text-ink-3 block">Remaining balance due prior to pick-up</span>
                </div>
                <span className="font-serif text-lg font-bold text-accent tabular-nums">
                  {formatCurrency(depositAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Payment CTA for Quoted state */}
        {quote.status === 'quoted' && (
          <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-ink-3">
              Valid until: {quote.validUntil ? formatDate(quote.validUntil) : 'Next 7 days'}
            </span>

            <Button
              variant="accent"
              size="lg"
              onClick={() => setPaymentSheetOpen(true)}
              icon={<CreditCard className="w-4 h-4" />}
            >
              Pay Booking Deposit ({formatCurrency(depositAmount)})
            </Button>
          </div>
        )}
      </div>

      {/* Simulated Payment Sheet Modal for Booking Deposit */}
      <PaymentSheet
        isOpen={paymentSheetOpen}
        onClose={() => setPaymentSheetOpen(false)}
        totalAmount={depositAmount}
        vehicleName={`${vehicle.name} (Deposit)`}
        onSuccess={handleDepositSuccess}
        onDeclined={() => toast({ type: 'warning', title: 'Payment Declined' })}
        onConflict={() => toast({ type: 'error', title: 'Conflict Detected' })}
      />
    </div>
  );
};
