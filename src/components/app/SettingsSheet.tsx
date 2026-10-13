import React, { useState } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { NotificationsSheet } from './NotificationsSheet';
import { YourDataSheet } from './YourDataSheet';
import { Bell, ShieldCheck, Coins, Sparkles, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToConnect: () => void;
}

export function SettingsSheet({
  isOpen,
  onClose,
  onNavigateToConnect,
}: SettingsSheetProps) {
  const [subSheet, setSubSheet] = useState<'notifications' | 'data' | null>(null);
  const fastForward = useAppStore((state) => state.fastForward);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const handleCloseAll = () => {
    setSubSheet(null);
    onClose();
  };

  return (
    <>
      <Sheet
        isOpen={isOpen && subSheet === null}
        onClose={onClose}
        title="Settings"
      >
        <div className="space-y-1">
          {/* Notifications Row */}
          <button
            type="button"
            onClick={() => setSubSheet('notifications')}
            className="w-full p-3.5 card mb-2 flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-t text-primary flex items-center justify-center">
                <Bell size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">Notifications</h4>
                <p className="text-xs text-ink-3">Trial alerts & quiet hours</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-ink-3" />
          </button>

          {/* Your Data Row */}
          <button
            type="button"
            onClick={() => setSubSheet('data')}
            className="w-full p-3.5 card mb-2 flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-t text-primary flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">Your data</h4>
                <p className="text-xs text-ink-3">Permissions & deletion</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-ink-3" />
          </button>

          {/* Currency Row (Disabled) */}
          <div className="w-full p-3.5 card mb-2 flex items-center justify-between text-left opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-2 text-ink-3 flex items-center justify-center">
                <Coins size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink">Currency</h4>
                <p className="text-xs text-ink-3">GBP (£) · More in a later release</p>
              </div>
            </div>
          </div>

          {/* Mobile Demo Controls Section */}
          <div className="pt-3 border-t border-line mt-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-3 uppercase tracking-wider mb-2">
              <Sparkles size={12} />
              <span>Demo controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  fastForward(5);
                  handleCloseAll();
                }}
                className="btn btn-secondary btn-sm text-xs"
              >
                Fast-forward 5 days
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDemo();
                  handleCloseAll();
                }}
                className="btn btn-secondary btn-sm text-xs"
              >
                Reset demo state
              </button>
            </div>
          </div>

          {/* Version */}
          <div className="pt-4 text-center">
            <p className="text-[11px] text-ink-3">Save Me Prototype v1.0.0 · Read-only mock</p>
          </div>
        </div>
      </Sheet>

      {/* Sub sheets */}
      <NotificationsSheet
        isOpen={isOpen && subSheet === 'notifications'}
        onClose={() => setSubSheet(null)}
      />

      <YourDataSheet
        isOpen={isOpen && subSheet === 'data'}
        onClose={() => setSubSheet(null)}
        onDisconnected={() => {
          handleCloseAll();
          onNavigateToConnect();
        }}
      />
    </>
  );
}
