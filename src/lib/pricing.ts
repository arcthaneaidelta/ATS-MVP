import type { Vehicle, InsurancePackage, RateBracket, PriceQuoteBreakdown } from '../types';
import { getDaysCount } from './dates';

/**
 * Pure Pricing Calculation Engine
 * Deterministic pricing logic based on tiered duration brackets and selected cover.
 */

export function calculateDays(from: string | Date, to: string | Date): number {
  return getDaysCount(from, to);
}

export function getBracket(vehicle: Vehicle, days: number): RateBracket {
  const d = Math.max(1, days);
  const found = vehicle.brackets.find(b => d >= b.from && (b.to === null || d <= b.to));
  if (found) return found;

  // Fallback to the closest bracket or the last bracket
  if (vehicle.brackets.length > 0) {
    return vehicle.brackets[vehicle.brackets.length - 1];
  }

  // Safety fallback
  return { from: 1, to: 2, dailyRate: 1650 };
}

export function getStandardBracket(vehicle: Vehicle): RateBracket {
  const standard = vehicle.brackets.find(b => b.from === 1) || vehicle.brackets[0];
  return standard || { from: 1, to: 2, dailyRate: 1650 };
}

export function quotePrice(
  vehicle: Vehicle,
  cover: InsurancePackage | null,
  from: string | Date,
  to: string | Date
): PriceQuoteBreakdown {
  const days = calculateDays(from, to);
  const bracket = getBracket(vehicle, days);
  const standardBracket = getStandardBracket(vehicle);

  const dailyRate = bracket.dailyRate;
  const rentalTotal = days * dailyRate;

  const coverDailyPrice = cover ? cover.dailyPrice : 0;
  const coverTotal = days * coverDailyPrice;

  const totalDueNow = rentalTotal + coverTotal;

  // Standard rate comparison to calculate transparent customer savings
  const standardDailyRate = standardBracket.dailyRate;
  const standardTotal = days * standardDailyRate;
  const savingsTotal = Math.max(0, standardTotal - rentalTotal);

  // Booking deposit calculation for quotations (typically 20% of rental)
  const bookingDeposit = Math.round((rentalTotal * 0.20) / 50) * 50;

  // Security deposit is held separately on card at pickup
  const refundableSecurityDeposit = vehicle.securityDeposit;

  return {
    days,
    bracket,
    dailyRate,
    rentalTotal,
    coverDailyPrice,
    coverTotal,
    totalDueNow,
    refundableSecurityDeposit,
    bookingDeposit,
    standardDailyRate,
    savingsTotal,
  };
}
