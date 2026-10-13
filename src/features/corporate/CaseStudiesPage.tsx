import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseStudies } from '../../data/seeds/corporate';
import { Chip } from '../../components/ui/Chip';
import { useDemoStore } from '../../store/demo';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CaseStudiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { isEditMode } = useDemoStore();

  const categories = ['All', 'Hospitality SaaS', 'Corporate LMS', 'FinTech Infrastructure'];

  const filtered = caseStudies.filter((cs) => {
    if (selectedCategory === 'All') return true;
    return cs.clientType.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
          Proven Engineering Delivery
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
          Case studies in high-volume platforms.
        </h1>
        <p className="text-base text-ink-2 leading-relaxed">
          Deep-dive architecture walkthroughs illustrating how BionicIQ approaches multi-tenancy, transactional reliability, and modern learning infrastructure.
        </p>

        {isEditMode && (
          <div className="inline-flex items-center gap-1.5 p-2 rounded-md bg-clay-tint text-clay text-xs border border-clay/30 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Edit Mode: Replace placeholder archetypes with your own case studies</span>
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          />
        ))}
      </div>

      {/* 2-Column Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((cs) => (
          <div
            key={cs.slug}
            onClick={() => navigate(`/case-studies/${cs.slug}`)}
            className="p-8 rounded-xl bg-surface border border-line hover:border-line-2 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-clay">
                  {cs.clientType}
                </span>
                <span className="text-xs text-ink-3 font-mono">{cs.timeline}</span>
              </div>

              <h2 className="font-serif text-2xl text-ink group-hover:text-primary transition-colors mb-3">
                {cs.title}
              </h2>

              <p className="text-sm text-ink-2 leading-relaxed mb-6">
                {cs.summary}
              </p>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-line text-xs">
                {cs.outcomeMetrics.map((m, idx) => (
                  <div key={idx}>
                    <span className="font-mono font-bold text-ink text-sm block">
                      {m.value}
                    </span>
                    <span className="text-[10px] text-ink-3">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-clay font-medium">
                <span>Read technical architecture scroll-story</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
