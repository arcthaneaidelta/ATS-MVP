import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, Activity, Sparkles, MoreHorizontal, CalendarX2, GitFork, ClipboardList, CheckSquare, BookOpen, HelpCircle, X } from 'lucide-react';

export const MobileTabBar: React.FC = () => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const mainTabs = [
    { label: 'Overview', to: '/app', icon: Layers, end: true },
    { label: 'Trace', to: '/app/trace', icon: Activity, end: false },
    { label: 'Signals', to: '/app/signals', icon: Sparkles, end: false }
  ];

  const moreTabs = [
    { label: 'Missed Meetings', to: '/app/meetings', icon: CalendarX2 },
    { label: 'Delivery Funnel', to: '/app/delivery', icon: GitFork },
    { label: 'Findings Report', to: '/app/findings', icon: ClipboardList },
    { label: 'Scope Gate & Milestones', to: '/app/scope', icon: CheckSquare },
    { label: 'Handoff Doc', to: '/app/handoff', icon: BookOpen },
    { label: 'Proposal Answers (Q1–Q6)', to: '/proposal', icon: HelpCircle }
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#FFFFFF] border-t border-[#E2DDD3] flex items-center justify-around px-2 shadow-[0_-2px_10px_rgba(30,42,43,0.06)]">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-[#1F4B4A] font-semibold' : 'text-[#7B8786]'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}

        <button
          onClick={() => setSheetOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium text-[#7B8786] hover:text-[#1E2A2B]"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>

      {/* Bottom Sheet for 'More' */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-[#1E2A2B]/40 transition-opacity"
            onClick={() => setSheetOpen(false)}
          />
          <div className="relative bg-[#FFFFFF] rounded-t-[16px] border-t border-[#CFC8BB] p-4 shadow-[0_-16px_40px_rgba(30,42,43,0.18)] max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3] mb-3">
              <span className="font-serif font-medium text-lg text-[#1E2A2B]">More Screens</span>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-1 text-[#7B8786] hover:text-[#1E2A2B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 pb-6">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSheetOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-[#E2DDD3] bg-[#FBF9F6] text-xs font-medium text-[#1E2A2B] hover:bg-[#E3EDEB]"
                  >
                    <Icon className="w-4 h-4 text-[#1F4B4A] shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
