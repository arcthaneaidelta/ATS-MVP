import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, Filter, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { Booking } from '../../data/types';
import { StatusChip } from '../../components/StatusChip';
import { TableSkeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';

export const AdminBookingsList: React.FC = () => {
  const navigate = useNavigate();
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
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.reference.toLowerCase().includes(search.toLowerCase()) ||
      b.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      b.tourTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
          Operations Master Queue
        </span>
        <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-0.5">
          All Bookings & Reviews
        </h1>
        <p className="text-xs text-meridian-text-secondary mt-1">
          Complete platform lifecycle oversight: review pending submissions, examine wire confirmations, and mark completed.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-meridian-surface p-4 rounded-card border border-meridian-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-meridian-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking BK-, buyer or tour..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-meridian-surface-sunken border border-meridian-border rounded-input focus:outline-none focus:ring-2 focus:ring-meridian-primary focus:bg-meridian-surface"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-meridian-text-muted font-medium flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter State:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-meridian-surface border border-meridian-border rounded-input px-3 py-1.5 text-meridian-text-primary"
          >
            <option value="all">All States ({bookings.length})</option>
            <option value="submitted">Submitted (Review Pending)</option>
            <option value="under_review">Under Review</option>
            <option value="reconsideration_requested">Appeal Pending</option>
            <option value="approved">Approved</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="fully_paid">Fully Paid (Ready to Complete)</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="rejected_final">Rejected (Final)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Bookings Matched"
          description="Try adjusting your search query or state filter."
        />
      ) : (
        <div className="bg-meridian-surface rounded-card border border-meridian-border shadow-sh-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Buyer Agency</th>
                  <th className="py-3 px-4">Tour Package</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Lifecycle State</th>
                  <th className="py-3 px-4">Supplier Lines</th>
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
                      onClick={() => navigate(`/admin/bookings/${b.id}`)}
                      className="hover:bg-meridian-surface-sunken cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-meridian-primary">
                        {b.reference}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-meridian-text-primary">
                        {b.buyerName}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {b.tourTitle} ({b.travellersCount} Guests)
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        ${b.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip kind="booking" status={b.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {total > 0 ? (
                          <span>{confirmed} of {total} paid</span>
                        ) : (
                          <span className="text-meridian-text-muted">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-meridian-primary group-hover:text-meridian-primary-hover flex items-center justify-end gap-1">
                          Review <ArrowRight className="w-3.5 h-3.5" />
                        </span>
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
