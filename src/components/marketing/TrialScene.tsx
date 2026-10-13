import React from 'react';
import { CountdownRing } from '@/components/app/CountdownRing';
import { Bell, ShieldAlert } from 'lucide-react';

export function TrialScene() {
  return (
    <section className="py-24 border-t border-line bg-surface">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Free-trial protection
            </span>
            <h2 className="t-h2 text-ink font-display">
              Trials are designed to be forgotten. We remember for you.
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              Companies count on you forgetting the trial end date before it rolls into an expensive annual renewal. Add a trial in five seconds, and Save Me taps your shoulder days before charges land.
            </p>
          </div>

          {/* Right Simulated Phone Notification Mini-Scene */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm bg-bg border border-line rounded-lg p-5 shadow-1 space-y-4">
              {/* Trial Card Mock */}
              <div className="card p-4 bg-surface flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CountdownRing daysLeft={2} />
                  <div>
                    <h4 className="text-sm font-semibold text-ink">Calm</h4>
                    <p className="text-xs text-ink-2">Ends in 2 days · then £39.99/yr</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-accent flex items-center gap-1">
                  <ShieldAlert size={13} />
                  <span>Action due</span>
                </span>
              </div>

              {/* Notification Slide in Mock */}
              <div className="card p-3.5 bg-surface border border-primary/20 shadow-sheet">
                <div className="flex items-center justify-between text-[11px] text-ink-3 mb-1">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <Bell size={12} />
                    <span>SAVE ME</span>
                  </div>
                  <span>9:00 AM</span>
                </div>
                <h5 className="text-xs font-semibold text-ink">Calm&apos;s free trial ends in 2 days.</h5>
                <p className="text-xs text-ink-2 mt-0.5">£39.99 will be charged. Tap to review.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
