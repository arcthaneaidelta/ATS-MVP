import { create } from 'zustand';
import type { CauseCategory, OutcomeType, PlatformType } from '../types';
import { FINDINGS_DATA } from '../data/findings';

interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message?: string;
}

interface DemoState {
  // Trace / Meeting state
  selectedMeetingId: string;
  setSelectedMeetingId: (id: string) => void;

  // Meeting filters
  filterStatus: 'all' | OutcomeType;
  filterPlatform: 'all' | PlatformType;
  filterCause: 'all' | CauseCategory;
  filterSearch: string;
  setFilterStatus: (status: 'all' | OutcomeType) => void;
  setFilterPlatform: (platform: 'all' | PlatformType) => void;
  setFilterCause: (cause: 'all' | CauseCategory) => void;
  setFilterSearch: (search: string) => void;
  clearFilters: () => void;

  // Findings & Scope
  includedFindingIds: string[];
  toggleFindingInScope: (findingId: string) => void;
  isScopeApproved: boolean;
  approveScope: () => void;
  resetScope: () => void;

  // Command palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Toast notifications
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Global reset
  resetAll: () => void;
}

const STORAGE_KEY = 'implemnt-demo-v1';

function getInitialScope(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.includedFindingIds)) {
        return parsed.includedFindingIds;
      }
    }
  } catch (e) {
    console.error('Failed to parse local storage for scope', e);
  }
  return FINDINGS_DATA.filter((f) => f.inScopeDefault).map((f) => f.id);
}

function saveScopeToStorage(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ includedFindingIds: ids }));
  } catch (e) {
    console.error('Failed to save scope to storage', e);
  }
}

export const useDemoStore = create<DemoState>((set) => ({
  selectedMeetingId: 'MTG-1056', // default to the iconic waiting room timeout case
  setSelectedMeetingId: (id) => set({ selectedMeetingId: id }),

  filterStatus: 'all',
  filterPlatform: 'all',
  filterCause: 'all',
  filterSearch: '',
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPlatform: (platform) => set({ filterPlatform: platform }),
  setFilterCause: (cause) => set({ filterCause: cause }),
  setFilterSearch: (search) => set({ filterSearch: search }),
  clearFilters: () => set({ filterStatus: 'all', filterPlatform: 'all', filterCause: 'all', filterSearch: '' }),

  includedFindingIds: getInitialScope(),
  toggleFindingInScope: (id) =>
    set((state) => {
      const exists = state.includedFindingIds.includes(id);
      const updated = exists
        ? state.includedFindingIds.filter((item) => item !== id)
        : [...state.includedFindingIds, id];
      saveScopeToStorage(updated);
      return { includedFindingIds: updated };
    }),

  isScopeApproved: false,
  approveScope: () => set({ isScopeApproved: true }),
  resetScope: () => {
    const defaults = FINDINGS_DATA.filter((f) => f.inScopeDefault).map((f) => f.id);
    saveScopeToStorage(defaults);
    set({ includedFindingIds: defaults, isScopeApproved: false });
  },

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4500);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  resetAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    const defaults = FINDINGS_DATA.filter((f) => f.inScopeDefault).map((f) => f.id);
    set({
      selectedMeetingId: 'MTG-1056',
      filterStatus: 'all',
      filterPlatform: 'all',
      filterCause: 'all',
      filterSearch: '',
      includedFindingIds: defaults,
      isScopeApproved: false,
      isCommandPaletteOpen: false
    });
  }
}));
