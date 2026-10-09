import React from 'react';
import { useDemoStore } from '../../store/demoStore';
import { RotateCcw } from 'lucide-react';

export const ResetDemoChip: React.FC = () => {
  const { resetDemo } = useDemoStore();

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none">
      <button
        onClick={resetDemo}
        className="flex items-center gap-1.5 bg-[#1F2A27]/90 hover:bg-[#1F2A27] text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(31,42,39,0.18)] border border-[#3E4E49] transition-all hover:scale-105 active:scale-95 backdrop-blur-xs"
        title="Reset all demo state to original 40 leads"
      >
        <RotateCcw className="w-3 h-3 text-[#B4684A]" />
        <span>Reset Demo</span>
      </button>
    </div>
  );
};
