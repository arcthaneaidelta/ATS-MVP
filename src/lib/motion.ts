import type { Variants } from 'framer-motion';

type Bezier = [number, number, number, number];
export const EASE_OUT: Bezier = [0.22, 1, 0.36, 1];
export const EASE_INOUT: Bezier = [0.76, 0, 0.24, 1];
export const EASE_STD: Bezier = [0.2, 0, 0, 1];

export const transitionFast = { duration: 0.14, ease: EASE_STD };
export const transitionMed = { duration: 0.26, ease: EASE_OUT };
export const transitionSlow = { duration: 0.6, ease: EASE_OUT };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitionSlow
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05
    }
  }
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    y: 8,
    transition: { duration: 0.12, ease: [0.2, 0, 0, 1] }
  }
};

export const drawerVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    x: 32,
    transition: { duration: 0.18, ease: [0.2, 0, 0, 1] }
  }
};

export const sheetVariants: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: '100%',
    transition: { duration: 0.2, ease: [0.2, 0, 0, 1] }
  }
};

export const pageFadeVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: [0.2, 0, 0, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: { duration: 0.15, ease: [0.2, 0, 0, 1] }
  }
};
