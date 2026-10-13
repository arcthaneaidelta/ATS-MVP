import { addDays, parseISO } from 'date-fns';
import { brand } from '@/config/brand';

/**
 * Pure virtual clock state container.
 * Initialised to the fixed demo date: Tuesday 13 Oct 2026, 09:00.
 */
export class VirtualClock {
  private currentTime: Date;

  constructor(initialIso: string = brand.demoToday) {
    this.currentTime = parseISO(initialIso);
  }

  get now(): Date {
    return new Date(this.currentTime.getTime());
  }

  advanceDays(days: number): Date {
    this.currentTime = addDays(this.currentTime, days);
    return this.now;
  }

  reset(initialIso: string = brand.demoToday): void {
    this.currentTime = parseISO(initialIso);
  }
}

export const virtualClock = new VirtualClock();
