import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { computeMetricsFromLeads } from '../../data/metrics';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Zap,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { leads, addToast } = useDemoStore();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'quarter'>('30d');

  const baseMetrics = computeMetricsFromLeads(leads);

  // Scale multiplier for date ranges
  const multiplier = dateRange === '7d' ? 0.3 : dateRange === '30d' ? 1 : dateRange === '90d' ? 2.8 : 3.2;

  const totalLeads = Math.round(baseMetrics.displayTotalLeads * multiplier);
  const totalTours = Math.round(baseMetrics.displayTours * multiplier);
  const totalContracts = Math.round(baseMetrics.displayContracts * multiplier);
  const totalSpend = Math.round(baseMetrics.totalSpend * multiplier);

  const costPerLead = Math.round(totalSpend / totalLeads);
  const costPerContract = Math.round(totalSpend / totalContracts);

  const handleExport = () => {
    addToast('Report Exported (Demo)', 'Generated CSV executive performance summary.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header & Date Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Marketing Attribution & Funnel Analytics
            </h1>
            <Badge variant="clay">True ROI Dashboard</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Cost-per-lead and cost-per-contract tracking across every digital and referral source.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range picker */}
          <div className="flex items-center gap-1 bg-[#FBF9F4] p-1.5 rounded-[10px] border border-[#DDD6C8] text-xs">
            {(['7d', '30d', '90d', 'quarter'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                  dateRange === r
                    ? 'bg-[#2F4A3F] text-white shadow-2xs'
                    : 'text-[#4A5550] hover:text-[#1F2A27]'
                }`}
              >
                {r === '7d' ? 'Last 7d' : r === '30d' ? 'Last 30d' : r === '90d' ? 'Last 90d' : 'This Quarter'}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Top Level Metric Cards (WOW #4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Total Ad Inquiries</div>
          <div className="font-serif text-3xl text-[#1F2A27] font-semibold mt-1 tabular-nums">
            {totalLeads}
          </div>
          <p className="text-[11px] text-[#4C7A57] mt-1 font-medium">
            Across Meta, Google & Portals
          </p>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Cost Per Ingested Lead</div>
          <div className="font-serif text-3xl text-[#1F2A27] font-semibold mt-1 tabular-nums">
            ${costPerLead}
          </div>
          <p className="text-[11px] text-[#79827D] mt-1">Blended acquisition cost</p>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Signed Contracts</div>
          <div className="font-serif text-3xl text-[#1F2A27] font-semibold mt-1 tabular-nums">
            {totalContracts}
          </div>
          <p className="text-[11px] text-[#4C7A57] mt-1 font-medium">
            {Math.round((totalContracts / totalTours) * 100)}% tour-to-contract rate
          </p>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#B4684A]">Cost Per Contract (Holy Grail)</div>
          <div className="font-serif text-3xl text-[#B4684A] font-semibold mt-1 tabular-nums">
            ${costPerContract}
          </div>
          <p className="text-[11px] text-[#79827D] mt-1">Direct marketing cost to sell a home</p>
        </div>
      </div>

      {/* Funnel Dropoff Stages */}
      <div className="bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#DDD6C8] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium">
              Lead-to-Closing Conversion Funnel
            </h3>
            <p className="text-xs text-[#79827D] mt-0.5">
              Tracks conversion and dropoff percentages at every milestone of the home buying journey.
            </p>
          </div>
          <Badge variant="clay">Milestone Tracking</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {baseMetrics.funnelSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] text-center space-y-1.5 shadow-2xs"
            >
              <span className="text-[10px] font-mono uppercase text-[#79827D]">
                Stage 0{idx + 1}
              </span>
              <h4 className="font-semibold text-xs text-[#1F2A27] truncate">{step.stage}</h4>
              <div className="font-serif text-2xl font-bold text-[#2F4A3F] tabular-nums">
                {Math.round(step.count * multiplier)}
              </div>
              <div className="text-[10px] font-mono text-[#4C7A57] bg-[#E3EEE4] px-1.5 py-0.5 rounded inline-block">
                {step.conversionRate} Conv
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Attribution Table (PRD §10.11) */}
      <div className="bg-[#FBF9F4] rounded-[16px] border border-[#C5BCA9] p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDE8DD] pb-3">
          <div>
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium">
              Source Attribution & Cost-Per-Contract Breakdown
            </h3>
            <p className="text-xs text-[#79827D] mt-0.5">
              Identifies which marketing channel actually sells new-construction homes.
            </p>
          </div>
          <Badge variant="pine">Attribution Verified</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDD6C8] bg-[#F6F3EC] text-[#4A5550]">
                <th className="p-3 font-semibold text-[#1F2A27]">Marketing Channel</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Leads</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Cost / Lead</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Tours Booked</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Contracts</th>
                <th className="p-3 font-semibold text-[#B4684A]">Cost / Contract</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Total Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8DD]">
              {baseMetrics.sourceAttribution.map((src, i) => (
                <tr key={i} className="hover:bg-[#EDE8DD]/50 transition-colors">
                  <td className="p-3 font-medium text-[#1F2A27]">{src.source}</td>
                  <td className="p-3 font-mono">{Math.round(src.leads * multiplier)}</td>
                  <td className="p-3 font-mono">${src.costPerLead}</td>
                  <td className="p-3 font-mono">{Math.round(src.tours * multiplier)}</td>
                  <td className="p-3 font-mono font-bold text-[#2F4A3F]">
                    {Math.round(src.contracts * multiplier)}
                  </td>
                  <td className="p-3 font-mono font-bold text-[#B4684A]">
                    {src.costPerContract > 0 ? `$${src.costPerContract}` : '$0 (Organic)'}
                  </td>
                  <td className="p-3 font-mono">${Math.round(src.totalSpend * multiplier)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Speed Metrics by Counselor */}
      <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4">
        <h3 className="font-serif text-lg text-[#1F2A27] font-medium">
          Sales Counselor Speed-to-Lead Response Benchmarks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {baseMetrics.agentPerformance.map((agent, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-sm text-[#1F2A27]">{agent.agentName}</h4>
                  <p className="text-[10px] text-[#79827D]">{agent.role}</p>
                </div>
                <Badge variant="clay">{agent.pctUnderOneMin}% &lt; 1 min</Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F6F3EC] text-center">
                <div>
                  <span className="text-[10px] text-[#79827D] block">Median Response</span>
                  <span className="font-mono font-bold text-[#2F4A3F] text-sm">
                    {agent.medianResponseSec}s
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#79827D] block">Tours Booked</span>
                  <span className="font-mono font-bold text-[#1F2A27] text-sm">
                    {Math.round(agent.toursBooked * multiplier)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#79827D] block">Contracts</span>
                  <span className="font-mono font-bold text-[#B4684A] text-sm">
                    {Math.round(agent.contracts * multiplier)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
