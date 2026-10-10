import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Shield, FileText, RotateCcw } from 'lucide-react'

export const LegalPage: React.FC = () => {
  const location = useLocation()
  const path = location.pathname

  const isPrivacy = path.includes('privacy')
  const isRefunds = path.includes('refunds')
  const isTerms = !isPrivacy && !isRefunds

  const title = isPrivacy
    ? 'Document Privacy & Data Protection Policy'
    : isRefunds
    ? 'Service Refund & Cancellation Policy'
    : 'Terms of Service & Bid Advisory Agreement'

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[68ch] mx-auto space-y-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B] bg-[#EFEADF] px-2.5 py-0.5 rounded">
              Demonstration Policy · Botswana Legal Context
            </span>
          </div>

          <h1 className="type-h1 text-[#17323A] leading-tight font-normal">
            {title}
          </h1>

          <div className="flex items-center gap-4 text-xs font-mono text-[#6F7A78] border-b border-[#E3DDD0] pb-4">
            <Link
              to="/privacy"
              className={isPrivacy ? 'text-[#17323A] font-bold underline' : 'hover:text-[#17323A]'}
            >
              Privacy Policy
            </Link>
            <span>·</span>
            <Link
              to="/terms"
              className={isTerms ? 'text-[#17323A] font-bold underline' : 'hover:text-[#17323A]'}
            >
              Terms of Service
            </Link>
            <span>·</span>
            <Link
              to="/refunds"
              className={isRefunds ? 'text-[#17323A] font-bold underline' : 'hover:text-[#17323A]'}
            >
              Refund Policy
            </Link>
          </div>

          <BuildMapTag
            label="Legal Template"
            wpEquivalent="WordPress Standard Page / Gutenberg"
            position="top-right"
          />

          {isPrivacy && (
            <div className="space-y-6 text-base text-[#1B2625] leading-relaxed">
              <p>
                TenderVantage (Pty) Ltd operates as a dedicated bid advisory consultancy in Gaborone, Botswana. We recognize that contractors entrust us with commercial secrets, CIPA shareholding certificates, BURS tax clearances, bank statements, and proprietary pricing schedules.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">1. Confidentiality by Default</h3>
              <p>
                Every document uploaded to our Customer Area is protected by an automatic non-disclosure agreement. We never share client materials with competing bidders. Our senior writers are bound by enforceable confidentiality covenants under Botswana law.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">2. Data Retention & Vault Storage</h3>
              <p>
                Documents uploaded during Intake or generated as deliverables are maintained in your private vault for a standard retention period of twenty-four (24) months to facilitate future tender reuse. You may request permanent deletion of your data at any time via your portal account settings.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">3. Statutory Compliance</h3>
              <p>
                We do not sell, rent, or monetize client data. Information collected is utilized exclusively for authoring tender packs, verifying PPRA eligibility, and dispatching automated order notification emails via Google Workspace SMTP.
              </p>
            </div>
          )}

          {isRefunds && (
            <div className="space-y-6 text-base text-[#1B2625] leading-relaxed">
              <p>
                Because TenderVantage sells bespoke professional writing and consulting services rather than manufactured physical goods, our refund policy reflects the allocation of dedicated senior writer time.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">1. Unstarted Orders (Pre-Intake)</h3>
              <p>
                If you purchase a service and your internal circumstances change before you submit Intake Form A, B, or C, your order is 100% refundable upon written notice within 7 days of payment.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">2. Orders In Production</h3>
              <p>
                Once you complete your intake form and an order moves to "In Production", dedicated writer hours have been committed to document extraction, compliance matrix formulation, and drafting. At this stage, fees are non-refundable.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">3. Revision Guarantee</h3>
              <p>
                If a draft proposal does not fulfill the scope agreed in the service specification, we provide structured revision rounds free of charge until the deliverable complies fully with the tender instructions.
              </p>
            </div>
          )}

          {isTerms && (
            <div className="space-y-6 text-base text-[#1B2625] leading-relaxed">
              <p>
                By commissioning TenderVantage (Pty) Ltd to support your tender submission, you agree to the following operational terms:
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">1. Client Representations</h3>
              <p>
                The client represents that all statutory documentation submitted (including BURS tax certificates, CIPA shareholding declarations, and staff academic credentials) is genuine, valid, and legally verifiable under Botswana law.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">2. Limitation of Advisory Liability</h3>
              <p>
                While TenderVantage exercises professional diligence to ensure 100% compliance with published tender criteria, award decisions remain the sole prerogative of the procuring entity and tender evaluation committees. We do not guarantee contract awards.
              </p>
              <h3 className="font-serif text-2xl text-[#17323A]">3. Delivery and Tender Box Submission</h3>
              <p>
                TenderVantage delivers complete, indexed digital packages and envelope labelling instructions. Physical delivery to the relevant tender box prior to the gazetted deadline remains the ultimate responsibility of the bidder.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
