import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Subscription,
  Trial,
  ReminderPrefs,
  AppNotification,
} from '@/data/types';
import { seedSubscriptions } from '@/data/seed.subscriptions';
import { seedTrials } from '@/data/seed.trials';
import { defaultDemoFlags, type DemoFlags } from './demoFlags';
import { MockApiClient } from '@/api';
import { brand } from '@/config/brand';
import { annualPence, computeTotals, type Totals } from '@/lib/money';
import { addDays, fmtDay, reminderAt, toDate } from '@/lib/dates';
import { virtualClock } from './virtualClock';

export interface AppState {
  connected: boolean;
  subscriptions: Subscription[];
  trials: Trial[];
  savedPerYear: number;
  lastCancelledId: string | null;
  reminderPrefs: ReminderPrefs;
  lastUpdated: string;
  virtualDate: string;
  activeNotification: AppNotification | null;
  demoFlags: DemoFlags;
  isLoading: boolean;
  error: string | null;

  // Actions
  connect: (bankName?: string) => Promise<void>;
  disconnectAndDelete: () => Promise<void>;
  keepSubscription: (id: string) => void;
  snoozeSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  undoCancel: () => void;
  addTrial: (trial: Omit<Trial, 'id' | 'createdAt' | 'status'>) => Promise<Trial>;
  toggleProtect: (id: string) => void;
  updateReminderPrefs: (prefs: Partial<ReminderPrefs>) => Promise<void>;
  fastForward: (days: number) => void;
  dismissNotification: () => void;
  setDemoFlag: <K extends keyof DemoFlags>(flag: K, val: DemoFlags[K]) => void;
  resetDemo: () => void;
  getTotals: () => Totals;
  getWorthALook: () => Subscription[];
}

const defaultReminderPrefs: ReminderPrefs = {
  enabled: true,
  remindDays: 2,
  quietStart: '22:00',
  quietEnd: '08:00',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      const api = new MockApiClient({
        getFlags: () => get().demoFlags,
      });

      return {
        connected: true,
        subscriptions: seedSubscriptions,
        trials: seedTrials,
        savedPerYear: 0,
        lastCancelledId: null,
        reminderPrefs: defaultReminderPrefs,
        lastUpdated: '13 Oct',
        virtualDate: brand.demoToday,
        activeNotification: null,
        demoFlags: defaultDemoFlags,
        isLoading: false,
        error: null,

        connect: async (bankName = 'Northfield Bank') => {
          set({ isLoading: true, error: null });
          try {
            await api.connectBank(bankName);
            set({
              connected: true,
              subscriptions: seedSubscriptions,
              trials: seedTrials,
              savedPerYear: 0,
              isLoading: false,
            });
          } catch (err: unknown) {
            set({
              isLoading: false,
              error: err instanceof Error ? err.message : "Couldn't connect to bank",
            });
            throw err;
          }
        },

        disconnectAndDelete: async () => {
          set({ isLoading: true });
          await api.deleteAllData();
          virtualClock.reset(brand.demoToday);
          set({
            connected: false,
            subscriptions: [],
            trials: [],
            savedPerYear: 0,
            lastCancelledId: null,
            virtualDate: brand.demoToday,
            activeNotification: null,
            isLoading: false,
            error: null,
          });
        },

        keepSubscription: (id: string) => {
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, status: 'kept' } : s
            ),
          }));
        },

        snoozeSubscription: (id: string) => {
          const snoozedUntil = addDays(toDate(get().virtualDate), 30).toISOString();
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, status: 'snoozed', snoozedUntil } : s
            ),
          }));
        },

        cancelSubscription: (id: string) => {
          const sub = get().subscriptions.find((s) => s.id === id);
          if (!sub) return;

          const saving = annualPence(sub);
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, status: 'cancelled' } : s
            ),
            savedPerYear: state.savedPerYear + saving,
            lastCancelledId: id,
          }));
        },

        undoCancel: () => {
          const id = get().lastCancelledId;
          if (!id) return;
          const sub = get().subscriptions.find((s) => s.id === id);
          if (!sub) return;

          const saving = annualPence(sub);
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s.id === id ? { ...s, status: 'active' } : s
            ),
            savedPerYear: Math.max(0, state.savedPerYear - saving),
            lastCancelledId: null,
          }));
        },

        addTrial: async (trialData) => {
          set({ isLoading: true, error: null });
          try {
            const newTrial = await api.addTrial(trialData);
            set((state) => ({
              trials: [...state.trials, newTrial].sort(
                (a, b) => new Date(a.endsOn).getTime() - new Date(b.endsOn).getTime()
              ),
              isLoading: false,
            }));
            return newTrial;
          } catch (err: unknown) {
            set({
              isLoading: false,
              error: err instanceof Error ? err.message : "Couldn't save trial",
            });
            throw err;
          }
        },

        toggleProtect: (id: string) => {
          set((state) => ({
            trials: state.trials.map((t) =>
              t.id === id ? { ...t, protect: !t.protect } : t
            ),
          }));
        },

        updateReminderPrefs: async (partial) => {
          const updated = { ...get().reminderPrefs, ...partial };
          await api.setReminderPrefs(updated);
          set({ reminderPrefs: updated });
        },

        fastForward: (days: number) => {
          const nextDate = virtualClock.advanceDays(days);
          const nextDateIso = nextDate.toISOString();
          const prefs = get().reminderPrefs;

          // Check if any active protected trial triggers notification
          const calmTrial = get().trials.find((t) => t.id === 'trial-calm' && t.protect);
          let notification: AppNotification | null = null;

          if (calmTrial) {
            const triggerTime = reminderAt(calmTrial, prefs);
            if (nextDate >= triggerTime) {
              notification = {
                id: `notif-${Date.now()}`,
                trialId: calmTrial.id,
                title: 'Save Me',
                body: "Calm's free trial ends in 2 days. £39.99 will be charged. Review?",
                at: nextDateIso,
              };
            }
          }

          set({
            virtualDate: nextDateIso,
            lastUpdated: fmtDay(nextDate),
            activeNotification: notification,
          });
        },

        dismissNotification: () => {
          set({ activeNotification: null });
        },

        setDemoFlag: (flag, val) => {
          set((state) => ({
            demoFlags: { ...state.demoFlags, [flag]: val },
          }));
        },

        resetDemo: () => {
          virtualClock.reset(brand.demoToday);
          set({
            connected: true,
            subscriptions: seedSubscriptions,
            trials: seedTrials,
            savedPerYear: 0,
            lastCancelledId: null,
            reminderPrefs: defaultReminderPrefs,
            lastUpdated: '13 Oct',
            virtualDate: brand.demoToday,
            activeNotification: null,
            demoFlags: defaultDemoFlags,
            isLoading: false,
            error: null,
          });
        },

        getTotals: () => {
          const active = get().subscriptions.filter((s) => s.status !== 'cancelled');
          return computeTotals(active);
        },

        getWorthALook: () => {
          const active = get().subscriptions.filter(
            (s) => s.status === 'active' && s.promoteRank !== undefined
          );
          return active.sort((a, b) => (a.promoteRank ?? 99) - (b.promoteRank ?? 99));
        },
      };
    },
    {
      name: 'save-me-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
