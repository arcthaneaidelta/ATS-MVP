/**
 * Build plan content (/plan). This is the ONLY file where TODOs are allowed.
 * The freelancer fills these in before sending the proposal link.
 */

export interface Milestone {
  id: string;
  code: string;
  title: string;
  summary: string;
  /** Share of the fixed price paid on acceptance. Must sum to 100. */
  paymentPct: number;
  duration: string;
  acceptance: string[];
}

export interface PastProject {
  name: string;
  kind: string;
  description: string;
  url?: string;
}

export const plan = {
  /** TODO(freelancer): set the fixed price, e.g. 8400. Leave null to show "shared in the proposal". */
  price: null as number | null,
  currency: 'GBP',

  contact: {
    /** TODO(freelancer): your email. Empty string falls back to a mailto with no address. */
    email: '',
    timezone: 'Asia/Karachi (UTC+5)',
    responseTime: 'Replies within a working day',
  },

  /** TODO(freelancer): replace with your most relevant projects (3 max). */
  pastProjects: [
    {
      name: 'TenderVantage',
      kind: 'Procurement prototype',
      description:
        'A tender discovery and bid-tracking prototype for Botswana suppliers. Dense public data turned into a short list of what needs action this week.',
    },
    {
      name: 'Meridian',
      kind: 'Pooled savings platform',
      description:
        'A transparent pooling product where every draw and balance can be checked. Money movements are shown plainly, with an audit trail users can read.',
    },
    {
      name: 'Future Shuttles & Rentals',
      kind: 'Booking platform',
      description:
        'Vehicle booking with recurring rentals, reminders before renewal and a clear price breakdown at every step.',
    },
  ] satisfies PastProject[],

  /** TODO(freelancer): adjust to your own experience. Plain, specific, no inflated claims. */
  dataExperience:
    'Recurring detection is a pattern problem, not an AI problem. I group transactions by a normalised merchant name, then look for a steady interval (about 30 or about 365 days) with an amount that stays within a small tolerance. Price rises, overlaps and upcoming annual renewals fall out of the same grouping. Everything is computed from read-only data supplied by an open-banking aggregator, and nothing is shown to the user as certain when it is only likely.',

  milestones: [
    {
      id: 'm1',
      code: 'M1',
      title: 'Foundations & design system',
      summary: 'Project setup, your branding as tokens, navigation shell, CI and test builds on both stores.',
      paymentPct: 15,
      duration: '1–2 weeks',
      acceptance: [
        'Expo app runs on iOS and Android test devices via TestFlight and Play internal testing',
        'Your colours, type and spacing live in one tokens file',
        'Three-tab shell with empty states matches your screen files',
        'Automated build on every merge',
      ],
    },
    {
      id: 'm2',
      code: 'M2',
      title: 'Transaction ingestion & recurring detection',
      summary: 'Open-banking connection (sandbox first), read-only consent, detection engine with tests.',
      paymentPct: 25,
      duration: '2–3 weeks',
      acceptance: [
        'User can connect a sandbox bank with read-only consent',
        'Detection finds monthly and yearly payments on an agreed test set with at least 95% precision',
        'Price rise, overlap and renewal signals are covered by unit tests',
        'No card numbers or credentials stored on device or server',
      ],
    },
    {
      id: 'm3',
      code: 'M3',
      title: 'Core screens',
      summary: 'Today, Subscriptions and Detail with Keep, Review later and Cancel guidance.',
      paymentPct: 25,
      duration: '2–3 weeks',
      acceptance: [
        'Monthly, yearly and long-term totals match the detection output to the penny',
        'Keep, Review later and Cancel all work with Undo',
        'Loading, empty and error states for every screen',
        'Screen reader and dynamic type pass on both platforms',
      ],
    },
    {
      id: 'm4',
      code: 'M4',
      title: 'Trials & push notifications',
      summary: 'Free-trial tracking, reminder scheduling, APNs and FCM, quiet hours.',
      paymentPct: 20,
      duration: '1–2 weeks',
      acceptance: [
        'Trial reminders arrive at the chosen time on real devices',
        'Tapping a notification opens the right trial',
        'Quiet hours and reminder timing are respected',
        'Notification permission is requested in context, not on first launch',
      ],
    },
    {
      id: 'm5',
      code: 'M5',
      title: 'Hardening, security review & store submission',
      summary: 'Performance pass, security checklist, store listings and submission support.',
      paymentPct: 15,
      duration: '1–2 weeks',
      acceptance: [
        'Data deletion removes everything server-side and on device',
        'Privacy labels and Data safety form completed and reviewed with you',
        'App approved on the App Store and Google Play',
        '30 days of post-launch fixes included',
      ],
    },
  ] satisfies Milestone[],

  storeReadiness: [
    { label: 'App Store privacy labels', note: 'Declares financial info, read-only, not used for tracking' },
    { label: 'Google Play Data safety form', note: 'Matches the privacy labels line for line' },
    { label: 'Privacy policy URL', note: 'Hosted page, linked in both store listings and in the app' },
    { label: 'App icons and screenshots', note: 'All required sizes, generated from your brand files' },
    { label: 'Reviewer notes and sandbox account', note: 'So Apple and Google can test bank connection' },
    { label: 'Push notification entitlements', note: 'APNs key and FCM project configured per environment' },
    { label: 'Age rating and content questionnaire', note: 'Completed for both stores' },
    { label: 'In-app account deletion', note: 'Required by Apple for apps with accounts' },
  ],

  needsFromClient: [
    'Brand assets and font licences',
    'Final screen files (Figma or similar)',
    'Your open-banking provider choice, or a call to decide together',
    'Apple and Google developer accounts (or access to yours)',
    'Privacy policy text, or approval of a draft I prepare',
    'Sandbox bank credentials for testing',
    'Notification copy sign-off',
  ],

  productionStack:
    'For the real build I propose React Native with Expo: one TypeScript codebase that ships native apps to iOS and Android. Tokens and session data are kept in the platform Keychain and Keystore. The backend stays minimal: a small API that holds read-only consent with an open-banking aggregator (TrueLayer, Plaid or Yapily) and runs detection. Push goes through APNs and FCM. This demo is a web prototype of the experience only; it has no backend and is not the production code.',
};

export const totalPaymentPct = plan.milestones.reduce((s, m) => s + m.paymentPct, 0);
