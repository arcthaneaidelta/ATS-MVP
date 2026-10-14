import type { FunnelStageData } from '../types';

export const FUNNEL_STAGES: FunnelStageData[] = [
  {
    stageId: 'calendar',
    name: '1. Eligible Meetings on Calendar',
    system: 'Google Calendar / Base44',
    count: 60,
    dropCount: 0,
    dropPercent: 0,
    affectedMeetingIds: []
  },
  {
    stageId: 'bot_scheduled',
    name: '2. Recall.ai Bot Scheduled & Joined',
    system: 'Recall.ai Bot Worker',
    count: 46,
    dropCount: 14,
    dropPercent: 23.3,
    dropExplanation: '14 meetings were never joined: 5 recurring series changes not detected, 4 expired OAuth tokens, 3 lobby timeouts before host admitted bot, 2 host cancelled.',
    affectedMeetingIds: ['MTG-1047', 'MTG-1054', 'MTG-1056', 'MTG-1059', 'MTG-1063', 'MTG-1066', 'MTG-1067', 'MTG-1069', 'MTG-1070']
  },
  {
    stageId: 'bot_recording',
    name: '3. Full Call Recording Captured',
    system: 'Recall.ai Audio Stream',
    count: 44,
    dropCount: 2,
    dropPercent: 4.3,
    dropExplanation: '2 meetings were joined by bot but prematurely closed (e.g., host joined wrong room and left in under 45 seconds).',
    affectedMeetingIds: []
  },
  {
    stageId: 'transcript',
    name: '4. Transcript Webhook Delivered',
    system: 'Webhook Ingestion Pipeline',
    count: 41,
    dropCount: 3,
    dropPercent: 6.8,
    dropExplanation: '3 meetings successfully recorded and transcribed by Recall.ai, but the inbound webhook failed with HTTP 504 Gateway Timeout or unhandled JSON encoding error.',
    affectedMeetingIds: ['MTG-1060', 'MTG-1068']
  },
  {
    stageId: 'llm_extraction',
    name: '5. LLM Structured Extraction',
    system: 'Base44 AI Agent',
    count: 41,
    dropCount: 0,
    dropPercent: 0,
    dropExplanation: 'All 41 delivered transcripts were fed to the LLM. However, prompt quality issues caused false positives and missed key dates on ~5 calls.',
    affectedMeetingIds: ['MTG-1051']
  },
  {
    stageId: 'crm_update',
    name: '6. Monday.com CRM Board Synchronized',
    system: 'Monday.com GraphQL API',
    count: 35,
    dropCount: 6,
    dropPercent: 14.6,
    dropExplanation: '6 recorded & transcribed meetings leaked before CRM update: 2 column name mismatches on customer boards and 4 unhandled rate-limit retry drops.',
    affectedMeetingIds: []
  }
];

export const FUNNEL_SUMMARY = {
  totalEligible: 60,
  totalRecorded: 44,
  totalDelivered: 35,
  silentLossCount: 9, // 44 recorded - 35 pushed = 9 lost downstream!
  headline: 'Recorded ≠ delivered: 9 recorded meetings never reached Monday.com.',
  subtext: 'While the team assumed bot joining was the only problem, 20% of successfully recorded audio was silently dropped downstream by webhook timeouts and CRM schema mismatches.'
};
