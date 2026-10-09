import React, { useState, useEffect } from 'react';

export const EntrySequence: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<'drawing' | 'visible' | 'exiting' | 'done'>('drawing');

  useEffect(() => {
    // Check if previously shown this session
    const hasShown = sessionStorage.getItem('af_entry_shown');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasShown || prefersReducedMotion) {
      setStage('done');
      onComplete?.();
      return;
    }

    sessionStorage.setItem('af_entry_shown', 'true');

    const timer1 = setTimeout(() => setStage('visible'), 200);
    const timer2 = setTimeout(() => setStage('exiting'), 900);
    const timer3 = setTimeout(() => {
      setStage('done');
      onComplete?.();
    }, 1450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (stage === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-bg transition-opacity duration-base ${
        stage === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1px Center Hairline */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-border overflow-hidden">
        <div className="h-full bg-primary/60 animate-hairline w-full" />
      </div>

      {/* Brand Wordmark & Label */}
      <div 
        className={`relative z-10 px-8 py-4 bg-bg text-center transition-all duration-base transform ${
          stage === 'visible' 
            ? 'opacity-100 translate-y-0' 
            : stage === 'exiting' 
            ? 'opacity-0 -translate-y-2' 
            : 'opacity-0 translate-y-2'
        }`}
      >
        <h1 className="font-serif text-3xl font-medium tracking-tight text-text">
          Alder & Finch
        </h1>
        <p className="text-[11px] font-semibold text-accent tracking-[0.2em] uppercase mt-1">
          Home Studio · Portland
        </p>
      </div>
    </div>
  );
};
