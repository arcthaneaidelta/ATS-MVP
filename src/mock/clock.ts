/**
 * Demo clock fixed to Sat 10 Oct 2026 at initial load.
 * Supports fast-forwarding 24 hours to trigger reminders and simulate timeline changes.
 */

// Initial seed time: Saturday, October 10, 2026 09:00:00 GMT+0200 (CAT - Central Africa Time / Gaborone)
const INITIAL_DEMO_TIME = new Date('2026-10-10T09:00:00+02:00').getTime()

let currentDemoOffsetMs = 0

export function getDemoNow(): Date {
  return new Date(INITIAL_DEMO_TIME + currentDemoOffsetMs)
}

export function getDemoNowISO(): string {
  return getDemoNow().toISOString()
}

export function advanceDemoTimeHours(hours: number): Date {
  currentDemoOffsetMs += hours * 60 * 60 * 1000
  return getDemoNow()
}

export function resetDemoClock(): void {
  currentDemoOffsetMs = 0
}

export function getDaysLeft(targetDateStr: string): number {
  const target = new Date(targetDateStr).getTime()
  const now = getDemoNow().getTime()
  const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return diffDays
}
