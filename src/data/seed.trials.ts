import type { Cycle, Trial } from './types';

export const seedTrials: Trial[] = [
  {
    id: 'trial-calm',
    name: 'Calm',
    endsOn: '2026-10-20',
    priceAfter: 3999,
    cycleAfter: 'yearly',
    remindDays: 2,
    protect: true,
    status: 'active',
    createdAt: '2026-10-06T19:12:00',
  },
  {
    id: 'trial-audible',
    name: 'Audible Premium Plus',
    endsOn: '2026-10-29',
    priceAfter: 799,
    cycleAfter: 'monthly',
    remindDays: 2,
    protect: true,
    status: 'active',
    createdAt: '2026-09-29T08:40:00',
  },
];

/** Autocomplete suggestions for the Add trial sheet. Prices are editable starting points. */
export const trialSuggestions: { name: string; priceAfter: number; cycleAfter: Cycle }[] = [
  { name: 'Apple TV+', priceAfter: 899, cycleAfter: 'monthly' },
  { name: 'YouTube Premium', priceAfter: 1299, cycleAfter: 'monthly' },
  { name: 'Kindle Unlimited', priceAfter: 949, cycleAfter: 'monthly' },
  { name: 'Duolingo Super', priceAfter: 7999, cycleAfter: 'yearly' },
  { name: 'Strava', priceAfter: 5499, cycleAfter: 'yearly' },
  { name: 'Paramount+', priceAfter: 699, cycleAfter: 'monthly' },
  { name: 'Calm', priceAfter: 3999, cycleAfter: 'yearly' },
  { name: 'Audible Premium Plus', priceAfter: 799, cycleAfter: 'monthly' },
];
