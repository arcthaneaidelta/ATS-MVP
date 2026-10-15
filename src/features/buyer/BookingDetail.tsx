import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  History,
  RotateCcw,
  Ban,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Building,
} from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Booking, PaymentLine } from '../../data/types';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { Modal } from '../../components/Modal';
import { FileDropzone } from '../../components/FileDropzone';
import { useToast } from '../../components/Toast';
import { Skeleton } from '../../components/Skeleton';

export const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const activeBuyerId = useStore((s) => s.activeBuyerId);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'payments' | 'history'>('overview');

  // Reconsideration modal state (PRD 6.5: strictly once per booking)
  const [reconsiderModalOpen, setReconsiderModalOpen] = useState(false);
  const [reconsiderNote, setReconsiderNote] = useState('');
  const [submittingReconsider, setSubmittingReconsider] = useState(false);

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Payment proof upload modal
  const [uploadLine, setUploadLine] = useState<PaymentLine | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  // Message composer
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'messages', 'payments', 'history'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    mockApi.getBooking(id).then((res) => {
      if (res.body) setBooking(res.body);
      setLoading(false);
    });
  }, [id, activeBuyerId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8 text-center text-xs text-meridian-text-muted">
        Booking not found or access denied for this agency.
      </div>
    );
  }

  // Payment roll-up calculations
  const totalAmount = booking.totalAmount;
  const confirmedAmount = booking.paymentLines
    .filter((pl) => pl.status === 'confirmed')
    .reduce((sum, pl) => sum + pl.amount, 0);
  const confirmedCount = booking.paymentLines.filter((pl) => pl.status === 'confirmed').length;
  const totalLinesCount = booking.paymentLines.length;

  const handleReconsiderSubmit = async () => {
    if (!reconsiderNote || reconsiderNote.trim().length < 10) return;
    setSubmittingReconsider(true);
    const res = await mockApi.requestReconsideration(booking.id, reconsiderNote);
    setSubmittingReconsider(false);

    if (res.status === 200 && res.body) {
      setBooking(res.body);
      setReconsiderModalOpen(false);
      addToast('success', 'Appeal Submitted', 'Your one-time reconsideration has been delivered to the admin desk.');
    } else {
      addToast('error', 'Reconsideration Error', res.error || 'Failed to submit reconsideration.');
    }
  };

  const handleCancelSubmit = async () => {
    setCancelling(true);
    const res = await mockApi.cancelBooking(booking.id, cancelReason);
    setCancelling(false);

    if (res.status === 200 && res.body) {
      setBooking(res.body);
      setCancelModalOpen(false);
      addToast('info', 'Booking Cancelled', 'Booking was cancelled pre-approval.');
    } else {
      addToast('error', 'Cancellation Failed', res.error || 'Cannot cancel booking.');
    }
  };

  const handleProofUploaded = async (file: File) => {
    if (!uploadLine) return;
    setUploadingProof(true);
    const res = await mockApi.uploadPaymentProof(booking.id, uploadLine.id, file.name);
    setUploadingProof(false);

    if (res.status === 200 && res.body) {
      setBooking(res.body);
      setUploadLine(null);
      addToast('success', 'Proof Uploaded', `Receipt for ${uploadLine.supplierName} recorded. Routed to coordinator.`);
    } else {
      addToast('error', 'Upload Error', res.error || 'Failed to register proof.');
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
      addToast('error', 'Message Error', res.error || 'Could not send message.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Back button */}
      <button
        onClick={() => navigate('/app/bookings')}
        className="flex items-center gap-1.5 text-xs text-meridian-text-secondary hover:text-meridian-text-primary font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Bookings</span>
      </button>

      {/* Header Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-meridian-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-medium text-meridian-text-primary">
              {booking.reference}
            </h1>
            <StatusChip kind="booking" status={booking.status} />
          </div>
          <p className="text-xs text-meridian-text-secondary mt-1">
            {booking.tourTitle} • Created {booking.createdAt}
          </p>
        </div>

        {/* Dynamic Actions by State */}
        <div className="flex items-center gap-2">
          {/* Reconsideration action for rejected bookings */}
          {booking.status === 'rejected' && (
            booking.reconsiderationUsed ? (
              <span className="text-xs font-mono text-meridian-text-muted px-3 py-1.5 bg-meridian-surface-sunken border border-meridian-border rounded">
                Reconsideration used
              </span>
            ) : (
              <Button
                variant="accent"
                size="sm"
                onClick={() => setReconsiderModalOpen(true)}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Request Reconsideration
              </Button>
            )
          )}

          {/* Cancellation pre-approval */}
          {['submitted', 'under_review'].includes(booking.status) && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              icon={<Ban className="w-3.5 h-3.5" />}
            >
              Cancel Booking
            </Button>
          )}

          {/* Quick upload proof button if in payment stage */}
          {['payment_pending', 'partially_paid'].includes(booking.status) && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab('payments')}
              icon={<Upload className="w-3.5 h-3.5" />}
            >
              Upload Proof
            </Button>
          )}
        </div>
      </div>

      {/* Rejected Quoted Reason Box (PRD 6.5) */}
      {(booking.status === 'rejected' || booking.status === 'rejected_final') && booking.rejectionReason && (
        <div className="p-4 bg-meridian-error-tint/50 border border-meridian-error/30 rounded-card space-y-2">
          <div className="flex items-center justify-between text-xs text-meridian-error font-semibold">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Operator Rejection Notice
            </span>
            <span className="text-[11px] font-mono">Enforced Decision</span>
          </div>
          <blockquote className="text-xs text-meridian-text-primary italic border-l-2 border-meridian-error pl-3 py-0.5">
            "{booking.rejectionReason}"
          </blockquote>
          {booking.status === 'rejected' && !booking.reconsiderationUsed && (
            <p className="text-[11px] text-meridian-text-secondary pt-1">
              You are entitled to <strong>one appeal</strong>. Provide alternative dates or supplier allotments to request review.
            </p>
          )}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-meridian-border text-xs">
        {[
          { key: 'overview', label: 'Overview' },
          {
            key: 'messages',
            label: `Messages (${booking.messages.length})`,
          },
          {
            key: 'payments',
            label: `Supplier Payments (${confirmedCount}/${totalLinesCount})`,
          },
          { key: 'history', label: 'Audit History' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-3 px-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === t.key
                ? 'border-meridian-primary text-meridian-primary font-semibold'
                : 'border-transparent text-meridian-text-muted hover:text-meridian-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 space-y-4 bg-meridian-surface border border-meridian-border rounded-card p-5">
            <h3 className="font-serif text-base font-medium text-meridian-text-primary">
              Reservation Parameters
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-meridian-text-muted">Itinerary:</span>
                <p className="font-semibold text-meridian-text-primary mt-0.5">
                  {booking.tourTitle}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-meridian-text-muted">Dates:</span>
                  <p className="font-medium text-meridian-text-primary mt-0.5">
                    {booking.travelDates}
                  </p>
                </div>
                <div>
                  <span className="text-meridian-text-muted">Travellers:</span>
                  <p className="font-medium text-meridian-text-primary mt-0.5">
                    {booking.travellersCount} Guests
                  </p>
                </div>
              </div>
              <div>
                <span className="text-meridian-text-muted">Gross Booking Value:</span>
                <p className="font-serif text-xl font-bold text-meridian-primary mt-0.5">
                  ${booking.totalAmount.toLocaleString()} USD
                </p>
              </div>
              {booking.notes && (
                <div>
                  <span className="text-meridian-text-muted">Booking Notes:</span>
                  <p className="p-2.5 bg-meridian-surface-sunken rounded border border-meridian-border text-meridian-text-secondary mt-1">
                    "{booking.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-6 space-y-4 bg-meridian-surface border border-meridian-border rounded-card p-5">
            <h3 className="font-serif text-base font-medium text-meridian-text-primary">
              Payment Settlement Status
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-meridian-border">
                <span className="text-meridian-text-secondary">Reconciled Amount:</span>
                <span className="font-mono font-bold text-meridian-text-primary">
                  ${confirmedAmount.toLocaleString()} / ${totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-meridian-text-secondary">Confirmed Supplier Lines:</span>
                <span className="font-mono font-medium">
                  {confirmedCount} of {totalLinesCount} lines
                </span>
              </div>
              <div className="w-full bg-meridian-surface-sunken h-2 rounded-full overflow-hidden border border-meridian-border">
                <div
                  className="bg-meridian-success h-full transition-all duration-300"
                  style={{
                    width: `${totalAmount > 0 ? (confirmedAmount / totalAmount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-meridian-border">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('payments')}
                className="w-full"
              >
                Inspect Supplier Lines
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-meridian-surface border border-meridian-border rounded-card shadow-sh-1 overflow-hidden flex flex-col h-[520px]">
          {/* Thread messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {booking.messages.map((msg) => {
              const isAdmin = msg.senderRole === 'admin';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-meridian-text-muted">
                    <span className="font-semibold text-meridian-text-primary">
                      {msg.senderName}
                    </span>
                    <span className="font-mono text-[10px] uppercase">
                      [{msg.senderRole}]
                    </span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-card text-xs leading-relaxed ${
                      isAdmin
                        ? 'bg-meridian-surface-sunken border border-meridian-border text-meridian-text-primary'
                        : 'bg-meridian-primary text-white'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-meridian-surface-elevated border-t border-meridian-border flex items-center gap-3"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type message to operator desk (Enter to send, Shift+Enter newline)..."
              className="flex-1 text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input focus:outline-none focus:ring-1 focus:ring-meridian-primary"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={sendingMessage}
              disabled={!messageText.trim()}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Send
            </Button>
          </form>
        </div>
      )}

      {/* TAB 3: PAYMENTS (PRD 6.5 & 8.1 Wow Moment 5) */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Roll-up Bar Above */}
          <div className="bg-meridian-surface border border-meridian-border rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sh-1">
            <div>
              <span className="text-xs font-mono uppercase text-meridian-text-muted">
                Settlement Roll-Up Status
              </span>
              <p className="font-serif text-lg font-medium text-meridian-text-primary mt-0.5">
                {confirmedCount} of {totalLinesCount} confirmed • ${confirmedAmount.toLocaleString()}{' '}
                of ${totalAmount.toLocaleString()} USD
              </p>
            </div>
            <StatusChip kind="booking" status={booking.status} />
          </div>

          {/* Supplier Rows */}
          <div className="bg-meridian-surface border border-meridian-border rounded-card overflow-hidden shadow-sh-1">
            {totalLinesCount === 0 ? (
              <div className="p-8 text-center text-xs text-meridian-text-muted">
                Supplier payment lines are automatically created once the booking is approved by the operator desk.
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Service Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Proof File</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-meridian-border">
                  {booking.paymentLines.map((pl) => (
                    <tr key={pl.id} className="hover:bg-meridian-surface-sunken/60">
                      <td className="py-3.5 px-4 font-semibold text-meridian-text-primary">
                        {pl.supplierName}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {pl.serviceType}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        ${pl.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {pl.dueDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip kind="payment" status={pl.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {pl.proofFileName ? (
                          <span className="text-meridian-primary font-medium truncate max-w-[120px] inline-block">
                            {pl.proofFileName}
                          </span>
                        ) : (
                          <span className="text-meridian-text-muted">No proof</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {pl.status === 'not_paid' && (
                          <Button
                            size="sm"
                            variant="accent"
                            onClick={() => setUploadLine(pl)}
                            icon={<Upload className="w-3.5 h-3.5" />}
                          >
                            Upload Proof
                          </Button>
                        )}
                        {pl.status === 'proof_uploaded' && (
                          <span className="text-[11px] text-meridian-accent font-medium">
                            Awaiting Coordinator
                          </span>
                        )}
                        {pl.status === 'confirmed' && (
                          <span className="text-[11px] text-meridian-success font-medium flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
                          </span>
                        )}
                        {pl.status === 'disputed' && (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setUploadLine(pl)}
                          >
                            Re-upload Proof
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4 shadow-sh-1">
          <h3 className="font-serif text-base font-medium text-meridian-text-primary">
            Audit Trail & State Machine Transitions
          </h3>
          <div className="space-y-4">
            {booking.history.map((h, i) => (
              <div key={h.id || i} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-meridian-primary mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-meridian-text-primary">
                      {h.action}
                    </span>
                    <span className="text-[10px] font-mono text-meridian-text-muted">
                      by {h.actor} ({h.role})
                    </span>
                    <span className="text-[10px] text-meridian-text-muted">• {h.timestamp}</span>
                  </div>
                  {h.reason && (
                    <p className="text-[11px] text-meridian-text-secondary italic">
                      "{h.reason}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Request Reconsideration (One-time appeal) */}
      <Modal
        isOpen={reconsiderModalOpen}
        onClose={() => setReconsiderModalOpen(false)}
        title="Request Booking Reconsideration"
        description="Explain modifications, date shifts, or supplier allotment agreements."
        footer={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setReconsiderModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              loading={submittingReconsider}
              disabled={!reconsiderNote || reconsiderNote.trim().length < 10}
              onClick={handleReconsiderSubmit}
            >
              Submit One-Time Appeal
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="p-3 bg-meridian-warning-tint/50 border border-meridian-warning/30 rounded text-xs text-meridian-warning leading-snug">
            <strong>Important Policy:</strong> You are allowed strictly <strong>one reconsideration appeal</strong> per rejected booking.
          </div>
          <div>
            <label className="text-xs font-semibold text-meridian-text-primary block mb-1">
              Justification & Adjusted Details (10 chars minimum)
            </label>
            <textarea
              rows={4}
              value={reconsiderNote}
              onChange={(e) => setReconsiderNote(e.target.value)}
              placeholder="e.g. We contacted the hotelier directly and secured the alternative wing at the same rate..."
              className="w-full text-xs p-3 bg-meridian-surface-sunken border border-meridian-border rounded-input focus:ring-2 focus:ring-meridian-primary"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Upload Proof Modal */}
      <Modal
        isOpen={!!uploadLine}
        onClose={() => setUploadLine(null)}
        title={`Upload Payment Proof: ${uploadLine?.supplierName}`}
        description="Upload SWIFT wire transfer MT103 or bank confirmation receipt."
      >
        {uploadLine && (
          <div className="space-y-4">
            <div className="p-3 bg-meridian-surface-sunken rounded border border-meridian-border text-xs flex justify-between">
              <span>Amount Due:</span>
              <span className="font-mono font-bold">${uploadLine.amount.toLocaleString()} USD</span>
            </div>
            <FileDropzone onFileAccepted={handleProofUploaded} isUploading={uploadingProof} />
          </div>
        )}
      </Modal>

      {/* Modal: Cancel Booking */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Booking"
        description="Withdraw this booking before operator approval."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCancelModalOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="danger" size="sm" loading={cancelling} onClick={handleCancelSubmit}>
              Confirm Cancellation
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-meridian-text-secondary">
            Are you sure you want to cancel booking <strong>{booking.reference}</strong>?
          </p>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Cancellation reason (e.g. Client postponed travel)..."
            className="w-full text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input"
          />
        </div>
      </Modal>
    </div>
  );
};
