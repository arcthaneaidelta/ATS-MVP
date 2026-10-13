import React from 'react';
import { useNavigate } from 'react-router-dom';
import { insightArticles } from '../../data/seeds/corporate';
import { ArrowRight, BookOpen } from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
          Engineering & Design Perspectives
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
          Insights on ecosystem architecture.
        </h1>
        <p className="text-base text-ink-2 leading-relaxed">
          Technical essays, multi-tenancy blueprints, and interaction case notes from our senior studio engineers.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {insightArticles.map((art) => (
          <article
            key={art.slug}
            onClick={() => navigate(`/insights/${art.slug}`)}
            className="p-8 rounded-xl bg-surface border border-line hover:border-line-2 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-line mb-4 text-xs font-mono">
                <span className="font-semibold text-clay uppercase">{art.category}</span>
                <span className="text-ink-3">{art.readTime}</span>
              </div>

              <h2 className="font-serif text-2xl text-ink group-hover:text-primary transition-colors mb-3 leading-snug">
                {art.title}
              </h2>

              <p className="text-xs text-ink-2 leading-relaxed mb-6">
                {art.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-line flex items-center justify-between text-xs text-clay font-medium">
              <span className="text-[11px] text-ink-3 font-mono">{art.publishedDate}</span>
              <span className="inline-flex items-center gap-1 group-hover:underline">
                <span>Read essay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
