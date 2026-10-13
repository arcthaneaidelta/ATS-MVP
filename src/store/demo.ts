import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '../types';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  projectTypes: string[];
  budget: string;
  timeline: string;
  createdAt: string;
}

interface DemoState {
  role: UserRole;
  statePreviewMode: 'normal' | 'empty' | 'loading' | 'error';
  simulateSlowNetwork: boolean;
  audioChimeEnabled: boolean;
  activeTenantId: string;
  activeBranchId: string;
  leads: Lead[];
  isEditMode: boolean;
  setRole: (role: UserRole) => void;
  setStatePreviewMode: (mode: 'normal' | 'empty' | 'loading' | 'error') => void;
  toggleSlowNetwork: () => void;
  toggleAudioChime: () => void;
  setActiveTenantId: (tenantId: string) => void;
  setActiveBranchId: (branchId: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  toggleEditMode: () => void;
  resetAllDemoData: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      role: 'diner',
      statePreviewMode: 'normal',
      simulateSlowNetwork: false,
      audioChimeEnabled: false, // Default false per PRD a11y rule
      activeTenantId: 'tenant-kiln',
      activeBranchId: 'Central',
      leads: [
        {
          id: 'lead-1',
          name: 'Sarah Jenkins',
          email: 's.jenkins@grandhotels.example',
          company: 'Grand Hotels Group',
          projectTypes: ['SaaS platform', 'Website'],
          budget: '$50k - $100k',
          timeline: 'Q1 2027',
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        },
      ],
      isEditMode: false,

      setRole: (role) => set({ role }),
      setStatePreviewMode: (statePreviewMode) => set({ statePreviewMode }),
      toggleSlowNetwork: () => set((s) => ({ simulateSlowNetwork: !s.simulateSlowNetwork })),
      toggleAudioChime: () => set((s) => ({ audioChimeEnabled: !s.audioChimeEnabled })),
      setActiveTenantId: (activeTenantId) => set({ activeTenantId }),
      setActiveBranchId: (activeBranchId) => set({ activeBranchId }),
      addLead: (leadData) =>
        set((s) => ({
          leads: [
            {
              ...leadData,
              id: `lead-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...s.leads,
          ],
        })),
      toggleEditMode: () => set((s) => ({ isEditMode: !s.isEditMode })),
      resetAllDemoData: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('bioniciq-demo-v1');
          localStorage.removeItem('bioniciq-cirqla-store');
          localStorage.removeItem('bioniciq-academy-store');
          localStorage.removeItem('bioniciq-cms-store');
          window.location.reload();
        }
      },
    }),
    {
      name: 'bioniciq-demo-v1',
    }
  )
);
