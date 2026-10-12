import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { formatCurrency, formatDate } from '../../lib/format';
import { isAvailable } from '../../lib/availability';
import { StatusChip } from '../ui/StatusChip';
import { Button } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/FormControls';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Calendar,
  Layers,
  Table as TableIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Quotation, QuotationStatus } from '../../types';

export const QuotePipeline: React.FC = () => {
  const { quotations, vehicles, bookings, blocks, issueQuotation, confirmQuotationBooking } = useDemoStore();
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<'board' | 'table'>('board');
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  // Email preview modal state
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  // Editable line items state for issuing quote
  const [quoteAmount, setQuoteAmount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [validUntil, setValidUntil] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountNote, setDiscountNote] = useState<string>('');

  const statuses: QuotationStatus[] = ['new', 'in_review', 'quoted', 'deposit_paid', 'confirmed'];

  const statusLabels: Record<QuotationStatus, string> = {
    new: 'New Requests',
    in_review: 'In Review',
    quoted: 'Quoted (Awaiting Deposit)',
    deposit_paid: 'Deposit Paid',
    confirmed: 'Confirmed Bookings',
    expired: 'Expired',
  };

  const handleOpenDetail = (q: Quotation) => {
    setSelectedQuote(q);
    setQuoteAmount(q.quotedAmount || 14500);
    setDepositAmount(q.bookingDepositAmount || 3000);
    setValidUntil(q.validUntil || q.endDate);
    setDiscountAmount(q.discountAmount || 0);
    setDiscountNote(q.discountNote || '');
  };

  const handleSendQuote = () => {
    if (!selectedQuote) return;
    issueQuotation(
      selectedQuote.id,
      quoteAmount,
      depositAmount,
      validUntil,
      selectedQuote.lineItems,
      discountAmount,
      discountNote
    );
    setEmailModalOpen(true);
    toast({
      type: 'success',
      title: 'Quotation Issued',
      message: `Quotation sent to ${selectedQuote.customerEmail}. Customer view updated.`,
    });
  };

  const handleConfirmBooking = () => {
    if (!selectedQuote) return;
    const res = confirmQuotationBooking(selectedQuote.id, 'standard');
    if (!res.success) {
      toast({
        type: 'error',
        title: 'Confirmation Failed',
        message: res.error || 'Conflict detected',
      });
      return;
    }

    toast({
      type: 'success',
      title: 'Booking Confirmed!',
      message: `Quotation converted to confirmed booking ${res.reference}. Vehicle blocked on timeline.`,
    });
    setSelectedQuote(null);
  };

  // Availability check for selected quote's requested vehicle
  const targetVehicleId = selectedQuote?.vehiclePreference[0] || 'hilux-dc';
  const isAvailableForQuote = selectedQuote
    ? isAvailable(targetVehicleId, selectedQuote.startDate, selectedQuote.endDate, bookings, blocks)
    : true;

  return (
    <div className="space-y-4 text-left">
      {/* Top Controls */}
      <div className="flex items-center justify-between bg-surface p-3.5 rounded-lg border border-border">
        <span className="text-xs text-ink-3">
          Manage inbound requests and issue proposals. Quotes never reserve fleet vehicles.
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
              viewMode === 'board' ? 'bg-primary text-white' : 'text-ink-2 hover:bg-sand-soft'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban Board</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
              viewMode === 'table' ? 'bg-primary text-white' : 'text-ink-2 hover:bg-sand-soft'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table View</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statuses.map((status) => {
            const list = quotations.filter((q) => q.status === status);

            return (
              <div
                key={status}
                className="bg-surface-elevated rounded-lg p-3 border border-border flex flex-col gap-3 min-h-[450px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/80">
                  <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
                    {statusLabels[status]}
                  </h4>
                  <span className="text-[10px] bg-sand-soft text-ink-2 font-mono px-1.5 py-0.5 rounded font-bold">
                    {list.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {list.map((q) => {
                    const vehName = vehicles.find((v) => q.vehiclePreference.includes(v.id))?.name || 'Hilux Double Cab';

                    return (
                      <div
                        key={q.id}
                        onClick={() => handleOpenDetail(q)}
                        className="bg-surface rounded-md p-3.5 border border-border hover:border-primary shadow-sh-1 hover:shadow-sh-2 transition-all cursor-pointer space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-primary">
                            {q.reference}
                          </span>
                          <span className="text-[10px] text-ink-3">
                            {q.createdAt}
                          </span>
                        </div>

                        <div>
                          <div className="font-semibold text-ink text-xs">{q.customerName}</div>
                          <div className="text-[11px] text-ink-3 truncate">{vehName}</div>
                        </div>

                        <div className="text-[11px] text-ink-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-accent shrink-0" />
                          <span>{formatDate(q.startDate)} – {formatDate(q.endDate)}</span>
                        </div>

                        {q.quotedAmount && (
                          <div className="pt-1.5 border-t border-border/60 flex justify-between items-center text-xs">
                            <span className="text-ink-3">Quoted:</span>
                            <span className="font-serif font-semibold text-primary tabular-nums">
                              {formatCurrency(q.quotedAmount)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface rounded-lg border border-border shadow-sh-1 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-elevated text-ink-3 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Requested Dates</th>
                <th className="py-3 px-4">Preference</th>
                <th className="py-3 px-4">Quoted Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotations.map((q) => (
                <tr
                  key={q.id}
                  onClick={() => handleOpenDetail(q)}
                  className="hover:bg-sand-soft/30 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-primary">{q.reference}</td>
                  <td className="py-3 px-4 font-medium text-ink">{q.customerName}</td>
                  <td className="py-3 px-4 text-ink-2">{formatDate(q.startDate)} – {formatDate(q.endDate)}</td>
                  <td className="py-3 px-4 text-ink-3">{q.vehiclePreference.join(', ')}</td>
                  <td className="py-3 px-4 font-serif font-semibold text-primary tabular-nums">
                    {q.quotedAmount ? formatCurrency(q.quotedAmount) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusChip size="sm" label={q.status.replace('_', ' ')} variant="info" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quote Detail Drawer */}
      {selectedQuote && (
        <Drawer
          isOpen={true}
          onClose={() => setSelectedQuote(null)}
          title={`Quote ${selectedQuote.reference}`}
          description={`Requested by ${selectedQuote.customerName}`}
          footer={
            <div className="flex items-center justify-between gap-3">
              <Link
                to={`/quote/${selectedQuote.reference}`}
                target="_blank"
                className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Customer Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSendQuote}
                  icon={<Send className="w-3.5 h-3.5" />}
                  iconPosition="right"
                >
                  Send Quotation
                </Button>

                {selectedQuote.status === 'deposit_paid' && (
                  <Button
                    variant="accent"
                    size="sm"
                    disabled={!isAvailableForQuote}
                    onClick={handleConfirmBooking}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Confirm Booking
                  </Button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-5 text-left text-xs">
            {/* Real-time Fleet Availability Status */}
            <div className="p-3.5 rounded-lg border flex items-center justify-between bg-surface-elevated">
              <div>
                <span className="font-semibold text-ink block text-xs">
                  Target Vehicle Availability Check:
                </span>
                <span className="text-[11px] text-ink-3">
                  Vehicle: {vehicles.find((v) => v.id === targetVehicleId)?.name}
                </span>
              </div>
              {isAvailableForQuote ? (
                <StatusChip label="Available" variant="success" />
              ) : (
                <StatusChip label="Dates Conflict with Active Booking" variant="error" />
              )}
            </div>

            {/* Customer Inquiry Details */}
            <div className="p-4 bg-surface rounded-lg border border-border space-y-2">
              <h5 className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                Trip Requirements
              </h5>
              <div className="space-y-1 text-ink-2">
                <div><strong>Email:</strong> {selectedQuote.customerEmail}</div>
                <div><strong>Phone:</strong> {selectedQuote.customerPhone}</div>
                <div><strong>Travel Dates:</strong> {formatDate(selectedQuote.startDate)} to {formatDate(selectedQuote.endDate)}</div>
                <div><strong>Route:</strong> {selectedQuote.pickupLocation} → {selectedQuote.dropoffLocation}</div>
                <div><strong>Drivers:</strong> {selectedQuote.driverCount} Driver(s)</div>
              </div>
              {selectedQuote.message && (
                <div className="pt-2 border-t border-border/60">
                  <span className="text-ink-3 block">Customer Itinerary Message:</span>
                  <p className="text-ink font-normal mt-0.5 italic">"{selectedQuote.message}"</p>
                </div>
              )}
            </div>

            {/* Editable Quote Line Items */}
            <div className="p-4 bg-surface rounded-lg border border-border space-y-3">
              <h5 className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                Quotation Pricing Formulation
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quoted Total Amount (NAD)"
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                />
                <Input
                  label="Required Booking Deposit (NAD)"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Discount / Special Extra (NAD)"
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                />
                <Input
                  label="Quote Valid Until"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>

              <Input
                label="Discount Justification / Note"
                placeholder="e.g. 10% Long-safari promotional adjustment"
                value={discountNote}
                onChange={(e) => setDiscountNote(e.target.value)}
              />
            </div>
          </div>
        </Drawer>
      )}

      {/* Simulated Email Proposal Preview Modal */}
      {emailModalOpen && selectedQuote && (
        <Modal
          isOpen={true}
          onClose={() => setEmailModalOpen(false)}
          title="Simulated Email Dispatch"
          description={`Sent to ${selectedQuote.customerEmail}`}
        >
          <div className="p-4 bg-sand-soft/50 rounded-lg border border-border text-xs text-left space-y-3 font-mono">
            <div className="border-b border-border pb-2">
              <div><strong>To:</strong> {selectedQuote.customerEmail}</div>
              <div><strong>Subject:</strong> Future Shuttles & Rentals — Quotation {selectedQuote.reference}</div>
            </div>
            <p>Dear {selectedQuote.customerName},</p>
            <p>
              Thank you for choosing Future Shuttles & Rentals. We are pleased to provide your requested itinerary quotation:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Rental Total: {formatCurrency(quoteAmount)}</li>
              <li>Booking Deposit to Secure: {formatCurrency(depositAmount)}</li>
              <li>Valid Until: {validUntil}</li>
            </ul>
            <p>
              Please review and securely pay the booking deposit using the link below:
            </p>
            <div className="pt-2">
              <Link
                to={`/quote/${selectedQuote.reference}`}
                target="_blank"
                className="text-accent underline font-semibold"
              >
                http://futureshuttles.com.na/quote/{selectedQuote.reference}
              </Link>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary" size="sm" onClick={() => setEmailModalOpen(false)}>
              Close Simulation
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
