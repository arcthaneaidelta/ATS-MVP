/**
 * Shared motion spring configs and variants conforming strictly to PRD §9.1 and §9.2.
 * Spring: stiffness 320, damping 34, mass 1 for sheets and notification cards.
 */

export const springTransition = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 34,
  mass: 1,
};

const easeOutCubic = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: '0%', transition: springTransition },
  exit: { y: '100%', transition: { duration: 0.24, ease: easeOutCubic } },
};

export const scrimVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const toastVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.26, ease: easeOutCubic } },
  exit: { opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.2 } },
};

export const tabDriftVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction * 6,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, ease: easeOutCubic },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: -direction * 6,
    transition: { duration: 0.18, ease: easeOutCubic },
  }),
};

export const pushPageVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.26, ease: easeOutCubic } },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2, ease: easeOutCubic } },
};
