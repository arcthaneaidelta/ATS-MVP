import React from 'react';
import { Check, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed: 0, 1, 2, 3
  onStepClick?: (stepIndex: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <nav aria-label="Checkout Progress" className="w-full">
      <ol className="flex items-center justify-between relative">
        {/* Background connecting line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-border z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-primary z-0 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = isCompleted && onStepClick;

          return (
            <li
              key={index}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(index)}
                className={cn(
                  'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-medium text-xs sm:text-sm transition-all duration-200 select-none outline-none',
                  isCompleted
                    ? 'bg-primary text-white hover:bg-primary-hover cursor-pointer ring-4 ring-bg'
                    : isCurrent
                    ? 'bg-accent text-white ring-4 ring-accent-soft font-semibold'
                    : 'bg-surface text-ink-3 border border-border ring-4 ring-bg'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <Check className="w-4 h-4 text-white" /> : index + 1}
              </button>

              <span
                className={cn(
                  'text-[10px] sm:text-xs font-medium mt-1.5 whitespace-nowrap text-center transition-colors',
                  isCurrent ? 'text-ink font-semibold' : isCompleted ? 'text-ink-2' : 'text-ink-3'
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const HoldTimer: React.FC<{
  expiresAt: number | null;
  onExpire?: () => void;
}> = ({ expiresAt, onExpire }) => {
  const [secondsRemaining, setSecondsRemaining] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!expiresAt) {
      setSecondsRemaining(null);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setSecondsRemaining(diff);
      if (diff === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  if (secondsRemaining === null) return null;

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isWarning = secondsRemaining < 120;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tabular-nums border transition-colors',
        isWarning
          ? 'bg-warning-soft text-warning border-warning/30 animate-pulse'
          : 'bg-sand-soft text-ink-2 border-border'
      )}
    >
      {isWarning ? (
        <AlertTriangle className="w-3.5 h-3.5 text-warning" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-accent" />
      )}
      <span>Held for you · {timeStr}</span>
    </div>
  );
};
