import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { Search, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { setCommandPaletteOpen } = useDemoStore();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/app':
        return 'Overview & Reliability KPIs';
      case '/app/trace':
        return 'Pipeline Trace';
      case '/app/meetings':
        return 'Missed Meetings Forensics';
      case '/app/delivery':
        return 'Delivery Funnel Reconciliation';
      case '/app/signals':
        return 'Signal Lab';
      case '/app/findings':
        return 'Diagnostic Findings';
      case '/app/scope':
        return 'Scope Gate & Milestones';
      case '/app/handoff':
        return 'Operator Handoff Runbook';
      case '/proposal':
        return 'Proposal Answers (Q1–Q6)';
      default:
        return 'Diagnostic Console';
    }
  };

  return (
    <header className="h-14 bg-[#FFFFFF] border-b border-[#E2DDD3] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-[0_1px_2px_rgba(30,42,43,0.03)]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <Link to="/" className="text-[#7B8786] hover:text-[#1F4B4A] transition-colors font-medium">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#CFC8BB]" />
        <Link to="/app" className="text-[#7B8786] hover:text-[#1F4B4A] transition-colors font-medium">
          Diagnostic Demo
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#CFC8BB]" />
        <span className="font-semibold text-[#1E2A2B] truncate max-w-[200px] sm:max-w-none">
          {getPageTitle(location.pathname)}
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Systems in scope chip (PRD Req 10) */}
        <div
          className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F6F3EE] border border-[#E2DDD3] text-[11px] text-[#4A5757]"
          title="Verified integrations in scope"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5B]" />
          <span>Scope: Base44 · Recall.ai · Monday.com</span>
        </div>

        {/* Date range badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[#CFC8BB] text-xs text-[#4A5757] bg-[#FBF9F6]">
          <Calendar className="w-3.5 h-3.5 text-[#7B8786]" />
          <span>Last 14 days</span>
        </div>

        {/* Command palette search button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] border border-[#CFC8BB] bg-[#FBF9F6] text-xs text-[#7B8786] hover:text-[#1E2A2B] hover:border-[#1F4B4A] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search trace...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] font-mono bg-[#E2DDD3] text-[#4A5757] rounded border border-[#CFC8BB]">
            ⌘K
          </kbd>
        </button>

        {/* User avatar indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E2DDD3]">
          <div className="w-7 h-7 rounded-full bg-[#1F4B4A] text-[#F6F3EE] flex items-center justify-center text-xs font-serif font-medium">
            D
          </div>
          <div className="hidden md:block text-left leading-none">
            <span className="text-xs font-medium text-[#1E2A2B] block">Demo Viewer</span>
            <span className="text-[10px] text-[#3F7D5B] flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" /> Read-only mode
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
