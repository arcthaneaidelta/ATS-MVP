import { 
  addDays, 
  differenceInCalendarDays, 
  format, 
  parseISO, 
  isBefore, 
  isAfter, 
  startOfDay,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';

export {
  addDays,
  differenceInCalendarDays,
  format,
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
  eachDayOfInterval,
  isSameDay
};

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function getDaysCount(from: string | Date, to: string | Date): number {
  const d1 = typeof from === 'string' ? parseISO(from) : from;
  const d2 = typeof to === 'string' ? parseISO(to) : to;
  const diff = differenceInCalendarDays(d2, d1);
  return Math.max(1, diff);
}
