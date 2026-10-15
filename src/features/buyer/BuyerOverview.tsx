import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Lock,
  ArrowRight,
  AlertTriangle,
  Clock,
  MessageSquare,
  BookmarkCheck,
  CreditCard,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { mockApi } from '../../server/mockApi';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { MeterBar } from '../../components/MeterBar';
import { Skeleton } from '../../components/Skeleton';
import { Booking, Quote } from '../../data/types';

export const BuyerOverview: React.FC = () => {
  const navigate = useNavigate();
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const buyers = useStore((s) => s.buyers);
  const plans = useStore((s) => s.plans);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);
  const currentPlan = plans.find((p) => p.id === currentBuyer?.planId) || plans[0];
  const isExplorer = currentBuyer?.planId === 'explorer';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([mockApi.getBookings(), mockApi.getQuotes()]).then(([bRes, qRes]) => {
      if (isMounted) {
        if (bRes.body) setBookings(bRes.body);
        if (qRes.body) setQuotes(qRes.body);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeBuyerId]);

  if (!currentBuyer) return null;

  // "Needs your action" calculations:
  // 1. Expiring quotes (<3 days)
  const expiringQuotes = quotes.filter((q) => {
    if (q.status !== 'issued') return false;
    const days = Math.ceil(
      (new Date(q.validityDate).getTime() - new Date('2026-10-15').getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return days >= 0 && days <= 3;
  });

  // 2. Rejected bookings with reconsideration available
  const rejectedAppeals = bookings.filter(
    (b) => b.status === 'rejected' && !b.reconsiderationUsed
  );

  // 3. Payments awaiting proof
  const paymentsNeedingProof = bookings.flatMap((b) =>
    b.paymentLines
      .filter((pl) => pl.status === 'not_paid')
      .map((pl) => ({ booking: b, line: pl }))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Greeting Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-text-muted">
            Agency Portal • 15 Oct 2026
          </span>
          <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-0.5">
            Welcome, {currentBuyer.contactName}
          </h1>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Managing trade operations for{' '}
            <strong className="text-meridian-text-primary">{currentBuyer.name}</strong> ({currentBuyer.country})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/app/requests')}
            icon={<FileText className="w-3.5 h-3.5" />}
          >
            Browse Quotes
          </Button>
          {isExplorer ? (
            <Button
              variant="accent"
              size="sm"
              onClick={() => navigate('/app/subscription')}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Activate Professional
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/app/bookings')}
              icon={<BookmarkCheck className="w-3.5 h-3.5" />}
            >
              View My Bookings
            </Button>
          )}
        </div>
      </div>

      {/* Free Tier Inline Banner (PRD Section 6.2: surface-sunken, not alarming) */}
      {isExplorer && (
        <div className="bg-meridian-surface-sunken border border-meridian-border-strong rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-meridian-surface rounded-full text-meridian-accent shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-meridian-text-primary">
                Direct booking is locked on the Explorer tier
              </p>
              <p className="text-[11px] text-meridian-text-secondary">
                You can browse tours and receive operator quotes. Activate the Professional plan to submit bookings.
              </p>
            </div>
          </div>
          <Button
            variant="accent"
            size="sm"
            onClick={() => navigate('/app/subscription')}
            className="shrink-0"
          >
            Activate Plan
          </Button>
        </div>
      )}

      {/* Three Overview Cards Row (PRD 6.2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Plan and Usage */}
        <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4 shadow-sh-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-semibold text-meridian-text-muted">
                Subscription Plan
              </span>
              <StatusChip kind="plan" status={currentBuyer.planId} />
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-meridian-text-primary">
                {currentPlan.name} Plan
              </h3>
              <p className="text-[11px] text-meridian-text-secondary mt-0.5">
                {isExplorer
                  ? 'Quote-only exploration mode'
                  : `Renews on ${currentBuyer.renewalDate}`}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <MeterBar
                label="Bookings Allowance"
                current={currentBuyer.bookingsThisMonth}
                max={currentPlan.bookingsPerMonth}
                unitSuffix=" bookings"
              />
              <MeterBar
                label="Monthly Value Cap"
                current={currentBuyer.valueThisMonth}
                max={currentPlan.bookingValuePerMonth}
                unitPrefix="$"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-meridian-border">
            <Link
              to="/app/subscription"
              className="text-xs font-semibold text-meridian-primary hover:text-meridian-primary-hover flex items-center justify-between"
            >
              <span>{isExplorer ? 'Upgrade to book' : 'Manage subscription'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: Needs Your Action */}
        <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4 shadow-sh-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-semibold text-meridian-text-muted">
                Action Required
              </span>
              {(expiringQuotes.length > 0 || rejectedAppeals.length > 0 || paymentsNeedingProof.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-meridian-accent animate-ping" />
              )}
            </div>

            <h3 className="font-serif text-xl font-medium text-meridian-text-primary">
              Attention Items
            </h3>

            <div className="space-y-2 text-xs">
              {expiringQuotes.length > 0 && (
                <div
                  onClick={() => navigate('/app/requests')}
                  className="p-2.5 rounded bg-meridian-warning-tint/50 border border-meridian-warning/30 flex items-center justify-between cursor-pointer hover:bg-meridian-warning-tint transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-meridian-warning shrink-0" />
                    <div>
                      <span className="font-semibold text-meridian-text-primary">
                        {expiringQuotes.length} Quote{expiringQuotes.length > 1 ? 's' : ''} Expiring
                      </span>
                      <p className="text-[11px] text-meridian-text-secondary">
                        {expiringQuotes[0].reference} valid for &lt;3 days
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-meridian-warning" />
                </div>
              )}

              {rejectedAppeals.length > 0 && (
                <div
                  onClick={() => navigate(`/app/bookings/${rejectedAppeals[0].id}`)}
                  className="p-2.5 rounded bg-meridian-error-tint/50 border border-meridian-error/30 flex items-center justify-between cursor-pointer hover:bg-meridian-error-tint transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-meridian-error shrink-0" />
                    <div>
                      <span className="font-semibold text-meridian-text-primary">
                        Reconsideration Eligible
                      </span>
                      <p className="text-[11px] text-meridian-text-secondary">
                        {rejectedAppeals[0].reference} was rejected. Submit appeal.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-meridian-error" />
                </div>
              )}

              {paymentsNeedingProof.length > 0 && (
                <div
                  onClick={() => navigate(`/app/bookings/${paymentsNeedingProof[0].booking.id}?tab=payments`)}
                  className="p-2.5 rounded bg-meridian-primary-tint/50 border border-meridian-primary/30 flex items-center justify-between cursor-pointer hover:bg-meridian-primary-tint transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-meridian-primary shrink-0" />
                    <div>
                      <span className="font-semibold text-meridian-text-primary">
                        Payment Proof Required
                      </span>
                      <p className="text-[11px] text-meridian-text-secondary">
                        {paymentsNeedingProof[0].line.supplierName} ($
                        {paymentsNeedingProof[0].line.amount.toLocaleString()})
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-meridian-primary" />
                </div>
              )}

              {expiringQuotes.length === 0 &&
                rejectedAppeals.length === 0 &&
                paymentsNeedingProof.length === 0 && (
                  <p className="text-meridian-text-muted text-[11px] py-4 text-center">
                    All quotes and payments are up to date. No pending actions.
                  </p>
                )}
            </div>
          </div>

          <div className="pt-3 border-t border-meridian-border">
            <Link
              to="/app/requests"
              className="text-xs font-semibold text-meridian-text-secondary hover:text-meridian-text-primary flex items-center justify-between"
            >
              <span>View all active requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: Recent Messages */}
        <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4 shadow-sh-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-semibold text-meridian-text-muted">
                Operator Correspondence
              </span>
              <MessageSquare className="w-4 h-4 text-meridian-primary" />
            </div>

            <h3 className="font-serif text-xl font-medium text-meridian-text-primary">
              Recent Messages
            </h3>

            <div className="space-y-2.5 text-xs">
              {bookings.flatMap((b) => b.messages).slice(0, 2).map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => navigate(`/app/bookings/${msg.bookingId}?tab=messages`)}
                  className="p-2.5 rounded bg-meridian-surface-sunken/60 border border-meridian-border hover:border-meridian-border-strong cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-meridian-text-primary">
                      {msg.senderName}
                    </span>
                    <span className="text-meridian-text-muted">{msg.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-meridian-text-secondary mt-1 line-clamp-2">
                    "{msg.content}"
                  </p>
                </div>
              ))}

              {bookings.flatMap((b) => b.messages).length === 0 && (
                <p className="text-meridian-text-muted text-[11px] py-4 text-center">
                  No correspondence records found.
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-meridian-border">
            <Link
              to="/app/bookings"
              className="text-xs font-semibold text-meridian-text-secondary hover:text-meridian-text-primary flex items-center justify-between"
            >
              <span>Open booking threads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Bookings Table / Cards (PRD 6.2 & 6.5) */}
      <div className="bg-meridian-surface border border-meridian-border rounded-card shadow-sh-1 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-meridian-border flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-medium text-meridian-text-primary">
              My Active Bookings
            </h2>
            <p className="text-xs text-meridian-text-secondary mt-0.5">
              Live status, supplier payment roll-ups, and operator reviews
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/app/bookings')}
          >
            View all ({bookings.length})
          </Button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-meridian-text-muted">
            No bookings on file yet. Browse quotes and submit your first booking.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Tour Itinerary</th>
                  <th className="py-3 px-4">Travellers</th>
                  <th className="py-3 px-4">Total (USD)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Roll-up</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-meridian-border">
                {bookings.map((booking) => {
                  const confirmedLines = booking.paymentLines.filter(
                    (p) => p.status === 'confirmed'
                  ).length;
                  const totalLines = booking.paymentLines.length;

                  return (
                    <tr
                      key={booking.id}
                      onClick={() => navigate(`/app/bookings/${booking.id}`)}
                      className="hover:bg-meridian-surface-sunken cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-meridian-primary">
                        {booking.reference}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-meridian-text-primary">
                        {booking.tourTitle}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {booking.travellersCount} Pax
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-meridian-text-primary">
                        ${booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip kind="booking" status={booking.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {totalLines > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1 w-20 h-1.5">
                              {booking.paymentLines.map((pl, i) => (
                                <div
                                  key={i}
                                  className={`h-full flex-1 rounded-sm ${
                                    pl.status === 'confirmed'
                                      ? 'bg-meridian-success'
                                      : pl.status === 'proof_uploaded'
                                      ? 'bg-meridian-accent'
                                      : 'bg-meridian-surface-sunken border border-meridian-border'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] text-meridian-text-muted font-mono">
                              {confirmedLines}/{totalLines}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-meridian-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-meridian-primary group-hover:text-meridian-primary-hover flex items-center justify-end gap-1">
                          Manage <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
