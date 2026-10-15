import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useStore } from '../store/useStore';

interface LockedGateProps {
  isLocked?: boolean;
  requirement?: string;
  children: React.ReactNode;
  fallbackAction?: React.ReactNode;
  className?: string;
}

export const LockedGate: React.FC<LockedGateProps> = ({
  isLocked,
  requirement = 'Needs Professional plan to unlock direct booking',
  children,
  fallbackAction,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const buyers = useStore((s) => s.buyers);
  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);

  // If isLocked is not explicitly provided, check if current buyer is on explorer plan
  const effectiveLocked =
    isLocked !== undefined ? isLocked : currentBuyer?.planId === 'explorer';

  if (!effectiveLocked) {
    return (
      <div className={`transition-all duration-360 ease-out ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center group cursor-not-allowed ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="opacity-45 pointer-events-none filter grayscale-[30%]">
        {children}
      </div>

      <div className="absolute inset-0 bg-meridian-surface-sunken/40 backdrop-blur-[0.5px] rounded border border-meridian-border-strong/50 flex items-center justify-center gap-1.5 px-2 py-1 transition-opacity">
        <Lock className="w-4 h-4 text-meridian-accent" />
        <span className="text-xs font-semibold text-meridian-text-secondary tracking-tight">
          Locked
        </span>
        {fallbackAction && <div className="pointer-events-auto ml-1">{fallbackAction}</div>}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-3 py-1.5 text-xs text-white bg-meridian-text-primary rounded-md shadow-sh-2 whitespace-nowrap pointer-events-none animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-meridian-accent" />
            <span>{requirement}</span>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-meridian-text-primary" />
        </div>
      )}
    </div>
  );
};
