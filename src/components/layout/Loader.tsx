import React, { useEffect, useState } from 'react';

export const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [activeDots, setActiveDots] = useState<number>(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if repeat visit
    const hasVisited = sessionStorage.getItem('implemnt_loaded');
    if (hasVisited) {
      onComplete();
      return;
    }

    // Dot progression
    const timer1 = setTimeout(() => setActiveDots(1), 300);
    const timer2 = setTimeout(() => setActiveDots(2), 380);
    const timer3 = setTimeout(() => setActiveDots(3), 460);
    const timer4 = setTimeout(() => setActiveDots(4), 540);
    const timer5 = setTimeout(() => setActiveDots(5), 620);
    const timer6 = setTimeout(() => setActiveDots(6), 700);

    // Fade out and exit after 1000ms
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      sessionStorage.setItem('implemnt_loaded', 'true');
    }, 1050);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#F6F3EE] flex flex-col items-center justify-center transition-transform duration-450 ease-[cubic-bezier(0.7,0,0.2,1)] ${
        isExiting ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      aria-label="Loading Implemnt Diagnostic"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Wordmark */}
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-350">
          <span className="font-serif text-3xl font-medium tracking-tight text-[#1E2A2B]">
            Implemnt
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4643C] px-1.5 py-0.5 rounded border border-[#E6C7B6] bg-[#F3E3D8]">
            Trace
          </span>
        </div>

        {/* 6-dot pipeline hairline */}
        <div className="relative w-36 h-4 flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#CFC8BB]" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const isFilled = i < activeDots;
            return (
              <div
                key={i}
                className={`relative z-10 w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                  isFilled ? 'bg-[#1F4B4A] scale-110' : 'bg-[#E2DDD3] border border-[#CFC8BB]'
                }`}
              />
            );
          })}
        </div>

        <p className="text-xs text-[#7B8786] font-mono tracking-wider">
          Initializing diagnostic harness...
        </p>
      </div>
    </div>
  );
};
