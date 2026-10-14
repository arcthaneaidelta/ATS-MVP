import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { MEETINGS_DATA } from '../../data/meetings';
import type { Meeting, CauseCategory, OutcomeType, PlatformType } from '../../types';
import { SearchInput, Select } from '../../components/ui/Input';
import { OutcomeChip, PlatformChip } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import {
  CalendarX2,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Activity,
  AlertTriangle,
  User,
  Building,
  CheckCircle2
} from 'lucide-react';

export const MissedMeetingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedMeetingId } = useDemoStore();

  const [search, setSearch] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<'all' | OutcomeType>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | PlatformType>('all');
  const [selectedCause, setSelectedCause] = useState<'all' | CauseCategory>('all');
  const [sortField, setSortField] = useState<keyof Meeting>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [drawerMeeting, setDrawerMeeting] = useState<Meeting | null>(null);

  const causeCategories: CauseCategory[] = [
    'Calendar sync gap',
    'Recurring/rescheduled mismatch',
    'Lobby / host timing',
    'Platform authorisation (OAuth/token)',
    'Bot scheduling/API response',
    'Webhook/event delivery',
    'Downstream mapping (app → Monday.com)'
  ];

  const filteredMeetings = MEETINGS_DATA.filter((m) => {
    const matchesSearch =
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.account.toLowerCase().includes(search.toLowerCase()) ||
      m.csm.toLowerCase().includes(search.toLowerCase());

    const matchesOutcome = selectedOutcome === 'all' || m.outcome === selectedOutcome;
    const matchesPlatform = selectedPlatform === 'all' || m.platform === selectedPlatform;
    const matchesCause = selectedCause === 'all' || m.causeCategory === selectedCause;

    return matchesSearch && matchesOutcome && matchesPlatform && matchesCause;
  }).sort((a, b) => {
    const valA = a[sortField] || '';
    const valB = b[sortField] || '';
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const recordedCount = MEETINGS_DATA.filter((m) => m.outcome === 'Recorded').length;
  const missedCount = MEETINGS_DATA.filter((m) => m.outcome === 'Missed').length;

  const handleOpenTrace = (id: string) => {
    setSelectedMeetingId(id);
    navigate('/app/trace');
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedOutcome('all');
    setSelectedPlatform('all');
    setSelectedCause('all');
  };

  const handleSort = (field: keyof Meeting) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2DDD3]">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A] font-bold">
            Root Cause Taxonomy
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#1E2A2B] mt-0.5">
            Missed Meetings Forensics
          </h1>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-1 max-w-2xl">
            A structured taxonomy of failure causes across the 30 analyzed calls. Find why some calls are recorded reliably while others fail to connect.
          </p>
        </div>

        {/* Summary metric chips */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E1EEE6] border border-[#C8E1D2] text-xs font-medium text-[#3F7D5B]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Recorded: <strong>{recordedCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5DEDA] border border-[#EBC2BC] text-xs font-medium text-[#A8433A]">
            <CalendarX2 className="w-4 h-4" />
            <span>Missed / Problem: <strong>{missedCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-4 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <SearchInput
            placeholder="Search meetings, accounts, CSMs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            options={[
              { value: 'all', label: 'All Outcomes' },
              { value: 'Recorded', label: 'Recorded Only' },
              { value: 'Missed', label: 'Missed Calls Only' }
            ]}
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value as any)}
          />

          <Select
            options={[
              { value: 'all', label: 'All Platforms' },
              { value: 'Zoom', label: 'Zoom' },
              { value: 'Google Meet', label: 'Google Meet' }
            ]}
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as any)}
          />

          <Select
            options={[
              { value: 'all', label: 'All 7 Cause Categories' },
              ...causeCategories.map((c) => ({ value: c, label: c }))
            ]}
            value={selectedCause}
            onChange={(e) => setSelectedCause(e.target.value as any)}
          />
        </div>

        {/* Active Filter Row & Clear button */}
        {(search || selectedOutcome !== 'all' || selectedPlatform !== 'all' || selectedCause !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD3] text-xs">
            <span className="text-[#7B8786]">
              Filtered: Showing <strong>{filteredMeetings.length}</strong> of {MEETINGS_DATA.length} calls
            </span>
            <Button variant="ghost" size="sm" onClick={handleClearFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Meetings Table */}
      <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] overflow-hidden shadow-[0_1px_2px_rgba(30,42,43,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBF9F6] border-b border-[#E2DDD3] text-[#7B8786] font-mono text-[11px] uppercase tracking-wider select-none">
                <th className="py-3 px-4 cursor-pointer hover:text-[#1E2A2B]" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#1E2A2B]" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1">
                    <span>Meeting & Account</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Scheduled Start</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Stage Reached</th>
                <th className="py-3 px-4">Likely Cause Category</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DDD3]/70">
              {filteredMeetings.map((meeting) => (
                <tr
                  key={meeting.id}
                  onClick={() => setDrawerMeeting(meeting)}
                  className="hover:bg-[#FBF9F6] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1F4B4A]">
                    {meeting.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1E2A2B] group-hover:text-[#1F4B4A] transition-colors">
                      {meeting.title}
                    </div>
                    <div className="text-[11px] text-[#7B8786] flex items-center gap-1.5 mt-0.5">
                      <span>{meeting.account}</span>
                      <span>·</span>
                      <span>CSM: {meeting.csm}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <PlatformChip platform={meeting.platform} />
                  </td>
                  <td className="py-3.5 px-4 text-[#4A5757] font-mono text-[11px]">
                    {meeting.scheduledStart}
                  </td>
                  <td className="py-3.5 px-4">
                    <OutcomeChip outcome={meeting.outcome} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#1E2A2B]">
                    {meeting.stageReached}
                  </td>
                  <td className="py-3.5 px-4">
                    {meeting.causeCategory ? (
                      <span className="inline-block text-[10px] font-mono font-medium text-[#B4643C] bg-[#F3E3D8] border border-[#E6C7B6] px-2 py-0.5 rounded max-w-[200px] truncate">
                        {meeting.causeCategory}
                      </span>
                    ) : (
                      <span className="text-[#7B8786] text-[11px]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenTrace(meeting.id);
                      }}
                      className="px-2.5 py-1 rounded bg-[#E3EDEB] hover:bg-[#1F4B4A] hover:text-white text-[#1F4B4A] font-medium text-[11px] transition-colors"
                    >
                      Trace →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredMeetings.length === 0 && (
          <div className="py-16 text-center space-y-3">
            <Filter className="w-8 h-8 text-[#7B8786] mx-auto opacity-50" />
            <h3 className="font-serif text-lg font-medium text-[#1E2A2B]">
              No meetings match these filters
            </h3>
            <p className="text-xs text-[#4A5757]">
              Clear filters to view all 30 analyzed onboarding calls.
            </p>
            <Button variant="secondary" size="sm" onClick={handleClearFilters}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Meeting Detail Drawer */}
      <Drawer
        isOpen={Boolean(drawerMeeting)}
        onClose={() => setDrawerMeeting(null)}
        title={drawerMeeting ? `${drawerMeeting.id}: ${drawerMeeting.title}` : ''}
        subtitle={drawerMeeting ? `${drawerMeeting.account} · ${drawerMeeting.platform}` : ''}
        footer={
          drawerMeeting && (
            <>
              <Button variant="secondary" size="sm" onClick={() => setDrawerMeeting(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (drawerMeeting) handleOpenTrace(drawerMeeting.id);
                }}
                rightIcon={<Activity className="w-4 h-4" />}
              >
                Open in Pipeline Trace
              </Button>
            </>
          )
        }
      >
        {drawerMeeting && (
          <div className="space-y-6 text-xs">
            {/* Outcome Badge Strip */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B8786] block">Outcome</span>
                <OutcomeChip outcome={drawerMeeting.outcome} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B8786] block">Platform</span>
                <PlatformChip platform={drawerMeeting.platform} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7B8786] block">Stage Reached</span>
                <span className="font-mono text-[#1E2A2B] font-semibold">{drawerMeeting.stageReached}</span>
              </div>
            </div>

            {/* Account & CSM Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                <div className="flex items-center gap-1.5 text-[#7B8786] mb-1">
                  <Building className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase">Customer Account</span>
                </div>
                <span className="font-semibold text-sm text-[#1E2A2B]">{drawerMeeting.account}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#FBF9F6] border border-[#E2DDD3]">
                <div className="flex items-center gap-1.5 text-[#7B8786] mb-1">
                  <User className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase">CSM Owner</span>
                </div>
                <span className="font-semibold text-sm text-[#1E2A2B]">{drawerMeeting.csm}</span>
              </div>
            </div>

            {/* Root Cause Callout */}
            <div className="p-4 rounded-[12px] bg-[#F3E3D8] border border-[#E6C7B6] space-y-2">
              <div className="flex items-center gap-2 text-[#B4643C]">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="font-serif font-semibold text-sm">
                  {drawerMeeting.causeCategory || 'Healthy Call Flow'}
                </h4>
              </div>
              <p className="text-[#1E2A2B] leading-relaxed">
                {drawerMeeting.rootCauseSummary}
              </p>
              {drawerMeeting.failureEvidenceSnippet && (
                <div className="p-2 rounded bg-white/70 font-mono text-[11px] text-[#A8433A] border border-[#E6C7B6]">
                  {drawerMeeting.failureEvidenceSnippet}
                </div>
              )}
            </div>

            {/* Smallest reasonable fix */}
            <div className="p-4 rounded-[12px] bg-[#E3EDEB] border border-[#CFC8BB] space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#1F4B4A] font-bold block">
                Recommended Surgical Fix
              </span>
              <p className="text-[#1E2A2B] leading-relaxed">
                {drawerMeeting.smallestFix}
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
