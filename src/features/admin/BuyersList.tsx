import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, ArrowRight, Building, Clock } from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Buyer } from '../../data/types';
import { StatusChip } from '../../components/StatusChip';
import { TableSkeleton } from '../../components/Skeleton';
import { EmptyState } from '../../components/EmptyState';

export const BuyersList: React.FC = () => {
  const navigate = useNavigate();
  const plans = useStore((s) => s.plans);

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    mockApi.getBuyers().then((res) => {
      if (isMounted) {
        if (res.body) setBuyers(res.body);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = buyers.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.contactName.toLowerCase().includes(search.toLowerCase()) ||
      b.country.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === 'all' || b.planId === planFilter;
    const matchesStatus = statusFilter === 'all' || b.subscriptionStatus === statusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
          Agency Directory
        </span>
        <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-0.5">
          Buyer Agencies
        </h1>
        <p className="text-xs text-meridian-text-secondary mt-1">
          Inspect client subscriptions, monthly booking volumes, and account standing.
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
            placeholder="Search by agency name, contact or country..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-meridian-surface-sunken border border-meridian-border rounded-input focus:outline-none focus:ring-2 focus:ring-meridian-primary focus:bg-meridian-surface"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="text-xs bg-meridian-surface border border-meridian-border rounded-input px-3 py-1.5 text-meridian-text-primary"
          >
            <option value="all">All Plans</option>
            <option value="explorer">Explorer</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-meridian-surface border border-meridian-border rounded-input px-3 py-1.5 text-meridian-text-primary"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="past_due">Past Due</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Agencies Found"
          description="No buyer organizations match your current search criteria."
        />
      ) : (
        <div className="bg-meridian-surface rounded-card border border-meridian-border shadow-sh-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4">Monthly Usage</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-meridian-border">
                {filtered.map((b) => {
                  const plan = plans.find((p) => p.id === b.planId) || plans[0];
                  const percent =
                    plan.bookingsPerMonth > 0
                      ? Math.round((b.bookingsThisMonth / plan.bookingsPerMonth) * 100)
                      : 0;

                  return (
                    <tr
                      key={b.id}
                      onClick={() => navigate(`/admin/buyers/${b.id}`)}
                      className="hover:bg-meridian-surface-sunken cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-meridian-text-primary">
                        {b.name}
                        <span className="block text-[11px] font-normal text-meridian-text-muted">
                          {b.country}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-secondary">
                        {b.contactName}
                        <span className="block text-[11px] text-meridian-text-muted">
                          {b.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip kind="plan" status={b.planId} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusChip kind="subscription" status={b.subscriptionStatus} />
                      </td>
                      <td className="py-3.5 px-4">
                        {plan.bookingsPerMonth > 0 ? (
                          <div className="space-y-1 w-28">
                            <div className="flex justify-between text-[10px] font-mono">
                              <span>{b.bookingsThisMonth} / {plan.bookingsPerMonth}</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-meridian-surface-sunken rounded-full overflow-hidden border border-meridian-border">
                              <div
                                className={`h-full ${
                                  percent >= 100
                                    ? 'bg-meridian-error'
                                    : percent >= 80
                                    ? 'bg-meridian-warning'
                                    : 'bg-meridian-primary'
                                }`}
                                style={{ width: `${Math.min(100, percent)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-meridian-text-muted font-mono text-[11px]">
                            0 / 0 (Locked)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-meridian-text-muted text-[11px]">
                        {b.lastActivity}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-meridian-primary group-hover:text-meridian-primary-hover flex items-center justify-end gap-1">
                          Detail <ArrowRight className="w-3.5 h-3.5" />
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
