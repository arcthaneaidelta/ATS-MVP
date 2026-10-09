import React, { useState } from 'react';
import { CommunityFunnelPreview } from '../marketing/funnel-previews/CommunityFunnelPreview';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, SplitSquareVertical, ArrowRight } from 'lucide-react';
import { useDemoStore } from '../../store/demoStore';

export const CommunityFunnelStandalonePage: React.FC = () => {
  const [splitView, setSplitView] = useState(false);
  const { leads } = useDemoStore();

  return (
    <div className="min-h-screen bg-[#F6F3EC] py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Floating Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#FBF9F4] p-3.5 rounded-[14px] border border-[#DDD6C8] shadow-xs">
        <div className="flex items-center gap-3">
          <Link to="/funnels" className="text-xs text-[#79827D] hover:text-[#1F2A27] flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Funnels Gallery
          </Link>
          <span className="text-[#DDD6C8]">•</span>
          <span className="text-xs font-semibold text-[#1F2A27]">
            harlowcreek.alderstonehomes.com (Fort Mill, SC)
          </span>
        </div>

        {/* Split View Toggle (§10.14) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSplitView(!splitView)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              splitView
                ? 'bg-[#2F4A3F] text-white shadow-xs'
                : 'bg-white text-[#1F2A27] border border-[#DDD6C8] hover:border-[#2F4A3F]'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>{splitView ? 'Close Split CRM View' : 'Split View: See Both Sides Live'}</span>
          </button>
          <Link to="/app/pipeline">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open CRM
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Container (Split or Single) */}
      <div className="max-w-6xl mx-auto">
        <div className={`grid ${splitView ? 'grid-cols-1 lg:grid-cols-12 gap-8' : 'grid-cols-1'}`}>
          {/* Buyer-Facing Funnel */}
          <div
            className={`${
              splitView ? 'lg:col-span-7' : 'max-w-3xl mx-auto'
            } bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#DDD6C8] shadow-sm`}
          >
            <CommunityFunnelPreview />
          </div>

          {/* CRM Live Side (Split View Feature) */}
          {splitView && (
            <div className="lg:col-span-5 bg-[#1F2A27] text-white p-6 rounded-[16px] border border-[#3E4E49] space-y-4 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#34423E] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#B4684A] tracking-wider block">
                    Builder's View (Live CRM Side)
                  </span>
                  <h3 className="font-serif text-lg text-white font-medium">
                    Alder & Stone CRM Pipeline
                  </h3>
                </div>
                <Badge variant="clay">Live Synced</Badge>
              </div>

              <p className="text-xs text-[#A7B3AE] leading-relaxed">
                When a buyer submits the Harlow Creek form on the left, watch this panel receive the
                lead in real time, trigger the 7-second text, and dispatch the calendar invite:
              </p>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {leads.slice(0, 5).map((l) => (
                  <div
                    key={l.id}
                    className="p-3 bg-[#263330] rounded-[10px] border border-[#3E4E49] text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-white">{l.name}</strong>
                      <span className="text-[10px] font-mono text-[#B4684A]">{l.score} Lead</span>
                    </div>
                    <div className="text-[11px] text-[#C5D5CC]">
                      {l.communityName} • {l.budgetRange}
                    </div>
                    <div className="text-[10px] text-[#A7B3AE] pt-1 border-t border-[#34423E] flex justify-between">
                      <span>Stage: {l.stage.replace('_', ' ')}</span>
                      <span>{l.lastTouch}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
