/** Typed domain models shared by data, API, store and UI. Amounts are always integer pence. */

export type Cycle = 'monthly' | 'yearly';

export type Category =
  | 'Storage'
  | 'Streaming'
  | 'Fitness'
  | 'Music'
  | 'Software'
  | 'Shopping'
  | 'Wellbeing';

export interface Charge {
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** pence */
  amount: number;
}

/** Attention signals are derived only from transaction patterns. The app never claims to know usage. */
export type Flag =
  | { kind: 'price-rise'; from: number; to: number; on: string }
  | { kind: 'overlap-category'; category: Category }
  | { kind: 'overlap-with'; withId: string; label: string }
  | { kind: 'annual-renewal'; windowDays: number };

export type SubscriptionStatus = 'active' | 'kept' | 'snoozed' | 'cancelled';

export interface Subscription {
  id: string;
  name: string;
  category: Category;
  /** pence per cycle */
  amount: number;
  cycle: Cycle;
  /** ISO date of the next known charge at seed time; rolled forward by the virtual clock. */
  nextCharge: string;
  /** ISO month, YYYY-MM */
  firstSeen: string;
  paymentMethod: string;
  /** Most recent first. */
  history: Charge[];
  flag?: Flag;
  /** Rank when promoted to Today's "Worth a look". Undefined = list/detail only. */
  promoteRank?: number;
  status: SubscriptionStatus;
  snoozedUntil?: string;
  statusChangedAt?: string;
}

export type ReminderDays = 0 | 1 | 2;

export type TrialStatus = 'active' | 'kept' | 'cancelled';

export interface Trial {
  id: string;
  name: string;
  /** ISO date the free trial ends. */
  endsOn: string;
  /** pence, null if unknown */
  priceAfter: number | null;
  cycleAfter: Cycle;
  remindDays: ReminderDays;
  protect: boolean;
  status: TrialStatus;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  /** pence */
  amount: number;
  /** Links a recurring payment back to the subscription it belongs to. */
  subscriptionId?: string;
}

export interface ReminderPrefs {
  enabled: boolean;
  remindDays: ReminderDays;
  /** HH:mm */
  quietStart: string;
  /** HH:mm */
  quietEnd: string;
}

export interface AppNotification {
  id: string;
  trialId: string;
  title: string;
  body: string;
  /** ISO datetime it was delivered (virtual clock). */
  at: string;
}
