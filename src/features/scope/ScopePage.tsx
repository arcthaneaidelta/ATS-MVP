import React, { useState } from 'react';
import { FINDINGS_DATA } from '../../data/findings';
import { useDemoStore } from '../../store/useDemoStore';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { SeverityChip } from '../../components/ui/Badge';
import {
  CheckSquare,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Check
} from 'lucide-react';

export const ScopePage: React.FC = () => {
  const {
    includedFindingIds,
    toggleFindingInScope,
    isScopeApproved,
    approveScope,
    resetScope,
    addToast
  } = useDemoStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Compute total effort hours range based on selected findings
  const selectedFindings = FINDINGS_DATA.filter((f) => includedFindingIds.includes(f.id));

  // Extract min and max hours from strings like "4-6 hrs"
  let minHours = 0;
  let maxHours = 0;
  selectedFindings.forEach((f) => {
    const parts = f.effortHoursEstimate.replace(' hrs', '').split('-');
    if (parts.length === 2) {
      minHours += parseInt(parts[0], 10) || 0;
      maxHours += parseInt(parts[1], 10) || 0;
    }
  });

  const handleApprove = () => {
    approveScope();
    setConfirmModalOpen(false);
    addToast({
      type: 'success',
      title: 'Fix Scope Formally Approved',
      message: `${selectedFindings.length} targeted fixes locked. Milestone 2 implementation unlocked.`
    });
  };

  const timelineSteps = [
    { num: '1', title: 'Diagnosis & Audit', duration: '3–4 days', desc: 'Code audit, log correlation & written findings report', status: 'completed' },
    { num: '2', title: 'Scope Agreement Gate', duration: '1 day', desc: 'You review findings and approve the exact fix list', status: isScopeApproved ? 'completed' : 'current' },
    { num: '3', title: 'Targeted Fixes', duration: `${Math.ceil(minHours / 6)}–${Math.ceil(maxHours / 6)} days`, desc: 'Surgical implementation of approved items', status: isScopeApproved ? 'current' : 'pending' },
    { num: '4', title: 'Verification & Handoff', duration: '1–2 days', desc: 'Synthetic tests, runbook handoff & alerting rules', status: 'pending' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold">
            Founder Control Gate
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B] mt-0.5">
            Scope Gate & Milestone Plan
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            No runaway scope. Implementation begins only after you approve which root causes to fix. Choose your targeted scope below.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isScopeApproved ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E1EEE6] border border-[#C8E1D2] text-xs font-semibold text-[#3F7D5B]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Scope Approved (Simulated)</span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={() => setConfirmModalOpen(true)}
              disabled={selectedFindings.length === 0}
              leftIcon={<CheckSquare className="w-4 h-4" />}
            >
              Approve Scope ({selectedFindings.length} Items)
            </Button>
          )}
        </div>
      </div>

      {/* 4-Step Milestone Progression Timeline */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786] block mb-4">
          Milestone Progression Architecture
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {timelineSteps.map((step) => {
            const isDone = step.status === 'completed';
            const isCurr = step.status === 'current';

            return (
              <div
                key={step.num}
                className={`p-4 rounded-[12px] border transition-all ${
                  isCurr
                    ? 'bg-[#E3EDEB] border-[#1F4B4A] shadow-sm ring-1 ring-[#1F4B4A]/10'
                    : isDone
                    ? 'bg-[#FBF9F6] border-[#C8E1D2]'
                    : 'bg-[#FBF9F6] border-[#E2DDD3] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      isDone
                        ? 'bg-[#3F7D5B] text-white'
                        : isCurr
                        ? 'bg-[#1F4B4A] text-white'
                        : 'bg-[#E2DDD3] text-[#7B8786]'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#1F4B4A]">
                    {step.duration}
                  </span>
                </div>
                <h3 className="font-serif text-sm font-semibold text-[#1E2A2B]">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[#4A5757] mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scope Computation Summary & Gate Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (8 Cols): Selectable Fixes */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
                Targeted Fix Selection
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
                Check fixes to include in implementation
              </h3>
            </div>
            <Button variant="ghost" size="sm" onClick={resetScope} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset to Defaults
            </Button>
          </div>

          <div className="space-y-3">
            {FINDINGS_DATA.map((finding) => {
              const isSelected = includedFindingIds.includes(finding.id);
              return (
                <div
                  key={finding.id}
                  onClick={() => toggleFindingInScope(finding.id)}
                  className={`p-4 rounded-[12px] border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#1F4B4A] shadow-sm'
                      : 'bg-[#FBF9F6] border-[#E2DDD3] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-[5px] border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#1F4B4A] border-[#1F4B4A] text-white'
                        : 'border-[#CFC8BB] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1F4B4A]">{finding.id}</span>
                      <SeverityChip severity={finding.severity} />
                      <span className="text-[11px] font-mono text-[#7B8786]">Stage: {finding.stageTag}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-semibold text-[#1E2A2B]">
                      {finding.title}
                    </h4>

                    <p className="text-xs text-[#4A5757]">
                      {finding.smallestFixSummary}
                    </p>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs">
                    <span className="font-bold text-[#1F4B4A]">{finding.effortHoursEstimate}</span>
                    <span className="text-[10px] text-[#7B8786] block">({finding.effort})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (4 Cols): Estimate Calculator & Founder Control Card */}
        <div className="lg:col-span-4 space-y-5">
          {/* Estimate summary card */}
          <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
            <div className="pb-3 border-b border-[#E2DDD3]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
                Scope Estimate Calculation
              </span>
              <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
                Milestone 2 Budgeting
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3]">
                <span className="text-[#7B8786]">Selected Fixes:</span>
                <span className="font-bold font-mono text-sm text-[#1E2A2B]">
                  {selectedFindings.length} of {FINDINGS_DATA.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3]">
                <span className="text-[#7B8786]">Cumulative Effort:</span>
                <span className="font-bold font-mono text-base text-[#1F4B4A]">
                  {minHours}–{maxHours} hours
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3]">
                <span className="text-[#7B8786]">Implementation Window:</span>
                <span className="font-bold font-mono text-xs text-[#1E2A2B]">
                  {Math.ceil(minHours / 6)}–{Math.ceil(maxHours / 6)} business days
                </span>
              </div>

              <div className="p-3 bg-[#E3EDEB] rounded-lg border border-[#C4DAD7] text-xs text-[#1F4B4A]">
                <span className="font-semibold block mb-0.5">Rate / Milestone Agreement:</span>
                <span>Billable at agreed milestone fee [YOUR_RATE / Fixed Scope]. Zero unexpected hours without prior change order.</span>
              </div>
            </div>

            {isScopeApproved ? (
              <div className="p-3 bg-[#E1EEE6] rounded-lg border border-[#C8E1D2] text-xs text-[#3F7D5B] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Scope locked. Changes synced with Handoff Runbook.</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => setConfirmModalOpen(true)}
                disabled={selectedFindings.length === 0}
                className="w-full"
                leftIcon={<CheckSquare className="w-4 h-4" />}
              >
                Approve Agreed Scope
              </Button>
            )}
          </div>

          {/* Founder Control Policy */}
          <div className="bg-[#F3E3D8] border border-[#E6C7B6] rounded-[16px] p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#B4643C]">
              <ShieldCheck className="w-4 h-4" />
              <h4 className="font-serif font-semibold text-sm">
                The Non-Rebuild Guarantee
              </h4>
            </div>
            <p className="text-[#1E2A2B] leading-relaxed">
              Every item in this list is designed as a minimal, surgical fix with verified low regression risk. No new platforms or rewriting the SaaS stack.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Approve Diagnostic Fix Scope"
        subtitle={`Confirming ${selectedFindings.length} selected items for Milestone 2 implementation`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApprove}>
              Confirm & Lock Scope
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#4A5757] leading-relaxed">
            By approving this scope, you authorize the targeted implementation of the following {selectedFindings.length} surgical fixes:
          </p>

          <ul className="space-y-2 max-h-48 overflow-y-auto divide-y divide-[#E2DDD3]">
            {selectedFindings.map((f) => (
              <li key={f.id} className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#1F4B4A] mr-1.5">{f.id}</span>
                  <span className="text-[#1E2A2B] font-medium">{f.title}</span>
                </div>
                <span className="font-mono text-[11px] text-[#7B8786]">{f.effortHoursEstimate}</span>
              </li>
            ))}
          </ul>

          <div className="p-3 bg-[#E3EDEB] rounded-lg text-xs text-[#1F4B4A]">
            Total estimate: <strong>{minHours}–{maxHours} hours</strong>. Implementation will begin with synthetic test cases before production release.
          </div>
        </div>
      </Modal>
    </div>
  );
};
