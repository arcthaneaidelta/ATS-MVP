import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SEED_ARTICLES, ArticleItem } from '@/data/articles'
import { getDaysLeft } from '@/mock/clock'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Search, Clock, Calendar, ArrowRight, X, Globe } from 'lucide-react'

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    'All',
    'Preparing to bid',
    'Compliance',
    'Writing',
    'Pricing',
    'After the bid',
  ]

  const tenderCalendarItems = [
    {
      title: 'Supply and Delivery of Mining Consumables',
      entity: 'Morupule Coal Mine',
      closingDate: '2026-10-19',
      reference: 'NR/2026/114',
    },
    {
      title: 'Refrigerated Cold Chain Distribution Services',
      entity: 'North West District Council',
      closingDate: '2026-10-26',
      reference: 'NWDC/LOG/2026/01',
    },
    {
      title: 'Open Supplier Panel Registration Drive',
      entity: 'Debswana Diamond Company',
      closingDate: '2026-10-31',
      reference: 'REG/2026/04',
    },
    {
      title: 'Supply of Heavy Fleet Spares & BoQ Schedule',
      entity: 'City of Francistown Council',
      closingDate: '2026-11-14',
      reference: 'COF/MECH/2026/09',
    },
  ]

  const filteredArticles = SEED_ARTICLES.filter((art) => {
    const matchesCategory =
      selectedCategory === 'All' || art.category === selectedCategory
    const matchesSearch =
      searchQuery.trim() === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const featuredArticle = SEED_ARTICLES[0]

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
            BOTSWANA BIDDING GUIDES & CALENDAR
          </div>
          <h1 className="type-h1 text-[#17323A] leading-tight">
            Procurement knowledge for Botswana contractors.
          </h1>
          <p className="text-base sm:text-lg text-[#4A5755] leading-relaxed">
            Practical insights on compliance matrices, BoQ pricing, PPRA debriefs, and avoiding disqualification traps.
          </p>

          <BuildMapTag
            label="Resources / SEO"
            wpEquivalent="Yoast SEO + Custom Post Type Articles"
            position="top-left"
          />
        </div>

        {/* Featured Article Card (Horizontal) */}
        {featuredArticle && selectedCategory === 'All' && !searchQuery && (
          <div className="bg-white rounded-[16px] border border-[#E3DDD0] p-6 sm:p-10 shadow-[0_6px_20px_-8px_rgba(23,50,58,0.14)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-[#EFEADF] text-[#8A5F2B]">
                  Featured · {featuredArticle.category}
                </span>
                <span className="text-xs text-[#6F7A78] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{featuredArticle.readTime}</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#17323A] leading-tight">
                <Link
                  to={`/resources/${featuredArticle.slug}`}
                  className="hover:text-[#B8864B] transition-colors"
                >
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-sm sm:text-base text-[#4A5755] leading-relaxed max-w-2xl">
                {featuredArticle.summary}
              </p>

              <div className="pt-2">
                <Link
                  to={`/resources/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#17323A] hover:text-[#B8864B] transition-colors"
                >
                  <span>Read full guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#FBF9F4] p-5 rounded-[12px] border border-[#E3DDD0] space-y-2">
              <div className="text-[11px] font-mono uppercase text-[#6F7A78] font-bold">
                Why this matters for your bid
              </div>
              <p className="text-xs text-[#1B2625] leading-relaxed">
                Tender committees review dozens of bulky binders. Placing an index matrix at the front ensures evaluators award administrative points in under 90 seconds.
              </p>
            </div>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DDD0]">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#17323A] text-[#F6F3EC]'
                    : 'bg-[#EFEADF] text-[#4A5755] hover:text-[#17323A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-[#6F7A78] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-10 pl-9 pr-8 rounded-[8px] bg-white border border-[#CFC7B6] text-xs text-[#1B2625] placeholder:text-[#6F7A78] focus:outline-none focus:border-[#17323A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6F7A78] hover:text-[#17323A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content: Grid + Tender Calendar Side Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Articles Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="text-xs text-[#6F7A78] font-mono">
              Showing {filteredArticles.length} article{filteredArticles.length === 1 ? '' : 's'}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-[12px] border border-[#E3DDD0] space-y-3">
                <p className="text-sm text-[#4A5755]">
                  No articles match "{searchQuery}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearchQuery('')
                  }}
                  className="text-xs font-semibold text-[#B8864B] underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] hover:border-[#CFC7B6] hover:-translate-y-0.5 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#6F7A78]">
                        <span className="font-mono text-[#8A5F2B] font-semibold uppercase">
                          {art.category}
                        </span>
                        <span>{art.readTime}</span>
                      </div>

                      <h3 className="font-serif text-xl font-medium text-[#17323A] leading-snug">
                        <Link
                          to={`/resources/${art.slug}`}
                          className="hover:text-[#B8864B] transition-colors"
                        >
                          {art.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-[#4A5755] leading-relaxed line-clamp-3">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E3DDD0] mt-6 flex items-center justify-between text-xs font-semibold text-[#17323A]">
                      <span>{art.publishedDate}</span>
                      <Link
                        to={`/resources/${art.slug}`}
                        className="text-[#17323A] hover:text-[#B8864B] flex items-center gap-1 group"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tender Calendar Side Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#FBF9F4] rounded-[16px] border border-[#E3DDD0] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD0]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B8864B]" />
                <h3 className="font-serif text-lg font-medium text-[#17323A]">
                  Tender Calendar
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#6F7A78]">Botswana Gazettes</span>
            </div>

            <p className="text-xs text-[#4A5755] leading-relaxed">
              Upcoming closing dates in Gaborone and district councils. Plan your submission sprint ahead of time.
            </p>

            <div className="space-y-3">
              {tenderCalendarItems.map((item, idx) => {
                const daysLeft = getDaysLeft(item.closingDate)
                const isUrgent = daysLeft <= 10

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-[8px] border border-[#E3DDD0] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-[#6F7A78] truncate max-w-[140px]">
                        {item.reference}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          isUrgent
                            ? 'bg-[#A94438]/15 text-[#A94438]'
                            : 'bg-[#5E7F78]/15 text-[#5E7F78]'
                        }`}
                      >
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Closes today'}
                      </span>
                    </div>

                    <div className="font-serif text-sm font-medium text-[#17323A] leading-snug">
                      {item.title}
                    </div>

                    <div className="text-[11px] text-[#4A5755] truncate">
                      {item.entity}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-2 text-[11px] text-[#6F7A78]">
              Need a rapid review on any of these tenders?{' '}
              <Link to="/store/bid-rapid-review-48-hours" className="text-[#8A5F2B] font-semibold underline">
                Book 48-Hour Review →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
