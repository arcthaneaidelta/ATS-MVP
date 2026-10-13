import React, { useState } from 'react';
import { RollingNumber } from '@/components/app/RollingNumber';

const STEPS = [
  { id: 'month', label: 'A month', amount: '£102.49', detail: 'Feels like pocket money.' },
  { id: 'year', label: 'A year', amount: '£1,229.91', detail: 'A weekend holiday away.' },
  { id: 'five', label: 'Five years', amount: '£6,149.55', detail: 'A substantial family expense.' },
  { id: 'ten', label: 'Ten years', amount: '£12,299.10', detail: 'Over twelve thousand pounds quietly leaked.' },
];

export function HorizonStory() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="the-problem" className="py-24 border-t border-line bg-surface">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              The problem, in one number
            </span>
            <h2 className="t-h2 text-ink font-display">
              Small charges are easy to ignore. Ten years of them is over £12,000.
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              When ten different services each quietly renew at £2.49 to £12.99, monthly statements feel manageable. But compounding across five and ten years, quiet recurring payments add up to substantial wealth lost.
            </p>
            <p className="text-xs text-ink-3">
              Calculated at today&apos;s prices from 10 sample recurring charges.
            </p>
          </div>

          {/* Right Column: Interactive Horizon Scrubber & Figure Display */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-8 bg-bg rounded-lg border border-line">
            <div className="w-full flex items-center justify-between gap-2 max-w-md mb-8">
              {STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`flex-1 py-2 px-1 text-xs font-semibold rounded-pill transition-all ${
                    activeStep === idx
                      ? 'bg-primary text-surface shadow-1'
                      : 'text-ink-3 hover:text-ink hover:bg-surface'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Giant morphing figure */}
            <div className="text-center py-4">
              <span className="text-5xl sm:text-7xl font-display font-light text-ink tracking-tight tnum block mb-2">
                <RollingNumber formattedValue={STEPS[activeStep].amount} />
              </span>
              <p className="text-base text-ink-2 font-medium">
                {STEPS[activeStep].detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
