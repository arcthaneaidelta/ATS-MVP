import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Ban,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  AlertTriangle,
  AlertCircle,
  Building,
  Calendar,
  Users,
  Send,
  Lock,
  RotateCcw,
} from 'lucide-react';

import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Booking, Buyer, Quote } from '../../data/types';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { Skeleton } from '../../components/Skeleton';
import { canCompleteBooking } from '../../server/stateMachine';

export const AdminBookingReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const plans = useStore((s) => s.plans);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'decision' | 'messages' | 'payments'>('decision');

  // Modals
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const [completing, setCompleting] = useState(false);

  // Message composer
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    mockApi.getBooking(id).then(async (res) => {
      if (res.body) {
        setBooking(res.body);
        const [bRes, qRes] = await Promise.all([
          mockApi.getBuyer(res.body.buyerId),
          mockApi.getQuote(res.body.quoteId),
        ]);
        if (bRes.body) setBuyer(bRes.body);
        if (qRes.body) setQuote(qRes.body);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center text-xs text-meridian-text-muted">
        Booking not found.
      </div>
    );
  }

  const isReconsideration = booking.status === 'reconsideration_requested';
  const isFinalDecision = isReconsideration;
  const isDecisionState = ['submitted', 'under_review', 'reconsideration_requested'].includes(
    booking.status
  );

  const quoteIsExpired = Boolean(quote && quote.validityDate < '2026-10-15');
  const completionStatus = canCompleteBooking(booking);

  // Canned reasons dropdown (PRD 6.8)
  const cannedReasons = [
    'Certified mountain guide quota exhausted for requested departure.',
    'Lead time less than 14 days for bespoke chalet reservation.',
    'Seasonal tariff change requires refreshed operator quote.',
    'Client accommodation wing closed for scheduled maintenance.',
  ];

  const handleApproveSubmit = async () => {
    setApproving(true);
    const res = await mockApi.approveBooking(booking.id);
    setApproving(false);

    if (res.status === 200 && res.body) {
      setBooking(res.body);
      setApproveModalOpen(false);
      addToast(
        'success',
        'Booking Approved',
        `Generated ${res.body.paymentLines.length} supplier payment lines. Advanced to payment_pending.`
      );
    } else {
      addToast('error', 'Approval Blocked', res.error || 'Failed to approve booking.');
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason || rejectReason.trim().length < 10) return;
    setRejecting(true);
    const res = await mockApi.rejectBooking(booking.id, rejectReason);
    setRejecting(false);

    if (res.status === 200 && res.body) {
      setBooking(res.body);
      setRejectModalOpen(false);
      addToast('info', isFinalDecision ? 'Final Rejection Issued' : 'Booking Rejected', 'Decision dispatched to buyer agency.');
    } else {
      addToast('error', 'Rejection Error', res.error || 'Failed to reject booking.');
    }
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason || cancelReason.trim().length < 5) return;
    setCancelling(true);
    const res = await mockApi.cancelBooking(booking.id, cancelReason);
    setCancelling(false);

    if (res.status === 200 && res.body) {
      setBooking(res.body);
      setCancelModalOpen(false);
      addToast('info', 'Booking Cancelled', 'Booking marked cancelled in operator register.');
    } else {
      addToast('error', 'Cancellation Error', res.error || 'Failed to cancel booking.');
    }
  };

  const handleCompleteSubmit = async () => {
    setCompleting(true);
    const res = await mockApi.completeBooking(booking.id);
    setCompleting(false);

    if (res.status === 200 && res.body) {
      setBooking(res.body);
      addToast('success', 'Booking Completed!', 'All payments confirmed. Tour finalized.');
    } else {
      addToast('error', 'Completion Blocked', res.error || 'Unconfirmed payments remain.');
    }
  };

  const handleOverrideConfirm = async (lineId: string) => {
    const res = await mockApi.confirmPaymentLine(booking.id, lineId, true);
    if (res.status === 200 && res.body) {
      setBooking(res.body);
      addToast('success', 'Admin Override Recorded', 'Supplier payment marked confirmed. Logged in audit trail.');
    } else {
      addToast('error', 'Override Failed', res.error || 'Could not override payment.');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setSendingMessage(true);
    const res = await mockApi.sendMessage(booking.id, messageText.trim());
    setSendingMessage(false);

    if (res.status === 201 && res.body) {
      setBooking(res.body);
      setMessageText('');
    } else {
      addToast('error', 'Error', res.error || 'Could not send message.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/bookings')}
        className="flex items-center gap-1.5 text-xs text-meridian-text-secondary hover:text-meridian-text-primary font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Operations Queue</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meridian-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-medium text-meridian-text-primary">
              Review: {booking.reference}
            </h1>
            <StatusChip kind="booking" status={booking.status} />
          </div>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Buyer: <strong className="text-meridian-text-primary">{booking.buyerName}</strong> • Tour: {booking.tourTitle} • Value: ${booking.totalAmount.toLocaleString()} USD
          </p>
        </div>

        {/* Global Complete Booking CTA (PRD 6.8 & 8.1 Wow Moment 5) */}
        {booking.status !== 'completed' && (
          <Button
            variant="primary"
            size="md"
            loading={completing}
            disabled={!completionStatus.allowed}
            disabledTooltip={
              !completionStatus.allowed
                ? `Blocked: ${completionStatus.pendingLines.length} payment lines not yet confirmed by coordinator`
                : undefined
            }
            onClick={handleCompleteSubmit}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            Mark Booking Completed
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-meridian-border text-xs">
        {[
          { key: 'decision', label: 'Review & Decision' },
          { key: 'messages', label: `Shared Thread (${booking.messages.length})` },
          { key: 'payments', label: `Disbursement Lines (${booking.paymentLines.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === t.key
                ? 'border-meridian-primary text-meridian-primary font-semibold'
                : 'border-transparent text-meridian-text-muted hover:text-meridian-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Two Column Layout (PRD 6.8) */}
      {activeTab === 'decision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Summary & Context */}
          <div className="lg:col-span-7 space-y-6">
            {/* Reconsideration Highlight Block (PRD 6.8 edge case) */}
            {isReconsideration && booking.reconsiderationNote && (
              <div className="p-4 bg-meridian-accent-tint/60 border border-meridian-accent/30 rounded-card space-y-2 animate-in zoom-in-95">
                <span className="text-xs font-mono font-bold uppercase text-meridian-accent flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" /> One-Time Buyer Reconsideration Appeal
                </span>
                <p className="text-xs text-meridian-text-primary italic border-l-2 border-meridian-accent pl-3 py-1 font-serif">
                  "{booking.reconsiderationNote}"
                </p>
                <p className="text-[11px] text-meridian-text-secondary">
                  Buyer has submitted justified adjustments. Reviewing will constitute the <strong>final binding decision</strong>.
                </p>
              </div>
            )}

            {/* Buyer Context & Entitlement Snapshot */}
            {buyer && (
              <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-meridian-border pb-2">
                  <h3 className="font-serif text-base font-medium text-meridian-text-primary">
                    Buyer Standing & Monthly Usage Context
                  </h3>
                  <StatusChip kind="plan" status={buyer.planId} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-meridian-text-muted">Agency Account:</span>
                    <p className="font-semibold text-meridian-text-primary mt-0.5">{buyer.name}</p>
                    <p className="text-[11px] text-meridian-text-muted">{buyer.country}</p>
                  </div>
                  <div>
                    <span className="text-meridian-text-muted">Account Standing:</span>
                    <div className="mt-0.5">
                      <StatusChip kind="subscription" status={buyer.subscriptionStatus} />
                    </div>
                  </div>
                  <div>
                    <span className="text-meridian-text-muted">Bookings Used:</span>
                    <p className="font-mono font-medium text-meridian-text-primary mt-0.5">
                      {buyer.bookingsThisMonth} this cycle
                    </p>
                  </div>
                  <div>
                    <span className="text-meridian-text-muted">Gross Value Used:</span>
                    <p className="font-mono font-medium text-meridian-text-primary mt-0.5">
                      ${buyer.valueThisMonth.toLocaleString()} USD
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reservation & Supplier Line Items */}
            <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4">
              <h3 className="font-serif text-base font-medium text-meridian-text-primary">
                Itinerary & Supplier Disbursement Breakdown
              </h3>
              <div className="space-y-2 text-xs">
                {quote?.supplierLines.map((sl) => (
                  <div
                    key={sl.id}
                    className="p-3 bg-meridian-surface-sunken rounded border border-meridian-border flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-meridian-text-primary">{sl.supplierName}</p>
                      <p className="text-[11px] text-meridian-text-muted">{sl.serviceType}</p>
                    </div>
                    <span className="font-mono font-bold">${sl.amount.toLocaleString()} USD</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Decision Panel (PRD 6.8) */}
          <div className="lg:col-span-5 bg-meridian-surface border border-meridian-border rounded-modal p-6 shadow-sh-2 sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
                {isFinalDecision ? 'Final Operator Decision' : 'Operator Action Panel'}
              </span>
              <h3 className="font-serif text-xl font-medium text-meridian-text-primary mt-0.5">
                Review Decision
              </h3>
              <p className="text-xs text-meridian-text-secondary mt-1">
                Authorizes supplier commitments and schedules disbursements.
              </p>
            </div>

            {/* Expired Quote Edge Case Warning */}
            {quoteIsExpired && isDecisionState && (
              <div className="p-3 bg-meridian-error-tint border border-meridian-error/30 rounded text-xs text-meridian-error space-y-2">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Approval Blocked: Quote Expired</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Quote {quote?.reference} expired on {quote?.validityDate}. Re-evaluating eligibility blocked approval. You can request the buyer refresh the quote.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => {
                    setActiveTab('messages');
                    setMessageText(`Notice: Quote ${quote?.reference} expired on ${quote?.validityDate}. Please refresh the quote in your requests view so we can proceed with approval.`);
                  }}
                >
                  Prefill Refresh Request Message
                </Button>
              </div>
            )}

            {/* Decision Actions */}
            {isDecisionState ? (
              <div className="space-y-3 pt-2">
                <Button
                  variant="accent"
                  className="w-full"
                  disabled={quoteIsExpired}
                  disabledTooltip={quoteIsExpired ? 'Approval is blocked because underlying quote is expired' : undefined}
                  onClick={() => setApproveModalOpen(true)}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {isFinalDecision ? 'Approve Final Appeal' : 'Approve Booking'}
                </Button>

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setRejectModalOpen(true)}
                  icon={<XCircle className="w-4 h-4" />}
                >
                  {isFinalDecision ? 'Issue Final Rejection' : 'Reject with Reason'}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full text-meridian-text-muted hover:text-meridian-error"
                  onClick={() => setCancelModalOpen(true)}
                  icon={<Ban className="w-3.5 h-3.5" />}
                >
                  Cancel Booking
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-meridian-surface-sunken rounded text-xs text-meridian-text-secondary space-y-2">
                <p className="font-semibold text-meridian-text-primary">Decision Concluded</p>
                <p className="text-[11px]">
                  This booking is currently in <strong>{booking.status}</strong> status. Further reviews or cancellations are disabled.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-meridian-surface border border-meridian-border rounded-card shadow-sh-1 overflow-hidden flex flex-col h-[520px]">
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {booking.messages.map((msg) => {
              const isAdmin = msg.senderRole === 'admin';
              return (
                <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-meridian-text-muted">
                    <span className="font-semibold text-meridian-text-primary">{msg.senderName}</span>
                    <span className="font-mono text-[10px] uppercase">[{msg.senderRole}]</span>
                    <span>• {msg.timestamp}</span>
                  </div>
                  <div className={`max-w-md p-3.5 rounded-card text-xs leading-relaxed ${
                    isAdmin
                      ? 'bg-meridian-primary text-white'
                      : 'bg-meridian-surface-sunken border border-meridian-border text-meridian-text-primary'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-meridian-surface-elevated border-t border-meridian-border flex items-center gap-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Send operator response to buyer agency..."
              className="flex-1 text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input focus:ring-1 focus:ring-meridian-primary"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={sendingMessage}
              disabled={!messageText.trim()}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Reply as Admin
            </Button>
          </form>
        </div>
      )}

      {/* Payments Tab with Override (PRD 6.8) */}
      {activeTab === 'payments' && (
        <div className="bg-meridian-surface border border-meridian-border rounded-card shadow-sh-1 overflow-hidden">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Proof File</th>
                <th className="py-3 px-4">Confirmed By</th>
                <th className="py-3 px-4 text-right">Admin Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meridian-border">
              {booking.paymentLines.map((pl) => (
                <tr key={pl.id} className="hover:bg-meridian-surface-sunken/60">
                  <td className="py-3.5 px-4 font-semibold text-meridian-text-primary">
                    {pl.supplierName}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold">
                    ${pl.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusChip kind="payment" status={pl.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    {pl.proofFileName || '—'}
                  </td>
                  <td className="py-3.5 px-4 text-meridian-text-muted text-[11px]">
                    {pl.confirmedBy || 'Unconfirmed'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {pl.status !== 'confirmed' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOverrideConfirm(pl.id)}
                      >
                        Confirm Override (Logged)
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Approve Booking */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Confirm Booking Approval"
        description="Verify financial commitments and supplier disbursement schedule."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              loading={approving}
              onClick={handleApproveSubmit}
            >
              Approve & Generate Payment Lines
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-meridian-text-secondary leading-relaxed">
            Approving booking <strong>{booking.reference}</strong> will confirm{' '}
            <strong>${booking.totalAmount.toLocaleString()} USD</strong> and initialize{' '}
            <strong>{quote?.supplierLines.length} supplier disbursement lines</strong>.
          </p>
          <div className="p-3 bg-meridian-surface-sunken rounded border border-meridian-border">
            <span className="font-semibold text-meridian-text-primary block mb-1">
              Automated Payment Lines to Create:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-meridian-text-secondary">
              {quote?.supplierLines.map((sl) => (
                <li key={sl.id}>
                  {sl.supplierName} — ${sl.amount.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      {/* Modal: Reject Booking (PRD 6.8: min 10 chars, canned reasons) */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={isFinalDecision ? 'Issue Final Rejection' : 'Reject Booking'}
        description="Provide a specific operational reason (10 characters minimum)."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={rejecting}
              disabled={!rejectReason || rejectReason.trim().length < 10}
              onClick={handleRejectSubmit}
            >
              {isFinalDecision ? 'Confirm Final Rejection' : 'Confirm Rejection'}
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-meridian-text-primary block mb-1">
              Insert Canned Operational Reason:
            </label>
            <select
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full text-xs p-2 bg-meridian-surface-sunken border border-meridian-border rounded-input text-meridian-text-primary"
            >
              <option value="">Choose a standard reason template...</option>
              {cannedReasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="font-semibold text-meridian-text-primary">
                Rejection Notice to Buyer (10 chars minimum):
              </label>
              <span className="text-[11px] font-mono text-meridian-text-muted">
                {rejectReason.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Detail reasons such as guide unavailability, hotel capacity, or expired quote rates..."
              className="w-full text-xs p-3 bg-meridian-surface-sunken border border-meridian-border rounded-input"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Cancel Booking */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Admin Cancellation"
        description="Provide justification for administrative cancellation."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCancelModalOpen(false)}>
              Back
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={cancelling}
              disabled={!cancelReason || cancelReason.trim().length < 5}
              onClick={handleCancelSubmit}
            >
              Confirm Cancellation
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <label className="text-xs font-semibold text-meridian-text-primary block">
            Reason for administrative cancellation:
          </label>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="e.g. Agency requested withdrawal by phone..."
            className="w-full text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input"
          />
        </div>
      </Modal>
    </div>
  );
};
