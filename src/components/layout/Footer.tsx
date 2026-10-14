import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Mail, ExternalLink, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1F4B4A] text-[#F6F3EE] pt-16 pb-12 mt-20 border-t border-[#173A39]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-12 border-b border-[#2C5F5E] gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#B4643C] bg-[#F3E3D8]/10 px-2 py-0.5 rounded border border-[#B4643C]/30 inline-block mb-3">
              Pragmatic Diagnostic Milestone
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#FFFFFF]">
              Start with a small diagnostic milestone.
            </h2>
            <p className="text-sm text-[#C4DAD7] mt-2 leading-relaxed">
              No expensive rebuild. A written root-cause report first, proving exactly why calls are missed and triggers fail, followed by a scoped fix you approve.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/app/scope">
              <button className="px-5 py-2.5 rounded-[8px] bg-[#F6F3EE] text-[#1F4B4A] font-medium text-sm hover:bg-[#FFFFFF] transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                <span>See Proposed Milestones</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/proposal">
              <button className="px-5 py-2.5 rounded-[8px] border border-[#C4DAD7]/40 text-[#F6F3EE] font-medium text-sm hover:bg-[#173A39] transition-all cursor-pointer">
                Read Proposal Answers
              </button>
            </Link>
          </div>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-b border-[#2C5F5E] text-xs">
          {/* Col 1: Demo Walkthrough */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-[#C4DAD7]" />
              <h4 className="font-semibold text-sm uppercase tracking-wider text-[#FFFFFF]">
                Interactive Demo
              </h4>
            </div>
            <ul className="space-y-2 text-[#C4DAD7]">
              <li>
                <Link to="/app/trace" className="hover:text-white transition-colors">
                  Pipeline Trace (6-stage inspector)
                </Link>
              </li>
              <li>
                <Link to="/app/meetings" className="hover:text-white transition-colors">
                  Missed Meetings & Cause Taxonomy
                </Link>
              </li>
              <li>
                <Link to="/app/delivery" className="hover:text-white transition-colors">
                  Delivery Funnel & Silent Drop-offs
                </Link>
              </li>
              <li>
                <Link to="/app/signals" className="hover:text-white transition-colors">
                  Signal Lab (Keyword vs Context-aware)
                </Link>
              </li>
              <li>
                <Link to="/app/findings" className="hover:text-white transition-colors">
                  Written Findings & Smallest Fixes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Method & Proposal */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#C4DAD7]" />
              <h4 className="font-semibold text-sm uppercase tracking-wider text-[#FFFFFF]">
                Diagnostic Approach
              </h4>
            </div>
            <ul className="space-y-2 text-[#C4DAD7]">
              <li>
                <Link to="/proposal" className="hover:text-white transition-colors">
                  Proposal Answers (Q1 to Q6)
                </Link>
              </li>
              <li>
                <Link to="/app/scope" className="hover:text-white transition-colors">
                  Scope Gate (You keep approval control)
                </Link>
              </li>
              <li>
                <Link to="/app/handoff" className="hover:text-white transition-colors">
                  Operator Runbook & Handoff Doc
                </Link>
              </li>
              <li>
                <span className="text-[#8FAFAc]">
                  Stack: Base44 · Recall.ai · Monday.com
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-[#C4DAD7]" />
              <h4 className="font-semibold text-sm uppercase tracking-wider text-[#FFFFFF]">
                Proposal Verification
              </h4>
            </div>
            <p className="text-[#C4DAD7] mb-2 leading-relaxed">
              Prepared for your Upwork RFP: "Developer Needed to Debug Recall.ai Meeting Bot + AI Workflow".
            </p>
            <div className="space-y-1 font-mono text-[11px] text-[#A6C9C5]">
              <div>Candidate: <span className="text-white font-sans">[YOUR_NAME / Developer Profile]</span></div>
              <div>Direct: <span className="text-white font-sans">[YOUR_EMAIL]</span></div>
              <div className="flex items-center gap-1 mt-1 text-[#C4DAD7]">
                <ExternalLink className="w-3 h-3" />
                <span>Upwork Profile: [YOUR_PROFILE_LINK]</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer / Bottom line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8FAFAC] gap-3">
          <p>
            Illustrative sample diagnostic walkthrough. Not connected to or impersonating any client production database.
          </p>
          <p className="font-mono">
            Revision: 2026.10-RC1 · Ready for client review
          </p>
        </div>
      </div>
    </footer>
  );
};
