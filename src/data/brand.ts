import { User, StageInfo } from './types';

export const BRAND = {
  name: 'Alder & Finch',
  tagline: 'Home Studio',
  fullName: 'Alder & Finch Home Studio',
  serviceArea: 'Portland, OR and surrounding neighborhoods',
  phone: '(503) 555-0194',
  phoneRaw: '+15035550194',
  email: 'hello@alderandfinch.com',
  address: '1428 NE Alberta St, Portland, OR 97211',
  license: 'Oregon CCB #248102',
  hours: 'Mon–Fri 9:00 AM – 5:00 PM PST',
  consultationDurationMin: 45,
  
  copy: {
    heroH1: 'A kitchen worth coming home to.',
    heroSub: 'Design-led remodeling for homes in the Portland area. Tell us about your space and book a free consultation. A real person replies within the hour.',
    surveyIntro: 'Five short questions. Takes about two minutes.',
    consentLine: 'Yes, Alder & Finch may call, text or email me about my project. Message and data rates may apply. Reply STOP to opt out, HELP for help.',
    thankYou: "You're booked. We'll text a confirmation now and a reminder the day before.",
    needsActionCard: '4 leads are waiting for a first reply. Oldest: 38 minutes.',
    emptyPipeline: 'No opportunities here yet. New inquiries land here automatically.',
    error: "We couldn't save that. Nothing was lost. Try again.",
    simulatorHint: 'Pick something the lead does. Watch what the system does next.',
    dashboardCta: 'Open the full journey',
    footerSimNote: 'Simulation built for the GoHighLevel buildout proposal. No live systems are connected.',
  },
};

export const TEAM: User[] = [
  {
    id: 'user-dana',
    name: 'Dana Whitfield',
    role: 'Owner & Principal Designer',
    initials: 'DW',
    avatarColor: 'bg-primary text-surface',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Bell',
    role: 'Intake Coordinator',
    initials: 'MB',
    avatarColor: 'bg-[#4B6A82] text-surface',
  },
  {
    id: 'user-elena',
    name: 'Elena Ruiz',
    role: 'Senior Design Consultant',
    initials: 'ER',
    avatarColor: 'bg-[#B5703D] text-surface',
  },
];

export const STAGES: StageInfo[] = [
  {
    id: 'new_inquiry',
    name: 'New Inquiry',
    description: 'Inbound submissions awaiting first staff triage or immediate auto-outreach.',
    rulesCount: 3,
  },
  {
    id: 'contacted',
    name: 'Contacted',
    description: 'First two-way outreach initiated. Unresponsive sequence or follow-up active.',
    rulesCount: 2,
  },
  {
    id: 'qualified',
    name: 'Qualified',
    description: 'Project scope, budget ($25k+), and timeline verified by phone or intake survey.',
    rulesCount: 2,
  },
  {
    id: 'consultation_booked',
    name: 'Consultation Booked',
    description: 'Confirmed slot in calendar. Automated 24h and 2h reminder sequences running.',
    rulesCount: 4,
  },
  {
    id: 'proposal_sent',
    name: 'Proposal Sent',
    description: 'Design consultation completed; formal scope and budget estimate delivered.',
    rulesCount: 2,
  },
  {
    id: 'won',
    name: 'Won',
    description: 'Deposit accepted and design agreement signed.',
    rulesCount: 1,
  },
  {
    id: 'lost',
    name: 'Lost / Closed',
    description: 'Declined, out of budget, or unresponsive. All outreach halted.',
    rulesCount: 1,
  },
];

export const NEIGHBORHOODS = [
  'Alberta Arts',
  'Sellwood',
  'Laurelhurst',
  'Beaverton',
  'Lake Oswego',
  'Hawthorne',
  'Irvington',
  'Mount Tabor',
];
