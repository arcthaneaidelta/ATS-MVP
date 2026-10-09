import React, { useState } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { LeadStage } from '../../types';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import {
  Phone,
  Mail,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Play,
  ArrowRight,
  Sparkles,
  User,
} from 'lucide-react';

export const LeadDetailDrawer: React.FC = () => {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    moveLeadStage,
    updateLead,
    addMessageToLead,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'messages' | 'notes'>('overview');
  const [newSmsText, setNewSmsText] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const lead = leads.find((l) => l.id === selectedLeadId);

  if (!lead) return null;

  const stageOrder: LeadStage[] = [
    'new',
    'contacted',
    'tour_booked',
    'tour_completed',
    'design_consult',
    'contract_signed',
    'closed_won',
  ];

  const currentStageIndex = stageOrder.indexOf(lead.stage);
  const nextStage =
    currentStageIndex >= 0 && currentStageIndex < stageOrder.length - 1
      ? stageOrder[currentStageIndex + 1]
      : null;

  const handleSimulateNextStep = () => {
    if (nextStage) {
      moveLeadStage(lead.id, nextStage);
    }
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSmsText.trim()) return;
    addMessageToLead(lead.id, newSmsText.trim(), 'agent', false);
    setNewSmsText('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    updateLead(lead.id, {
      notes: [newNoteText.trim(), ...lead.notes],
    });
    setNewNoteText('');
  };

  return (
    <Drawer
      isOpen={Boolean(selectedLeadId)}
      onClose={() => setSelectedLeadId(null)}
      title={lead.name}
      subtitle={`${lead.communityName} • ${lead.budgetRange}`}
      width="md"
    >
      <div className="space-y-6">
        {/* Top Action Bar: Stage pill + "Simulate Next Step" Button (§13) */}
        <div className="p-4 rounded-[12px] bg-[#F6F3EC] border border-[#DDD6C8] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#79827D]">
              Current Stage:
            </span>
            <Badge variant="clay" size="md">
              {lead.stage.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {nextStage && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateNextStep}
              className="w-full justify-between"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              <span>Simulate Next Step: Advance to {nextStage.replace('_', ' ')}</span>
            </Button>
          )}
        </div>

        {/* Quick Contact Icons Strip */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] flex items-center gap-2 text-xs">
            <Phone className="w-4 h-4 text-[#2F4A3F]" />
            <div className="truncate">
              <span className="text-[10px] text-[#79827D] block">Mobile Phone</span>
              <span className="font-semibold text-[#1F2A27]">{lead.phone}</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] flex items-center gap-2 text-xs">
            <Mail className="w-4 h-4 text-[#2F4A3F]" />
            <div className="truncate">
              <span className="text-[10px] text-[#79827D] block">Email Address</span>
              <span className="font-semibold text-[#1F2A27] truncate block">{lead.email}</span>
            </div>
          </div>
        </div>

        {/* Drawer Tabs */}
        <div className="flex items-center gap-2 border-b border-[#DDD6C8] pb-2">
          {(['overview', 'activity', 'messages', 'notes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-[#2F4A3F] text-white'
                  : 'text-[#4A5550] hover:bg-[#EDE8DD]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs">
            <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2.5">
              <div className="flex justify-between py-1 border-b border-[#F6F3EC]">
                <span className="text-[#79827D]">Community:</span>
                <span className="font-semibold text-[#1F2A27]">{lead.communityName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F6F3EC]">
                <span className="text-[#79827D]">Preferred Floor Plan:</span>
                <span className="font-semibold text-[#1F2A27]">{lead.planName || 'Not Selected'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F6F3EC]">
                <span className="text-[#79827D]">Budget Range:</span>
                <span className="font-semibold text-[#1F2A27]">{lead.budgetRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F6F3EC]">
                <span className="text-[#79827D]">Buying Timeline:</span>
                <span className="font-semibold text-[#1F2A27]">{lead.timeline}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F6F3EC]">
                <span className="text-[#79827D]">Pre-Approved:</span>
                <span className={`font-semibold ${lead.preApproved ? 'text-[#4C7A57]' : 'text-[#A5473B]'}`}>
                  {lead.preApproved ? 'Yes (Verified)' : 'Needs Lender Connection'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F6F3EC]">
                <span className="text-[#79827D]">Source Attribution:</span>
                <span className="font-semibold text-[#1F2A27]">{lead.source}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#79827D]">Assigned Counselor:</span>
                <span className="font-semibold text-[#2F4A3F]">{lead.ownerName}</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D] block mb-1.5">
                Tags & Segments:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((t, idx) => (
                  <Badge key={idx} variant="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Next Step */}
            <div className="bg-[#E0E8E3] p-3.5 rounded-[10px] border border-[#C5D5CC]">
              <span className="text-[10px] uppercase font-bold text-[#2F4A3F] block mb-0.5">
                Current Next Step:
              </span>
              <p className="font-medium text-[#1F2A27]">{lead.nextStep}</p>
            </div>
          </div>
        )}

        {/* Tab 2: Activity Stream */}
        {activeTab === 'activity' && (
          <div className="space-y-3">
            {lead.activities.length === 0 ? (
              <p className="text-xs text-[#79827D] italic">No activities logged yet.</p>
            ) : (
              lead.activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1F2A27] flex items-center gap-1.5">
                      {act.isAutomated && (
                        <span className="text-[9px] bg-[#F0DFD5] text-[#B4684A] px-1 py-0.2 rounded font-mono font-bold">
                          BOT
                        </span>
                      )}
                      {act.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#79827D]">{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-[#4A5550] leading-relaxed">{act.description}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Messages */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="space-y-2 max-h-72 overflow-y-auto p-2 bg-[#F6F3EC] rounded-[12px] border border-[#DDD6C8]">
              {lead.messages.length === 0 ? (
                <p className="text-xs text-[#79827D] text-center py-4 italic">
                  No direct chat messages yet.
                </p>
              ) : (
                lead.messages.map((m) => {
                  const isBuyer = m.sender === 'buyer';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-[10px] px-3 py-2 text-xs leading-relaxed ${
                          isBuyer
                            ? 'bg-[#2F4A3F] text-white'
                            : 'bg-white text-[#1F2A27] border border-[#DDD6C8]'
                        }`}
                      >
                        <p>{m.text}</p>
                      </div>
                      <span className="text-[9px] text-[#79827D] mt-0.5 px-1">{m.timestamp}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Send SMS */}
            <form onSubmit={handleSendSms} className="flex gap-2">
              <input
                type="text"
                value={newSmsText}
                onChange={(e) => setNewSmsText(e.target.value)}
                placeholder="Type reply SMS to buyer..."
                className="flex-1 text-xs border border-[#DDD6C8] rounded-[8px] px-3 py-2 text-[#1F2A27] bg-white focus:outline-none focus:border-[#2F4A3F]"
              />
              <Button type="submit" variant="clay" size="sm">
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        )}

        {/* Tab 4: Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Log internal sales counselor note..."
                className="w-full text-xs border border-[#DDD6C8] rounded-[8px] p-2.5 text-[#1F2A27] bg-white focus:outline-none focus:border-[#2F4A3F]"
              />
              <div className="flex justify-end">
                <Button type="submit" variant="secondary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Save Note
                </Button>
              </div>
            </form>

            <div className="space-y-2">
              {lead.notes.map((note, idx) => (
                <div key={idx} className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] text-xs">
                  <p className="text-[#1F2A27] leading-relaxed">{note}</p>
                  <span className="text-[10px] text-[#79827D] block mt-1">Staff Note</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
