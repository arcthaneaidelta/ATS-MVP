import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Play, CheckCircle2, Clock, FileText, ArrowRight } from 'lucide-react';
import { academyChapters } from '../../data/chapters';

export const TeamAcademyTeaser: React.FC = () => {
  return (
    <section className="py-20 bg-[#FBF9F4] border-t border-b border-[#DDD6C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Video Mockup Player */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[16px] overflow-hidden border border-[#C5BCA9] bg-[#1F2A27] shadow-[0_16px_40px_rgba(31,42,39,0.14)] group">
              {/* Aspect Ratio 16:9 Screen */}
              <div className="aspect-video w-full flex flex-col justify-between p-6 sm:p-8 bg-[#1B2D26] relative">
                {/* Architectural site plan watermark */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg viewBox="0 0 800 450" fill="none" className="w-full h-full object-cover">
                    <circle cx="400" cy="225" r="160" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="200" y1="225" x2="600" y2="225" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="400" y1="100" x2="400" y2="350" stroke="#FFFFFF" strokeWidth="1" />
                  </svg>
                </div>

                {/* Top Overlay Badge */}
                <div className="flex items-center justify-between relative z-10">
                  <Badge variant="clay">Deliverable #8</Badge>
                  <span className="font-mono text-xs text-white bg-black/40 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B4684A]" />
                    Total Runtime: 60:00
                  </span>
                </div>

                {/* Center Play Button & Title */}
                <div className="text-center relative z-10 my-auto">
                  <Link to="/academy" className="inline-block group-hover:scale-105 transition-transform">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#B4684A] text-white flex items-center justify-center shadow-lg mx-auto mb-3">
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                    </div>
                  </Link>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
                    Alder & Stone Homes Team Operating Playbook
                  </h3>
                  <p className="text-xs text-[#A7B3AE] mt-1">
                    Recorded specifically for Robert, Dana, Marcus, Priya, Tom & Leah
                  </p>
                </div>

                {/* Bottom Scrub Bar Mockup */}
                <div className="relative z-10 space-y-1">
                  <div className="flex justify-between text-[10px] text-[#A7B3AE] font-mono">
                    <span>Chapter 1: Welcome & Setup</span>
                    <span>60:00</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#B4684A] w-[18%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Chapters & Handover Guarantee */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0E8E3] text-[#2F4A3F] text-xs font-semibold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Team Adoption Guaranteed
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal leading-tight">
                A 60-Minute Video Training So Your Team Actually Uses It
              </h2>
              <p className="text-sm text-[#4A5550] mt-3 leading-relaxed">
                Most CRM setups fail because agents get overwhelmed and go back to sticky notes.
                Groundwork delivers a bespoke, chapter-indexed video training walking your team through
                every click, plus downloadable role-based SOP checklists.
              </p>
            </div>

            {/* Chapter Checklist Summary */}
            <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#79827D] mb-1">
                Included Video Chapters:
              </div>
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-2">
                {academyChapters.slice(0, 5).map((ch) => (
                  <div key={ch.id} className="flex items-center justify-between text-xs py-1 border-b border-[#F6F3EC]">
                    <span className="text-[#1F2A27] truncate mr-2">
                      {ch.number}. {ch.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#79827D] shrink-0">
                      {ch.durationMinutes}:00
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#B4684A] font-medium pt-1">
                + 3 more chapters covering Social, Reports & US Compliance
              </p>
            </div>

            <div className="pt-2">
              <Link to="/academy">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Full Academy Player (/academy)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
