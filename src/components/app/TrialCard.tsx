import React from 'react';
import { CountdownRing } from './CountdownRing';
import { Switch } from '@/components/ui/Switch';
import type { Trial } from '@/data/types';
import { cycleLong, formatMoney } from '@/lib/money';
import { daysBetween, fmtDay, toDate } from '@/lib/dates';

export interface TrialCardProps {
  trial: Trial;
  now: Date;
  onToggleProtect: (id: string) => void;
  isNew?: boolean;
}

export function TrialCard({
  trial,
  now,
  onToggleProtect,
  isNew = false,
}: TrialCardProps) {
  const endsDate = toDate(trial.endsOn);
  const daysLeft = Math.max(0, daysBetween(now, endsDate));
  const isUrgent = daysLeft <= 2;

  const priceFormatted = trial.priceAfter ? formatMoney(trial.priceAfter) : null;
  const cycleDesc = trial.cycleAfter ? cycleLong(trial.cycleAfter) : '';

  return (
    <div
      className={`card p-4 mb-3 transition-colors duration-slow ${
        isNew ? 'bg-primary-t/40 ring-1 ring-primary/30' : 'bg-surface'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0 pr-3">
          <CountdownRing daysLeft={daysLeft} />

          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-ink truncate">{trial.name}</h4>
            <p className="text-xs text-ink-2 truncate mt-0.5">
              Ends {fmtDay(trial.endsOn)}
              {priceFormatted && ` · then ${priceFormatted} ${cycleDesc}`}
            </p>
            {isUrgent && (
              <span className="inline-block mt-1 text-[11px] font-semibold text-accent">
                Renews in {daysLeft} day{daysLeft === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center flex-shrink-0">
          <Switch
            checked={trial.protect}
            onChange={() => onToggleProtect(trial.id)}
            aria-label={`Protect trial ${trial.name}`}
          />
        </div>
      </div>
    </div>
  );
}
