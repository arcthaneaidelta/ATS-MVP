import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Eye, ShieldCheck, RotateCcw, Compass, FileText, ArrowRight } from 'lucide-react';

export const GlobalSwitcher: React.FC<{ onOpenTour?: () => void }> = ({ onOpenTour }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetAllData } = useAppStore();

  const isConsole = location.pathname.startsWith('/studio');
  const isProposal = location.pathname === '/proposal';

  return (
    <div className="bg-[#1F2420] text-[#FBFAF7] text-xs px-3.5 py-1.5 flex items-center justify-between border-b border-[#2F4A3E]/40 select-none z-[45] relative">
      {/* Left: View Switcher */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-[#CFC8BA] uppercase tracking-wider hidden sm:inline">
          View Mode:
        </span>
        <div className="inline-flex rounded-md p-0.5 bg-[#263D33] border border-[#2F4A3E]">
          <button
            onClick={() => navigate('/')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              !isConsole && !isProposal
                ? 'bg-primary text-[#FBFAF7] shadow-sm'
                : 'text-[#EFEBE4] hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lead View (Funnel)</span>
          </button>
          <button
            onClick={() => navigate('/studio')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isConsole
                ? 'bg-primary text-[#FBFAF7] shadow-sm'
                : 'text-[#EFEBE4] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Team View (Operator Console)</span>
          </button>
        </div>
      </div>

      {/* Center: Honesty Simulation Chip */}
      <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#CFC8BA]">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span>Interactive Simulation · Built for GoHighLevel Buildout</span>
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-2">
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            className="px-2 py-1 rounded text-[11px] font-medium bg-[#263D33] hover:bg-[#2F4A3E] text-[#FBFAF7] border border-[#2F4A3E] transition-colors flex items-center gap-1"
          >
            <Compass className="w-3 h-3 text-accent" />
            <span>90s Tour</span>
          </button>
        )}

        <button
          onClick={() => navigate('/proposal')}
          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
            isProposal
              ? 'bg-accent text-white font-semibold'
              : 'text-[#CFC8BA] hover:text-white hover:bg-[#263D33]'
          }`}
        >
          <FileText className="w-3 h-3" />
          <span>Proposal & Quote</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo contacts, appointments, and pipeline to clean initial state?')) {
              resetAllData();
            }
          }}
          className="px-2 py-1 rounded text-[11px] text-[#CFC8BA] hover:text-error hover:bg-error/15 transition-colors flex items-center gap-1"
          title="Reset Demo State"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
