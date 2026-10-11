export type PoolCadence = 'daily' | 'weekly' | 'monthly';
export type PoolStatus = 'open' | 'settled' | 'drawing';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  memberSince: string;
  region: string;
  eligibilityConfirmed: boolean;
  depositAddress: string;
}

export interface Pool {
  id: string;
  name: string;
  cadence: PoolCadence;
  entryFee: number;
  pot: number;
  currentEntries: number;
  maxEntries?: number;
  closesAt: string; // ISO string
  status: PoolStatus;
  winnerEntryNumber?: number;
  winnerMaskedName?: string;
  drawId?: string;
  description?: string;
}

export interface Entry {
  id: string;
  poolId: string;
  poolName: string;
  entryNumber: number;
  userId: string;
  userName: string;
  maskedName: string;
  timestamp: string;
  status: 'active' | 'won' | 'lost';
  fee: number;
}

export interface Draw {
  id: string;
  poolId: string;
  poolName: string;
  cadence: PoolCadence;
  blockNumber: number;
  vrfRequestId: string;
  randomWord: string; // string representation of big integer
  entriesCount: number;
  winningEntryNumber: number;
  winnerMaskedName: string;
  winnerPayout: number;
  platformFee: number;
  timestamp: string;
  vrfStatus: 'fulfilled' | 'pending' | 'delayed';
  txHash: string;
  isUserWinner: boolean;
}

export interface Destination {
  id: string;
  name: string;
  network: string; // "Base"
  address: string;
  isDefault: boolean;
  status: 'active' | 'cooling_off';
  activatesAt?: string;
}

export type TransactionType = 'deposit' | 'entry' | 'win' | 'payout';
export type TransactionStatus = 'credited' | 'confirming' | 'queued' | 'broadcast' | 'arrived' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
  reference: string;
  destinationName?: string;
  confirmations?: number;
  maxConfirmations?: number;
  networkFee: number;
  txHash?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ActivityItem {
  id: string;
  type: TransactionType;
  title: string;
  description: string;
  amount?: number;
  isPositive?: boolean;
  timestamp: string;
  dateGroup: string; // e.g. "Today", "Yesterday", "October 9, 2026"
  referenceId?: string;
  txHash?: string;
}

export interface DemoSettings {
  simulateVrfDelay: boolean;
  userWinsNextDraw: boolean;
  reducedMotion: boolean;
  rateLimitActive: boolean;
}
