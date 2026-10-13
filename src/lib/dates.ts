import {
  addDays,
  addMonths,
  addYears,
  differenceInCalendarDays,
  format,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
  subDays,
} from 'date-fns';
import { brand } from '@/config/brand';
import type { Cycle, ReminderPrefs, Trial } from '@/data/types';

export const toDate = (iso: string) => parseISO(iso);
export const isoDate = (d: Date) => format(d, 'yyyy-MM-dd');
export const isoDateTime = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm:ss");

/** "13 Oct" */
export const fmtDay = (d: Date | string) => format(typeof d === 'string' ? toDate(d) : d, 'd MMM');
/** "13 Oct 2026" */
export const fmtDayYear = (d: Date | string) => format(typeof d === 'string' ? toDate(d) : d, 'd MMM yyyy');
/** "Mar 2023" */
export const fmtMonthYear = (isoMonth: string) => format(toDate(`${isoMonth}-01`), 'MMM yyyy');
/** "September" */
export const fmtMonthName = (d: Date | string) => format(typeof d === 'string' ? toDate(d) : d, 'MMMM');
/** "Sunday 18 October" */
export const fmtLongDay = (d: Date) => format(d, 'EEEE d MMMM');
/** "9:00" */
export const fmtClock = (d: Date) => format(d, 'H:mm');

export const daysBetween = (from: Date, to: Date) => differenceInCalendarDays(to, from);

/** Roll a charge date forward by whole cycles until it is today or later. */
export function nextChargeOn(nextCharge: string, cycle: Cycle, now: Date): Date {
  let d = toDate(nextCharge);
  const today = startOfDay(now);
  let guard = 0;
  while (d < today && guard++ < 600) d = cycle === 'monthly' ? addMonths(d, 1) : addYears(d, 1);
  return d;
}

const hm = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + (m || 0);
};

/** Is a time-of-day (minutes) inside a quiet window that may wrap midnight? */
export function inQuietHours(minutes: number, start: string, end: string): boolean {
  const s = hm(start);
  const e = hm(end);
  if (s === e) return false;
  return s < e ? minutes >= s && minutes < e : minutes >= s || minutes < e;
}

/** Delivery time-of-day for reminders: 9:00 unless that falls in quiet hours, then quiet end. */
export function deliveryTime(prefs: Pick<ReminderPrefs, 'quietStart' | 'quietEnd'>): { h: number; m: number } {
  const base = brand.reminderHour * 60;
  if (!inQuietHours(base, prefs.quietStart, prefs.quietEnd)) return { h: brand.reminderHour, m: 0 };
  const e = hm(prefs.quietEnd);
  return { h: Math.floor(e / 60), m: e % 60 };
}

/** When the reminder for a trial fires (virtual-clock time). */
export function reminderAt(trial: Pick<Trial, 'endsOn' | 'remindDays'>, prefs: Pick<ReminderPrefs, 'quietStart' | 'quietEnd'>): Date {
  const { h, m } = deliveryTime(prefs);
  return setMinutes(setHours(subDays(toDate(trial.endsOn), trial.remindDays), h), m);
}

export { addDays, startOfDay };
