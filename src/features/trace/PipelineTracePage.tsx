import React, { useState, useEffect } from 'react';
import { useDemoStore } from '../../store/useDemoStore';
import { MEETINGS_DATA } from '../../data/meetings';
import { fetchMeetingTrace } from '../../lib/mockApi';
import type { MeetingTrace, StageId } from '../../types';
import { PipelineStrip } from '../../components/pipeline/PipelineStrip';
import { EvidencePanel } from '../../components/pipeline/EvidencePanel';
import { SearchInput } from '../../components/ui/Input';
import { OutcomeChip, PlatformChip } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const PipelineTracePage: React.FC = () => {
  const { selectedMeetingId, setSelectedMeetingId } = useDemoStore();
  const [trace, setTrace] = useState<MeetingTrace | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'missed' | 'recorded'>('all');
  const [activeStageId, setActiveStageId] = useState<StageId>('calendar');

  const loadTrace = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMeetingTrace(id);
      setTrace(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load meeting trace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrace(selectedMeetingId);
  }, [selectedMeetingId]);

  const selectedMeeting = MEETINGS_DATA.find((m) => m.id === selectedMeetingId) || MEETINGS_DATA[0];

  const filteredMeetings = MEETINGS_DATA.filter((m) => {
    const matchesSearch =
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.account.toLowerCase().includes(search.toLowerCase()) ||
      m.csm.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'missed' && m.outcome === 'Missed') ||
      (filterType === 'recorded' && m.outcome === 'Recorded');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold">
              Hero Diagnostic Screen
            </span>
            <span className="text-[#7B8786]">·</span>
            <span className="text-xs text-[#7B8786]">Cross-System Trace</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B]">
            Pipeline Trace Inspector
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            Trace one call at a time from invite to Monday.com. See where failures halt, examine verbatim logs, and isolate the smallest reasonable fix.
          </p>
        </div>

        {/* Quick Hero Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7B8786] hidden lg:inline">Key Scenarios:</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedMeetingId('MTG-1056')}
            className={selectedMeetingId === 'MTG-1056' ? 'border-[#1F4B4A] bg-[#E3EDEB]' : ''}
          >
            Lobby Timeout
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedMeetingId('MTG-1047')}
            className={selectedMeetingId === 'MTG-1047' ? 'border-[#1F4B4A] bg-[#E3EDEB]' : ''}
          >
            Recurring Mismatch
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedMeetingId('MTG-1051')}
            className={selectedMeetingId === 'MTG-1051' ? 'border-[#1F4B4A] bg-[#E3EDEB]' : ''}
          >
            Context Signal Drop
          </Button>
        </div>
      </div>

      {/* 2-Column Split: Meeting Sidebar + Main Trace Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Meeting Selector (320px) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-4 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col h-[740px]">
          {/* Search & Filter bar */}
          <div className="space-y-3 pb-3 border-b border-[#E2DDD3]">
            <SearchInput
              placeholder="Search ID, account, CSM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs"
            />

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-[#7B8786] text-[11px]">
                Showing {filteredMeetings.length} of {MEETINGS_DATA.length}
              </span>
              <div className="flex gap-1">
                {(['all', 'missed', 'recorded'] as const).map((ft) => (
                  <button
                    key={ft}
                    onClick={() => setFilterType(ft)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition-colors cursor-pointer ${
                      filterType === ft
                        ? 'bg-[#1F4B4A] text-white font-bold'
                        : 'bg-[#F6F3EE] text-[#4A5757] hover:bg-[#E2DDD3]'
                    }`}
                  >
                    {ft}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meeting List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E2DDD3]/60 pr-1 mt-2">
            {filteredMeetings.map((m) => {
              const isSelected = m.id === selectedMeetingId;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeetingId(m.id)}
                  className={`p-3 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E3EDEB] border-l-4 border-[#1F4B4A] shadow-sm'
                      : 'hover:bg-[#FBF9F6]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-[#1F4B4A]">{m.id}</span>
                    <OutcomeChip outcome={m.outcome} size="sm" />
                  </div>
                  <h4 className="text-xs font-semibold text-[#1E2A2B] truncate">{m.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-[#7B8786] mt-1">
                    <span className="truncate max-w-[120px]">{m.account}</span>
                    <PlatformChip platform={m.platform} />
                  </div>
                  {m.outcome === 'Missed' && m.causeCategory && (
                    <div className="mt-1.5 text-[10px] text-[#B4643C] font-mono bg-[#F3E3D8]/60 px-1.5 py-0.5 rounded border border-[#E6C7B6] truncate">
                      {m.causeCategory}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Pipeline & Evidence Inspector */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Active Meeting Context Card */}
          <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[#1F4B4A] bg-[#E3EDEB] px-2 py-0.5 rounded border border-[#CFC8BB]">
                  {selectedMeeting.id}
                </span>
                <OutcomeChip outcome={selectedMeeting.outcome} />
                <PlatformChip platform={selectedMeeting.platform} />
              </div>
              <h2 className="font-serif text-xl font-semibold text-[#1E2A2B]">
                {selectedMeeting.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#7B8786]">
                <span>Account: <strong className="text-[#1E2A2B]">{selectedMeeting.account}</strong></span>
                <span>·</span>
                <span>CSM: <strong className="text-[#1E2A2B]">{selectedMeeting.csm}</strong></span>
                <span>·</span>
                <span>Scheduled: <strong className="text-[#1E2A2B]">{selectedMeeting.scheduledStart}</strong></span>
              </div>
            </div>

            <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-[#E2DDD3] pt-3 md:pt-0 md:pl-5 shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786] block">
                Stage Reached
              </span>
              <span className="font-mono text-xs font-semibold text-[#1E2A2B]">
                {selectedMeeting.stageReached}
              </span>
              {selectedMeeting.causeCategory && (
                <span className="text-[11px] text-[#B4643C] block font-medium mt-0.5">
                  {selectedMeeting.causeCategory}
                </span>
              )}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6">
              <Skeleton className="h-44 rounded-[16px]" />
              <Skeleton className="h-96 rounded-[16px]" />
            </div>
          )}

          {/* Error Message with Retry */}
          {error && !loading && (
            <div className="p-6 rounded-[16px] bg-[#F5DEDA] border border-[#EBC2BC] text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-[#A8433A] mx-auto" />
              <h3 className="font-serif text-lg font-medium text-[#A8433A]">{error}</h3>
              <p className="text-xs text-[#4A5757]">
                Transient mock API error. Click retry to reload this trace.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => loadTrace(selectedMeetingId)}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Retry Loading Trace
              </Button>
            </div>
          )}

          {/* Pipeline Strip + Evidence Panel */}
          {trace && !loading && !error && (
            <>
              {/* 6-Stage Pipeline Strip */}
              <PipelineStrip
                trace={trace}
                selectedStageId={activeStageId}
                onSelectStage={(st) => setActiveStageId(st)}
              />

              {/* Evidence Panel with Tabs */}
              <EvidencePanel
                trace={trace}
                activeStageId={activeStageId}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
