import React from 'react';
import { Nav } from '@/components/marketing/Nav';
import { ClosingFooter } from '@/components/marketing/ClosingFooter';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { plan } from '@/config/plan';
import { Check, ShieldCheck, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PlanPage() {
  const milestoneAccordionItems = plan.milestones.map((m) => ({
    id: m.id,
    header: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-primary-t text-primary font-display font-medium text-xs flex items-center justify-center flex-shrink-0">
            {m.code}
          </span>
          <div>
            <h4 className="text-sm font-semibold text-ink">{m.title}</h4>
            <p className="text-xs text-ink-3">{m.summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded-pill bg-primary-t">
            {m.paymentPct}%
          </span>
          <span className="text-[11px] text-ink-3 hidden sm:inline">{m.duration}</span>
        </div>
      </div>
    ),
    content: (
      <div className="pt-2 space-y-2">
        <p className="text-xs font-semibold text-ink-3 uppercase tracking-wider">
          Acceptance criteria
        </p>
        <ul className="space-y-1.5 text-xs text-ink-2">
          {m.acceptance.map((acc, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check size={14} className="text-success flex-shrink-0 mt-0.5" />
              <span>{acc}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  }));

  const mailtoHref = plan.contact.email
    ? `mailto:${plan.contact.email}?subject=Save%20Me%20Build%20Plan%20Discussion`
    : 'mailto:?subject=Save%20Me%20Build%20Plan%20Discussion';

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between">
      <Nav />

      <main className="py-12 flex-1">
        <div className="container-page max-w-4xl space-y-16">
          {/* Header */}
          <div className="text-left space-y-4 pb-8 border-b border-line">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-primary-t text-primary text-xs font-semibold uppercase tracking-wider">
              <Layers size={13} />
              <span>Build proposal</span>
            </div>
            <h1 className="t-h1 text-ink font-display">
              Save Me — Build Plan &amp; Approach
            </h1>
            <p className="t-lead text-ink-2 max-w-[50ch] leading-relaxed">
              A transparent, milestone-driven roadmap to ship Save Me as a production-ready iOS and Android app.
            </p>
          </div>

          {/* 1. Similar Apps I've Built */}
          <section className="space-y-6">
            <div className="text-left">
              <h2 className="text-xl font-display font-medium text-ink">
                1. Relevant apps I&apos;ve built
              </h2>
              <p className="text-xs text-ink-3 mt-1">
                Prototypes and products focusing on clarity, financial data, and simple flows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plan.pastProjects.map((proj) => (
                <div key={proj.name} className="card p-5 bg-surface border-line space-y-2">
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    {proj.kind}
                  </span>
                  <h3 className="text-base font-semibold text-ink font-display">
                    {proj.name}
                  </h3>
                  <p className="text-xs text-ink-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Transaction Data Experience */}
          <section className="space-y-4 card p-6 bg-surface border-line">
            <h2 className="text-lg font-display font-medium text-ink">
              2. Transaction &amp; subscription data experience
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              {plan.dataExperience}
            </p>
          </section>

          {/* 3. Five Milestones */}
          <section className="space-y-6">
            <div className="text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-display font-medium text-ink">
                    3. Milestone plan &amp; deliverables
                  </h2>
                  <p className="text-xs text-ink-3 mt-1">
                    Acceptance criteria agreed upfront. Payment released per milestone upon your review.
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary px-3 py-1 rounded-pill bg-primary-t">
                  100% fixed scope
                </span>
              </div>
            </div>

            <Accordion items={milestoneAccordionItems} defaultOpenId="m1" />
          </section>

          {/* 4. Fixed Price */}
          <section className="card p-6 bg-surface-2/60 border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Investment
              </span>
              <h3 className="text-xl font-display font-medium text-ink mt-0.5">
                Fixed-price estimate
              </h3>
              <p className="text-xs text-ink-3 mt-1">
                {plan.price !== null
                  ? `£${plan.price.toLocaleString()} all-inclusive, divided across the 5 milestones above.`
                  : 'Fixed price tailored to your preferred timeline and open-banking aggregator choice.'}
              </p>
            </div>
            <div>
              <a href={mailtoHref}>
                <Button variant="primary">
                  Discuss pricing &amp; timeline
                </Button>
              </a>
            </div>
          </section>

          {/* 5. What I Need From You */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-medium text-ink">
              4. What I need from you to begin
            </h2>
            <div className="card p-6 bg-surface border-line">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-2">
                {plan.needsFromClient.map((need, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-primary-t text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 6. Production Stack Recommendation */}
          <section className="space-y-4 card p-6 bg-surface border-line">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h2 className="text-base font-display font-medium text-ink">
                5. Recommended production technology stack
              </h2>
            </div>
            <p className="text-xs text-ink-2 leading-relaxed">
              {plan.productionStack}
            </p>
          </section>

          {/* CTA Box */}
          <div className="text-center pt-8 space-y-4">
            <h3 className="text-2xl font-display font-medium text-ink">
              Ready to build this together?
            </h3>
            <p className="text-xs text-ink-2 max-w-[36ch] mx-auto">
              I can start within one week of milestone agreement and design asset delivery.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <a href={mailtoHref}>
                <Button variant="primary">
                  Start the conversation
                </Button>
              </a>
              <Link to="/">
                <Button variant="secondary">
                  Back to the live app
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ClosingFooter />
    </div>
  );
}
