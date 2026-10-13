import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseStudies } from '../../data/seeds/corporate';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';

export const CaseStudyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const caseStudy = caseStudies.find((c) => c.slug === slug) || caseStudies[0];
  const currentIndex = caseStudies.findIndex((c) => c.slug === caseStudy.slug);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-16">
      {/* Back link */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/case-studies')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Studies</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-wider font-bold text-clay block">
          {caseStudy.clientType} Case Study
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
          {caseStudy.title}
        </h1>
        <p className="text-lg text-ink-2 leading-relaxed">
          {caseStudy.summary}
        </p>

        {/* Fact metadata bar */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-surface border border-line text-xs font-sans">
          <div>
            <span className="text-[10px] text-ink-3 uppercase font-bold block">Role</span>
            <span className="font-medium text-ink">{caseStudy.role}</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-3 uppercase font-bold block">Timeline</span>
            <span className="font-medium text-ink">{caseStudy.timeline}</span>
          </div>
          <div>
            <span className="text-[10px] text-ink-3 uppercase font-bold block">Core Stack</span>
            <span className="font-medium text-ink">{caseStudy.stack.slice(0, 3).join(', ')}</span>
          </div>
        </div>
      </div>

      {/* Scroll-Story Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-line">
        <div className="lg:col-span-8 space-y-12">
          {/* 1. Challenge */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink">The Business Challenge</h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              {caseStudy.challenge}
            </p>
          </div>

          {/* 2. Approach with Architecture Flow */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink">Engineering Approach</h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              {caseStudy.approach}
            </p>

            <div className="p-6 rounded-xl bg-surface border border-line space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
                <Layers className="w-4 h-4 text-primary" />
                <span>Sub-system Architecture Blueprint</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-elevated border border-line">
                  <span className="text-[10px] text-ink-3 block font-bold">CLIENT LAYER</span>
                  <span className="font-semibold text-ink mt-1 block">React PWA + Radix UI</span>
                  <span className="text-[11px] text-ink-3">Sub-800ms initial paint</span>
                </div>
                <div className="p-3 rounded-lg bg-elevated border border-line">
                  <span className="text-[10px] text-ink-3 block font-bold">EVENT BROKER</span>
                  <span className="font-semibold text-ink mt-1 block">Redis Pub/Sub</span>
                  <span className="text-[11px] text-ink-3">Sub-300ms ticket dispatch</span>
                </div>
                <div className="p-3 rounded-lg bg-elevated border border-line">
                  <span className="text-[10px] text-ink-3 block font-bold">DATA ISOLATION</span>
                  <span className="font-semibold text-ink mt-1 block">PostgreSQL RLS</span>
                  <span className="text-[11px] text-ink-3">Zero cross-tenant bleed</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Outcome & Metrics */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink">Verifiable Commercial Outcomes</h2>
            <div className="grid grid-cols-3 gap-4">
              {caseStudy.outcomeMetrics.map((metric, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-surface border border-line text-center">
                  <span className="font-mono text-3xl font-bold text-primary block mb-1">
                    {metric.value}
                  </span>
                  <span className="text-xs text-ink-2 font-medium">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Next Case Study */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6">
          <div className="p-6 rounded-xl bg-surface border border-line space-y-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-3 block">
              Up Next
            </span>
            <h3 className="font-serif text-xl text-ink">{nextStudy.title}</h3>
            <p className="text-xs text-ink-2 line-clamp-3">{nextStudy.summary}</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/case-studies/${nextStudy.slug}`)}
              block
            >
              <span>Next Case Study</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>

          <div className="p-6 rounded-xl bg-primary text-surface space-y-3">
            <h4 className="font-serif text-xl text-surface">Need a similar architecture?</h4>
            <p className="text-xs text-surface/80 leading-relaxed">
              We design and ship high-load platforms with dedicated milestone delivery and complete source ownership.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/contact')}
              block
              className="bg-clay text-white"
            >
              Talk to Our Engineering Lead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
