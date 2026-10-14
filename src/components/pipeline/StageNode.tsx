import React from 'react';
import type { PipelineStageInfo, StageId } from '../../types';
import { CheckCircle2, XCircle, Clock, Minus, Calendar, Bot, Video, FileText, Sparkles, Workflow } from 'lucide-react';

interface StageNodeProps {
  stage: PipelineStageInfo;
  isCurrentFailed?: boolean;
  isAnimatedPassed?: boolean;
  isActiveStep?: boolean;
  onClick?: () => void;
}

export const getStageIcon = (id: StageId) => {
  switch (id) {
    case 'calendar':
      return Calendar;
    case 'bot_scheduled':
      return Bot;
    case 'bot_recording':
      return Video;
    case 'transcript':
      return FileText;
    case 'llm_extraction':
      return Sparkles;
    case 'crm_update':
      return Workflow;
    default:
      return Clock;
  }
};

export const getStageChecklist = (id: StageId): string => {
  switch (id) {
    case 'calendar':
      return 'Check: Event status (confirmed vs tentative), recurring instance ID expansion, timezone shifts.';
    case 'bot_scheduled':
      return 'Check: Recall.ai API response, valid Zoom/Meet join credentials, OAuth refresh token status.';
    case 'bot_recording':
      return 'Check: Waiting room timeout (600s vs 1200s), host admission latency, audio stream fidelity.';
    case 'transcript':
      return 'Check: Webhook delivery HTTP status, payload size, timeout retry logic, idempotency key.';
    case 'llm_extraction':
      return 'Check: Contextual polarity, customer commitment verification, few-shot negative prompts.';
    case 'crm_update':
      return 'Check: Monday.com column ID schema stability, GraphQL mutation retries, rate limits.';
  }
};

export const StageNode: React.FC<StageNodeProps> = ({
  stage,
  isCurrentFailed = false,
  isAnimatedPassed = false,
  isActiveStep = false,
  onClick
}) => {
  const Icon = getStageIcon(stage.id);

  // Status visual rules
  const isFailed = stage.status === 'failed' || isCurrentFailed;
  const isPassed = stage.status === 'passed' && isAnimatedPassed;

  const circleStyles = isFailed
    ? 'bg-[#F5DEDA] border-2 border-[#A8433A] text-[#A8433A] shadow-[0_0_0_4px_rgba(168,67,58,0.15)] animate-pulse'
    : isPassed
    ? 'bg-[#E1EEE6] border-2 border-[#3F7D5B] text-[#3F7D5B]'
    : 'bg-[#FBF9F6] border-2 border-[#CFC8BB] text-[#7B8786] opacity-60';

  const StatusIcon = isFailed ? XCircle : isPassed ? CheckCircle2 : stage.status === 'skipped' ? Minus : Clock;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center group cursor-pointer text-center relative max-w-[140px] transition-transform duration-150 ${
        isActiveStep ? 'scale-105' : 'hover:-translate-y-0.5'
      }`}
      title={getStageChecklist(stage.id)}
    >
      {/* Node circle */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${circleStyles}`}
      >
        <Icon className="w-5 h-5" />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
          <StatusIcon
            className={`w-4 h-4 ${
              isFailed ? 'text-[#A8433A]' : isPassed ? 'text-[#3F7D5B]' : 'text-[#7B8786]'
            }`}
          />
        </div>
      </div>

      {/* Label & Subtitle */}
      <div className="mt-2.5">
        <span className="text-[10px] font-mono font-semibold text-[#7B8786] block">
          STAGE 0{stage.stepNumber}
        </span>
        <h4 className="text-xs font-semibold text-[#1E2A2B] leading-snug mt-0.5">
          {stage.name}
        </h4>
        <p className="text-[11px] text-[#4A5757] line-clamp-1 mt-0.5">
          {stage.subtitle}
        </p>
      </div>

      {/* Tooltip hint on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none absolute -top-10 bg-[#1E2A2B] text-[#F6F3EE] text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-30">
        Click to view evidence
      </div>
    </div>
  );
};
