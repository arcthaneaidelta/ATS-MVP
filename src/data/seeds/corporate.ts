import { JobRole, CaseStudy } from '../../types';

export const jobRoles: JobRole[] = [
  {
    id: 'role-1',
    title: 'Senior Full Stack Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    posted: '2 days ago',
    description: 'Lead architecture on high-concurrency multi-tenant SaaS systems, real-time event dispatching, and zero-downtime database migrations.',
    requirements: [
      '5+ years building production TypeScript, React, and Node/PostgreSQL backends',
      'Hands-on experience with WebSocket/Redis pub-sub and row-level tenancy models',
      'Strong eye for accessible, token-driven web typography and sub-second web performance'
    ],
  },
  {
    id: 'role-2',
    title: 'Lead Product Designer',
    team: 'Design',
    location: 'Remote',
    type: 'Full-time',
    posted: '1 week ago',
    description: 'Own the unified design system across Corporate, Academy LMS, and Cirqla SaaS. Champion typographic restraint, editorial clarity, and tactile interactions.',
    requirements: [
      'Portfolio demonstrating deep design-system tokens across desktop and mobile native PWAs',
      'Fluency with Figma variables, component variant architectures, and WCAG AA standards',
      'Comfort collaborating directly with front-end engineers in code reviews'
    ],
  },
  {
    id: 'role-3',
    title: 'Senior QA & Automation Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    posted: '3 days ago',
    description: 'Build end-to-end multi-surface test suites validating cross-tab order synchronization, payment decline retries, and high-frequency ticket routing.',
    requirements: [
      'Proficiency with Playwright / Cypress simulating concurrent client sessions',
      'Experience with simulated payment webhooks and asynchronous state machines',
      'Track record establishing automated performance budgets and CI release gates'
    ],
  },
  {
    id: 'role-4',
    title: 'Principal Solutions Architect',
    team: 'Engineering',
    location: 'On-site',
    type: 'Full-time',
    posted: '5 days ago',
    description: 'Design enterprise cloud deployment blueprints, SOC2 compliance roadmaps, and custom POS hardware integration bridges.',
    requirements: [
      'Demonstrated experience with AWS/GCP Kubernetes, Terraform IaC, and zero-trust IAM',
      'Client-facing communication skills for technical advisory and SLA governance',
      'Deep knowledge of PCI-DSS Level 1 compliance and Stripe Connect split topologies'
    ],
  },
  {
    id: 'role-5',
    title: 'Customer Success & Onboarding Lead',
    team: 'Operations',
    location: 'Remote',
    type: 'Full-time',
    posted: '1 week ago',
    description: 'Guide multi-branch restaurant owners and enterprise academy cohorts through launch, staff training, and revenue optimization.',
    requirements: [
      '3+ years in B2B SaaS onboarding or hospitality operations management',
      'Empathy for frontline floor workers and busy venue managers under time pressure',
      'Analytical fluency in churn forecasting and cohort retention reporting'
    ],
  },
  {
    id: 'role-6',
    title: 'Staff DevOps & Reliability Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    posted: '4 days ago',
    description: 'Ensure 99.99% service availability across multi-region edge networks, CDN caches, and auto-scaling container clusters.',
    requirements: [
      'Extensive experience with Prometheus, Grafana, OpenTelemetry, and incident management',
      'PostgreSQL connection pool optimization under 10k+ concurrent read/write queries',
      'Strong scripting skills in Bash/Python and infrastructure automation'
    ],
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: 'multi-venue-ordering',
    title: 'Multi-Venue Dining & Real-Time Kitchen Dispatch',
    clientType: 'Hospitality SaaS',
    role: 'Principal Architecture & Product Build',
    timeline: '12 Weeks',
    stack: ['React', 'TypeScript', 'Redis Pub/Sub', 'Stripe Connect', 'Tailwind CSS'],
    summary: 'A unified diner scan-to-pay PWA and live multi-branch kitchen display board processing over 420,000 orders with zero lost tickets.',
    challenge: 'Multi-unit casual dining chains were losing 14% of bar and floor revenue due to peak-hour ordering bottlenecks, while kitchen staff struggled with mismatched tickets and fragmented point-of-sale hardware.',
    approach: 'Engineered a unified diner web client requiring zero app store install, connected via sub-100ms real-time event sockets to an adaptive kitchen station display with audible fire cues and branch-level menu availability toggles.',
    outcomeMetrics: [
      { label: 'Orders Processed', value: '420k+' },
      { label: 'Order-to-Table Latency', value: '-18%' },
      { label: 'Average Ticket Lift', value: '+23%' },
    ],
  },
  {
    slug: 'learning-ecosystem',
    title: 'Enterprise Operational Academy & Cryptographic Certificates',
    clientType: 'Corporate LMS',
    role: 'Full-Stack LMS & Video Infrastructure',
    timeline: '10 Weeks',
    stack: ['React', 'PostgreSQL', 'Tailwind CSS', 'PDFKit', 'Radix UI'],
    summary: 'Delivered an interactive video training ecosystem with real-time curriculum sync, timed assessments, and tamper-proof PDF certification.',
    challenge: 'A distributed hospitality collective needed to train and certify 22,000 frontline staff across 6 countries, but legacy enterprise LMS software suffered from 28% completion rates and manual certification delays.',
    approach: 'Constructed a reading-first, distraction-free student portal with progressive video caching, inline note taking, automated timed quizzes, and instant cryptographic QR verification on issued diplomas.',
    outcomeMetrics: [
      { label: 'Course Completion Rate', value: '84%' },
      { label: 'Certified Professionals', value: '22,400' },
      { label: 'Onboarding Time Saved', value: '3.5x' },
    ],
  },
  {
    slug: 'enterprise-payments',
    title: 'Global Payment Orchestration & Instant Payout Ledger',
    clientType: 'FinTech Infrastructure',
    role: 'Payment Pipeline Engineering',
    timeline: '8 Weeks',
    stack: ['React', 'TypeScript', 'Stripe API', 'PostgreSQL RLS', 'Tailwind CSS'],
    summary: 'Built an enterprise payment splitting and automated payout engine processing $18M in monthly volume with multi-currency checkout.',
    challenge: 'Platform venues operating across UK, UAE, and US faced fragmented currency settlement rules, tedious manual end-of-month reconciliations, and elevated payment dispute rates.',
    approach: 'Designed an integrated checkout sheet supporting Apple Pay, Google Pay, local cards, and cash-at-counter reconciliations with automated fee splits and exportable real-time accounting ledgers.',
    outcomeMetrics: [
      { label: 'Monthly GMV Handled', value: '$18.2M' },
      { label: 'Dispute Reduction', value: '-42%' },
      { label: 'Payout Processing Speed', value: 'Instant' },
    ],
  },
];

export const insightArticles = [
  {
    slug: 'multi-tenancy-without-sprawl',
    title: 'Designing Multi-Tenant SaaS Without Architectural Sprawl',
    category: 'Architecture',
    readTime: '6 min read',
    publishedDate: 'Oct 8, 2026',
    excerpt: 'Why isolating tenants at the database schema layer offers the highest reliability-to-maintenance ratio for growing platform businesses.',
    content: `When scaling SaaS platforms from 5 to 500 business customers, the instinctive engineering debate usually pits database-per-tenant against shared tables with application-level filtering.

In practice, both extremes carry hidden operational tax:
1. Database-per-tenant leads to connection pool starvation and nightmare migrations.
2. Pure application-level WHERE filtering is one missed query away from a catastrophic privacy leak.

The sweet spot proven in BionicIQ Cirqla is PostgreSQL Row-Level Security (RLS) coupled with request-scoped tenant context. This gives ironclad cryptographic isolation with the maintenance elegance of a single migration pipeline.`
  },
  {
    slug: 'the-psychology-of-qr-dining',
    title: 'The Unseen Psychology of Table-Side Digital Ordering',
    category: 'Product Design',
    readTime: '5 min read',
    publishedDate: 'Sep 29, 2026',
    excerpt: 'How thoughtful typography, zero app installs, and transparent preparation timers convert cynical diners into brand champions.',
    content: `Guests do not want to download a 90MB native app just to view a menu. 

When a guest scans a table tent, the web client must render in under 800ms. More importantly, the visual language must evoke hospitality, not an airport kiosk:
- Warm paper canvas tones instead of harsh white screens.
- Modifiers presented as natural culinary choices rather than transactional checkboxes.
- A calm, honest progress stepper ("Received → Preparing → Ready") that replaces the anxiety of waving down an overburdened server.`
  },
  {
    slug: 'sub-300ms-kitchen-sync',
    title: 'Architecting Sub-300ms Ticket Synchronization for Fast-Paced Kitchens',
    category: 'Engineering',
    readTime: '7 min read',
    publishedDate: 'Sep 15, 2026',
    excerpt: 'Examining event-driven pub/sub topologies that prevent dropped orders during peak dinner rush service.',
    content: `In a bustling 80-cover restaurant on Friday evening, seconds matter. A ticket that lags by 2 minutes creates a chaotic bottleneck at the pass.

By combining browser BroadcastChannel for local device tabs with Redis WebSocket gateways for remote devices, every modification—whether an item sold out toggle or an order dispatch—propagates across all kitchen display stations in under 300ms with zero manual page refreshing.`
  }
];

export const serviceLines = [
  {
    id: 'services-web-cms',
    title: 'Web Platforms & Content Systems',
    description: 'Bespoke corporate websites engineered with sub-second performance, editorial CMS controls, and real-time SEO intelligence.',
    capabilities: [
      { name: 'Headless CMS Architecture', detail: 'Empower marketing teams to update copy, media, and page structures safely without engineer intervention.' },
      { name: 'Real-Time SEO & Metadata Engine', detail: 'Instant Google search snippets, OpenGraph previews, and automated JSON-LD schema generation.' },
      { name: 'Core Web Vitals Optimization', detail: 'Guaranteed 95+ performance scores through asset optimization, edge caching, and zero layout shift.' }
    ],
    usedIn: ['BionicIQ Corporate', 'Insights Blog'],
    relatedCaseStudy: '/case-studies/enterprise-payments'
  },
  {
    id: 'services-saas-eng',
    title: 'SaaS Product Engineering',
    description: 'Scalable multi-tenant web applications built to withstand high concurrency and complex operational workflows.',
    capabilities: [
      { name: 'Multi-Tenant Architecture', detail: 'Row-level security, tenant-specific theming, and branch management built into the core schema.' },
      { name: 'Real-Time Event Pipelines', detail: 'Sub-300ms live synchronization between mobile customers and back-of-house operational dashboards.' },
      { name: 'Role-Based Access Control', detail: 'Granular permissions for owners, managers, staff, and platform super-administrators.' }
    ],
    usedIn: ['Cirqla Hospitality SaaS', 'BionicIQ Academy'],
    relatedCaseStudy: '/case-studies/multi-venue-ordering'
  },
  {
    id: 'services-payments',
    title: 'Payments & Transactional Systems',
    description: 'Resilient checkout pipelines handling split payouts, multi-currency processing, and automatic ledger reconciliation.',
    capabilities: [
      { name: 'Stripe Connect Split Payouts', detail: 'Automated platform fee deduction and scheduled direct transfers to venue bank accounts.' },
      { name: 'Digital Wallet Integration', detail: 'One-tap Apple Pay and Google Pay checkouts with graceful fallback to physical card and counter payment.' },
      { name: 'Automated Ledger & Reporting', detail: 'Real-time transaction auditing, dispute handling workflows, and instant CSV accounting exports.' }
    ],
    usedIn: ['Cirqla Customer App', 'Academy Checkout'],
    relatedCaseStudy: '/case-studies/enterprise-payments'
  },
  {
    id: 'services-cloud-support',
    title: 'Cloud Infrastructure & Ongoing Care',
    description: 'Zero-downtime deployment pipelines, automated security scanning, and reliable SLA-backed support tiers.',
    capabilities: [
      { name: 'Infrastructure as Code (IaC)', detail: 'Reproducible, version-controlled cloud environments deployed across automated staging and production.' },
      { name: 'Observability & Health Monitoring', detail: 'Continuous uptime tracking, latency alarms, and synthetic transaction probes.' },
      { name: 'Dedicated Post-Launch SLAs', detail: 'Guaranteed response times down to 30 minutes with direct engineering partner access.' }
    ],
    usedIn: ['Cirqla Super-Admin', 'All Platforms'],
    relatedCaseStudy: '/case-studies/learning-ecosystem'
  }
];
