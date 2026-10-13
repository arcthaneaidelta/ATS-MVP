import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CmsState {
  heroLabel: string;
  heroHeadline: string;
  heroLead: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  history: {
    timestamp: string;
    headline: string;
    seoTitle: string;
  }[];
  lastPublishedAt: string | null;

  // Actions
  setHeroLabel: (val: string) => void;
  setHeroHeadline: (val: string) => void;
  setHeroLead: (val: string) => void;
  setSeoTitle: (val: string) => void;
  setSeoDescription: (val: string) => void;
  setCanonicalUrl: (val: string) => void;
  publishToStaging: () => void;
  restoreVersion: (index: number) => void;
  resetCmsDefaults: () => void;
}

const defaultContent = {
  heroLabel: 'TECHNOLOGY PARTNER',
  heroHeadline: 'Three products. One engineering standard.',
  heroLead:
    'BionicIQ designs and builds the platforms behind how businesses present themselves, how people learn and how venues serve, engineered as one ecosystem.',
  seoTitle: 'BionicIQ — Technology Ecosystem & Engineering Partner',
  seoDescription:
    'BionicIQ architects and builds unified digital ecosystems: high-performance corporate platforms, modern academy LMS, and multi-tenant hospitality SaaS.',
  canonicalUrl: 'https://bioniciq.example/',
};

export const useCmsStore = create<CmsState>()(
  persist(
    (set, get) => ({
      ...defaultContent,
      history: [
        {
          timestamp: 'Yesterday, 17:40',
          headline: 'Engineered for the Everyday Enterprise',
          seoTitle: 'BionicIQ — Enterprise Digital Platforms',
        },
        {
          timestamp: '3 days ago',
          headline: 'One Studio. Three Digital Flagships.',
          seoTitle: 'BionicIQ Ecosystems',
        },
      ],
      lastPublishedAt: 'Today, 09:15',

      setHeroLabel: (heroLabel) => set({ heroLabel }),
      setHeroHeadline: (heroHeadline) => set({ heroHeadline }),
      setHeroLead: (heroLead) => set({ heroLead }),
      setSeoTitle: (seoTitle) => set({ seoTitle }),
      setSeoDescription: (seoDescription) => set({ seoDescription }),
      setCanonicalUrl: (canonicalUrl) => set({ canonicalUrl }),

      publishToStaging: () => {
        const state = get();
        const newHistory = [
          {
            timestamp: 'Just now',
            headline: state.heroHeadline,
            seoTitle: state.seoTitle,
          },
          ...state.history.slice(0, 4),
        ];

        set({
          lastPublishedAt: 'Just now',
          history: newHistory,
        });
      },

      restoreVersion: (index) => {
        const state = get();
        const version = state.history[index];
        if (version) {
          set({
            heroHeadline: version.headline,
            seoTitle: version.seoTitle,
          });
        }
      },

      resetCmsDefaults: () => set({ ...defaultContent }),
    }),
    {
      name: 'bioniciq-cms-store',
    }
  )
);
