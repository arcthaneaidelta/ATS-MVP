import { describe, expect, it } from 'vitest';
import {
  annualPence,
  computeTotals,
  formatMoney,
  monthlyPence,
  parseMoneyInput,
  roundPence,
  totalForHorizon,
} from '@/lib/money';
import { seedSubscriptions } from '@/data/seed.subscriptions';

describe('money calculations and formatting', () => {
  it('correctly rounds pence to nearest integer', () => {
    expect(roundPence(10249.25)).toBe(10249);
    expect(roundPence(10249.75)).toBe(10250);
    expect(roundPence(-50.5)).toBe(-51);
  });

  it('formats pence to GBP with two decimal places', () => {
    expect(formatMoney(10249)).toBe('£102.49');
    expect(formatMoney(122991)).toBe('£1,229.91');
    expect(formatMoney(0)).toBe('£0.00');
  });

  it('trims whole pound amounts when requested', () => {
    expect(formatMoney(9500, { trimWhole: true })).toBe('£95');
    expect(formatMoney(9550, { trimWhole: true })).toBe('£95.50');
  });

  it('computes exact totals for the 10 seed subscriptions matching PRD specification', () => {
    const totals = computeTotals(seedSubscriptions);

    // PRD totals specification:
    // Monthly: £102.49
    // Annual: £1,229.91
    // 5 years: £6,149.55
    // 10 years: £12,299.10
    expect(formatMoney(totalForHorizon(totals, 'month'))).toBe('£102.49');
    expect(formatMoney(totalForHorizon(totals, 'year'))).toBe('£1,229.91');
    expect(formatMoney(totalForHorizon(totals, 'five'))).toBe('£6,149.55');
    expect(formatMoney(totalForHorizon(totals, 'ten'))).toBe('£12,299.10');
  });

  it('correctly calculates annual and monthly equivalents for individual subscriptions', () => {
    const monthlySub = { amount: 2499, cycle: 'monthly' as const };
    expect(annualPence(monthlySub)).toBe(29988);
    expect(monthlyPence(monthlySub)).toBe(2499);

    const yearlySub = { amount: 9500, cycle: 'yearly' as const };
    expect(annualPence(yearlySub)).toBe(9500);
    expect(monthlyPence(yearlySub)).toBeCloseTo(791.666, 2);
  });

  it('parses user money input string into integer pence', () => {
    expect(parseMoneyInput('39.99')).toBe(3999);
    expect(parseMoneyInput('£39.99')).toBe(3999);
    expect(parseMoneyInput('120')).toBe(12000);
    expect(parseMoneyInput('0.99')).toBe(99);
    expect(parseMoneyInput('invalid')).toBeNull();
    expect(parseMoneyInput('')).toBeNull();
  });
});
