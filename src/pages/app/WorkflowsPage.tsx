import React, { useState, useEffect } from 'react';
import { workflows } from '../../data/workflows';
import { Workflow, WorkflowNode } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import {
  Workflow as WorkflowIcon,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Zap,
  Mail,
  MessageSquare,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const WorkflowsPage: React.FC = () => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-90day-nurture');
  const [activeWorkflowList, setActiveWorkflowList] = useState<Workflow[]>(workflows);

  // Time Scrubber state for 90-Day Nurture (WOW #2)
  const [scrubDay, setScrubDay] = useState<number>(21);
  const [isPlayingScrubber, setIsPlayingScrubber] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const currentWorkflow =
    activeWorkflowList.find((w) => w.id === selectedWorkflowId) || activeWorkflowList[0];

  // Auto-play scrubber animation (1 day every 120ms per PRD §10.6)
  useEffect(() => {
    let interval: any;
    if (isPlayingScrubber) {
      interval = setInterval(() => {
        setScrubDay((prev) => {
          if (prev >= 90) {
            setIsPlayingScrubber(false);
            return 90;
          }
          return prev + 1;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isPlayingScrubber]);

  const toggleWorkflowStatus = (id: string) => {
    setActiveWorkflowList((prev) =>
      prev.map((wf) => (wf.id === id ? { ...wf, active: !wf.active } : wf))
    );
  };

  // Extract day number from timing tag e.g. "Day 21"
  const getDayNumber = (timing?: string) => {
    if (!timing) return 0;
    const match = timing.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Buyer timeline items received up to current scrubDay
  const buyerTimeline = currentWorkflow.nodes
    .filter((node) => {
      if (currentWorkflow.id !== 'wf-90day-nurture') return true;
      const day = getDayNumber(node.timing);
      return day <= scrubDay;
    })
    .map((node) => ({
      timing: node.timing || 'Day 0',
      title: node.title,
      type: node.type,
      details: node.details,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Automation Workflows & Nurture Engine
            </h1>
            <Badge variant="clay">12 Builder Workflows</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Pre-built sequences handling speed-to-lead, 90-day buyer education, tour confirmations, and closing reviews.
          </p>
        </div>

        {/* Workflow Active Toggle */}
        <div className="flex items-center gap-2 bg-[#FBF9F4] p-2 rounded-[10px] border border-[#DDD6C8] text-xs">
          <span className="font-medium text-[#1F2A27]">
            {currentWorkflow.active ? 'Status: Active in GHL' : 'Status: Paused'}
          </span>
          <button
            onClick={() => toggleWorkflowStatus(currentWorkflow.id)}
            className={`px-2.5 py-1 rounded font-semibold text-xs transition-colors ${
              currentWorkflow.active
                ? 'bg-[#E3EEE4] text-[#4C7A57]'
                : 'bg-[#F3DEDA] text-[#A5473B]'
            }`}
          >
            {currentWorkflow.active ? 'Active' : 'Paused'}
          </button>
        </div>
      </div>

      {/* 12 Workflow Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DDD6C8]">
        {activeWorkflowList.map((wf) => {
          const isSelected = wf.id === currentWorkflow.id;
          return (
            <button
              key={wf.id}
              onClick={() => {
                setSelectedWorkflowId(wf.id);
                setSelectedNode(null);
              }}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#2F4A3F] text-white shadow-xs'
                  : 'text-[#4A5550] bg-[#FBF9F4] border border-[#DDD6C8] hover:bg-[#EDE8DD]'
              }`}
            >
              {wf.title}
            </button>
          );
        })}
      </div>

      {/* WOW #2: 90-Day Nurture Time Scrubber (Only visible for 90-day nurture) */}
      {currentWorkflow.id === 'wf-90day-nurture' && (
        <div className="bg-[#1F2A27] text-white p-5 sm:p-6 rounded-[16px] border border-[#3E4E49] space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#34423E] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-[#B4684A] tracking-wider">
                  WOW Feature #2
                </span>
                <span className="text-[#A7B3AE]">•</span>
                <span className="text-xs text-[#C5D5CC]">Interactive Time Scrubber</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mt-0.5">
                Fast-Forward Across 90 Days of Buyer Nurture
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="clay"
                size="sm"
                onClick={() => setIsPlayingScrubber(!isPlayingScrubber)}
                leftIcon={
                  isPlayingScrubber ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )
                }
              >
                {isPlayingScrubber ? 'Pause Fast-Forward' : 'Auto Play Scrubber (120ms/day)'}
              </Button>
              <button
                onClick={() => {
                  setIsPlayingScrubber(false);
                  setScrubDay(0);
                }}
                className="p-1.5 text-[#A7B3AE] hover:text-white rounded hover:bg-[#263330]"
                title="Reset to Day 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#C5D5CC]">Day 0: Buyer Enrolled</span>
              <span className="text-[#B4684A] font-bold text-sm">
                CURRENT SCRUB: DAY {scrubDay} OF 90
              </span>
              <span className="text-[#C5D5CC]">Day 90: Incentives Update</span>
            </div>

            <input
              type="range"
              min="0"
              max="90"
              value={scrubDay}
              onChange={(e) => {
                setIsPlayingScrubber(false);
                setScrubDay(parseInt(e.target.value, 10));
              }}
              className="w-full accent-[#B4684A] h-2 bg-[#263330] rounded-lg cursor-pointer"
            />
          </div>

          {/* Real-Time "What The Buyer Has Received So Far" Live Timeline */}
          <div className="bg-[#263330] p-4 rounded-[12px] border border-[#3E4E49] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#C5D5CC]">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Buyer Timeline Received (Up to Day {scrubDay}):
              </span>
              <span className="font-mono text-[#B4684A]">
                {buyerTimeline.length} touches executed
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 pt-1">
              {buyerTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#1F2A27] border border-[#3E4E49] rounded-[8px] p-2.5 shrink-0 w-52 text-xs space-y-1 animate-in fade-in duration-150"
                >
                  <div className="flex justify-between items-center text-[10px] text-[#A7B3AE]">
                    <span className="font-mono font-bold text-[#B4684A]">{item.timing}</span>
                    <span className="uppercase text-[9px]">{item.type}</span>
                  </div>
                  <div className="font-semibold text-white truncate">{item.title}</div>
                  <p className="text-[10px] text-[#A7B3AE] line-clamp-2 leading-tight">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visual Workflow Canvas & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Visual Flowchart Nodes */}
        <div className="lg:col-span-8 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#79827D]">
              Workflow Trigger:
            </span>
            <div className="font-serif text-lg font-medium text-[#1F2A27] mt-0.5">
              {currentWorkflow.trigger}
            </div>
            <p className="text-xs text-[#79827D] mt-0.5">{currentWorkflow.description}</p>
          </div>

          {/* Sequential Nodes Flow */}
          <div className="space-y-4">
            {currentWorkflow.nodes.map((node, idx) => {
              const nodeDay = getDayNumber(node.timing);
              const isExecuted =
                currentWorkflow.id !== 'wf-90day-nurture' || nodeDay <= scrubDay;
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="relative">
                  {/* Thin Connector Line */}
                  {idx > 0 && (
                    <div className="absolute left-6 -top-4 w-[1px] h-4 bg-[#DDD6C8]" />
                  )}

                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-[12px] border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'border-[#2F4A3F] bg-white ring-2 ring-[#2F4A3F] shadow-sm'
                        : isExecuted
                        ? 'border-[#C5BCA9] bg-white hover:border-[#2F4A3F]'
                        : 'border-[#DDD6C8] bg-[#F6F3EC] opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5 ${
                          node.type === 'sms'
                            ? 'bg-[#F0DFD5] text-[#9B553B]'
                            : node.type === 'email'
                            ? 'bg-[#E1EAF0] text-[#36566E]'
                            : node.type === 'task'
                            ? 'bg-[#E0E8E3] text-[#2F4A3F]'
                            : 'bg-[#EDE8DD] text-[#79827D]'
                        }`}
                      >
                        {node.type === 'sms'
                          ? 'SMS'
                          : node.type === 'email'
                          ? 'EML'
                          : node.type === 'task'
                          ? 'TSK'
                          : 'TRG'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#1F2A27]">{node.title}</h4>
                          {node.timing && (
                            <span className="font-mono text-[10px] bg-[#EDE8DD] text-[#4A5550] px-1.5 py-0.2 rounded">
                              {node.timing}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#4A5550] mt-0.5 leading-relaxed">
                          {node.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-[#79827D] shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Node Inspector */}
        <div className="lg:col-span-4 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#C5BCA9] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EDE8DD] pb-3">
            <h3 className="font-serif text-lg text-[#1F2A27] font-medium">Node Inspector</h3>
            <Badge variant="clay">Step Details</Badge>
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs animate-in fade-in duration-150">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#79827D] block mb-1">
                  Selected Step Title:
                </span>
                <div className="font-semibold text-sm text-[#1F2A27]">{selectedNode.title}</div>
                <div className="font-mono text-[11px] text-[#B4684A] mt-0.5">
                  Timing Offset: {selectedNode.timing || 'Immediate'}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#79827D] block mb-1">
                  Description & Trigger Criteria:
                </span>
                <p className="text-[#4A5550] leading-relaxed bg-white p-3 rounded-[8px] border border-[#DDD6C8]">
                  {selectedNode.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#79827D] block mb-1">
                  Message Content / Action Specs:
                </span>
                <p className="text-[#1F2A27] leading-relaxed bg-white p-3 rounded-[8px] border border-[#DDD6C8] font-mono text-[11px]">
                  {selectedNode.details}
                </p>
              </div>

              <div className="pt-2">
                <Button variant="secondary" size="sm" className="w-full">
                  Test Send to Test Phone
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#79827D] italic space-y-2">
              <WorkflowIcon className="w-8 h-8 text-[#DDD6C8] mx-auto" />
              <p>Click on any node in the flowchart on the left to inspect message copy, delay timers, and conditional branch rules.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
