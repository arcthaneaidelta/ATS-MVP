import { brand } from '@/config/brand';
import type { Cycle, Subscription } from '@/data/types';

/** Integer pence → formatted currency. */
const fmt2 = new Intl.NumberFormat(brand.locale, {
  style: 'currency',
  currency: brand.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const fmt0 = new Intl.NumberFormat(brand.locale, {
  style: 'currency',
  currency: brand.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Round half away from zero at the penny, so 10249.25 → 10249 and 0.5 → 1. */
export const roundPence = (pence: number) => Math.sign(pence) * Math.round(Math.abs(pence));

/**
 * Format pence as money. `trimWhole` drops ".00" for whole amounts (e.g. "£95"),
 * used only in sentences, never in figures or columns.
 */
export function formatMoney(pence: number, opts: { trimWhole?: boolean } = {}): string {
  const p = roundPence(pence);
  if (opts.trimWhole && p % 100 === 0) return fmt0.format(p / 100);
  return fmt2.format(p / 100);
}

export const cycleShort = (c: Cycle) => (c === 'monthly' ? '/mo' : '/yr');
export const cycleLong = (c: Cycle) => (c === 'monthly' ? 'a month' : 'a year');

/** Annual cost of one subscription in pence (exact, integer). */
export const annualPence = (s: Pick<Subscription, 'amount' | 'cycle'>) =>
  s.cycle === 'monthly' ? s.amount * 12 : s.amount;

/** Monthly equivalent in pence (unrounded; may be fractional for yearly plans). */
export const monthlyPence = (s: Pick<Subscription, 'amount' | 'cycle'>) =>
  s.cycle === 'monthly' ? s.amount : s.amount / 12;

export type Horizon = 'month' | 'year' | 'five' | 'ten';

export const HORIZONS: { id: Horizon; label: string; unit: string; years: number }[] = [
  { id: 'month', label: 'Month', unit: 'a month', years: 1 / 12 },
  { id: 'year', label: 'Year', unit: 'a year', years: 1 },
  { id: 'five', label: '5 yrs', unit: 'over 5 years', years: 5 },
  { id: 'ten', label: '10 yrs', unit: 'over 10 years', years: 10 },
];

export interface Totals {
  /** exact integer pence */
  annual: number;
  /** unrounded; display with formatMoney (rounds at the penny) */
  monthly: number;
  five: number;
  ten: number;
}

/**
 * Totals are always computed from the annual integer sum, so every horizon is consistent:
 * seed data → £102.49 / £1,229.91 / £6,149.55 / £12,299.10.
 */
export function computeTotals(subs: Pick<Subscription, 'amount' | 'cycle'>[]): Totals {
  const annual = subs.reduce((sum, s) => sum + annualPence(s), 0);
  return { annual, monthly: annual / 12, five: annual * 5, ten: annual * 10 };
}

export function totalForHorizon(t: Totals, h: Horizon): number {
  switch (h) {
    case 'month':
      return t.monthly;
    case 'year':
      return t.annual;
    case 'five':
      return t.five;
    case 'ten':
      return t.ten;
  }
}

/** Parse a user-typed amount ("39.99", "£39.99", "39,99") into pence, or null if invalid. */
export function parseMoneyInput(raw: string): number | null {
  const cleaned = raw.replace(/[£\s]/g, '').replace(',', '.');
  if (cleaned === '') return null;
  if (!/^\d{1,5}(\.\d{0,2})?$/.test(cleaned)) return null;
  return Math.round(parseFloat(cleaned) * 100);
}
