import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Lead, LeadScore, LeadStage } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Send,
  ArrowUpDown,
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const { leads, setSelectedLeadId, selectedCommunity, addToast } = useDemoStore();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [showReactivationModal, setShowReactivationModal] = useState(false);
  const [reactivationMessage, setReactivationMessage] = useState(
    'Hi {{first_name}}, are you still looking to build in the Charlotte area, or have your plans changed? — Dana, Alder & Stone Homes. Reply STOP to opt out.'
  );

  const filtered = leads.filter((l) => {
    if (selectedCommunity !== 'all' && l.communityId !== selectedCommunity) return false;
    if (stageFilter !== 'all' && l.stage !== stageFilter) return false;
    if (scoreFilter !== 'all' && l.score !== scoreFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.communityName.toLowerCase().includes(q) ||
        (l.planName && l.planName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filtered.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter((item) => item !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleStartReactivation = () => {
    setShowReactivationModal(false);
    const count = selectedLeadIds.length > 0 ? selectedLeadIds.length : 14;
    addToast(
      'Reactivation Sequence Started',
      `Enrolled ${count} dormant buyers in 9-Word SMS Reactivation Campaign.`,
      'success'
    );
    setSelectedLeadIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-normal">
              Leads & Inquiries Directory
            </h1>
            <Badge variant="clay">{filtered.length} Contacts</Badge>
          </div>
          <p className="text-xs text-[#79827D] mt-0.5">
            Complete database of 40 home buyers segmented across Fort Mill, Huntersville, and Charlotte.
          </p>
        </div>

        {/* Bulk Action: Reactivate Dormant Leads (§10.4) */}
        <div className="flex items-center gap-2">
          <Button
            variant="clay"
            size="sm"
            onClick={() => setShowReactivationModal(true)}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reactivate Dormant Leads
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FBF9F4] p-4 rounded-[14px] border border-[#DDD6C8] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#79827D] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, plan..."
              className="pl-8 pr-3 py-1.5 rounded-[8px] border border-[#DDD6C8] bg-white text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F] w-56"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="rounded-[8px] border border-[#DDD6C8] bg-white px-2.5 py-1.5 text-[#1F2A27] focus:outline-none"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="new">New Inquiry</option>
            <option value="contacted">Contacted</option>
            <option value="tour_booked">Tour Booked</option>
            <option value="tour_completed">Tour Completed</option>
            <option value="design_consult">Design Consult</option>
            <option value="contract_signed">Contract Signed</option>
            <option value="closed_won">Closed Won</option>
            <option value="nurture">90-Day Nurture</option>
          </select>

          {/* Score Filter */}
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="rounded-[8px] border border-[#DDD6C8] bg-white px-2.5 py-1.5 text-[#1F2A27] focus:outline-none"
          >
            <option value="all">All Intent Scores</option>
            <option value="Hot">Hot Only</option>
            <option value="Warm">Warm</option>
            <option value="Cool">Cool</option>
          </select>
        </div>

        {selectedLeadIds.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2F4A3F]">
            <span>{selectedLeadIds.length} leads selected</span>
            <button
              onClick={() => setSelectedLeadIds([])}
              className="text-[#79827D] hover:underline text-[11px]"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Leads Table (Desktop) / Card List (Mobile) */}
      <div className="bg-[#FBF9F4] rounded-[16px] border border-[#DDD6C8] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDD6C8] bg-[#F6F3EC] text-[#4A5550]">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedLeadIds.length > 0 &&
                      selectedLeadIds.length === filtered.length
                    }
                    onChange={handleSelectAll}
                    className="rounded text-[#2F4A3F]"
                  />
                </th>
                <th className="p-3 font-semibold text-[#1F2A27]">Buyer Name</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Community</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Plan Interest</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Budget</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Timeline</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Score</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Stage</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Source</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Counselor</th>
                <th className="p-3 font-semibold text-[#1F2A27]">Last Touch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE8DD]">
              {filtered.map((lead) => {
                const isSelected = selectedLeadIds.includes(lead.id);

                return (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className={`hover:bg-[#EDE8DD]/60 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F0DFD5]/40' : ''
                    }`}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(lead.id)}
                        className="rounded text-[#2F4A3F]"
                      />
                    </td>
                    <td className="p-3 font-semibold text-[#1F2A27]">
                      {lead.name}
                      <span className="block text-[10px] text-[#79827D] font-normal">
                        {lead.phone}
                      </span>
                    </td>
                    <td className="p-3 text-[#4A5550]">{lead.communityName}</td>
                    <td className="p-3 font-medium text-[#1F2A27]">
                      {lead.planName || '—'}
                    </td>
                    <td className="p-3 font-mono text-[#4A5550]">{lead.budgetRange}</td>
                    <td className="p-3 text-[#79827D]">{lead.timeline}</td>
                    <td className="p-3">
                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          lead.score === 'Hot'
                            ? 'bg-[#F0DFD5] text-[#9B553B]'
                            : lead.score === 'Warm'
                            ? 'bg-[#F5EBD0] text-[#8C6418]'
                            : 'bg-[#EDE8DD] text-[#79827D]'
                        }`}
                      >
                        {lead.score}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant="neutral" size="sm">
                        {lead.stage.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-[#79827D]">{lead.source}</td>
                    <td className="p-3 text-[#2F4A3F] font-medium">{lead.ownerName.split(' ')[0]}</td>
                    <td className="p-3 text-[#79827D] font-mono text-[11px] whitespace-nowrap">
                      {lead.lastTouch}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cold Lead Reactivation Modal */}
      <Modal
        isOpen={showReactivationModal}
        onClose={() => setShowReactivationModal(false)}
        title="Start Cold Lead Reactivation Campaign"
        subtitle="Re-engage buyers with 90+ days without recent contact"
      >
        <div className="space-y-4 text-xs text-[#1F2A27]">
          <p className="text-[#4A5550] leading-relaxed">
            This high-response 9-word text cuts through noise by asking a casual, direct question.
            Historically produces a <strong>28% reply rate</strong> from dormant home shoppers.
          </p>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#79827D] mb-1">
              SMS Message Copy (With Personalization):
            </label>
            <textarea
              rows={3}
              value={reactivationMessage}
              onChange={(e) => setReactivationMessage(e.target.value)}
              className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-3 text-[#1F2A27] bg-white focus:outline-none focus:border-[#2F4A3F]"
            />
            <span className="text-[10px] text-[#79827D] mt-1 block">
              1 segment • 156 characters • Includes mandatory opt-out footer
            </span>
          </div>

          <div className="p-3 bg-[#E0E8E3] rounded-[10px] border border-[#C5D5CC] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4C7A57] shrink-0" />
            <span className="text-[11px] text-[#2F4A3F]">
              Will target 14 inactive leads currently in the Nurture lane.
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowReactivationModal(false)}>
              Cancel
            </Button>
            <Button variant="clay" size="sm" onClick={handleStartReactivation}>
              Launch Reactivation Campaign
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
