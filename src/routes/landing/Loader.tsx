import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../../config/brand';

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [shouldShow, setShouldShow] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if user has already visited in this browser session
    const hasVisited = sessionStorage.getItem('stratum-loaded');
    if (hasVisited) {
      setShouldShow(false);
      onComplete();
      return;
    }

    // Adaptive loader timer (target 1.3s)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 1100);

    const finishTimer = setTimeout(() => {
      sessionStorage.setItem('stratum-loaded', 'true');
      setShouldShow(false);
      onComplete();
    }, 1600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="loader-curtain"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 bg-dark-bg text-dark-text flex flex-col items-center justify-center overflow-hidden select-none"
        >
          {/* Animated SVG Contour Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 0 150 Q 250 80, 500 180 T 1000 120"
              fill="none"
              stroke="#B4713B"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M 0 300 Q 350 200, 700 320 T 1000 280"
              fill="none"
              stroke="#E4ECE8"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M 0 450 Q 200 480, 500 420 T 1000 460"
              fill="none"
              stroke="#9AA59F"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          {/* Central Wordmark & Copper Underline */}
          <div className="relative z-10 text-center space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-dark-text font-normal">
                {BRAND.name}
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="h-[1.5px] bg-accent w-28 mx-auto mt-2 origin-center"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-[11px] font-mono uppercase tracking-widest text-dark-muted"
            >
              Mining Spare Parts Commercial Memory
            </motion.p>
          </div>

          {/* Hairline Progress Indicator */}
          <div className="absolute bottom-16 w-32 h-[1px] bg-white/10 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="w-full h-full bg-accent"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
