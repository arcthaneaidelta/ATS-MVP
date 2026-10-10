import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { SERVICES } from '@/data/services'
import { TenderStage, ServiceItem } from '@/mock/types'
import { formatBWP } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Clock, Search, Check, ShoppingBag, ArrowRight, X } from 'lucide-react'

export const StoreCataloguePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { cart, addToCart } = useStore()

  const currentStage = searchParams.get('stage') || 'All'
  const currentSort = searchParams.get('sort') || 'recommended'
  const currentQuery = searchParams.get('q') || ''

  const [searchVal, setSearchVal] = useState(currentQuery)

  const stages = [
    'All',
    'Find',
    'Decide',
    'Prepare',
    'Write',
    'Submit and learn',
  ]

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        document.getElementById('catalogue-search')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const setStage = (st: string) => {
    const next = new URLSearchParams(searchParams)
    if (st === 'All') next.delete('stage')
    else next.set('stage', st)
    setSearchParams(next)
  }

  const setSort = (sort: string) => {
    const next = new URLSearchParams(searchParams)
    next.set('sort', sort)
    setSearchParams(next)
  }

  const handleSearchChange = (val: string) => {
    setSearchVal(val)
    const next = new URLSearchParams(searchParams)
    if (!val) next.delete('q')
    else next.set('q', val)
    setSearchParams(next)
  }

  // Filter & sort
  let filtered = SERVICES.filter((s) => {
    const matchStage = currentStage === 'All' || s.stage === currentStage
    const matchSearch =
      !currentQuery ||
      s.name.toLowerCase().includes(currentQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(currentQuery.toLowerCase())
    return matchStage && matchSearch
  })

  if (currentSort === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.priceBwp - b.priceBwp)
  } else if (currentSort === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.priceBwp - a.priceBwp)
  } else if (currentSort === 'turnaround') {
    filtered = [...filtered].sort((a, b) => a.turnaround.localeCompare(b.turnaround))
  }

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E3DDD0]">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              WOOCOMMERCE SERVICE STORE
            </div>
            <h1 className="type-h1 text-[#17323A] mt-1 leading-tight">
              Services
            </h1>
            <p className="text-sm text-[#4A5755] mt-2">
              Showing {filtered.length} of 10 services · Fixed prices in Botswana Pula (BWP)
            </p>
          </div>

          {/* Search Field with "/" shortcut indicator */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#6F7A78] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="catalogue-search"
              type="text"
              value={searchVal}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search services or press /"
              className="w-full h-11 pl-9 pr-8 rounded-[8px] bg-white border border-[#CFC7B6] text-xs text-[#1B2625] placeholder:text-[#6F7A78] focus:outline-none focus:border-[#17323A]"
            />
            {searchVal && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F7A78]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <BuildMapTag
            label="Service Store"
            wpEquivalent="WooCommerce Core · Virtual Services"
            position="top-left"
          />
        </div>

        {/* Filters and Sort Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Stage Chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0">
            {stages.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStage(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  currentStage === st
                    ? 'bg-[#17323A] text-[#F6F3EC]'
                    : 'bg-[#EFEADF] text-[#4A5755] hover:text-[#17323A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#6F7A78]">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 px-3 rounded-[6px] bg-white border border-[#CFC7B6] text-xs font-semibold text-[#17323A] focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="turnaround">Fastest turnaround</option>
            </select>
          </div>
        </div>

        {/* 3-Column Services Grid */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-[12px] border border-[#E3DDD0] space-y-4">
            <p className="text-sm text-[#4A5755]">
              No services match "{currentQuery}".
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setStage('All')
                handleSearchChange('')
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((srv) => {
              const inCart = cart.some((c) => c.serviceId === srv.id)

              return (
                <div
                  key={srv.id}
                  className="p-6 bg-[#FBF9F4] rounded-[12px] border border-[#E3DDD0] hover:border-[#CFC7B6] hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#8A5F2B] font-semibold uppercase">
                        {srv.stage}
                      </span>
                      <span className="text-[#6F7A78] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{srv.turnaround}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-medium text-[#17323A] leading-snug">
                      <Link
                        to={`/store/${srv.slug}`}
                        className="hover:text-[#B8864B] transition-colors"
                      >
                        {srv.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-[#4A5755] leading-relaxed line-clamp-3">
                      {srv.shortOutcome}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-[#E3DDD0] mt-6 flex items-center justify-between">
                    <div>
                      <div className="font-serif text-xl font-medium text-[#17323A]">
                        {srv.fromPrice ? 'from ' : ''}
                        {formatBWP(srv.priceBwp)}
                      </div>
                      <div className="text-[10px] text-[#6F7A78] font-mono">excl. 14% VAT</div>
                    </div>

                    {inCart ? (
                      <button
                        type="button"
                        onClick={() => navigate('/cart')}
                        className="h-9 px-3.5 rounded-[6px] border border-[#3E7A5B] bg-[#3E7A5B]/10 text-[#3E7A5B] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#3E7A5B]/20 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>In cart ✓</span>
                      </button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => addToCart(srv.id)}
                        className="shadow-xs"
                      >
                        Add to cart
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
