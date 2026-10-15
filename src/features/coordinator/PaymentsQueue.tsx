import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Shield,
  Download,
} from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { Booking, PaymentLine } from '../../data/types';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { Drawer } from '../../components/Drawer';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { TableSkeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';

export const PaymentsQueue: React.FC = () => {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    booking: Booking;
    line: PaymentLine;
  } | null>(null);

  // Dispute modal
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputing, setDisputing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Selected row index for J/K keyboard navigation (PRD 6.9)
  const [keyboardIndex, setKeyboardIndex] = useState<number>(0);

  const fetchBookings = () => {
    setLoading(true);
    mockApi.getBookings().then((res) => {
      if (res.body) setBookings(res.body);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Extract all payment lines across all bookings
  // Sort proof_uploaded FIRST as required by PRD 6.9
  const allLines = bookings.flatMap((b) =>
    b.paymentLines.map((line) => ({ booking: b, line }))
  );

  const sortedLines = [...allLines].sort((a, b) => {
    if (a.line.status === 'proof_uploaded' && b.line.status !== 'proof_uploaded') return -1;
    if (b.line.status === 'proof_uploaded' && a.line.status !== 'proof_uploaded') return 1;
    return 0;
  });

  // Keyboard navigation listener (J, K move, C confirms) - PRD 6.9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when typing in inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'j' || e.key === 'J') {
        setKeyboardIndex((prev) => Math.min(sortedLines.length - 1, prev + 1));
      } else if (e.key === 'k' || e.key === 'K') {
        setKeyboardIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'c' || e.key === 'C') {
        if (sortedLines[keyboardIndex] && sortedLines[keyboardIndex].line.status === 'proof_uploaded') {
          handleConfirmPayment(
            sortedLines[keyboardIndex].booking.id,
            sortedLines[keyboardIndex].line.id,
            sortedLines[keyboardIndex].line.supplierName
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedLines, keyboardIndex]);

  const handleConfirmPayment = async (bookingId: string, lineId: string, supplierName: string) => {
    setConfirming(true);
    const res = await mockApi.confirmPaymentLine(bookingId, lineId, false);
    setConfirming(false);

    if (res.status === 200 && res.body) {
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? res.body : b)));
      if (selectedItem) {
        const updatedLine = res.body.paymentLines.find((pl) => pl.id === lineId);
        if (updatedLine) {
          setSelectedItem({ booking: res.body, line: updatedLine });
        }
      }
      addToast(
        'success',
        'Payment Confirmed!',
        `Supplier payment for ${supplierName} confirmed and reconciled.`
      );
    } else {
      addToast('error', 'Confirmation Error', res.error || 'Failed to confirm line.');
    }
  };

  const handleDisputeSubmit = async () => {
    if (!selectedItem || !disputeReason || disputeReason.trim().length < 5) return;
    setDisputing(true);
    const res = await mockApi.disputePaymentLine(
      selectedItem.booking.id,
      selectedItem.line.id,
      disputeReason
    );
    setDisputing(false);

    if (res.status === 200 && res.body) {
      setBookings((prev) => prev.map((b) => (b.id === selectedItem.booking.id ? res.body : b)));
      const updatedLine = res.body.paymentLines.find((pl) => pl.id === selectedItem.line.id);
      if (updatedLine) {
        setSelectedItem({ booking: res.body, line: updatedLine });
      }
      setDisputeModalOpen(false);
      addToast('info', 'Payment Proof Disputed', 'Re-upload request sent to buyer agency.');
    } else {
      addToast('error', 'Dispute Error', res.error || 'Failed to register dispute.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-meridian-info" />
            <h1 className="font-serif text-3xl font-medium text-meridian-text-primary">
              Payment Confirmation Queue
            </h1>
          </div>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Reconcile SWIFT wire MT103 receipts, match amounts per supplier, and authorize disbursements.
          </p>
        </div>

        {/* Keyboard shortcut hint (PRD 6.9) */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-meridian-text-muted bg-meridian-surface p-2 rounded border border-meridian-border font-mono">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 bg-meridian-surface-sunken rounded border border-meridian-border text-[10px]">
            J
          </kbd>
          <kbd className="px-1.5 py-0.5 bg-meridian-surface-sunken rounded border border-meridian-border text-[10px]">
            K
          </kbd>
          <span>navigate</span>
          <span>•</span>
          <kbd className="px-1.5 py-0.5 bg-meridian-surface-sunken rounded border border-meridian-border text-[10px]">
            C
          </kbd>
          <span>quick confirm</span>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : sortedLines.length === 0 ? (
        <EmptyState
          title="No Supplier Lines"
          description="No payment lines have been generated across bookings yet."
        />
      ) : (
        <div className="bg-meridian-surface rounded-card border border-meridian-border shadow-sh-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Proof Attachment</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-meridian-border">
                {sortedLines.map((item, idx) => {
                  const isSelectedKeyboard = idx === keyboardIndex;
                  const isProofUploaded = item.line.status === 'proof_uploaded';

                  return (
                    <tr
                      key={`${item.booking.id}-${item.line.id}`}
                      onClick={() => {
                        setKeyboardIndex(idx);
                        setSelectedItem(item);
                      }}
                      className={`cursor-pointer transition-colors group ${
                        isSelectedKeyboard ? 'bg-meridian-primary-tint/40' : 'hover:bg-meridian-surface-sunken'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-meridian-primary">
                        {item.booking.reference}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-meridian-text-primary">
                        {item.line.supplierName}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {item.line.serviceType}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-muted">
                        {item.line.dueDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-meridian-text-primary">
                        ${item.line.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip kind="payment" status={item.line.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {item.line.proofFileName ? (
                          <span className="text-meridian-primary font-medium flex items-center gap-1 truncate max-w-[140px]">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{item.line.proofFileName}</span>
                          </span>
                        ) : (
                          <span className="text-meridian-text-muted">Awaiting upload</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button size="sm" variant={isProofUploaded ? 'accent' : 'secondary'}>
                          Inspect Proof
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Proof Inspection Drawer (PRD 6.9) */}
      <Drawer
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Supplier Payment Reconciliation"
        description={`Booking ${selectedItem?.booking.reference} • ${selectedItem?.line.supplierName}`}
        width="max-w-xl"
        footer={
          selectedItem && (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close Drawer
              </Button>

              <div className="flex items-center gap-2">
                {selectedItem.line.status !== 'confirmed' && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDisputeModalOpen(true)}
                    >
                      Dispute Proof
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      loading={confirming}
                      onClick={() =>
                        handleConfirmPayment(
                          selectedItem.booking.id,
                          selectedItem.line.id,
                          selectedItem.line.supplierName
                        )
                      }
                      icon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Confirm Payment
                    </Button>
                  </>
                )}
                {selectedItem.line.status === 'confirmed' && (
                  <span className="text-xs font-semibold text-meridian-success flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Confirmed by Coordinator
                  </span>
                )}
              </div>
            </div>
          )
        }
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* Status overview */}
            <div className="p-4 bg-meridian-surface-sunken rounded-card border border-meridian-border space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-meridian-border">
                <span className="font-semibold text-meridian-text-primary">
                  {selectedItem.line.supplierName}
                </span>
                <StatusChip kind="payment" status={selectedItem.line.status} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-meridian-text-muted">Settlement Due:</span>
                  <p className="font-mono text-base font-bold text-meridian-primary mt-0.5">
                    ${selectedItem.line.amount.toLocaleString()} USD
                  </p>
                </div>
                <div>
                  <span className="text-meridian-text-muted">Payment Deadline:</span>
                  <p className="font-medium text-meridian-text-primary mt-0.5">
                    {selectedItem.line.dueDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Proof Document Preview Container (PRD 6.9: placeholder PDF page) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-meridian-text-primary uppercase tracking-wider font-mono">
                Wire Transfer Document Preview
              </span>

              {selectedItem.line.proofFileName ? (
                <div className="bg-meridian-surface-elevated border-2 border-meridian-border rounded-card p-6 shadow-sh-1 space-y-4 font-mono text-xs text-meridian-text-primary">
                  <div className="flex items-center justify-between pb-3 border-b border-meridian-border">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-meridian-primary" />
                      <span className="font-bold">{selectedItem.line.proofFileName}</span>
                    </div>
                    <span className="text-[10px] text-meridian-text-muted uppercase">
                      SWIFT MT103 CONFIRMED
                    </span>
                  </div>

                  {/* Simulated PDF document view */}
                  <div className="p-4 bg-meridian-surface rounded border border-meridian-border space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-meridian-text-muted">:20: TRANSACTION REFERENCE</span>
                      <span>SWIFT-89230182-USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-meridian-text-muted">:32A: VAL DATE / CURR / AMOUNT</span>
                      <span>2026-10-14 USD {selectedItem.line.amount.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-meridian-text-muted">:50K: ORDERING CUSTOMER</span>
                      <span>{selectedItem.booking.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-meridian-text-muted">:59: BENEFICIARY CUSTOMER</span>
                      <span>{selectedItem.line.supplierName}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => addToast('info', 'Document Download', `Downloading ${selectedItem.line.proofFileName}...`)}
                      className="text-meridian-primary hover:underline text-xs flex items-center gap-1 font-sans"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Original Wire PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-meridian-text-muted bg-meridian-surface-sunken/40 rounded border border-dashed border-meridian-border">
                  No payment proof uploaded yet by buyer agency.
                </div>
              )}
            </div>

            {/* Confirmation Audit Details if confirmed */}
            {selectedItem.line.status === 'confirmed' && (
              <div className="p-3 bg-meridian-success-tint/40 border border-meridian-success/30 rounded text-xs text-meridian-success space-y-1">
                <p className="font-semibold">Reconciliation Audit:</p>
                <p className="text-[11px] text-meridian-text-secondary">
                  Confirmed by {selectedItem.line.confirmedBy} on {selectedItem.line.confirmedAt}.
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Modal: Dispute Proof */}
      <Modal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        title="Dispute Supplier Payment Proof"
        description="Notify the buyer agency that the wire document is incomplete or unverified."
        footer={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setDisputeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={disputing}
              disabled={!disputeReason || disputeReason.trim().length < 5}
              onClick={handleDisputeSubmit}
            >
              Confirm Dispute
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <label className="text-xs font-semibold text-meridian-text-primary block">
            Reason for Dispute (required):
          </label>
          <textarea
            rows={3}
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            placeholder="e.g. Beneficiary account number does not match hotel master invoice..."
            className="w-full text-xs p-2.5 bg-meridian-surface-sunken border border-meridian-border rounded-input"
          />
        </div>
      </Modal>
    </div>
  );
};
