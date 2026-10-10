import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

interface ResolverTarget {
  inputNumber: string;
  partId: string;
  description: string;
  chips: Array<{ oem: string; number: string }>;
  lastQuotedPrice: number;
  lastSupplierCost: number;
  timesSold: number;
  lastQuoteDate: string;
  isAmbiguous?: boolean;
}

const RESOLVER_TARGETS: ResolverTarget[] = [
  {
    inputNumber: 'SDV-4471-023',
    partId: 'STR-000412',
    description: 'Rock drill shank adapter T38, 635mm (COP 1838 / HLX5)',
    chips: [
      { oem: 'Sandvik', number: 'SDV-4471-023' },
      { oem: 'Epiroc', number: 'EP-3380-6350' },
      { oem: 'RESEMIN', number: 'RS-T38-635' },
    ],
    lastQuotedPrice: 136,
    lastSupplierCost: 88.5,
    timesSold: 148,
    lastQuoteDate: '14 Aug 2026',
  },
  {
    inputNumber: 'KM-HS-2210-8',
    partId: 'STR-000501',
    description: 'Hydraulic hose assy 1" 2SN, 1,850mm, female JIC',
    chips: [
      { oem: 'Komatsu', number: 'KM-HS-2210-8' },
      { oem: 'Caterpillar', number: 'CT-5H-1850' },
      { oem: 'Aftermarket', number: 'AM-HH-1850' },
    ],
    lastQuotedPrice: 94,
    lastSupplierCost: 62.0,
    timesSold: 86,
    lastQuoteDate: '28 Aug 2026',
  },
  {
    inputNumber: 'EP-3392-0450',
    partId: 'STR-000413',
    description: 'Button bit 45mm, 7-button, ballistic carbide R32',
    chips: [
      { oem: 'Epiroc', number: 'EP-3392-0450' },
      { oem: 'Sandvik', number: 'SDV-4520-045B' },
      { oem: 'RESEMIN', number: 'RS-BB-45-7B' },
    ],
    lastQuotedPrice: 62.5,
    lastSupplierCost: 41.2,
    timesSold: 320,
    lastQuoteDate: '02 Sep 2026',
  },
  {
    inputNumber: 'BR-0932-A',
    partId: 'STR-000688',
    description: 'Bucket tooth adapter, 55mm pin (2 Close Candidates)',
    chips: [
      { oem: 'Komatsu', number: 'KM-GA-0932-A' },
      { oem: 'Caterpillar', number: 'CT-4T-3552' },
    ],
    lastQuotedPrice: 228,
    lastSupplierCost: 148.0,
    timesSold: 72,
    lastQuoteDate: '30 Aug 2026',
    isAmbiguous: true,
  },
];

export function PartResolver() {
  const [targetIndex, setTargetIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isResolved, setIsResolved] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const currentTarget = RESOLVER_TARGETS[targetIndex];

  // Auto-typing animation cycle
  useEffect(() => {
    if (isManual) return;

    let charIndex = 0;
    const targetStr = currentTarget.inputNumber;
    setTypedText('');
    setIsResolved(false);

    // Type character by character at 55ms/char (PRD Spec 7.2)
    const typeInterval = setInterval(() => {
      charIndex++;
      setTypedText(targetStr.slice(0, charIndex));

      if (charIndex >= targetStr.length) {
        clearInterval(typeInterval);
        setIsResolved(true);

        // Hold display for 5s then advance to next target
        const cycleTimeout = setTimeout(() => {
          setTargetIndex((prev) => (prev + 1) % RESOLVER_TARGETS.length);
        }, 5000);

        return () => clearTimeout(cycleTimeout);
      }
    }, 55);

    return () => clearInterval(typeInterval);
  }, [targetIndex, isManual]);

  const handleManualSelect = (index: number) => {
    setIsManual(true);
    setTargetIndex(index);
    setTypedText(RESOLVER_TARGETS[index].inputNumber);
    setIsResolved(true);

    // Resume auto-cycle after 8s idle (PRD Spec 7.2)
    setTimeout(() => {
      setIsManual(false);
    }, 8000);
  };

  return (
    <div className="w-full max-w-[520px] space-y-3">
      {/* Resolver Card Panel */}
      <div className="bg-dark-surface rounded-lg border border-white/10 p-5 shadow-lg relative overflow-hidden backdrop-blur-none">
        {/* Glow-free subtle header line */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-dark-muted">
              Live OEM Part Resolver
            </span>
          </div>
          <span className="text-[10px] font-mono text-dark-muted">
            Auto-Indexing
          </span>
        </div>

        {/* Input Well Simulation */}
        <div className="relative mb-4">
          <div className="flex items-center bg-dark-bg/80 border border-white/15 rounded-sm px-3.5 py-2.5 font-mono text-sm text-dark-text">
            <Search className="w-4 h-4 text-accent mr-2.5 shrink-0" />
            <span className="tracking-wide">{typedText}</span>
            <span className="inline-block w-2 h-4 bg-accent ml-0.5 animate-pulse" />
          </div>
        </div>

        {/* Resolved Canonical Part Result */}
        <AnimatePresence mode="wait">
          {isResolved && (
            <motion.div
              key={currentTarget.partId + targetIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Canonical Record Header */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-accent font-mono tracking-wider">
                    {currentTarget.isAmbiguous ? 'Fuzzy Match (2 Candidates)' : 'Canonical Part Record'}
                  </span>
                  <span className="text-xs font-mono font-bold text-dark-text">
                    {currentTarget.partId}
                  </span>
                </div>
                <p className="text-xs font-medium text-dark-text leading-snug">
                  {currentTarget.description}
                </p>
              </div>

              {/* Resolved Reference Chips flying in */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-dark-muted block mb-1.5 font-mono">
                  Cross-OEM Number Mappings (All resolve here):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentTarget.chips.map((chip, idx) => (
                    <motion.div
                      key={chip.number}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.08 }}
                      className="px-2.5 py-1 rounded-xs bg-dark-bg border border-white/15 text-[11px] font-mono text-dark-text flex items-center gap-1.5"
                    >
                      <span className="text-accent font-semibold">{chip.oem}</span>
                      <span>{chip.number}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Commercial Memory 4-Stat Strip (Counting up once) */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-dark-bg/60 rounded-xs border border-white/5">
                  <span className="text-[9.5px] uppercase text-dark-muted block">Last Quoted</span>
                  <span className="text-xs font-bold text-accent">
                    ${currentTarget.lastQuotedPrice}
                  </span>
                </div>
                <div className="p-2 bg-dark-bg/60 rounded-xs border border-white/5">
                  <span className="text-[9.5px] uppercase text-dark-muted block">Supplier Cost</span>
                  <span className="text-xs font-bold text-dark-text">
                    ${currentTarget.lastSupplierCost}
                  </span>
                </div>
                <div className="p-2 bg-dark-bg/60 rounded-xs border border-white/5">
                  <span className="text-[9.5px] uppercase text-dark-muted block">Times Sold</span>
                  <span className="text-xs font-bold text-dark-text">
                    {currentTarget.timesSold}
                  </span>
                </div>
                <div className="p-2 bg-dark-bg/60 rounded-xs border border-white/5">
                  <span className="text-[9.5px] uppercase text-dark-muted block">Last Quote Date</span>
                  <span className="text-[10px] font-medium text-dark-muted truncate block">
                    {currentTarget.lastQuoteDate}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestion Chips Below Card (PRD Spec 7.2) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10.5px] text-dark-muted font-mono mr-1">Click to test:</span>
        {RESOLVER_TARGETS.map((t, idx) => (
          <button
            key={t.inputNumber}
            type="button"
            onClick={() => handleManualSelect(idx)}
            className={clsx(
              'px-2.5 py-1 rounded-xs border text-[11px] font-mono transition-colors',
              targetIndex === idx && isResolved
                ? 'bg-accent text-white border-accent font-semibold'
                : 'bg-dark-surface/80 border-white/10 text-dark-muted hover:text-dark-text hover:border-white/20'
            )}
          >
            {t.inputNumber}
          </button>
        ))}
      </div>
    </div>
  );
}
