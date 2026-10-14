import React from 'react';
import type { TranscriptLine, SignalItem } from '../../types';

interface TranscriptViewProps {
  lines: TranscriptLine[];
  activeSignals: SignalItem[];
  selectedSignalId?: string;
  onSelectSignal?: (signalId: string) => void;
  mode: 'keyword' | 'context';
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  lines,
  activeSignals,
  selectedSignalId,
  onSelectSignal,
  mode
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD3] mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
            Source Transcript Audio Log
          </span>
          <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
            Verbatim Call Dialogue
          </h3>
        </div>
        <span className="text-xs font-mono text-[#7B8786] bg-[#FBF9F6] px-2 py-0.5 rounded border border-[#E2DDD3]">
          {lines.length} utterance turns
        </span>
      </div>

      <div className="space-y-3.5 overflow-y-auto max-h-[540px] pr-2">
        {lines.map((line) => {
          // Check if any active signal quotes this line
          const matchedSignal = activeSignals.find(
            (s) => line.text.includes(s.quote.slice(0, 25)) || s.quote.includes(line.text.slice(0, 25))
          );
          const isSelected = matchedSignal && matchedSignal.id === selectedSignalId;

          return (
            <div
              key={line.id}
              onClick={() => matchedSignal && onSelectSignal?.(matchedSignal.id)}
              className={`p-3 rounded-[10px] transition-all text-xs ${
                isSelected
                  ? 'bg-[#F3E3D8] border border-[#E6C7B6] shadow-sm'
                  : matchedSignal
                  ? mode === 'keyword' && matchedSignal.verdict === 'false_positive'
                    ? 'bg-[#F5DEDA]/50 border border-[#EBC2BC]/70'
                    : 'bg-[#E3EDEB]/40 border border-[#C4DAD7]/60'
                  : 'hover:bg-[#FBF9F6] border border-transparent'
              } ${matchedSignal ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-center justify-between text-[11px] text-[#7B8786] mb-1 font-mono">
                <span className="font-semibold text-[#1E2A2B]">{line.speaker}</span>
                <span>{line.timestamp}</span>
              </div>
              <p
                className={`text-[#1E2A2B] leading-relaxed text-[13px] ${
                  matchedSignal
                    ? mode === 'keyword' && matchedSignal.verdict === 'false_positive'
                      ? 'underline decoration-[#A8433A] decoration-wavy decoration-1'
                      : 'underline decoration-[#1F4B4A] decoration-1'
                    : ''
                }`}
              >
                {line.text}
              </p>

              {matchedSignal && (
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded font-bold ${
                      matchedSignal.verdict === 'false_positive'
                        ? 'bg-[#F5DEDA] text-[#A8433A]'
                        : 'bg-[#E1EEE6] text-[#3F7D5B]'
                    }`}
                  >
                    {matchedSignal.type} · {matchedSignal.verdict === 'false_positive' ? 'False Positive' : 'Active Signal'}
                  </span>
                  <span className="text-[10px] text-[#7B8786]">Click to view card</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
