import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceLines } from '../../data/seeds/corporate';
import { Button } from '../../components/ui/Button';
import { ChevronDown, ArrowRight, Check } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>(serviceLines[0].id);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (name: string) => {
    setExpandedRow((prev) => (prev === name ? null : name));
  };

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left">
      {/* Header */}
      <div className="max-w-2xl mb-16 space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
          Services & Capabilities
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
          What we build, and how we keep it running.
        </h1>
        <p className="text-base text-ink-2 leading-relaxed">
          Four dedicated engineering disciplines built to ship enterprise digital platforms with speed, security, and zero vendor lock-in.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Sticky Index */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-2">
          <div className="p-4 rounded-xl bg-surface border border-line space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink-3 tracking-wider px-2 block mb-2">
              Engineering Disciplines
            </span>
            {serviceLines.map((svc) => (
              <button
                key={svc.id}
                type="button"
                onClick={() => {
                  setActiveSection(svc.id);
                  document.getElementById(svc.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeSection === svc.id
                    ? 'bg-elevated text-primary font-semibold border border-line shadow-sm'
                    : 'text-ink-2 hover:bg-bg'
                }`}
              >
                {svc.title}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-clay-tint/50 border border-clay/20 text-xs text-ink-2 space-y-2">
            <span className="font-semibold text-clay block">Ready for blueprints?</span>
            <p className="text-[11px] leading-relaxed">
              We deliver complete technical specifications, architecture diagrams, and milestone estimates before project kickoff.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/contact')} block>
              Request Scoping Call
            </Button>
          </div>
        </div>

        {/* Right: Service Section Details */}
        <div className="lg:col-span-8 space-y-12">
          {serviceLines.map((svc) => (
            <div
              key={svc.id}
              id={svc.id}
              className="p-8 rounded-xl bg-surface border border-line space-y-6"
            >
              <div>
                <h2 className="font-serif text-2xl text-ink mb-2">{svc.title}</h2>
                <p className="text-sm text-ink-2 leading-relaxed">{svc.description}</p>
              </div>

              {/* Capability Rows Accordion */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-ink-3 block">
                  Core Capabilities
                </span>
                {svc.capabilities.map((cap) => (
                  <div
                    key={cap.name}
                    className="border border-line rounded-lg bg-elevated overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleRow(cap.name)}
                      className="w-full p-3.5 flex items-center justify-between text-left text-xs font-semibold text-ink hover:bg-surface/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <Check className="w-3.5 h-3.5 text-ok stroke-[2.5]" />
                        <span>{cap.name}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-ink-3 transition-transform duration-200 ${
                          expandedRow === cap.name ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedRow === cap.name && (
                      <div className="p-3.5 pt-0 text-xs text-ink-2 leading-relaxed bg-surface/30 border-t border-line/60">
                        {cap.detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Product Chips & Case Study Link */}
              <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-3">Live in:</span>
                  {svc.usedIn.map((prod) => (
                    <span
                      key={prod}
                      className="px-2 py-0.5 rounded bg-bg border border-line font-medium text-ink-2 text-[11px]"
                    >
                      {prod}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => navigate(svc.relatedCaseStudy)}
                  className="inline-flex items-center gap-1 text-clay font-medium hover:underline"
                >
                  <span>See related case study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
