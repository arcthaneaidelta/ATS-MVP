/**
 * Unit tests for the pure pricing & availability engines (PRD §23.3, build step 6).
 * Run with:  npm run test
 * Uses Node's built-in test runner — no extra dependencies.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateDays, getBracket, quotePrice } from './pricing.ts';
import { intervalsOverlap, isAvailable, findConflicts } from './availability.ts';
import type { Vehicle, Booking, VehicleBlock, InsurancePackage } from '../types/index.ts';

const hilux: Vehicle = {
  id: 'hilux-dc', name: 'Hilux', type: '4x4', category: '4x4', seats: 5,
  transmission: 'Manual', fuel: 'Diesel', luggage: '4', features: [], description: '',
  images: [], securityDeposit: 12000, active: true,
  brackets: [
    { from: 1, to: 2, dailyRate: 1650 },
    { from: 3, to: 7, dailyRate: 1450 },
    { from: 8, to: 20, dailyRate: 1290 },
    { from: 21, to: null, dailyRate: 1120 },
  ],
};

const reduced: InsurancePackage = {
  id: 'reduced', name: 'Reduced', dailyPrice: 180, excess: 8000,
  description: '', inclusions: [], exclusions: [], active: true,
};

test('bracket edges: days 1,2,3,7,8,20,21,30', () => {
  const expected: Record<number, number> = { 1: 1650, 2: 1650, 3: 1450, 7: 1450, 8: 1290, 20: 1290, 21: 1120, 30: 1120 };
  for (const [days, rate] of Object.entries(expected)) {
    assert.equal(getBracket(hilux, Number(days)).dailyRate, rate, `day ${days}`);
  }
});

test('calculateDays: minimum of 1 day, calendar-day diff', () => {
  assert.equal(calculateDays('2026-11-01', '2026-11-01'), 1);
  assert.equal(calculateDays('2026-11-01', '2026-11-09'), 8);
});

test('quotePrice: rental + cover, savings, separate security deposit', () => {
  const q = quotePrice(hilux, reduced, '2026-11-01', '2026-11-11'); // 10 days
  assert.equal(q.days, 10);
  assert.equal(q.dailyRate, 1290);
  assert.equal(q.rentalTotal, 12900);
  assert.equal(q.coverTotal, 1800);
  assert.equal(q.totalDueNow, 14700);
  assert.equal(q.savingsTotal, (1650 - 1290) * 10);
  assert.equal(q.refundableSecurityDeposit, 12000); // never part of totalDueNow
});

test('overlap: back-to-back same-day handover is allowed', () => {
  assert.equal(intervalsOverlap('2026-11-01', '2026-11-05', '2026-11-05', '2026-11-09'), false);
  assert.equal(intervalsOverlap('2026-11-05', '2026-11-09', '2026-11-01', '2026-11-05'), false);
});

test('overlap: partial and containing ranges conflict', () => {
  assert.equal(intervalsOverlap('2026-11-01', '2026-11-06', '2026-11-05', '2026-11-09'), true);
  assert.equal(intervalsOverlap('2026-11-02', '2026-11-03', '2026-11-01', '2026-11-09'), true);
});

const booking = (over: Partial<Booking>): Booking => ({
  id: 'b1', reference: 'FSR-1', vehicleId: 'hilux-dc', startDate: '2026-11-05', endDate: '2026-11-10',
  customerName: 'T', customerEmail: '', customerPhone: '', customerCountry: '', driverLicence: '',
  licenceCountry: '', pickupLocation: '', coverId: 'standard', rentalTotal: 0, coverTotal: 0,
  totalAmount: 0, securityDeposit: 0, depositStatus: 'not_held', status: 'confirmed',
  paymentStatus: 'paid_in_full', source: 'online', createdAt: '2026-10-01', ...over,
});

test('availability: only confirmed bookings + blocks reserve; unpaid attempts do not', () => {
  const bookings = [booking({}), booking({ id: 'b2', startDate: '2026-11-20', endDate: '2026-11-25', status: 'pending', paymentStatus: 'unpaid_attempt' })];
  const blocks: VehicleBlock[] = [{ id: 'k1', vehicleId: 'hilux-dc', startDate: '2026-12-01', endDate: '2026-12-04', reason: 'maintenance', title: 'Service' }];
  assert.equal(isAvailable('hilux-dc', '2026-11-07', '2026-11-08', bookings, blocks), false);
  assert.equal(isAvailable('hilux-dc', '2026-11-21', '2026-11-23', bookings, blocks), true); // pending attempt ignored
  assert.equal(isAvailable('hilux-dc', '2026-12-02', '2026-12-03', bookings, blocks), false); // block
  assert.equal(isAvailable('hilux-dc', '2026-11-10', '2026-11-12', bookings, blocks), true); // handover day
  assert.equal(isAvailable('fortuner', '2026-11-07', '2026-11-08', bookings, blocks), true); // other vehicle
  assert.equal(findConflicts('hilux-dc', '2026-11-01', '2026-12-31', bookings, blocks).length, 2);
});
