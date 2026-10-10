import { BRAND } from '../config/brand';

const DEMO_NOW = new Date(BRAND.demoDate).getTime();

export function formatMoney(
  amount: number | undefined | null,
  currency: 'USD' | 'PEN' | 'ZMW' = 'USD',
  showDecimals = false
): string {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency} 0`;
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
  return `${currency} ${formatted}`;
}

export function formatNumber(val: number | undefined | null): string {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
}

export function formatPercent(val: number | undefined | null, decimals = 1): string {
  if (val === undefined || val === null || isNaN(val)) return '0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function getPriceFreshness(dateStr: string): {
  color: 'green' | 'amber' | 'grey';
  ageMonths: number;
  label: string;
} {
  if (!dateStr) return { color: 'grey', ageMonths: 99, label: 'No quote date' };
  const d = new Date(dateStr).getTime();
  const diffDays = Math.max(0, Math.round((DEMO_NOW - d) / (1000 * 60 * 60 * 24)));
  const ageMonths = Math.round(diffDays / 30);

  if (ageMonths < 3) {
    return {
      color: 'green',
      ageMonths,
      label: ageMonths === 0 ? 'Quoted this month' : `Quoted ${ageMonths} mo ago (Fresh)`,
    };
  }
  if (ageMonths <= 12) {
    return {
      color: 'amber',
      ageMonths,
      label: `Quoted ${ageMonths} mo ago (Moderate)`,
    };
  }
  return {
    color: 'grey',
    ageMonths,
    label: `Quoted ${ageMonths} mo ago (Historical >1yr)`,
  };
}

export function getRelativeTime(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr).getTime();
  const diffDays = Math.round((DEMO_NOW - d) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 30) return `${diffDays} days ago`;
  if (diffDays >= 30 && diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
  // Future dates (e.g. expiration)
  const futureDays = -diffDays;
  if (futureDays === 1) return 'Tomorrow';
  return `in ${futureDays} days`;
}
