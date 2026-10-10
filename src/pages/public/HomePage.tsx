import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { StatusPill } from '@/components/ui/StatusPill'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { BidWorkbenchScene } from '@/components/scenes/BidWorkbenchScene'
import { ContourBackdrop } from '@/components/scenes/ContourBackdrop'
import { LoaderSequence } from '@/components/scenes/LoaderSequence'
import { SERVICES } from '@/data/services'
import { SEED_ARTICLES } from '@/data/articles'
import { CustomOrderStatus, TenderStage } from '@/mock/types'
import { formatBWP } from '@/lib/format'
import {
  ArrowRight,
  Shield,
  Clock,
  Landmark,
  FileCheck,
  CheckCircle2,
  Mail,
  ChevronRight,
  Scale,
  Lock,
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()

  // Interactive "Follow your order" stepper state
  const [activeStatusStep, setActiveStatusStep] =
    useState<CustomOrderStatus>('in-production')

  // Featured 6 services
  const featuredServices = SERVICES.slice(0, 6)

  // Status explanations for Wow Moment 2 (Follow your order)
  const statusDetails: Record<
    CustomOrderStatus,
    {
      title: string
      actor: string
      duration: string
      clientAction: string
      emailSubject: string
      nextStepButton: string
      nextStepUrl: string
    }
  > = {
    'awaiting-intake': {
      title: 'Awaiting Intake',
      actor: 'Client acts',
      duration: 'Immediate upon checkout',
      clientAction: 'Upload tender specifications, BURS clearance, and CIPA documents.',
      emailSubject: 'Order TV-2026-0148 confirmed: Complete your intake',
      nextStepButton: 'Complete intake form',
      nextStepUrl: '/portal/intake/A?orderId=ord-148',
    },
    'in-production': {
      title: 'In Production',
      actor: 'TenderVantage acts',
      duration: 'Typically 3–5 working days',
      clientAction: 'Your assigned senior writer is authoring the compliance matrix and methodology.',
      emailSubject: 'We have your documents, work has started',
      nextStepButton: 'Track progress in portal',
      nextStepUrl: '/portal/orders/ord-148',
    },
    'client-review': {
      title: 'Client Review',
      actor: 'Client acts',
      duration: '3 working days review window',
      clientAction: 'Download the compiled draft. Approve for final pack or request specific line revisions.',
      emailSubject: 'Your draft is ready for review: TV-2026-0141',
      nextStepButton: 'Review draft & approve',
      nextStepUrl: '/portal/orders/ord-141',
    },
    'revisions-requested': {
      title: 'Revisions Requested',
      actor: 'TenderVantage acts',
      duration: '24–48 hours turnaround',
      clientAction: 'Writer incorporates your pricing adjustments or CV amendments before final packaging.',
      emailSubject: 'We have your revision request: TV-2026-0119',
      nextStepButton: 'View writer message',
      nextStepUrl: '/portal/orders/ord-119',
    },
    delivered: {
      title: 'Delivered',
      actor: 'Completed',
      duration: 'Final submission ready',
      clientAction: 'Download complete sealed submission pack, tender box labels, and administrative returnables.',
      emailSubject: 'Your files are ready: TV-2026-0132 delivered',
      nextStepButton: 'Download all files (.zip)',
      nextStepUrl: '/portal/orders/ord-132',
    },
  }

  const lifecycleStages: {
    stage: TenderStage
    title: string
    description: string
    serviceCount: number
  }[] = [
    {
      stage: 'Find',
      title: 'Find the right invitation',
      description: 'Filter gazettes, parastatals, and mines against your specific CIPA codes before purchasing documents.',
      serviceCount: 1,
    },
    {
      stage: 'Decide',
      title: 'Decide with a Go / No-Go review',
      description: 'Dissect the ITT to calculate feasibility, guarantee bond requirements, and eliminate low-probability bids.',
      serviceCount: 2,
    },
    {
      stage: 'Prepare',
      title: 'Prepare compliance returnables',
      description: 'Assemble PPADB registration, BURS clearances, company profiles, and sworn declarations for Stage 1 pass.',
      serviceCount: 3,
    },
    {
      stage: 'Write',
      title: 'Write technical proposals and BoQs',
      description: 'Author rigorous, persuasive methodology and audited pricing schedules to maximize points from evaluators.',
      serviceCount: 3,
    },
    {
      stage: 'Submit and learn',
      title: 'Submit safely and extract debrief insights',
      description: 'Index physical tender box binders, manage sealing, and request post-award debriefs to refine future bids.',
      serviceCount: 1,
    },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* 1-second Session Loader */}
      <LoaderSequence />

      {/* 1. Hero Section */}
      <section className="relative min-h-[min(100svh,860px)] min-h-[640px] pt-28 pb-16 px-6 sm:px-10 flex items-center border-b border-[#E3DDD0] overflow-hidden bg-[#F6F3EC]">
        <ContourBackdrop opacity={0.4} />

        <div className="relative max-w-[1240px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
          {/* Left 6 Columns */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEADF] border border-[#CFC7B6] text-[11px] font-mono uppercase tracking-[0.1em] font-semibold text-[#8A5F2B]">
              <Landmark className="w-3.5 h-3.5" />
              <span>TENDER WRITING AND BID SUPPORT · GABORONE</span>
            </div>

            <h1 className="type-h1 text-[#17323A] font-normal leading-[1.05]">
              Tenders written to be scored.
            </h1>

            <p className="type-body text-[#4A5755] max-w-[54ch]">
              We prepare compliant, persuasive tender submissions for Botswana’s contractors and suppliers, from the first read of the documents to the final signed pack.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/store')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-sm"
              >
                Browse services
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/how-it-works')}
              >
                See how an order works
              </Button>
            </div>

            {/* Trust Line */}
            <div className="pt-6 border-t border-[#E3DDD0]/70 flex flex-wrap items-center gap-6 text-xs text-[#4A5755]">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E7A5B]" />
                <span>Botswana-based</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-[#5E7F78]" />
                <span>Confidential by default</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="font-mono text-[#8A5F2B] font-bold">BWP</span>
                <span>Fixed-price services in Pula</span>
              </div>
            </div>

            <BuildMapTag
              label="Hero"
              wpEquivalent="Elementor Pro · Home Hero Section"
              position="top-left"
            />
          </div>

          {/* Right 6 Columns: The Bid Workbench Scene */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <BidWorkbenchScene />
          </div>
        </div>

        {/* Scroll Cue (bottom-left) */}
        <div className="hidden sm:flex absolute bottom-6 left-10 items-center gap-2 text-[#6F7A78] text-[11px] font-mono uppercase tracking-widest pointer-events-none">
          <span>Scroll</span>
          <div className="w-8 h-[1px] bg-[#CFC7B6]" />
        </div>
      </section>

      {/* 2. Proof Strip */}
      <section className="bg-[#FBF9F4] py-8 border-b border-[#E3DDD0] px-6 sm:px-10">
        <div className="max-w-[1240px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-[#E3DDD0]">
          <div className="pt-4 lg:pt-0 lg:px-4 first:pl-0">
            <div className="font-serif text-3xl sm:text-4xl text-[#17323A] font-medium font-mono">
              10
            </div>
            <div className="text-xs text-[#4A5755] font-medium mt-1">
              Fixed-price services defined in Pula
            </div>
          </div>

          <div className="pt-4 lg:pt-0 lg:px-4">
            <div className="font-serif text-3xl sm:text-4xl text-[#17323A] font-medium font-mono">
              48 h
            </div>
            <div className="text-xs text-[#4A5755] font-medium mt-1">
              First-draft turnaround (from)
            </div>
          </div>

          <div className="pt-4 lg:pt-0 lg:px-4">
            <div className="font-serif text-3xl sm:text-4xl text-[#17323A] font-medium font-mono">
              5
            </div>
            <div className="text-xs text-[#4A5755] font-medium mt-1">
              Tracked transparent delivery stages
            </div>
          </div>

          <div className="pt-4 lg:pt-0 lg:px-4">
            <div className="font-serif text-3xl sm:text-4xl text-[#17323A] font-medium font-mono">
              100%
            </div>
            <div className="text-xs text-[#4A5755] font-medium mt-1">
              Documents stored privately under NDA
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Tender Lifecycle (Sticky / Pinned on Desktop) */}
      <section className="py-20 lg:py-28 px-6 sm:px-10 border-b border-[#E3DDD0] bg-[#F6F3EC]">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column Sticky */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              HOW TENDERS ARE WON
            </div>
            <h2 className="type-h2 text-[#17323A] leading-tight">
              Five decisions between an invitation and an award.
            </h2>
            <p className="text-base text-[#4A5755] leading-relaxed">
              Every public tender won in Botswana follows a disciplined sequence. We align dedicated services to each stage so you never gamble unvetted capital on an uncompliant submission.
            </p>
            <div className="pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/services')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Explore all 10 services
              </Button>
            </div>
          </div>

          {/* Right Column Stages */}
          <div className="lg:col-span-7 space-y-4">
            {lifecycleStages.map((st, idx) => (
              <div
                key={st.stage}
                className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] hover:border-[#CFC7B6] transition-all hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-[#8A5F2B] uppercase">
                    Stage {idx + 1} · {st.stage}
                  </span>
                  <span className="text-[11px] font-mono text-[#6F7A78] bg-[#FBF9F4] px-2 py-0.5 rounded border border-[#E3DDD0]">
                    {st.serviceCount} service{st.serviceCount > 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-medium text-[#17323A] mb-2">
                  {st.title}
                </h3>
                <p className="text-sm text-[#4A5755] leading-relaxed">
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Services Grid */}
      <section className="py-20 lg:py-24 px-6 sm:px-10 border-b border-[#E3DDD0] bg-[#FBF9F4]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
                FIXED-PRICE SERVICE CATALOGUE
              </div>
              <h2 className="type-h2 text-[#17323A] mt-1">
                Defined scopes, transparent Pula pricing.
              </h2>
            </div>
            <Link
              to="/store"
              className="text-sm font-semibold text-[#17323A] hover:text-[#B8864B] flex items-center gap-1.5 transition-colors"
            >
              <span>View full catalogue (10)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((srv) => (
              <div
                key={srv.id}
                className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] hover:border-[#CFC7B6] hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-mono text-[#8A5F2B] font-semibold uppercase">
                      {srv.stage}
                    </span>
                    <span className="text-[#6F7A78] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{srv.turnaround}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-medium text-[#17323A] mb-2">
                    {srv.name}
                  </h3>

                  <p className="text-xs text-[#4A5755] leading-relaxed mb-6">
                    {srv.shortOutcome}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E3DDD0] flex items-center justify-between">
                  <div className="font-serif text-lg font-medium text-[#17323A]">
                    {srv.fromPrice ? 'from ' : ''}
                    {formatBWP(srv.priceBwp)}
                  </div>

                  <Link
                    to={`/store/${srv.slug}`}
                    className="text-xs font-semibold text-[#17323A] hover:text-[#B8864B] flex items-center gap-1 group"
                  >
                    <span>View scope</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Follow Your Order (Interactive Stepper - Wow Moment 2) */}
      <section className="py-20 lg:py-28 px-6 sm:px-10 border-b border-[#E3DDD0] bg-[#F6F3EC]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="max-w-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              WOW MOMENT · 5 CUSTOM ORDER STATUSES
            </div>
            <h2 className="type-h2 text-[#17323A] mt-1">
              Follow your order in plain sight.
            </h2>
            <p className="text-base text-[#4A5755] mt-2 leading-relaxed">
              Click each status below to preview what you and our writers see at every stage of delivery.
            </p>
          </div>

          {/* Stepper Card */}
          <div className="bg-white rounded-[16px] border border-[#E3DDD0] p-6 sm:p-8 shadow-[0_6px_20px_-8px_rgba(23,50,58,0.14)] space-y-8">
            {/* 5 Status Clickable Stepper */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 bg-[#FBF9F4] rounded-[10px] border border-[#E3DDD0]">
              {(
                [
                  'awaiting-intake',
                  'in-production',
                  'client-review',
                  'revisions-requested',
                  'delivered',
                ] as CustomOrderStatus[]
              ).map((st) => {
                const isSelected = activeStatusStep === st
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActiveStatusStep(st)}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'scale-105 shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <StatusPill status={st} size="md" />
                  </button>
                )
              })}
            </div>

            {/* Stepper Detail Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <StatusPill status={activeStatusStep} size="md" />
                  <span className="text-xs font-mono text-[#6F7A78]">
                    {statusDetails[activeStatusStep].duration}
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-[#17323A]">
                  {statusDetails[activeStatusStep].title}
                </h3>

                <p className="text-[15px] text-[#4A5755] leading-relaxed">
                  {statusDetails[activeStatusStep].clientAction}
                </p>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(statusDetails[activeStatusStep].nextStepUrl)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {statusDetails[activeStatusStep].nextStepButton}
                  </Button>
                </div>
              </div>

              {/* Email Notification Preview Mock */}
              <div className="lg:col-span-5 bg-[#FBF9F4] rounded-[10px] border border-[#E3DDD0] p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3DDD0] text-xs">
                  <span className="font-semibold text-[#17323A] flex items-center gap-1.5 font-mono">
                    <Mail className="w-3.5 h-3.5 text-[#B8864B]" />
                    <span>Automated Email Dispatched</span>
                  </span>
                  <span className="text-[10px] text-[#5E7F78] font-mono">Instant SMTP</span>
                </div>

                <div className="text-xs font-semibold text-[#17323A] leading-snug">
                  {statusDetails[activeStatusStep].emailSubject}
                </div>

                <p className="text-[11px] text-[#6F7A78] leading-relaxed">
                  Sent directly from authenticated Google Workspace SMTP to your primary email with one-click portal links.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Standards */}
      <section className="py-20 px-6 sm:px-10 border-b border-[#E3DDD0] bg-[#FBF9F4]">
        <div className="max-w-[1240px] mx-auto space-y-12">
          <div className="max-w-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              THE TENDERVANTAGE PROMISE
            </div>
            <h2 className="type-h2 text-[#17323A] mt-1">
              Rigour, not marketing claims.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E3DDD0]">
            <div className="pt-6 md:pt-0 md:px-6 first:pl-0 space-y-3">
              <Scale className="w-6 h-6 text-[#17323A]" />
              <h3 className="font-serif text-xl font-medium text-[#17323A]">
                Compliance First
              </h3>
              <p className="text-sm text-[#4A5755] leading-relaxed">
                We never take short-cuts on Stage 1 returnables. If a statutory tax pin or sworn affidavit is flawed, we flag it before anything else is drafted.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 space-y-3">
              <FileCheck className="w-6 h-6 text-[#17323A]" />
              <h3 className="font-serif text-xl font-medium text-[#17323A]">
                Plain-Language Writing
              </h3>
              <p className="text-sm text-[#4A5755] leading-relaxed">
                Tender committees score clarity and precision. We eliminate generic corporate buzzwords and author methodical, evidence-backed answers.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 space-y-3">
              <Shield className="w-6 h-6 text-[#17323A]" />
              <h3 className="font-serif text-xl font-medium text-[#17323A]">
                Confidential Handling
              </h3>
              <p className="text-sm text-[#4A5755] leading-relaxed">
                Your company financials, directorship details, and commercial pricing models remain isolated in our encrypted customer vault.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Resources Teaser */}
      <section className="py-20 px-6 sm:px-10 bg-[#F6F3EC]">
        <div className="max-w-[1240px] mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
                KNOWLEDGE & PERSPECTIVES
              </div>
              <h2 className="type-h2 text-[#17323A] mt-1">
                How tenders are won in Botswana.
              </h2>
            </div>
            <Link
              to="/resources"
              className="text-sm font-semibold text-[#17323A] hover:text-[#B8864B] flex items-center gap-1.5 transition-colors"
            >
              <span>View all guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-[#E3DDD0] border-y border-[#E3DDD0]">
            {SEED_ARTICLES.slice(0, 3).map((art) => (
              <Link
                key={art.id}
                to={`/resources/${art.slug}`}
                className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#EFEADF]/40 px-2 -mx-2 transition-colors"
              >
                <div className="space-y-1 max-w-2xl">
                  <span className="text-[11px] font-mono text-[#8A5F2B] uppercase font-semibold">
                    {art.category}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#17323A] group-hover:text-[#B8864B] transition-colors">
                    {art.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-[#6F7A78] shrink-0">
                  <span>{art.readTime}</span>
                  <ChevronRight className="w-4 h-4 text-[#CFC7B6] group-hover:text-[#17323A] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
