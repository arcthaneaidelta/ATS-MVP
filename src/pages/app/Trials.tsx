import React, { useState } from 'react';
import { TrialCard } from '@/components/app/TrialCard';
import { AddTrialSheet } from '@/components/app/AddTrialSheet';
import { EmptyState } from '@/components/app/EmptyState';
import { useAppStore } from '@/store/useAppStore';
import { Plus, X, Hourglass } from 'lucide-react';
import { toDate, fmtDay } from '@/lib/dates';
import type { Trial } from '@/data/types';

export interface TrialsPageProps {
  onShowToast: (msg: string) => void;
}

export function TrialsPage({ onShowToast }: TrialsPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [newTrialId, setNewTrialId] = useState<string | null>(null);

  const trials = useAppStore((state) => state.trials);
  const virtualDate = useAppStore((state) => state.virtualDate);
  const toggleProtect = useAppStore((state) => state.toggleProtect);
  const addTrial = useAppStore((state) => state.addTrial);
  const demoFlags = useAppStore((state) => state.demoFlags);

  const now = toDate(virtualDate);

  const handleAddTrial = async (
    trialData: Omit<Trial, 'id' | 'createdAt' | 'status'>
  ) => {
    const created = await addTrial(trialData);
    setNewTrialId(created.id);
    // 2 days before or date-based
    const remindDate = new Date(trialData.endsOn);
    remindDate.setDate(remindDate.getDate() - trialData.remindDays);
    onShowToast(`We'll remind you on ${fmtDay(remindDate)} at 9:00.`);
    setTimeout(() => setNewTrialId(null), 2500);
    return created;
  };

  const activeTrials = trials.filter((t) => t.status === 'active');

  return (
    <div className="flex-1 relative flex flex-col overflow-hidden pb-16">
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {/* Intro Banner */}
        {showIntro && (
          <div className="card p-3 bg-surface-2/60 border-line/60 flex items-start justify-between text-xs text-ink-2">
            <div className="flex items-start gap-2.5 pr-2">
              <Hourglass size={15} className="text-primary flex-shrink-0 mt-0.5" />
              <p>Add a free trial and we&apos;ll remind you before it turns into a charge.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="text-ink-3 hover:text-ink flex-shrink-0"
              aria-label="Dismiss message"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Trials List */}
        {demoFlags.showEmptyState || activeTrials.length === 0 ? (
          <EmptyState
            title="No trials yet. Add one the moment you sign up."
            description="We'll keep watch and notify you before free trials renew."
          />
        ) : (
          <div>
            {activeTrials.map((trial) => (
              <TrialCard
                key={trial.id}
                trial={trial}
                now={now}
                onToggleProtect={toggleProtect}
                isNew={newTrialId === trial.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (+) */}
      <div className="absolute right-5 bottom-6 z-20">
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          aria-label="Add free trial"
          className="w-14 h-14 rounded-full bg-primary text-surface shadow-2 flex items-center justify-center hover:bg-primary-h active:scale-95 transition-all"
        >
          <Plus size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Add Trial Sheet */}
      <AddTrialSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddTrial}
        now={now}
      />
    </div>
  );
}
