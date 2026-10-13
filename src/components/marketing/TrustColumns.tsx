import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';
import { copy } from '@/data/copy';

export function TrustColumns() {
  return (
    <section id="your-data" className="py-24 border-t border-line bg-bg">
      <div className="container-page">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-primary-t text-primary text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>Honest Security</span>
          </div>
          <h2 className="t-h2 text-ink font-display">
            Your data stays in your control
          </h2>
          <p className="text-sm text-ink-2">
            We believe trust comes from clarity, not twenty pages of legal jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Can See */}
          <div className="card p-6 bg-surface border-line shadow-1 space-y-4">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <Check size={16} className="text-success" />
              <span>What Save Me can see</span>
            </h3>
            <ul className="space-y-3 text-sm text-ink-2">
              {copy.data.canSee.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 text-xs">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cannot Do */}
          <div className="card p-6 bg-surface border-line shadow-1 space-y-4">
            <h3 className="text-sm font-semibold text-ink-2 uppercase tracking-wider flex items-center gap-2">
              <X size={16} className="text-error" />
              <span>What Save Me cannot do</span>
            </h3>
            <ul className="space-y-3 text-sm text-ink-2">
              {copy.data.cannot.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-error/10 text-error flex items-center justify-center flex-shrink-0 text-xs">
                    ✕
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-ink-3">
            Delete everything any time. One tap removes all cached records from the device.
          </p>
        </div>
      </div>
    </section>
  );
}
