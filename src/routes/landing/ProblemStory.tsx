import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, FileText, HardDrive, Database, ArrowDown, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

export function ProblemStory() {
  const [isMerged, setIsMerged] = useState(false);

  return (
    <section id="problem" className="py-24 px-4 sm:px-8 bg-bg border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Sticky Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            The Memory Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 leading-tight">
            Your pricing history lives in four places. Your next quote needs all of it.
          </h2>
          <p className="text-sm text-ink-700 leading-relaxed">
            Years of customer quotations, supplier prices, and export invoices are scattered across Excel, Zoho Creator, Billdu, and Google Drive.
          </p>
          <p className="text-sm text-ink-700 leading-relaxed">
            When a mining buyer sends an RFQ with 80 line items, sales teams hunt manually across four systems. The result is slow turnarounds, forgotten supplier costs, and inconsistent margins.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsMerged(!isMerged)}
              className="text-xs font-mono font-medium text-primary underline hover:text-ink-900"
            >
              {isMerged ? '← Separate fragments view' : '→ Collapse fragments into unified record'}
            </button>
          </div>
        </div>

        {/* Right Column: 4 Messy Source Fragments collapsing into 1 */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-lg space-y-3 relative">
            {/* Fragment 1: Excel Row */}
            <motion.div
              animate={{
                y: isMerged ? 0 : 0,
                rotate: isMerged ? 0 : -1.5,
                opacity: isMerged ? 0.35 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="p-3.5 bg-surface rounded-sm border border-border shadow-xs flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2 text-ink-900">
                <FileSpreadsheet className="w-4 h-4 text-success" />
                <span>RFQ_Andaluz_2024_rev2.xlsx (Row 42)</span>
              </div>
              <span className="text-ink-500 font-bold">$134.00</span>
            </motion.div>

            {/* Fragment 2: Billdu Invoice Line */}
            <motion.div
              animate={{
                y: isMerged ? -12 : 0,
                rotate: isMerged ? 0 : 1.2,
                opacity: isMerged ? 0.35 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="p-3.5 bg-surface rounded-sm border border-border shadow-xs flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2 text-ink-900">
                <FileText className="w-4 h-4 text-secondary" />
                <span>Billdu Invoice #INV-ZM-0187</span>
              </div>
              <span className="text-ink-500 font-bold">$142.00</span>
            </motion.div>

            {/* Fragment 3: Drive PDF Filename */}
            <motion.div
              animate={{
                y: isMerged ? -24 : 0,
                rotate: isMerged ? 0 : -0.8,
                opacity: isMerged ? 0.35 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="p-3.5 bg-surface rounded-sm border border-border shadow-xs flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2 text-ink-900">
                <HardDrive className="w-4 h-4 text-[#3F6B8A]" />
                <span>Drive: Hartmann_Quote_COP1838.pdf</span>
              </div>
              <span className="text-ink-500 font-bold">€88.50 cost</span>
            </motion.div>

            {/* Fragment 4: Zoho CRM Record */}
            <motion.div
              animate={{
                y: isMerged ? -36 : 0,
                rotate: isMerged ? 0 : 2.1,
                opacity: isMerged ? 0.35 : 1,
              }}
              transition={{ duration: 0.4 }}
              className="p-3.5 bg-surface rounded-sm border border-border shadow-xs flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2 text-ink-900">
                <Database className="w-4 h-4 text-accent" />
                <span>Zoho CRM Lead: Minera Andaluz</span>
              </div>
              <span className="text-ink-500 font-bold">Won Oct 2025</span>
            </motion.div>

            {/* Unified Resulting Record */}
            <div className="mt-6 pt-4 border-t-2 border-primary">
              <div className="p-5 bg-surface-elevated rounded-md border-2 border-primary shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase font-mono text-primary flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    One Canonical Part. One Memory.
                  </span>
                  <span className="font-mono font-bold text-xs bg-primary-tint text-primary px-2 py-0.5 rounded-xs">
                    STR-000412
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-ink-900">
                  Rock drill shank adapter T38, 635mm
                </h4>
                <p className="text-xs text-ink-500 leading-relaxed font-mono">
                  3 OEM references · 8 quotes preserved · Best cost $88.50 · Latest customer price $136.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
