import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { insightArticles } from '../../data/seeds/corporate';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const InsightDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const article = insightArticles.find((a) => a.slug === slug) || insightArticles[0];

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-12">
      <div>
        <button
          type="button"
          onClick={() => navigate('/insights')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-3 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Insights</span>
        </button>
      </div>

      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono text-ink-3">
          <span className="text-clay font-bold uppercase">{article.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {article.publishedDate}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
          {article.title}
        </h1>

        <p className="text-lg text-ink-2 italic border-l-2 border-clay pl-4 my-6">
          {article.excerpt}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-line">
        {/* Article Body */}
        <div className="lg:col-span-8 space-y-6 text-sm text-ink leading-relaxed font-sans">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-base text-ink leading-relaxed">
              {paragraph}
            </p>
          ))}

          <div className="p-6 rounded-xl bg-surface border border-line mt-12 space-y-3">
            <h4 className="font-serif text-lg text-ink">Architectural Takeaway</h4>
            <p className="text-xs text-ink-2 leading-relaxed">
              When building modern SaaS or high-volume learning hubs, selecting unified schemas and declarative UI primitives prevents exponential complexity from taking root.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6">
          <div className="p-6 rounded-xl bg-surface border border-line space-y-3">
            <span className="text-[10px] uppercase font-bold text-ink-3 block">Author</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-serif font-bold text-primary">
                BIQ
              </div>
              <div>
                <p className="text-xs font-bold text-ink">BionicIQ Engineering Studio</p>
                <p className="text-[11px] text-ink-3">Systems & Performance Group</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-clay-tint/40 border border-clay/20 space-y-3">
            <h4 className="font-serif text-lg text-ink">Explore the Live Ecosystem</h4>
            <p className="text-xs text-ink-2">
              See these architecture principles running live in Cirqla and Academy.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/cirqla')} block>
              Try Cirqla Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
