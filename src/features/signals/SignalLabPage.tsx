import React, { useState } from 'react';
import { SAMPLE_TRANSCRIPTS } from '../../data/signals';
import { TranscriptView } from '../../components/signals/TranscriptView';
import { SignalCard } from '../../components/signals/SignalCard';
import { MetricsStrip } from '../../components/signals/MetricsStrip';
import { SegmentedToggle } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { useDemoStore } from '../../store/useDemoStore';
import { simulateAnalysisProgress } from '../../lib/mockApi';
import {
  Sparkles,
  KeyRound,
  Workflow,
  Play,
  Check,
  Info
} from 'lucide-react';

export const SignalLabPage: React.FC = () => {
  const { addToast } = useDemoStore();
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-mtg-1051');
  const [mode, setMode] = useState<'keyword' | 'context'>('context');
  const [selectedSignalId, setSelectedSignalId] = useState<string | undefined>(undefined);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [isAppliedToCrm, setIsAppliedToCrm] = useState<boolean>(false);

  const sample = SAMPLE_TRANSCRIPTS.find((s) => s.id === selectedSampleId) || SAMPLE_TRANSCRIPTS[0];

  const activeSignals = mode === 'context' ? sample.contextSignals : sample.keywordSignals;
  const activeMetrics = mode === 'context' ? sample.contextMetrics : sample.keywordMetrics;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    try {
      await simulateAnalysisProgress((step) => {
        setAnalysisStep(step);
      });
      addToast({
        type: 'success',
        title: 'Extraction Complete',
        message: `Extracted ${activeSignals.length} structured signals using ${mode === 'context' ? 'Context-Aware' : 'Keyword'} pipeline.`
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  const handleApplyToMonday = () => {
    setIsAppliedToCrm(true);
    addToast({
      type: 'success',
      title: 'Monday.com Updated (Simulated)',
      message: 'Board #88201 updated with target date +7d and risk flag.'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B4643C] font-bold">
              Prompt Intelligence Benchmark
            </span>
            <span className="text-[#7B8786]">·</span>
            <span className="text-xs text-[#7B8786]">Context vs Keyword Regex</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B]">
            Signal Lab: Contextual Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            Watch false positives disappear when switching from simple keyword triggers to contextual extraction that understands negation and customer commitments.
          </p>
        </div>

        {/* Top Controls: Segmented Toggle (PRD WOW Moment) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <SegmentedToggle
            options={[
              { id: 'keyword', label: 'Keyword Matcher', icon: <KeyRound className="w-3.5 h-3.5" />, badge: 'High Noise' },
              { id: 'context', label: 'Context-Aware (Proposed)', icon: <Sparkles className="w-3.5 h-3.5" />, badge: 'Clean' }
            ]}
            activeId={mode}
            onChange={(id) => {
              setMode(id as any);
              setSelectedSignalId(undefined);
            }}
          />

          <Button
            variant="primary"
            size="sm"
            onClick={handleRunAnalysis}
            isLoading={isAnalyzing}
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            {isAnalyzing
              ? analysisStep === 1
                ? 'Segmenting Audio turns...'
                : analysisStep === 2
                ? 'Classifying Polarity...'
                : 'Mapping Monday Columns...'
              : 'Analyse Sample'}
          </Button>
        </div>
      </div>

      {/* Illustrative Notice & Sample Picker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[12px] text-xs">
        <div className="flex items-center gap-2 text-[#7B8786]">
          <Info className="w-4 h-4 text-[#1F4B4A] shrink-0" />
          <span>
            Sample: <strong className="text-[#1E2A2B]">{sample.title}</strong> ({sample.account}) · {sample.summary}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7B8786] text-[11px] font-mono">Switch Sample:</span>
          {SAMPLE_TRANSCRIPTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSampleId(s.id);
                setSelectedSignalId(undefined);
              }}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                selectedSampleId === s.id
                  ? 'bg-[#1F4B4A] text-white font-semibold'
                  : 'bg-[#F6F3EE] text-[#4A5757] hover:bg-[#E2DDD3]'
              }`}
            >
              {s.meetingId}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Strip */}
      <MetricsStrip metrics={activeMetrics} mode={mode} />

      {/* Main 2-Column Split: Transcript on Left, Extracted Signals on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Transcript View */}
        <div className="lg:col-span-6 xl:col-span-7">
          <TranscriptView
            lines={sample.lines}
            activeSignals={activeSignals}
            selectedSignalId={selectedSignalId}
            onSelectSignal={(id) => setSelectedSignalId(id)}
            mode={mode}
          />
        </div>

        {/* Right Column: Signals Panel & Monday.com Preview */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-5">
          {/* Signals Header */}
          <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
                  Extracted Intelligence
                </span>
                <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
                  {mode === 'context' ? 'Context-Aware Structured Output' : 'Keyword Heuristic Results'}
                </h3>
              </div>
              <span className="font-mono text-xs text-[#1F4B4A] bg-[#E3EDEB] px-2 py-0.5 rounded font-bold">
                {activeSignals.length} items
              </span>
            </div>

            {/* List of Signal Cards */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activeSignals.map((signal) => (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  isSelected={signal.id === selectedSignalId}
                  onSelect={() => setSelectedSignalId(signal.id)}
                />
              ))}
            </div>
          </div>

          {/* Mapped-Field Monday.com Update Preview Card */}
          <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-3">
            <div className="flex items-center gap-2 text-[#1F4B4A]">
              <Workflow className="w-4 h-4" />
              <h4 className="font-serif text-sm font-semibold text-[#1E2A2B]">
                Monday.com Board Mutation Preview
              </h4>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3] flex items-center justify-between">
                <span className="text-[#7B8786] font-mono">Account Risk Status:</span>
                <span className="font-bold text-[#B4643C]">"At risk (Legal delay)"</span>
              </div>
              <div className="p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3] flex items-center justify-between">
                <span className="text-[#7B8786] font-mono">Target Cutover Date:</span>
                <span className="font-bold text-[#1F4B4A]">Oct 19 (+7 days buffer)</span>
              </div>
              <div className="p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3] flex items-center justify-between">
                <span className="text-[#7B8786] font-mono">Next Action Owner:</span>
                <span className="font-bold text-[#1E2A2B]">Priya Nair (Security questionnaire)</span>
              </div>
            </div>

            <Button
              variant={isAppliedToCrm ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleApplyToMonday}
              disabled={isAppliedToCrm}
              className="w-full mt-2"
              leftIcon={isAppliedToCrm ? <Check className="w-3.5 h-3.5 text-[#3F7D5B]" /> : <Workflow className="w-3.5 h-3.5" />}
            >
              {isAppliedToCrm ? 'Applied to Board (Simulated)' : 'Apply to Monday.com (Simulated)'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
