import React from 'react';
import { useAppStore } from '../../store';
import { SimulatorEvent } from '../../mock/engine';
import { Button } from '../../components/ui/Button';
import { 
  Zap, MessageSquare, Mail, Calendar as CalendarIcon, 
  RotateCcw, ShieldAlert, FastForward, Clock, 
  UserCheck, AlertTriangle, ArrowRight, CheckCircle2, 
  Ban, ShieldCheck, Sparkles 
} from 'lucide-react';

export const Simulator: React.FC = () => {
  const { simulatorState, fireSimulatorEvent, resetSimulatorLead } = useAppStore();
  const { lead, opportunity, messages, tasks, decisionLog, simulatedHourOffset } = simulatorState;

  const leadEvents: { label: string; event: SimulatorEvent; icon: React.ReactNode; rule: string; variant?: 'primary' | 'ghost' | 'danger' | 'accent' }[] = [
    {
      label: 'Reply by SMS',
      event: 'reply_sms',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      rule: 'Cancels queued robot touches, tags Engaged, creates handoff task for Dana',
      variant: 'primary',
    },
    {
      label: 'Reply by Email',
      event: 'reply_email',
      icon: <Mail className="w-3.5 h-3.5" />,
      rule: 'Same stop-and-handoff behavior across email channel',
      variant: 'ghost',
    },
    {
      label: 'Book Consultation',
      event: 'book_consultation',
      icon: <CalendarIcon className="w-3.5 h-3.5" />,
      rule: 'Exits Unresponsive flow, moves to Consultation Booked, starts reminder flow',
      variant: 'accent',
    },
    {
      label: 'Cancel Booking',
      event: 'cancel_booking',
      icon: <Ban className="w-3.5 h-3.5" />,
      rule: 'Halts 24h & 2h reminders, queues polite rebook SMS, creates intake task',
      variant: 'ghost',
    },
    {
      label: 'Text "STOP" (Opt Out)',
      event: 'text_stop',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      rule: 'Strict TCPA compliance: Enables DND-SMS, aborts SMS queue, sends 1 compliant notice',
      variant: 'danger',
    },
    {
      label: 'Submit Form Again',
      event: 'submit_again',
      icon: <RotateCcw className="w-3.5 h-3.5" />,
      rule: 'Deduplication engine merges data into existing lead; blocks duplicate welcome SMS',
      variant: 'ghost',
    },
    {
      label: 'Miss Consultation (No-Show)',
      event: 'miss_appointment',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      rule: 'Reverts stage to Contacted, triggers 15-min recovery SMS and rebooking task',
      variant: 'ghost',
    },
  ];

  const teamEvents: { label: string; event: SimulatorEvent; icon: React.ReactNode; rule: string }[] = [
    {
      label: 'Mark as Contacted',
      event: 'mark_contacted',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      rule: 'Advances lead stage to Contacted in pipeline',
    },
    {
      label: 'Take Over Conversation',
      event: 'takeover',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      rule: 'Puts all automated scheduled touches on hold for manual staff care',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-text">Workflow Simulator</h1>
            <span className="px-2 py-0.5 rounded-chip text-[11px] font-semibold bg-accent-soft text-accent">
              Hero Feature
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Simulate real homeowner actions (Replies, STOP opt-outs, Bookings, Duplicates) and watch the automation engine react live.
          </p>
        </div>

        {/* Time machine & Reset controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-input border border-border bg-surface p-0.5">
            <button
              onClick={() => fireSimulatorEvent('advance_hour')}
              className="px-2.5 py-1 text-xs font-semibold text-text hover:bg-sunken rounded flex items-center gap-1.5 transition-colors"
              title="Fast-forward clock 1 hour"
            >
              <FastForward className="w-3 h-3 text-accent" />
              <span>+1 Hour</span>
            </button>
            <button
              onClick={() => fireSimulatorEvent('advance_day')}
              className="px-2.5 py-1 text-xs font-semibold text-text hover:bg-sunken rounded flex items-center gap-1.5 transition-colors"
              title="Fast-forward clock 1 day"
            >
              <FastForward className="w-3 h-3 text-accent" />
              <span>+1 Day</span>
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetSimulatorLead}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Lead
          </Button>
        </div>
      </div>

      {/* Simulator 3-Zone Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ZONE 1: LEAD CARD (Left 3.5 cols) */}
        <div className="lg:col-span-3.5 bg-surface rounded-modal border border-border p-5 space-y-5 shadow-sh-1">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-semibold text-text uppercase tracking-wider">Test Subject Lead</span>
            <span className="text-[10px] font-mono text-text-muted">
              {simulatedHourOffset > 0 ? `+${simulatedHourOffset}h simulated` : 'Real Time'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-soft text-accent font-serif font-bold text-base flex items-center justify-center">
              PR
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">{lead.firstName} {lead.lastName}</h3>
              <div className="text-xs text-text-muted">{lead.email}</div>
              <div className="text-xs text-text-muted">{lead.phone}</div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-text-2 bg-sunken/60 p-3.5 rounded-card border border-border">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Pipeline Stage:</span>
              <span className="font-semibold text-text capitalize">{lead.stage.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Active Flow:</span>
              <span className="font-semibold text-primary truncate max-w-[150px]">
                {lead.stage === 'consultation_booked' ? '3. Appointment Reminders' : '2. Unresponsive Lead'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Assignee:</span>
              <span className="font-medium text-text">Marcus Bell</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">SMS Consent:</span>
              <span className={lead.dnd.sms ? 'font-bold text-error' : 'font-semibold text-success'}>
                {lead.dnd.sms ? 'DND-SMS (Opted Out)' : 'Active (✓)'}
              </span>
            </div>
          </div>

          {/* Active Tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Contact Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map(t => (
                <span
                  key={t}
                  className={`text-[10px] px-2 py-0.5 rounded-chip font-medium border ${
                    t.includes('Opted-out')
                      ? 'bg-error/15 text-error border-error/20'
                      : t.includes('Engaged') || t.includes('Human')
                      ? 'bg-accent-soft text-accent border-accent/30 font-bold'
                      : 'bg-sunken text-text-2 border-border'
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Active Tasks created for this lead */}
          {tasks.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-[11px] font-semibold text-text uppercase tracking-wider block">
                Auto-Created Staff Tasks ({tasks.length})
              </span>
              <div className="space-y-1.5">
                {tasks.map(t => (
                  <div key={t.id} className="p-2 rounded bg-surface-elevated border border-border text-xs">
                    <div className="font-medium text-text">{t.title}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">Due: {t.dueDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ZONE 2: EVENT CONTROLS (Center 4 cols) */}
        <div className="lg:col-span-4 bg-surface rounded-modal border border-border p-5 space-y-6 shadow-sh-1">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wider block mb-1">
              Trigger Real-World Events
            </span>
            <h3 className="text-sm font-bold text-text">Lead Does Something</h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Press an action to verify how the rules engine halts or reroutes follow-up.
            </p>
          </div>

          <div className="space-y-2.5">
            {leadEvents.map((item) => (
              <div key={item.label} className="space-y-1">
                <Button
                  variant={item.variant || 'ghost'}
                  size="sm"
                  className="w-full justify-start text-xs font-semibold"
                  icon={item.icon}
                  onClick={() => fireSimulatorEvent(item.event)}
                >
                  {item.label}
                </Button>
                <p className="text-[10px] text-text-muted pl-1 leading-snug">
                  {item.rule}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border space-y-2.5">
            <h3 className="text-sm font-bold text-text">Team Does Something</h3>
            {teamEvents.map((item) => (
              <div key={item.label} className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs font-semibold border-border-strong"
                  icon={item.icon}
                  onClick={() => fireSimulatorEvent(item.event)}
                >
                  {item.label}
                </Button>
                <p className="text-[10px] text-text-muted pl-1 leading-snug">
                  {item.rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ZONE 3: OUTBOUND QUEUE & DECISION LOG (Right 4.5 cols) */}
        <div className="lg:col-span-4.5 space-y-6">
          {/* Outbound Queue */}
          <div className="bg-surface-elevated rounded-modal border border-border p-5 space-y-3.5 shadow-sh-1">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-1.5 font-semibold text-text text-xs uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Outbound Message Queue</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sunken text-text-muted font-bold">
                {messages.filter(m => m.status === 'queued').length} Queued
              </span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {messages.map((msg) => {
                const isCancelled = msg.status === 'cancelled';
                const isSent = msg.status === 'sent';
                const isHeld = msg.status === 'held';

                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-card border text-xs transition-all space-y-1 ${
                      isCancelled
                        ? 'bg-sunken/40 border-border opacity-70'
                        : isSent
                        ? 'bg-success/5 border-success/20'
                        : isHeld
                        ? 'bg-warning/10 border-warning/30'
                        : 'bg-surface border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className="uppercase text-[10px] px-1 rounded bg-sunken">
                          {msg.channel}
                        </span>
                        <span className={isCancelled ? 'line-through text-text-muted' : 'text-text'}>
                          {msg.templateName}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSent ? 'bg-success/15 text-success' :
                        isCancelled ? 'bg-error/15 text-error' :
                        isHeld ? 'bg-warning/15 text-[#8F661B]' :
                        'bg-primary-soft text-primary'
                      }`}>
                        {msg.status.toUpperCase()}
                      </span>
                    </div>

                    <p className={`text-[11px] leading-relaxed ${isCancelled ? 'line-through text-text-muted' : 'text-text-2'}`}>
                      {msg.content}
                    </p>

                    {msg.reason && (
                      <div className="text-[10px] text-error font-semibold pt-0.5">
                        ↳ {msg.reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decision Log */}
          <div className="bg-surface rounded-modal border border-border p-5 space-y-3 shadow-sh-1">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-semibold text-text uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                Plain-English Decision Log
              </span>
              <span className="text-[10px] text-text-muted">Audit Trail</span>
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
              {decisionLog.map((log) => (
                <div key={log.id} className="p-3 bg-surface-elevated rounded-card border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-text-muted">
                    <span className="font-semibold text-accent uppercase">{log.trigger}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="font-semibold text-text text-xs">{log.action}</div>
                  <p className="text-[11px] text-text-2 leading-relaxed font-mono text-[10px] bg-sunken/60 p-2 rounded">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
