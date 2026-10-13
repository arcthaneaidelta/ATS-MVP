import { differenceInCalendarDays, parseISO } from 'date-fns';
import type { Cycle, Transaction } from '@/data/types';

/**
 * Recurring payment detection (pure, deterministic, unit-tested).
 *
 * Group by normalised merchant, then a group is recurring when it has ≥ 2 charges whose gaps
 * all sit in a monthly (26–35 days) or yearly (350–380 days) window and whose amounts stay
 * within 15% of the median (so a price rise still matches, a different grocery shop does not).
 */

export interface RecurringGroup {
  key: string;
  merchant: string;
  cycle: Cycle;
  charges: Transaction[];
  subscriptionId?: string;
}

const MONTHLY: [number, number] = [26, 35];
const YEARLY: [number, number] = [350, 380];
const AMOUNT_TOLERANCE = 0.15;

export const normaliseMerchant = (m: string) =>
  m
    .toLowerCase()
    .replace(/[^a-z0-9+ ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

/** Returns the cycle if these charges form a recurring pattern, else null. */
export function classify(charges: Transaction[]): Cycle | null {
  if (charges.length < 2) return null;
  const sorted = [...charges].sort((a, b) => a.date.localeCompare(b.date));
  const gaps = sorted.slice(1).map((c, i) => differenceInCalendarDays(parseISO(c.date), parseISO(sorted[i].date)));
  const within = ([lo, hi]: [number, number]) => gaps.every((g) => g >= lo && g <= hi);
  const cycle: Cycle | null = within(MONTHLY) ? 'monthly' : within(YEARLY) ? 'yearly' : null;
  if (!cycle) return null;
  const med = median(sorted.map((c) => c.amount));
  const stable = sorted.every((c) => Math.abs(c.amount - med) / med <= AMOUNT_TOLERANCE);
  return stable ? cycle : null;
}

export function groupByMerchant(txs: Transaction[]): Map<string, Transaction[]> {
  const map = new Map<string, Transaction[]>();
  for (const t of txs) {
    const key = normaliseMerchant(t.merchant);
    const list = map.get(key);
    if (list) list.push(t);
    else map.set(key, [t]);
  }
  return map;
}

export function detectRecurring(txs: Transaction[]): RecurringGroup[] {
  const groups: RecurringGroup[] = [];
  for (const [key, charges] of groupByMerchant(txs)) {
    const cycle = classify(charges);
    if (cycle) {
      groups.push({
        key,
        merchant: charges[0].merchant,
        cycle,
        charges,
        subscriptionId: charges.find((c) => c.subscriptionId)?.subscriptionId,
      });
    }
  }
  return groups;
}

/**
 * For the Connect animation: replay the stream in order and return, for each row index,
 * whether that row is the moment a recurring pattern is first confirmed.
 */
export function confirmationIndices(stream: Transaction[]): Map<number, string> {
  const seen = new Map<string, Transaction[]>();
  const confirmed = new Set<string>();
  const out = new Map<number, string>();
  stream.forEach((t, i) => {
    const key = normaliseMerchant(t.merchant);
    const list = [...(seen.get(key) ?? []), t];
    seen.set(key, list);
    if (!confirmed.has(key) && classify(list)) {
      confirmed.add(key);
      out.set(i, key);
    }
  });
  return out;
}
