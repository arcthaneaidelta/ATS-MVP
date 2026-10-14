import React, { useState } from 'react';
import type { SignalItem } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, ChevronDown, ChevronUp, Workflow } from 'lucide-react';

interface SignalCardProps {
  signal: SignalItem;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  isSelected = false,
  onSelect
}) => {
  const [expanded, setExpanded] = useState(false);

  const typeBadges = {
    risk: { bg: 'bg-[#F3E3D8]', text: 'text-[#B4643C]', label: 'Risk Signal' },
    blocker: { bg: 'bg-[#F5DEDA]', text: 'text-[#A8433A]', label: 'Blocker' },
    delay: { bg: 'bg-[#F4EAD0]', text: 'text-[#B58A2B]', label: 'Timeline Delay' },
    milestone: { bg: 'bg-[#DEE9F1]', text: 'text-[#3E6A8A]', label: 'Milestone Update' },
    action_item: { bg: 'bg-[#E3EDEB]', text: 'text-[#1F4B4A]', label: 'Action Item' },
    customer_signal: { bg: 'bg-[#E1EEE6]', text: 'text-[#3F7D5B]', label: 'Customer Signal' }
  }[signal.type];

  const verdictBadge = {
    correct: { bg: 'bg-[#E1EEE6]', text: 'text-[#3F7D5B]', icon: CheckCircle2, label: 'True Positive (Correct)' },
    false_positive: { bg: 'bg-[#F5DEDA]', text: 'text-[#A8433A]', icon: AlertTriangle, label: 'False Positive (Noise)' },
    missed: { bg: 'bg-[#F4EAD0]', text: 'text-[#B58A2B]', icon: AlertCircle, label: 'Missed by Model' }
  }[signal.verdict];

  const VerdictIcon = verdictBadge.icon;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-[12px] border transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'bg-[#FFFFFF] border-[#1F4B4A] shadow-[0_4px_16px_rgba(30,42,43,0.08)] ring-2 ring-[#1F4B4A]/10'
          : 'bg-[#FBF9F6] border-[#E2DDD3] hover:border-[#CFC8BB] hover:bg-[#FFFFFF]'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${typeBadges.bg} ${typeBadges.text}`}
        >
          {typeBadges.label}
        </span>
        <span
          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${verdictBadge.bg} ${verdictBadge.text}`}
        >
          <VerdictIcon className="w-3 h-3" />
          <span>{verdictBadge.label}</span>
        </span>
      </div>

      {/* Quote */}
      <div className="my-2 p-2.5 rounded bg-[#F6F3EE] border-l-2 border-[#1F4B4A] text-xs italic text-[#1E2A2B]">
        "{signal.quote}"
      </div>

      {/* Confidence Bar */}
      <div className="my-2.5">
        <div className="flex items-center justify-between text-[11px] text-[#7B8786] mb-1 font-mono">
          <span>Confidence Score</span>
          <span className="font-semibold text-[#1E2A2B]">{Math.round(signal.confidence * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#E2DDD3] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              signal.confidence > 0.85
                ? 'bg-[#3F7D5B]'
                : signal.confidence > 0.65
                ? 'bg-[#B58A2B]'
                : 'bg-[#A8433A]'
            }`}
            style={{ width: `${Math.round(signal.confidence * 100)}%` }}
          />
        </div>
      </div>

      {/* Mapped Field in Monday.com */}
      <div className="flex items-center gap-1.5 text-xs text-[#1F4B4A] font-mono bg-[#E3EDEB] p-2 rounded border border-[#CFC8BB] mb-2">
        <Workflow className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{signal.fieldMapped}</span>
      </div>

      {/* Collapsible Reason */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        className="w-full flex items-center justify-between text-[11px] text-[#7B8786] hover:text-[#1E2A2B] pt-1 border-t border-[#E2DDD3]/60 cursor-pointer"
      >
        <span>Diagnostic Reasoning</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div className="mt-2 text-xs text-[#4A5757] bg-[#F6F3EE] p-2.5 rounded border border-[#E2DDD3] leading-relaxed">
          {signal.reasoning}
        </div>
      )}
    </div>
  );
};
