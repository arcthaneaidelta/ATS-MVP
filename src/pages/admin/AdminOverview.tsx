import React from 'react';
import { AdminShell } from '../../components/admin/AdminShell';
import { KpiCard, ActivityFeed } from '../../components/admin/ActivityFeed';
import { useDemoStore } from '../../store/useDemoStore';
import { formatCurrency, formatDate } from '../../lib/format';
import { StatusChip } from '../../components/ui/StatusChip';
import { Button } from '../../components/ui/Button';
import { 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverview: React.FC = () => {
  const { bookings, quotations, vehicles, activities } = useDemoStore();

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const openQuotes = quotations.filter((q) => q.status === 'new' || q.status === 'in_review');
  const needsActionQuotes = quotations.filter((q) => q.status === 'new' || q.status === 'deposit_paid');

  // Compute fleet utilisation percentage (booked / total)
  const activeBookedVehicles = new Set(confirmedBookings.map((b) => b.vehicleId)).size;
  const utilisationRate = Math.round((activeBookedVehicles / vehicles.length) * 100);

  // Utilization by vehicle model for the bar chart per PRD §12.1
  const vehicleStats = vehicles.map((v) => {
    const bCount = bookings.filter((b) => b.vehicleId === v.id && b.status === 'confirmed').length;
    return {
      name: v.name.split(' ')[1] || v.name,
      fullName: v.name,
      bookingsCount: bCount,
      percentage: Math.min(100, Math.round((bCount / 4) * 100)),
    };
  });

  return (
    <AdminShell
      title="Overview & Today"
      subtitle="Fleet operations, urgent actions, and reservation metrics"
      actions={
        <div className="flex items-center gap-2">
          <Link to="/admin/calendar">
            <Button size="sm" variant="primary" icon={<Calendar className="w-3.5 h-3.5" />}>
              Open Timeline Calendar
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8 text-left">
        {/* Priority 1: Needs Action Banner per PRD §12.1 */}
        {needsActionQuotes.length > 0 && (
          <div className="bg-amber-50/80 rounded-xl p-5 border border-amber-200/70 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-950 font-semibold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Urgent Actions Required ({needsActionQuotes.length})</span>
              </div>
              <Link to="/admin/quotations" className="text-xs text-accent font-semibold hover:underline">
                View Quotations Pipeline →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {needsActionQuotes.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  className="bg-white p-3 rounded-lg border border-amber-200/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-ink">
                      {q.customerName} ({q.reference})
                    </div>
                    <div className="text-[11px] text-ink-3">
                      {q.status === 'new' ? 'New customer quote request' : 'Deposit paid — Ready to confirm'}
                    </div>
                  </div>
                  <Link to="/admin/quotations">
                    <Button size="sm" variant="secondary" className="text-[11px] h-7 px-2.5">
                      Review
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Priority 3: Quiet KPI Cards per §12.1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Confirmed Bookings (30d)"
            value={confirmedBookings.length}
            change="+18% vs last month"
            isPositive
            sparklineData={[10, 14, 18, 15, 22, 28, 26, 32]}
          />
          <KpiCard
            label="Revenue Collected"
            value={formatCurrency(totalRevenue)}
            change="+24% vs targets"
            isPositive
            sparklineData={[40, 55, 60, 50, 75, 80, 95, 110]}
          />
          <KpiCard
            label="Fleet Utilisation"
            value={`${utilisationRate}%`}
            change="High Season (Etosha)"
            isPositive
            sparklineData={[50, 60, 55, 70, 65, 80, 85, 88]}
          />
          <KpiCard
            label="Open Quotations"
            value={openQuotes.length}
            change="4 awaiting review"
            isPositive={false}
            sparklineData={[3, 4, 6, 5, 8, 7, 9, 6]}
          />
        </div>

        {/* Priority 2 & 4: Fleet Utilisation Chart + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Fleet Utilisation Chart (7 cols) */}
          <div className="lg:col-span-7 bg-surface rounded-xl p-6 border border-border shadow-sh-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h4 className="font-serif text-lg font-normal text-ink">
                  Fleet Utilisation by Vehicle Model
                </h4>
                <p className="text-xs text-ink-3">Current 30-day reservation distribution</p>
              </div>
              <span className="text-xs text-accent font-semibold bg-accent-soft px-2.5 py-1 rounded">
                Live Timeline
              </span>
            </div>

            {/* Hand-built clean SVG/CSS Bar Chart per PRD §12.1 */}
            <div className="space-y-3.5 pt-2">
              {vehicleStats.map((stat, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-ink-2">
                    <span className="font-medium truncate max-w-[240px] text-ink">{stat.fullName}</span>
                    <span className="tabular-nums font-mono text-ink-3">
                      {stat.bookingsCount} booking{stat.bookingsCount === 1 ? '' : 's'} ({stat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-sand-soft rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(12, stat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-ink-3">
              <span>Overall Fleet: {vehicles.length} Units</span>
              <Link to="/admin/vehicles" className="text-accent hover:underline font-medium">
                Manage Fleet Specs →
              </Link>
            </div>
          </div>

          {/* Activity Feed (5 cols) */}
          <div className="lg:col-span-5">
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
};
