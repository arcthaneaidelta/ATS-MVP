import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, CheckCircle2, Clock, ChefHat, ArrowUpRight, GraduationCap } from 'lucide-react';

export const EcosystemScene: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sceneStep, setSceneStep] = useState<number>(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // 14-second choreographed timeline loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runTimeline = () => {
      // Step 0: Initial state - Diner phone ready (0s)
      setSceneStep(0);

      // Step 1: Diner presses pay / order placed (1.5s)
      timeoutId = setTimeout(() => {
        setSceneStep(1);

        // Step 2: Dot travels, arrives as 'New' on Venue board (3.0s)
        timeoutId = setTimeout(() => {
          setSceneStep(2);

          // Step 3: Kitchen moves to 'Preparing' (6.0s)
          timeoutId = setTimeout(() => {
            setSceneStep(3);

            // Step 4: Academy progress ring advances (9.0s)
            timeoutId = setTimeout(() => {
              setSceneStep(4);

              // Step 5: Order marked 'Ready' & dispatched (11.5s)
              timeoutId = setTimeout(() => {
                setSceneStep(5);

                // Restart loop at 14s
                timeoutId = setTimeout(runTimeline, 2500);
              }, 2500);
            }, 3000);
          }, 3000);
        }, 1500);
      }, 1500);
    };

    runTimeline();

    return () => clearTimeout(timeoutId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[560px] h-[480px] sm:h-[520px] mx-auto select-none overflow-hidden rounded-2xl border border-line bg-surface/50 p-4 flex items-center justify-center"
      style={{
        perspective: '1000px',
      }}
    >
      {/* 4% Opacity Topographic Contours Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none text-ink"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M0,100 Q100,50 200,100 T400,100" />
        <path d="M0,180 Q100,120 200,180 T400,180" />
        <path d="M0,260 Q100,210 200,260 T400,260" />
        <path d="M0,340 Q100,300 200,340 T400,340" />
      </svg>

      {/* SVG Connecting Flow Lines & Animated Traveling Clay Dot */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 560 520"
        fill="none"
      >
        <path
          d="M 180 240 C 260 240, 280 180, 340 180"
          stroke="var(--line-2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 340 260 C 340 340, 360 380, 410 380"
          stroke="var(--line-2)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Traveling Dot between phone and venue board */}
        <circle
          cx={
            sceneStep === 1
              ? 260
              : sceneStep >= 2 && sceneStep <= 4
              ? 340
              : 180
          }
          cy={
            sceneStep === 1
              ? 210
              : sceneStep >= 2 && sceneStep <= 4
              ? 180
              : 240
          }
          r="4.5"
          fill="var(--clay)"
          className="transition-all duration-700 ease-out shadow-sm"
        />
      </svg>

      {/* 1. Phone Frame: Diner Customer Tracker (Left) */}
      <div
        onClick={() => navigate('/cirqla/scan/kiln-street?table=12')}
        className="absolute left-4 sm:left-8 top-16 sm:top-20 w-[200px] sm:w-[220px] bg-elevated rounded-2xl border border-line-2 shadow-md p-3 cursor-pointer group hover:border-clay hover:shadow-lg transition-all duration-300 z-20"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-line mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-clay" />
            <span className="text-[10px] font-bold text-ink uppercase tracking-wider font-sans">
              Cirqla Diner
            </span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg text-ink-3">
            Table 12
          </span>
        </div>

        {/* Status state */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-ink">Order #1048</span>
            <span className="font-mono text-[10px] text-ink-3">$34.50</span>
          </div>

          <div className="p-2 rounded-lg bg-bg border border-line space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-ink-2 font-medium">Status</span>
              <span
                className={`font-semibold ${
                  sceneStep >= 5
                    ? 'text-ok'
                    : sceneStep >= 3
                    ? 'text-clay animate-pulse'
                    : 'text-primary'
                }`}
              >
                {sceneStep >= 5
                  ? 'Ready for pickup'
                  : sceneStep >= 3
                  ? 'Preparing in kitchen'
                  : sceneStep >= 2
                  ? 'Order received'
                  : 'Sending order...'}
              </span>
            </div>
            {/* 3-step mini progress bar */}
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden flex">
              <div
                className={`h-full bg-clay transition-all duration-500 ${
                  sceneStep >= 5 ? 'w-full bg-ok' : sceneStep >= 3 ? 'w-2/3' : 'w-1/3'
                }`}
              />
            </div>
          </div>

          <div className="text-[10px] text-ink-3 truncate">
            Slow-Cooked Short Rib + Lemonade
          </div>
        </div>

        {/* Hover chip */}
        <div className="mt-2.5 pt-2 border-t border-line flex items-center justify-between text-[10px] text-clay font-medium group-hover:underline">
          <span>Launch customer app</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>

      {/* 2. Venue Kitchen Board (Right, Higher) */}
      <div
        onClick={() => navigate('/cirqla/venue/orders')}
        className="absolute right-4 sm:right-6 top-8 sm:top-10 w-[240px] sm:w-[270px] bg-elevated rounded-xl border border-line-2 shadow-md p-3.5 cursor-pointer group hover:border-primary hover:shadow-lg transition-all duration-300 z-20"
        style={{
          transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`,
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-line mb-3">
          <div className="flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-ink uppercase tracking-wider font-sans">
              Kitchen Display (Central)
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-ok animate-ping" />
        </div>

        {/* 3 mini columns: New, Prep, Ready */}
        <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] mb-2 font-mono">
          <div className="p-1 rounded bg-bg border border-line">
            <span className="text-ink-3 block">NEW</span>
            <span className="font-bold text-ink">{sceneStep >= 2 && sceneStep < 3 ? '4' : '3'}</span>
          </div>
          <div className="p-1 rounded bg-clay/10 border border-clay/30 text-clay">
            <span className="block">PREP</span>
            <span className="font-bold">{sceneStep >= 3 && sceneStep < 5 ? '3' : '2'}</span>
          </div>
          <div className="p-1 rounded bg-ok/10 border border-ok/30 text-ok">
            <span className="block">READY</span>
            <span className="font-bold">{sceneStep >= 5 ? '3' : '2'}</span>
          </div>
        </div>

        {/* Live Card Highlight */}
        <div
          className={`p-2 rounded-md border text-left transition-all duration-300 ${
            sceneStep >= 2
              ? 'bg-surface border-clay shadow-sm'
              : 'bg-bg border-line opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-mono font-bold text-clay">#1048 · T12</span>
            <span className="font-mono text-[9px] text-ink-3">Just now</span>
          </div>
          <div className="text-[10px] text-ink-2 truncate mt-0.5">Short rib, lemonade</div>
        </div>

        <div className="mt-2 pt-2 border-t border-line flex items-center justify-between text-[10px] text-primary font-medium group-hover:underline">
          <span>Open live board</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>

      {/* 3. Academy LMS Widget (Lower Right) */}
      <div
        onClick={() => navigate('/academy/app')}
        className="absolute right-8 sm:right-12 bottom-6 sm:bottom-8 w-[210px] bg-elevated rounded-xl border border-line-2 shadow-md p-3 cursor-pointer group hover:border-slate hover:shadow-lg transition-all duration-300 z-20"
        style={{
          transform: `translate3d(${mouseOffset.x * 1.2}px, ${mouseOffset.y * 1.2}px, 0)`,
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-line mb-2">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate" />
            <span className="text-[10px] font-bold text-ink uppercase tracking-wider font-sans">
              Academy LMS
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate font-medium">Hira S.</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mini progress ring */}
          <div className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-line">
            <svg className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" stroke="var(--line)" strokeWidth="3" fill="none" />
              <circle
                cx="18"
                cy="18"
                r="14"
                stroke="var(--slate)"
                strokeWidth="3"
                strokeDasharray="88"
                strokeDashoffset={sceneStep >= 4 ? 40 : 48}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute font-mono text-[9px] font-bold text-ink">
              {sceneStep >= 4 ? '54%' : '46%'}
            </span>
          </div>

          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-ink truncate">Restaurant Ops</div>
            <div className="text-[9px] text-ink-3">Module 3 of 4</div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-line flex items-center justify-between text-[10px] text-slate font-medium group-hover:underline">
          <span>Resume lesson</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
