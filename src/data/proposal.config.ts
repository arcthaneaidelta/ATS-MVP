export interface ProposalConfig {
  clientName: string;
  preparedDate: string;
  leadEngineer: string;
  role: string;
  summary: string;
  contactEmail: string;
  estimates: {
    corporate: { hours: number; weeks: number; investment: number; deliverables: string[] };
    academy: { hours: number; weeks: number; investment: number; deliverables: string[] };
    cirqla: { hours: number; weeks: number; investment: number; deliverables: string[] };
  };
  milestones: {
    id: string;
    phase: string;
    timing: string;
    percentage: number;
    amount: number;
    deliverables: string[];
    acceptanceCriteria: string;
  }[];
  monthlyInstalments: {
    month: number;
    focus: string;
    amount: number;
    milestoneRelease: string;
  }[];
  supportTiers: {
    name: string;
    responseTime: string;
    hoursIncluded: number;
    monthlyPrice: number;
    coverage: string;
    bestFor: string;
  }[];
  stackDecisions: {
    area: string;
    chosen: string;
    why: string;
    alternativeConsidered: string;
  }[];
  similarWork: {
    title: string;
    client: string;
    problem: string;
    outcome: string;
    stack: string[];
    link: string;
  }[];
  ownershipStatement: string;
}

export const proposalConfig: ProposalConfig = {
  clientName: "BionicIQ",
  preparedDate: "October 13, 2026",
  leadEngineer: "Senior Founding Systems Engineer",
  role: "Full-Stack Ecosystem Architect & Dedicated Engineering Partner",
  summary: "A single accountable engineering partner delivering the entire BionicIQ ecosystem — Corporate Brand Platform, Academy LMS, and Cirqla Hospitality SaaS — unified by a single design language, shared auth/billing primitives, and enterprise-grade multi-tenancy.",
  contactEmail: "partnership@bioniciq.example",
  estimates: {
    corporate: {
      hours: 140,
      weeks: 3,
      investment: 14000,
      deliverables: [
        "Headless CMS integration with live inline editing & SEO previews",
        "Services, Case Studies scroll-stories & Careers with application drawer",
        "Lead qualification funnel integrated with CRM webhook pipelines",
        "Core design tokens package powering all three products"
      ]
    },
    academy: {
      hours: 220,
      weeks: 5,
      investment: 22000,
      deliverables: [
        "Course player with video streaming, interactive note-taking & curriculum tracker",
        "Timed assessment engine with scoring rings & instant PDF certificate generation",
        "Student dashboard with learning streaks and progress synchronisation",
        "Admin LMS portal with course authoring, enrollments, and refund handling"
      ]
    },
    cirqla: {
      hours: 320,
      weeks: 7,
      investment: 32000,
      deliverables: [
        "Mobile-first QR customer ordering PWA with live modifiers & multi-method checkout",
        "Real-time kitchen order dispatch board with audio chime and column workflows",
        "Multi-tenant venue management: branch pricing overrides, staff RBAC & CSV bulk import",
        "Super-admin SaaS console with tenant provisioning, usage tiers, and system observability"
      ]
    }
  },
  milestones: [
    {
      id: "M1",
      phase: "Phase 1: Shared Core & Corporate Platform",
      timing: "Weeks 1–3",
      percentage: 20,
      amount: 13600,
      deliverables: [
        "Shared Design System package (tokens, typography, layout primitives)",
        "Corporate website with CMS editor, SEO manager, and lead intake",
        "CI/CD pipeline and cloud infrastructure-as-code setup"
      ],
      acceptanceCriteria: "Corporate site live on staging with sub-2s LCP and working CMS publish workflows."
    },
    {
      id: "M2",
      phase: "Phase 2: Academy LMS & Assessment Engine",
      timing: "Weeks 4–8",
      percentage: 30,
      amount: 20400,
      deliverables: [
        "Course catalog, student authentication and checkout integration",
        "Lesson video player, note-taking, and curriculum state engine",
        "Quiz assessment module with tamper-proof certificate generation and verification",
        "Academy Admin dashboard with course publishing and revenue reporting"
      ],
      acceptanceCriteria: "Student enrollment to certificate generation verified end-to-end with simulated & real gateways."
    },
    {
      id: "M3",
      phase: "Phase 3: Cirqla Customer Ordering & Venue Board",
      timing: "Weeks 9–13",
      percentage: 35,
      amount: 23800,
      deliverables: [
        "Mobile diner PWA with QR scan, modifier selection, and card/wallet payments",
        "Live Kitchen Display System (KDS) with sub-300ms realtime synchronization",
        "Multi-venue menu editor with branch pricing overrides & QR generator",
        "Cross-tab and cross-device realtime testing under peak load"
      ],
      acceptanceCriteria: "Diner orders update live venue board in under 300ms across network connections."
    },
    {
      id: "M4",
      phase: "Phase 4: Super-Admin, Hardening & Launch Handover",
      timing: "Weeks 14–15",
      percentage: 15,
      amount: 10200,
      deliverables: [
        "Cirqla Platform Super-admin with tenant suspension & usage monitoring",
        "WCAG 2.1 AA accessibility audit and cross-browser stress test",
        "Full repository transfer, IaC documentation, and post-launch support kickoff"
      ],
      acceptanceCriteria: "Production deployment sign-off with 100% test coverage on billing and tenancy boundaries."
    }
  ],
  monthlyInstalments: [
    { month: 1, focus: "Foundation, Core Design System, Corporate Platform & CMS", amount: 17000, milestoneRelease: "M1 Signoff" },
    { month: 2, focus: "Academy LMS Core, Video Player, Quiz & Certificates", amount: 17000, milestoneRelease: "M2 Signoff" },
    { month: 3, focus: "Cirqla Diner PWA, Realtime Kitchen Board & Menu Management", amount: 17000, milestoneRelease: "M3 Signoff" },
    { month: 4, focus: "Super-Admin, Tenancy Hardening, Audits & Handover", amount: 17000, milestoneRelease: "M4 Signoff" }
  ],
  supportTiers: [
    {
      name: "Essential Care",
      responseTime: "< 8 Business Hours",
      hoursIncluded: 15,
      monthlyPrice: 1800,
      coverage: "Bug fixes, dependency updates, uptime monitoring, security patching",
      bestFor: "Post-launch stability and baseline maintenance"
    },
    {
      name: "Growth Partner",
      responseTime: "< 2 Hours (24/7 P1)",
      hoursIncluded: 35,
      monthlyPrice: 3800,
      coverage: "Feature iterations, conversion optimization, database scaling, weekly release management",
      bestFor: "Active commercial scaling across multiple venues and course cohorts"
    },
    {
      name: "Ecosystem Dedicated",
      responseTime: "< 30 Minutes (Direct Slack/Phone)",
      hoursIncluded: 75,
      monthlyPrice: 7500,
      coverage: "Dedicated engineering lead hours, custom tenant integrations, architecture evolution",
      bestFor: "Enterprise accounts and high-volume platform transactions"
    }
  ],
  stackDecisions: [
    {
      area: "Frontend Architecture",
      chosen: "React 18 + Vite + TypeScript (Strict) with Shared Design Tokens",
      why: "Delivers instantaneous developer velocity, zero build fragmentation, and microsecond render performance across all three portals.",
      alternativeConsidered: "Next.js for Corporate + separate SPAs for Apps (discarded due to risk of 3 fragmented repos; production can adopt Next.js SSG for public SEO while sharing the tokens package)."
    },
    {
      area: "Multi-Tenancy Isolation",
      chosen: "PostgreSQL Row-Level Security (RLS) with Tenant Scoping Middleware",
      why: "Ensures ironclad data separation for Cirqla venues while allowing cross-tenant reporting for platform super-admins without complex multi-database connection pooling.",
      alternativeConsidered: "Database-per-tenant (costly maintenance) or purely application-level WHERE filtering (vulnerable to developer oversight)."
    },
    {
      area: "Realtime Synchronization",
      chosen: "Redis Pub/Sub with WebSocket Gateways (Simulated with BroadcastChannel in demo)",
      why: "Guarantees sub-100ms ticket arrival from diner phone to kitchen display screen under restaurant dinner rush surges.",
      alternativeConsidered: "HTTP Long-polling (unacceptable latency and battery drain on mobile diner devices)."
    },
    {
      area: "Billing & Transactions",
      chosen: "Stripe Connect Custom/Express for Cirqla + Direct Stripe for Academy",
      why: "Native platform split payments, automated venue payouts, local payment methods (Apple Pay, Google Pay, iDEAL), and automated refund handling.",
      alternativeConsidered: "Ad-hoc payment gateway integrations requiring separate merchant accounts per venue."
    }
  ],
  similarWork: [
    {
      title: "TableFlow Multi-Branch Hospitality Platform",
      client: "Boutique Hospitality Group",
      problem: "Needed a unified dine-in ordering, inventory tracking, and kitchen dispatch system across 14 restaurant locations.",
      outcome: "Processed 420k+ orders in year one, reduced order-to-table prep latency by 18%, and saved 4.2% in merchant transaction fees.",
      stack: ["React", "TypeScript", "Node.js", "Redis", "Stripe Connect", "Tailwind CSS"],
      link: "/case-studies/multi-venue-ordering"
    },
    {
      title: "MasterOps Certification & LMS Engine",
      client: "Global Operations Institute",
      problem: "Fragmented LMS with poor video retention, unreliable quiz timers, and manual certificate dispatch.",
      outcome: "Delivered interactive video curriculum with 84% completion rates and cryptographic instant verification for 22,000 students.",
      stack: ["React", "PostgreSQL", "Next.js", "Tailwind CSS", "PDFKit", "WebSockets"],
      link: "/case-studies/learning-ecosystem"
    },
    {
      title: "FinGate Corporate Identity & Unified Checkout",
      client: "FinTech Infrastructure Corp",
      problem: "High-ticket enterprise corporate site with CMS requirements, real-time qualification funnel, and sub-1.5s mobile speed.",
      outcome: "Boosted inbound qualification rates by 34% with 99.8% Core Web Vitals score across all global geographies.",
      stack: ["React", "Headless CMS", "TypeScript", "Tailwind CSS", "Framer Motion"],
      link: "/case-studies/enterprise-payments"
    }
  ],
  ownershipStatement: "BionicIQ retains 100% sole ownership of all intellectual property, source code repositories, infrastructure-as-code manifests, Figma design files, and deployment configurations from day one. All commits are made directly into BionicIQ's organization repositories with zero vendor lock-in or proprietary runtime dependencies."
};
