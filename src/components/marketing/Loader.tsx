import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

export interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    // Check session storage
    if (sessionStorage.getItem('save_me_loaded')) {
      onComplete();
      return;
    }

    if (prefersReduced) {
      sessionStorage.setItem('save_me_loaded', '1');
      onComplete();
      return;
    }

    const start = performance.now();
    const duration = 1200; // between 900ms and 1400ms

    const interval = setInterval(() => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setIsExiting(true);
        setTimeout(() => {
          sessionStorage.setItem('save_me_loaded', '1');
          onComplete();
        }, 420);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete, prefersReduced]);

  return (
    <div
      role="status"
      aria-label="Loading Save Me"
      className={`fixed inset-0 z-loader bg-bg flex flex-col items-center justify-center transition-all duration-[420ms] ease-inout select-none ${
        isExiting ? '-translate-y-6 opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Sage Drawing Ring Mark */}
        <div className="w-8 h-8 mb-4">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle
              cx="16"
              cy="16"
              r="12"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              className="ring-draw"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <h1 className="text-4xl font-display font-normal text-ink tracking-tight animate-[fadeIn_450ms_ease-out_200ms_both]">
          Save Me
        </h1>

        {/* Tagline */}
        <p className="text-xs text-ink-3 mt-2 tracking-wide font-sans animate-[fadeIn_450ms_ease-out_450ms_both]">
          Light is lovely.
        </p>
      </div>

      {/* Hairline Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-line/40">
        <div
          className="h-full bg-primary transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
