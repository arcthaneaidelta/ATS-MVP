import React from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Switch } from '@/components/ui/Switch';
import { Segmented } from '@/components/ui/Segmented';
import { useAppStore } from '@/store/useAppStore';
import { Bell } from 'lucide-react';
import type { ReminderDays } from '@/data/types';

export interface NotificationsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsSheet({ isOpen, onClose }: NotificationsSheetProps) {
  const reminderPrefs = useAppStore((state) => state.reminderPrefs);
  const updateReminderPrefs = useAppStore((state) => state.updateReminderPrefs);

  const timingOptions = [
    { id: '0', label: 'Day of' },
    { id: '1', label: '1 day before' },
    { id: '2', label: '2 days before' },
  ];

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      subtitle="Control how and when you receive trial reminders"
    >
      <div className="space-y-5">
        {/* Master Toggle */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div>
            <h4 className="text-sm font-semibold text-ink">Trial reminders</h4>
            <p className="text-xs text-ink-3">Receive a push alert before free trials end</p>
          </div>
          <Switch
            checked={reminderPrefs.enabled}
            onChange={(val) => updateReminderPrefs({ enabled: val })}
            aria-label="Toggle trial reminders"
          />
        </div>

        {/* Reminder timing */}
        <div>
          <label className="block text-xs font-semibold text-ink-2 uppercase tracking-wider mb-2">
            Reminder timing
          </label>
          <Segmented
            options={timingOptions}
            value={String(reminderPrefs.remindDays)}
            onChange={(val) => updateReminderPrefs({ remindDays: Number(val) as ReminderDays })}
            name="Timing"
          />
        </div>

        {/* Quiet Hours */}
        <div className="card p-3.5 bg-surface-2/50 space-y-3">
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">Quiet hours</h4>
            <p className="text-xs text-ink-3 mt-0.5">We will hold notifications until quiet hours end</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-ink-3 block mb-1">Starts</span>
              <span className="font-semibold text-ink bg-surface px-2.5 py-1.5 rounded border border-line block">
                {reminderPrefs.quietStart}
              </span>
            </div>
            <div>
              <span className="text-ink-3 block mb-1">Ends</span>
              <span className="font-semibold text-ink bg-surface px-2.5 py-1.5 rounded border border-line block">
                {reminderPrefs.quietEnd}
              </span>
            </div>
          </div>
        </div>

        {/* Live Notification Preview */}
        <div>
          <label className="block text-xs font-semibold text-ink-2 uppercase tracking-wider mb-2">
            Notification preview
          </label>
          <div className="card p-3 bg-surface border-line shadow-1">
            <div className="flex items-center justify-between text-[11px] text-ink-3 mb-1">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Bell size={12} />
                <span>SAVE ME</span>
              </div>
              <span>preview</span>
            </div>
            <p className="text-xs font-semibold text-ink">Calm&apos;s free trial ends in {reminderPrefs.remindDays === 0 ? 'today' : `${reminderPrefs.remindDays} days`}</p>
            <p className="text-[11px] text-ink-2 mt-0.5">£39.99 will be charged. Tap to review.</p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
