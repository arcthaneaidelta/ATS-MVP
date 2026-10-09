import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { exportToCsv } from '../../lib/csv';
import { formatCurrency } from '../../lib/format';
import { Button } from '../../components/ui/Button';
import { 
  BarChart3, Download, Filter, Table as TableIcon, 
  TrendingUp, Calendar as CalendarIcon, ArrowUpRight, Check 
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { sources, opportunities } = useAppStore();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [showTableView, setShowTableView] = useState(false);

  // Dynamic headline rewrite based on filters per PRD W6
  const getHeadlineSentence = () => {
    if (sourceFilter === 'Website Intake Form') {
      return 'Website leads booked 41.2% of consultations this month, driven by the 5-step intake survey.';
    }
    if (sourceFilter === 'Finch Assist (Voice Agent)') {
      return 'Voice agent speed-to-lead calls qualified 36.4% of inbound leads in under 2 minutes.';
    }
    if (sourceFilter === 'Client Referral') {
      return 'Referral leads maintained the highest show-up and win rate at 63.6%, representing $254,000 in volume.';
    }
    return 'Website and Voice Agent leads generated 68% of all booked consultations this month, maintaining an overall 78.5% show-up rate.';
  };

  const handleExportCsv = () => {
    const headers = ['Source', 'Leads Count', 'Conversion Rate (%)', 'Estimated Pipeline Value'];
    const rows = sources.map(s => [
      s.source,
      s.leadsCount,
      `${s.conversionRate}%`,
      formatCurrency(s.leadsCount * 32000),
    ]);
    exportToCsv('alder-and-finch-source-performance.csv', headers, rows);
  };

  // Mock weekly column chart data (12 weeks)
  const weeklyData = [
    { week: 'W1', booked: 6, completed: 5 },
    { week: 'W2', booked: 8, completed: 6 },
    { week: 'W3', booked: 7, completed: 6 },
    { week: 'W4', booked: 10, completed: 8 },
    { week: 'W5', booked: 9, completed: 7 },
    { week: 'W6', booked: 11, completed: 9 },
    { week: 'W7', booked: 8, completed: 7 },
    { week: 'W8', booked: 12, completed: 10 },
    { week: 'W9', booked: 13, completed: 11 },
    { week: 'W10', booked: 11, completed: 9 },
    { week: 'W11', booked: 14, completed: 12 },
    { week: 'W12', booked: 15, completed: 13 },
  ];

  const stageDropoff = [
    { stage: 'Inquiries', count: 46, pct: '100%' },
    { stage: 'Contacted', count: 38, pct: '82%' },
    { stage: 'Qualified', count: 26, pct: '56%' },
    { stage: 'Booked', count: 18, pct: '39%' },
    { stage: 'Proposal Sent', count: 12, pct: '26%' },
    { stage: 'Won', count: 8, pct: '17%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Reports & Attribution</h1>
          <p className="text-xs text-text-muted mt-1">
            Conversion metrics, speed-to-lead benchmarks, and acquisition source performance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-input border border-border bg-surface p-0.5 text-xs">
            {(['7d', '30d', '90d'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-2.5 py-1 rounded font-semibold uppercase ${
                  dateRange === d ? 'bg-primary text-surface' : 'text-text-muted hover:text-text'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Dynamic Headline Sentence (PRD Wow Moment W6) */}
      <div className="p-4 bg-primary-soft/60 border border-primary/20 rounded-card flex items-start gap-3 text-xs text-text transition-all">
        <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 font-medium leading-relaxed">
          {getHeadlineSentence()}
        </div>
      </div>

      {/* Source Filter Select */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-text-muted uppercase text-[11px]">Filter Channel:</span>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-sunken border border-border rounded px-2.5 py-1 text-text outline-none"
        >
          <option value="All">All Acquisition Channels</option>
          {sources.map(s => (
            <option key={s.id} value={s.source}>{s.source}</option>
          ))}
        </select>
      </div>

      {/* 2x2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: LEADS BY SOURCE (Horizontal bars) */}
        <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-4 shadow-sh-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-text tracking-wider">Leads by Acquisition Source</span>
            <span className="text-[11px] text-text-muted font-mono">Volume & Conv %</span>
          </div>

          <div className="space-y-3 pt-2">
            {sources.map(s => (
              <div key={s.id} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-text">
                  <span className="font-medium">{s.source}</span>
                  <span className="font-bold font-mono text-[11px] text-primary">{s.leadsCount} ({s.conversionRate}%)</span>
                </div>
                <div className="w-full h-3 bg-sunken rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-slow"
                    style={{ width: `${(s.leadsCount / 46) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: PIPELINE FUNNEL (Stage Drop-Off) */}
        <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-4 shadow-sh-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-text tracking-wider">Pipeline Stage Conversion Funnel</span>
            <span className="text-[11px] text-text-muted font-mono">Drop-off %</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {stageDropoff.map((st, idx) => (
              <div key={st.stage} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text">{st.stage}</span>
                  <span className="font-mono text-text-muted text-[11px]">{st.count} ({st.pct})</span>
                </div>
                <div className="w-full h-2.5 bg-sunken rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-slow ${
                      idx === 0 ? 'bg-primary' :
                      idx === 3 ? 'bg-accent' :
                      idx === 5 ? 'bg-success' : 'bg-primary/70'
                    }`}
                    style={{ width: st.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 3: APPOINTMENTS BOOKED PER WEEK (Column chart) */}
        <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-4 shadow-sh-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-text tracking-wider">Weekly Consultations (12 Weeks)</span>
            <div className="flex items-center gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-primary" /> Booked</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-accent" /> Completed</span>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-1.5 pt-4 px-2 border-b border-border">
            {weeklyData.map(w => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  <div
                    className="w-1/2 bg-primary rounded-t group-hover:opacity-80 transition-all"
                    style={{ height: `${(w.booked / 16) * 100}%` }}
                    title={`${w.week}: ${w.booked} booked`}
                  />
                  <div
                    className="w-1/2 bg-accent rounded-t group-hover:opacity-80 transition-all"
                    style={{ height: `${(w.completed / 16) * 100}%` }}
                    title={`${w.week}: ${w.completed} completed`}
                  />
                </div>
                <span className="text-[9px] text-text-muted">{w.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 4: APPOINTMENT OUTCOMES DISTRIBUTION */}
        <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-4 shadow-sh-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs uppercase text-text tracking-wider">Consultation Outcomes</span>
            <span className="text-[11px] text-text-muted">30-Day Distribution</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-card bg-primary-soft/50 border border-primary/20 space-y-1">
              <div className="text-text-muted text-[11px]">Completed & Qualified</div>
              <div className="text-xl font-bold text-primary font-serif">71.4%</div>
              <div className="text-[10px] text-success font-semibold">10 sessions</div>
            </div>

            <div className="p-3 rounded-card bg-sunken border border-border space-y-1">
              <div className="text-text-muted text-[11px]">Rescheduled</div>
              <div className="text-xl font-bold text-text font-serif">14.3%</div>
              <div className="text-[10px] text-text-muted">2 sessions</div>
            </div>

            <div className="p-3 rounded-card bg-error/10 border border-error/20 space-y-1">
              <div className="text-text-muted text-[11px]">No-Show</div>
              <div className="text-xl font-bold text-error font-serif">7.1%</div>
              <div className="text-[10px] text-error font-semibold">1 session (rebooking flow)</div>
            </div>

            <div className="p-3 rounded-card bg-sunken border border-border space-y-1">
              <div className="text-text-muted text-[11px]">Cancelled by Lead</div>
              <div className="text-xl font-bold text-text font-serif">7.1%</div>
              <div className="text-[10px] text-text-muted">1 session</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sortable Source Table */}
      <div className="bg-surface rounded-modal border border-border overflow-hidden shadow-sh-1 space-y-0">
        <div className="p-4 bg-surface-elevated border-b border-border flex items-center justify-between">
          <h3 className="text-xs font-bold text-text uppercase tracking-wider">Attribution Breakdown by Channel</h3>
          <span className="text-[11px] text-text-muted font-mono">{sources.length} Channels Tracked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-text">
            <thead className="bg-sunken border-b border-border text-[11px] font-semibold text-text-muted uppercase">
              <tr>
                <th className="py-2.5 px-4">Channel</th>
                <th className="py-2.5 px-4">UTM Source</th>
                <th className="py-2.5 px-4">Leads</th>
                <th className="py-2.5 px-4">Conversion Rate</th>
                <th className="py-2.5 px-4 text-right">Estimated Pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.map(s => (
                <tr key={s.id} className="hover:bg-sunken/40">
                  <td className="py-3 px-4 font-semibold text-text">{s.source}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-text-muted">{s.utmSource}</td>
                  <td className="py-3 px-4 font-bold">{s.leadsCount}</td>
                  <td className="py-3 px-4 text-primary font-semibold">{s.conversionRate}%</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold">
                    {formatCurrency(s.leadsCount * 32000)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
