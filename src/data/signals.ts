import type { SignalItem, TranscriptLine } from '../types';

export interface SampleTranscriptData {
  id: string;
  meetingId: string;
  title: string;
  account: string;
  csm: string;
  summary: string;
  lines: TranscriptLine[];
  keywordSignals: SignalItem[];
  contextSignals: SignalItem[];
  keywordMetrics: { totalFound: number; falsePositives: number; missed: number };
  contextMetrics: { totalFound: number; falsePositives: number; missed: number };
}

export const SAMPLE_TRANSCRIPTS: SampleTranscriptData[] = [
  {
    id: 'sample-mtg-1051',
    meetingId: 'MTG-1051',
    title: 'Legal Review Check-in',
    account: 'Tideline Energy',
    csm: 'Priya Nair',
    summary: 'Executive discussion touching compliance timelines, prior vendor anecdotes, and milestone dates.',
    lines: [
      { id: 't1', speaker: 'Priya Nair (CSM)', timestamp: '00:02:14', text: 'Good morning everyone. Let’s start by checking in on the SOC2 sign-off timeline.' },
      { id: 't2', speaker: 'Dan Vance (VP Tech, Tideline)', timestamp: '00:02:45', text: 'Thanks Priya. Our internal audit team looked through the DPA yesterday.' },
      { id: 't3', speaker: 'Dan Vance (VP Tech, Tideline)', timestamp: '00:03:10', text: 'Honestly, we may need to delay launch because of legal. Our counsel requested three clause adjustments.' },
      { id: 't4', speaker: 'Priya Nair (CSM)', timestamp: '00:03:32', text: 'Understood. Is that a hard blocker for sandbox testing or just final production cutover?' },
      { id: 't5', speaker: 'Dan Vance (VP Tech, Tideline)', timestamp: '00:03:50', text: 'We’re not blocked, just waiting on a sign-off for live tenant access.' },
      { id: 't6', speaker: 'Elena Scott (Security Lead)', timestamp: '00:04:15', text: 'Our other vendor had a problem with their rollout last quarter, so our infosec board is being extra thorough.' },
      { id: 't7', speaker: 'Priya Nair (CSM)', timestamp: '00:04:40', text: 'Totally reasonable. What concrete items do you need from our team this week?' },
      { id: 't8', speaker: 'Elena Scott (Security Lead)', timestamp: '00:05:02', text: 'Can you send the security questionnaire by Friday? That will let us clear the compliance committee on Monday.' },
      { id: 't9', speaker: 'Priya Nair (CSM)', timestamp: '00:05:20', text: 'I will personally send that across by Thursday afternoon.' },
      { id: 't10', speaker: 'Dan Vance (VP Tech, Tideline)', timestamp: '00:05:45', text: 'Let’s move go-live from the 12th to the 19th so we have clean buffer.' },
      { id: 't11', speaker: 'Elena Scott (Security Lead)', timestamp: '00:06:12', text: 'Also, we’ll probably need another week to review SSO with Okta.' },
      { id: 't12', speaker: 'Priya Nair (CSM)', timestamp: '00:06:30', text: 'Perfect, I will update our onboarding milestone tracker on Monday.com accordingly.' },
      { id: 't13', speaker: 'Dan Vance (VP Tech, Tideline)', timestamp: '00:06:55', text: 'Sounds great. Appreciate the flexibility, team.' }
    ],
    keywordSignals: [
      {
        id: 'kw-1',
        type: 'blocker',
        quote: 'We’re not blocked, just waiting on a sign-off for live tenant access.',
        speaker: 'Dan Vance',
        timestamp: '00:03:50',
        confidence: 0.65,
        fieldMapped: 'Monday.com: Project Status → "Blocked"',
        reasoning: 'Regex matched literal token "blocked". Negation clause ("not blocked") was overlooked.',
        verdict: 'false_positive',
        detectedBy: 'keyword',
        keywordMatcherFlaggedReason: 'Matched keyword: "blocked"'
      },
      {
        id: 'kw-2',
        type: 'risk',
        quote: 'Our other vendor had a problem with their rollout last quarter...',
        speaker: 'Elena Scott',
        timestamp: '00:04:15',
        confidence: 0.72,
        fieldMapped: 'Monday.com: Risk Level → "High"',
        reasoning: 'Regex matched keyword "problem". Did not detect that speaker was citing a past third-party vendor anecdote, not Northbeam.',
        verdict: 'false_positive',
        detectedBy: 'keyword',
        keywordMatcherFlaggedReason: 'Matched keyword: "problem"'
      },
      {
        id: 'kw-3',
        type: 'action_item',
        quote: 'Can you send the security questionnaire by Friday?',
        speaker: 'Elena Scott',
        timestamp: '00:05:02',
        confidence: 0.88,
        fieldMapped: 'Monday.com: Action Items Board',
        reasoning: 'Matched prompt pattern "send ... by Friday".',
        verdict: 'correct',
        detectedBy: 'keyword',
        keywordMatcherFlaggedReason: 'Matched action verb: "send by Friday"'
      },
      {
        id: 'kw-4',
        type: 'delay',
        quote: 'Honestly, we may need to delay launch because of legal.',
        speaker: 'Dan Vance',
        timestamp: '00:03:10',
        confidence: 0.52,
        fieldMapped: 'Monday.com: Milestone Delay Flag',
        reasoning: 'Classified with low confidence as speculative comment due to modal word "may".',
        verdict: 'correct',
        detectedBy: 'keyword',
        keywordMatcherFlaggedReason: 'Matched keyword: "delay launch"'
      }
    ],
    contextSignals: [
      {
        id: 'ctx-1',
        type: 'delay',
        quote: 'Honestly, we may need to delay launch because of legal. Our counsel requested three clause adjustments.',
        speaker: 'Dan Vance (VP Tech, Tideline)',
        timestamp: '00:03:10',
        confidence: 0.94,
        fieldMapped: 'Monday.com: Launch Date Flag → "Legal Review Delay"',
        reasoning: 'Speaker is client executive declaring legal dependency directly governing cutover date.',
        verdict: 'correct',
        detectedBy: 'context'
      },
      {
        id: 'ctx-2',
        type: 'action_item',
        quote: 'Can you send the security questionnaire by Friday? That will let us clear the compliance committee on Monday.',
        speaker: 'Elena Scott (Security Lead)',
        timestamp: '00:05:02',
        confidence: 0.96,
        fieldMapped: 'Monday.com: Tasks → "Send security questionnaire" (Owner: Priya Nair, Due: Friday)',
        reasoning: 'Concrete deliverable with target deadline and explicit downstream milestone impact.',
        verdict: 'correct',
        detectedBy: 'context'
      },
      {
        id: 'ctx-3',
        type: 'milestone',
        quote: 'Let’s move go-live from the 12th to the 19th so we have clean buffer.',
        speaker: 'Dan Vance (VP Tech, Tideline)',
        timestamp: '00:05:45',
        confidence: 0.98,
        fieldMapped: 'Monday.com: Target Go-Live Date → Oct 19 (+7d)',
        reasoning: 'Direct executive instruction establishing revised onboarding go-live date with clear rationale.',
        verdict: 'correct',
        detectedBy: 'context'
      },
      {
        id: 'ctx-4',
        type: 'risk',
        quote: 'Also, we’ll probably need another week to review SSO with Okta.',
        speaker: 'Elena Scott (Security Lead)',
        timestamp: '00:06:12',
        confidence: 0.89,
        fieldMapped: 'Monday.com: Integration Risk → "Okta SSO Scope Extension"',
        reasoning: 'Technical stakeholder identifies secondary configuration delay that keyword heuristics skipped entirely.',
        verdict: 'correct',
        detectedBy: 'context'
      }
    ],
    keywordMetrics: { totalFound: 4, falsePositives: 2, missed: 2 },
    contextMetrics: { totalFound: 4, falsePositives: 0, missed: 0 }
  },

  {
    id: 'sample-mtg-1043',
    meetingId: 'MTG-1043',
    title: 'Platform Architecture Review',
    account: 'Tideline Energy',
    csm: 'Marcus Hale',
    summary: 'Technical architecture sync addressing cloud connector throughput and billing sync schedules.',
    lines: [
      { id: 'b1', speaker: 'Marcus Hale (CSM)', timestamp: '00:01:10', text: 'Let’s review the data throughput requirements for the ERP connectors.' },
      { id: 'b2', speaker: 'Sarah Lin (Chief Architect)', timestamp: '00:01:45', text: 'We noticed our legacy server had an outage two months ago, but our new AWS cluster handles 50k req/sec easily.' },
      { id: 'b3', speaker: 'Marcus Hale (CSM)', timestamp: '00:02:20', text: 'Great. Are there any outstanding blockers on the webhook endpoints?' },
      { id: 'b4', speaker: 'Sarah Lin (Chief Architect)', timestamp: '00:02:40', text: 'No blockers on endpoints. But please note: we will migrate the staging database next Tuesday night.' },
      { id: 'b5', speaker: 'Marcus Hale (CSM)', timestamp: '00:03:00', text: 'Understood, I will ensure no migration jobs run during that maintenance window.' }
    ],
    keywordSignals: [
      {
        id: 'kw-b1',
        type: 'risk',
        quote: '...our legacy server had an outage two months ago...',
        speaker: 'Sarah Lin',
        timestamp: '00:01:45',
        confidence: 0.70,
        fieldMapped: 'Monday.com: System Stability Alert',
        reasoning: 'Keyword "outage" triggered risk alert even though it referred to legacy hardware replaced 2 months ago.',
        verdict: 'false_positive',
        detectedBy: 'keyword',
        keywordMatcherFlaggedReason: 'Matched keyword: "outage"'
      },
      {
        id: 'kw-b2',
        type: 'blocker',
        quote: 'No blockers on endpoints.',
        speaker: 'Sarah Lin',
        timestamp: '00:02:40',
        confidence: 0.62,
        fieldMapped: 'Monday.com: Project Status → "Blocker"',
        reasoning: 'Keyword "blocker" matched without parsing negative preposition "No".',
        verdict: 'false_positive',
        detectedBy: 'keyword',
        keywordMatcherFlaggedReason: 'Matched keyword: "blocker"'
      }
    ],
    contextSignals: [
      {
        id: 'ctx-b1',
        type: 'milestone',
        quote: '...we will migrate the staging database next Tuesday night.',
        speaker: 'Sarah Lin (Chief Architect)',
        timestamp: '00:02:40',
        confidence: 0.95,
        fieldMapped: 'Monday.com: Maintenance Window → "Next Tuesday 22:00 UTC"',
        reasoning: 'Explicit planned change notification requiring job pause.',
        verdict: 'correct',
        detectedBy: 'context'
      }
    ],
    keywordMetrics: { totalFound: 2, falsePositives: 2, missed: 1 },
    contextMetrics: { totalFound: 1, falsePositives: 0, missed: 0 }
  }
];
