import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { SERVICES } from '@/data/services'
import { formatBWP } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { StatusPill } from '@/components/ui/StatusPill'
import { CheckCircle2, ArrowRight, Mail, FileText, Lock } from 'lucide-react'

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { orders, setDemoGuideOpen, setDemoGuideTab } = useStore()

  const order =
    orders.find((o) => o.id === orderId) || orders[0]
  const service =
    SERVICES.find((s) => s.id === order?.serviceId) || SERVICES[4]

  const handleOpenEmailPreview = () => {
    setDemoGuideOpen(true)
    setDemoGuideTab('inbox')
  }

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[760px] mx-auto space-y-10">
        {/* Dominant Check & Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#3E7A5B]/15 text-[#3E7A5B] mx-auto flex items-center justify-center animate-in zoom-in-50 duration-500">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#3E7A5B]">
            PAYMENT CLEARED · ORDER CREATED
          </div>

          <h1 className="type-h1 text-[#17323A] font-normal leading-tight">
            Payment received.
          </h1>

          <p className="text-sm text-[#4A5755] font-mono">
            Order Reference: <strong className="text-[#17323A]">{order?.orderNumber}</strong> · Amount Paid: <strong className="text-[#17323A]">{formatBWP(order?.totalBwp || 5130, { withDecimals: true })}</strong>
          </p>

          <BuildMapTag
            label="Confirmation"
            wpEquivalent="WooCommerce Order Received Template"
            position="top-left"
          />
        </div>

        {/* DOMINANT ELEMENT: NEXT STEP CARD (As specified in PRD Section 7.7) */}
        <div className="bg-[#17323A] text-[#F6F3EC] p-8 sm:p-10 rounded-[16px] shadow-[0_12px_28px_-10px_rgba(23,50,58,0.3)] space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8864B]">
              CRITICAL NEXT STEP
            </span>
            <StatusPill status="awaiting-intake" size="sm" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-medium">
            Next: tell us about your tender
          </h2>

          <p className="text-sm text-[#CFC7B6] leading-relaxed">
            Before senior writer Kabo Ntshole can start drafting, we need your company returnables and tender document pack. Work commences as soon as your intake is submitted.
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(`/portal/intake/${service.intakeFormId}?orderId=${order?.id}`)}
              className="bg-[#F6F3EC] text-[#17323A] hover:bg-white active:bg-[#EFEADF] w-full sm:w-auto"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete {service.intakeFormTitle}
            </Button>
          </div>
        </div>

        {/* Compact Order Summary Card */}
        <div className="bg-white rounded-[16px] border border-[#E3DDD0] p-6 sm:p-8 space-y-4 text-xs">
          <h3 className="font-serif text-lg font-medium text-[#17323A] pb-3 border-b border-[#E3DDD0]">
            Order Details
          </h3>

          <div className="grid grid-cols-2 gap-4 text-[#4A5755]">
            <div>
              <span className="text-[#6F7A78] block">Service:</span>
              <strong className="text-[#17323A]">{order?.serviceName}</strong>
            </div>
            <div>
              <span className="text-[#6F7A78] block">Status:</span>
              <div className="mt-1">
                <StatusPill status={order?.status || 'awaiting-intake'} size="sm" />
              </div>
            </div>
            <div>
              <span className="text-[#6F7A78] block">Turnaround:</span>
              <strong className="text-[#17323A]">{service.turnaround}</strong>
            </div>
            <div>
              <span className="text-[#6F7A78] block">Target Closing Date:</span>
              <strong className="text-[#17323A]">{order?.closingDate || '31 Oct 2026'}</strong>
            </div>
          </div>

          {/* Email dispatch notice */}
          <div className="pt-4 border-t border-[#E3DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-[#6F7A78] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#5E7F78]" />
              <span>Confirmation email sent to {order?.clientEmail}</span>
            </span>

            <button
              type="button"
              onClick={handleOpenEmailPreview}
              className="font-semibold text-[#8A5F2B] hover:text-[#17323A] underline text-left"
            >
              Preview email in mock inbox →
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center justify-center gap-6 text-xs font-semibold text-[#17323A]">
          <Link to="/portal" className="hover:text-[#B8864B] flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#5E7F78]" />
            <span>Go to your client portal</span>
          </Link>
          <span>·</span>
          <Link to="/store" className="hover:text-[#B8864B]">
            Browse other services
          </Link>
        </div>
      </div>
    </div>
  )
}
