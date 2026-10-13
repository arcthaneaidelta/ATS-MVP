import React, { useState } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Segmented } from '@/components/ui/Segmented';
import { trialSuggestions } from '@/data/seed.trials';
import type { Cycle, ReminderDays, Trial } from '@/data/types';
import { parseMoneyInput, formatMoney } from '@/lib/money';
import { isoDate, addDays, toDate, fmtDay } from '@/lib/dates';
import { brand } from '@/config/brand';

export interface AddTrialSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (trial: Omit<Trial, 'id' | 'createdAt' | 'status'>) => Promise<Trial>;
  now: Date;
}

export function AddTrialSheet({
  isOpen,
  onClose,
  onAdd,
  now,
}: AddTrialSheetProps) {
  const [name, setName] = useState('');
  const [endsOn, setEndsOn] = useState(() => isoDate(addDays(now, 7)));
  const [priceStr, setPriceStr] = useState('8.99');
  const [cycleAfter, setCycleAfter] = useState<Cycle>('monthly');
  const [remindDays, setRemindDays] = useState<ReminderDays>(2);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filtered suggestions
  const filteredSuggestions = trialSuggestions.filter(
    (s) => name.trim().length > 0 && s.name.toLowerCase().includes(name.toLowerCase()) && s.name.toLowerCase() !== name.toLowerCase()
  );

  const handleSelectSuggestion = (s: typeof trialSuggestions[0]) => {
    setName(s.name);
    setPriceStr((s.priceAfter / 100).toFixed(2));
    setCycleAfter(s.cycleAfter);
  };

  const isDateValid = () => {
    if (!endsOn) return false;
    const picked = toDate(endsOn);
    return picked > now;
  };

  const isFormValid = name.trim().length > 0 && isDateValid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    if (!isDateValid()) {
      setErrorMsg('Pick a date after today');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const parsedPrice = parseMoneyInput(priceStr);

      // Simulate 700ms loading step as in PRD §8.3
      await new Promise((res) => setTimeout(res, 700));

      await onAdd({
        name: name.trim(),
        endsOn,
        priceAfter: parsedPrice,
        cycleAfter,
        remindDays,
        protect: true,
      });

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setName('');
      }, 500);
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMsg(err instanceof Error ? err.message : "Couldn't save that. Try again.");
    }
  };

  const remindOptions = [
    { id: '0', label: 'Day of' },
    { id: '1', label: '1 day before' },
    { id: '2', label: '2 days before' },
  ];

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Add free trial"
      subtitle="We'll remind you before it turns into a charge"
      tall
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Name */}
        <div className="relative">
          <Input
            label="Service name"
            placeholder="e.g. Calm, Apple TV+"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg(null);
            }}
            required
            autoComplete="off"
          />

          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-surface border border-line rounded-md shadow-2 overflow-hidden">
              {filteredSuggestions.slice(0, 3).map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full px-3 py-2 text-left text-xs text-ink hover:bg-surface-2 flex items-center justify-between"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-ink-3">
                    {formatMoney(s.priceAfter)}/{s.cycleAfter === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Trial Ends Date */}
        <Input
          label="Trial ends"
          type="date"
          value={endsOn}
          min={isoDate(addDays(now, 1))}
          onChange={(e) => {
            setEndsOn(e.target.value);
            setErrorMsg(null);
          }}
          required
          error={!isDateValid() && endsOn ? 'Pick a date after today' : undefined}
        />

        {/* Price After Trial */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Price after trial"
            placeholder="£0.00"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
          />
          <div>
            <label className="block text-xs font-semibold text-ink-2 uppercase tracking-wider mb-1.5">
              Cycle
            </label>
            <Segmented
              options={[
                { id: 'monthly', label: 'Monthly' },
                { id: 'yearly', label: 'Yearly' },
              ]}
              value={cycleAfter}
              onChange={(val) => setCycleAfter(val as Cycle)}
              name="Cycle"
            />
          </div>
        </div>

        {/* Remind Me */}
        <div>
          <label className="block text-xs font-semibold text-ink-2 uppercase tracking-wider mb-1.5">
            Remind me
          </label>
          <Segmented
            options={remindOptions}
            value={String(remindDays)}
            onChange={(val) => setRemindDays(Number(val) as ReminderDays)}
            name="Reminder timing"
          />
          <p className="text-[11px] text-ink-3 mt-1.5">
            Reminder arrives at {brand.reminderHour}:00 before charge.
          </p>
        </div>

        {errorMsg && (
          <p className="text-xs text-error font-medium">{errorMsg}</p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!isFormValid}
            isLoading={isLoading}
            isSuccess={isSuccess}
          >
            Protect me
          </Button>
        </div>
      </form>
    </Sheet>
  );
}
