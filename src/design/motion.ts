export const durations = {
  fast: 0.12,
  base: 0.20,
  slow: 0.36,
  page: 0.48,
  reveal: 0.50,
};

export const easings = {
  easeOut: [0.22, 1, 0.36, 1],
  easeInOut: [0.65, 0, 0.35, 1],
};

export const variants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: durations.base, ease: easings.easeOut },
    },
    exit: {
      opacity: 0,
      transition: { duration: durations.fast, ease: easings.easeOut },
    },
  },

  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: durations.reveal, ease: easings.easeOut },
    },
    exit: {
      opacity: 0,
      transition: { duration: durations.fast, ease: easings.easeOut },
    },
  },

  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: durations.base, ease: easings.easeOut },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: durations.fast, ease: easings.easeOut },
    },
  },

  sheetUp: {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: { duration: durations.slow, ease: easings.easeOut },
    },
    exit: {
      y: '100%',
      transition: { duration: durations.base, ease: easings.easeOut },
    },
  },

  drawerRight: {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: { duration: durations.slow, ease: easings.easeOut },
    },
    exit: {
      x: '100%',
      transition: { duration: durations.base, ease: easings.easeOut },
    },
  },

  listStagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  },
};
