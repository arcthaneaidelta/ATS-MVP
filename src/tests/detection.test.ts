import { describe, expect, it } from 'vitest';
import {
  classify,
  confirmationIndices,
  detectRecurring,
  normaliseMerchant,
} from '@/lib/detection';
import { seedTransactions } from '@/data/seed.transactions';

describe('recurring detection engine', () => {
  it('normalises merchant names by removing punctuation and extra whitespace', () => {
    expect(normaliseMerchant(' Disney+  ')).toBe('disney+');
    expect(normaliseMerchant("Hartley's Hardware")).toBe('hartleys hardware');
    expect(normaliseMerchant('iCloud+ 200 GB')).toBe('icloud+ 200 gb');
  });

  it('classifies monthly recurrence with 26-35 day intervals and stable amounts', () => {
    const monthlyTxs = [
      { id: '1', date: '2026-08-24', merchant: 'Netflix', amount: 1299 },
      { id: '2', date: '2026-09-24', merchant: 'Netflix', amount: 1299 },
      { id: '3', date: '2026-10-24', merchant: 'Netflix', amount: 1299 },
    ];
    expect(classify(monthlyTxs)).toBe('monthly');
  });

  it('rejects irregular everyday purchases (e.g., groceries or fuel)', () => {
    const irregularTxs = [
      { id: '1', date: '2026-10-03', merchant: 'Greenleaf Grocers', amount: 6102 },
      { id: '2', date: '2026-10-12', merchant: 'Greenleaf Grocers', amount: 3418 },
    ];
    // 9 days gap is outside monthly (26-35) & yearly (350-380)
    expect(classify(irregularTxs)).toBeNull();
  });

  it('detects all 10 recurring subscriptions from the seed transaction stream', () => {
    const detected = detectRecurring(seedTransactions);
    expect(detected.length).toBe(10);

    const detectedSubIds = detected
      .map((g) => g.subscriptionId)
      .filter(Boolean)
      .sort();

    const expectedSubIds = [
      'adobe',
      'amazon',
      'disney',
      'dropbox',
      'headspace',
      'icloud',
      'netflix',
      'now',
      'puregym',
      'spotify',
    ].sort();

    expect(detectedSubIds).toEqual(expectedSubIds);
  });

  it('identifies exact stream indices where recurring patterns are confirmed', () => {
    const confirmations = confirmationIndices(seedTransactions);
    expect(confirmations.size).toBe(10);
  });
});
