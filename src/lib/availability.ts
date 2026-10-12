import type { Booking, VehicleBlock, Vehicle } from '../types';
import { parseISO, addDays, format, isBefore, isAfter, max } from 'date-fns';

/**
 * Pure Availability & Conflict Engine
 * Checks interval overlaps with confirmed bookings and blocks.
 * Note: Same-day turnover (drop-off day = next pick-up day) is allowed.
 * Note: Quotations do NOT hold or block vehicles.
 */

export interface ConflictItem {
  type: 'booking' | 'block';
  referenceOrTitle: string;
  startDate: string;
  endDate: string;
  customerName?: string;
}

export function intervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  // startA < endB && endA > startB
  // String comparison on ISO format 'YYYY-MM-DD' works perfectly lexicographically
  return startA < endB && endA > startB;
}

export function findConflicts(
  vehicleId: string,
  from: string,
  to: string,
  bookings: Booking[],
  blocks: VehicleBlock[],
  excludeBookingId?: string
): ConflictItem[] {
  const conflicts: ConflictItem[] = [];

  // Check confirmed bookings
  for (const b of bookings) {
    if (b.id === excludeBookingId) continue;
    if (b.vehicleId === vehicleId && b.status === 'confirmed') {
      if (intervalsOverlap(from, to, b.startDate, b.endDate)) {
        conflicts.push({
          type: 'booking',
          referenceOrTitle: b.reference,
          startDate: b.startDate,
          endDate: b.endDate,
          customerName: b.customerName
        });
      }
    }
  }

  // Check vehicle blocks (maintenance, admin blocks, offline reservations)
  for (const block of blocks) {
    if (block.vehicleId === vehicleId) {
      if (intervalsOverlap(from, to, block.startDate, block.endDate)) {
        conflicts.push({
          type: 'block',
          referenceOrTitle: block.title,
          startDate: block.startDate,
          endDate: block.endDate,
          customerName: block.customerName
        });
      }
    }
  }

  return conflicts;
}

export function isAvailable(
  vehicleId: string,
  from: string,
  to: string,
  bookings: Booking[],
  blocks: VehicleBlock[],
  excludeBookingId?: string
): boolean {
  if (!from || !to) return true;
  const conflicts = findConflicts(vehicleId, from, to, bookings, blocks, excludeBookingId);
  return conflicts.length === 0;
}

/**
 * Finds the next available date if a vehicle is unavailable for a requested period.
 */
export function nextAvailable(
  vehicleId: string,
  from: string,
  bookings: Booking[],
  blocks: VehicleBlock[]
): string {
  // Look at all conflicts that overlap with or extend past 'from'
  const relevantEndDates: string[] = [];

  for (const b of bookings) {
    if (b.vehicleId === vehicleId && b.status === 'confirmed') {
      if (b.endDate >= from) {
        relevantEndDates.push(b.endDate);
      }
    }
  }

  for (const bl of blocks) {
    if (bl.vehicleId === vehicleId) {
      if (bl.endDate >= from) {
        relevantEndDates.push(bl.endDate);
      }
    }
  }

  if (relevantEndDates.length === 0) return from;

  // Sort end dates ascending
  relevantEndDates.sort();
  // The latest immediate conflict end date gives the next free slot
  const latestEnd = relevantEndDates[relevantEndDates.length - 1];
  return latestEnd;
}
