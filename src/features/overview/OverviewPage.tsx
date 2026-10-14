import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { MEETINGS_DATA } from '../../data/meetings';
import { FINDINGS_DATA } from '../../data/findings';
import { OutcomeChip, SeverityChip } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ArrowRight,
  Table
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedMeetingId } = useDemoStore();
  const [viewAsTable, setViewAsTable] = useState(false);

  const recentMeetings = MEETINGS_DATA.slice(0, 5);
  const topFindings = FINDINGS_DATA.slice(0, 3);

  const handleOpenMeeting = (id: string) => {
    setSelectedMeetingId(id);
    navigate('/app/trace');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold">
            Executive Summary
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B] mt-0.5">
            Pipeline Health & Reliability Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            A high-level diagnostic scorecard summarizing capture health, downstream delivery leakage, and trigger precision across recent onboarding calls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/app/trace">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Launch Pipeline Trace
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: Reliability Score Card + 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Reliability Score Card (Hero Metric) */}
        <div className="bg-[#FFFFFF] border-2 border-[#1F4B4A] rounded-[16px] p-5 shadow-[0_4px_16px_rgba(30,42,43,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#7B8786] mb-1">
              <span>RELIABILITY SCORE</span>
              <span className="text-[#3F7D5B] font-bold">BETA TARGET: 95</span>
            </div>
            <div className="flex items-baseline gap-2 my-2">
              <span className="font-serif text-5xl font-bold text-[#1E2A2B]">68</span>
              <span className="text-sm font-mono text-[#A8433A] font-bold">/ 100</span>
            </div>
            <p className="text-xs text-[#4A5757] leading-relaxed">
              Degraded by recurring calendar sync gaps and downstream webhook timeouts.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2DDD3] flex items-center justify-between text-xs">
            <span className="text-[#B4643C] font-semibold text-[11px] font-mono">
              +27 pts possible via surgical fixes
            </span>
            <Link to="/app/scope" className="text-[#1F4B4A] font-semibold hover:underline flex items-center gap-1">
              <span>View scope</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* KPI 1: Capture Rate */}
        <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786] block">
              Meeting Capture Rate
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="font-serif text-3xl font-bold text-[#1E2A2B]">77%</span>
              <span className="text-xs font-mono text-[#A8433A]">46 / 60 joined</span>
            </div>
            <p className="text-xs text-[#4A5757]">
              14 meetings missed before recording (recurrence exceptions, waiting room timeouts, OAuth).
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E2DDD3]">
            <Link to="/app/meetings" className="text-xs text-[#1F4B4A] hover:underline font-medium">
              View 12 missed calls →
            </Link>
          </div>
        </div>

        {/* KPI 2: Delivery Rate (Silent Loss) */}
        <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786] block">
              Delivery Reconciliation Rate
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="font-serif text-3xl font-bold text-[#B4643C]">76%</span>
              <span className="text-xs font-mono text-[#B4643C]">35 / 46 reached CRM</span>
            </div>
            <p className="text-xs text-[#4A5757]">
              <strong>9 recorded calls lost</strong> downstream before Monday.com update due to 504s and schema drops.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E2DDD3]">
            <Link to="/app/delivery" className="text-xs text-[#B4643C] hover:underline font-medium">
              Reconcile funnel leaks →
            </Link>
          </div>
        </div>

        {/* KPI 3: Signal Precision */}
        <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786] block">
              Signal Lab Precision
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="font-serif text-3xl font-bold text-[#3F7D5B]">96%</span>
              <span className="text-xs font-mono text-[#3F7D5B]">Context Schema</span>
            </div>
            <p className="text-xs text-[#4A5757]">
              Context-aware extraction eliminates 2 false positives while catching legal milestone delays.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E2DDD3]">
            <Link to="/app/signals" className="text-xs text-[#1F4B4A] hover:underline font-medium">
              Compare keyword vs context →
            </Link>
          </div>
        </div>
      </div>

      {/* Row 2: Where Meetings are Lost — Stage Breakdown Bar List */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
              Failure Stage Distribution
            </span>
            <h3 className="font-serif text-lg font-semibold text-[#1E2A2B]">
              Where Calls Leak Across the 6 Stages
            </h3>
          </div>
          <button
            onClick={() => setViewAsTable(!viewAsTable)}
            className="flex items-center gap-1.5 text-xs text-[#7B8786] hover:text-[#1E2A2B] px-2.5 py-1 rounded bg-[#FBF9F6] border border-[#E2DDD3] cursor-pointer"
          >
            <Table className="w-3.5 h-3.5" />
            <span>{viewAsTable ? 'View as Bars' : 'View as Table'}</span>
          </button>
        </div>

        {!viewAsTable ? (
          <div className="space-y-3">
            {[
              { stage: '1. Calendar Sync & Recurrence Match', count: 14, percent: 56, color: '#A8433A', note: 'Worst leak: recurring sub-instances ignored' },
              { stage: '2. Bot Scheduling & OAuth Dispatch', count: 4, percent: 16, color: '#1F4B4A', note: 'Expired OAuth refresh tokens' },
              { stage: '3. Bot Joined & Waiting Room', count: 3, percent: 12, color: '#B4643C', note: 'Host admitted after 10m timeout' },
              { stage: '4. Webhook Ingestion Delivery', count: 3, percent: 12, color: '#1F4B4A', note: '504 Gateway Timeouts on synchronous LLM' },
              { stage: '5. LLM Structured Extraction', count: 1, percent: 4, color: '#1F4B4A', note: 'Contextual polarity missed' }
            ].map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E2A2B]">{item.stage}</span>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-[#7B8786] hidden sm:inline">{item.note}</span>
                    <span className="font-bold text-[#1E2A2B]">{item.count} calls ({item.percent}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-[#E2DDD3]/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E2DDD3] text-[#7B8786] font-mono text-[11px]">
                  <th className="py-2 px-3">STAGE NAME</th>
                  <th className="py-2 px-3">DROPPED CALLS</th>
                  <th className="py-2 px-3">SHARE OF LOSS</th>
                  <th className="py-2 px-3">PRIMARY DIAGNOSIS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD3]/60">
                <tr>
                  <td className="py-2.5 px-3 font-medium">1. Calendar Sync & Recurrence Match</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#A8433A]">14 calls</td>
                  <td className="py-2.5 px-3 font-mono">56%</td>
                  <td className="py-2.5 px-3 text-[#4A5757]">Sub-instance recurrence rule detachment in Google Cal</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">2. Bot Scheduling & OAuth Dispatch</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1F4B4A]">4 calls</td>
                  <td className="py-2.5 px-3 font-mono">16%</td>
                  <td className="py-2.5 px-3 text-[#4A5757]">Unrefreshed Zoom 90-day OAuth token</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">3. Bot Joined & Waiting Room</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#B4643C]">3 calls</td>
                  <td className="py-2.5 px-3 font-mono">12%</td>
                  <td className="py-2.5 px-3 text-[#4A5757]">Host admitted after 10m default waiting room timeout</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">4. Webhook Ingestion Delivery</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-[#1F4B4A]">3 calls</td>
                  <td className="py-2.5 px-3 font-mono">12%</td>
                  <td className="py-2.5 px-3 text-[#4A5757]">HTTP 504 reverse proxy timeout on synchronous LLM run</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row 3: Top Findings (3 items) & Recent Meetings (5 items) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top Diagnostic Findings (Left 6 Cols) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
                Written Diagnostic Scope
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
                Top Findings for Scoped Fixes
              </h3>
            </div>
            <Link to="/app/findings" className="text-xs text-[#1F4B4A] hover:underline font-semibold">
              View all 6 →
            </Link>
          </div>

          <div className="space-y-3">
            {topFindings.map((f) => (
              <div
                key={f.id}
                onClick={() => navigate('/app/findings')}
                className="p-3.5 rounded-[12px] bg-[#FBF9F6] border border-[#E2DDD3] hover:border-[#1F4B4A] transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1F4B4A]">{f.id}</span>
                    <SeverityChip severity={f.severity} />
                  </div>
                  <span className="font-mono text-xs text-[#7B8786]">{f.effortHoursEstimate}</span>
                </div>
                <h4 className="text-xs font-semibold text-[#1E2A2B]">
                  {f.title}
                </h4>
                <p className="text-[11px] text-[#4A5757] line-clamp-2">
                  <strong className="text-[#1E2A2B]">Smallest fix:</strong> {f.smallestFixSummary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analyzed Meetings (Right 6 Cols) */}
        <div className="lg:col-span-6 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
                Recent Forensics Sample
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
                Recent Analyzed Calls
              </h3>
            </div>
            <Link to="/app/meetings" className="text-xs text-[#1F4B4A] hover:underline font-semibold">
              View all 30 →
            </Link>
          </div>

          <div className="space-y-2">
            {recentMeetings.map((m) => (
              <div
                key={m.id}
                onClick={() => handleOpenMeeting(m.id)}
                className="p-3 rounded-[10px] bg-[#FBF9F6] border border-[#E2DDD3] hover:bg-[#E3EDEB] hover:border-[#1F4B4A] transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#1F4B4A]">{m.id}</span>
                    <span className="font-semibold text-[#1E2A2B] truncate">{m.title}</span>
                  </div>
                  <div className="text-[11px] text-[#7B8786] truncate">
                    {m.account} · {m.platform}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <OutcomeChip outcome={m.outcome} size="sm" />
                  <ArrowRight className="w-3.5 h-3.5 text-[#7B8786]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
