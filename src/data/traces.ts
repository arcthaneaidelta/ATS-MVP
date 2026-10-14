import type { MeetingTrace, PipelineStageInfo, StageStatus } from '../types';
import { MEETINGS_DATA } from './meetings';

export const TRACES_MAP: Record<string, MeetingTrace> = {
  'MTG-1056': {
    meetingId: 'MTG-1056',
    stages: [
      { id: 'calendar', stepNumber: 1, name: 'Calendar Event', subtitle: 'Google Cal invite synced', status: 'passed', timestamp: '15:55:00', evidence: 'Sync OK (ID: evt_or_44910)' },
      { id: 'bot_scheduled', stepNumber: 2, name: 'Bot Scheduled', subtitle: 'Recall.ai API accepted', status: 'passed', timestamp: '15:58:30', evidence: 'Bot ID bot_882910 queued' },
      { id: 'bot_recording', stepNumber: 3, name: 'Bot Joined & Recording', subtitle: 'Waiting room timeout', status: 'failed', timestamp: '16:10:12', evidence: 'fatal: waiting_room_timeout (600s)' },
      { id: 'transcript', stepNumber: 4, name: 'Transcript Received', subtitle: 'No media generated', status: 'skipped', evidence: 'Bypassed due to early termination' },
      { id: 'llm_extraction', stepNumber: 5, name: 'LLM Extraction', subtitle: 'No input transcript', status: 'skipped', evidence: 'Bypassed' },
      { id: 'crm_update', stepNumber: 6, name: 'CRM / Monday.com', subtitle: 'No record pushed', status: 'skipped', evidence: 'Bypassed' }
    ],
    timelineLogs: [
      { id: 'l1', timestamp: '15:55:00.120', level: 'info', system: 'Google Cal', event: 'calendar.event.synced', details: 'Integration workshop confirmed for 16:00:00 UTC (CSM: Marcus Hale)' },
      { id: 'l2', timestamp: '15:58:30.402', level: 'info', system: 'Base44', event: 'bot.dispatch_scheduled', details: 'POST https://api.recall.ai/api/v1/bot/ -> 201 Created (bot_id: bot_882910)' },
      { id: 'l3', timestamp: '15:59:50.015', level: 'info', system: 'Recall.ai', event: 'bot.joining_call', details: 'Connecting to Zoom room #918-220-4491...' },
      { id: 'l4', timestamp: '16:00:12.890', level: 'warn', system: 'Recall.ai', event: 'bot.status_change', details: 'Entered Zoom waiting room. Host has not started session or admitted attendees.' },
      { id: 'l5', timestamp: '16:05:00.000', level: 'warn', system: 'Recall.ai', event: 'bot.heartbeat', details: 'Still in waiting room. 300s elapsed. Configured timeout: 600s.' },
      { id: 'l6', timestamp: '16:10:12.441', level: 'error', system: 'Recall.ai', event: 'bot.fatal_timeout', details: 'waiting_room_timeout exceeded (600s). Bot left room automatically.' },
      { id: 'l7', timestamp: '16:11:15.109', level: 'info', system: 'Zoom', event: 'host.admitted_all', details: 'Host joined 11m15s late and admitted participants. Bot was already terminated.' },
      { id: 'l8', timestamp: '16:11:16.200', level: 'error', system: 'Webhooks', event: 'bot.status.done', details: 'sub_code: "waiting_room_timeout". Audio duration: 0s.' }
    ],
    botConfig: {
      botId: 'bot_882910',
      botName: 'Northbeam Notetaker (Recall.ai)',
      joinAt: '2026-10-09T16:00:00Z',
      recordingMode: 'speaker_view_and_audio',
      waitingRoomTimeoutSeconds: 600,
      transcriptionProvider: 'assembly_ai',
      automaticJoin: true,
      meetingUrl: 'https://zoom.us/j/9182204491',
      oauthScopeGranted: true,
      tokenExpiresAt: '2026-11-20T00:00:00Z'
    },
    webhookLogs: [
      { id: 'wh-1', timestamp: '15:58:31.020', event: 'bot.created', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 200, retries: 0, idempotencyKey: 'wh_evt_0981a', payloadPreview: '{"bot_id":"bot_882910","status":"ready"}' },
      { id: 'wh-2', timestamp: '16:00:13.200', event: 'bot.in_waiting_room', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 200, retries: 0, idempotencyKey: 'wh_evt_0981b', payloadPreview: '{"bot_id":"bot_882910","status":"waiting_room"}' },
      { id: 'wh-3', timestamp: '16:10:13.501', event: 'bot.done', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 200, retries: 0, idempotencyKey: 'wh_evt_0981c', payloadPreview: '{"bot_id":"bot_882910","status":"done","sub_code":"waiting_room_timeout","duration":0}' }
    ],
    extractionOutput: {
      status: 'not_reached',
      model: 'gpt-4o-mini',
      promptVersion: 'v2.1-base44-signals',
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      executionTimeMs: 0,
      extractedSignalsCount: 0,
      rawJsonSnippet: '// Pipeline terminated before transcript stage.\n// No recording media was captured.'
    },
    rootCauseCallout: {
      title: 'Lobby Timeout Exceeded Host Delay',
      confidence: 'High',
      diagnosis: 'This call was not missed due to a bot outage. The bot joined at 16:00 on time, but waited 10 minutes in the Zoom waiting room. The host admitted participants at 16:11:15 (11m 15s in). The default Recall.ai timeout (600s / 10m) triggered 45 seconds too early.',
      smallestFix: 'Increase Recall.ai waiting_room_timeout to 1200s (20 mins) and send CSM an automated Slack ping after 3 mins in waiting room.',
      findingIdRef: 'FIND-03'
    }
  },

  'MTG-1047': {
    meetingId: 'MTG-1047',
    stages: [
      { id: 'calendar', stepNumber: 1, name: 'Calendar Event', subtitle: 'Google Cal recurring instance', status: 'passed', timestamp: '14:25:00', evidence: 'Sub-instance modified in Cal' },
      { id: 'bot_scheduled', stepNumber: 2, name: 'Bot Scheduled', subtitle: 'Instance ID mismatch', status: 'failed', timestamp: '14:29:00', evidence: 'Recurring ID not registered' },
      { id: 'bot_recording', stepNumber: 3, name: 'Bot Joined & Recording', subtitle: 'Bot was never queued', status: 'skipped', evidence: 'No bot job' },
      { id: 'transcript', stepNumber: 4, name: 'Transcript Received', subtitle: 'No media', status: 'skipped', evidence: 'Skipped' },
      { id: 'llm_extraction', stepNumber: 5, name: 'LLM Extraction', subtitle: 'No transcript', status: 'skipped', evidence: 'Skipped' },
      { id: 'crm_update', stepNumber: 6, name: 'CRM / Monday.com', subtitle: 'No record', status: 'skipped', evidence: 'Skipped' }
    ],
    timelineLogs: [
      { id: 'l1', timestamp: '14:20:00.100', level: 'info', system: 'Google Cal', event: 'calendar.event.recurring_updated', details: 'User shifted recurring series instance from 14:00 to 14:30.' },
      { id: 'l2', timestamp: '14:20:01.400', level: 'warn', system: 'Base44', event: 'sync.handler', details: 'Processed parent series master ID #rec_9941. Individual recurrence instance 20261008T143000Z was not expanded.' },
      { id: 'l3', timestamp: '14:29:00.000', level: 'error', system: 'Base44', event: 'scheduler.job_missing', details: 'No Recall.ai bot creation request dispatched for modified instance.' },
      { id: 'l4', timestamp: '14:30:00.000', level: 'error', system: 'Recall.ai', event: 'bot.idle', details: 'No bot was requested for Zoom #zoom-bc-rec-02 at this timestamp.' }
    ],
    botConfig: {
      botId: 'none',
      botName: 'Unassigned',
      joinAt: 'N/A',
      recordingMode: 'N/A',
      waitingRoomTimeoutSeconds: 600,
      transcriptionProvider: 'assembly_ai',
      automaticJoin: true,
      meetingUrl: 'https://zoom.us/j/rec-02',
      oauthScopeGranted: true,
      tokenExpiresAt: '2026-12-01T00:00:00Z'
    },
    webhookLogs: [
      { id: 'wh-1', timestamp: '14:20:02.000', event: 'calendar.webhook', destination: 'https://app.northbeam.io/webhooks/gcal', httpStatus: 200, retries: 0, idempotencyKey: 'gcal_rec_09', payloadPreview: '{"summary":"Weekly Sync","recurringEventId":"rec_9941"}' }
    ],
    extractionOutput: {
      status: 'not_reached',
      model: 'gpt-4o-mini',
      promptVersion: 'v2.1',
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      executionTimeMs: 0,
      extractedSignalsCount: 0,
      rawJsonSnippet: '// Bot never joined call. Recurring instance ignored.'
    },
    rootCauseCallout: {
      title: 'Recurring Series Instance Not Expanded',
      confidence: 'High',
      diagnosis: 'Google Calendar recurrence rules generate single instance overrides when modified. The sync listener currently only listens to root series IDs and skips sub-instance event IDs, leaving modified recurring meetings completely unmonitored.',
      smallestFix: 'Expand Google Calendar recurring instances on webhook receipt and register Recall.ai bot per instance ID.',
      findingIdRef: 'FIND-01'
    }
  },

  'MTG-1051': {
    meetingId: 'MTG-1051',
    stages: [
      { id: 'calendar', stepNumber: 1, name: 'Calendar Event', subtitle: 'Google Meet invite synced', status: 'passed', timestamp: '10:55:00', evidence: 'Invite verified' },
      { id: 'bot_scheduled', stepNumber: 2, name: 'Bot Scheduled', subtitle: 'Recall bot queued', status: 'passed', timestamp: '10:58:00', evidence: 'bot_77192 created' },
      { id: 'bot_recording', stepNumber: 3, name: 'Bot Joined & Recording', subtitle: 'Audio recorded 45m', status: 'passed', timestamp: '11:00:08', evidence: 'Full audio track captured' },
      { id: 'transcript', stepNumber: 4, name: 'Transcript Received', subtitle: 'Full transcript parsed', status: 'passed', timestamp: '11:46:12', evidence: '1,420 words parsed' },
      { id: 'llm_extraction', stepNumber: 5, name: 'LLM Extraction', subtitle: 'Contextual signal dropped', status: 'failed', timestamp: '11:46:40', evidence: 'Keyword matcher dropped legal delay' },
      { id: 'crm_update', stepNumber: 6, name: 'CRM / Monday.com', subtitle: 'Partial / misleading push', status: 'passed', timestamp: '11:46:45', evidence: 'Pushed false positives to Monday' }
    ],
    timelineLogs: [
      { id: 'l1', timestamp: '11:00:08.100', level: 'info', system: 'Recall.ai', event: 'bot.joined', details: 'Joined Google Meet session cleanly. Recording started.' },
      { id: 'l2', timestamp: '11:45:00.000', level: 'info', system: 'Recall.ai', event: 'bot.meeting_ended', details: 'Host closed meeting. Audio saved (45m).' },
      { id: 'l3', timestamp: '11:46:12.300', level: 'info', system: 'Webhooks', event: 'transcript.ready', details: 'Transcript payload received (1420 words).' },
      { id: 'l4', timestamp: '11:46:20.100', level: 'warn', system: 'LLM Agent', event: 'keyword_matcher.eval', details: 'Keyword "problem" matched line 7 ("other vendor had a problem") -> flagged as Risk (False Positive).' },
      { id: 'l5', timestamp: '11:46:25.800', level: 'error', system: 'LLM Agent', event: 'keyword_matcher.eval', details: 'Quote "we may need to delay launch because of legal" skipped due to lack of hardcoded "blocker" keyword.' }
    ],
    botConfig: {
      botId: 'bot_77192',
      botName: 'Northbeam Notetaker',
      joinAt: '2026-10-09T11:00:00Z',
      recordingMode: 'speaker_view_and_audio',
      waitingRoomTimeoutSeconds: 600,
      transcriptionProvider: 'assembly_ai',
      automaticJoin: true,
      meetingUrl: 'https://meet.google.com/meet-te-44102',
      oauthScopeGranted: true,
      tokenExpiresAt: '2026-11-20T00:00:00Z'
    },
    webhookLogs: [
      { id: 'wh-1', timestamp: '11:46:12.400', event: 'transcript.completed', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 200, retries: 0, idempotencyKey: 'wh_tr_9912', payloadPreview: '{"bot_id":"bot_77192","transcript_length":1420}' }
    ],
    extractionOutput: {
      status: 'partial',
      model: 'gpt-4o-mini',
      promptVersion: 'v1.4-keyword-heuristics',
      tokensUsed: { prompt: 2100, completion: 280, total: 2380 },
      executionTimeMs: 1420,
      extractedSignalsCount: 2,
      rawJsonSnippet: '{\n  "status": "partial",\n  "false_positives": ["other vendor had a problem"],\n  "missed_risks": ["we may need to delay launch because of legal"]\n}'
    },
    rootCauseCallout: {
      title: 'Keyword Matcher Ignored Contextual Nuance',
      confidence: 'High',
      diagnosis: 'The recording and transcript succeeded 100%, but downstream intelligence failed. The keyword prompt flagged past vendor anecdotes as current risks while missing a genuine multi-week legal delay.',
      smallestFix: 'Replace heuristic regex/keyword prompt with a structured JSON schema requiring contextual rationale, sentiment polarity, and explicit customer commitment quotes.',
      findingIdRef: 'FIND-05'
    }
  },

  'MTG-1060': {
    meetingId: 'MTG-1060',
    stages: [
      { id: 'calendar', stepNumber: 1, name: 'Calendar Event', subtitle: 'Synced', status: 'passed', timestamp: '09:55:00', evidence: 'Synced' },
      { id: 'bot_scheduled', stepNumber: 2, name: 'Bot Scheduled', subtitle: 'Scheduled', status: 'passed', timestamp: '09:58:00', evidence: 'Queued' },
      { id: 'bot_recording', stepNumber: 3, name: 'Bot Joined & Recording', subtitle: '45 mins audio captured', status: 'passed', timestamp: '10:00:00', evidence: 'Recorded OK' },
      { id: 'transcript', stepNumber: 4, name: 'Transcript Received', subtitle: 'Webhook HTTP 504 Timeout', status: 'failed', timestamp: '10:46:10', evidence: 'App server timed out (504)' },
      { id: 'llm_extraction', stepNumber: 5, name: 'LLM Extraction', subtitle: 'Never triggered', status: 'skipped', evidence: 'Skipped' },
      { id: 'crm_update', stepNumber: 6, name: 'CRM / Monday.com', subtitle: 'Never triggered', status: 'skipped', evidence: 'Skipped' }
    ],
    timelineLogs: [
      { id: 'l1', timestamp: '10:45:00.000', level: 'info', system: 'Recall.ai', event: 'bot.done', details: 'Call completed. Recall finished transcript processing.' },
      { id: 'l2', timestamp: '10:46:10.120', level: 'error', system: 'Webhooks', event: 'webhook.delivery_failed', details: 'POST /api/recall-webhook timed out after 30,000ms (HTTP 504 Gateway Timeout).' },
      { id: 'l3', timestamp: '10:46:10.150', level: 'error', system: 'Base44', event: 'app.worker_choke', details: 'Sync webhook handler attempted synchronous LLM call inside request cycle, blocking Node.js event loop.' }
    ],
    botConfig: {
      botId: 'bot_91823',
      botName: 'Northbeam Notetaker',
      joinAt: '2026-10-10T10:00:00Z',
      recordingMode: 'speaker_view_and_audio',
      waitingRoomTimeoutSeconds: 600,
      transcriptionProvider: 'assembly_ai',
      automaticJoin: true,
      meetingUrl: 'https://meet.google.com/meet-cf-71288',
      oauthScopeGranted: true,
      tokenExpiresAt: '2026-11-20T00:00:00Z'
    },
    webhookLogs: [
      { id: 'wh-1', timestamp: '10:46:10.000', event: 'transcript.completed', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 504, retries: 0, idempotencyKey: 'wh_tr_cf_504', payloadPreview: '{"bot_id":"bot_91823","error":"504 Gateway Timeout"}' }
    ],
    extractionOutput: {
      status: 'not_reached',
      model: 'gpt-4o-mini',
      promptVersion: 'v2.1',
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      executionTimeMs: 0,
      extractedSignalsCount: 0,
      rawJsonSnippet: '// Webhook failed delivery. Transcript data lost in transit.'
    },
    rootCauseCallout: {
      title: 'Synchronous Webhook Execution Caused 504 Gateway Timeout',
      confidence: 'High',
      diagnosis: 'The webhook handler tried to parse transcript and run LLM synchronously within the HTTP request. When the prompt took >30s, the reverse proxy timed out and Recall webhook dropped the payload with zero configured retries.',
      smallestFix: 'Acknowledge Recall.ai with 200 OK immediately and push transcript job to an asynchronous queue with an idempotency key.',
      findingIdRef: 'FIND-04'
    }
  },

  'MTG-1066': {
    meetingId: 'MTG-1066',
    stages: [
      { id: 'calendar', stepNumber: 1, name: 'Calendar Event', subtitle: 'Google Cal invite synced', status: 'passed', timestamp: '09:20:00', evidence: 'Synced' },
      { id: 'bot_scheduled', stepNumber: 2, name: 'Bot Scheduled', subtitle: '401 OAuth token expired', status: 'failed', timestamp: '09:28:00', evidence: 'Token expired at 04:00 UTC' },
      { id: 'bot_recording', stepNumber: 3, name: 'Bot Joined & Recording', subtitle: 'Join denied', status: 'skipped', evidence: 'No auth' },
      { id: 'transcript', stepNumber: 4, name: 'Transcript Received', subtitle: 'No audio', status: 'skipped', evidence: 'Skipped' },
      { id: 'llm_extraction', stepNumber: 5, name: 'LLM Extraction', subtitle: 'Skipped', status: 'skipped', evidence: 'Skipped' },
      { id: 'crm_update', stepNumber: 6, name: 'CRM / Monday.com', subtitle: 'Skipped', status: 'skipped', evidence: 'Skipped' }
    ],
    timelineLogs: [
      { id: 'l1', timestamp: '09:28:00.100', level: 'error', system: 'Recall.ai', event: 'bot.create_failed', details: 'Recall API returned 401 Unauthorized: Zoom OAuth access token for priya@northbeam.io expired.' },
      { id: 'l2', timestamp: '09:28:00.300', level: 'error', system: 'Base44', event: 'auth.refresh_failure', details: 'No automated refresh token rotation configured in oauth_tokens table.' }
    ],
    botConfig: {
      botId: 'unauthorized',
      botName: 'Northbeam Notetaker',
      joinAt: '2026-10-11T09:30:00Z',
      recordingMode: 'speaker_view_and_audio',
      waitingRoomTimeoutSeconds: 600,
      transcriptionProvider: 'assembly_ai',
      automaticJoin: true,
      meetingUrl: 'https://zoom.us/j/hl-oauth-exp',
      oauthScopeGranted: false,
      tokenExpiresAt: '2026-10-11T04:00:00Z'
    },
    webhookLogs: [
      { id: 'wh-1', timestamp: '09:28:01.000', event: 'bot.create_error', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 401, retries: 0, idempotencyKey: 'wh_auth_err_1', payloadPreview: '{"error":"token_expired"}' }
    ],
    extractionOutput: {
      status: 'not_reached',
      model: 'gpt-4o-mini',
      promptVersion: 'v2.1',
      tokensUsed: { prompt: 0, completion: 0, total: 0 },
      executionTimeMs: 0,
      extractedSignalsCount: 0,
      rawJsonSnippet: '// Bot rejected by Zoom OAuth API'
    },
    rootCauseCallout: {
      title: 'Expired Zoom OAuth Refresh Token',
      confidence: 'High',
      diagnosis: 'CSM Zoom integration token reached its 90-day expiration limit at 04:00 UTC with no background refresh daemon in place. Recall bot join request was rejected with 401.',
      smallestFix: 'Add automated token refresh cron running 24h prior to expiry and display an in-app banner if re-authentication is required.',
      findingIdRef: 'FIND-02'
    }
  },

  'MTG-1042': {
    meetingId: 'MTG-1042',
    stages: [
      { id: 'calendar', stepNumber: 1, name: 'Calendar Event', subtitle: 'Event confirmed', status: 'passed', timestamp: '08:50:00', evidence: 'Meet invite parsed' },
      { id: 'bot_scheduled', stepNumber: 2, name: 'Bot Scheduled', subtitle: 'Recall bot created', status: 'passed', timestamp: '08:55:00', evidence: 'bot_104291 ready' },
      { id: 'bot_recording', stepNumber: 3, name: 'Bot Joined & Recording', subtitle: 'Admitted in 14s, 45m audio', status: 'passed', timestamp: '09:00:14', evidence: 'Full 45m captured' },
      { id: 'transcript', stepNumber: 4, name: 'Transcript Received', subtitle: 'Parsed 1,840 words', status: 'passed', timestamp: '09:46:02', evidence: 'assembly_ai OK' },
      { id: 'llm_extraction', stepNumber: 5, name: 'LLM Extraction', subtitle: '4 action items extracted', status: 'passed', timestamp: '09:46:18', evidence: 'Confidence 0.94 avg' },
      { id: 'crm_update', stepNumber: 6, name: 'CRM / Monday.com', subtitle: 'Board updated in 240ms', status: 'passed', timestamp: '09:46:20', evidence: 'Item #mnd_88201 updated' }
    ],
    timelineLogs: [
      { id: 'l1', timestamp: '08:50:00.000', level: 'info', system: 'Google Cal', event: 'calendar.synced', details: 'Kickoff call detected for Halvorsen Logistics.' },
      { id: 'l2', timestamp: '08:55:00.000', level: 'info', system: 'Recall.ai', event: 'bot.created', details: 'Bot bot_104291 spawned with AssemblyAI speech-to-text pipeline.' },
      { id: 'l3', timestamp: '09:00:14.000', level: 'info', system: 'Recall.ai', event: 'bot.joined', details: 'Host admitted bot immediately. Audio capture streaming.' },
      { id: 'l4', timestamp: '09:45:00.000', level: 'info', system: 'Recall.ai', event: 'bot.meeting_ended', details: '45 mins recording finalized and transcribed.' },
      { id: 'l5', timestamp: '09:46:02.000', level: 'info', system: 'Webhooks', event: 'transcript.delivered', details: 'Delivered in 420ms to /api/recall-webhook.' },
      { id: 'l6', timestamp: '09:46:18.000', level: 'info', system: 'LLM Agent', event: 'extraction.success', details: 'Extracted 4 action items, 1 milestone target.' },
      { id: 'l7', timestamp: '09:46:20.000', level: 'info', system: 'Monday.com', event: 'crm.sync_completed', details: 'Updated Halvorsen Logistics Onboarding board #88201.' }
    ],
    botConfig: {
      botId: 'bot_104291',
      botName: 'Northbeam Notetaker',
      joinAt: '2026-10-07T09:00:00Z',
      recordingMode: 'speaker_view_and_audio',
      waitingRoomTimeoutSeconds: 600,
      transcriptionProvider: 'assembly_ai',
      automaticJoin: true,
      meetingUrl: 'https://meet.google.com/meet-hl-9041a',
      oauthScopeGranted: true,
      tokenExpiresAt: '2026-12-15T00:00:00Z'
    },
    webhookLogs: [
      { id: 'wh-1', timestamp: '08:55:01.000', event: 'bot.created', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 200, retries: 0, idempotencyKey: 'wh_ok_1', payloadPreview: '{"status":"ready"}' },
      { id: 'wh-2', timestamp: '09:46:02.000', event: 'transcript.completed', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: 200, retries: 0, idempotencyKey: 'wh_ok_2', payloadPreview: '{"words":1840,"status":"completed"}' }
    ],
    extractionOutput: {
      status: 'success',
      model: 'gpt-4o-mini',
      promptVersion: 'v2.1',
      tokensUsed: { prompt: 2400, completion: 320, total: 2720 },
      executionTimeMs: 1600,
      extractedSignalsCount: 5,
      rawJsonSnippet: '{\n  "action_items": 4,\n  "milestones": 1,\n  "confidence_avg": 0.94,\n  "board_id": "88201"\n}'
    },
    rootCauseCallout: {
      title: 'Full Pipeline Verified Healthy',
      confidence: 'High',
      diagnosis: 'All 6 stages from Google Calendar invite synchronization through Recall.ai recording, webhook delivery, structured LLM extraction, and Monday.com synchronization executed with zero dropped events.',
      smallestFix: 'No fixes needed for this flow. Serves as reference gold standard for latency and accuracy benchmarks.',
      findingIdRef: undefined
    }
  }
};

// Fallback generator for other meetings in dataset
export function getTraceForMeeting(meetingId: string): MeetingTrace {
  if (TRACES_MAP[meetingId]) {
    return TRACES_MAP[meetingId];
  }

  const meeting = MEETINGS_DATA.find((m) => m.id === meetingId) || MEETINGS_DATA[0];
  const isMissed = meeting.outcome === 'Missed';

  const stages: PipelineStageInfo[] = [
    { id: 'calendar', stepNumber: 1, name: 'Calendar Event', subtitle: 'Calendar sync', status: 'passed', timestamp: 'T-10m', evidence: 'Sync OK' },
    {
      id: 'bot_scheduled',
      stepNumber: 2,
      name: 'Bot Scheduled',
      subtitle: meeting.stageIdReached === 'calendar' ? 'Sync failed' : 'Recall bot scheduled',
      status: (meeting.stageIdReached === 'calendar' ? 'failed' : 'passed') as StageStatus,
      timestamp: 'T-5m',
      evidence: meeting.stageIdReached === 'calendar' ? 'Calendar status dropped' : 'Recall job accepted'
    },
    {
      id: 'bot_recording',
      stepNumber: 3,
      name: 'Bot Joined & Recording',
      subtitle: meeting.stageIdReached === 'bot_scheduled' ? 'Join aborted' : (meeting.stageIdReached === 'bot_recording' && isMissed ? 'Lobby / timing error' : 'Audio recorded'),
      status: (meeting.stageIdReached === 'bot_scheduled' ? 'skipped' : (meeting.stageIdReached === 'bot_recording' && isMissed ? 'failed' : 'passed')) as StageStatus,
      timestamp: 'T+0m',
      evidence: isMissed ? meeting.rootCauseSummary : 'Recording healthy'
    },
    {
      id: 'transcript',
      stepNumber: 4,
      name: 'Transcript Received',
      subtitle: meeting.stageIdReached === 'transcript' && isMissed ? 'Webhook timeout/failure' : (isMissed ? 'Skipped' : 'Transcript parsed'),
      status: (meeting.stageIdReached === 'transcript' && isMissed ? 'failed' : (isMissed ? 'skipped' : 'passed')) as StageStatus,
      timestamp: 'T+45m',
      evidence: meeting.stageIdReached === 'transcript' && isMissed ? 'HTTP 500/504 error' : (isMissed ? 'Bypassed' : 'AssemblyAI parsed')
    },
    {
      id: 'llm_extraction',
      stepNumber: 5,
      name: 'LLM Extraction',
      subtitle: meeting.stageIdReached === 'llm_extraction' && isMissed ? 'Context mismatch' : (isMissed ? 'Skipped' : 'Signals extracted'),
      status: (meeting.stageIdReached === 'llm_extraction' && isMissed ? 'failed' : (isMissed ? 'skipped' : 'passed')) as StageStatus,
      timestamp: 'T+46m',
      evidence: isMissed ? 'Prompt missed context' : 'Extraction OK'
    },
    {
      id: 'crm_update',
      stepNumber: 6,
      name: 'CRM / Monday.com',
      subtitle: isMissed ? 'Not delivered' : 'Updated Monday.com',
      status: (isMissed ? 'skipped' : 'passed') as StageStatus,
      timestamp: 'T+47m',
      evidence: isMissed ? 'No update sent' : 'Monday board synced'
    }
  ];

  return {
    meetingId: meeting.id,
    stages,
    timelineLogs: [
      { id: 'l1', timestamp: 'T-10m:00s', level: 'info', system: 'Google Cal', event: 'calendar.event.detected', details: `Found calendar invite for ${meeting.account} (${meeting.title})` },
      { id: 'l2', timestamp: 'T-05m:00s', level: isMissed && meeting.stageIdReached === 'calendar' ? 'error' : 'info', system: 'Recall.ai', event: 'bot.schedule', details: isMissed && meeting.stageIdReached === 'calendar' ? 'Bot scheduling failed' : 'Bot created on Recall.ai' },
      { id: 'l3', timestamp: 'T+00m:15s', level: isMissed ? 'error' : 'info', system: meeting.platform === 'Zoom' ? 'Recall.ai' : 'Google Cal', event: isMissed ? 'call.failure' : 'bot.admitted', details: meeting.rootCauseSummary }
    ],
    botConfig: {
      botId: `bot_${meeting.id.toLowerCase()}`,
      botName: 'Northbeam Notetaker',
      joinAt: meeting.scheduledStart,
      recordingMode: 'speaker_view_and_audio',
      waitingRoomTimeoutSeconds: 600,
      transcriptionProvider: 'assembly_ai',
      automaticJoin: true,
      meetingUrl: `https://${meeting.platform.toLowerCase().replace(' ', '')}.com/room/${meeting.externalMeetingId}`,
      oauthScopeGranted: meeting.causeCategory !== 'Platform authorisation (OAuth/token)',
      tokenExpiresAt: '2026-11-30T00:00:00Z'
    },
    webhookLogs: [
      { id: 'wh-gen', timestamp: 'T+00m:00s', event: 'meeting.sync', destination: 'https://app.northbeam.io/webhooks/recall', httpStatus: isMissed ? 500 : 200, retries: isMissed ? 1 : 0, idempotencyKey: `wh_${meeting.id}`, payloadPreview: `{"meeting_id":"${meeting.id}","status":"${meeting.outcome}"}` }
    ],
    extractionOutput: {
      status: isMissed ? 'not_reached' : 'success',
      model: 'gpt-4o-mini',
      promptVersion: 'v2.1',
      tokensUsed: { prompt: isMissed ? 0 : 1800, completion: isMissed ? 0 : 250, total: isMissed ? 0 : 2050 },
      executionTimeMs: isMissed ? 0 : 920,
      extractedSignalsCount: isMissed ? 0 : 3,
      rawJsonSnippet: isMissed ? `// Stage failed at: ${meeting.stageReached}` : '{"status":"ok","signals":3}'
    },
    rootCauseCallout: {
      title: meeting.causeCategory || 'Healthy Pipeline Flow',
      confidence: 'High',
      diagnosis: meeting.rootCauseSummary,
      smallestFix: meeting.smallestFix
    }
  };
}
