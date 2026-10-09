import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Smartphone,
  Monitor,
  ExternalLink,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CommunityFunnelPreview } from './funnel-previews/CommunityFunnelPreview';
import { PlanQuizPreview } from './funnel-previews/PlanQuizPreview';
import { CustomBuildPreview } from './funnel-previews/CustomBuildPreview';

export const FunnelsPage: React.FC = () => {
  const [selectedFunnel, setSelectedFunnel] = useState<'community' | 'quiz' | 'custom'>('community');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showUnderTheHood, setShowUnderTheHood] = useState(true);

  const funnelMeta = {
    community: {
      title: 'Harlow Creek Community Inquiry Funnel',
      url: 'harlowcreek.alderstonehomes.com/vip-lookbook',
      tagsApplied: ['Community: Harlow Creek', 'Source: Paid Meta Ads', 'High Intent'],
      workflowsTriggered: ['Instant Speed-to-Lead (<7s)', 'Harlow Creek VIP Drip', 'Task: 5-Min SLA Call'],
      pipelineStage: 'New Inquiry (Moved to "Tour Booked" on calendar submit)',
    },
    quiz: {
      title: 'Find Your Floor Plan Interactive Quiz',
      url: 'alderstonehomes.com/quiz/find-your-plan',
      tagsApplied: ['Lead Magnet: Floor Plan Quiz', 'Calculated Need: 4 Bed / 3 Bath', 'Segment: Move-Up'],
      workflowsTriggered: ['Instant Floor Plan Match SMS', '90-Day Buyer Nurture Sequence'],
      pipelineStage: 'New Inquiry (Pre-Scored Warm)',
    },
    custom: {
      title: 'Custom & On-Your-Lot Discovery Portal',
      url: 'custom.alderstonehomes.com/consultation',
      tagsApplied: ['Custom Division', 'Owns Acreage: Yes', 'High Ticket: $750k+'],
      workflowsTriggered: ['Custom Feasibility Welcome', 'Assign: Tom Becker (Custom Lead)'],
      pipelineStage: 'Design Consult (High Priority)',
    },
  };

  const currentMeta = funnelMeta[selectedFunnel];

  return (
    <div className="pt-28 pb-20 bg-[#F6F3EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
              Live Funnel Prototypes
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#1F2A27] font-normal mt-2">
              Buyer-Facing Conversion Funnels
            </h1>
            <p className="text-sm text-[#4A5550] mt-2 max-w-xl">
              Experience the actual landing pages your buyers interact with. Toggle device views and
              inspect the automated CRM tags applied on submission.
            </p>
          </div>

          {/* Device Toggle */}
          <div className="flex items-center gap-2 bg-[#EDE8DD] p-1.5 rounded-[10px] border border-[#DDD6C8]">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-[#2F4A3F] text-white shadow-xs'
                  : 'text-[#4A5550] hover:text-[#1F2A27]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop View
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-[#2F4A3F] text-white shadow-xs'
                  : 'text-[#4A5550] hover:text-[#1F2A27]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile (iPhone)
            </button>
          </div>
        </div>

        {/* Funnel Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-[#DDD6C8]">
          <button
            onClick={() => setSelectedFunnel('community')}
            className={`px-4 py-2 rounded-[8px] text-xs font-semibold transition-all ${
              selectedFunnel === 'community'
                ? 'bg-[#2F4A3F] text-white'
                : 'text-[#4A5550] hover:bg-[#EDE8DD]'
            }`}
          >
            1. Harlow Creek Community Inquiry
          </button>
          <button
            onClick={() => setSelectedFunnel('quiz')}
            className={`px-4 py-2 rounded-[8px] text-xs font-semibold transition-all ${
              selectedFunnel === 'quiz'
                ? 'bg-[#2F4A3F] text-white'
                : 'text-[#4A5550] hover:bg-[#EDE8DD]'
            }`}
          >
            2. Floor Plan Matcher Quiz
          </button>
          <button
            onClick={() => setSelectedFunnel('custom')}
            className={`px-4 py-2 rounded-[8px] text-xs font-semibold transition-all ${
              selectedFunnel === 'custom'
                ? 'bg-[#2F4A3F] text-white'
                : 'text-[#4A5550] hover:bg-[#EDE8DD]'
            }`}
          >
            3. Custom / On-Your-Lot Consult
          </button>
        </div>

        {/* Browser Mockup Window */}
        <div className="bg-[#FBF9F4] rounded-[16px] border border-[#C5BCA9] shadow-[0_16px_40px_rgba(31,42,39,0.12)] overflow-hidden mb-8">
          {/* Browser Address Bar */}
          <div className="px-4 py-3 bg-[#EDE8DD] border-b border-[#DDD6C8] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#DDD6C8]" />
              <span className="w-3 h-3 rounded-full bg-[#DDD6C8]" />
              <span className="w-3 h-3 rounded-full bg-[#DDD6C8]" />
            </div>

            <div className="flex-1 max-w-lg bg-white rounded-full px-4 py-1 text-xs text-[#4A5550] flex items-center justify-between border border-[#DDD6C8] font-mono">
              <span className="truncate">https://{currentMeta.url}</span>
              <span className="text-[#4C7A57] text-[10px] uppercase font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> SSL Secured
              </span>
            </div>

            <button
              onClick={() => setShowUnderTheHood(!showUnderTheHood)}
              className="text-xs font-semibold text-[#2F4A3F] hover:underline"
            >
              {showUnderTheHood ? 'Hide Under-The-Hood' : 'Show Under-The-Hood'}
            </button>
          </div>

          {/* Funnel Content Frame */}
          <div className={`p-4 sm:p-8 flex justify-center bg-[#F6F3EC]`}>
            <div
              className={`transition-all duration-300 w-full ${
                deviceMode === 'mobile'
                  ? 'max-w-[375px] bg-[#FBF9F4] rounded-[32px] border-[6px] border-[#1F2A27] p-4 shadow-xl'
                  : 'max-w-4xl bg-[#FBF9F4] rounded-[12px] border border-[#DDD6C8] p-6 sm:p-8'
              }`}
            >
              {selectedFunnel === 'community' && <CommunityFunnelPreview isMobile={deviceMode === 'mobile'} />}
              {selectedFunnel === 'quiz' && <PlanQuizPreview isMobile={deviceMode === 'mobile'} />}
              {selectedFunnel === 'custom' && <CustomBuildPreview isMobile={deviceMode === 'mobile'} />}
            </div>
          </div>
        </div>

        {/* Collapsible "Under The Hood" Technical Inspection Drawer */}
        {showUnderTheHood && (
          <div className="bg-[#1F2A27] text-white p-6 sm:p-8 rounded-[16px] border border-[#3E4E49] space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#34423E] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#B4684A]" />
                <h3 className="font-serif text-lg font-medium">
                  Under the Hood: GoHighLevel Automations Triggered on Submit
                </h3>
              </div>
              <Badge variant="clay">Active Funnel Logic</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div>
                <span className="text-[#A7B3AE] uppercase text-[10px] font-semibold tracking-wider block mb-1.5">
                  CRM Tags Automatically Attached:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentMeta.tagsApplied.map((t, idx) => (
                    <span
                      key={idx}
                      className="bg-[#263330] text-[#C5D5CC] border border-[#3E4E49] px-2 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#A7B3AE] uppercase text-[10px] font-semibold tracking-wider block mb-1.5">
                  Workflows Instantly Enrolled:
                </span>
                <div className="space-y-1">
                  {currentMeta.workflowsTriggered.map((w, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[#C5D5CC]">
                      <CheckCircle2 className="w-3 h-3 text-[#4C7A57]" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#A7B3AE] uppercase text-[10px] font-semibold tracking-wider block mb-1.5">
                  Pipeline Stage Allocation:
                </span>
                <div className="bg-[#263330] p-2 rounded border border-[#3E4E49] text-[#C5D5CC]">
                  {currentMeta.pipelineStage}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
