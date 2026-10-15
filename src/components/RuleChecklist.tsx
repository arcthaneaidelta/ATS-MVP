import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { EligibilityCheckItem } from '../data/types';
import { Button } from './Button';

interface RuleChecklistProps {
  checks: EligibilityCheckItem[];
  isLoading?: boolean;
  onFixAction?: (actionType: 'activate_plan' | 'refresh_quote' | 'view_usage') => void;
  className?: string;
}

export const RuleChecklist: React.FC<RuleChecklistProps> = ({
  checks,
  isLoading = false,
  onFixAction,
  className = '',
}) => {
  // Staggered reveal state: index of the resolved item
  const [resolvedIndex, setResolvedIndex] = useState<number>(-1);

  useEffect(() => {
    if (isLoading) {
      setResolvedIndex(-1);
      return;
    }

    if (checks.length > 0) {
      setResolvedIndex(0);
      const timer = setInterval(() => {
        setResolvedIndex((prev) => {
          if (prev >= checks.length - 1) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [checks, isLoading]);

  return (
    <div className={`space-y-3 ${className}`}>
      {checks.map((rule, idx) => {
        const isResolved = idx <= resolvedIndex && !isLoading;
        const isCurrentlyEvaluating = idx === resolvedIndex + 1 || (isLoading && idx === 0);
        const isFailed = isResolved && rule.status === 'fail';
        const isPassed = isResolved && rule.status === 'pass';

        return (
          <div
            key={rule.ruleId}
            className={`border rounded-lg p-3.5 transition-all duration-300 ${
              isFailed
                ? 'border-meridian-error/40 bg-meridian-error-tint/30'
                : isPassed
                ? 'border-meridian-success/30 bg-meridian-surface'
                : 'border-meridian-border bg-meridian-surface-sunken/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {isPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-meridian-success animate-in zoom-in-75 duration-200" />
                  ) : isFailed ? (
                    <XCircle className="w-5 h-5 text-meridian-error animate-in zoom-in-75 duration-200" />
                  ) : isCurrentlyEvaluating ? (
                    <Loader2 className="w-5 h-5 text-meridian-primary animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-meridian-border-strong flex items-center justify-center text-[10px] text-meridian-text-muted">
                      {rule.ruleId}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-meridian-text-muted">
                      Rule 0{rule.ruleId}
                    </span>
                    <h4 className="text-sm font-semibold text-meridian-text-primary">
                      {rule.name}
                    </h4>
                  </div>

                  {isResolved ? (
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isFailed ? 'text-meridian-error font-medium' : 'text-meridian-text-secondary'
                      }`}
                    >
                      {rule.message}
                    </p>
                  ) : (
                    <p className="text-xs text-meridian-text-muted mt-1 italic">
                      {isCurrentlyEvaluating
                        ? 'Evaluating against server policy...'
                        : 'Queued for evaluation'}
                    </p>
                  )}
                </div>
              </div>

              {isFailed && rule.fixAction && (
                <div className="shrink-0 mt-0.5">
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => onFixAction && onFixAction(rule.fixAction!.actionType)}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    iconPosition="right"
                  >
                    {rule.fixAction.label}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
