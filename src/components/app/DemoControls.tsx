import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, RotateCcw, FastForward, AlertTriangle, EyeOff, X } from 'lucide-react';

export function DemoControls() {
  const [isOpen, setIsOpen] = useState(false);
  const fastForward = useAppStore((state) => state.fastForward);
  const resetDemo = useAppStore((state) => state.resetDemo);
  const demoFlags = useAppStore((state) => state.demoFlags);
  const setDemoFlag = useAppStore((state) => state.setDemoFlag);

  return (
    <div className="relative inline-block text-left select-none">
      {/* Trigger chip */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="chip chip-demo flex items-center gap-1.5 hover:bg-surface transition-all text-xs cursor-pointer shadow-1"
        aria-expanded={isOpen}
      >
        <Sparkles size={12} className="text-primary" />
        <span className="font-semibold text-primary">Demo controls</span>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-surface border border-line rounded-lg shadow-sheet p-3 z-50 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-line mb-2">
            <span className="font-semibold text-ink uppercase tracking-wider text-[10px]">
              Demo scenario tools
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-ink-3 hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                fastForward(5);
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-2 flex items-center gap-2 font-medium text-ink"
            >
              <FastForward size={14} className="text-primary" />
              <span>Fast-forward 5 days (trigger push)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                resetDemo();
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-2 flex items-center gap-2 font-medium text-ink"
            >
              <RotateCcw size={14} className="text-ink-2" />
              <span>Reset demo state</span>
            </button>

            <div className="pt-2 border-t border-line/60 space-y-1">
              <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-surface-2 cursor-pointer">
                <span className="flex items-center gap-1.5 text-ink-2">
                  <EyeOff size={13} />
                  <span>Show empty state</span>
                </span>
                <input
                  type="checkbox"
                  checked={demoFlags.showEmptyState}
                  onChange={(e) => setDemoFlag('showEmptyState', e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between px-2 py-1 rounded hover:bg-surface-2 cursor-pointer">
                <span className="flex items-center gap-1.5 text-ink-2">
                  <AlertTriangle size={13} />
                  <span>Show error banner</span>
                </span>
                <input
                  type="checkbox"
                  checked={demoFlags.showErrorState}
                  onChange={(e) => setDemoFlag('showErrorState', e.target.checked)}
                  className="rounded text-primary focus:ring-0"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
