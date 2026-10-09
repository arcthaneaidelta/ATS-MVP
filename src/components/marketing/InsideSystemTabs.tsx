import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Kanban,
  MessageSquare,
  Share2,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
} from 'lucide-react';

export const InsideSystemTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'inbox' | 'social' | 'reports'>('pipeline');

  const tabs = [
    { id: 'pipeline', label: 'Sales Pipeline (Kanban)', icon: <Kanban className="w-4 h-4" /> },
    { id: 'inbox', label: 'Unified Multi-Channel Inbox', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'social', label: 'Social Planner & Scheduler', icon: <Share2 className="w-4 h-4" /> },
    { id: 'reports', label: 'Attribution & Conversion Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <section className="py-20 bg-[#F6F3EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
              The Operating System
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal mt-2">
              Inside the Groundwork Platform
            </h2>
            <p className="text-sm text-[#4A5550] mt-2 max-w-xl">
              An enterprise-grade GoHighLevel environment custom-tailored for Alder & Stone Homes.
            </p>
          </div>
          <Link to="/app">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Operating App (/app)
            </Button>
          </Link>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-[#DDD6C8]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#2F4A3F] text-white shadow-xs'
                    : 'text-[#4A5550] hover:text-[#1F2A27] hover:bg-[#EDE8DD]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Tab Showcase Content */}
        <div className="bg-[#FBF9F4] rounded-[16px] border border-[#C5BCA9] p-6 sm:p-8 shadow-xs">
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
                    7-Stage Sales Pipeline with Automated Stage Triggers
                  </h3>
                  <p className="text-xs text-[#79827D] mt-1">
                    Moving a card between columns triggers automated reminders, lot hold notices, and task queues.
                  </p>
                </div>
                <Link to="/app/pipeline">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Interactive Drag & Drop
                  </Button>
                </Link>
              </div>

              {/* Mock Kanban Columns Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#F6F3EC] p-3.5 rounded-[12px] border border-[#DDD6C8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#1F2A27]">New Inquiry</span>
                    <span className="text-[10px] font-mono bg-[#DDD6C8] px-1.5 py-0.5 rounded">3</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-[8px] border border-[#DDD6C8] shadow-2xs">
                      <div className="text-xs font-semibold text-[#1F2A27]">Chad & Megan Sterling</div>
                      <div className="text-[10px] text-[#4A5550]">Marrow Ridge • $560k</div>
                      <Badge variant="clay" className="mt-2">Speed-to-Lead</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F6F3EC] p-3.5 rounded-[12px] border border-[#DDD6C8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#1F2A27]">Tour Booked</span>
                    <span className="text-[10px] font-mono bg-[#DDD6C8] px-1.5 py-0.5 rounded">4</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-[8px] border border-[#DDD6C8] shadow-2xs">
                      <div className="text-xs font-semibold text-[#1F2A27]">Marcus & Elena Reyes</div>
                      <div className="text-[10px] text-[#4A5550]">Harlow Creek • Calder</div>
                      <Badge variant="success" className="mt-2">Sat 11:00 AM</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F6F3EC] p-3.5 rounded-[12px] border border-[#DDD6C8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#1F2A27]">Design Consult</span>
                    <span className="text-[10px] font-mono bg-[#DDD6C8] px-1.5 py-0.5 rounded">2</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-[8px] border border-[#DDD6C8] shadow-2xs">
                      <div className="text-xs font-semibold text-[#1F2A27]">Kevin Patel (Custom)</div>
                      <div className="text-[10px] text-[#4A5550]">Mint Hill Acreage • $820k</div>
                      <Badge variant="info" className="mt-2">Soil Perk Verified</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F6F3EC] p-3.5 rounded-[12px] border border-[#DDD6C8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#1F2A27]">Contract Signed</span>
                    <span className="text-[10px] font-mono bg-[#DDD6C8] px-1.5 py-0.5 rounded">2</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-[8px] border border-[#DDD6C8] shadow-2xs">
                      <div className="text-xs font-semibold text-[#1F2A27]">David & Sarah Jenkins</div>
                      <div className="text-[10px] text-[#4A5550]">Harlow Creek Lot 19</div>
                      <Badge variant="pine" className="mt-2">EMD Deposited</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
                    Unified Multi-Channel Communications Inbox
                  </h3>
                  <p className="text-xs text-[#79827D] mt-1">
                    SMS, Email, Instagram DMs, and Google Business Messages unified in one thread with automated pill indicators.
                  </p>
                </div>
                <Link to="/app/conversations">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open Live Inbox
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-[12px] border border-[#DDD6C8]">
                <div className="border-r border-[#EDE8DD] pr-4 space-y-2">
                  <div className="text-xs font-semibold text-[#1F2A27] pb-2 border-b border-[#EDE8DD]">
                    Recent Channels
                  </div>
                  <div className="bg-[#F6F3EC] p-2.5 rounded-md text-xs font-medium text-[#1F2A27]">
                    Marcus Reyes (SMS)
                  </div>
                  <div className="p-2.5 rounded-md text-xs text-[#4A5550] hover:bg-[#F6F3EC]">
                    Jasmine Thornton (Email)
                  </div>
                  <div className="p-2.5 rounded-md text-xs text-[#4A5550] hover:bg-[#F6F3EC]">
                    Instagram Buyer (DM)
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="bg-[#EDE8DD] p-3 rounded-[10px] text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#B4684A] block mb-1">
                      Automated Message (Dana Whitfield)
                    </span>
                    Hi Marcus! Thanks for asking about Harlow Creek. Want a quick tour this weekend?
                  </div>
                  <div className="bg-[#2F4A3F] text-white p-3 rounded-[10px] text-xs ml-auto max-w-sm">
                    Saturday 11am works perfect! Elena and I will be there.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
                    Social Planner with Evergreen Builder Content Queues
                  </h3>
                  <p className="text-xs text-[#79827D] mt-1">
                    Auto-schedules 14 to 30 days of architectural photography, construction updates, and buydown financing tips.
                  </p>
                </div>
                <Link to="/app/social">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Open Social Planner
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2">
                  <Badge variant="clay">Instagram</Badge>
                  <h4 className="text-xs font-semibold text-[#1F2A27]">The Calder Gourmet Kitchen</h4>
                  <p className="text-[11px] text-[#79827D]">
                    Comment "PRICE" triggered 29 direct DMs and 4 booked model tours this week.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2">
                  <Badge variant="pine">Facebook</Badge>
                  <h4 className="text-xs font-semibold text-[#1F2A27]">2x6 Framing & Behind the Drywall</h4>
                  <p className="text-[11px] text-[#79827D]">
                    Educational reel highlighting sealed crawlspace and structural craft difference.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2">
                  <Badge variant="info">Google Business</Badge>
                  <h4 className="text-xs font-semibold text-[#1F2A27]">2-1 Rate Buydown Announcement</h4>
                  <p className="text-[11px] text-[#79827D]">
                    Broadcast to local Fort Mill and Charlotte searchers visiting our Google Maps pin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
                    True Channel Attribution & Cost-Per-Contract Tracking
                  </h3>
                  <p className="text-xs text-[#79827D] mt-1">
                    Know exactly which ad dollar produced the closed home purchase agreement.
                  </p>
                </div>
                <Link to="/app/reports">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Attribution Dashboard
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8]">
                  <div className="text-[10px] uppercase font-semibold text-[#79827D]">Total Leads (30d)</div>
                  <div className="font-serif text-2xl text-[#1F2A27] font-semibold mt-1">312</div>
                  <div className="text-[10px] text-[#4C7A57] font-medium">+18% vs prev period</div>
                </div>

                <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8]">
                  <div className="text-[10px] uppercase font-semibold text-[#79827D]">Median Response</div>
                  <div className="font-serif text-2xl text-[#1F2A27] font-semibold mt-1">0:41 sec</div>
                  <div className="text-[10px] text-[#4C7A57] font-medium">71% under 1 minute</div>
                </div>

                <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8]">
                  <div className="text-[10px] uppercase font-semibold text-[#79827D]">Cost Per Lead</div>
                  <div className="font-serif text-2xl text-[#1F2A27] font-semibold mt-1">$38</div>
                  <div className="text-[10px] text-[#79827D]">Meta + Google blended</div>
                </div>

                <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8]">
                  <div className="text-[10px] uppercase font-semibold text-[#79827D]">Cost Per Contract</div>
                  <div className="font-serif text-2xl text-[#1F2A27] font-semibold mt-1">$847</div>
                  <div className="text-[10px] text-[#4C7A57] font-medium">14 Contracts Signed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
