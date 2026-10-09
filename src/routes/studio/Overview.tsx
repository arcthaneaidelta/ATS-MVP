import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Button } from '../../components/ui/Button';
import { 
  ArrowRight, Clock, MessageSquare, AlertCircle, 
  Calendar as CalendarIcon, PhoneCall, CheckCircle2, 
  UserCheck, ShieldCheck, ChevronDown, ChevronUp, 
  Sparkles, ExternalLink, Zap, RefreshCw 
} from 'lucide-react';

export const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { contacts, opportunities, appointments, activity, tasks } = useAppStore();

  const [feedFilter, setFeedFilter] = useState<'all' | 'lead' | 'message' | 'call' | 'system'>('all');
  const [auditExpanded, setAuditExpanded] = useState(true);

  // Check error trigger parameter ?fail=overview
  if (searchParams.get('fail') === 'overview') {
    return (
      <div className="p-8 bg-surface-elevated rounded-modal border border-error/30 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-error mx-auto" />
        <h2 className="text-lg font-semibold text-text">Overview Service Interruption (Test State)</h2>
        <p className="text-xs text-text-muted">
          You accessed the simulated failure test URL (?fail=overview). Real GoHighLevel webhooks feature exponential retry backing.
        </p>
        <Button variant="primary" size="sm" onClick={() => navigate('/studio')}>
          Retry & Clear Error
        </Button>
      </div>
    );
  }

  // Filtered activity
  const filteredActivity = activity.filter(item => {
    if (feedFilter === 'all') return true;
    return item.type === feedFilter;
  });

  // Calculate live counts
  const newInquiriesCount = contacts.filter(c => c.stage === 'new_inquiry').length;
  const bookedCount = opportunities.filter(o => o.stage === 'consultation_booked').length;
  const qualifiedCount = opportunities.filter(o => o.stage === 'qualified').length;
  const wonCount = opportunities.filter(o => o.stage === 'won').length;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-fast">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Operations Overview</h1>
          <p className="text-xs text-text-muted mt-1">
            Real-time pipeline pulse, incoming lead triage, and safety-verified automations for Alder & Finch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/studio/simulator')}
            icon={<Zap className="w-3.5 h-3.5 text-accent" />}
          >
            Launch Simulator
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/studio/pipeline')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Pipeline Kanban
          </Button>
        </div>
      </div>

      {/* 1. Needs Action Cards (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div 
          onClick={() => navigate('/studio/pipeline')}
          className="p-4 bg-surface-elevated rounded-card border border-border shadow-sh-1 hover:border-warning/60 hover:shadow-sh-2 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-warning uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Triage Needed
            </span>
            <span className="text-lg font-bold text-text bg-warning/15 px-2 py-0.5 rounded-chip">
              {newInquiriesCount}
            </span>
          </div>
          <div className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
            {newInquiriesCount} leads waiting for first triage
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1">
            <span>Oldest: 38 minutes</span>
            <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Triage now →
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => navigate('/studio/calendar')}
          className="p-4 bg-surface-elevated rounded-card border border-border shadow-sh-1 hover:border-error/60 hover:shadow-sh-2 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-error uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Recovery Active
            </span>
            <span className="text-lg font-bold text-text bg-error/15 px-2 py-0.5 rounded-chip">
              2
            </span>
          </div>
          <div className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
            2 no-shows to rebook
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1">
            <span>Kevin Patel & Camille Duarte</span>
            <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              View calendar →
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div 
          onClick={() => navigate('/studio/simulator')}
          className="p-4 bg-surface-elevated rounded-card border border-border shadow-sh-1 hover:border-accent/60 hover:shadow-sh-2 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              Human Handoff
            </span>
            <span className="text-lg font-bold text-text bg-accent-soft px-2 py-0.5 rounded-chip">
              1
            </span>
          </div>
          <div className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
            1 handoff requested by Priya R.
          </div>
          <div className="text-[11px] text-text-muted flex items-center justify-between pt-1">
            <span>Automations paused for 24h</span>
            <span className="font-semibold text-accent group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Test in simulator →
            </span>
          </div>
        </div>
      </div>

      {/* 2. Today KPI Row (4 Metric Cards with SVG Sparklines) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 bg-surface rounded-card border border-border space-y-2">
          <div className="text-xs text-text-muted font-medium">New Inquiries (30d)</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-text font-serif">46</div>
            <div className="text-[11px] font-semibold text-success">+14% vs last mo</div>
          </div>
          {/* 7-point SVG Sparkline */}
          <svg className="w-full h-7 stroke-primary fill-none" viewBox="0 0 100 24">
            <polyline
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,18 16,16 32,19 48,12 64,14 80,6 100,4"
            />
          </svg>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-surface rounded-card border border-border space-y-2">
          <div className="text-xs text-text-muted font-medium">Booked Consultations</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-text font-serif">{bookedCount}</div>
            <div className="text-[11px] font-semibold text-success">+22% vs last mo</div>
          </div>
          <svg className="w-full h-7 stroke-primary fill-none" viewBox="0 0 100 24">
            <polyline
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,20 16,18 32,15 48,14 64,8 80,10 100,5"
            />
          </svg>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-surface rounded-card border border-border space-y-2">
          <div className="text-xs text-text-muted font-medium">Show Rate (30d)</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-text font-serif">78.5%</div>
            <div className="text-[11px] font-semibold text-success">+6.2% show-up</div>
          </div>
          <svg className="w-full h-7 stroke-primary fill-none" viewBox="0 0 100 24">
            <polyline
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,14 16,16 32,12 48,15 64,9 80,7 100,6"
            />
          </svg>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-surface rounded-card border border-border space-y-2">
          <div className="text-xs text-text-muted font-medium">Median Speed to Lead</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-primary font-serif">4.2 min</div>
            <div className="text-[11px] font-semibold text-success">Down from 38m</div>
          </div>
          <svg className="w-full h-7 stroke-accent fill-none" viewBox="0 0 100 24">
            <polyline
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,22 16,19 32,15 48,10 64,8 80,5 100,4"
            />
          </svg>
        </div>
      </div>

      {/* 3. Horizontal 5-Node Journey Strip */}
      <div className="bg-surface-elevated p-5 rounded-modal border border-border space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-text uppercase tracking-wider">The End-to-End Remodel Journey</span>
          <span className="text-text-muted">Click any stage to drill down</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          <div 
            onClick={() => navigate('/start')}
            className="p-3 rounded-card bg-sunken hover:bg-border/60 cursor-pointer border border-border transition-all"
          >
            <div className="text-[10px] font-semibold text-text-muted uppercase">1. Capture</div>
            <div className="text-base font-bold text-text mt-0.5">{contacts.length} Leads</div>
            <div className="text-[10px] text-text-muted">Web + Voice Survey</div>
          </div>

          <div 
            onClick={() => navigate('/studio/pipeline')}
            className="p-3 rounded-card bg-sunken hover:bg-border/60 cursor-pointer border border-border transition-all"
          >
            <div className="text-[10px] font-semibold text-text-muted uppercase">2. Qualify</div>
            <div className="text-base font-bold text-text mt-0.5">{qualifiedCount} Qualified</div>
            <div className="text-[10px] text-text-muted">Scope & Budget Checked</div>
          </div>

          <div 
            onClick={() => navigate('/studio/calendar')}
            className="p-3 rounded-card bg-sunken hover:bg-border/60 cursor-pointer border border-border transition-all"
          >
            <div className="text-[10px] font-semibold text-text-muted uppercase">3. Book</div>
            <div className="text-base font-bold text-primary mt-0.5">{bookedCount} Scheduled</div>
            <div className="text-[10px] text-text-muted">45-min Consultations</div>
          </div>

          <div 
            onClick={() => navigate('/studio/workflows')}
            className="p-3 rounded-card bg-sunken hover:bg-border/60 cursor-pointer border border-border transition-all"
          >
            <div className="text-[10px] font-semibold text-text-muted uppercase">4. Follow Up</div>
            <div className="text-base font-bold text-text mt-0.5">5 Active Flows</div>
            <div className="text-[10px] text-text-muted">Auto Stop on Reply</div>
          </div>

          <div 
            onClick={() => navigate('/studio/reports')}
            className="p-3 rounded-card bg-sunken hover:bg-border/60 cursor-pointer border border-border transition-all"
          >
            <div className="text-[10px] font-semibold text-text-muted uppercase">5. Track</div>
            <div className="text-base font-bold text-success mt-0.5">{wonCount} Won</div>
            <div className="text-[10px] text-text-muted">Revenue & Show Rates</div>
          </div>
        </div>
      </div>

      {/* 4. Pre-Flight Audit Card & Live Activity Feed (Side-by-Side Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Pre-Flight Audit findings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface rounded-modal border border-border overflow-hidden">
            <div 
              onClick={() => setAuditExpanded(!auditExpanded)}
              className="p-4.5 bg-surface-elevated border-b border-border flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-text">Pre-Flight Audit of Live Workflows</h3>
                  <p className="text-[11px] text-text-muted">Pre-deployment safeguards to prevent duplicate messages</p>
                </div>
              </div>
              <button className="text-text-muted">
                {auditExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {auditExpanded && (
              <div className="p-5 space-y-3.5 text-xs text-text-2">
                <div className="p-3 rounded-card bg-primary-soft/50 border border-primary/20 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-text">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      Legacy 'Missed Call Text-Back' Paused
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-success/15 text-success font-bold">Resolved</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Identified potential race condition with Finch Assist (Retell AI). Legacy SMS paused safely in GHL without deleting historical data.
                  </p>
                </div>

                <div className="p-3 rounded-card bg-sunken border border-border space-y-1">
                  <div className="flex items-center justify-between font-semibold text-text">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      2 Live Workflows Inspected & Cataloged
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary-soft text-primary font-bold">Verified</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Existing contact tags and pipeline stages mapped 1:1 into new custom fields taxonomy.
                  </p>
                </div>

                <div className="p-3 rounded-card bg-sunken border border-border space-y-1">
                  <div className="flex items-center justify-between font-semibold text-text">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      DND / TCPA STOP Keyword Validation
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary-soft text-primary font-bold">Compliant</span>
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Tested inbound carrier opt-out webhook. Outbound queues instantly abort on STOP keywords.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Pending Tasks preview */}
          <div className="bg-surface rounded-modal border border-border p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text uppercase tracking-wider">High Priority Staff Tasks</span>
              <button onClick={() => navigate('/studio/pipeline')} className="text-primary font-semibold hover:underline">
                View All Tasks →
              </button>
            </div>
            <div className="space-y-2">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="p-3 rounded-card bg-surface-elevated border border-border text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium text-text">{task.title}</div>
                    <div className="text-[10px] text-text-muted">Due: {task.dueDate}</div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sunken text-text-2">
                    Dana Whitfield
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Reverse-Chronological Activity Feed (360px) */}
        <div className="lg:col-span-5 bg-surface-elevated rounded-modal border border-border p-5 space-y-4 shadow-sh-1">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-text">Live Activity Feed</h3>
              <p className="text-[11px] text-text-muted">Synchronized in real-time across tabs</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['all', 'lead', 'message', 'call', 'system'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setFeedFilter(filter)}
                className={`text-[11px] px-2.5 py-1 rounded-chip border capitalize font-medium transition-all ${
                  feedFilter === filter
                    ? 'bg-primary text-surface border-primary font-semibold'
                    : 'bg-sunken text-text-2 border-border hover:border-border-strong'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Activity items list */}
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredActivity.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No activity matching this filter.
              </div>
            ) : (
              filteredActivity.map((event) => {
                const icon = event.type === 'booking' ? (
                  <CalendarIcon className="w-4 h-4 text-primary" />
                ) : event.type === 'call' ? (
                  <PhoneCall className="w-4 h-4 text-accent" />
                ) : event.type === 'message' ? (
                  <MessageSquare className="w-4 h-4 text-info" />
                ) : event.type === 'system' ? (
                  <ShieldCheck className="w-4 h-4 text-warning" />
                ) : (
                  <Sparkles className="w-4 h-4 text-primary" />
                );

                return (
                  <div
                    key={event.id}
                    className={`p-3 rounded-card border text-xs transition-all space-y-1 ${
                      event.highlight
                        ? 'bg-accent-soft/30 border-accent/40 shadow-xs'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-text">
                        {icon}
                        <span>{event.title}</span>
                      </div>
                      <span className="text-[10px] text-text-muted">{event.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-text-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
