import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SERVICES } from '@/data/services'
import { TenderStage, ServiceItem } from '@/mock/types'
import { formatBWP } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useStore } from '@/store/useStore'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Clock, ArrowRight, HelpCircle, Check, Loader2, Sparkles } from 'lucide-react'

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToCart } = useStore()

  const [activeStage, setActiveStage] = useState<TenderStage>('Find')
  const [finderModalOpen, setFinderModalOpen] = useState(false)

  // Service Finder Questions state
  const [finderQ1, setFinderQ1] = useState<string>('yes') // tender in hand?
  const [finderQ2, setFinderQ2] = useState<string>('no') // closing in 7 days?
  const [finderQ3, setFinderQ3] = useState<string>('yes') // PPADB registered?
  const [finderLoading, setFinderLoading] = useState(false)
  const [finderResult, setFinderResult] = useState<ServiceItem | null>(null)

  const stages: TenderStage[] = [
    'Find',
    'Decide',
    'Prepare',
    'Write',
    'Submit and learn',
  ]

  const stageDescriptions: Record<TenderStage, string> = {
    Find: 'Before spending non-refundable purchase fees on tender packs, we scan gazettes, councils, and mining portals against your registered CIPA codes.',
    Decide:
      'We dissect Invitation to Tender instructions to spot fatal administrative traps, guarantee bond risks, and provide a definitive Go or No-Go decision.',
    Prepare:
      'Ensure your statutory returnables, PPADB grading, BURS tax clearance pins, and corporate capability profiles comply fully with Stage 1 rules.',
    Write:
      'Our senior writers author point-scoring technical methodologies, resource schedules, risk registers, and audited Bill of Quantities pricing.',
    'Submit and learn':
      'We supervise indexing and tender box envelope sealing, and conduct post-bid debriefs to extract competitive scoring data for future bids.',
  }

  const handleFinderSubmit = () => {
    setFinderLoading(true)
    setTimeout(() => {
      setFinderLoading(false)
      if (finderQ1 === 'no') {
        setFinderResult(SERVICES.find((s) => s.slug === 'tender-opportunity-scan') || SERVICES[0])
      } else if (finderQ2 === 'yes') {
        setFinderResult(SERVICES.find((s) => s.slug === 'bid-rapid-review-48-hours') || SERVICES[2])
      } else if (finderQ3 === 'no') {
        setFinderResult(SERVICES.find((s) => s.slug === 'ppadb-registration-support') || SERVICES[3])
      } else {
        setFinderResult(SERVICES.find((s) => s.slug === 'technical-proposal-writing') || SERVICES[6])
      }
    }, 600)
  }

  const scrollToStage = (st: TenderStage) => {
    setActiveStage(st)
    const el = document.getElementById(`stage-${st.toLowerCase().replace(/\s+/g, '-')}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
            SERVICE DIRECTORY
          </div>
          <h1 className="type-h1 text-[#17323A] leading-tight">
            Ten services, in the order you need them.
          </h1>
          <p className="text-base sm:text-lg text-[#4A5755] leading-relaxed">
            Every service has a fixed scope, turnaround in working days, and a fixed price in Botswana Pula. Browse by tender stage or use our interactive Service Finder.
          </p>

          <BuildMapTag
            label="Services Overview"
            wpEquivalent="Elementor Template / Services Directory"
            position="top-left"
          />
        </div>

        {/* Not Sure Where to Start Banner */}
        <div className="bg-[#FBF9F4] p-5 sm:p-6 rounded-[12px] border border-[#E3DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#17323A] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#B8864B]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#17323A]">
                Not sure where to start with your tender?
              </h3>
              <p className="text-xs text-[#6F7A78] mt-0.5">
                Answer three quick questions for a tailored recommendation.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setFinderResult(null)
              setFinderModalOpen(true)
            }}
            className="shrink-0"
          >
            Open Service Finder
          </Button>
        </div>

        {/* Sticky Horizontal Stage Tabs */}
        <div className="sticky top-[72px] z-30 bg-[#F6F3EC]/95 backdrop-blur-sm py-3 border-b border-[#E3DDD0] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {stages.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => scrollToStage(st)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeStage === st
                  ? 'bg-[#17323A] text-[#F6F3EC] shadow-sm'
                  : 'bg-[#EFEADF] text-[#4A5755] hover:text-[#17323A] hover:bg-[#E6DFD0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Stages Breakdown */}
        <div className="space-y-20 pt-4">
          {stages.map((st) => {
            const stageServices = SERVICES.filter((s) => s.stage === st)
            const stageId = `stage-${st.toLowerCase().replace(/\s+/g, '-')}`

            return (
              <section
                key={st}
                id={stageId}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6 border-t border-[#E3DDD0]"
              >
                {/* Left Description Column (4 cols) */}
                <div className="lg:col-span-4 space-y-3">
                  <span className="text-xs font-mono font-bold text-[#8A5F2B] uppercase">
                    Stage · {st}
                  </span>
                  <h2 className="font-serif text-2xl text-[#17323A] font-medium">
                    {st}
                  </h2>
                  <p className="text-sm text-[#4A5755] leading-relaxed">
                    {stageDescriptions[st]}
                  </p>
                </div>

                {/* Right Service Rows Column (8 cols) */}
                <div className="lg:col-span-8 divide-y divide-[#E3DDD0] border-y border-[#E3DDD0]">
                  {stageServices.map((srv) => (
                    <div
                      key={srv.id}
                      className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FBF9F4] px-3 -mx-3 rounded-[6px] transition-colors group"
                    >
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center gap-3 text-xs text-[#6F7A78]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{srv.turnaround}</span>
                          </span>
                        </div>

                        <h3 className="font-serif text-xl font-medium text-[#17323A] group-hover:text-[#B8864B] transition-colors">
                          {srv.name}
                        </h3>

                        <p className="text-xs text-[#4A5755] leading-relaxed">
                          {srv.shortOutcome}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                        <span className="font-serif text-lg font-medium text-[#17323A]">
                          {srv.fromPrice ? 'from ' : ''}
                          {formatBWP(srv.priceBwp)}
                        </span>

                        <Link
                          to={`/store/${srv.slug}`}
                          className="text-xs font-semibold text-[#17323A] group-hover:text-[#B8864B] flex items-center gap-1"
                        >
                          <span>View in store</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      {/* Service Finder Modal */}
      <Modal
        isOpen={finderModalOpen}
        onClose={() => setFinderModalOpen(false)}
        title="TenderVantage Service Finder"
        description="Answer 3 quick questions to find the most suitable service for your deadline."
      >
        {finderLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#17323A]">
            <Loader2 className="w-8 h-8 animate-spin text-[#B8864B]" />
            <span className="text-sm font-medium">Matching Botswana procurement rubrics...</span>
          </div>
        ) : finderResult ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 rounded-[10px] bg-[#FBF9F4] border border-[#E3DDD0] space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-[#8A5F2B]">
                Recommended Match
              </span>
              <h4 className="font-serif text-xl font-medium text-[#17323A]">
                {finderResult.name}
              </h4>
              <p className="text-xs text-[#4A5755] leading-relaxed">
                {finderResult.shortOutcome}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-medium text-[#17323A]">
                <span>Turnaround: {finderResult.turnaround}</span>
                <span className="font-serif text-base font-bold">
                  {finderResult.fromPrice ? 'from ' : ''}
                  {formatBWP(finderResult.priceBwp)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  addToCart(finderResult.id)
                  setFinderModalOpen(false)
                }}
                className="flex-1"
              >
                Add to cart
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setFinderModalOpen(false)
                  navigate(`/store/${finderResult.slug}`)
                }}
              >
                View details
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-sm">
            <div className="space-y-2">
              <label className="font-semibold text-[#17323A] block">
                1. Do you have a specific tender document in hand?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFinderQ1('yes')}
                  className={`p-2.5 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    finderQ1 === 'yes' ? 'bg-[#17323A] text-white border-[#17323A]' : 'bg-white border-[#CFC7B6]'
                  }`}
                >
                  Yes, we have the ITT
                </button>
                <button
                  type="button"
                  onClick={() => setFinderQ1('no')}
                  className={`p-2.5 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    finderQ1 === 'no' ? 'bg-[#17323A] text-white border-[#17323A]' : 'bg-white border-[#CFC7B6]'
                  }`}
                >
                  No, looking for opportunities
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-[#17323A] block">
                2. Is your tender closing within 7 days?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFinderQ2('yes')}
                  className={`p-2.5 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    finderQ2 === 'yes' ? 'bg-[#17323A] text-white border-[#17323A]' : 'bg-white border-[#CFC7B6]'
                  }`}
                >
                  Yes (Urgent / Under 7 days)
                </button>
                <button
                  type="button"
                  onClick={() => setFinderQ2('no')}
                  className={`p-2.5 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    finderQ2 === 'no' ? 'bg-[#17323A] text-white border-[#17323A]' : 'bg-white border-[#CFC7B6]'
                  }`}
                >
                  No (More than 7 days)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-[#17323A] block">
                3. Are you registered with PPADB / PPRA in Botswana?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFinderQ3('yes')}
                  className={`p-2.5 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    finderQ3 === 'yes' ? 'bg-[#17323A] text-white border-[#17323A]' : 'bg-white border-[#CFC7B6]'
                  }`}
                >
                  Yes, active codes
                </button>
                <button
                  type="button"
                  onClick={() => setFinderQ3('no')}
                  className={`p-2.5 rounded-[6px] border text-xs font-semibold cursor-pointer ${
                    finderQ3 === 'no' ? 'bg-[#17323A] text-white border-[#17323A]' : 'bg-white border-[#CFC7B6]'
                  }`}
                >
                  No, need code registration
                </button>
              </div>
            </div>

            <div className="pt-3">
              <Button variant="primary" size="lg" onClick={handleFinderSubmit} className="w-full">
                Find My Service
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
