import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowRight, X, Clock } from 'lucide-react';
import { format, parseISO, addDays, isBefore, startOfDay, differenceInCalendarDays } from 'date-fns';
import { formatDate } from '../../lib/format';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  onChange: (start: string, end: string) => void;
  className?: string;
  minDate?: string;
  maxDays?: number;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className,
  minDate,
  maxDays = 60,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalStart, setInternalStart] = useState(startDate);
  const [internalEnd, setInternalEnd] = useState(endDate);
  const [error, setError] = useState<string | null>(null);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const effectiveMin = minDate || todayStr;

  const handleStartChange = (val: string) => {
    setInternalStart(val);
    setError(null);
    if (internalEnd && isBefore(parseISO(internalEnd), parseISO(val))) {
      // Auto adjust end to 3 days after start
      const newEnd = format(addDays(parseISO(val), 3), 'yyyy-MM-dd');
      setInternalEnd(newEnd);
    }
  };

  const handleEndChange = (val: string) => {
    setError(null);
    if (internalStart && isBefore(parseISO(val), parseISO(internalStart))) {
      setError('Return date must be on or after pick-up date');
      return;
    }
    const diff = differenceInCalendarDays(parseISO(val), parseISO(internalStart));
    if (diff > maxDays) {
      setError(`Maximum rental period for online booking is ${maxDays} days. Contact us for long-term leases.`);
      return;
    }
    setInternalEnd(val);
  };

  const applyPreset = (daysOffsetStart: number, durationDays: number) => {
    const s = format(addDays(new Date(), daysOffsetStart), 'yyyy-MM-dd');
    const e = format(addDays(new Date(), daysOffsetStart + durationDays), 'yyyy-MM-dd');
    setInternalStart(s);
    setInternalEnd(e);
    setError(null);
    onChange(s, e);
    setIsOpen(false);
  };

  const handleApply = () => {
    if (!internalStart || !internalEnd) {
      setError('Please select both pick-up and return dates.');
      return;
    }
    if (isBefore(parseISO(internalEnd), parseISO(internalStart))) {
      setError('Return date cannot be earlier than pick-up date.');
      return;
    }
    onChange(internalStart, internalEnd);
    setIsOpen(false);
  };

  const durationDays = startDate && endDate
    ? Math.max(1, differenceInCalendarDays(parseISO(endDate), parseISO(startDate)))
    : null;

  return (
    <div className={cn('relative inline-block w-full', className)}>
      {/* Trigger Display Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-white border border-border-strong rounded-md px-3.5 py-2.5 cursor-pointer hover:border-primary transition-colors text-left"
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon className="w-4 h-4 text-accent shrink-0" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-ink truncate">
            {startDate ? (
              <span>{formatDate(startDate)}</span>
            ) : (
              <span className="text-ink-3">Pick-up date</span>
            )}
            <ArrowRight className="w-3.5 h-3.5 text-ink-3 shrink-0" />
            {endDate ? (
              <span>{formatDate(endDate)}</span>
            ) : (
              <span className="text-ink-3">Return date</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pl-2 shrink-0">
          {durationDays !== null && (
            <span className="bg-sand-soft text-ink-2 text-xs font-semibold px-2 py-0.5 rounded-sm tabular-nums">
              {durationDays} {durationDays === 1 ? 'day' : 'days'}
            </span>
          )}
        </div>
      </div>

      {/* Popover / Sheet */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 z-50 w-full sm:w-[380px] bg-surface rounded-lg shadow-sh-2 border border-border p-4 text-left animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Select Trip Dates
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-ink-3 hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <button
                type="button"
                onClick={() => applyPreset(2, 3)}
                className="text-xs px-2.5 py-1 bg-sand-soft/80 hover:bg-sand text-ink-2 rounded transition-colors"
              >
                This weekend (3d)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(3, 7)}
                className="text-xs px-2.5 py-1 bg-sand-soft/80 hover:bg-sand text-ink-2 rounded transition-colors"
              >
                1 Week (7d)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(3, 14)}
                className="text-xs px-2.5 py-1 bg-sand-soft/80 hover:bg-sand text-ink-2 rounded transition-colors"
              >
                2 Weeks (14d)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(3, 24)}
                className="text-xs px-2.5 py-1 bg-sand-soft/80 hover:bg-sand text-ink-2 rounded transition-colors"
              >
                Long Safari (24d)
              </button>
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-1">
                  Pick-up
                </label>
                <input
                  type="date"
                  min={effectiveMin}
                  value={internalStart}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-white border border-border-strong rounded px-2.5 py-2 text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-1">
                  Return
                </label>
                <input
                  type="date"
                  min={internalStart || effectiveMin}
                  value={internalEnd}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-white border border-border-strong rounded px-2.5 py-2 text-ink focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {error && <p className="text-xs text-error mb-3 font-medium">{error}</p>}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setInternalStart('');
                  setInternalEnd('');
                  onChange('', '');
                  setIsOpen(false);
                }}
                className="text-xs text-ink-3 hover:text-ink underline underline-offset-2"
              >
                Clear dates
              </button>
              <Button size="sm" onClick={handleApply}>
                Apply Dates
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
