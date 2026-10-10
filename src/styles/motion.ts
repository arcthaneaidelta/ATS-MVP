import { Variants, Transition } from 'framer-motion';

export const transitions = {
  fast: { duration: 0.14, ease: [0.4, 0, 0.2, 1] } as Transition,
  base: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } as Transition,
  slow: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } as Transition,
  drawer: { duration: 0.32, ease: [0.76, 0, 0.24, 1] } as Transition,
  cinematic: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } as Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.base
  },
  exit: { 
    opacity: 0, 
    y: -8,
    transition: transitions.fast
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: transitions.base 
  },
  exit: { 
    opacity: 0, 
    transition: transitions.fast 
  }
};

export const modalScale: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: transitions.base 
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    y: 8, 
    transition: transitions.fast 
  }
};

export const drawerSlide: Variants = {
  hidden: { x: '100%', opacity: 0.8 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: transitions.drawer 
  },
  exit: { 
    x: '100%', 
    opacity: 0.8, 
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } 
  }
};

export const bottomSheetSlide: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0, 
    transition: transitions.drawer 
  },
  exit: { 
    y: '100%', 
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } 
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05
    }
  }
};
