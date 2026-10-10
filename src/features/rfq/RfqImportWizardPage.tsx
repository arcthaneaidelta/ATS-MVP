import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sliders,
  DollarSign,
  Download,
  Mail,
  FileCheck,
  ChevronDown,
  Building,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SEED_SAMPLE_RFQ_LINES } from '../../mock/db';
import { RfqLineItem, Quotation } from '../../mock/types';
import { Button } from '../../components/ui/Button';
import { Badge, StatusBadge, FreshnessDot, PartNumber } from '../../components/ui/Badge';
import { DocumentPreview } from '../../components/domain/DocumentPreview';
import { Modal } from '../../components/ui/Modal';
import { formatMoney, formatPercent, formatDate } from '../../lib/format';
import clsx from 'clsx';

export function RfqImportWizardPage() {
  const { parts, addQuotation, addToast, currentEntity } = useStore();
  const navigate = useNavigate();

  // Wizard Step: 1 = Upload, 2 = Match, 3 = Price, 4 = Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // File Upload state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  // RFQ Lines state
  const [rfqLines, setRfqLines] = useState<RfqLineItem[]>(SEED_SAMPLE_RFQ_LINES);
  const [resolvedCount, setResolvedCount] = useState(0);

  // Progressive matching simulation flag
  const [isProgressiveMatching, setIsProgressiveMatching] = useState(false);

  // Active exception resolver popover for a line
  const [resolvingLineId, setResolvingLineId] = useState<string | null>(null);

  // Step 3 Pricing Target Margin
  const [globalMargin, setGlobalMargin] = useState(24.6);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'PEN' | 'ZMW'>('USD');
  const [selectedIncoterm, setSelectedIncoterm] = useState('DDP');
  const [expandedSupplierLineId, setExpandedSupplierLineId] = useState<string | null>(null);

  // Step 4 Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuoteRef, setGeneratedQuoteRef] = useState<string | null>(null);
  const [isSendEmailModalOpen, setIsSendEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('compras@minera-andaluz.pe');

  // Progressive row resolution effect when entering Step 2
  const startProgressiveMatching = () => {
    setIsProgressiveMatching(true);
    setResolvedCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count += 3;
      if (count >= rfqLines.length) {
        setResolvedCount(rfqLines.length);
        setIsProgressiveMatching(false);
        clearInterval(interval);
      } else {
        setResolvedCount(count);
      }
    }, 60);
  };

  const handleUseSampleRfq = () => {
    setUploadedFileName('Minera_Andaluz_RFQ_October2026_42Lines.xlsx');
    setIsReadingFile(true);
    setTimeout(() => {
      setIsReadingFile(false);
      setCurrentStep(2);
      startProgressiveMatching();
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFileName(files[0].name);
      setIsReadingFile(true);
      setTimeout(() => {
        setIsReadingFile(false);
        setCurrentStep(2);
        startProgressiveMatching();
      }, 600);
    }
  };

  // Exception Resolver selection
  const handleResolveException = (lineId: string, chosenPartId: string) => {
    const chosenPart = parts.find((p) => p.id === chosenPartId);
    if (!chosenPart) return;

    setRfqLines((prev) =>
      prev.map((line) => {
        if (line.id !== lineId) return line;
        return {
          ...line,
          status: 'matched',
          matchedPartId: chosenPart.id,
          suggestedSupplierCost: chosenPart.lastSupplierCost,
          latestCustomerPrice: chosenPart.lastQuotedPrice,
          latestCustomerQuoteRef: chosenPart.lastQuotedRef,
          unitPrice: Number((chosenPart.lastSupplierCost / (1 - globalMargin / 100)).toFixed(1)),
        };
      })
    );
    setResolvingLineId(null);
    addToast(`Line matched to ${chosenPart.id} (${chosenPart.description})`, 'success');
  };

  // Apply Global Target Margin
  const handleApplyGlobalMargin = () => {
    setRfqLines((prev) =>
      prev.map((line) => {
        const cost = line.suggestedSupplierCost || 50;
        const newUnitPrice = Number((cost / (1 - globalMargin / 100)).toFixed(1));
        return {
          ...line,
          targetMargin: globalMargin,
          unitPrice: newUnitPrice,
        };
      })
    );
    addToast(`Target margin of ${globalMargin}% applied to all ${rfqLines.length} lines`, 'info');
  };

  // Line Margin Change
  const handleLineMarginChange = (lineId: string, marginVal: number) => {
    setRfqLines((prev) =>
      prev.map((line) => {
        if (line.id !== lineId) return line;
        const cost = line.suggestedSupplierCost || 50;
        const newUnitPrice = Number((cost / (1 - marginVal / 100)).toFixed(1));
        return {
          ...line,
          targetMargin: marginVal,
          unitPrice: newUnitPrice,
        };
      })
    );
  };

  // Totals calculations
  const totalSubtotal = rfqLines.reduce(
    (acc, l) => acc + (l.unitPrice || 0) * (l.qty || 1),
    0
  );
  const totalCost = rfqLines.reduce(
    (acc, l) => acc + (l.suggestedSupplierCost || 0) * (l.qty || 1),
    0
  );
  const effectiveMargin =
    totalSubtotal > 0 ? ((totalSubtotal - totalCost) / totalSubtotal) * 100 : 24.6;

  // Step 4 Generate quotation
  const handleGenerateQuote = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newRef = `QT-PE-0237`;
      setGeneratedQuoteRef(newRef);

      const newQuote: Quotation = {
        id: newRef,
        rfqRef: 'RFQ-PE-0231',
        customer: 'Minera Andaluz S.A.C.',
        entityId: currentEntity === 'consolidated' ? 'peru' : currentEntity,
        date: '2026-10-10',
        validityDate: '2026-11-10',
        currency: selectedCurrency,
        incoterm: selectedIncoterm as any,
        paymentTerms: '30 days net from commercial invoice',
        status: 'Sent',
        lines: rfqLines.map((l) => ({
          partId: l.matchedPartId || 'STR-000412',
          description: l.rawDescription,
          oemRef: l.rawPartNumber,
          qty: l.qty,
          supplierCost: l.suggestedSupplierCost,
          unitPrice: l.unitPrice,
          marginPercent: l.targetMargin,
        })),
        subtotal: totalSubtotal,
        total: totalSubtotal,
        estimatedMargin: Number(effectiveMargin.toFixed(1)),
        version: 1,
      };

      addQuotation(newQuote);
    }, 1200);
  };

  // Summary counts for Step 2
  const matchedCount = rfqLines.filter((l) => l.status === 'matched').length;
  const alternateCount = rfqLines.filter((l) => l.status === 'matched_alternate').length;
  const reviewCount = rfqLines.filter((l) => l.status === 'multiple_candidates').length;
  const notFoundCount = rfqLines.filter((l) => l.status === 'not_found').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 4-Step Progress Rail */}
      <div className="p-4 bg-surface border border-border rounded-md">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Upload Excel RFQ' },
            { step: 2, title: 'Part Number Matching' },
            { step: 3, title: 'Pricing & Suppliers' },
            { step: 4, title: 'Review & Quotation' },
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <div key={item.step} className="flex-1 flex items-center">
                <div className="flex items-center gap-2.5">
                  <span
                    className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors',
                      isCompleted
                        ? 'bg-success text-white'
                        : isActive
                        ? 'bg-primary text-white ring-4 ring-primary-tint'
                        : 'bg-surface-sunken text-ink-500 border border-border'
                    )}
                  >
                    {isCompleted ? '✓' : item.step}
                  </span>
                  <span
                    className={clsx(
                      'text-xs font-medium hidden sm:inline',
                      isActive ? 'text-ink-900 font-bold' : 'text-ink-500'
                    )}
                  >
                    {item.title}
                  </span>
                </div>
                {item.step < 4 && (
                  <div
                    className={clsx(
                      'flex-1 h-0.5 mx-3 sm:mx-6',
                      isCompleted ? 'bg-success' : 'bg-border'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: UPLOAD */}
      {currentStep === 1 && (
        <div className="p-8 bg-surface border border-border rounded-md text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-lg font-bold text-ink-900">Import Client RFQ Inquiry</h2>
            <p className="text-xs text-ink-500 leading-relaxed">
              Upload customer line items (.xlsx, .csv). Stratum’s multi-OEM engine will cross-reference part numbers against all known manufacturer aliases.
            </p>
          </div>

          {/* Large Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={clsx(
              'max-w-xl mx-auto p-12 rounded-lg border-2 border-dashed transition-all duration-150 flex flex-col items-center justify-center gap-4 cursor-pointer',
              isDragOver
                ? 'border-primary bg-primary-tint/50'
                : 'border-border-strong bg-surface-elevated hover:bg-surface-sunken/40'
            )}
          >
            <div className="w-14 h-14 rounded-full bg-surface-sunken flex items-center justify-center text-ink-500">
              <UploadCloud className="w-7 h-7 text-primary stroke-[1.5]" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink-900">
                Drag and drop your quotation inquiry spreadsheet here
              </p>
              <p className="text-xs text-ink-500 font-mono">
                Supports Microsoft Excel (.xlsx), CSV, Billdu format exports
              </p>
            </div>

            <span className="text-xs text-ink-300 uppercase font-mono tracking-wider">— OR —</span>

            {/* Prominent Sample RFQ CTA (PRD Spec 12.4.1) */}
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleUseSampleRfq}
              isLoading={isReadingFile}
              leftIcon={<FileSpreadsheet className="w-4 h-4 text-primary" />}
            >
              Use Sample RFQ (Minera Andaluz · 42 lines)
            </Button>
          </div>

          <div className="text-[11px] text-ink-500 font-mono flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>Interactive demo · uses deterministic 42-line sample inquiry</span>
          </div>
        </div>
      )}

      {/* STEP 2: PROGRESSIVE MATCHING & EXCEPTION RESOLUTION */}
      {currentStep === 2 && (
        <div className="space-y-4">
          {/* Summary Status Bar */}
          <div className="p-4 bg-surface border border-border rounded-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-ink-900">Matching Intelligence:</span>
              <Badge variant="success" size="sm">
                {matchedCount} Matched
              </Badge>
              <Badge variant="info" size="sm">
                {alternateCount} via Alternate OEM Number
              </Badge>
              {reviewCount > 0 && (
                <Badge variant="warning" size="sm">
                  {reviewCount} Needs Review (Multiple Candidates)
                </Badge>
              )}
              {notFoundCount > 0 && (
                <Badge variant="error" size="sm">
                  {notFoundCount} Not in Master
                </Badge>
              )}
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep(3)}
              disabled={isProgressiveMatching}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Continue to Pricing (Step 3)
            </Button>
          </div>

          {/* Progressive Resolution Table */}
          <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[520px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10 bg-surface-sunken">
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-700 font-semibold">
                    <th className="py-2.5 px-3 w-12">#</th>
                    <th className="py-2.5 px-3">Inquiry Part Number</th>
                    <th className="py-2.5 px-3">Description on RFQ</th>
                    <th className="py-2.5 px-3 text-center w-14">Qty</th>
                    <th className="py-2.5 px-3">Matching Status</th>
                    <th className="py-2.5 px-3">Resolved Canonical Part</th>
                    <th className="py-2.5 px-3 text-right w-24">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rfqLines.map((line, idx) => {
                    const isVisible = idx < resolvedCount || !isProgressiveMatching;
                    const isResolving = resolvingLineId === line.id;

                    if (!isVisible) {
                      return (
                        <tr key={line.id} className="skeleton-shimmer h-10">
                          <td colSpan={7} />
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={line.id}
                        className={clsx(
                          'hover:bg-surface-sunken/40 transition-colors',
                          line.status === 'multiple_candidates' && 'bg-warning-tint/30',
                          line.status === 'not_found' && 'bg-error-tint/20'
                        )}
                      >
                        <td className="py-2.5 px-3 font-mono text-ink-500 text-[11px]">
                          {line.lineIndex}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-ink-900">
                          {line.rawPartNumber}
                        </td>
                        <td className="py-2.5 px-3 text-ink-700">{line.rawDescription}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-medium text-ink-900">
                          {line.qty}
                        </td>
                        <td className="py-2.5 px-3">
                          {line.status === 'matched' && (
                            <Badge variant="success" size="sm">
                              Direct Match
                            </Badge>
                          )}
                          {line.status === 'matched_alternate' && (
                            <Badge variant="info" size="sm">
                              Matched via {line.matchedViaOem}
                            </Badge>
                          )}
                          {line.status === 'multiple_candidates' && (
                            <Badge variant="warning" size="sm">
                              Multiple Candidates
                            </Badge>
                          )}
                          {line.status === 'not_found' && (
                            <Badge variant="error" size="sm">
                              Not Found
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {line.matchedPartId ? (
                            <PartNumber value={line.matchedPartId} className="font-bold text-primary" />
                          ) : (
                            <span className="text-ink-300 font-mono text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right relative">
                          {line.status === 'multiple_candidates' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setResolvingLineId(isResolving ? null : line.id)}
                            >
                              Resolve
                            </Button>
                          )}
                          {line.status === 'not_found' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResolveException(line.id, 'STR-000412')}
                            >
                              Add as new
                            </Button>
                          )}

                          {/* Exception Resolver Popover */}
                          {isResolving && (
                            <div className="absolute right-0 top-full mt-1 z-30 w-72 bg-surface-elevated rounded-sm border border-border shadow-lg p-3 text-left">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-500 block mb-1.5">
                                Select Matching Canonical Part
                              </span>
                              <div className="space-y-1.5">
                                {(line.candidatePartIds || ['STR-000688', 'STR-000610']).map(
                                  (candId) => {
                                    const p = parts.find((item) => item.id === candId);
                                    if (!p) return null;
                                    return (
                                      <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleResolveException(line.id, p.id)}
                                        className="w-full text-left p-2 rounded-xs border border-border bg-surface hover:bg-primary-tint/60 transition-colors text-xs"
                                      >
                                        <div className="flex items-center justify-between font-mono font-bold text-ink-900">
                                          <span>{p.id}</span>
                                          <span className="text-[10.5px] text-ink-500">
                                            Last: USD {p.lastQuotedPrice}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-ink-700 truncate mt-0.5">
                                          {p.description}
                                        </p>
                                      </button>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: PRICING & SUPPLIER COMPARISON */}
      {currentStep === 3 && (
        <div className="space-y-4">
          {/* Target Margin Slider Bar */}
          <div className="p-4 bg-surface border border-border rounded-md flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Sliders className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="font-semibold text-ink-900 block">Target Margin Rule</span>
                <span className="text-[11px] text-ink-500">
                  Global baseline calculated over best available supplier quotation.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="12"
                  max="45"
                  step="0.5"
                  value={globalMargin}
                  onChange={(e) => setGlobalMargin(parseFloat(e.target.value))}
                  className="w-32 accent-primary"
                />
                <span className="font-mono font-bold text-ink-900 w-14">
                  {globalMargin.toFixed(1)}%
                </span>
              </div>

              <Button variant="secondary" size="sm" onClick={handleApplyGlobalMargin}>
                Apply to all lines
              </Button>
            </div>
          </div>

          {/* Pricing Lines Table */}
          <div className="bg-surface rounded-md border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10 bg-surface-sunken">
                  <tr className="border-b border-border text-[11px] uppercase tracking-wider text-ink-700 font-semibold">
                    <th className="py-2.5 px-3">Part ID / Description</th>
                    <th className="py-2.5 px-3 text-center w-12">Qty</th>
                    <th className="py-2.5 px-3">Best Supplier Cost</th>
                    <th className="py-2.5 px-3">Last Quoted Customer</th>
                    <th className="py-2.5 px-3 w-28">Margin %</th>
                    <th className="py-2.5 px-3 text-right w-28">Unit Price</th>
                    <th className="py-2.5 px-3 text-right w-32">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rfqLines.map((line) => {
                    const isBelowMinimum = (line.targetMargin || 24.6) < 12;
                    const lineTotal = (line.unitPrice || 0) * line.qty;

                    return (
                      <tr
                        key={line.id}
                        className={clsx(
                          'hover:bg-surface-sunken/40 transition-colors',
                          isBelowMinimum && 'bg-warning-tint/30'
                        )}
                      >
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-primary block">
                            {line.matchedPartId || 'STR-000412'}
                          </span>
                          <span className="text-ink-700 text-[11px]">{line.rawDescription}</span>
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-medium text-ink-900">
                          {line.qty}
                        </td>

                        {/* Supplier cell with expand trigger */}
                        <td
                          className="py-2.5 px-3 cursor-pointer hover:bg-surface-sunken rounded-xs"
                          onClick={() =>
                            setExpandedSupplierLineId(
                              expandedSupplierLineId === line.id ? null : line.id
                            )
                          }
                          title="Click to view 3-supplier quote comparison"
                        >
                          <div className="flex items-center gap-1.5 font-mono">
                            <FreshnessDot dateStr={line.suggestedSupplierValidity} />
                            <span className="font-semibold text-ink-900">
                              {formatMoney(line.suggestedSupplierCost, 'USD', true)}
                            </span>
                            <ChevronDown className="w-3 h-3 text-ink-300 ml-1" />
                          </div>
                          <span className="text-[10px] text-ink-500 block truncate">
                            {line.suggestedSupplierName}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 font-mono text-[11px] text-ink-700">
                          <span className="font-medium text-ink-900">
                            {formatMoney(line.latestCustomerPrice, 'USD', true)}
                          </span>
                          <span className="text-[10px] text-ink-500 block">
                            {line.latestCustomerQuoteRef}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 font-mono">
                          <input
                            type="number"
                            min="5"
                            max="60"
                            step="0.5"
                            value={line.targetMargin || 24.6}
                            onChange={(e) =>
                              handleLineMarginChange(line.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-16 px-1.5 py-1 text-xs border border-border-strong rounded-xs bg-surface-elevated font-mono focus:outline-none focus:border-primary text-center"
                          />
                          <span className="text-ink-500 ml-1">%</span>
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-900">
                          {formatMoney(line.unitPrice, 'USD', true)}
                        </td>

                        <td className="py-2.5 px-3 text-right font-mono font-bold text-ink-900">
                          {formatMoney(lineTotal, 'USD', true)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky Totals Bar */}
          <div className="p-4 bg-surface-elevated border border-border rounded-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-ink-500 block text-[10.5px]">Total Invoiced:</span>
                <span className="text-base font-bold text-primary">
                  {formatMoney(totalSubtotal, selectedCurrency, true)}
                </span>
              </div>
              <div className="border-l border-border pl-4">
                <span className="text-ink-500 block text-[10.5px]">Effective Margin:</span>
                <span className="text-base font-bold text-accent">
                  {formatPercent(effectiveMargin)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStep(4)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Review & Generate Quotation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & LIVE A4 PREVIEW */}
      {currentStep === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Checklist Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 bg-surface border border-border rounded-md space-y-3 text-xs">
              <h3 className="font-semibold text-ink-900 uppercase tracking-wider text-[11px]">
                Pre-Issuance Commercial Checklist
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>All 42 line items matched to canonical parts</span>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Supplier margins within policy ({formatPercent(effectiveMargin)})</span>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Banking block confirmed for Peru S.A.C.</span>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>Standard 30-day price validity applied</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                {!generatedQuoteRef ? (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={handleGenerateQuote}
                    isLoading={isGenerating}
                    leftIcon={<FileCheck className="w-4 h-4" />}
                  >
                    Generate Official Quotation
                  </Button>
                ) : (
                  <div className="p-3 bg-success-tint/60 border border-success/40 rounded-sm space-y-2">
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Quotation {generatedQuoteRef} Generated!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addToast(`Downloaded ${generatedQuoteRef}.pdf`, 'success')}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsSendEmailModalOpen(true)}
                        leftIcon={<Mail className="w-3.5 h-3.5" />}
                      >
                        Email
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-ink-500"
                  onClick={() => setCurrentStep(3)}
                >
                  Back to pricing adjustment
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Styled A4 Quotation Preview (PRD Spec 12.4.1) */}
          <div className="lg:col-span-8">
            <DocumentPreview
              type="Quotation"
              reference={generatedQuoteRef || 'DRAFT-QT-2026-0237'}
              entityId={currentEntity === 'consolidated' ? 'peru' : currentEntity}
              counterparty="Minera Andaluz S.A.C."
              date="2026-10-10"
              validityOrDueDate="2026-11-10"
              currency={selectedCurrency}
              incoterm="DDP (Delivered Duty Paid - Mina Andaluz)"
              paymentTerms="30 days net from commercial invoice"
              lines={rfqLines.slice(0, 10).map((l, idx) => ({
                itemNumber: idx + 1,
                partId: l.matchedPartId || 'STR-000412',
                description: l.rawDescription,
                oemRef: l.rawPartNumber,
                qty: l.qty,
                unitPrice: l.unitPrice,
                totalPrice: (l.unitPrice || 0) * l.qty,
              }))}
              subtotal={totalSubtotal}
              total={totalSubtotal}
              notes="Includes delivery to central warehouse Mina Andaluz. Prices guaranteed for 30 calendar days."
            />
          </div>
        </div>
      )}

      {/* Email Compose Modal */}
      <Modal
        isOpen={isSendEmailModalOpen}
        onClose={() => setIsSendEmailModalOpen(false)}
        title="Send Quotation to Minera Andaluz"
        description="Attach generated PDF quotation and send via commercial mailer."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-ink-700 block mb-1">To Email</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full p-2 border border-border-strong rounded-xs font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-ink-700 block mb-1">Subject</label>
            <input
              type="text"
              readOnly
              value={`Stratum Quotation ${generatedQuoteRef} · Minera Andaluz Tender`}
              className="w-full p-2 border border-border rounded-xs bg-surface-sunken font-mono text-ink-700"
            />
          </div>
          <div>
            <label className="font-semibold text-ink-700 block mb-1">Attachment</label>
            <div className="p-2 bg-surface-sunken border border-border rounded-xs font-mono flex items-center justify-between text-[11px]">
              <span>{generatedQuoteRef}_MineraAndaluz.pdf</span>
              <span className="text-ink-500">242 KB</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSendEmailModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                addToast(`Quotation emailed to ${recipientEmail} (Simulated)`, 'success');
                setIsSendEmailModalOpen(false);
              }}
              leftIcon={<Mail className="w-3.5 h-3.5" />}
            >
              Send quotation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
