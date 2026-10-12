import React, { useState } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { formatCurrency, formatDate } from '../../lib/format';
import { StatusChip } from '../ui/StatusChip';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Drawer } from '../ui/Drawer';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/FormControls';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Plus
} from 'lucide-react';
import type { Booking, SecurityDepositStatus } from '../../types';

export const BookingsTable: React.FC = () => {
  const { bookings, vehicles, updateBooking, cancelBooking } = useDemoStore();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (vehicleFilter !== 'all' && b.vehicleId !== vehicleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        b.reference.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleDepositStatusChange = (newStatus: SecurityDepositStatus) => {
    if (!selectedBooking) return;
    updateBooking(selectedBooking.id, { depositStatus: newStatus });
    setSelectedBooking({ ...selectedBooking, depositStatus: newStatus });
    toast({
      type: 'success',
      title: 'Security Deposit Updated',
      message: `Deposit marked as ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-4 text-left">
      {/* Search and Filters Bar */}
      <div className="bg-surface p-4 rounded-lg border border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-border-strong rounded-md pl-9 pr-3 py-1.5 text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <Select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="w-48 text-xs"
          >
            <option value="all">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
        </div>

        <span className="text-xs text-ink-3">
          Showing {filtered.length} of {bookings.length} reservations
        </span>
      </div>

      {/* Bookings Table */}
      <div className="bg-surface rounded-lg border border-border shadow-sh-1 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-elevated text-ink-3 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Rental Dates</th>
              <th className="py-3 px-4">Total (NAD)</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((b) => {
              const vehicle = vehicles.find((v) => v.id === b.vehicleId);

              return (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBooking(b)}
                  className="hover:bg-sand-soft/30 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-primary">
                    {b.reference}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-ink">
                    <div>{b.customerName}</div>
                    <div className="text-[10px] text-ink-3">{b.customerCountry}</div>
                  </td>
                  <td className="py-3.5 px-4 text-ink-2 truncate max-w-[180px]">
                    {vehicle?.name || b.vehicleId}
                  </td>
                  <td className="py-3.5 px-4 text-ink-2 whitespace-nowrap">
                    {formatDate(b.startDate)} – {formatDate(b.endDate)}
                  </td>
                  <td className="py-3.5 px-4 font-serif text-sm font-semibold text-primary tabular-nums">
                    {formatCurrency(b.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusChip
                      size="sm"
                      label={
                        b.paymentStatus === 'paid_in_full'
                          ? 'Paid in Full'
                          : b.paymentStatus === 'deposit_paid'
                          ? 'Deposit Paid'
                          : 'Unpaid Attempt'
                      }
                      variant={
                        b.paymentStatus === 'paid_in_full'
                          ? 'success'
                          : b.paymentStatus === 'deposit_paid'
                          ? 'info'
                          : 'error'
                      }
                    />
                  </td>
                  <td className="py-3.5 px-4 capitalize text-ink-3">
                    {b.source}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusChip
                      size="sm"
                      label={b.status}
                      variant={
                        b.status === 'confirmed'
                          ? 'success'
                          : b.status === 'completed'
                          ? 'neutral'
                          : 'error'
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Drawer */}
      {selectedBooking && (
        <Drawer
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Booking ${selectedBooking.reference}`}
          description={`Customer: ${selectedBooking.customerName}`}
          footer={
            <div className="flex justify-between items-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (window.confirm('Cancel this booking?')) {
                    cancelBooking(selectedBooking.id);
                    setSelectedBooking(null);
                    toast({ type: 'info', title: 'Booking Cancelled' });
                  }
                }}
              >
                Cancel Booking
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedBooking(null)}>
                Close Panel
              </Button>
            </div>
          }
        >
          <div className="space-y-6 text-left text-xs">
            {/* Timeline Progress */}
            <div className="p-4 bg-surface-elevated rounded-lg border border-border space-y-3">
              <h5 className="font-semibold text-ink text-xs uppercase tracking-wider">
                Payment & Reservation State
              </h5>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <div className="flex items-center gap-1.5 text-success font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Initiated</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1.5 text-success font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorised</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1.5 text-success font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified</span>
                </div>
                <span>→</span>
                <div className="flex items-center gap-1.5 text-success font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmed</span>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div className="p-4 bg-surface rounded-lg border border-border space-y-2">
              <h5 className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                Driver Information
              </h5>
              <div className="grid grid-cols-2 gap-2 text-ink-2">
                <div>
                  <span className="text-ink-3">Email:</span> {selectedBooking.customerEmail}
                </div>
                <div>
                  <span className="text-ink-3">Phone:</span> {selectedBooking.customerPhone}
                </div>
                <div>
                  <span className="text-ink-3">Licence:</span> {selectedBooking.driverLicence} ({selectedBooking.licenceCountry})
                </div>
                <div>
                  <span className="text-ink-3">Pick-up:</span> {selectedBooking.pickupLocation}
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 bg-surface rounded-lg border border-border space-y-2.5">
              <h5 className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                Financial Summary
              </h5>
              <div className="flex justify-between items-center text-ink-2">
                <span>Rental Subtotal:</span>
                <span className="font-medium text-ink tabular-nums">
                  {formatCurrency(selectedBooking.rentalTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-ink-2">
                <span>Insurance / Cover:</span>
                <span className="font-medium text-ink tabular-nums">
                  {selectedBooking.coverTotal === 0 ? 'Included' : formatCurrency(selectedBooking.coverTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border font-bold text-sm text-primary">
                <span>Total Amount Charged:</span>
                <span className="font-serif tabular-nums">
                  {formatCurrency(selectedBooking.totalAmount)}
                </span>
              </div>
            </div>

            {/* Security Deposit State Action */}
            <div className="p-4 bg-sand-soft/50 rounded-lg border border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-ink block">
                    Security Deposit Card Hold
                  </span>
                  <span className="text-[11px] text-ink-3">
                    Amount: {formatCurrency(selectedBooking.securityDeposit)}
                  </span>
                </div>
                <StatusChip
                  label={selectedBooking.depositStatus.replace('_', ' ').toUpperCase()}
                  variant={
                    selectedBooking.depositStatus === 'held'
                      ? 'warning'
                      : selectedBooking.depositStatus === 'released'
                      ? 'success'
                      : 'neutral'
                  }
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDepositStatusChange('held')}
                >
                  Mark as Card Held
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDepositStatusChange('released')}
                >
                  Release Hold
                </Button>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
};
