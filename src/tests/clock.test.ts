import { describe, expect, it } from 'vitest';
import { VirtualClock } from '@/store/virtualClock';
import { fmtDayYear, daysBetween, reminderAt } from '@/lib/dates';

describe('virtual clock and reminder scheduling', () => {
  it('initialises to the demo fixed date 13 Oct 2026', () => {
    const clock = new VirtualClock('2026-10-13T09:00:00');
    expect(fmtDayYear(clock.now)).toBe('13 Oct 2026');
  });

  it('advances time by arbitrary days', () => {
    const clock = new VirtualClock('2026-10-13T09:00:00');
    clock.advanceDays(5);
    expect(fmtDayYear(clock.now)).toBe('18 Oct 2026');
  });

  it('calculates reminder trigger date 2 days before trial end respecting quiet hours', () => {
    const trial = {
      endsOn: '2026-10-20',
      remindDays: 2 as const,
    };
    const prefs = {
      quietStart: '22:00',
      quietEnd: '08:00',
    };
    const trigger = reminderAt(trial, prefs);
    // Trial ends Oct 20, 2 days before is Oct 18, delivery at 9:00 AM (outside 22:00-08:00 quiet)
    expect(fmtDayYear(trigger)).toBe('18 Oct 2026');
    expect(trigger.getHours()).toBe(9);
    expect(trigger.getMinutes()).toBe(0);
  });

  it('shifts delivery time if default 9:00 AM falls in quiet hours', () => {
    const trial = {
      endsOn: '2026-10-20',
      remindDays: 2 as const,
    };
    const prefs = {
      quietStart: '08:00',
      quietEnd: '10:00', // 9:00 AM is inside quiet hours
    };
    const trigger = reminderAt(trial, prefs);
    expect(trigger.getHours()).toBe(10);
    expect(trigger.getMinutes()).toBe(0);
  });
});
