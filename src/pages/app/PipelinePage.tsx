import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Lead, LeadStage, LeadScore } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import {
  Kanban,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Layers,
} from 'lucide-react';

export const PipelinePage: React.FC = () => {
  const { leads, moveLeadStage, setSelectedLeadId, selectedCommunity } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | LeadScore>('all');
  const [collapsedLanes, setCollapsedLanes] = useState<{ nurture: boolean; lost: boolean }>({
    nurture: false,
    lost: true,
  });

  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  // Kanban main stages
  const mainColumns: Array<{ id: LeadStage; title: string; color: string }> = [
    { id: 'new', title: 'New Inquiry', color: 'border-t-[#4B6A82]' },
    { id: 'contacted', title: 'Contacted', color: 'border-t-[#B98A2E]' },
    { id: 'tour_booked', title: 'Tour Booked', color: 'border-t-[#4C7A57]' },
    { id: 'tour_completed', title: 'Tour Completed', color: 'border-t-[#2F4A3F]' },
    { id: 'design_consult', title: 'Design Consult', color: 'border-t-[#B4684A]' },
    { id: 'contract_signed', title: 'Contract Signed', color: 'border-t-[#1F2A27]' },
    { id: 'closed_won', title: 'Closed Won', color: 'border-t-[#4C7A57]' },
  ];

  // Filtering leads
  const filteredLeads = leads.filter((l) => {
    // Community filter
    if (selectedCommunity !== 'all' && l.communityId !== selectedCommunity) {
      return false;
    }
    // Score filter
    if (scoreFilter !== 'all' && l.score !== scoreFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = l.name.toLowerCase().includes(q);
      const matchComm = l.communityName.toLowerCase().includes(q);
      const matchPlan = l.planName?.toLowerCase().includes(q);
      if (!matchName && !matchComm && !matchPlan) return false;
    }
    return true;
  });

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stageId: LeadStage) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      moveLeadStage(leadId, targetStage);
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Home Sales Pipeline
            </h1>
            <Badge variant="clay">{filteredLeads.length} Leads Active</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Drag cards between stages to trigger automated workflows, notifications, and reminders.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#79827D] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search buyer or plan..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-[8px] border border-[#DDD6C8] bg-white text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F] w-48"
            />
          </div>

          {/* Score Filter */}
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value as any)}
            className="text-xs rounded-[8px] border border-[#DDD6C8] bg-white px-2.5 py-1.5 text-[#1F2A27] focus:outline-none"
          >
            <option value="all">All Intent Scores</option>
            <option value="Hot">Hot Leads Only</option>
            <option value="Warm">Warm Leads</option>
            <option value="Cool">Cool Leads</option>
          </select>
        </div>
      </div>

      {/* Main 7-Column Kanban Grid (Horizontal Scrolling on Small Screens) */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1300px] items-start h-full">
          {mainColumns.map((col) => {
            const colLeads = filteredLeads.filter((l) => l.stage === col.id);
            const isOver = dragOverStage === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={() => setDragOverStage(null)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-[230px] shrink-0 bg-[#FBF9F4] rounded-[14px] border border-[#DDD6C8] border-t-4 ${
                  col.color
                } flex flex-col max-h-[calc(100vh-210px)] transition-all ${
                  isOver ? 'ring-2 ring-[#B4684A] bg-[#F6F3EC]' : ''
                }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[#EDE8DD] flex items-center justify-between bg-[#F6F3EC]/50">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#1F2A27] leading-tight">
                      {col.title}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[#79827D] bg-white px-2 py-0.5 rounded-full border border-[#DDD6C8]">
                    {colLeads.length}
                  </span>
                </div>

                {/* Column Scrollable Cards */}
                <div className="p-2 space-y-2.5 overflow-y-auto flex-1 min-h-[220px]">
                  {colLeads.length === 0 ? (
                    <div className="border border-dashed border-[#DDD6C8] rounded-[8px] p-4 text-center text-[11px] text-[#79827D] my-4 italic">
                      Drag lead here
                    </div>
                  ) : (
                    colLeads.map((lead) => {
                      const isHot = lead.score === 'Hot';

                      return (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onClick={() => setSelectedLeadId(lead.id)}
                          className={`bg-white p-3.5 rounded-[10px] border border-[#DDD6C8] shadow-2xs hover:border-[#C5BCA9] hover:shadow-xs transition-all cursor-grab active:cursor-grabbing space-y-2 select-none group ${
                            draggedLeadId === lead.id ? 'opacity-50' : ''
                          }`}
                        >
                          {/* Card Header: Name + Score */}
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="text-xs font-semibold text-[#1F2A27] leading-snug group-hover:text-[#2F4A3F] transition-colors">
                                {lead.name}
                              </h4>
                              <p className="text-[10px] text-[#79827D] truncate">
                                {lead.communityName}
                              </p>
                            </div>
                            <span
                              className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded shrink-0 ${
                                isHot
                                  ? 'bg-[#F0DFD5] text-[#9B553B]'
                                  : lead.score === 'Warm'
                                  ? 'bg-[#F5EBD0] text-[#8C6418]'
                                  : 'bg-[#EDE8DD] text-[#79827D]'
                              }`}
                            >
                              {lead.score}
                            </span>
                          </div>

                          {/* Plan & Budget */}
                          <div className="text-[11px] text-[#4A5550]">
                            {lead.planName && (
                              <div className="font-medium text-[#1F2A27]">{lead.planName}</div>
                            )}
                            <div className="text-[10px] text-[#79827D]">{lead.budgetRange}</div>
                          </div>

                          {/* Footer: Source + Owner Avatar + Days in stage */}
                          <div className="pt-2 border-t border-[#F6F3EC] flex items-center justify-between text-[10px] text-[#79827D]">
                            <span className="truncate max-w-[100px]">{lead.source}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono">{lead.daysInStage}d</span>
                              <Avatar
                                initials={lead.ownerName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                                size="sm"
                                name={lead.ownerName}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible Secondary Lanes: Nurture & Lost */}
      <div className="border-t border-[#DDD6C8] pt-4 space-y-2">
        <div className="flex items-center gap-6 text-xs text-[#79827D]">
          <button
            onClick={() =>
              setCollapsedLanes((prev) => ({ ...prev, nurture: !prev.nurture }))
            }
            className="flex items-center gap-1.5 hover:text-[#1F2A27] font-medium"
          >
            {collapsedLanes.nurture ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>90-Day Nurture Lane ({leads.filter((l) => l.stage === 'nurture').length})</span>
          </button>

          <button
            onClick={() =>
              setCollapsedLanes((prev) => ({ ...prev, lost: !prev.lost }))
            }
            className="flex items-center gap-1.5 hover:text-[#1F2A27] font-medium"
          >
            {collapsedLanes.lost ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>Lost / Disqualified ({leads.filter((l) => l.stage === 'lost').length})</span>
          </button>
        </div>

        {/* Nurture Lane Content */}
        {!collapsedLanes.nurture && (
          <div className="p-3 bg-[#FBF9F4] rounded-[12px] border border-[#DDD6C8] flex gap-3 overflow-x-auto">
            {leads
              .filter((l) => l.stage === 'nurture')
              .map((nl) => (
                <div
                  key={nl.id}
                  onClick={() => setSelectedLeadId(nl.id)}
                  className="bg-white p-2.5 rounded-[8px] border border-[#DDD6C8] shrink-0 w-52 text-xs cursor-pointer hover:border-[#2F4A3F]"
                >
                  <div className="font-semibold text-[#1F2A27]">{nl.name}</div>
                  <div className="text-[10px] text-[#79827D]">
                    {nl.communityName} • Enrolled in 90-Day Drip
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
