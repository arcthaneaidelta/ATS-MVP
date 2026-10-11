import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Pool,
  Entry,
  Draw,
  Destination,
  Transaction,
  NotificationItem,
  ActivityItem,
  DemoSettings
} from '../types';
import {
  initialUser,
  initialPools,
  initialDestinations,
  initialEntries,
  initialDraws,
  initialTransactions,
  initialNotifications,
  initialActivity
} from '../mock/db';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User;
  setAuthenticated: (auth: boolean) => void;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Balances
  availableBalance: number;
  activeEntriesBalance: number;
  lifetimeWinnings: number;
  lifetimeContributions: number;

  // Collections
  pools: Pool[];
  entries: Entry[];
  draws: Draw[];
  destinations: Destination[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  activity: ActivityItem[];

  // Settings & Tour
  demoSettings: DemoSettings;
  setDemoSetting: <K extends keyof DemoSettings>(key: K, value: DemoSettings[K]) => void;
  tourStep: number;
  isTourOpen: boolean;
  setTourStep: (step: number) => void;
  openTour: () => void;
  closeTour: () => void;

  // Actions
  joinPool: (poolId: string) => Promise<{ success: boolean; entry?: Entry; error?: string }>;
  simulateDeposit: (amount: number, onStepChange?: (step: number) => void) => Promise<void>;
  runDraw: (poolId: string) => Promise<Draw>;
  addDestination: (dest: { name: string; address: string; network: string }) => Promise<Destination>;
  setDefaultDestination: (id: string) => void;
  removeDestination: (id: string) => void;
  withdrawToDestination: (amount: number, destinationId: string) => Promise<{ success: boolean; error?: string }>;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

// Memory rate limiting tracking for spam clicks
const actionClickTimestamps: number[] = [];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      user: initialUser,
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),

      login: async (email) => {
        await new Promise((res) => setTimeout(res, 800));
        set({
          isAuthenticated: true,
          user: {
            ...initialUser,
            email: email.trim().toLowerCase()
          }
        });
        return true;
      },

      logout: () => {
        set({ isAuthenticated: false });
      },

      updateUser: (updates) => {
        set((state) => ({
          user: { ...state.user, ...updates }
        }));
      },

      availableBalance: 184.50,
      activeEntriesBalance: 50.00,
      lifetimeWinnings: 212.40,
      lifetimeContributions: 430.00,

      pools: initialPools,
      entries: initialEntries,
      draws: initialDraws,
      destinations: initialDestinations,
      transactions: initialTransactions,
      notifications: initialNotifications,
      activity: initialActivity,

      demoSettings: {
        simulateVrfDelay: false,
        userWinsNextDraw: true,
        reducedMotion: false,
        rateLimitActive: false
      },

      setDemoSetting: (key, value) => {
        set((state) => ({
          demoSettings: { ...state.demoSettings, [key]: value }
        }));
      },

      tourStep: 1,
      isTourOpen: false,
      setTourStep: (step) => set({ tourStep: step }),
      openTour: () => set({ isTourOpen: true, tourStep: 1 }),
      closeTour: () => set({ isTourOpen: false }),

      joinPool: async (poolId: string) => {
        const now = Date.now();
        // Check rate limiting: 5 rapid confirms in 10s
        actionClickTimestamps.push(now);
        while (actionClickTimestamps.length > 0 && actionClickTimestamps[0] < now - 10000) {
          actionClickTimestamps.shift();
        }
        if (actionClickTimestamps.length >= 5) {
          return {
            success: false,
            error: 'RATE_LIMITED'
          };
        }

        const state = get();
        const pool = state.pools.find((p) => p.id === poolId);
        if (!pool) return { success: false, error: 'Pool not found' };
        if (pool.status !== 'open') return { success: false, error: 'POOL_CLOSED' };
        if (state.availableBalance < pool.entryFee) {
          return { success: false, error: 'INSUFFICIENT_FUNDS' };
        }

        // Artificial latency
        await new Promise((res) => setTimeout(res, 650));

        const newEntryNumber = pool.currentEntries + 1;
        const newEntry: Entry = {
          id: `ent_user_${pool.id}_${newEntryNumber}`,
          poolId: pool.id,
          poolName: pool.name,
          entryNumber: newEntryNumber,
          userId: state.user.id,
          userName: state.user.name,
          maskedName: `${state.user.name[0]}****${state.user.name.split(' ')[1]?.[0] || 'a'}`,
          timestamp: new Date().toISOString(),
          status: 'active',
          fee: pool.entryFee
        };

        const newTx: Transaction = {
          id: `tx_ent_${Date.now()}`,
          type: 'entry',
          amount: -pool.entryFee,
          status: 'credited',
          timestamp: new Date().toISOString(),
          reference: `Entry: ${pool.name} (#${newEntryNumber})`,
          networkFee: 0.002,
          txHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}b81f`
        };

        const newAct: ActivityItem = {
          id: `act_${Date.now()}`,
          type: 'entry',
          title: `Contributed to ${pool.name}`,
          description: `Secured Entry #${newEntryNumber}. Fixed contribution $${pool.entryFee.toFixed(2)}.`,
          amount: pool.entryFee,
          isPositive: false,
          timestamp: new Date().toISOString(),
          dateGroup: 'Today',
          txHash: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`
        };

        set((s) => ({
          availableBalance: Number((s.availableBalance - pool.entryFee).toFixed(2)),
          activeEntriesBalance: Number((s.activeEntriesBalance + pool.entryFee).toFixed(2)),
          lifetimeContributions: Number((s.lifetimeContributions + pool.entryFee).toFixed(2)),
          entries: [newEntry, ...s.entries],
          transactions: [newTx, ...s.transactions],
          activity: [newAct, ...s.activity],
          pools: s.pools.map((p) =>
            p.id === poolId
              ? {
                  ...p,
                  pot: p.pot + pool.entryFee,
                  currentEntries: p.currentEntries + 1
                }
              : p
          )
        }));

        return { success: true, entry: newEntry };
      },

      simulateDeposit: async (amount: number, onStepChange?: (step: number) => void) => {
        // Step 1: Detected (0s)
        onStepChange?.(1);
        await new Promise((res) => setTimeout(res, 1800));

        // Step 2: Confirming 3/12 (1.8s)
        onStepChange?.(2);
        await new Promise((res) => setTimeout(res, 2000));

        // Step 3: Confirming 12/12 (3.8s)
        onStepChange?.(3);
        await new Promise((res) => setTimeout(res, 1700));

        // Step 4: Credited (5.5s)
        onStepChange?.(4);

        const newTx: Transaction = {
          id: `tx_dep_${Date.now()}`,
          type: 'deposit',
          amount: amount,
          status: 'credited',
          timestamp: new Date().toISOString(),
          reference: 'Base Sub-Wallet Deposit',
          confirmations: 12,
          maxConfirmations: 12,
          networkFee: 0.0021,
          txHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}7a1f`
        };

        const newAct: ActivityItem = {
          id: `act_${Date.now()}`,
          type: 'deposit',
          title: 'Deposit Credited',
          description: `Received $${amount.toFixed(2)} USDC on Base sub-wallet address.`,
          amount: amount,
          isPositive: true,
          timestamp: new Date().toISOString(),
          dateGroup: 'Today',
          txHash: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`
        };

        const newNotif: NotificationItem = {
          id: `notif_${Date.now()}`,
          title: 'Deposit credited',
          message: `$${amount.toFixed(2)} USDC credited to your available balance via Base sub-wallet sweep.`,
          timestamp: 'Just now',
          read: false,
          link: '/app/wallet'
        };

        set((s) => ({
          availableBalance: Number((s.availableBalance + amount).toFixed(2)),
          transactions: [newTx, ...s.transactions],
          activity: [newAct, ...s.activity],
          notifications: [newNotif, ...s.notifications]
        }));
      },

      runDraw: async (poolId: string) => {
        const state = get();
        const pool = state.pools.find((p) => p.id === poolId);
        if (!pool) throw new Error('Pool not found');

        // Check if user has an entry in this pool
        const userEntry = state.entries.find((e) => e.poolId === poolId && e.status === 'active');
        const userWins = state.demoSettings.userWinsNextDraw && !!userEntry;

        const entriesCount = pool.currentEntries;
        const totalPot = pool.pot;
        const platformFee = Number((totalPot * 0.05).toFixed(2));
        const winnerPayout = Number((totalPot - platformFee).toFixed(2));

        // Generate deterministic or controlled BigInt random word
        let winningEntryNumber: number;
        let randomWord: string;

        if (userWins && userEntry) {
          winningEntryNumber = userEntry.entryNumber;
          // Craft big integer such that randomWord % entriesCount === (userEntry.entryNumber - 1)
          const targetRemainder = BigInt(winningEntryNumber - 1);
          const bigMultiplier = BigInt('8928374910293847192837491823749182');
          const bigWord = bigMultiplier * BigInt(entriesCount) + targetRemainder;
          randomWord = bigWord.toString();
        } else {
          // General random word
          const bigWord = BigInt(
            '4829104829104820194820194820194820194820194820194820194820194841'
          );
          winningEntryNumber = Number(bigWord % BigInt(entriesCount)) + 1;
          randomWord = bigWord.toString();
        }

        const winnerMaskedName = userWins
          ? state.user.name
          : 'D*** O.';

        const drawId = `draw_${pool.id}_${Date.now().toString().slice(-4)}`;
        const newDraw: Draw = {
          id: drawId,
          poolId: pool.id,
          poolName: pool.name,
          cadence: pool.cadence,
          blockNumber: 38224590,
          vrfRequestId: `0x7a${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}901c`,
          randomWord,
          entriesCount,
          winningEntryNumber,
          winnerMaskedName: userWins ? `${state.user.name} (You)` : winnerMaskedName,
          winnerPayout,
          platformFee,
          timestamp: new Date().toISOString(),
          vrfStatus: 'fulfilled',
          txHash: `0x4be17f9${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}c09a`,
          isUserWinner: userWins
        };

        const defaultDest = state.destinations.find((d) => d.isDefault) || state.destinations[0];

        // Updates
        set((s) => {
          const updatedPools = s.pools.map((p) =>
            p.id === poolId
              ? {
                  ...p,
                  status: 'settled' as const,
                  winnerEntryNumber: winningEntryNumber,
                  winnerMaskedName: newDraw.winnerMaskedName,
                  drawId
                }
              : p
          );

          const updatedEntries = s.entries.map((e) => {
            if (e.poolId === poolId) {
              return {
                ...e,
                status: (e.entryNumber === winningEntryNumber ? 'won' : 'lost') as 'won' | 'lost'
              };
            }
            return e;
          });

          let newAvailableBalance = s.availableBalance;
          let newLifetimeWinnings = s.lifetimeWinnings;
          let newActiveEntries = s.activeEntriesBalance;

          if (userEntry) {
            newActiveEntries = Math.max(0, Number((newActiveEntries - userEntry.fee).toFixed(2)));
          }

          const newTransactions = [...s.transactions];
          const newActivity = [...s.activity];
          const newNotifications = [...s.notifications];

          if (userWins) {
            newLifetimeWinnings = Number((newLifetimeWinnings + winnerPayout).toFixed(2));
            // Add win notification
            newNotifications.unshift({
              id: `notif_win_${Date.now()}`,
              title: 'You won the draw!',
              message: `Congratulations! Entry #${winningEntryNumber} won $${winnerPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })} in ${pool.name}. Auto-routed to ${defaultDest?.name || 'saved destination'}.`,
              timestamp: 'Just now',
              read: false,
              link: `/app/draws/${drawId}`
            });

            // Add win transaction
            newTransactions.unshift({
              id: `tx_win_${Date.now()}`,
              type: 'win',
              amount: winnerPayout,
              status: 'arrived',
              timestamp: new Date().toISOString(),
              reference: `Prize Payout: ${pool.name}`,
              destinationName: defaultDest?.name,
              networkFee: 0.002,
              txHash: newDraw.txHash
            });

            // Add activity
            newActivity.unshift({
              id: `act_win_${Date.now()}`,
              type: 'win',
              title: `Prize Awarded · ${pool.name}`,
              description: `Entry #${winningEntryNumber} selected by Chainlink VRF. Net payout $${winnerPayout.toFixed(2)}.`,
              amount: winnerPayout,
              isPositive: true,
              timestamp: new Date().toISOString(),
              dateGroup: 'Today',
              txHash: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`
            });
          }

          return {
            pools: updatedPools,
            entries: updatedEntries,
            draws: [newDraw, ...s.draws],
            availableBalance: newAvailableBalance,
            activeEntriesBalance: newActiveEntries,
            lifetimeWinnings: newLifetimeWinnings,
            transactions: newTransactions,
            activity: newActivity,
            notifications: newNotifications
          };
        });

        return newDraw;
      },

      addDestination: async ({ name, address, network }) => {
        await new Promise((res) => setTimeout(res, 500));
        const newDest: Destination = {
          id: `dest_${Date.now()}`,
          name,
          network,
          address,
          isDefault: false,
          status: 'cooling_off',
          activatesAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString()
        };

        set((s) => ({
          destinations: [...s.destinations, newDest]
        }));
        return newDest;
      },

      setDefaultDestination: (id) => {
        set((s) => ({
          destinations: s.destinations.map((d) => ({
            ...d,
            isDefault: d.id === id
          }))
        }));
      },

      removeDestination: (id) => {
        set((s) => ({
          destinations: s.destinations.filter((d) => d.id !== id)
        }));
      },

      withdrawToDestination: async (amount, destinationId) => {
        const state = get();
        if (amount <= 0 || amount > state.availableBalance) {
          return { success: false, error: 'Invalid withdrawal amount' };
        }
        const dest = state.destinations.find((d) => d.id === destinationId);
        if (!dest) return { success: false, error: 'Destination not found' };
        if (dest.status === 'cooling_off') {
          return { success: false, error: 'Destination is in 24h security cooling-off period' };
        }

        await new Promise((res) => setTimeout(res, 700));

        const newTx: Transaction = {
          id: `tx_payout_${Date.now()}`,
          type: 'payout',
          amount: -amount,
          status: 'arrived',
          timestamp: new Date().toISOString(),
          reference: `Manual Withdrawal to ${dest.name}`,
          destinationName: dest.name,
          networkFee: 0.002,
          txHash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}9f12`
        };

        const newAct: ActivityItem = {
          id: `act_${Date.now()}`,
          type: 'payout',
          title: `Withdrawal Dispatched`,
          description: `Dispatched $${amount.toFixed(2)} to ${dest.name} with $0.002 network fee.`,
          amount: amount,
          isPositive: false,
          timestamp: new Date().toISOString(),
          dateGroup: 'Today',
          txHash: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`
        };

        set((s) => ({
          availableBalance: Number((s.availableBalance - amount).toFixed(2)),
          transactions: [newTx, ...s.transactions],
          activity: [newAct, ...s.activity]
        }));

        return { success: true };
      },

      markAllNotificationsRead: () => {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true }))
        }));
      },

      resetDemoData: () => {
        set({
          user: initialUser,
          availableBalance: 184.50,
          activeEntriesBalance: 50.00,
          lifetimeWinnings: 212.40,
          lifetimeContributions: 430.00,
          pools: initialPools,
          entries: initialEntries,
          draws: initialDraws,
          destinations: initialDestinations,
          transactions: initialTransactions,
          notifications: initialNotifications,
          activity: initialActivity,
          tourStep: 1,
          isTourOpen: false
        });
      }
    }),
    {
      name: 'meridian_state_v1'
    }
  )
);
