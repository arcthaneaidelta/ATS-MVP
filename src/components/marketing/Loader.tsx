import React, { useState, useEffect } from 'react';

export const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showSubtext, setShowSubtext] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Check if session has already seen loader
    if (sessionStorage.getItem('groundwork_loader_seen')) {
      onComplete();
      return;
    }

    const startTime = Date.now();
    const duration = 1200; // 1.2s target

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed > 700) {
        setShowSubtext(true);
      }

      if (elapsed >= duration) {
        clearInterval(timer);
        setIsExiting(true);
        sessionStorage.setItem('groundwork_loader_seen', 'true');
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 20);

    const handleSkip = () => {
      clearInterval(timer);
      sessionStorage.setItem('groundwork_loader_seen', 'true');
      onComplete();
    };

    window.addEventListener('keydown', handleSkip);
    window.addEventListener('click', handleSkip);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleSkip);
      window.removeEventListener('click', handleSkip);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#F6F3EC] flex flex-col items-center justify-center transition-all duration-300 ${
        isExiting ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-xs px-6 text-center">
        {/* Architectural Wordmark */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <svg className="w-5 h-5 text-[#2F4A3F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="font-serif text-3xl font-medium tracking-tight text-[#1F2A27]">
            Groundwork
          </span>
        </div>

        {/* Drawing Hairline Progress */}
        <div className="w-full h-[1px] bg-[#DDD6C8] relative overflow-hidden my-3">
          <div
            className="absolute left-0 top-0 bottom-0 bg-[#B4684A] transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtext */}
        <div
          className={`text-[11px] font-semibold uppercase tracking-[0.1em] text-[#79827D] transition-opacity duration-200 ${
            showSubtext ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Lead capture for home builders
        </div>
      </div>
    </div>
  );
};
