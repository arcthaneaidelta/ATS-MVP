import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  CreditCard,
  Zap,
  ArrowRight,
  AlertTriangle,
  Shield,
  Users,
  Search,
} from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Booking } from '../../data/types';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { Skeleton } from '../../components/Skeleton';

export const AdminOverview: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  // PRD 6.6: KPI row (4 cards, no chart junk)
  const awaitingReview = bookings.filter((b) =>
    ['submitted', 'under_review', 'reconsideration_requested'].includes(b.status)
  );
  const approvedThisMonth = bookings.filter((b) =>
    ['approved', 'payment_pending', 'partially_paid', 'fully_paid', 'completed'].includes(b.status)
  );
  const paymentsAwaitingConfirmation = bookings.flatMap((b) =>
    b.paymentLines.filter((pl) => pl.status === 'proof_uploaded')
  );
  const activationsThisMonth = 6; // Seed metric

  // Bookings by status aggregation for bar chart
  const statusCounts = {
    Submitted: bookings.filter((b) => b.status === 'submitted').length,
    Review: bookings.filter((b) => b.status === 'under_review').length,
    Approved: bookings.filter((b) => ['approved', 'payment_pending'].includes(b.status)).length,
    Paid: bookings.filter((b) => ['partially_paid', 'fully_paid'].includes(b.status)).length,
    Completed: bookings.filter((b) => b.status === 'completed').length,
    Rejected: bookings.filter((b) => ['rejected', 'rejected_final'].includes(b.status)).length,
  };
  const maxCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
            Operations & Review Desk
          </span>
          <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-0.5">
            Operator Dashboard
          </h1>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Real-time human approval queue, supplier disbursement status, and platform throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/buyers')}
            icon={<Users className="w-3.5 h-3.5" />}
          >
            Buyer Directory
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/bookings')}
            icon={<Shield className="w-3.5 h-3.5" />}
          >
            Full Bookings List
          </Button>
        </div>
      </div>

      {/* 4 KPI Cards Row (PRD Section 6.6) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-meridian-surface border border-meridian-border rounded-card p-4 space-y-1 shadow-sh-1">
          <span className="text-[11px] font-mono uppercase text-meridian-text-muted">
            Awaiting Review
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-meridian-text-primary">
              {awaitingReview.length}
            </span>
            <span className="text-xs text-meridian-warning font-semibold">Priority Queue</span>
          </div>
          <p className="text-[11px] text-meridian-text-secondary">Requires operator decision</p>
        </div>

        <div className="bg-meridian-surface border border-meridian-border rounded-card p-4 space-y-1 shadow-sh-1">
          <span className="text-[11px] font-mono uppercase text-meridian-text-muted">
            Approved This Month
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-meridian-primary">
              {approvedThisMonth.length}
            </span>
            <span className="text-xs text-meridian-success font-medium">Under SLA</span>
          </div>
          <p className="text-[11px] text-meridian-text-secondary">Disbursements initiated</p>
        </div>

        <div className="bg-meridian-surface border border-meridian-border rounded-card p-4 space-y-1 shadow-sh-1">
          <span className="text-[11px] font-mono uppercase text-meridian-text-muted">
            Payments Pending Proof
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-meridian-accent">
              {paymentsAwaitingConfirmation.length}
            </span>
            <span className="text-xs text-meridian-accent font-medium">Ready</span>
          </div>
          <p className="text-[11px] text-meridian-text-secondary">Awaiting coordinator</p>
        </div>

        <div className="bg-meridian-surface border border-meridian-border rounded-card p-4 space-y-1 shadow-sh-1">
          <span className="text-[11px] font-mono uppercase text-meridian-text-muted">
            Plan Activations
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-medium text-meridian-text-primary">
              {activationsThisMonth}
            </span>
            <span className="text-xs text-meridian-primary font-medium">Pro & Ent</span>
          </div>
          <p className="text-[11px] text-meridian-text-secondary">Current cycle growth</p>
        </div>
      </div>

      {/* Status Breakdown Bar Chart (Clean lightweight SVG styling) */}
      <div className="bg-meridian-surface border border-meridian-border rounded-card p-5 space-y-4 shadow-sh-1">
        <div className="flex items-center justify-between border-b border-meridian-border pb-3">
          <div>
            <h3 className="font-serif text-base font-medium text-meridian-text-primary">
              Bookings Distribution by State
            </h3>
            <p className="text-xs text-meridian-text-secondary">
              Active lifecycle stages across all registered buyer organizations
            </p>
          </div>
          <span className="text-xs font-mono text-meridian-text-muted">
            {bookings.length} Total Bookings
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
          {Object.entries(statusCounts).map(([status, count]) => {
            const heightPercent = Math.max(15, (count / maxCount) * 100);
            return (
              <div key={status} className="flex flex-col items-center space-y-2">
                <span className="font-serif text-lg font-bold text-meridian-text-primary">
                  {count}
                </span>
                <div className="w-full bg-meridian-surface-sunken rounded-t h-20 flex items-end p-1 border border-meridian-border/50">
                  <div
                    className="w-full bg-meridian-primary rounded-t transition-all duration-500 ease-out"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-meridian-text-secondary text-center truncate w-full">
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval Queue Table with SLA chip (PRD 6.6) */}
      <div className="bg-meridian-surface border border-meridian-border rounded-card shadow-sh-1 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-meridian-border flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-medium text-meridian-text-primary">
                Operator Approval Queue
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-meridian-accent-tint text-meridian-accent">
                {awaitingReview.length} Pending
              </span>
            </div>
            <p className="text-xs text-meridian-text-secondary mt-0.5">
              Review and decision bookings within 24-hour turnaround SLA
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/bookings')}
          >
            Manage Queue
          </Button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : awaitingReview.length === 0 ? (
          <div className="p-8 text-center text-xs text-meridian-text-muted">
            Approval queue is clear. No bookings currently awaiting review.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Buyer Organization</th>
                  <th className="py-3 px-4">Tour Itinerary</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">SLA Wait Time</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-meridian-border">
                {awaitingReview.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => navigate(`/admin/bookings/${b.id}`)}
                    className="hover:bg-meridian-surface-sunken cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-meridian-primary">
                      {b.reference}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-meridian-text-primary">
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
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-meridian-warning-tint text-meridian-warning border border-meridian-warning/30">
                        <Clock className="w-3 h-3" /> Waiting 18h
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button size="sm" variant="accent">
                        Open Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
