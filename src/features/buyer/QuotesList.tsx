import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Lock,
  Sparkles,
} from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Quote } from '../../data/types';
import { StatusChip } from '../../components/StatusChip';
import { TableSkeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';

export const QuotesList: React.FC = () => {
  const navigate = useNavigate();
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const buyers = useStore((s) => s.buyers);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'issued' | 'expired' | 'booked'>('all');

  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);
  const isExplorer = currentBuyer?.planId === 'explorer';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mockApi.getQuotes().then((res) => {
      if (isMounted) {
        if (res.body) setQuotes(res.body);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [activeBuyerId]);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tourTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDaysRemaining = (validityDate: string) => {
    const diff = new Date(validityDate).getTime() - new Date('2026-10-15').getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-text-muted">
            Part 1 Requests Continuity
          </span>
          <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-0.5">
            Requests & Operator Quotes
          </h1>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Browse custom operator quotes, check validity deadlines, and initiate direct booking.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-meridian-surface p-4 rounded-card border border-meridian-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-meridian-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by quote Q- reference or tour title..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-meridian-surface-sunken border border-meridian-border rounded-input focus:outline-none focus:ring-2 focus:ring-meridian-primary focus:bg-meridian-surface transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-meridian-text-muted font-medium flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-meridian-surface border border-meridian-border rounded-input px-3 py-1.5 text-meridian-text-primary focus:ring-1 focus:ring-meridian-primary"
          >
            <option value="all">All statuses</option>
            <option value="issued">Valid & Issued</option>
            <option value="expired">Expired</option>
            <option value="booked">Booked</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={4} cols={6} />
      ) : filteredQuotes.length === 0 ? (
        <EmptyState
          title="No Quotes Found"
          description="No quotes match your current filter criteria or agency account."
        />
      ) : (
        <div className="bg-meridian-surface rounded-card border border-meridian-border shadow-sh-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Quote Ref</th>
                  <th className="py-3 px-4">Tour Itinerary</th>
                  <th className="py-3 px-4">Travellers</th>
                  <th className="py-3 px-4">Travel Dates</th>
                  <th className="py-3 px-4">Total (USD)</th>
                  <th className="py-3 px-4">Validity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-meridian-border">
                {filteredQuotes.map((q) => {
                  const days = getDaysRemaining(q.validityDate);
                  const isExpired = days < 0 || q.status === 'expired';

                  return (
                    <tr
                      key={q.id}
                      onClick={() => navigate(`/app/requests/${q.id}`)}
                      className="hover:bg-meridian-surface-sunken cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-meridian-primary">
                        {q.reference}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-meridian-text-primary">
                        {q.tourTitle}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {q.travellersCount} Guests
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {q.travelDates}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-meridian-text-primary">
                        ${q.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip
                          kind="validity"
                          daysRemaining={isExpired ? -1 : days}
                        />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-meridian-primary font-semibold group-hover:text-meridian-primary-hover">
                          {isExplorer ? (
                            <span className="flex items-center gap-1 text-meridian-text-muted font-normal">
                              <Lock className="w-3.5 h-3.5 text-meridian-accent" /> Review
                            </span>
                          ) : (
                            <span>Review & Book</span>
                          )}
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
