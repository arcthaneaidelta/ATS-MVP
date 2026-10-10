import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { SERVICES } from '@/data/services'
import { formatBWP, calculateVAT } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Trash2, ArrowRight, ShieldCheck, Tag, Loader2, Check } from 'lucide-react'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    cart,
    removeFromCart,
    couponCode,
    discountPercent,
    applyCoupon,
    addToast,
    addToCart,
  } = useStore()

  const [inputCoupon, setInputCoupon] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')

  // Compute subtotal from cart lines
  const rawSubtotal = cart.reduce((sum, item) => {
    const srv = SERVICES.find((s) => s.id === item.serviceId)
    if (!srv) return sum
    const addOnsSum = item.addOns.reduce((aSum, a) => aSum + a.priceBwp, 0)
    return sum + srv.priceBwp + addOnsSum
  }, 0)

  const discountAmount = discountPercent > 0 ? (rawSubtotal * discountPercent) / 100 : 0
  const subtotalAfterDiscount = rawSubtotal - discountAmount
  const { vat, total } = calculateVAT(subtotalAfterDiscount)

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCoupon.trim()) return

    setCouponLoading(true)
    setCouponError('')

    setTimeout(() => {
      setCouponLoading(false)
      const res = applyCoupon(inputCoupon)
      if (!res.success) {
        setCouponError(res.message)
      } else {
        setInputCoupon('')
        addToast({
          type: 'success',
          title: 'Coupon applied',
          message: '10% discount deducted from your order subtotal.',
        })
      }
    }, 600)
  }

  const handleRemove = (serviceId: string) => {
    const removedItem = cart.find((c) => c.serviceId === serviceId)
    removeFromCart(serviceId)

    // Offer 5-second Undo toast per PRD
    if (removedItem) {
      addToast({
        type: 'info',
        title: 'Service removed',
        message: 'Click to undo removal',
        actionLabel: 'Undo',
        actionUrl: '#undo',
      })
    }
  }

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto space-y-12">
        <div className="flex items-center justify-between pb-6 border-b border-[#E3DDD0]">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              SERVICE BASKET
            </div>
            <h1 className="type-h1 text-[#17323A] mt-1 leading-tight">Cart</h1>
          </div>

          <BuildMapTag
            label="Cart Page"
            wpEquivalent="WooCommerce Cart Override"
            position="top-left"
          />
        </div>

        {cart.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-[16px] border border-[#E3DDD0] max-w-xl mx-auto space-y-4">
            <h3 className="font-serif text-2xl font-medium text-[#17323A]">
              Your cart is empty
            </h3>
            <p className="text-sm text-[#4A5755] leading-relaxed">
              TenderVantage services are virtual and single-engagement. Select a service to begin your intake and drafting sprint.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="lg" onClick={() => navigate('/store')}>
                Browse services
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Cart Table (7 cols) */}
            <div className="lg:col-span-8 bg-white rounded-[16px] border border-[#E3DDD0] p-6 sm:p-8 space-y-6">
              <div className="divide-y divide-[#E3DDD0]">
                {cart.map((item) => {
                  const srv = SERVICES.find((s) => s.id === item.serviceId)
                  if (!srv) return null
                  const addOnsSum = item.addOns.reduce((sum, a) => sum + a.priceBwp, 0)
                  const lineTotal = srv.priceBwp + addOnsSum

                  return (
                    <div
                      key={item.serviceId}
                      className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-mono font-bold text-[#8A5F2B] uppercase">
                          {srv.stage} · {srv.turnaround}
                        </span>
                        <h3 className="font-serif text-xl font-medium text-[#17323A]">
                          {srv.name}
                        </h3>

                        {item.addOns.length > 0 && (
                          <div className="text-xs text-[#5E7F78] space-y-0.5 pt-1">
                            {item.addOns.map((a) => (
                              <div key={a.id} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-[#5E7F78]" />
                                <span>
                                  {a.name} (+{formatBWP(a.priceBwp)})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                        <div className="font-serif text-xl font-medium text-[#17323A]">
                          {formatBWP(lineTotal)}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.serviceId)}
                          aria-label={`Remove ${srv.name}`}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[#6F7A78] hover:text-[#A94438] hover:bg-[#A94438]/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Coupon Field */}
              <div className="pt-6 border-t border-[#E3DDD0] max-w-md">
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label htmlFor="coupon-input" className="text-xs font-semibold text-[#17323A] block">
                    Have a promo code? (Demo code: <code className="bg-[#EFEADF] px-1 py-0.5 rounded font-mono text-[#8A5F2B]">FIRSTBID10</code>)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon-input"
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="e.g. FIRSTBID10"
                      className="h-10 px-3 bg-white border border-[#CFC7B6] rounded-[6px] text-xs text-[#1B2625] font-mono placeholder:text-[#6F7A78] flex-1 focus:outline-none focus:border-[#17323A]"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      isLoading={couponLoading}
                    >
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-[#A94438]">{couponError}</p>
                  )}
                  {couponCode && (
                    <p className="text-xs text-[#3E7A5B] flex items-center gap-1 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Code {couponCode} applied ({discountPercent}% off)</span>
                    </p>
                  )}
                </form>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4 bg-[#FBF9F4] rounded-[16px] border border-[#E3DDD0] p-6 sm:p-8 space-y-6">
              <h2 className="font-serif text-2xl font-medium text-[#17323A] pb-4 border-b border-[#E3DDD0]">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-[#4A5755]">
                <div className="flex items-center justify-between">
                  <span>Services Subtotal:</span>
                  <span className="font-mono text-[#17323A] font-semibold">
                    {formatBWP(rawSubtotal, { withDecimals: true })}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-[#3E7A5B] font-semibold">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-mono">
                      -{formatBWP(discountAmount, { withDecimals: true })}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Botswana VAT (14%):</span>
                  <span className="font-mono text-[#17323A] font-semibold">
                    {formatBWP(vat, { withDecimals: true })}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E3DDD0] flex items-baseline justify-between text-base font-semibold text-[#17323A]">
                  <span>Total Payable:</span>
                  <span className="font-serif text-2xl font-medium text-[#17323A]">
                    {formatBWP(total, { withDecimals: true })}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                  className="w-full shadow-sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to checkout
                </Button>
              </div>

              <div className="p-3 rounded-[8px] bg-white border border-[#E3DDD0] flex items-start gap-2.5 text-[11px] text-[#6F7A78]">
                <ShieldCheck className="w-4 h-4 text-[#3E7A5B] shrink-0 mt-0.5" />
                <span>
                  Immediate intake assignment. Work begins as soon as intake documents are submitted.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
