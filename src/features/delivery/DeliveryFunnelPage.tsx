import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FUNNEL_STAGES, FUNNEL_SUMMARY } from '../../data/funnel';
import { useDemoStore } from '../../store/useDemoStore';
import { ChevronDown, ChevronUp, ArrowRight, ShieldAlert } from 'lucide-react';

export const DeliveryFunnelPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedMeetingId } = useDemoStore();
  const [expandedStageIndex, setExpandedStageIndex] = useState<number | null>(1); // Default expand the bot join drop

  const maxCount = 60;

  const handleOpenMeeting = (id: string) => {
    setSelectedMeetingId(id);
    navigate('/app/trace');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold">
            Delivery Reconciliation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B] mt-0.5">
            End-to-End Delivery Funnel
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            Verifying that recorded calls consistently reach the downstream workflow. Click any funnel drop-off to inspect where calls leak.
          </p>
        </div>
      </div>

      {/* Hero Callout Card: "Recorded ≠ Delivered" */}
      <div className="rounded-[16px] bg-[#F3E3D8] border border-[#E6C7B6] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-10 h-10 rounded-full bg-[#B4643C] text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B4643C] font-bold">
              Core Diagnostic Finding
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1E2A2B] mt-0.5">
              {FUNNEL_SUMMARY.headline}
            </h2>
            <p className="text-xs sm:text-sm text-[#4A5757] mt-1.5 leading-relaxed">
              {FUNNEL_SUMMARY.subtext}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 shrink-0">
          <div className="p-3 bg-white/70 rounded-lg border border-[#E6C7B6] text-center">
            <span className="text-[10px] uppercase font-mono text-[#7B8786] block">Downstream Loss</span>
            <span className="font-serif text-2xl font-bold text-[#A8433A]">
              {FUNNEL_SUMMARY.silentLossCount} Calls
            </span>
            <span className="text-[11px] text-[#4A5757] block mt-0.5">20% of recorded audio</span>
          </div>
        </div>
      </div>

      {/* 6-Step Funnel Visual */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-5">
        <div className="pb-3 border-b border-[#E2DDD3] flex items-center justify-between text-xs">
          <span className="font-semibold text-[#1E2A2B] uppercase tracking-wider text-[11px]">
            Handoff Stages (Last 14 Days · 60 Meetings)
          </span>
          <span className="text-[#7B8786] font-mono text-[11px]">
            Eligible → Scheduled → Joined → Transcribed → Analyzed → Pushed
          </span>
        </div>

        <div className="space-y-4">
          {FUNNEL_STAGES.map((stage, idx) => {
            const widthPercent = Math.max(15, (stage.count / maxCount) * 100);
            const isExpanded = expandedStageIndex === idx;
            const hasDrop = stage.dropCount > 0;

            return (
              <div
                key={stage.stageId}
                className={`p-4 rounded-[12px] border transition-all duration-150 ${
                  isExpanded ? 'bg-[#FBF9F6] border-[#1F4B4A] shadow-sm' : 'bg-[#FFFFFF] border-[#E2DDD3]'
                }`}
              >
                {/* Stage Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-semibold text-[#1E2A2B]">
                      {stage.name}
                    </span>
                    <span className="text-[11px] text-[#7B8786] font-mono">({stage.system})</span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="font-bold text-sm text-[#1F4B4A]">{stage.count} calls</span>
                    {hasDrop && (
                      <span className="text-[#A8433A] bg-[#F5DEDA] px-2 py-0.5 rounded font-semibold text-[11px]">
                        −{stage.dropCount} dropped ({stage.dropPercent}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Horizontal Bar */}
                <div className="relative h-6 bg-[#E2DDD3]/50 rounded-full overflow-hidden my-2 flex items-center">
                  <div
                    className={`h-full rounded-full transition-all duration-500 flex items-center px-3 ${
                      idx === 5 ? 'bg-[#3F7D5B]' : 'bg-[#1F4B4A]'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-[11px] font-mono text-white font-medium select-none">
                      {stage.count} / {maxCount}
                    </span>
                  </div>
                </div>

                {/* Drop explanation toggle */}
                {hasDrop && (
                  <button
                    onClick={() => setExpandedStageIndex(isExpanded ? null : idx)}
                    className="mt-2 text-xs text-[#B4643C] hover:text-[#1E2A2B] font-medium flex items-center gap-1 cursor-pointer select-none"
                  >
                    <span>{isExpanded ? 'Hide root cause analysis' : 'Inspect drop-off root causes'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Expandable Evidence Accordion */}
                {isExpanded && hasDrop && (
                  <div className="mt-3 pt-3 border-t border-[#E2DDD3] space-y-3 animate-in fade-in duration-200">
                    <div className="p-3 bg-[#F6F3EE] rounded-lg border border-[#E2DDD3] text-xs text-[#1E2A2B] leading-relaxed">
                      <strong className="text-[#B4643C] block mb-1">Diagnosed Leak Explanation:</strong>
                      {stage.dropExplanation}
                    </div>

                    {stage.affectedMeetingIds.length > 0 && (
                      <div>
                        <span className="text-[11px] font-mono uppercase text-[#7B8786] block mb-1.5">
                          Affected Sample Meetings in Forensic Log:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {stage.affectedMeetingIds.map((id) => (
                            <button
                              key={id}
                              onClick={() => handleOpenMeeting(id)}
                              className="px-2.5 py-1 rounded bg-[#E3EDEB] hover:bg-[#1F4B4A] hover:text-white border border-[#C4DAD7] text-xs font-mono font-medium text-[#1F4B4A] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>{id}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
