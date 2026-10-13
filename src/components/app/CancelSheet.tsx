import React, { useState } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ExternalLink } from 'lucide-react';
import type { Subscription } from '@/data/types';

export interface CancelSheetProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelSheet({
  subscription,
  isOpen,
  onClose,
  onConfirm,
}: CancelSheetProps) {
  const [showSteps, setShowSteps] = useState(true);

  if (!subscription) return null;

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Cancel ${subscription.name}?`}
    >
      <div className="space-y-4">
        <p className="text-sm text-ink-2 leading-relaxed">
          Save Me can&apos;t cancel for you in this version. We&apos;ll mark it cancelled and remind you to check your next statement.
        </p>

        {/* Collapsible How to Cancel */}
        <div className="card p-3.5 bg-surface-2/60">
          <button
            type="button"
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between text-xs font-semibold text-ink uppercase tracking-wider"
          >
            <span>How to cancel</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-fast ${showSteps ? 'rotate-180' : ''}`}
            />
          </button>

          {showSteps && (
            <div className="mt-3 pt-3 border-t border-line/60 space-y-2 text-xs text-ink-2">
              <p>1. Sign in to your {subscription.name} account online or in their app.</p>
              <p>2. Go to Account &gt; Membership or Subscriptions.</p>
              <p>3. Select &apos;Cancel subscription&apos; and keep your confirmation email.</p>

              <a
                href="#demo-link"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline pt-1 text-xs"
              >
                <span>Open {subscription.name} account</span>
                <span className="text-[10px] text-ink-3">(Demo link)</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <Button
            variant="destructive"
            fullWidth
            onClick={onConfirm}
          >
            Mark as cancelled
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            Keep subscription
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
