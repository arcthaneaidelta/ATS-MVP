import { useEffect } from 'react';
import {
  Database,
  FileSpreadsheet,
  HardDrive,
  FileText,
  Lock,
  GitMerge,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge, PartNumber } from '../../components/ui/Badge';
import { formatNumber } from '../../lib/format';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export function MigrationPage() {
  const {
    duplicatePairs,
    driveRelinks,
    mergeDuplicatePair,
    migrationState,
    runSampleMigration,
  } = useStore();

  const pendingDuplicates = duplicatePairs.filter((p) => p.status === 'pending');

  // Keyboard shortcut for review queue: M (Merge), K (Keep separate), A (Add alternative)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pendingDuplicates.length === 0) return;
      const topPair = pendingDuplicates[0];
      if (e.key === 'm' || e.key === 'M') {
        mergeDuplicatePair(topPair.id, 'merge');
      } else if (e.key === 'k' || e.key === 'K') {
        mergeDuplicatePair(topPair.id, 'keep_separate');
      } else if (e.key === 'a' || e.key === 'A') {
        mergeDuplicatePair(topPair.id, 'alternative_added');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingDuplicates, mergeDuplicatePair]);

  const sources = [
    {
      name: 'Legacy Excel Spreadsheets',
      records: '18,420 rows',
      status: 'Scanned & Parsed',
      icon: FileSpreadsheet,
      date: '08 Oct 2026',
    },
    {
      name: 'Zoho Creator / CRM Invoices',
      records: '3,112 invoices',
      status: 'Imported',
      icon: Database,
      date: '09 Oct 2026',
    },
    {
      name: 'Billdu Billing Export',
      records: '1,420 entries',
      status: 'Needs Review',
      icon: FileText,
      date: '07 Oct 2026',
    },
    {
      name: 'Google Drive PDF Storage',
      records: '2,940 files',
      status: 'Relinked',
      icon: HardDrive,
      date: '10 Oct 2026',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink-900">
            Migration Console & Deduplication Engine
          </h1>
          <p className="text-xs text-ink-500 mt-1">
            Reconciles historical spreadsheets, Zoho, Billdu, and Drive files into one deduplicated relational parts master.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={runSampleMigration}
          isLoading={migrationState.isRunning}
          leftIcon={<Play className="w-3.5 h-3.5" />}
        >
          Run sample import scan
        </Button>
      </div>

      {/* 4 Source Cards Grid (PRD Spec 12.8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((src) => {
          const Icon = src.icon;
          return (
            <div key={src.name} className="p-4 bg-surface border border-border rounded-md shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-primary stroke-[1.5]" />
                <Badge variant={src.status === 'Needs Review' ? 'warning' : 'success'} size="sm">
                  {src.status}
                </Badge>
              </div>
              <div>
                <span className="font-semibold text-xs text-ink-900 block">{src.name}</span>
                <span className="text-base font-bold font-mono text-ink-900">{src.records}</span>
              </div>
              <span className="text-[10px] text-ink-500 font-mono block">Scanned {src.date}</span>
            </div>
          );
        })}
      </div>

      {/* 5-Step Pipeline Tracker & Live Simulation */}
      <div className="p-5 bg-surface border border-border rounded-md space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
              Data Quality Pipeline Architecture
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">
              Five-stage normalization to eliminate duplicate parts under varied OEM numbers.
            </p>
          </div>
          <Badge variant="primary" size="md">
            Accuracy: {migrationState.validated}%
          </Badge>
        </div>

        {/* Pipeline Steps Rail */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          {[
            { step: '1. Inventory', desc: 'Scan raw tables', count: `${migrationState.inventory} rows` },
            { step: '2. Normalize', desc: 'Clean OEM dashes/spaces', count: `${migrationState.normalized} items` },
            { step: '3. Match & Dedupe', desc: 'Cluster cross-OEM refs', count: `${migrationState.deduped} parts` },
            { step: '4. Relink Docs', desc: 'Match Drive PDFs', count: `${migrationState.relinked} files` },
            { step: '5. Validate', desc: 'Audit verified refs', count: `${migrationState.validated}% match` },
          ].map((item, idx) => (
            <div
              key={item.step}
              className={clsx(
                'p-3 rounded-sm border transition-colors',
                idx <= 3 ? 'bg-primary-tint/40 border-primary/30' : 'bg-surface-sunken border-border'
              )}
            >
              <div className="flex items-center justify-between font-semibold text-ink-900 mb-1">
                <span>{item.step}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-[11px] text-ink-500">{item.desc}</p>
              <span className="font-mono font-bold text-ink-900 text-[11px] mt-2 block">
                {item.count}
              </span>
            </div>
          ))}
        </div>

        {migrationState.lastSummary && (
          <div className="p-3 bg-surface-sunken rounded-xs border border-border text-xs font-mono text-ink-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <span>{migrationState.lastSummary}</span>
          </div>
        )}
      </div>

      {/* Duplicate Review Queue (Card Pair UI - PRD Spec 12.8) */}
      <div className="p-5 bg-surface border border-border rounded-md space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-900">
                Fuzzy Duplicate Resolution Queue
              </h3>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              Review bilingual candidates and cross-brand matches with diffs highlighted.
            </p>
          </div>
          <span className="text-xs font-mono text-ink-500">
            {pendingDuplicates.length} pairs requiring human verification
          </span>
        </div>

        {pendingDuplicates.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {pendingDuplicates.map((pair) => (
                <motion.div
                  key={pair.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.24 }}
                  className="p-4 bg-surface-elevated border border-border rounded-md space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-accent">
                        Match Confidence: {pair.confidence}%
                      </span>
                      <Badge variant="accent" size="sm">
                        Bilingual Candidate
                      </Badge>
                    </div>

                    {/* Keyboard shortcuts hints */}
                    <div className="hidden sm:flex items-center gap-2 text-[10px] text-ink-500 font-mono">
                      <span>Shortcut keys:</span>
                      <kbd className="px-1.5 py-0.5 bg-surface-sunken border border-border rounded-xs">M</kbd> Merge
                      <kbd className="px-1.5 py-0.5 bg-surface-sunken border border-border rounded-xs">K</kbd> Keep
                      <kbd className="px-1.5 py-0.5 bg-surface-sunken border border-border rounded-xs">A</kbd> Alternative
                    </div>
                  </div>

                  {/* Side-by-side Candidate Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-surface border border-border rounded-xs space-y-1">
                      <span className="text-[10px] text-ink-500 font-mono block">Primary Part A (English Master)</span>
                      <PartNumber value={pair.partA.id} className="font-bold text-primary" />
                      <p className="text-xs font-medium text-ink-900">{pair.partA.description}</p>
                      <span className="text-[11px] font-mono text-ink-500 block">
                        OEM Ref: {pair.partA.oemRef}
                      </span>
                    </div>

                    <div className="p-3 bg-surface border border-border rounded-xs space-y-1">
                      <span className="text-[10px] text-ink-500 font-mono block">Candidate Part B (Spanish/Legacy)</span>
                      <PartNumber value={pair.partB.id} className="font-bold text-ink-700" />
                      <p className="text-xs font-medium text-ink-900">{pair.partB.description}</p>
                      <span className="text-[11px] font-mono text-ink-500 block">
                        OEM Ref: {pair.partB.oemRef}
                      </span>
                    </div>
                  </div>

                  {/* Differences Callout */}
                  <div className="p-2.5 bg-surface-sunken rounded-xs text-[11px] text-ink-700 flex items-center justify-between">
                    <span>
                      <strong>Differences Detected:</strong> {pair.differences.join(' · ')}
                    </span>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => mergeDuplicatePair(pair.id, 'keep_separate')}
                      >
                        Keep Separate
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => mergeDuplicatePair(pair.id, 'alternative_added')}
                      >
                        Add as Alternative
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => mergeDuplicatePair(pair.id, 'merge')}
                        leftIcon={<GitMerge className="w-3.5 h-3.5" />}
                      >
                        Merge Records
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-ink-500 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
            <h4 className="font-bold text-ink-900 text-sm">All duplicate candidates reviewed!</h4>
            <p>Every imported record is cleanly mapped to a single canonical part.</p>
          </div>
        )}
      </div>

      {/* Document Relinking Table with "Original Preserved" lock (PRD Spec 12.8) */}
      <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
        <div className="p-3.5 border-b border-border bg-surface-sunken flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-ink-700 text-[11px]">
            Google Drive Invoices Relinking & Preservation Log
          </span>
          <span className="text-ink-500 font-mono">Original files immutable in cloud storage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-500">
                <th className="py-2.5 px-3">Drive File Name</th>
                <th className="py-2.5 px-3">Detected Transaction</th>
                <th className="py-2.5 px-3">Canonical Part</th>
                <th className="py-2.5 px-3 text-center">Confidence</th>
                <th className="py-2.5 px-3 text-center">Preservation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {driveRelinks.map((dlink) => (
                <tr key={dlink.id} className="hover:bg-surface-sunken/40">
                  <td className="py-2.5 px-3 font-mono font-medium text-ink-900">
                    {dlink.filename}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">
                    {dlink.detectedInvoiceRef}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-ink-700">
                    <PartNumber value={dlink.detectedPartId} showCopy={false} />
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">
                    <Badge variant="success" size="sm">
                      {dlink.confidence}%
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      title="Original PDF preserved in cloud drive unmodified"
                      className="inline-flex items-center gap-1 text-[11px] text-ink-700 bg-surface-sunken px-2 py-0.5 rounded-xs border border-border"
                    >
                      <Lock className="w-3 h-3 text-primary" />
                      Original Preserved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
