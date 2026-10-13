import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneFrame({ children, className = '' }: PhoneFrameProps) {
  return (
    <div className={`phone select-none ${className}`}>
      {/* Outer Phone Shell */}
      <div className="phone-screen flex flex-col">
        {/* Dynamic Island */}
        <div className="phone-island" aria-hidden="true" />

        {/* Status Bar */}
        <div className="h-11 px-7 pt-2 flex items-center justify-between text-ink text-xs font-semibold z-20 pointer-events-none select-none">
          <span className="tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5 opacity-85">
            <span className="text-[10px] tracking-tighter">5G</span>
            <Wifi size={13} strokeWidth={2.2} />
            <Battery size={15} strokeWidth={2.2} />
          </div>
        </div>

        {/* Live Screen Content */}
        <div className="flex-1 flex flex-col relative overflow-hidden">{children}</div>

        {/* Home Indicator */}
        <div className="phone-home" aria-hidden="true" />
      </div>
    </div>
  );
}
