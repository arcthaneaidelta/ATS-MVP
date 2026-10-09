import { Task, Note, ActivityEvent, CustomFieldDefinition, TagDefinition, SourceDefinition } from '../../data/types';

export const SEED_TASKS: Task[] = [
  {
    id: 'task-1',
    contactId: 'contact-maya',
    title: 'Review Maya Okafor kitchen intake questionnaire & photos',
    dueDate: 'Today, 2:00 PM',
    assigneeId: 'user-dana',
    completed: false,
    createdAt: '2026-10-09T08:15:00Z',
  },
  {
    id: 'task-2',
    contactId: 'contact-priya',
    title: 'Call Priya Raman: Discuss Sellwood bathroom layout questions',
    dueDate: 'Today, 4:00 PM',
    assigneeId: 'user-marcus',
    completed: false,
    createdAt: '2026-10-08T14:25:00Z',
  },
  {
    id: 'task-3',
    contactId: 'contact-hannah',
    title: 'Triage new spa bathroom inquiry (Hannah Sorenson)',
    dueDate: 'Today, 12:00 PM',
    assigneeId: 'user-marcus',
    completed: false,
    createdAt: '2026-10-08T18:45:00Z',
  },
  {
    id: 'task-4',
    contactId: 'contact-jonas',
    title: 'Prepare Mt. Tabor architectural precedents for video consultation',
    dueDate: 'Tomorrow, 9:00 AM',
    assigneeId: 'user-dana',
    completed: false,
    createdAt: '2026-10-08T09:30:00Z',
  },
  {
    id: 'task-5',
    contactId: 'contact-wen',
    title: 'Send formal Lake Oswego luxury kitchen design agreement',
    dueDate: 'Tomorrow, 5:00 PM',
    assigneeId: 'user-elena',
    completed: false,
    createdAt: '2026-10-07T11:00:00Z',
  },
  {
    id: 'task-6',
    contactId: 'contact-rachel',
    title: 'Follow up on Overlook bungalow estimate review',
    dueDate: 'Oct 11, 2:00 PM',
    assigneeId: 'user-elena',
    completed: false,
    createdAt: '2026-10-06T15:00:00Z',
  },
  {
    id: 'task-7',
    contactId: 'contact-kevin',
    title: 'Re-engage no-show lead Kevin Patel with new calendar link',
    dueDate: 'Oct 10, 11:00 AM',
    assigneeId: 'user-marcus',
    completed: true,
    createdAt: '2026-10-07T16:00:00Z',
  },
  {
    id: 'task-8',
    contactId: 'contact-tom-1',
    title: 'Verify Laurelhurst historic district zoning restrictions',
    dueDate: 'Oct 12, 10:00 AM',
    assigneeId: 'user-dana',
    completed: false,
    createdAt: '2026-10-07T11:10:00Z',
  },
];

export const SEED_NOTES: Note[] = [
  {
    id: 'note-1',
    contactId: 'contact-maya',
    author: 'Dana Whitfield',
    content: 'Client requested white oak fluted details and natural soapstone. Home was built in 1928, existing wiring might need upgrade before induction range.',
    createdAt: '2026-10-09T08:20:00Z',
  },
  {
    id: 'note-2',
    contactId: 'contact-priya',
    author: 'Marcus Bell',
    content: 'Priya indicated she wants to keep original clawfoot tub if possible while expanding the shower enclosure.',
    createdAt: '2026-10-08T15:10:00Z',
  },
  {
    id: 'note-3',
    contactId: 'contact-tom-1',
    author: 'Dana Whitfield',
    content: 'Merged duplicate submission from Thomas Lindqvist. Same phone and address. Phased project starting with kitchen.',
    createdAt: '2026-10-07T11:20:00Z',
  },
  {
    id: 'note-4',
    contactId: 'contact-wen',
    author: 'Elena Ruiz',
    content: 'Client visited studio showroom to inspect custom walnut sample finishes. Looking for November start.',
    createdAt: '2026-10-06T16:30:00Z',
  },
];

export const SEED_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act-1',
    type: 'booking',
    title: 'Consultation Booked',
    description: 'Maya Okafor booked an in-home design consultation for tomorrow at 2:00 PM PST',
    contactId: 'contact-maya',
    timestamp: '8 minutes ago',
    highlight: true,
  },
  {
    id: 'act-2',
    type: 'message',
    title: 'SMS Sent',
    description: 'Automated appointment confirmation sent to Maya Okafor (503) 555-0142',
    contactId: 'contact-maya',
    timestamp: '8 minutes ago',
  },
  {
    id: 'act-3',
    type: 'lead',
    title: 'New Intake Survey',
    description: 'Aaron Wong submitted a Kitchen & Mudroom inquiry ($25k–$50k band)',
    contactId: 'contact-aaron',
    timestamp: '42 minutes ago',
  },
  {
    id: 'act-4',
    type: 'call',
    title: 'Finch Assist Call Completed',
    description: 'Outbound call with Jonas Albrecht (2m 22s) -> Qualified & Booked',
    contactId: 'contact-jonas',
    timestamp: '1 hour ago',
  },
  {
    id: 'act-5',
    type: 'system',
    title: 'Duplicate Contact Prevented',
    description: 'Form submission matched existing record for Thomas Lindqvist. Fields merged cleanly without duplicate messaging.',
    contactId: 'contact-tom-1',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-6',
    type: 'message',
    title: 'Opt-out Compliance Recorded',
    description: 'Camille Duarte replied STOP. DND-SMS enabled. Outbound SMS queue paused.',
    contactId: 'contact-camille',
    timestamp: '3 hours ago',
  },
  {
    id: 'act-7',
    type: 'lead',
    title: 'Stage Changed to Won',
    description: 'Marcus Kovacs moved to Won ($84,000 contract). Onboarding workflow triggered.',
    contactId: 'contact-marcus-k',
    timestamp: 'Yesterday',
  },
];

export const SEED_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  {
    id: 'cf-project-type',
    name: 'Project Type',
    key: 'project_type',
    type: 'select',
    usedInCount: 14,
    locations: ['Intake Form', 'Retell Voice Agent', 'Pipeline Cards', 'Workflow 1, 2, 5'],
  },
  {
    id: 'cf-budget-band',
    name: 'Budget Band',
    key: 'budget_band',
    type: 'select',
    usedInCount: 12,
    locations: ['Intake Form', 'Retell Voice Agent', 'Qualification Filter', 'Reports'],
  },
  {
    id: 'cf-start-window',
    name: 'Start Window',
    key: 'start_window',
    type: 'select',
    usedInCount: 9,
    locations: ['Intake Form', 'Retell Voice Agent', 'Nurture Triggers'],
  },
  {
    id: 'cf-owner-occupied',
    name: 'Property Owner',
    key: 'owner_occupied',
    type: 'boolean',
    usedInCount: 8,
    locations: ['Intake Form', 'Qualification Rule', 'Stage Triage'],
  },
  {
    id: 'cf-zip-code',
    name: 'Zip Code',
    key: 'zip_code',
    type: 'text',
    usedInCount: 11,
    locations: ['Intake Form', 'Service Area Check', 'Territory Routing'],
  },
  {
    id: 'cf-consent-ts',
    name: 'Consent Timestamp',
    key: 'consent_timestamp',
    type: 'timestamp',
    usedInCount: 16,
    locations: ['A2P Compliance', 'Contact Detail', 'Audit Log'],
  },
  {
    id: 'cf-last-call-outcome',
    name: 'Last Call Outcome',
    key: 'last_call_outcome',
    type: 'text',
    usedInCount: 7,
    locations: ['Retell Webhook', 'Voice Feed', 'Staff Notifications'],
  },
  {
    id: 'cf-booking-status',
    name: 'Booking Status',
    key: 'booking_status',
    type: 'select',
    usedInCount: 18,
    locations: ['Calendar', 'Workflow 3, 4', 'Pipeline Stages'],
  },
];

export const SEED_TAGS: TagDefinition[] = [
  { id: 'tag-1', name: 'Kitchen', category: 'Intent', count: 12, color: 'bg-primary-soft text-primary' },
  { id: 'tag-2', name: 'Bathroom', category: 'Intent', count: 6, color: 'bg-primary-soft text-primary' },
  { id: 'tag-3', name: 'Whole Home', category: 'Intent', count: 5, color: 'bg-primary-soft text-primary' },
  { id: 'tag-4', name: 'High Intent', category: 'Lifecycle', count: 7, color: 'bg-accent-soft text-accent' },
  { id: 'tag-5', name: 'Qualified Voice', category: 'Lifecycle', count: 5, color: 'bg-accent-soft text-accent' },
  { id: 'tag-6', name: 'Needs Human', category: 'Lifecycle', count: 3, color: 'bg-warning/15 text-warning' },
  { id: 'tag-7', name: 'Opted-out SMS', category: 'Compliance', count: 3, color: 'bg-error/15 text-error' },
  { id: 'tag-8', name: 'Website Form', category: 'Source', count: 11, color: 'bg-sunken text-text-2' },
  { id: 'tag-9', name: 'Voice Agent', category: 'Source', count: 5, color: 'bg-sunken text-text-2' },
];

export const SEED_SOURCES: SourceDefinition[] = [
  { id: 'src-1', source: 'Website Intake Form', utmSource: 'website_funnel', leadsCount: 46, conversionRate: 41.2 },
  { id: 'src-2', source: 'Finch Assist (Voice Agent)', utmSource: 'retell_voice', leadsCount: 22, conversionRate: 36.4 },
  { id: 'src-3', source: 'Google Business Profile', utmSource: 'gmb_local', leadsCount: 14, conversionRate: 35.7 },
  { id: 'src-4', source: 'Client Referral', utmSource: 'referral_direct', leadsCount: 11, conversionRate: 63.6 },
  { id: 'src-5', source: 'Facebook Ad Campaign', utmSource: 'meta_pdx_remodel', leadsCount: 7, conversionRate: 28.5 },
];

export interface ReadinessItem {
  id: string;
  category: 'Domain & Email' | 'Phone & SMS' | 'Voice & AI' | 'Migration & Safety';
  title: string;
  description: string;
  owner: 'Agency' | 'Client' | 'Carrier / Third-Party' | 'Agency & Client';
  typicalWait: string;
  status: 'verified' | 'pending_external' | 'action_needed';
  details?: {
    records?: { type: string; host: string; value: string; status: 'ok' | 'checking' | 'pending' }[];
    notes?: string;
  };
}

export const SEED_READINESS: ReadinessItem[] = [
  {
    id: 'rd-1',
    category: 'Domain & Email',
    title: 'Sending Domain DNS Authentication (SPF, DKIM, DMARC)',
    description: 'Subdomain mail.alderandfinch.com isolated for transactional and funnel notifications with strict DMARC alignment.',
    owner: 'Agency',
    typicalWait: '24–48 hours for DNS propagation',
    status: 'verified',
    details: {
      records: [
        { type: 'TXT', host: 'mail.alderandfinch.com', value: 'v=spf1 include:mailgun.org ~all', status: 'ok' },
        { type: 'TXT', host: 'krs._domainkey.mail.alderandfinch.com', value: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...', status: 'ok' },
        { type: 'TXT', host: '_dmarc.mail.alderandfinch.com', value: 'v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@alderandfinch.com', status: 'ok' },
        { type: 'CNAME', host: 'email.mail.alderandfinch.com', value: 'mailgun.org', status: 'ok' },
      ],
    },
  },
  {
    id: 'rd-2',
    category: 'Domain & Email',
    title: 'Subdomain Warm-Up Schedule',
    description: 'Gradual ramp-up plan (50 emails/day -> 500 emails/day) to safeguard domain reputation before launch.',
    owner: 'Agency',
    typicalWait: 'Week 1–2 automated ramp',
    status: 'verified',
  },
  {
    id: 'rd-3',
    category: 'Phone & SMS',
    title: 'Local Twilio Business Number Provisioning',
    description: 'Dedicated Portland local number (503-555-0194) provisioned and voice-forwarding mapped.',
    owner: 'Agency',
    typicalWait: 'Instant provisioning',
    status: 'verified',
  },
  {
    id: 'rd-4',
    category: 'Phone & SMS',
    title: 'A2P 10DLC Brand & Campaign Registration',
    description: 'Carrier compliance vetting for standard two-way customer care and appointment reminders. Requires EIN, business address, and opt-in disclosure verification.',
    owner: 'Carrier / Third-Party',
    typicalWait: '3–10 business days (Carrier review)',
    status: 'pending_external',
    details: {
      notes: 'Brand registration approved. Campaign review submitted to The Campaign Registry (TCR) and US mobile carriers. While pending, test messages deliver to internal numbers.',
    },
  },
  {
    id: 'rd-5',
    category: 'Voice & AI',
    title: 'Retell AI <-> Twilio SIP Trunk & Webhook Bridge',
    description: 'Bi-directional voice integration with call recording, instant transcript generation, and GHL custom field mapping.',
    owner: 'Agency',
    typicalWait: 'Configured during Sprint M4',
    status: 'verified',
  },
  {
    id: 'rd-6',
    category: 'Migration & Safety',
    title: 'Pre-Flight Audit of Legacy Live Workflows',
    description: 'Review of existing GHL automations to avoid colliding with new flows. Legacy "Missed call text-back" paused to prevent duplicate SMS.',
    owner: 'Agency & Client',
    typicalWait: 'Completed Day 2 of Kickoff',
    status: 'verified',
    details: {
      notes: '2 live workflows inspected. Overlapping auto-replies safely paused. No contacts lost.',
    },
  },
];

export interface QaTestItem {
  id: string;
  name: string;
  category: 'Funnel' | 'CRM' | 'Automations' | 'Compliance';
  description: string;
  tester: string;
  status: 'passed' | 'pending' | 'running';
  runtime: string;
}

export const SEED_QA_LOG: QaTestItem[] = [
  { id: 'qa-1', name: 'Funnel intake survey multi-step validation', category: 'Funnel', description: 'Verified step-by-step required field guards and error boundaries', tester: 'Marcus Bell', status: 'passed', runtime: '0.8s' },
  { id: 'qa-2', name: 'Real-time calendar slot collision handling', category: 'Funnel', description: 'Verified taken slot alert and nearest slot recommendations', tester: 'Dana Whitfield', status: 'passed', runtime: '1.1s' },
  { id: 'qa-3', name: 'Client-side .ics calendar invite generation', category: 'Funnel', description: 'Generated downloadable RFC-5545 compliant calendar file', tester: 'System QA', status: 'passed', runtime: '0.2s' },
  { id: 'qa-4', name: 'Cross-surface state synchronization (BroadcastChannel)', category: 'CRM', description: 'Submitting survey instantly updates Operator Console in <1s', tester: 'System QA', status: 'passed', runtime: '0.4s' },
  { id: 'qa-5', name: 'Pipeline drag-and-drop stage rule enforcement', category: 'CRM', description: 'Moving card auto-creates staff tasks and notification events', tester: 'Dana Whitfield', status: 'passed', runtime: '0.6s' },
  { id: 'qa-6', name: 'Duplicate lead deduplication & merge rules', category: 'CRM', description: 'Second submission updates contact without duplicate opportunity', tester: 'System QA', status: 'passed', runtime: '0.5s' },
  { id: 'qa-7', name: 'Immediate outreach stop on lead reply (SMS)', category: 'Automations', description: 'Replying halts all scheduled nudges and assigns human task', tester: 'Marcus Bell', status: 'passed', runtime: '0.7s' },
  { id: 'qa-8', name: 'Immediate outreach stop on consultation booking', category: 'Automations', description: 'Booking exits unresponsive flow and transitions to reminder flow', tester: 'Dana Whitfield', status: 'passed', runtime: '0.9s' },
  { id: 'qa-9', name: 'Instant STOP keyword DND enforcement', category: 'Compliance', description: 'Texting STOP enables channel-specific DND and cancels queues', tester: 'System QA', status: 'passed', runtime: '0.3s' },
  { id: 'qa-10', name: 'Retell AI webhook payload & field mapping', category: 'Automations', description: 'Call outcome and qualification fields write to GHL custom fields', tester: 'System QA', status: 'passed', runtime: '1.2s' },
  { id: 'qa-11', name: 'Quiet hours enforcement (8 PM - 8 AM PST)', category: 'Compliance', description: 'Outbound nudges automatically hold until 8:00 AM next day', tester: 'System QA', status: 'passed', runtime: '0.4s' },
  { id: 'qa-12', name: 'No-show recovery 15-minute trigger protocol', category: 'Automations', description: 'Marking no-show moves stage and queues gentle rebook SMS', tester: 'Marcus Bell', status: 'passed', runtime: '0.6s' },
];

export const OPERATOR_GUIDE_CHAPTERS = [
  {
    id: 'ch-1',
    title: '1. The Golden Rule: Human Takeover & Speed to Lead',
    content: `When a new homeowner fills out the survey on the Alder & Finch website, the system executes three tasks within 30 seconds:
1. Creates the Opportunity in "New Inquiry" with the estimated project value based on their budget selection.
2. Sends the instant introductory SMS and lookbook email.
3. Alerts Marcus Bell via push notification.

CRITICAL: As soon as the homeowner replies to an SMS or email, the automated sequence IMMEDIATELY shuts off. The opportunity is tagged with "Engaged" and a high-priority task is placed on Dana's desk. You never have to worry about a robotic message firing while you are having a real conversation.`,
  },
  {
    id: 'ch-2',
    title: '2. Operating the Pipeline Kanban',
    content: `The Journey Studio pipeline reflects the exact stages of a remodeling engagement:
- New Inquiry: Uncontacted submissions.
- Contacted: Two-way outreach underway or automated 7-day unresponsive cadence active.
- Qualified: Verified homeowner, budget ($25k+), and Portland-metro location.
- Consultation Booked: Confirmed appointment on the calendar.
- Proposal Sent: In-home walk-through complete; formal proposal out for review.
- Won: Retainer paid; onboarding initiated.
- Lost: Unresponsive or mismatched budget.

Moving any card triggers automatic rules. For example, dragging to "Consultation Booked" asks you to verify the calendar slot, while dragging to "Lost" prompts for a reason and instantly stops all pending follow-up.`,
  },
  {
    id: 'ch-3',
    title: '3. Duplicate Prevention & Merging',
    content: `Homeowners often fill out a form once on their phone, and then three days later submit another questionnaire from their laptop with slight variations.

Our deduplication engine matches existing records by either email address or sanitized phone number. When a repeat inquiry arrives:
- It DOES NOT spawn a duplicate card in the pipeline.
- It logs a "Duplicate Prevented / Form Re-submitted" activity event.
- It refreshes the contact's project notes with any new details.
- It leaves any active staff conversations undisturbed.`,
  },
  {
    id: 'ch-4',
    title: '4. Opt-Out & TCPA Compliance',
    content: `Alder & Finch operates strictly in compliance with US CTIA guidelines and A2P 10DLC regulations:
- Every SMS initial touch includes clear opt-out instructions ("Reply STOP to opt out").
- The moment a contact replies with STOP, UNSUBSCRIBE, CANCEL, or END:
  1. The system flags their phone with an irreversible Do-Not-Disturb (DND-SMS).
  2. All pending SMS messages in every workflow are cancelled immediately.
  3. A single compliant confirmation is logged.
  4. Email communication remains active unless they also opt out of email.`,
  },
  {
    id: 'ch-5',
    title: '5. Finch Assist (Voice Agent) Workflow',
    content: `Finch Assist (powered by Retell AI and Twilio) handles two key voice functions:
1. Inbound Overflow: If all designers are in consultations or after business hours, Finch Assist answers, qualifies the room type and budget, and offers available calendar slots.
2. Speed-to-Lead Follow-up: For new inquiries with no reply after 5 minutes, Finch Assist places a polite qualifying call.

Every call generates an audio recording, a full transcript, and structured JSON fields that directly map into GoHighLevel custom fields (Project Type, Budget Band, Start Window).`,
  },
  {
    id: 'ch-6',
    title: '6. Routine Health Checks & Calendar Management',
    content: `To keep the system running smoothly:
- Check the "Needs Action" bar on the Overview screen every morning at 9:00 AM.
- If you need to block time for vacation or on-site inspections, adjust your working hours in the Calendar screen; available slots on the website funnel update immediately.
- Use the Handoff Hub to request support or review QA logs whenever adding new team members.`,
  },
];
