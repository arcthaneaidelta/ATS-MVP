import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserRole,
  Buyer,
  Quote,
  Booking,
  PlanDefinition,
  Supplier,
  Tour,
  MockApiLog,
  FailureSimulationConfig,
} from '../data/types';
import {
  SEED_BUYERS,
  SEED_PLANS,
  SEED_QUOTES,
  SEED_BOOKINGS,
  SEED_SUPPLIERS,
  SEED_TOURS,
} from '../data/seed';

interface StoreState {
  currentRole: UserRole;
  activeBuyerId: string;
  buyers: Buyer[];
  plans: PlanDefinition[];
  quotes: Quote[];
  bookings: Booking[];
  suppliers: Supplier[];
  tours: Tour[];
  apiLogs: MockApiLog[];
  failures: FailureSimulationConfig;
  devPanelOpen: boolean;
  guidedTourDismissed: boolean;
  guidedTourStep: number;

  // Actions
  setRole: (role: UserRole) => void;
  setActiveBuyerId: (id: string) => void;
  setDevPanelOpen: (open: boolean) => void;
  setGuidedTourDismissed: (dismissed: boolean) => void;
  setGuidedTourStep: (step: number) => void;
  setFailures: (failures: Partial<FailureSimulationConfig>) => void;
  addApiLog: (log: MockApiLog) => void;
  clearApiLogs: () => void;
  updateBuyer: (id: string, updates: Partial<Buyer>) => void;
  updateQuote: (quote: Quote) => void;
  updateBooking: (booking: Booking) => void;
  addBooking: (booking: Booking) => void;
  resetDemo: () => void;
}

const INITIAL_FAILURES: FailureSimulationConfig = {
  networkErrorNextWrite: false,
  slowResponse: false,
  expiredSession: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      currentRole: 'buyer',
      // Default to Juniper Corporate Events on Explorer tier for the wow activation demo!
      activeBuyerId: 'buyer-4',
      buyers: SEED_BUYERS,
      plans: SEED_PLANS,
      quotes: SEED_QUOTES,
      bookings: SEED_BOOKINGS,
      suppliers: SEED_SUPPLIERS,
      tours: SEED_TOURS,
      apiLogs: [],
      failures: INITIAL_FAILURES,
      devPanelOpen: false,
      guidedTourDismissed: false,
      guidedTourStep: 1,

      setRole: (role) => set({ currentRole: role }),
      setActiveBuyerId: (id) => set({ activeBuyerId: id }),
      setDevPanelOpen: (open) => set({ devPanelOpen: open }),
      setGuidedTourDismissed: (dismissed) => set({ guidedTourDismissed: dismissed }),
      setGuidedTourStep: (step) => set({ guidedTourStep: step }),

      setFailures: (newFailures) =>
        set((state) => ({ failures: { ...state.failures, ...newFailures } })),

      addApiLog: (log) =>
        set((state) => ({ apiLogs: [log, ...state.apiLogs.slice(0, 49)] })),

      clearApiLogs: () => set({ apiLogs: [] }),

      updateBuyer: (id, updates) =>
        set((state) => ({
          buyers: state.buyers.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),

      updateQuote: (quote) =>
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === quote.id ? quote : q)),
        })),

      updateBooking: (booking) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === booking.id ? booking : b)),
        })),

      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),

      resetDemo: () =>
        set({
          currentRole: 'buyer',
          activeBuyerId: 'buyer-4',
          buyers: SEED_BUYERS,
          plans: SEED_PLANS,
          quotes: SEED_QUOTES,
          bookings: SEED_BOOKINGS,
          suppliers: SEED_SUPPLIERS,
          tours: SEED_TOURS,
          apiLogs: [],
          failures: INITIAL_FAILURES,
          guidedTourDismissed: false,
          guidedTourStep: 1,
        }),
    }),
    {
      name: 'meridian_ats_store',
      partialize: (state) => ({
        currentRole: state.currentRole,
        activeBuyerId: state.activeBuyerId,
        buyers: state.buyers,
        quotes: state.quotes,
        bookings: state.bookings,
        failures: state.failures,
        guidedTourDismissed: state.guidedTourDismissed,
        guidedTourStep: state.guidedTourStep,
      }),
    }
  )
);
