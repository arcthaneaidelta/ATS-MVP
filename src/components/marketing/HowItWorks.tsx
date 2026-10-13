import React from 'react';
import { Eye, Calculator, CheckCircle2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'See',
      label: 'Read-only detection',
      desc: 'Save Me reads bank transactions and groups repeating merchants without ever needing login credentials or movement permissions.',
      icon: Eye,
      preview: '41 transactions analyzed · 10 recurring patterns found',
    },
    {
      num: '2',
      title: 'Understand',
      label: 'Long-term perspective',
      desc: 'See the true cost across 1 month, 1 year, 5 years and 10 years so minor subscriptions reveal their real long-term impact.',
      icon: Calculator,
      preview: '£102.49/mo → £1,229.91/yr → £12,299.10 over 10 yrs',
    },
    {
      num: '3',
      title: 'Act',
      label: 'Simple 3-tap control',
      desc: 'Decide whether to Keep, Review later, or Cancel with step-by-step guidance. Never trapped, always reversible with single-tap Undo.',
      icon: CheckCircle2,
      preview: 'Marked as cancelled · Saved £119.88 a year · Undo',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 border-t border-line bg-bg">
      <div className="container-page">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Three simple steps
          </span>
          <h2 className="t-h2 text-ink font-display">
            How Save Me works
          </h2>
          <p className="text-sm text-ink-2">
            No complicated budgets or categorization chores. Just straightforward clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="card p-6 bg-surface border-line flex flex-col justify-between text-left space-y-5 shadow-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-primary-t text-primary font-display font-medium text-sm flex items-center justify-center">
                      {step.num}
                    </span>
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-medium text-ink mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    {step.label}
                  </p>
                  <p className="text-xs text-ink-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="p-3 bg-surface-2 rounded-md border border-line/40 text-[11px] text-ink-3 font-mono">
                  {step.preview}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
