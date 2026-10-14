import React from 'react';
import type { TimelineLogEntry } from '../../types';

export const LogLine: React.FC<{ entry: TimelineLogEntry }> = ({ entry }) => {
  const levelStyles = {
    info: 'text-[#3E6A8A] bg-[#DEE9F1]/60 border-[#C3D7E5]',
    warn: 'text-[#B58A2B] bg-[#F4EAD0]/60 border-[#E8DCBF]',
    error: 'text-[#A8433A] bg-[#F5DEDA] border-[#EBC2BC] font-semibold',
    debug: 'text-[#7B8786] bg-[#E2DDD3]/50 border-[#CFC8BB]'
  }[entry.level];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-baseline py-2 px-3 border-b border-[#E2DDD3]/50 hover:bg-[#FBF9F6] transition-colors font-mono text-xs gap-2">
      {/* Timestamp */}
      <span className="text-[#7B8786] shrink-0 text-[11px] select-all">
        {entry.timestamp}
      </span>

      {/* Level Tag */}
      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border shrink-0 ${levelStyles}`}>
        {entry.level}
      </span>

      {/* System tag */}
      <span className="text-[#1F4B4A] font-semibold shrink-0 text-[11px] bg-[#E3EDEB] px-1.5 py-0.2 rounded border border-[#CFC8BB]">
        {entry.system}
      </span>

      {/* Event name & details */}
      <div className="flex-1 min-w-0 font-sans sm:font-mono text-xs text-[#1E2A2B]">
        <span className="font-semibold text-[#1E2A2B] font-mono mr-2">{entry.event}:</span>
        <span className="text-[#4A5757] break-words">{entry.details}</span>
      </div>
    </div>
  );
};
