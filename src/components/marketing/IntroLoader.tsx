import React, { useState, useEffect } from 'react';

export const IntroLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // Check if skip intro flag is in URL or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('skipintro') === '1' || sessionStorage.getItem('meridian_intro_shown')) {
      onComplete();
      return;
    }

    // Stage 1: Circle mark draws (100ms)
    const t1 = setTimeout(() => setStage(1), 100);

    // Stage 2: Horizon line draws (400ms)
    const t2 = setTimeout(() => setStage(2), 400);

    // Stage 3: Wordmark fades up (600ms)
    const t3 = setTimeout(() => setStage(3), 600);

    // Progress bar fills (700ms - 1000ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 12;
      });
    }, 40);

    // Exit at 1.1s
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      sessionStorage.setItem('meridian_intro_shown', 'true');
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(exitTimer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div
      role="status"
      aria-label="Loading Meridian"
      className={`fixed inset-0 z-[100] bg-[#F5F2EC] flex flex-col items-center justify-center transition-all duration-500 ease-emph-custom select-none ${
        isExiting ? '[clip-path:inset(0_0_100%_0)]' : '[clip-path:inset(0_0_0_0)]'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated Meridian Logo SVG */}
        <div className="w-16 h-16 relative">
          <svg viewBox="0 0 48 48" className="w-full h-full">
            {/* Circle stroke */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="#2C4A3E"
              strokeWidth="2"
              strokeDasharray="126"
              strokeDashoffset={stage >= 1 ? '0' : '126'}
              className="transition-all duration-500 ease-in-out-custom"
            />
            {/* Horizontal horizon line slightly above center */}
            <line
              x1="6"
              y1="20"
              x2="42"
              y2="20"
              stroke="#2C4A3E"
              strokeWidth="2"
              strokeDasharray="36"
              strokeDashoffset={stage >= 2 ? '0' : '36'}
              className="transition-all duration-300 ease-in-out-custom"
            />
          </svg>
        </div>

        {/* Wordmark in Newsreader font */}
        <div
          className={`transform transition-all duration-400 ease-out-custom ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <span className="font-display font-medium text-2xl tracking-tight text-[#1B2420]">
            Meridian
          </span>
        </div>
      </div>

      {/* Hairline progress bar at bottom of viewport */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#DDD8CD]">
        <div
          className="h-full bg-[#2C4A3E] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
