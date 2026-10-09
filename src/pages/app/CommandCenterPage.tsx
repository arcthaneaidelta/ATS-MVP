import React from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  PhoneCall,
  MessageSquare,
  Calendar,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CommandCenterPage: React.FC = () => {
  const {
    leads,
    currentUserRole,
    setSelectedLeadId,
    liveActivityEnabled,
    setLiveActivityEnabled,
    moveLeadStage,
  } = useDemoStore();
  const navigate = useNavigate();

  const roleNames = {
    owner: 'Robert Alder (Owner & Principal)',
    osc: 'Dana Whitfield (Lead Online Sales Counselor)',
    agent: 'Priya Raman (Harlow Creek Sales Manager)',
  };

  const newLeads = leads.filter((l) => l.stage === 'new');
  const hotLeads = leads.filter((l) => l.score === 'Hot');
  const bookedTours = leads.filter((l) => l.stage === 'tour_booked');
  const contracts = leads.filter((l) => l.stage === 'contract_signed' || l.stage === 'closed_won');

  // "Needs Action" Priority Items
  const needsActionItems = [
    {
      id: 'act-1',
      leadId: 'lead-8',
      name: 'Chad & Megan Sterling',
      title: 'Overdue First Call (<5 min SLA)',
      subtitle: 'Inquired about quick move-in inventory at Marrow Ridge 15 min ago',
      urgency: 'high',
      phone: '(704) 555-0138',
      action: 'Call Buyer Now',
    },
    {
      id: 'act-2',
      leadId: 'lead-1',
      name: 'Marcus & Elena Reyes',
      title: 'Tour Confirmed — Assign Model Host',
      subtitle: 'Saturday 11:00 AM at Harlow Creek (The Calder Lot 14)',
      urgency: 'medium',
      phone: '(704) 555-0142',
      action: 'Open Conversation',
    },
    {
      id: 'act-3',
      leadId: 'lead-2',
      name: 'Kevin Patel',
      title: 'Site Feasibility Notes Needed',
      subtitle: 'Uploaded Mint Hill acreage soil test survey for custom build',
      urgency: 'medium',
      phone: '(704) 555-0183',
      action: 'View Lead Details',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Greeting & Live Activity Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD6C8] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
              Daily Operating Briefing
            </span>
            <span className="text-xs text-[#79827D]">•</span>
            <span className="text-xs text-[#79827D]">October 9, 2026</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal mt-1">
            Good morning, {roleNames[currentUserRole].split(' ')[0]}.
          </h1>
          <p className="text-sm text-[#4A5550] mt-1">
            {newLeads.length} new inquiries arrived overnight. Speed-to-lead automation is active
            across all 3 communities.
          </p>
        </div>

        {/* Live Ingestion Sim Toggle */}
        <div className="flex items-center gap-3 bg-[#FBF9F4] p-3 rounded-[12px] border border-[#DDD6C8]">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                liveActivityEnabled ? 'bg-[#4C7A57] animate-pulse' : 'bg-[#79827D]'
              }`}
            />
            <span className="text-xs font-medium text-[#1F2A27]">
              Live Ingestion Simulation
            </span>
          </div>
          <button
            onClick={() => setLiveActivityEnabled(!liveActivityEnabled)}
            className={`text-xs px-2.5 py-1 rounded font-semibold transition-colors ${
              liveActivityEnabled
                ? 'bg-[#E3EEE4] text-[#4C7A57]'
                : 'bg-[#EDE8DD] text-[#79827D]'
            }`}
          >
            {liveActivityEnabled ? 'Active (45s)' : 'Paused'}
          </button>
        </div>
      </div>

      {/* 2. Needs Action Queue (Top Priority per PRD §12) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl text-[#1F2A27] font-medium">Needs Immediate Action</h2>
            <Badge variant="clay">{needsActionItems.length} Urgent</Badge>
          </div>
          <span className="text-xs text-[#79827D]">Prioritized by response SLA countdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {needsActionItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8] hover:border-[#C5BCA9] transition-all flex flex-col justify-between space-y-3 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#1F2A27]">{item.name}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      item.urgency === 'high'
                        ? 'bg-[#F3DEDA] text-[#A5473B]'
                        : 'bg-[#F5EBD0] text-[#8C6418]'
                    }`}
                  >
                    {item.urgency}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#B4684A] leading-snug">{item.title}</h4>
                <p className="text-[11px] text-[#79827D] mt-1 leading-relaxed">{item.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-[#EDE8DD] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#79827D]">{item.phone}</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedLeadId(item.leadId);
                  }}
                >
                  {item.action}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. KPI Metrics Row (PRD §12) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">New Leads (Last 7d)</div>
          <div className="font-serif text-3xl text-[#1F2A27] font-semibold mt-1">38</div>
          <div className="text-[11px] text-[#4C7A57] font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% vs prior week
          </div>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Median Response Time</div>
          <div className="font-serif text-3xl text-[#1F2A27] font-semibold mt-1">0:41 <span className="text-sm font-normal text-[#79827D]">sec</span></div>
          <div className="text-[11px] text-[#4C7A57] font-medium flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5" /> 71% under 1 minute
          </div>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Tours Booked (30d)</div>
          <div className="font-serif text-3xl text-[#1F2A27] font-semibold mt-1">96</div>
          <div className="text-[11px] text-[#4C7A57] font-medium flex items-center gap-1 mt-1">
            <Calendar className="w-3.5 h-3.5" /> 31% inquiry-to-tour conversion
          </div>
        </div>

        <div className="bg-[#FBF9F4] p-5 rounded-[14px] border border-[#DDD6C8]">
          <div className="text-[10px] uppercase font-semibold text-[#79827D]">Contracts Signed</div>
          <div className="font-serif text-3xl text-[#1F2A27] font-semibold mt-1">14</div>
          <div className="text-[11px] text-[#2F4A3F] font-semibold mt-1">
            $7.2M Total Sales Volume
          </div>
        </div>
      </div>

      {/* 4. Pipeline Snapshot & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Pipeline Distribution Snapshot */}
        <div className="lg:col-span-7 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-[#1F2A27] font-medium">Pipeline Distribution</h3>
              <p className="text-xs text-[#79827D] mt-0.5">Active buyers across stages</p>
            </div>
            <Link to="/app/pipeline">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Open Kanban
              </Button>
            </Link>
          </div>

          {/* Horizontal Stacked Bar */}
          <div className="space-y-2">
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#EDE8DD]">
              <div style={{ width: '25%' }} className="bg-[#4B6A82]" title="New Inquiries (25%)" />
              <div style={{ width: '30%' }} className="bg-[#B98A2E]" title="Contacted (30%)" />
              <div style={{ width: '22%' }} className="bg-[#4C7A57]" title="Tours Booked (22%)" />
              <div style={{ width: '13%' }} className="bg-[#B4684A]" title="Design Consult (13%)" />
              <div style={{ width: '10%' }} className="bg-[#2F4A3F]" title="Contracts (10%)" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#4A5550] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4B6A82]" />
                <span>New ({leads.filter((l) => l.stage === 'new').length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B98A2E]" />
                <span>Contacted ({leads.filter((l) => l.stage === 'contacted').length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4C7A57]" />
                <span>Tour Booked ({bookedTours.length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B4684A]" />
                <span>Design ({leads.filter((l) => l.stage === 'design_consult').length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F4A3F]" />
                <span>Contract ({contracts.length})</span>
              </div>
            </div>
          </div>

          {/* Quick Lead Jump List */}
          <div className="space-y-2 pt-2 border-t border-[#EDE8DD]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#79827D] block">
              Recently Active High-Intent Buyers:
            </span>
            {hotLeads.slice(0, 4).map((hl) => (
              <div
                key={hl.id}
                onClick={() => setSelectedLeadId(hl.id)}
                className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] hover:border-[#C5BCA9] flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#1F2A27]">{hl.name}</span>
                  <span className="text-[11px] text-[#79827D] ml-2">
                    {hl.communityName} • {hl.planName || hl.budgetRange}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="clay">{hl.score} Lead</Badge>
                  <ArrowRight className="w-3.5 h-3.5 text-[#79827D]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Live Ingestion Stream */}
        <div className="lg:col-span-5 bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#4C7A57]" /> Live Lead Activity
            </h3>
            <span className="text-[10px] font-mono text-[#79827D]">Real-Time Feed</span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {leads.slice(0, 6).map((leadItem) => (
              <div
                key={leadItem.id}
                onClick={() => setSelectedLeadId(leadItem.id)}
                className="p-3 bg-white rounded-[10px] border border-[#DDD6C8] space-y-1 text-xs cursor-pointer hover:border-[#2F4A3F] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#1F2A27] truncate mr-2">
                    {leadItem.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#79827D] shrink-0">
                    {leadItem.lastTouch}
                  </span>
                </div>
                <p className="text-[11px] text-[#4A5550]">
                  {leadItem.nextStep}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-[#79827D]">
                  <span>{leadItem.communityName}</span>
                  <span className="text-[#2F4A3F] font-semibold">{leadItem.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
