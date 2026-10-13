import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCirqlaStore } from '../../../store/cirqla';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import {
  Building2,
  DollarSign,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Eye,
  Sliders,
  Server,
  X,
} from 'lucide-react';

export const PlatformAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { tenants, suspendTenant, activateTenant, changeTenantPlan } = useCirqlaStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'plans' | 'health'>('overview');
  const [suspendModalTenant, setSuspendModalTenant] = useState<any>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const totalGmv = tenants.reduce((acc, t) => acc + t.gmv30d, 0) + 214000; // Total platform GMV ~ $412,300

  const handleConfirmSuspend = () => {
    if (!suspendModalTenant) return;
    suspendTenant(suspendModalTenant.id);
    setSuspendModalTenant(null);
    toast(`Tenant ${suspendModalTenant.name} has been suspended`, 'error');
  };

  const handleViewAsVenue = (tenantId: string) => {
    useCirqlaStore.getState().setActiveTenantId ? useCirqlaStore.getState().setActiveTenantId(tenantId) : null;
    toast(`Viewing venue as ${tenantId}`, 'info');
    navigate('/cirqla/venue/orders');
  };

  return (
    <div className="min-h-screen bg-bg text-left font-sans text-ink">
      {/* 48px Super-admin Top bar */}
      <div className="h-12 bg-ink text-surface px-6 flex items-center justify-between text-xs border-b border-line-2">
        <div className="flex items-center gap-3">
          <span className="font-serif text-base tracking-tight text-surface flex items-center gap-1.5">
            <span className="font-sans font-bold text-clay">cirqla</span>
            <span className="text-surface/80">/ Platform Super-Admin</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-clay/20 text-clay font-mono font-bold text-[10px]">
            Root Console
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/cirqla/venue')}
            className="text-surface/80 hover:text-surface text-xs font-medium"
          >
            ← Back to Venue Dashboard
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-10 max-w-[1600px] mx-auto space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-line text-xs font-sans">
          {[
            { id: 'overview', label: 'Platform Overview' },
            { id: 'tenants', label: `Tenants Management (${tenants.length})` },
            { id: 'plans', label: 'Subscription Tiers' },
            { id: 'health', label: 'System Health & SLA (99.96%)' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-2 px-5 border-b-2 font-medium transition-colors ${
                activeTab === t.id
                  ? 'border-clay text-clay font-bold'
                  : 'border-transparent text-ink-3 hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI Row (Section 9.8 exact values) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-line">
                <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                  Active Tenants
                </span>
                <span className="font-mono text-3xl font-bold text-ink">38</span>
                <span className="text-[10px] text-ok block mt-1">+4 onboarded this week</span>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-line">
                <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                  Platform GMV (30 Days)
                </span>
                <span className="font-mono text-3xl font-bold text-primary">
                  $412,300
                </span>
                <span className="text-[10px] text-ok block mt-1">+28% month-over-month</span>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-line">
                <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                  Orders Processed Today
                </span>
                <span className="font-mono text-3xl font-bold text-clay">1,480</span>
                <span className="text-[10px] text-ink-3 block mt-1">Sub-300ms median sync</span>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-line">
                <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider block mb-1">
                  30-Day Platform Uptime
                </span>
                <span className="font-mono text-3xl font-bold text-ok">99.96%</span>
                <span className="text-[10px] text-ink-3 block mt-1">Zero critical downtime</span>
              </div>
            </div>

            {/* Needs Attention List */}
            <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warn" />
                <h3 className="font-serif text-lg font-bold text-ink">
                  Needs Attention (6 Items Flagged)
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-elevated border border-line flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-warn" />
                    <div>
                      <span className="font-semibold text-ink">Tandoor House (Central Branch)</span>
                      <p className="text-ink-3 text-[11px]">Webhook retry threshold exceeded on terminal POS bridge</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast('Triggered webhook sync retry', 'info')}>
                    Retry Sync
                  </Button>
                </div>

                <div className="p-3 rounded-xl bg-elevated border border-line flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-ok" />
                    <div>
                      <span className="font-semibold text-ink">The Corner Bakehouse</span>
                      <p className="text-ink-3 text-[11px]">Free trial expiring in 4 days. Plan upgrade prompt pending.</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast('Upgrade reminder sent to owner', 'info')}>
                    Send Reminder
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tenants List */}
        {activeTab === 'tenants' && (
          <div className="bg-elevated rounded-2xl border border-line overflow-hidden shadow-xs animate-in fade-in duration-150">
            <div className="overflow-x-auto text-xs font-sans">
              <table className="w-full text-left divide-y divide-line">
                <thead className="bg-surface text-ink-3 text-[10px] uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-3">Venue Name</th>
                    <th className="p-3">Plan Tier</th>
                    <th className="p-3">Branches</th>
                    <th className="p-3">30-Day GMV</th>
                    <th className="p-3">Tenancy Status</th>
                    <th className="p-3 text-right">Super-Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: t.accent }}
                          >
                            {t.name.charAt(0)}
                          </span>
                          <div>
                            <span className="font-bold text-ink block">{t.name}</span>
                            <span className="text-[10px] text-ink-3 font-mono">{t.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-bg border border-line text-ink">
                          {t.plan}
                        </span>
                      </td>
                      <td className="p-3 text-ink-2">{t.branches.join(', ')}</td>
                      <td className="p-3 font-mono font-bold text-ink">${t.gmv30d.toLocaleString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.status === 'Active'
                              ? 'bg-ok-tint text-ok'
                              : t.status === 'Suspended'
                              ? 'bg-err-tint text-err'
                              : 'bg-warn-tint text-warn'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleViewAsVenue(t.id)}
                          className="text-primary hover:underline font-semibold"
                        >
                          View as Venue
                        </button>
                        <span>·</span>
                        {t.status === 'Suspended' ? (
                          <button
                            type="button"
                            onClick={() => {
                              activateTenant(t.id);
                              toast(`Reactivated ${t.name}`, 'success');
                            }}
                            className="text-ok hover:underline font-semibold"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSuspendModalTenant(t)}
                            className="text-err hover:underline font-semibold"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Plans and Billing */}
        {activeTab === 'plans' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
              <span className="text-xs uppercase font-bold text-ink-3 block">Starter Tier</span>
              <div className="font-mono text-3xl font-bold text-ink">$99<span className="text-xs font-normal text-ink-3">/mo</span></div>
              <ul className="text-xs text-ink-2 space-y-2">
                <li>• 1 Location Branch</li>
                <li>• Up to 25 Table QR Stations</li>
                <li>• Standard Community Support</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-elevated border-2 border-clay shadow-md space-y-4">
              <span className="text-xs uppercase font-bold text-clay block">Growth Tier</span>
              <div className="font-mono text-3xl font-bold text-ink">$199<span className="text-xs font-normal text-ink-3">/mo</span></div>
              <ul className="text-xs text-ink-2 space-y-2">
                <li>• Up to 5 Location Branches</li>
                <li>• Unlimited Table QR Stations</li>
                <li>• Staff Role RBAC & Custom Theming</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
              <span className="text-xs uppercase font-bold text-ink-3 block">Enterprise Scale</span>
              <div className="font-mono text-3xl font-bold text-ink">$399<span className="text-xs font-normal text-ink-3">/mo</span></div>
              <ul className="text-xs text-ink-2 space-y-2">
                <li>• Unlimited Location Branches</li>
                <li>• Multi-Region Edge Routing</li>
                <li>• Dedicated 30-min P1 Response SLA</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: System Health & 90-Day Uptime Strips */}
        {activeTab === 'health' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="p-6 rounded-2xl bg-surface border border-line space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">90-Day System Reliability</h3>
                <p className="text-xs text-ink-3 mt-1">
                  Each bar represents 24 hours of continuous synthetic health probes.
                </p>
              </div>

              {/* Service status with SVG uptime strips */}
              {[
                { name: 'Cirqla Order Ingestion API', uptime: '99.99%' },
                { name: 'WebSocket Realtime Broadcast Gateways', uptime: '99.95%' },
                { name: 'Stripe Connect Payment Processing', uptime: '100%' },
                { name: 'Academy Video Streaming CDN', uptime: '99.98%' },
              ].map((svc) => (
                <div key={svc.name} className="space-y-1.5 p-4 rounded-xl bg-elevated border border-line">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-ink">{svc.name}</span>
                    <span className="font-mono font-bold text-ok">{svc.uptime}</span>
                  </div>

                  {/* 90 narrow bars SVG strip */}
                  <div className="flex gap-[3px] h-6 items-center">
                    {Array.from({ length: 70 }).map((_, idx) => {
                      // Two amber bars for realism per Section 9.8
                      const isAmber = idx === 18 || idx === 52;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 h-5 rounded-[1px] ${
                            isAmber ? 'bg-warn' : 'bg-ok'
                          }`}
                          title={`Day ${idx + 1}: ${isAmber ? '98.4% (Minor latency)' : '100% Operational'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suspend Confirmation Modal */}
      {suspendModalTenant && (
        <div className="fixed inset-0 z-50 bg-ink/60 flex items-center justify-center p-4">
          <div className="w-96 bg-white rounded-2xl border border-line p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-2 text-err">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h4 className="font-serif text-lg font-bold text-ink">
                Suspend {suspendModalTenant.name}?
              </h4>
            </div>
            <p className="text-xs text-ink-2 leading-relaxed">
              Suspending this tenant will halt diner ordering and render a suspended notice on their venue dashboard.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSuspendModalTenant(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmSuspend}
              >
                Confirm Suspension
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
