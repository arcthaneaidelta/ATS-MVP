import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface RibbonChip {
  name: string;
  amount: string;
  monthIndex: number;
  yPos: number; // 0 to 100%
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CHIPS: RibbonChip[] = [
  { name: 'iCloud+', amount: '£2.49', monthIndex: 9, yPos: 18 },
  { name: 'Disney+', amount: '£7.99', monthIndex: 9, yPos: 32 },
  { name: 'PureGym', amount: '£24.99', monthIndex: 9, yPos: 46 },
  { name: 'Netflix', amount: '£12.99', monthIndex: 9, yPos: 60 },
  { name: 'Now', amount: '£9.99', monthIndex: 9, yPos: 74 },
  { name: 'Spotify', amount: '£11.99', monthIndex: 10, yPos: 24 },
  { name: 'Adobe', amount: '£9.98', monthIndex: 10, yPos: 40 },
  { name: 'Dropbox', amount: '£9.99', monthIndex: 10, yPos: 56 },
  { name: 'Amazon', amount: '£95', monthIndex: 10, yPos: 70 },
  { name: 'Headspace', amount: '£49.99', monthIndex: 2, yPos: 35 },
  { name: 'Netflix', amount: '£12.99', monthIndex: 8, yPos: 60 },
  { name: 'PureGym', amount: '£21.99', monthIndex: 8, yPos: 46 },
  { name: 'Spotify', amount: '£11.99', monthIndex: 8, yPos: 24 },
  { name: 'Disney+', amount: '£7.99', monthIndex: 8, yPos: 32 },
];

export function YearRibbon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChipIndex, setActiveChipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !isVisible) return;

    const interval = setInterval(() => {
      setActiveChipIndex((prev) => (prev + 1) % CHIPS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [reducedMotion, isVisible]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-45"
      aria-hidden="true"
    >
      {/* 12-Month Grid Columns */}
      <div className="w-full h-full grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 divide-x divide-line/40">
        {MONTHS.map((month, idx) => (
          <div key={month} className="relative h-full flex flex-col justify-between py-6 px-1">
            <span className="text-[10px] font-semibold text-ink-3 uppercase tracking-wider text-center">
              {month}
            </span>
          </div>
        ))}
      </div>

      {/* Floating Chips */}
      {CHIPS.map((chip, idx) => {
        const isActive = activeChipIndex === idx && !reducedMotion;
        // Position within grid
        const colWidthPct = 100 / 12;
        const leftPct = chip.monthIndex * colWidthPct + colWidthPct / 2;

        return (
          <div
            key={idx}
            className={`absolute px-2 py-1 rounded-full text-[10px] font-medium border border-line bg-surface/80 text-ink-2 whitespace-nowrap shadow-1 transition-all duration-slow ${
              isActive ? '-translate-y-2.5 bg-primary-t/90 text-primary border-primary/30 ring-1 ring-primary/20' : ''
            }`}
            style={{
              left: `${leftPct}%`,
              top: `${chip.yPos}%`,
              transform: `translate(-50%, -50%) ${isActive ? 'translateY(-6px)' : ''}`,
            }}
          >
            <span>{chip.name}</span>
            <span className="ml-1 font-semibold text-ink">{chip.amount}</span>
          </div>
        );
      })}
    </div>
  );
}
