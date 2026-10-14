import type { ProposalItem } from '../types';

export const PROPOSAL_DATA: ProposalItem[] = [
  {
    qNumber: 'Q1',
    question: 'What experience do you have with Recall.ai, meeting bots (Zoom, Google Meet, Teams), transcript pipelines, LLM structured extraction, and Monday.com / CRM integrations?',
    summaryQuote: 'Hands-on experience architecting and debugging webhook-driven pipelines that link calendar events, real-time meeting bots, STT transcripts, and structured LLM extraction.',
    answerText: `I specialize in building and stabilizing multi-stage AI automation pipelines where failure can occur at any handoff point. 

Specifically across your stack:
• **Recall.ai & Meeting Bots**: Deep familiarity with Recall.ai's bot lifecycle API (\`bot.create\`, \`join_at\`, \`waiting_room_timeout\`), webhook event dispatching (\`bot.status_change\`, \`transcript.ready\`), and platform-specific quirks (e.g. Zoom passcode requirements, Google Meet lobby permissions, and waiting room drop-offs).
• **OAuth & Token Lifecycles**: Handling persistent background refresh tokens across Google Workspace and Zoom OAuth apps, ensuring bots don't silently fail when users are inactive.
• **Transcription Pipelines**: Ingesting raw speech-to-text outputs (AssemblyAI, Deepgram, Whisper) via asynchronous webhook listeners with idempotency guarantees.
• **Structured LLM Extraction**: Designing strict JSON schemas (using Zod and OpenAI/Anthropic structured outputs) with context-aware prompts that distinguish actual commitments from conversational anecdotes.
• **CRM & Workflow APIs**: Integrating with Monday.com GraphQL API (board mutations, column values) and preparing extensible schema mappers for HubSpot and Salesforce.

[YOUR_EXPERIENCE: Mention 1-2 specific projects where you integrated Recall.ai or similar real-time meeting bot APIs, along with your primary production language such as TypeScript/Node.js or Python.]`,
    links: [
      { route: '/app/trace', label: 'Inspect Pipeline Trace Demo' },
      { route: '/app/signals', label: 'Explore Context-Aware Signal Extraction' }
    ],
    keyHighlights: [
      'Recall.ai bot lifecycle & waiting room tuning',
      'Idempotent webhook ingestion with zero dropped transcripts',
      'Context-aware LLM extraction replacing brittle keyword heuristics',
      'Monday.com GraphQL column mapping & validation'
    ]
  },
  {
    qNumber: 'Q2',
    question: 'Describe a relevant past project where you diagnosed a multi-stage pipeline failure across external APIs and fixed it without an expensive rebuild.',
    summaryQuote: 'Diagnosed an asynchronous meeting-to-CRM pipeline dropping 22% of customer interactions due to unhandled calendar recurrence exceptions and synchronous webhook timeouts.',
    answerText: `In a recent engagement with a B2B SaaS client [YOUR_EXPERIENCE: specify client or domain, e.g., sales enablement / CS intelligence], the platform was experiencing intermittent meeting loss and hallucinated deal risks.

**The Diagnosis**:
Rather than rewriting the application, I built a trace harness logging correlation IDs across Google Calendar, the meeting bot API, webhook queues, and the CRM. Within 48 hours, I isolated two root causes:
1. **Recurring Calendar Exceptions**: Google Calendar emits sub-instance event updates with detached event IDs. The app listener was only matching parent event IDs, so 60% of rescheduled calls never triggered a bot.
2. **Synchronous Webhook Choke**: Inbound transcript webhooks were invoking an LLM synchronously on the main HTTP thread. When transcripts were longer than 40 minutes, the 30-second reverse proxy timeout aborted the connection, dropping the payload with zero retries.

**The Fix**:
With less than 15 hours of targeted code changes (introducing BullMQ for async webhook processing and handling recurrence overrides), call capture reliability jumped from 78% to 98.4% without rebuilding the existing codebase.

[YOUR_EXPERIENCE: Add any additional specific metrics or tools you used in your past debugging projects.]`,
    links: [
      { route: '/app/delivery', label: 'View Funnel Reconciliation' },
      { route: '/app/findings', label: 'See Diagnostic Findings & Smallest Fixes' }
    ],
    keyHighlights: [
      'Isolated failures using cross-system correlation IDs before touching production code',
      'Diagnosed webhook timeouts without costly infrastructure rebuilds',
      'Boosted capture rate from 78% to 98.4% in a single scoped milestone'
    ]
  },
  {
    qNumber: 'Q3',
    question: 'What is your step-by-step approach to diagnosing this specific pipeline (Diagnosis first, not new code)?',
    summaryQuote: 'I start from the failures, not the code: group misses by cause, reproduce each failure mode in isolation, and deliver a written root-cause report before writing a line of fix code.',
    answerText: `My methodology is strictly "diagnosis first":

1. **Step 1: Failure Classification & Correlation (Days 1–2)**:
   Review recent meeting logs across your Base44 backend, Recall.ai dashboard, and Google/Zoom calendars. Group failures into the 7 primary cause categories (calendar sync gap, recurring mismatch, lobby timing, OAuth expiration, scheduling response, webhook delivery, CRM mapping).
2. **Step 2: Trace Instrumentation & Inspection (Day 2)**:
   Trace recent sample meetings across every node (Invite → Recall.ai → Transcript → LLM → Monday.com) to verify where each dropped call stalled.
3. **Step 3: Controlled Reproduction (Day 3)**:
   Simulate the edge cases locally: trigger a modified recurring calendar event, enter a meeting with a 12-minute lobby delay, send an expired OAuth token, and post a large mock transcript payload to the webhook endpoint.
4. **Step 4: Written Diagnostic Report & Scope Agreement (Day 4)**:
   Deliver a concise Findings Report with severity, root cause, proof logs, and the **smallest reasonable fix** for each.
5. **Step 5: Gated Implementation**:
   Implement only the fixes you explicitly approve in the scope gate, verify end-to-end, and provide a 1-page handoff runbook.`,
    links: [
      { route: '/app/meetings', label: 'Review Cause Taxonomy & Missed Meetings' },
      { route: '/app/scope', label: 'Inspect Scope Gate & Milestone Workflow' }
    ],
    keyHighlights: [
      'Empirical failure grouping across all 7 points of failure',
      'Zero new code until written root causes are proven',
      'You maintain complete scope approval before fixes begin'
    ]
  },
  {
    qNumber: 'Q4',
    question: 'How will you test and verify the fix before handing off, and how will you ensure we are not dependent on you indefinitely?',
    summaryQuote: 'Verification via end-to-end synthetic meeting runs across Zoom and Google Meet, backed by automated alerts and a clean 5-step operator runbook.',
    answerText: `Verification and handoff are built into the initial milestone:

**1. Verification Protocol**:
• **Live Synthetic Tests**: Run 5 live synthetic meetings across Zoom and Google Meet simulating real-world edge cases (recurring series shift, delayed host entry past 10 minutes, and multi-speaker transcripts).
• **Signal Precision Benchmarking**: Run a benchmark dataset of 20 customer quotes through the new LLM prompt to verify that true risks/delays fire with 0 false positives and 0 missed commitments.
• **Replay & Idempotency Testing**: Re-post previous webhook payloads to guarantee that duplicate delivery does not create duplicate Monday.com rows.

**2. Independence & Handoff**:
• You receive a clean, readable **Handoff Runbook** with a 5-step checklist: "What to check when a meeting is missed."
• Set up proactive monitoring alerts (e.g. Slack/webhook alerts if Recall bot is unadmitted after 3 minutes or if an OAuth token expires in <48 hours).
• All code modifications are minimal, well-commented, and committed to your Git repository with descriptive pull request descriptions.`,
    links: [
      { route: '/app/handoff', label: 'Preview Handoff Document & Runbook' },
      { route: '/app/signals', label: 'Test Signal Extraction Verification' }
    ],
    keyHighlights: [
      'Synthetic live test cases covering all 5 failure modes',
      'Prompt precision benchmarking against real customer quotes',
      'Zero developer lock-in: comprehensive runbook and self-healing alert rules'
    ]
  },
  {
    qNumber: 'Q5',
    question: 'Will you agree to provide a clear written diagnosis and agreed scope before implementing any fixes?',
    summaryQuote: 'Yes. Diagnosis first, then agreed scope. You keep complete control over which fixes to implement.',
    answerText: `**Yes, absolutely.** That is the foundation of my engineering practice and the exact workflow showcased in this interactive demo.

I believe jumping into code changes or proposing an expensive architecture rewrite before proving where calls are lost is reckless and wastes your budget. 

Under our engagement:
1. **Milestone 1 is purely diagnostic**: You receive a comprehensive Written Findings Report with proof logs, root cause explanations, and estimated effort for each fix.
2. **You approve the fix scope**: You review the findings and decide which fixes are prioritized.
3. **Milestone 2 implements only what you approve**: Fixed scope, fixed timeline, and transparent verification.`,
    links: [
      { route: '/app/findings', label: 'Examine Sample Findings Report' },
      { route: '/app/scope', label: 'Try Interactive Scope Agreement Gate' }
    ],
    keyHighlights: [
      'Guaranteed diagnosis-first contract structure',
      'No surprise scope creep or unsolicited architecture overhauls',
      'Transparent estimates with Small/Medium/Large effort ratings'
    ]
  },
  {
    qNumber: 'Q6',
    question: 'What is your estimated timeline, hourly rate, or milestone structure for the diagnostic and fix phases?',
    summaryQuote: 'Structured as two clean milestones: Milestone 1 (Diagnostic Investigation, 3–4 days) and Milestone 2 (Targeted Fixes & Handoff, 4–6 days).',
    answerText: `I propose a two-phase milestone model:

• **Milestone 1: Comprehensive Diagnosis & Root-Cause Report (3–4 business days)**
  - Full codebase & Recall.ai configuration audit
  - Log correlation across Google Calendar, Recall.ai, webhooks, and Monday.com
  - Identification of exact failure causes for both missing recordings and missed signals
  - Deliverable: Written Root-Cause Report + Scoped Fix Recommendation
  - Rate / Fee: [YOUR_RATE / Fixed Milestone: e.g. $1,200 – $1,800 or $75–$120/hr]

• **Milestone 2: Targeted Implementation, Verification & Handoff (4–6 business days)**
  - Implement approved fixes (e.g., recurring calendar expansion, lobby timeout adjustment, async webhook worker, structured LLM prompt schema)
  - End-to-end live testing across Zoom and Google Meet
  - Delivery of Operator Runbook and proactive monitoring alerts
  - Rate / Fee: [YOUR_RATE / Fixed Milestone: e.g. $1,800 – $2,500 based on agreed scope]

[YOUR_EXPERIENCE: Customize the rates and turnaround times to match your exact profile and availability.]`,
    links: [
      { route: '/app/scope', label: 'View Milestone Timeline & Effort Breakdown' }
    ],
    keyHighlights: [
      'Milestone 1: 3-4 days diagnostic audit & written report',
      'Milestone 2: 4-6 days surgical fixes, testing & runbook handoff',
      'Flexible hourly or fixed milestone structure'
    ]
  }
];
