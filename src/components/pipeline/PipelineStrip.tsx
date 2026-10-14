import React, { useEffect, useState } from 'react';
import type { MeetingTrace, StageId } from '../../types';
import { StageNode } from './StageNode';
import { RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface PipelineStripProps {
  trace: MeetingTrace;
  onSelectStage?: (stageId: StageId) => void;
  selectedStageId?: StageId;
}

export const PipelineStrip: React.FC<PipelineStripProps> = ({
  trace,
  onSelectStage,
  selectedStageId
}) => {
  const [animatedStep, setAnimatedStep] = useState<number>(6);
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger step-by-step animation whenever trace changes
  useEffect(() => {
    runTraceAnimation();
  }, [trace.meetingId]);

  const runTraceAnimation = () => {
    setIsAnimating(true);
    setAnimatedStep(0);

    const stepInterval = 280; // per PRD: 280ms each
    const timer1 = setTimeout(() => setAnimatedStep(1), stepInterval * 1);
    const timer2 = setTimeout(() => setAnimatedStep(2), stepInterval * 2);
    const timer3 = setTimeout(() => setAnimatedStep(3), stepInterval * 3);
    const timer4 = setTimeout(() => setAnimatedStep(4), stepInterval * 4);
    const timer5 = setTimeout(() => setAnimatedStep(5), stepInterval * 5);
    const timer6 = setTimeout(() => {
      setAnimatedStep(6);
      setIsAnimating(false);
    }, stepInterval * 6);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
    };
  };

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#E2DDD3] gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#7B8786]">
            Interactive Execution Trace
          </span>
          <h3 className="font-serif text-lg font-medium text-[#1E2A2B]">
            6-Stage Handoff Verification
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={runTraceAnimation}
            isLoading={isAnimating}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Replay Trace
          </Button>
        </div>
      </div>

      {/* Horizontal Nodes & Connectors */}
      <div className="relative flex items-center justify-between overflow-x-auto py-4 px-2 min-w-[700px]">
        {trace.stages.map((stage, idx) => {
          const isPassedStage = stage.status === 'passed' && animatedStep >= stage.stepNumber;
          const isFailedStage = stage.status === 'failed' && animatedStep >= stage.stepNumber;
          const isConnectorActive =
            idx < trace.stages.length - 1 &&
            isPassedStage &&
            animatedStep > stage.stepNumber;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Node */}
              <StageNode
                stage={stage}
                isAnimatedPassed={isPassedStage}
                isCurrentFailed={isFailedStage}
                isActiveStep={selectedStageId === stage.id}
                onClick={() => onSelectStage?.(stage.id)}
              />

              {/* Connecting Line between stages */}
              {idx < trace.stages.length - 1 && (
                <div className="flex-1 mx-2 relative h-1 min-w-[32px] -mt-10">
                  <div className="absolute inset-0 bg-[#E2DDD3] rounded-full" />
                  <div
                    className={`absolute inset-0 transition-all duration-300 rounded-full ${
                      isConnectorActive ? 'bg-[#1F4B4A]' : 'bg-transparent'
                    }`}
                  />
                  {/* Dashed line if subsequent stage is skipped */}
                  {stage.status === 'failed' && (
                    <div className="absolute inset-0 border-t-2 border-dashed border-[#CFC8BB]" />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
