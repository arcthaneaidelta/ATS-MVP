import type { Transaction } from './types';

/** Total payments "read" during detection. The stream below is a 41-row sample of these. */
export const TRANSACTIONS_READ = 412;

let n = 0;
const t = (date: string, merchant: string, pounds: number, subscriptionId?: string): Transaction => ({
  id: `tx-${++n}`,
  date,
  merchant,
  amount: Math.round(pounds * 100),
  subscriptionId,
});

/**
 * Detection stream shown on Connect, newest first (as a bank statement reads).
 * 20 recurring rows (two per subscription) mixed with 21 everyday one-offs from fictional
 * high-street names. Some one-offs repeat (Greenleaf Grocers, Metro Fuel, Corner Bakery) at
 * irregular intervals or amounts, so the detector has to reject them — see tests/detection.test.ts.
 */
export const seedTransactions: Transaction[] = [
  t('2026-10-12', 'Greenleaf Grocers', 34.18),
  t('2026-10-11', 'Metro Fuel', 52.4),
  t('2026-10-09', 'Dropbox Plus', 9.99, 'dropbox'),
  t('2026-10-08', 'Corner Bakery', 4.35),
  t('2026-10-06', 'Adobe Photography', 9.98, 'adobe'),
  t('2026-10-05', 'Northline Rail', 23.7),
  t('2026-10-03', 'Greenleaf Grocers', 61.02),
  t('2026-10-02', 'Spotify Premium', 11.99, 'spotify'),
  t('2026-10-01', 'Bluebell Café', 7.8),
  t('2026-09-28', 'Now Entertainment', 9.99, 'now'),
  t('2026-09-27', 'Riverside Pharmacy', 12.45),
  t('2026-09-24', 'Netflix Standard', 12.99, 'netflix'),
  t('2026-09-23', 'City Parking', 6.0),
  t('2026-09-22', 'Corner Bakery', 3.95),
  t('2026-09-21', 'PureGym', 24.99, 'puregym'),
  t('2026-09-19', 'Disney+', 7.99, 'disney'),
  t('2026-09-18', 'Oakwood Books', 15.99),
  t('2026-09-16', 'iCloud+ 200 GB', 2.49, 'icloud'),
  t('2026-09-09', 'Dropbox Plus', 9.99, 'dropbox'),
  t('2026-09-07', "Hartley's Hardware", 27.35),
  t('2026-09-06', 'Adobe Photography', 9.98, 'adobe'),
  t('2026-09-03', 'Metro Fuel', 48.1),
  t('2026-09-02', 'Spotify Premium', 11.99, 'spotify'),
  t('2026-08-30', 'Harbour Fish Bar', 18.6),
  t('2026-08-28', 'Now Entertainment', 9.99, 'now'),
  t('2026-08-26', 'Maple Laundry', 8.5),
  t('2026-08-24', 'Netflix Standard', 12.99, 'netflix'),
  t('2026-08-22', 'Greenleaf Grocers', 42.77),
  t('2026-08-21', 'PureGym', 21.99, 'puregym'),
  t('2026-08-19', 'Disney+', 7.99, 'disney'),
  t('2026-08-17', 'Sunrise Florist', 22.0),
  t('2026-08-16', 'iCloud+ 200 GB', 2.49, 'icloud'),
  t('2026-07-29', 'Northline Rail', 31.2),
  t('2026-06-12', 'Bluebell Café', 9.4),
  t('2026-03-03', 'Headspace', 49.99, 'headspace'),
  t('2026-01-15', 'Riverside Pharmacy', 6.8),
  t('2025-11-18', 'Amazon Prime', 95.0, 'amazon'),
  t('2025-08-09', 'Oakwood Books', 11.49),
  t('2025-03-03', 'Headspace', 49.99, 'headspace'),
  t('2025-01-20', 'Metro Fuel', 45.6),
  t('2024-11-18', 'Amazon Prime', 95.0, 'amazon'),
];
