import React, { useEffect, useState } from 'react';
import { Wordmark } from './Wordmark';

export const Loader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const hasSeen = sessionStorage.getItem('bioniciq_loader_shown');
    if (hasSeen) {
      if (onComplete) onComplete();
      return;
    }

    setIsVisible(true);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / 800) * 100));
      setProgress(pct);

      if (elapsed >= 850) {
        clearInterval(interval);
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          sessionStorage.setItem('bioniciq_loader_shown', 'true');
          if (onComplete) onComplete();
        }, 480);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg select-none transition-transform duration-[480ms] ease-in-out ${
        isExiting ? '-translate-y-full pointer-events-none' : 'translate-y-0'
      }`}
    >
      <div
        className={`flex flex-col items-center transition-opacity duration-200 ${
          isExiting ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Wordmark size="lg" className="scale-110 mb-4 animate-in fade-in duration-300" />
        {/* Hairline 160px wide progress */}
        <div className="w-40 h-[1.5px] bg-line relative overflow-hidden rounded-full">
          <div
            className="absolute left-0 top-0 bottom-0 bg-clay transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="mt-3 font-mono text-[11px] text-ink-3 tabular-nums">
          Loading Ecosystem · {progress}%
        </span>
      </div>
    </div>
  );
};
