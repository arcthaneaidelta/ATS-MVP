import type { Meeting, MeetingTrace } from '../types';
import { MEETINGS_DATA } from '../data/meetings';
import { getTraceForMeeting } from '../data/traces';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isStableMode = () => {
  if (typeof window === 'undefined') return true;
  return new URLSearchParams(window.location.search).get('stable') === '1';
};

export async function fetchMeetings(): Promise<Meeting[]> {
  await sleep(320);
  // Inject simulated 3% error unless stable=1
  if (!isStableMode() && Math.random() < 0.03) {
    throw new Error('Simulated network jitter reading meetings. Please retry.');
  }
  return MEETINGS_DATA;
}

export async function fetchMeetingTrace(meetingId: string): Promise<MeetingTrace> {
  await sleep(400);
  if (!isStableMode() && Math.random() < 0.03) {
    throw new Error(`Failed to load trace for ${meetingId}. Service responded with transient 503.`);
  }
  return getTraceForMeeting(meetingId);
}

export async function simulateAnalysisProgress(onStep: (stepIndex: number) => void): Promise<void> {
  onStep(1); // Segmenting audio & timestamps
  await sleep(650);
  onStep(2); // Classifying conversational polarity & intents
  await sleep(750);
  onStep(3); // Mapping to Monday.com structured schema
  await sleep(550);
}
