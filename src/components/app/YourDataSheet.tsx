import React, { useState } from 'react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Check, X, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { copy } from '@/data/copy';

export interface YourDataSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnected: () => void;
}

export function YourDataSheet({
  isOpen,
  onClose,
  onDisconnected,
}: YourDataSheetProps) {
  const disconnectAndDelete = useAppStore((state) => state.disconnectAndDelete);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteStep('Disconnecting bank…');

    await new Promise((res) => setTimeout(res, 600));
    setDeleteStep('Deleting cached records…');

    await new Promise((res) => setTimeout(res, 600));
    setDeleteStep('Done.');

    await new Promise((res) => setTimeout(res, 400));
    await disconnectAndDelete();
    setIsDeleting(false);
    setDeleteStep(null);
    onClose();
    onDisconnected();
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Your data"
      subtitle="Honest, plain-language privacy"
    >
      <div className="space-y-4">
        {/* What Save Me can see */}
        <div className="card p-3.5 bg-surface-2/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            <ShieldCheck size={14} />
            <span>What Save Me can see</span>
          </div>
          <ul className="space-y-1.5 text-xs text-ink-2">
            {copy.data.canSee.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check size={14} className="text-success flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What Save Me cannot do */}
        <div className="card p-3.5 bg-surface-2/40">
          <div className="text-xs font-semibold text-ink-2 uppercase tracking-wider mb-2">
            What Save Me cannot do
          </div>
          <ul className="space-y-1.5 text-xs text-ink-2">
            {copy.data.cannot.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <X size={14} className="text-error flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-ink-3 leading-relaxed">
          {copy.data.deleteConfirm}
        </p>

        {isDeleting ? (
          <div className="p-3 bg-surface-2 text-center rounded-md text-xs font-semibold text-primary animate-pulse">
            {deleteStep}
          </div>
        ) : (
          <div className="pt-2">
            <Button
              variant="destructive"
              fullWidth
              onClick={handleDelete}
            >
              Disconnect and delete my data
            </Button>
          </div>
        )}
      </div>
    </Sheet>
  );
}
