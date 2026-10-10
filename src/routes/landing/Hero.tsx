import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { Button } from '../../components/ui/Button';
import { PartResolver } from './PartResolver';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100svh] bg-dark-bg text-dark-text flex items-center justify-center overflow-hidden pt-24 pb-16 px-4 sm:px-8">
      {/* Drifting Topographic Contour SVG (PRD Section 4.7 & 7.2) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07] animate-contour-drift"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M -100 200 C 300 120, 600 320, 1000 180 S 1600 240, 1600 240"
          fill="none"
          stroke="#EDEAE3"
          strokeWidth="1.2"
        />
        <path
          d="M -100 380 C 250 280, 750 480, 1100 320 S 1600 420, 1600 420"
          fill="none"
          stroke="#EDEAE3"
          strokeWidth="1.2"
        />
        <path
          d="M -100 560 C 400 440, 700 680, 1200 500 S 1600 600, 1600 600"
          fill="none"
          stroke="#B4713B"
          strokeWidth="1.5"
        />
        <path
          d="M -100 740 C 200 660, 650 820, 1050 700 S 1600 780, 1600 780"
          fill="none"
          stroke="#EDEAE3"
          strokeWidth="1.2"
        />
      </svg>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Copy & Headings */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>Spare Parts Intelligence for Mining Traders</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-[68px] leading-[1.04] tracking-tight font-normal text-dark-text">
            Every part number you've ever quoted, remembered.
          </h1>

          <p className="text-base sm:text-lg text-dark-muted font-normal max-w-xl leading-relaxed">
            One searchable commercial memory for every OEM reference, supplier origin cost and customer quote. Built for traders who operate across Peru, Zambia, currencies and catalogues.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              variant="accent"
              size="lg"
              onClick={() => navigate('/app')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open the live demo
            </Button>
            <a
              href="#proposal"
              className="inline-flex items-center justify-center font-medium px-5 py-2.5 rounded-md text-sm text-dark-muted hover:text-dark-text border border-white/10 hover:border-white/20 transition-colors"
            >
              See the proposal & phases
            </a>
          </div>

          {/* Proof Strip */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-6 text-xs text-dark-muted font-mono">
            <span>• Multi-OEM Cross-Mapping</span>
            <span>• Landed Cost Ladder</span>
            <span>• Zero Excel Hunting</span>
          </div>
        </div>

        {/* Right Column: Live Part-Number Resolver */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <PartResolver />
        </div>
      </div>

      {/* Scroll Cue (PRD Spec 7.2) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none opacity-60">
        <span className="text-[10px] font-mono tracking-widest uppercase text-dark-muted">
          Scroll
        </span>
        <div className="w-[1px] h-6 bg-white/20 relative overflow-hidden">
          <div className="w-full h-1/2 bg-accent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
