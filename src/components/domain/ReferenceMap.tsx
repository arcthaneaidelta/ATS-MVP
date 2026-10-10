import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OEMReference, VerifiedAlternative } from '../../mock/types';
import { PartNumber, Badge } from '../ui/Badge';
import { Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export interface ReferenceMapProps {
  partId: string;
  partDescription: string;
  oemReferences: OEMReference[];
  verifiedAlternatives?: VerifiedAlternative[];
  onSelectReference?: (refNumber: string) => void;
}

export function ReferenceMap({
  partId,
  partDescription,
  oemReferences,
  verifiedAlternatives = [],
  onSelectReference,
}: ReferenceMapProps) {
  const [activeRef, setActiveRef] = useState<string | null>(null);

  const handleRefClick = (refNum: string) => {
    setActiveRef(refNum);
    onSelectReference?.(refNum);
  };

  return (
    <div className="relative p-5 bg-surface border border-border rounded-md overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-700">
            Multi-OEM Reference Map & Alternatives
          </h4>
        </div>
        <span className="text-[11px] text-ink-500 font-mono">
          {oemReferences.length} OEM references · {verifiedAlternatives.length} verified alternatives
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative">
        {/* Central Core Part Node */}
        <div className="md:col-span-5 flex flex-col items-start p-4 bg-primary-tint/60 border-2 border-primary/40 rounded-md relative z-10 shadow-xs">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-primary mb-1">
            Canonical Master Part
          </span>
          <PartNumber value={partId} className="text-base text-primary font-bold" />
          <p className="text-xs text-ink-700 mt-1.5 font-medium leading-relaxed">
            {partDescription}
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-500 bg-surface px-2 py-1 rounded-xs border border-border">
            <span>One memory for all manufacturers</span>
          </div>
        </div>

        {/* SVG Connector Lines (Animated on mount) */}
        <div className="hidden md:flex md:col-span-1 justify-center items-center">
          <svg className="w-8 h-24 overflow-visible" viewBox="0 0 32 96">
            <motion.path
              d="M 0 48 C 16 48, 16 16, 32 16"
              fill="none"
              stroke="#CFC9BD"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
            <motion.path
              d="M 0 48 L 32 48"
              fill="none"
              stroke="#2E4A42"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <motion.path
              d="M 0 48 C 16 48, 16 80, 32 80"
              fill="none"
              stroke="#CFC9BD"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
          </svg>
        </div>

        {/* OEM References & Alternatives List */}
        <div className="md:col-span-6 space-y-2">
          {oemReferences.map((ref, idx) => {
            const isSelected = activeRef === ref.number;
            return (
              <motion.div
                key={ref.number + idx}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.06 }}
                onClick={() => handleRefClick(ref.number)}
                className={clsx(
                  'p-2.5 rounded-sm border transition-all cursor-pointer flex items-center justify-between text-xs',
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface-elevated hover:bg-surface-sunken border-border'
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'font-semibold px-1.5 py-0.5 rounded-xs text-[10px] uppercase tracking-wider',
                      isSelected ? 'bg-white/20 text-white' : 'bg-surface-sunken text-ink-700'
                    )}
                  >
                    {ref.oem}
                  </span>
                  <span className={clsx('font-mono font-medium', isSelected ? 'text-white' : 'text-ink-900')}>
                    {ref.number}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={clsx(
                      'text-[10.5px]',
                      isSelected ? 'text-white/80' : 'text-ink-500'
                    )}
                  >
                    {ref.type}
                  </span>
                  <ArrowRight className={clsx('w-3 h-3', isSelected ? 'text-white' : 'text-ink-300')} />
                </div>
              </motion.div>
            );
          })}

          {/* Verified Alternatives Callout */}
          {verifiedAlternatives.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-wider block mb-1.5">
                Verified Alternatives
              </span>
              <div className="space-y-1.5">
                {verifiedAlternatives.map((alt) => (
                  <div
                    key={alt.partId}
                    className="flex items-center justify-between p-2 bg-success-tint/40 border border-success/30 rounded-xs text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
                      <span className="font-mono text-ink-900 font-medium">{alt.partNumber}</span>
                      <span className="text-[11px] text-ink-500">({alt.manufacturer})</span>
                    </div>
                    <Badge variant="success" size="sm">
                      {alt.compatibilityScore}% match
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
