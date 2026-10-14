import React, { useState } from 'react';
import { FINDINGS_DATA } from '../../data/findings';
import { useDemoStore } from '../../store/useDemoStore';
import { SeverityChip } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  CheckSquare,
  Copy,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FindingsPage: React.FC = () => {
  const { includedFindingIds, toggleFindingInScope, addToast } = useDemoStore();
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [expandedId, setExpandedId] = useState<string | null>('FIND-01');

  const filteredFindings = FINDINGS_DATA.filter(
    (f) => filterSeverity === 'All' || f.severity === filterSeverity
  );

  const handleCopyMarkdown = () => {
    let md = '# Diagnostic Findings Report — Root Causes & Smallest Fixes\n\n';
    FINDINGS_DATA.forEach((f) => {
      md += `### [${f.severity}] ${f.id}: ${f.title}\n`;
      md += `**Affected Calls**: ${f.affectedCount} meetings | **Stage**: ${f.stageTag} | **Effort**: ${f.effortHoursEstimate} (${f.effort})\n\n`;
      md += `**Root Cause**: ${f.rootCause}\n\n`;
      md += `**Evidence**: ${f.evidence}\n\n`;
      md += `**Smallest Reasonable Fix**: ${f.proposedFix}\n\n`;
      md += `**Risk of Change**: ${f.riskOfChange}\n\n`;
      md += `---\n\n`;
    });

    navigator.clipboard.writeText(md);
    addToast({
      type: 'success',
      title: 'Copied Findings to Clipboard',
      message: 'Markdown summary ready to paste into documentation.'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold">
            Milestone 1 Deliverable
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B] mt-0.5">
            Diagnostic Findings & Smallest Fixes
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            Documented root causes ranked by severity and affected meeting volume. Select which fixes to include in your agreed scope before code execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyMarkdown}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
          >
            Copy as Markdown
          </Button>
          <Link to="/app/scope">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Scope Gate ({includedFindingIds.length} Selected)
            </Button>
          </Link>
        </div>
      </div>

      {/* Severity Filter Bar */}
      <div className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[12px] text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#7B8786] font-mono text-[11px] uppercase">Filter by Severity:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                filterSeverity === sev
                  ? 'bg-[#1F4B4A] text-white font-semibold'
                  : 'bg-[#F6F3EE] text-[#4A5757] hover:bg-[#E2DDD3]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <span className="text-[#7B8786] font-mono text-[11px]">
          Showing {filteredFindings.length} of {FINDINGS_DATA.length} verified issues
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => {
          const isExpanded = expandedId === finding.id;
          const isInScope = includedFindingIds.includes(finding.id);

          return (
            <div
              key={finding.id}
              className={`rounded-[16px] border transition-all duration-150 overflow-hidden ${
                isInScope
                  ? 'bg-[#FFFFFF] border-[#1F4B4A] shadow-[0_4px_16px_rgba(30,42,43,0.06)]'
                  : 'bg-[#FBF9F6] border-[#CFC8BB] opacity-80'
              }`}
            >
              {/* Finding Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#FBF9F6] transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFindingInScope(finding.id);
                    }}
                    className={`w-6 h-6 rounded-[6px] border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${
                      isInScope
                        ? 'bg-[#1F4B4A] border-[#1F4B4A] text-white'
                        : 'border-[#CFC8BB] bg-white hover:border-[#1F4B4A]'
                    }`}
                    title={isInScope ? 'Remove from fix scope' : 'Include in fix scope'}
                  >
                    {isInScope && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1F4B4A] bg-[#E3EDEB] px-2 py-0.2 rounded border border-[#CFC8BB]">
                        {finding.id}
                      </span>
                      <SeverityChip severity={finding.severity} />
                      <span className="text-[11px] font-mono text-[#7B8786] bg-[#F6F3EE] px-2 py-0.2 rounded border border-[#E2DDD3]">
                        Stage: {finding.stageTag}
                      </span>
                      <span className="text-[11px] font-mono text-[#B4643C] font-semibold">
                        Affects {finding.affectedCount} of 12 misses
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-[#1E2A2B]">
                      {finding.title}
                    </h3>

                    <p className="text-xs text-[#4A5757] leading-relaxed">
                      <strong className="text-[#1E2A2B]">Smallest fix:</strong> {finding.smallestFixSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                  <div className="text-right font-mono text-xs">
                    <span className="text-[#7B8786] text-[10px] uppercase block">Effort</span>
                    <span className="font-bold text-[#1F4B4A]">{finding.effortHoursEstimate}</span>
                  </div>

                  <div className="p-1 rounded text-[#7B8786] hover:text-[#1E2A2B]">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Diagnostic Deep-Dive */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-[#E2DDD3] bg-[#FBF9F6] space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                    <div className="p-4 rounded-[12px] bg-white border border-[#E2DDD3] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#B4643C] font-bold block">
                        Diagnostic Evidence & Log Signatures
                      </span>
                      <p className="text-[#4A5757] leading-relaxed">
                        {finding.evidence}
                      </p>
                    </div>

                    <div className="p-4 rounded-[12px] bg-white border border-[#E2DDD3] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8433A] font-bold block">
                        Underlying Architectural Root Cause
                      </span>
                      <p className="text-[#4A5757] leading-relaxed">
                        {finding.rootCause}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-[12px] bg-[#E3EDEB] border border-[#C4DAD7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold block mb-0.5">
                        Proposed Surgical Fix & Impact
                      </span>
                      <p className="text-[#1E2A2B] font-medium leading-relaxed">
                        {finding.proposedFix}
                      </p>
                      <span className="text-[11px] text-[#4A5757] mt-1 block">
                        Risk of regression: <strong className="text-[#3F7D5B]">{finding.riskOfChange}</strong> · No schema rebuild needed
                      </span>
                    </div>

                    <Button
                      variant={isInScope ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => toggleFindingInScope(finding.id)}
                      leftIcon={isInScope ? <Check className="w-3.5 h-3.5 text-[#3F7D5B]" /> : <CheckSquare className="w-3.5 h-3.5" />}
                    >
                      {isInScope ? 'Included in Scope Gate' : 'Add to Agreed Scope'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
