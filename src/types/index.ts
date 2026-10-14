export type PlatformType = 'Zoom' | 'Google Meet' | 'Microsoft Teams';

export type OutcomeType = 'Recorded' | 'Missed';

export type CauseCategory =
  | 'Calendar sync gap'
  | 'Recurring/rescheduled mismatch'
  | 'Lobby / host timing'
  | 'Platform authorisation (OAuth/token)'
  | 'Bot scheduling/API response'
  | 'Webhook/event delivery'
  | 'Downstream mapping (app → Monday.com)';

export type StageId = 
  | 'calendar'
  | 'bot_scheduled'
  | 'bot_recording'
  | 'transcript'
  | 'llm_extraction'
  | 'crm_update';

export interface Meeting {
  id: string; // e.g., "MTG-1042"
  title: string;
  account: string;
  csm: string;
  platform: PlatformType;
  scheduledStart: string;
  durationMinutes: number;
  outcome: OutcomeType;
  stageReached: string;
  stageIdReached: StageId;
  causeCategory: CauseCategory | null;
  rootCauseSummary: string;
  smallestFix: string;
  failureEvidenceSnippet?: string;
  externalMeetingId: string;
}

export type StageStatus = 'passed' | 'failed' | 'skipped' | 'waiting';

export interface PipelineStageInfo {
  id: StageId;
  stepNumber: number;
  name: string;
  subtitle: string;
  status: StageStatus;
  timestamp?: string;
  evidence?: string;
  latencyMs?: number;
}

export interface TimelineLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  system: 'Google Cal' | 'Recall.ai' | 'Webhooks' | 'LLM Agent' | 'Base44' | 'Monday.com' | 'Zoom' | 'Teams';
  event: string;
  details: string;
}

export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  event: string;
  destination: string;
  httpStatus: number;
  retries: number;
  idempotencyKey: string;
  payloadPreview: string;
}

export interface BotConfigSnapshot {
  botId: string;
  botName: string;
  joinAt: string;
  recordingMode: string;
  waitingRoomTimeoutSeconds: number;
  transcriptionProvider: string;
  automaticJoin: boolean;
  meetingUrl: string;
  oauthScopeGranted: boolean;
  tokenExpiresAt: string;
}

export interface ExtractionOutputSnapshot {
  status: 'success' | 'partial' | 'failed' | 'not_reached';
  model: string;
  promptVersion: string;
  tokensUsed: { prompt: number; completion: number; total: number };
  executionTimeMs: number;
  extractedSignalsCount: number;
  rawJsonSnippet: string;
}

export interface MeetingTrace {
  meetingId: string;
  stages: PipelineStageInfo[];
  timelineLogs: TimelineLogEntry[];
  botConfig: BotConfigSnapshot;
  webhookLogs: WebhookLogEntry[];
  extractionOutput: ExtractionOutputSnapshot;
  rootCauseCallout: {
    title: string;
    confidence: 'High' | 'Medium';
    diagnosis: string;
    smallestFix: string;
    findingIdRef?: string;
  };
}

export type SignalType = 'risk' | 'blocker' | 'delay' | 'milestone' | 'action_item' | 'customer_signal';

export interface SignalItem {
  id: string;
  type: SignalType;
  quote: string;
  speaker: string;
  timestamp: string;
  confidence: number;
  fieldMapped: string;
  reasoning: string;
  verdict: 'correct' | 'false_positive' | 'missed';
  detectedBy: 'keyword' | 'context' | 'both';
  keywordMatcherFlaggedReason?: string;
}

export interface TranscriptLine {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  signalId?: string;
}

export interface Finding {
  id: string; // e.g. "FIND-01"
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  affectedCount: number;
  stageTag: string;
  smallestFixSummary: string;
  evidence: string;
  rootCause: string;
  proposedFix: string;
  riskOfChange: 'Low' | 'Medium' | 'Minimal';
  effortHoursEstimate: string; // e.g. "4-6 hrs"
  effort: 'S' | 'M' | 'L';
  inScopeDefault: boolean;
}

export interface FunnelStageData {
  stageId: StageId;
  name: string;
  system: string;
  count: number;
  dropCount: number;
  dropPercent: number;
  dropExplanation?: string;
  affectedMeetingIds: string[];
}

export interface ProposalItem {
  qNumber: string;
  question: string;
  summaryQuote: string;
  answerText: string;
  links: { route: string; label: string }[];
  keyHighlights: string[];
}
