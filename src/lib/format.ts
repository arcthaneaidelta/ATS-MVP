import { format, parseISO } from 'date-fns';

/**
 * Formats a number into Namibian Dollar format: N$1,650
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'N$0';
  return `N$${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Formats date into DD MMM YYYY format (e.g., 18 Nov 2026) per en-NA locale specification
 */
export function formatDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMM yyyy');
  } catch {
    return String(date);
  }
}

/**
 * Short date (e.g. 18 Nov)
 */
export function formatShortDate(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMM');
  } catch {
    return String(date);
  }
}

/**
 * Format date range nicely: "18 Nov – 25 Nov 2026"
 */
export function formatDateRange(from: string | Date, to: string | Date): string {
  try {
    const dFrom = typeof from === 'string' ? parseISO(from) : from;
    const dTo = typeof to === 'string' ? parseISO(to) : to;
    if (dFrom.getFullYear() === dTo.getFullYear()) {
      return `${format(dFrom, 'dd MMM')} – ${format(dTo, 'dd MMM yyyy')}`;
    }
    return `${format(dFrom, 'dd MMM yyyy')} – ${format(dTo, 'dd MMM yyyy')}`;
  } catch {
    return `${formatDate(from)} – ${formatDate(to)}`;
  }
}
