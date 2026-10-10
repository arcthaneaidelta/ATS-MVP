import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { SEED_ARTICLES } from '@/data/articles'
import { Button } from '@/components/ui/Button'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { ArrowLeft, Clock, Calendar, Globe, Share2, ArrowRight } from 'lucide-react'

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showYoastPreview, setShowYoastPreview] = useState(false)

  const article = SEED_ARTICLES.find((a) => a.slug === slug) || SEED_ARTICLES[0]
  const relatedArticles = SEED_ARTICLES.filter((a) => a.id !== article.id).slice(0, 2)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, (window.scrollY / totalHeight) * 100))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative py-20 lg:py-28 px-6 sm:px-10">
      {/* Reading Progress Hairline at top of viewport */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-50 pointer-events-none">
        <div
          className="h-full bg-[#B8864B] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-[1240px] mx-auto space-y-12">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/resources"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#17323A] hover:text-[#B8864B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to resources</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowYoastPreview(!showYoastPreview)}
            className="text-xs font-mono font-medium text-[#5E7F78] hover:text-[#17323A] flex items-center gap-1.5 border border-[#CFC7B6] px-2.5 py-1 rounded"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{showYoastPreview ? 'Hide Yoast SEO Preview' : 'Yoast SEO Snippet'}</span>
          </button>
        </div>

        {/* Yoast SEO Snippet Preview Box */}
        {showYoastPreview && (
          <div className="bg-white p-5 rounded-[12px] border border-[#B8864B] max-w-2xl shadow-sm space-y-2 animate-in fade-in">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A5F2B] font-bold flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>Yoast SEO Search Snippet Preview</span>
            </div>
            <div className="text-xs text-[#1a0dab] hover:underline font-medium text-base truncate">
              {article.yoast.metaTitle}
            </div>
            <div className="text-[11px] text-[#006621] font-mono truncate">
              https://tendervantage.co.bw/resources/{article.slug}
            </div>
            <p className="text-xs text-[#545454] leading-relaxed">
              {article.yoast.metaDescription}
            </p>
            <div className="text-[10px] text-[#6F7A78] font-mono pt-1">
              Focus Keyphrase: <strong>{article.yoast.focusKeyword}</strong> (Good SEO score · Green bullet)
            </div>
          </div>
        )}

        {/* Header Block */}
        <div className="max-w-[68ch] space-y-4">
          <div className="flex items-center gap-3 text-xs text-[#6F7A78]">
            <span className="font-mono text-[#8A5F2B] uppercase font-semibold">
              {article.category}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <span>·</span>
            <span>{article.publishedDate}</span>
          </div>

          <h1 className="type-h1 text-[#17323A] leading-[1.1] font-normal">
            {article.title}
          </h1>

          <p className="text-lg text-[#4A5755] leading-relaxed italic border-l-2 border-[#B8864B] pl-4">
            {article.summary}
          </p>

          <BuildMapTag
            label="Article Template"
            wpEquivalent="Elementor Single Post Template + Yoast SEO"
            position="top-left"
          />
        </div>

        {/* Main Reading Measure Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Article Prose (68ch maximum) */}
          <article className="lg:col-span-8 max-w-[68ch] space-y-6 text-base text-[#1B2625] leading-relaxed font-sans">
            {article.content.map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="mt-12 p-6 rounded-[12px] bg-[#FBF9F4] border border-[#E3DDD0] space-y-3">
              <h3 className="font-serif text-xl font-medium text-[#17323A]">
                Need expert support for an active tender?
              </h3>
              <p className="text-xs text-[#4A5755] leading-relaxed">
                TenderVantage prepares complete technical proposals, compliance packs, and pricing schedule reviews for Botswana contractors.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/store')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Browse services in store
              </Button>
            </div>
          </article>

          {/* Sticky Sidebar: Table of Contents & Related Guides */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="p-5 bg-white rounded-[12px] border border-[#E3DDD0] space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#17323A]">
                In this article
              </h4>
              <ul className="space-y-2 text-xs text-[#4A5755]">
                <li className="hover:text-[#17323A] cursor-pointer">
                  1. The Preliminary Examination Baseline
                </li>
                <li className="hover:text-[#17323A] cursor-pointer">
                  2. Why Evaluators Need an Index Map
                </li>
                <li className="hover:text-[#17323A] cursor-pointer">
                  3. Structuring Returnable Schedules
                </li>
                <li className="hover:text-[#17323A] cursor-pointer">
                  4. Practical Botswana Implementation
                </li>
              </ul>
            </div>

            {/* Related Articles */}
            <div className="p-5 bg-[#FBF9F4] rounded-[12px] border border-[#E3DDD0] space-y-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#17323A]">
                Related Guides
              </h4>
              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/resources/${rel.slug}`}
                    className="block group space-y-1 text-xs"
                  >
                    <span className="text-[10px] font-mono text-[#8A5F2B] uppercase">
                      {rel.category}
                    </span>
                    <div className="font-serif text-sm font-medium text-[#17323A] group-hover:text-[#B8864B] leading-snug">
                      {rel.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
