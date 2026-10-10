import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { SERVICES } from '@/data/services'
import { formatBWP } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { Accordion } from '@/components/ui/Accordion'
import { StatusPill } from '@/components/ui/StatusPill'
import { useStore } from '@/store/useStore'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { ServiceAddOn } from '@/mock/types'
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Check,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { cart, addToCart } = useStore()

  const service = SERVICES.find((s) => s.slug === slug) || SERVICES[0]

  // Optional Add-ons state
  const availableAddOns: ServiceAddOn[] = [
    { id: 'addon-rush', name: 'Rush delivery sprint', priceBwp: 1500 },
    { id: 'addon-revision', name: 'Extra revision round', priceBwp: 950 },
  ]

  const [selectedAddOns, setSelectedAddOns] = useState<ServiceAddOn[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const inCart = cart.some((c) => c.serviceId === service.id)

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.priceBwp, 0)
  const currentTotal = service.priceBwp + addOnsTotal

  const toggleAddOn = (addon: ServiceAddOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  const handleAddToCart = () => {
    setIsAdding(true)
    setTimeout(() => {
      addToCart(service.id, selectedAddOns)
      setIsAdding(false)
      navigate('/cart')
    }, 450)
  }

  // Related services
  const relatedServices = SERVICES.filter((s) =>
    service.relatedServiceIds.includes(s.id)
  ).slice(0, 2)

  const faqItems = service.faqs.map((f, i) => ({
    id: `faq-${i}`,
    title: f.question,
    content: f.answer,
  }))

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10 pb-32 lg:pb-28">
      <div className="max-w-[1240px] mx-auto space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6F7A78] font-mono">
          <Link to="/store" className="hover:text-[#17323A]">
            Store
          </Link>
          <span>/</span>
          <span>{service.stage}</span>
          <span>/</span>
          <span className="text-[#17323A] font-semibold">{service.name}</span>
        </div>

        {/* Title and Intro */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#EFEADF] text-[#8A5F2B] font-mono text-xs font-semibold uppercase">
            {service.stage} · {service.turnaround}
          </div>

          <h1 className="type-h1 text-[#17323A] leading-tight font-normal">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg text-[#4A5755] leading-relaxed">
            {service.description}
          </p>

          <BuildMapTag
            label="Service Detail"
            wpEquivalent="WooCommerce Single Product Override"
            position="top-left"
          />
        </div>

        {/* Two-Column Grid: Left Scope & Requirements (7 cols), Right Sticky Purchase Card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-12">
            {/* What is included */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#17323A]">
                What is included in this service
              </h2>
              <div className="bg-white rounded-[12px] border border-[#E3DDD0] p-6 divide-y divide-[#E3DDD0]">
                {service.inclusions.map((inc, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#3E7A5B] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#1B2625] leading-relaxed">{inc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* What we need from you */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#17323A]">
                What we need from you at intake
              </h2>
              <div className="bg-[#FBF9F4] rounded-[12px] border border-[#E3DDD0] p-6 space-y-3">
                <div className="text-xs font-mono text-[#8A5F2B] font-semibold uppercase">
                  Required Documents ({service.intakeFormTitle})
                </div>
                <div className="space-y-2.5">
                  {service.whatWeNeedFromYou.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4A5755]">
                      <FileText className="w-3.5 h-3.5 text-[#5E7F78] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How delivery works mini-timeline */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#17323A]">
                How delivery works for this service
              </h2>
              <div className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#17323A]">
                    Tracked delivery progression
                  </span>
                  <span className="text-[#6F7A78] font-mono">Turnaround: {service.turnaround}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  <div className="p-2 rounded bg-[#FBF9F4] border border-[#E3DDD0] space-y-1">
                    <StatusPill status="awaiting-intake" size="sm" />
                    <p className="text-[10px] text-[#6F7A78]">You submit files</p>
                  </div>
                  <div className="p-2 rounded bg-[#FBF9F4] border border-[#E3DDD0] space-y-1">
                    <StatusPill status="in-production" size="sm" />
                    <p className="text-[10px] text-[#6F7A78]">We author draft</p>
                  </div>
                  <div className="p-2 rounded bg-[#FBF9F4] border border-[#E3DDD0] space-y-1">
                    <StatusPill status="client-review" size="sm" />
                    <p className="text-[10px] text-[#6F7A78]">You review & test</p>
                  </div>
                  <div className="p-2 rounded bg-[#FBF9F4] border border-[#E3DDD0] space-y-1">
                    <StatusPill status="revisions-requested" size="sm" />
                    <p className="text-[10px] text-[#6F7A78]">Optional edits</p>
                  </div>
                  <div className="p-2 rounded bg-[#FBF9F4] border border-[#E3DDD0] space-y-1">
                    <StatusPill status="delivered" size="sm" />
                    <p className="text-[10px] text-[#6F7A78]">Final pack vault</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Service FAQ */}
            <section className="space-y-4">
              <h2 className="font-serif text-2xl font-medium text-[#17323A]">
                Service Questions
              </h2>
              <Accordion items={faqItems} defaultOpenId="faq-0" />
            </section>
          </div>

          {/* Right Sticky Purchase Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="p-6 sm:p-8 bg-white rounded-[16px] border border-[#E3DDD0] shadow-[0_6px_20px_-8px_rgba(23,50,58,0.14)] space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#E3DDD0]">
                <div className="text-xs text-[#6F7A78] font-mono uppercase">
                  Service Investment
                </div>
                <div className="font-serif text-3xl sm:text-4xl font-medium text-[#17323A] tracking-tight">
                  {service.fromPrice ? 'from ' : ''}
                  {formatBWP(currentTotal)}
                </div>
                <div className="text-xs text-[#6F7A78]">
                  excl. 14% VAT · Billed in Botswana Pula
                </div>
              </div>

              {/* Turnaround chip */}
              <div className="flex items-center justify-between text-xs p-3 rounded-[8px] bg-[#FBF9F4] border border-[#E3DDD0]">
                <span className="text-[#6F7A78]">First-draft turnaround:</span>
                <span className="font-semibold text-[#17323A] font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#B8864B]" />
                  <span>{service.turnaround}</span>
                </span>
              </div>

              {/* Optional Add-ons Checkboxes */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#17323A]">
                  Optional Scope Add-ons
                </span>

                <div className="space-y-2">
                  {availableAddOns.map((addon) => {
                    const isChecked = selectedAddOns.some((a) => a.id === addon.id)
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-3 rounded-[8px] border text-xs cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'border-[#17323A] bg-[#FBF9F4]'
                            : 'border-[#E3DDD0] hover:bg-[#FBF9F4]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddOn(addon)}
                            className="rounded accent-[#17323A] w-4 h-4 cursor-pointer"
                          />
                          <span className="font-medium text-[#1B2625]">{addon.name}</span>
                        </div>
                        <span className="font-mono text-[#8A5F2B] font-semibold">
                          +{formatBWP(addon.priceBwp)}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Primary Add to Cart Button */}
              <div className="pt-2">
                {inCart ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/cart')}
                    className="w-full"
                    leftIcon={<Check className="w-4 h-4 text-emerald-600" />}
                  >
                    In Cart · View Cart
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    isLoading={isAdding}
                    loadingText="Adding to cart..."
                    className="w-full shadow-sm"
                  >
                    Add to cart · {formatBWP(currentTotal)}
                  </Button>
                )}
              </div>

              <div className="text-center">
                <Link
                  to="/contact"
                  className="text-xs text-[#6F7A78] hover:text-[#17323A] underline"
                >
                  Have a question before buying?
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Often Bought With Related Services */}
        {relatedServices.length > 0 && (
          <section className="pt-16 border-t border-[#E3DDD0] space-y-6">
            <h3 className="font-serif text-2xl font-medium text-[#17323A]">
              Often bought together
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#8A5F2B] uppercase font-bold">
                      {rel.stage}
                    </span>
                    <h4 className="font-serif text-lg font-medium text-[#17323A] mt-0.5">
                      {rel.name}
                    </h4>
                    <div className="font-serif text-base font-semibold text-[#17323A] mt-1">
                      {formatBWP(rel.priceBwp)}
                    </div>
                  </div>

                  <Link
                    to={`/store/${rel.slug}`}
                    className="text-xs font-semibold text-[#17323A] hover:text-[#B8864B] flex items-center gap-1 shrink-0"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Fixed Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E3DDD0] z-40 flex items-center justify-between gap-4 pb-[env(safe-area-inset-bottom)] shadow-lg">
        <div>
          <div className="font-serif text-lg font-bold text-[#17323A]">
            {formatBWP(currentTotal)}
          </div>
          <div className="text-[10px] text-[#6F7A78]">excl. VAT</div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleAddToCart}
          className="flex-1 max-w-[200px]"
        >
          {inCart ? 'View Cart' : 'Add to cart'}
        </Button>
      </div>
    </div>
  )
}
