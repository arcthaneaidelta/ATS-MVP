import { Contact, Opportunity, Message, Task, ActivityEvent, StageId } from '../data/types';

export interface DecisionLogEntry {
  id: string;
  timestamp: string;
  trigger: string;
  action: string;
  details: string;
}

export interface EngineState {
  lead: Contact;
  opportunity: Opportunity;
  messages: Message[];
  tasks: Task[];
  decisionLog: DecisionLogEntry[];
  simulatedHourOffset: number;
}

export type SimulatorEvent = 
  | 'reply_sms'
  | 'reply_email'
  | 'book_consultation'
  | 'cancel_booking'
  | 'text_stop'
  | 'submit_again'
  | 'miss_appointment'
  | 'mark_contacted'
  | 'takeover'
  | 'advance_hour'
  | 'advance_day';

export function runSimulatorEngine(
  currentState: EngineState,
  event: SimulatorEvent,
  nowIso = new Date().toISOString()
): EngineState {
  const state: EngineState = JSON.parse(JSON.stringify(currentState));
  const newLogId = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  switch (event) {
    case 'reply_sms':
    case 'reply_email': {
      const channel = event === 'reply_sms' ? 'SMS' : 'Email';
      // 1. Cancel all queued automated nudges
      let cancelledCount = 0;
      state.messages = state.messages.map(m => {
        if (m.status === 'queued') {
          cancelledCount++;
          return {
            ...m,
            status: 'cancelled',
            reason: `Cancelled: lead replied via ${channel}`,
          };
        }
        return m;
      });

      // 2. Add tag 'Engaged' and 'Needs Human'
      if (!state.lead.tags.includes('Engaged')) {
        state.lead.tags.push('Engaged');
      }
      if (!state.lead.tags.includes('Needs Human')) {
        state.lead.tags.push('Needs Human');
      }

      // 3. Create human handoff task for Dana
      const handoffTask: Task = {
        id: `task-reply-${Date.now()}`,
        contactId: state.lead.id,
        title: `Reply personally to ${state.lead.firstName} ${state.lead.lastName} (${channel} reply received)`,
        dueDate: 'Within 1 hour',
        assigneeId: 'user-dana',
        completed: false,
        createdAt: nowIso,
      };
      state.tasks.unshift(handoffTask);

      // 4. Decision log
      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: `Lead replied by ${channel}`,
        action: 'Immediate Outreach Stop & Human Handoff',
        details: `Cancelled ${cancelledCount} queued messages -> tagged [Engaged, Needs Human] -> created priority task for Dana Whitfield -> paused automations for 24h`,
      });
      break;
    }

    case 'book_consultation': {
      // Exit unresponsive flow, start appointment reminders, move stage
      state.lead.stage = 'consultation_booked';
      state.opportunity.stage = 'consultation_booked';

      // Cancel older unresponsive nudges
      state.messages = state.messages.map(m => {
        if (m.status === 'queued' && (m.templateId.includes('unresponsive') || m.templateId.includes('new-inq'))) {
          return {
            ...m,
            status: 'cancelled',
            reason: 'Cancelled: consultation booked',
          };
        }
        return m;
      });

      // Add appointment confirmation & reminder messages
      const confMsg: Message = {
        id: `msg-sim-conf-${Date.now()}`,
        contactId: state.lead.id,
        channel: 'sms',
        templateId: 'tpl-apt-conf',
        templateName: 'Appointment Confirmation SMS',
        content: `Confirmed! Your consultation with Dana Whitfield is set for this Thursday at 2:00 PM. Manage: alderandfinch.com/booking/apt-priya`,
        status: 'sent',
        scheduledFor: nowIso,
        sentAt: nowIso,
      };

      const reminder24h: Message = {
        id: `msg-sim-rem24-${Date.now()}`,
        contactId: state.lead.id,
        channel: 'sms',
        templateId: 'tpl-apt-24h',
        templateName: '24h Reminder SMS',
        content: `Hi ${state.lead.firstName}, confirming your design consultation tomorrow at 2:00 PM. Looking forward to walking through your space!`,
        status: 'queued',
        scheduledFor: new Date(Date.now() + 86400000).toISOString(),
      };

      const reminder2h: Message = {
        id: `msg-sim-rem2h-${Date.now()}`,
        contactId: state.lead.id,
        channel: 'sms',
        templateId: 'tpl-apt-2h',
        templateName: '2h Final Reminder SMS',
        content: `See you in 2 hours, ${state.lead.firstName}! Dana will join your video link at 2:00 PM.`,
        status: 'queued',
        scheduledFor: new Date(Date.now() + 86400000 + 7200000).toISOString(),
      };

      state.messages.unshift(reminder2h);
      state.messages.unshift(reminder24h);
      state.messages.unshift(confMsg);

      if (!state.lead.tags.includes('Consultation Booked')) {
        state.lead.tags.push('Consultation Booked');
      }

      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Lead booked design consultation',
        action: 'Workflow Transition: Reminders Active',
        details: `Exited "Unresponsive Lead" flow -> moved Opportunity to "Consultation Booked" -> sent instant confirmation SMS -> queued 24h & 2h reminders`,
      });
      break;
    }

    case 'cancel_booking': {
      // Stop reminders
      let cancelledCount = 0;
      state.messages = state.messages.map(m => {
        if (m.status === 'queued' && m.templateId.includes('apt-')) {
          cancelledCount++;
          return {
            ...m,
            status: 'cancelled',
            reason: 'Cancelled: appointment was cancelled by lead',
          };
        }
        return m;
      });

      // Queue gentle rebook nudge
      const rebookMsg: Message = {
        id: `msg-rebook-${Date.now()}`,
        contactId: state.lead.id,
        channel: 'sms',
        templateId: 'tpl-rebook-nudge',
        templateName: 'Rebook Notice & Link SMS',
        content: `Hi ${state.lead.firstName}, your appointment was cancelled. Whenever you're ready to reschedule your remodel consult, pick a new slot: alderandfinch.com/book`,
        status: 'queued',
        scheduledFor: new Date(Date.now() + 3600000).toISOString(),
      };
      state.messages.unshift(rebookMsg);

      // Create task for intake coordinator
      state.tasks.unshift({
        id: `task-cancel-${Date.now()}`,
        contactId: state.lead.id,
        title: `Follow up on cancelled booking for ${state.lead.firstName}`,
        dueDate: 'Tomorrow, 10:00 AM',
        assigneeId: 'user-marcus',
        completed: false,
        createdAt: nowIso,
      });

      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Lead cancelled consultation',
        action: 'Halt Reminders & Queue Gentle Rebook',
        details: `Cancelled ${cancelledCount} queued reminder messages -> queued polite rebooking SMS -> created intake task for Marcus Bell`,
      });
      break;
    }

    case 'text_stop': {
      // Opt-out TCPA compliance
      state.lead.consent.sms = false;
      state.lead.dnd.sms = true;
      if (!state.lead.tags.includes('Opted-out SMS')) {
        state.lead.tags.push('Opted-out SMS');
      }

      let cancelledSms = 0;
      state.messages = state.messages.map(m => {
        if (m.channel === 'sms' && m.status === 'queued') {
          cancelledSms++;
          return {
            ...m,
            status: 'cancelled',
            reason: 'Cancelled: lead opted out (STOP received)',
          };
        }
        return m;
      });

      // Compliant confirmation message
      const stopAck: Message = {
        id: `msg-stop-ack-${Date.now()}`,
        contactId: state.lead.id,
        channel: 'sms',
        templateId: 'tpl-tcpa-stop',
        templateName: 'Compliant Unsubscribe Acknowledgement',
        content: 'Alder & Finch: You have unsubscribed from SMS messages. No more messages will be sent. Reply HELP for help.',
        status: 'sent',
        scheduledFor: nowIso,
        sentAt: nowIso,
      };
      state.messages.unshift(stopAck);

      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Keyword "STOP" received via SMS',
        action: 'TCPA Compliance Enforcement',
        details: `Flagged contact with DND-SMS: true -> cancelled ${cancelledSms} scheduled SMS touches -> recorded timestamp -> delivered 1-time compliant opt-out confirmation. (Email remains active)`,
      });
      break;
    }

    case 'submit_again': {
      // Duplicate prevention demo
      if (!state.lead.tags.includes('Duplicate Prevented')) {
        state.lead.tags.push('Duplicate Prevented');
      }
      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Existing lead re-submitted website questionnaire',
        action: 'Deduplication Guard Fired',
        details: `Matched existing contact record (${state.lead.email}) -> merged updated answers into contact custom fields -> BLOCKED new inquiry workflow re-entry -> avoided duplicate text/email barrage`,
      });
      break;
    }

    case 'miss_appointment': {
      state.lead.stage = 'contacted';
      state.opportunity.stage = 'contacted';
      if (!state.lead.tags.includes('No-Show')) {
        state.lead.tags.push('No-Show');
      }

      const noShowMsg: Message = {
        id: `msg-noshow-${Date.now()}`,
        contactId: state.lead.id,
        channel: 'sms',
        templateId: 'tpl-noshow-15m',
        templateName: 'No-Show 15-Minute Recovery SMS',
        content: `Hi ${state.lead.firstName}, sorry we missed you today! Life happens. When you are ready to pick this back up, choose a new slot: alderandfinch.com/book`,
        status: 'queued',
        scheduledFor: new Date(Date.now() + 900000).toISOString(),
      };
      state.messages.unshift(noShowMsg);

      state.tasks.unshift({
        id: `task-noshow-${Date.now()}`,
        contactId: state.lead.id,
        title: `No-show check-in call with ${state.lead.firstName}`,
        dueDate: 'Within 24 hours',
        assigneeId: 'user-marcus',
        completed: false,
        createdAt: nowIso,
      });

      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Appointment marked No-Show',
        action: 'No-Show Recovery Flow Triggered',
        details: `Reverted opportunity to "Contacted" -> queued 15-min recovery SMS -> assigned manual follow-up task to Marcus Bell`,
      });
      break;
    }

    case 'mark_contacted': {
      state.lead.stage = 'contacted';
      state.opportunity.stage = 'contacted';
      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Staff marked lead as contacted',
        action: 'Pipeline Update',
        details: `Stage updated to Contacted -> verified 7-day unresponsive cadence active`,
      });
      break;
    }

    case 'takeover': {
      let cancelled = 0;
      state.messages = state.messages.map(m => {
        if (m.status === 'queued') {
          cancelled++;
          return {
            ...m,
            status: 'held',
            reason: 'Held: staff manual conversation takeover',
          };
        }
        return m;
      });

      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Staff clicked "Take Over Conversation"',
        action: 'Automations Held',
        details: `Held ${cancelled} automated messages in queue -> assigned live conversation to Dana Whitfield`,
      });
      break;
    }

    case 'advance_hour': {
      state.simulatedHourOffset += 1;
      let sentCount = 0;
      state.messages = state.messages.map(m => {
        if (m.status === 'queued') {
          sentCount++;
          return {
            ...m,
            status: 'sent',
            sentAt: nowIso,
          };
        }
        return m;
      });

      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Time Machine: Advanced clock by 1 Hour',
        action: 'Simulated Execution Triggered',
        details: `Clock advanced +1 hour -> executed ${sentCount} queued messages -> updated delivery statuses`,
      });
      break;
    }

    case 'advance_day': {
      state.simulatedHourOffset += 24;
      let sentCount = 0;
      state.messages = state.messages.map(m => {
        if (m.status === 'queued') {
          sentCount++;
          return {
            ...m,
            status: 'sent',
            sentAt: nowIso,
          };
        }
        return m;
      });

      state.decisionLog.unshift({
        id: newLogId,
        timestamp: timeLabel,
        trigger: 'Time Machine: Advanced clock by 1 Day (24 Hours)',
        action: 'Simulated Execution Triggered',
        details: `Clock advanced +24 hours -> stepped into Day 2 cadence -> executed ${sentCount} scheduled touches`,
      });
      break;
    }
  }

  return state;
}
