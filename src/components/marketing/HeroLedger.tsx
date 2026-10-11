import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/format';

export const HeroLedger: React.FC = () => {
  const [filledDots, setFilledDots] = useState<number>(34);
  const [pot, setPot] = useState<number>(1150);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [drawCaption, setDrawCaption] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to pause loop when scrolled out of view
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

  // Main tick loop
  useEffect(() => {
    if (!isVisible || document.visibilityState === 'hidden') return;

    let timer = 0;
    const interval = setInterval(() => {
      timer += 1;

      // Every 2.5s: new entry joins
      if (timer % 3 === 0 && !isDrawing) {
        setFilledDots((prev) => {
          if (prev >= 48) return prev;
          setPot((p) => p + 25);
          return prev + 1;
        });
      }

      // Every 14s: trigger mini draw loop
      if (timer % 14 === 0 && !isDrawing) {
        setIsDrawing(true);
        const chosenWinner = Math.floor(Math.random() * 36) + 1;
        setWinnerIndex(chosenWinner);

        setDrawCaption('Request 0x7a8e…91 dispatched to VRF...');

        setTimeout(() => {
          setDrawCaption('Randomness proof verified on Base L2...');
        }, 1800);

        setTimeout(() => {
          setDrawCaption(`Winner selected: Participant #${chosenWinner}`);
        }, 3600);

        // Reset after 6s
        setTimeout(() => {
          setIsDrawing(false);
          setWinnerIndex(null);
          setDrawCaption('');
          setFilledDots(28);
          setPot(1125);
        }, 6000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, isDrawing]);

  // Total 48 dots
  const totalDots = 48;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg mx-auto bg-[#FBF9F5] border border-[#DDD8CD] rounded-lg p-6 sm:p-7 shadow-[0_1px_2px_rgba(27,36,32,0.05)] text-left select-none"
      aria-label="Illustration of a live pool ledger"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CD]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3E7D5A] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1B2420]">
            Weekly Pool · $25 Entry
          </span>
        </div>
        <span className="text-xs font-mono text-[#7C867F] tabular-nums">
          Closes in 02:14:09
        </span>
      </div>

      {/* Pot and Participant Counter */}
      <div className="flex items-baseline justify-between my-5">
        <div>
          <span className="text-xs text-[#7C867F] block uppercase tracking-wider font-semibold">
            Current Pot
          </span>
          <span className="text-3xl font-display font-medium text-[#1B2420] tabular-nums tracking-tight">
            {formatCurrency(pot)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#7C867F] block uppercase tracking-wider font-semibold">
            Entries Sealed
          </span>
          <span className="text-sm font-mono text-[#2C4A3E] font-semibold tabular-nums">
            {filledDots} / {totalDots}
          </span>
        </div>
      </div>

      {/* The 48 Dots Calm Grid */}
      <div className="grid grid-cols-8 gap-3 my-4 p-4 bg-[#EDE9E1]/50 border border-[#DDD8CD]/60 rounded-md">
        {Array.from({ length: totalDots }).map((_, index) => {
          const isFilled = index < filledDots;
          const isWinner = winnerIndex === index + 1;
          const isDimmed = isDrawing && !isWinner;

          return (
            <div key={index} className="flex items-center justify-center relative">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-300 relative flex items-center justify-center ${
                  isFilled
                    ? 'bg-[#2C4A3E]'
                    : 'border border-[#C7C1B3] bg-[#FBF9F5]'
                } ${isDimmed ? 'opacity-30' : 'opacity-100'} ${
                  isWinner ? 'scale-125 z-10' : ''
                }`}
              >
                {/* Brass ring when selected as winner */}
                {isWinner && (
                  <div className="absolute -inset-1.5 rounded-full border-2 border-[#B08A4E] animate-ping" />
                )}
                {isWinner && (
                  <div className="absolute -inset-1 rounded-full border border-[#B08A4E]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Status / Caption */}
      <div className="h-8 flex items-center justify-between text-xs text-[#4A5650] pt-2">
        {isDrawing ? (
          <div className="flex items-center gap-2 font-mono text-[#B08A4E] animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B08A4E] animate-pulse" />
            <span className="truncate">{drawCaption}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[#7C867F]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2C4A3E]" />
            <span>Chainlink VRF listener active</span>
          </div>
        )}

        <span className="text-[11px] font-mono text-[#7C867F]">Base L2</span>
      </div>

      {/* Subtle Bottom Strip */}
      <div className="mt-4 pt-3 border-t border-[#DDD8CD]/70 flex items-center justify-between text-xs text-[#2C4A3E]">
        <span className="font-medium">Draw runs automatically at countdown end</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
