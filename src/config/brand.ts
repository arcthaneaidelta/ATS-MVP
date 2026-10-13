/**
 * Brand + locale config. Placeholder branding — swap name/tagline here and colours in
 * src/styles/tokens.css to drop in the client's real identity.
 */
export const brand = {
  name: 'Save Me',
  tagline: 'Light is lovely.',
  user: { name: 'Amira', initial: 'A' },
  /** One value switches currency formatting across the product. */
  locale: 'en-GB',
  currency: 'GBP',
  /** The demo's fixed "today": Tuesday 13 Oct 2026, 09:00. Every date derives from this. */
  demoToday: '2026-10-13T09:00:00',
  /** Reminder delivery time used for trial notifications. */
  reminderHour: 9,
} as const;
