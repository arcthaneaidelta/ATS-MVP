import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroOverlay: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  useEffect(() => {
    // Check if user already saw the intro in this session
    const hasSeen = sessionStorage.getItem('fsr_intro_seen');
    if (!hasSeen) {
      setIsVisible(true);

      const wipeTimer = setTimeout(() => {
        setIsWiping(true);
      }, 950);

      const finishTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('fsr_intro_seen', 'true');
      }, 1550);

      return () => {
        clearTimeout(wipeTimer);
        clearTimeout(finishTimer);
      };
    }
  }, []);

  const handleSkip = () => {
    setIsVisible(false);
    sessionStorage.setItem('fsr_intro_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        onClick={handleSkip}
        initial={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
        animate={
          isWiping
            ? { clipPath: 'inset(0% 0% 100% 0%)' }
            : { clipPath: 'inset(0% 0% 0% 0%)' }
        }
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-intro bg-primary flex flex-col items-center justify-center cursor-pointer select-none"
        title="Click to skip intro"
      >
        <div className="flex flex-col items-center text-center px-4">
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4"
          >
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <path d="M6 22L16 10L26 22" stroke="#EDE6D8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22L16 16L20 22" stroke="#B5683A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>

          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-3xl sm:text-4xl text-[#EDE6D8] font-normal tracking-tight"
          >
            Future
          </motion.h1>

          {/* Subtitle */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#EDE6D8] uppercase mt-1.5"
          >
            Shuttles & Rentals
          </motion.span>

          {/* Hairline progress indicator */}
          <div className="w-[120px] h-[1px] bg-[#EDE6D8]/20 mt-6 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.75, ease: 'linear' }}
              style={{ originX: 0 }}
              className="h-full bg-accent"
            />
          </div>

          <span className="text-[10px] text-[#EDE6D8]/40 tracking-wider uppercase mt-8">
            Click anywhere to enter
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
