import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { plan } from '@/config/plan';

export function PlanTeaser() {
  return (
    <section className="py-24 border-t border-line bg-surface">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Production Roadmap
          </span>

          <h2 className="t-h2 text-ink font-display">
            Five milestones. One fixed price. No surprises.
          </h2>

          {/* 5-Dot Milestone Rail Line */}
          <div className="py-4">
            <div className="flex items-center justify-between relative max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-line z-0" />
              {plan.milestones.map((m) => (
                <div key={m.id} className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-surface border-2 border-primary text-primary font-display font-medium text-xs flex items-center justify-center shadow-1">
                    {m.code}
                  </div>
                  <span className="text-[11px] font-semibold text-ink-3 mt-2 hidden sm:block">
                    {m.paymentPct}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-ink-2 max-w-[42ch] mx-auto leading-relaxed">
            From architecture to store submission on iOS and Android. Acceptance criteria agreed upfront, with fixed milestones paid only upon delivery.
          </p>

          <div>
            <Link to="/plan">
              <Button variant="primary">
                See the build plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
