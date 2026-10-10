import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { SERVICES } from '@/data/services'
import { formatBWP, calculateVAT } from '@/lib/format'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { Shield, CreditCard, Smartphone, Check, AlertCircle } from 'lucide-react'

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate()
  const { cart, discountPercent, currentUser } = useStore()

  // If cart is empty, redirect to store or seed 1 item for testing
  const effectiveCart =
    cart.length > 0 ? cart : [{ serviceId: 'srv-5', addOns: [] }]

  // Form fields
  const [email, setEmail] = useState(currentUser?.email || 'naledi@kgosimining.example')
  const [phone, setPhone] = useState('+267 72 100 450')
  const [name, setName] = useState(currentUser?.name || 'Naledi Mokgosi')
  const [companyName, setCompanyName] = useState(
    currentUser?.companyName || 'Kgosi Mining Supplies (Pty) Ltd'
  )
  const [cipaNumber, setCipaNumber] = useState(
    currentUser?.cipaNumber || 'BW0000189421'
  )
  const [vatNumber, setVatNumber] = useState('')
  const [city, setCity] = useState('Gaborone')
  const [address, setAddress] = useState('Plot 54368 CBD')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card')

  // Consents
  const [consentTerms, setConsentTerms] = useState(true)
  const [consentIntake, setConsentIntake] = useState(true)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculations
  const rawSubtotal = effectiveCart.reduce((sum, item) => {
    const srv = SERVICES.find((s) => s.id === item.serviceId)
    if (!srv) return sum
    const addOnsSum = item.addOns.reduce((aSum, a) => aSum + a.priceBwp, 0)
    return sum + srv.priceBwp + addOnsSum
  }, 0)

  const discountAmount = discountPercent > 0 ? (rawSubtotal * discountPercent) / 100 : 0
  const subtotalAfterDiscount = rawSubtotal - discountAmount
  const { vat, total } = calculateVAT(subtotalAfterDiscount)

  const handleUseDemoDetails = () => {
    setName('Naledi Mokgosi')
    setEmail('naledi@kgosimining.example')
    setPhone('+267 72 100 450')
    setCompanyName('Kgosi Mining Supplies (Pty) Ltd')
    setCipaNumber('BW0000189421')
    setCity('Gaborone')
    setAddress('Plot 54368 CBD')
    setConsentTerms(true)
    setConsentIntake(true)
    setErrors({})
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Full name is required.'
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required.'
    if (!phone.trim()) errs.phone = 'Phone number is required.'
    if (!companyName.trim()) errs.companyName = 'Company name is required.'
    if (!cipaNumber.trim()) {
      errs.cipaNumber = 'Add your company CIPA registration number so we can check it.'
    } else if (!cipaNumber.toUpperCase().startsWith('BW') && !cipaNumber.startsWith('STAFF')) {
      errs.cipaNumber = 'CIPA registration numbers typically begin with BW (e.g. BW0000189421).'
    }
    if (!city.trim()) errs.city = 'City / Town in Botswana is required.'
    if (!consentTerms) {
      errs.consentTerms = 'You must accept the Terms of Service and Refund Policy.'
    }
    if (!consentIntake) {
      errs.consentIntake = 'You must acknowledge that intake documents are required before work begins.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    // Save checkout draft state in sessionStorage for gateway screen
    sessionStorage.setItem(
      'tv_checkout_draft',
      JSON.stringify({
        serviceId: effectiveCart[0].serviceId,
        addOns: effectiveCart[0].addOns,
        totalBwp: total,
        clientDetails: {
          name,
          email,
          companyName,
          cipaNumber,
          phone,
          notes,
        },
      })
    )

    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/checkout/pay')
    }, 800)
  }

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto space-y-10">
        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3DDD0]">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              CHECKOUT STEP 1 OF 3
            </div>
            <h1 className="type-h1 text-[#17323A] mt-1 leading-tight">Checkout</h1>
          </div>

          {/* 3 Step Breadcrumb */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="font-bold text-[#17323A] flex items-center gap-1.5 bg-[#EFEADF] px-2.5 py-1 rounded">
              <span className="w-4 h-4 rounded-full bg-[#17323A] text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Details</span>
            </span>
            <span className="text-[#CFC7B6]">→</span>
            <span className="text-[#6F7A78] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#E3DDD0] text-[#6F7A78] flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Gateway</span>
            </span>
            <span className="text-[#CFC7B6]">→</span>
            <span className="text-[#6F7A78] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-[#E3DDD0] text-[#6F7A78] flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Confirmation</span>
            </span>
          </div>

          <BuildMapTag
            label="Checkout Flow"
            wpEquivalent="WooCommerce Checkout + DPO API"
            position="top-left"
          />
        </div>

        {/* Autofill Demo Details Quick Button */}
        <div className="flex items-center justify-between p-3.5 rounded-[8px] bg-[#FBF9F4] border border-[#E3DDD0] text-xs">
          <span className="text-[#4A5755]">
            Evaluating this prototype? Fill realistic Botswana contractor details in one click.
          </span>
          <button
            type="button"
            onClick={handleUseDemoDetails}
            className="font-semibold text-[#8A5F2B] hover:text-[#17323A] underline cursor-pointer shrink-0"
          >
            Use demo details
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" noValidate>
          {/* Left Column: Form Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-[16px] border border-[#E3DDD0]">
            {/* Section 1: Contact */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
                1. Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Person Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  isRequired
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  hint="Order confirmation and deliverables will be sent here."
                  isRequired
                />
              </div>
              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                hint="Botswana +267 mobile number for writer SMS alerts."
                isRequired
              />
            </div>

            {/* Section 2: Company */}
            <div className="space-y-4 pt-4 border-t border-[#E3DDD0]">
              <h2 className="font-serif text-xl font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
                2. Company & Statutory Data
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Registered Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={errors.companyName}
                  isRequired
                />
                <Input
                  label="CIPA Registration Number"
                  value={cipaNumber}
                  onChange={(e) => setCipaNumber(e.target.value)}
                  error={errors.cipaNumber}
                  placeholder="BW0000189421"
                  isRequired
                />
              </div>
              <Input
                label="BURS VAT Number (Optional)"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="e.g. C1234567890"
                hint="Leave blank if not VAT registered."
              />
            </div>

            {/* Section 3: Billing Address */}
            <div className="space-y-4 pt-4 border-t border-[#E3DDD0]">
              <h2 className="font-serif text-xl font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
                3. Physical Billing Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Country"
                  value="Botswana"
                  disabled
                  className="bg-[#FBF9F4] text-[#6F7A78]"
                />
                <Input
                  label="City / Town"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  error={errors.city}
                  isRequired
                />
                <Input
                  label="Street / Plot"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 54368 CBD"
                />
              </div>
            </div>

            {/* Section 4: Payment Method Selection */}
            <div className="space-y-4 pt-4 border-t border-[#E3DDD0]">
              <h2 className="font-serif text-xl font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
                4. Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-[10px] border flex items-center gap-3 cursor-pointer select-none transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#17323A] bg-[#FBF9F4] shadow-xs'
                      : 'border-[#E3DDD0] hover:bg-[#FBF9F4]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#17323A]"
                  />
                  <CreditCard className="w-5 h-5 text-[#17323A]" />
                  <div>
                    <div className="text-xs font-semibold text-[#17323A]">
                      Credit / Debit Card
                    </div>
                    <div className="text-[10px] text-[#6F7A78]">Visa, Mastercard (DPO API)</div>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-[10px] border flex items-center gap-3 cursor-pointer select-none transition-all ${
                    paymentMethod === 'mobile'
                      ? 'border-[#17323A] bg-[#FBF9F4] shadow-xs'
                      : 'border-[#E3DDD0] hover:bg-[#FBF9F4]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymethod"
                    checked={paymentMethod === 'mobile'}
                    onChange={() => setPaymentMethod('mobile')}
                    className="accent-[#17323A]"
                  />
                  <Smartphone className="w-5 h-5 text-[#5E7F78]" />
                  <div>
                    <div className="text-xs font-semibold text-[#17323A]">
                      Botswana Mobile Money
                    </div>
                    <div className="text-[10px] text-[#6F7A78]">Orange Money, MyZaka</div>
                  </div>
                </label>
              </div>

              <p className="text-xs text-[#6F7A78] leading-relaxed">
                You will be redirected to our secure payment gateway partner (DPO Group direct API simulation) to complete payment.
              </p>
            </div>

            {/* Consents */}
            <div className="space-y-3 pt-4 border-t border-[#E3DDD0]">
              <Checkbox
                label="I accept the Terms of Service and Refund Policy."
                checked={consentTerms}
                onChange={(e) => setConsentTerms(e.target.checked)}
                error={errors.consentTerms}
              />
              <Checkbox
                label="I understand intake documents are required before work begins."
                checked={consentIntake}
                onChange={(e) => setConsentIntake(e.target.checked)}
                error={errors.consentIntake}
              />
            </div>
          </div>

          {/* Right Column: Order Review Summary (5 cols) */}
          <div className="lg:col-span-5 bg-[#FBF9F4] rounded-[16px] border border-[#E3DDD0] p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
            <h2 className="font-serif text-2xl font-medium text-[#17323A] pb-4 border-b border-[#E3DDD0]">
              Order Summary
            </h2>

            <div className="space-y-4">
              {effectiveCart.map((item) => {
                const srv = SERVICES.find((s) => s.id === item.serviceId)
                if (!srv) return null
                const addOnsSum = item.addOns.reduce((sum, a) => sum + a.priceBwp, 0)
                const lineTotal = srv.priceBwp + addOnsSum

                return (
                  <div key={item.serviceId} className="flex justify-between items-start text-xs pb-3 border-b border-[#E3DDD0]">
                    <div>
                      <div className="font-semibold text-[#17323A]">{srv.name}</div>
                      <div className="text-[10px] text-[#6F7A78]">{srv.turnaround}</div>
                      {item.addOns.length > 0 && (
                        <div className="text-[10px] text-[#5E7F78] mt-1">
                          {item.addOns.map((a) => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-[#17323A] font-semibold">
                      {formatBWP(lineTotal)}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2.5 text-xs text-[#4A5755]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-[#17323A]">{formatBWP(rawSubtotal, { withDecimals: true })}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#3E7A5B]">
                  <span>Promo discount ({discountPercent}%):</span>
                  <span className="font-mono">-{formatBWP(discountAmount, { withDecimals: true })}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Botswana VAT (14%):</span>
                <span className="font-mono text-[#17323A]">{formatBWP(vat, { withDecimals: true })}</span>
              </div>
              <div className="pt-3 border-t border-[#E3DDD0] flex justify-between items-baseline text-base font-semibold text-[#17323A]">
                <span>Total Due:</span>
                <span className="font-serif text-2xl">{formatBWP(total, { withDecimals: true })}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              loadingText="Preparing secure payment..."
              className="w-full shadow-sm"
            >
              Continue to secure payment · {formatBWP(total, { withDecimals: true })}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
