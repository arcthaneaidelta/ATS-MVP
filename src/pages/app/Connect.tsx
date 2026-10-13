import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { YourDataSheet } from '@/components/app/YourDataSheet';
import { seedTransactions } from '@/data/seed.transactions';
import { confirmationIndices } from '@/lib/detection';
import { formatMoney } from '@/lib/money';
import { fmtDay } from '@/lib/dates';
import { useAppStore } from '@/store/useAppStore';

export interface ConnectPageProps {
  onComplete: () => void;
}

type ConnectStep =
  | 'idle'
  | 'picker'
  | 'connecting'
  | 'scanning'
  | 'result'
  | 'error';

export function ConnectPage({ onComplete }: ConnectPageProps) {
  const [step, setStep] = useState<ConnectStep>('idle');
  const [selectedBank, setSelectedBank] = useState<string>('Northfield Bank');
  const [scanIndex, setScanIndex] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [isDataSheetOpen, setIsDataSheetOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const connect = useAppStore((state) => state.connect);
  const demoFlags = useAppStore((state) => state.demoFlags);

  const bankOptions = [
    { name: 'Northfield Bank', type: 'High street checking' },
    { name: 'Harbour & Co', type: 'Current accounts' },
    { name: 'Linden Credit Union', type: 'Community banking' },
  ];

  const confirmations = confirmationIndices(seedTransactions);

  // Scanning animation progression
  useEffect(() => {
    if (step !== 'scanning') return;

    const interval = setInterval(() => {
      setScanIndex((prev) => {
        const next = prev + 1;
        if (confirmations.has(next)) {
          setFoundCount((c) => c + 1);
        }

        // Auto scroll
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }

        if (next >= seedTransactions.length) {
          clearInterval(interval);
          setTimeout(() => setStep('result'), 600);
          return prev;
        }
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [step, confirmations]);

  const handleStartFlow = () => {
    setStep('picker');
  };

  const handleSelectBank = async (bankName: string) => {
    setSelectedBank(bankName);
    setStep('connecting');

    // Simulate connection delay
    setTimeout(async () => {
      if (demoFlags.failNextConnect) {
        setStep('error');
        return;
      }

      try {
        await connect(bankName);
        setScanIndex(0);
        setFoundCount(0);
        setStep('scanning');
      } catch {
        setStep('error');
      }
    }, 900);
  };

  const handleSkip = () => {
    connect('Sample Bank');
    onComplete();
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-bg overflow-y-auto no-scrollbar">
      {/* 1. IDLE STATE */}
      {step === 'idle' && (
        <div className="my-auto text-center flex flex-col items-center">
          <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-primary-t text-primary flex items-center justify-center mb-5 ring-4 ring-primary-t/50">
            <ShieldCheck size={36} strokeWidth={1.75} />
          </div>

          <h2 className="text-2xl font-display font-medium text-ink mb-2">
            Find your subscriptions
          </h2>
          <p className="text-sm text-ink-2 max-w-[34ch] leading-relaxed mb-8">
            Connect your bank for read-only access. Save Me looks for payments that repeat. It cannot move your money.
          </p>

          <div className="w-full space-y-2.5 max-w-[280px]">
            <Button
              variant="primary"
              fullWidth
              onClick={handleStartFlow}
            >
              Find my subscriptions
            </Button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full py-2 text-xs font-semibold text-ink-2 hover:text-ink"
            >
              Use sample data
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsDataSheetOpen(true)}
            className="mt-6 text-xs text-primary font-medium hover:underline flex items-center gap-1.5"
          >
            <Lock size={12} />
            <span>How your data is handled</span>
          </button>
        </div>
      )}

      {/* 2. CONNECTING STATE */}
      {step === 'connecting' && (
        <div className="my-auto text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-primary-t text-primary flex items-center justify-center mb-4 animate-spin">
            <Lock size={22} />
          </div>
          <h3 className="text-lg font-display font-medium text-ink">
            Connecting securely…
          </h3>
          <p className="text-xs text-ink-3 mt-1">
            Establishing read-only session with {selectedBank}
          </p>
        </div>
      )}

      {/* 3. SCANNING TRANSACTIONS STATE */}
      {step === 'scanning' && (
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="text-center pb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary-t text-primary text-xs font-semibold mb-1">
              <span>{foundCount} recurring payments found</span>
            </div>
            <p className="text-xs text-ink-3">
              Reading 12 months of payments ({scanIndex} / {seedTransactions.length})
            </p>
          </div>

          {/* Windowed transaction stream */}
          <div
            ref={scrollContainerRef}
            className="flex-1 max-h-[460px] overflow-hidden card bg-surface p-2 space-y-1.5 border-line"
          >
            {seedTransactions.slice(0, scanIndex).slice(-10).map((tx) => {
              const isRecurring = !!tx.subscriptionId;

              return (
                <div
                  key={tx.id}
                  className={`p-2 rounded flex items-center justify-between text-xs transition-all ${
                    isRecurring
                      ? 'bg-primary-t/50 border-l-2 border-primary font-medium'
                      : 'bg-surface-2/40 text-ink-3'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className={`truncate ${isRecurring ? 'text-primary font-semibold' : 'text-ink'}`}>
                      {tx.merchant}
                    </p>
                    <p className="text-[10px] text-ink-3">{fmtDay(tx.date)}</p>
                  </div>
                  <span className="font-mono tnum text-[11px] text-ink">
                    {formatMoney(tx.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. RESULT STATE */}
      {step === 'result' && (
        <div className="my-auto text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>

          <h2 className="text-2xl font-display font-medium text-ink mb-2">
            We found 10 subscriptions
          </h2>
          <p className="text-xs text-ink-2 max-w-[30ch] mb-6">
            Everything is grouped and categorized. Ready to see what they cost over time.
          </p>

          <Button
            variant="primary"
            fullWidth
            className="max-w-[260px]"
            onClick={onComplete}
          >
            See what they cost
          </Button>
        </div>
      )}

      {/* 5. ERROR STATE */}
      {step === 'error' && (
        <div className="my-auto text-center flex flex-col items-center">
          <h3 className="text-lg font-display font-medium text-error mb-2">
            Connection failed
          </h3>
          <p className="text-xs text-ink-2 max-w-[30ch] mb-6">
            We couldn&apos;t reach your bank. Nothing was saved.
          </p>
          <div className="w-full space-y-2 max-w-[260px]">
            <Button
              variant="primary"
              fullWidth
              onClick={() => setStep('picker')}
            >
              Try again
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={handleSkip}
            >
              Use sample data
            </Button>
          </div>
        </div>
      )}

      {/* Bank Picker Sheet */}
      <Sheet
        isOpen={step === 'picker'}
        onClose={() => setStep('idle')}
        title="Choose your bank"
        subtitle="Simulated open-banking connector"
      >
        <div className="space-y-2">
          {bankOptions.map((bank) => (
            <button
              key={bank.name}
              type="button"
              onClick={() => handleSelectBank(bank.name)}
              className="w-full p-3.5 card flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-2 text-primary flex items-center justify-center">
                  <Building2 size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-ink">{bank.name}</h4>
                  <p className="text-[11px] text-ink-3">{bank.type}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Sheet>

      {/* Your Data Sheet */}
      <YourDataSheet
        isOpen={isDataSheetOpen}
        onClose={() => setIsDataSheetOpen(false)}
        onDisconnected={() => {}}
      />
    </div>
  );
}
