import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, Search, Filter, ArrowRight, Clock, Plus } from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Booking } from '../../data/types';
import { StatusChip } from '../../components/StatusChip';
import { TableSkeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/Button';

export const BookingsList: React.FC = () => {
  const navigate = useNavigate();
  const activeBuyerId = useStore((s) => s.activeBuyerId);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mockApi.getBookings().then((res) => {
      if (isMounted) {
        if (res.body) setBookings(res.body);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activeBuyerId]);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.tourTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-text-muted">
            Direct Bookings
          </span>
          <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-0.5">
            Agency Bookings
          </h1>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Track operational review status, upload supplier payment receipts, and review thread history.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/app/requests')}
          icon={<Plus className="w-4 h-4" />}
        >
          Book a Quote
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-meridian-surface p-4 rounded-card border border-meridian-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-meridian-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking BK- or tour..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-meridian-surface-sunken border border-meridian-border rounded-input focus:outline-none focus:ring-2 focus:ring-meridian-primary focus:bg-meridian-surface transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-meridian-text-muted font-medium flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-meridian-surface border border-meridian-border rounded-input px-3 py-1.5 text-meridian-text-primary focus:ring-1 focus:ring-meridian-primary"
          >
            <option value="all">All statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="fully_paid">Fully Paid</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Bookings Found"
          description="No bookings match your current filter criteria."
        />
      ) : (
        <div className="bg-meridian-surface rounded-card border border-meridian-border shadow-sh-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Tour Itinerary</th>
                  <th className="py-3 px-4">Travellers</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Supplier Payments</th>
                  <th className="py-3 px-4">Updated</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-meridian-border">
                {filtered.map((b) => {
                  const confirmed = b.paymentLines.filter((pl) => pl.status === 'confirmed').length;
                  const total = b.paymentLines.length;

                  return (
                    <tr
                      key={b.id}
                      onClick={() => navigate(`/app/bookings/${b.id}`)}
                      className="hover:bg-meridian-surface-sunken cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-meridian-primary">
                        {b.reference}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-meridian-text-primary">
                        {b.tourTitle}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {b.travellersCount} Guests
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-meridian-text-primary">
                        ${b.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip kind="booking" status={b.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        {total > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1 w-20 h-1.5">
                              {b.paymentLines.map((pl, i) => (
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
                              {confirmed}/{total}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-meridian-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-muted text-[11px]">
                        {b.updatedAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-meridian-primary font-semibold group-hover:text-meridian-primary-hover">
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
