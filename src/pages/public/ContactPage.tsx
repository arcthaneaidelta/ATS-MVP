import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { MapPin, Mail, Phone, Clock, CheckCircle2, ShieldCheck } from 'lucide-react'

export const ContactPage: React.FC = () => {
  const { addToast } = useStore()

  // Form states
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [needCategory, setNeedCategory] = useState('Service question')
  const [closingDate, setClosingDate] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const needOptions = [
    { value: 'Service question', label: 'Service question / General enquiry' },
    { value: 'Urgent tender', label: 'Urgent tender (Closing soon)' },
    { value: 'Partnership', label: 'Joint Venture / Subcontracting' },
    { value: 'Other', label: 'Other enquiry' },
  ]

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Please enter your full name.'
    if (!company.trim()) errs.company = 'Please enter your company name.'
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address.'
    if (!phone.trim()) errs.phone = 'Please enter a phone number (+267).'
    if (needCategory === 'Urgent tender' && !closingDate) {
      errs.closingDate = 'Please specify the tender closing date so we can check writer capacity.'
    }
    if (!message.trim() || message.trim().length < 10) {
      errs.message = 'Please provide details about your tender (minimum 10 characters).'
    }
    if (!consent) {
      errs.consent = 'You must agree to TenderVantage storing your details to respond.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      addToast({
        type: 'success',
        title: 'Enquiry received',
        message: 'Thank you. We respond within one working day.',
      })
    }, 900)
  }

  const handleReset = () => {
    setFullName('')
    setCompany('')
    setEmail('')
    setPhone('')
    setNeedCategory('Service question')
    setClosingDate('')
    setMessage('')
    setConsent(false)
    setErrors({})
    setIsSubmitted(false)
  }

  const firstName = fullName.split(' ')[0] || 'Friend'

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (5 cols on desktop, second on mobile) */}
          <div className="order-2 lg:order-1 lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
                GABORONE OFFICE
              </div>
              <h1 className="type-h1 text-[#17323A] leading-tight">
                Tell us about the tender.
              </h1>
              <p className="text-base text-[#4A5755] leading-relaxed">
                Whether you need advice on a specific PPADB code, an urgent review on an upcoming closing date, or want to understand which service fits your proposal.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-[#E3DDD0] text-sm text-[#1B2625]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#B8864B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#17323A]">Headquarters</div>
                  <div className="text-[#4A5755] text-xs mt-0.5">
                    Plot 54368 Central Business District (CBD)
                    <br />
                    Gaborone, Botswana
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#5E7F78] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#17323A]">Direct Enquiries</div>
                  <div className="text-[#4A5755] text-xs mt-0.5">
                    hello@tendervantage.example
                    <br />
                    orders@tendervantage.example
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#3F6C8C] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#17323A]">Phone & WhatsApp</div>
                  <div className="text-[#4A5755] text-xs mt-0.5 font-mono">
                    +267 390 1200 / +267 72 100 450
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#6F7A78] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#17323A]">Office Hours</div>
                  <div className="text-[#4A5755] text-xs mt-0.5">
                    Monday – Friday: 08:00 – 17:00 (CAT)
                    <br />
                    Response promise: Within one working day.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[10px] bg-[#FBF9F4] border border-[#E3DDD0] flex items-center gap-3 text-xs text-[#4A5755]">
              <ShieldCheck className="w-5 h-5 text-[#3E7A5B] shrink-0" />
              <span>
                All enquiries are confidential. We never share tender specifics or company intentions.
              </span>
            </div>

            <BuildMapTag
              label="Contact Page"
              wpEquivalent="Elementor Contact Page + WPForms Pro"
              position="top-left"
            />
          </div>

          {/* Right Column: Form (7 cols on desktop, first on mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <div className="bg-white rounded-[16px] border border-[#E3DDD0] p-6 sm:p-10 shadow-[0_6px_20px_-8px_rgba(23,50,58,0.14)]">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-[#3E7A5B]/15 text-[#3E7A5B] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#17323A]">
                    Thank you, {firstName}.
                  </h3>
                  <p className="text-sm text-[#4A5755] max-w-md mx-auto leading-relaxed">
                    We have received your enquiry. A senior bid practitioner will review your requirements and respond within one working day.
                  </p>
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-xs font-semibold text-[#B8864B] underline cursor-pointer"
                    >
                      Send another enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h2 className="font-serif text-2xl font-medium text-[#17323A] mb-2">
                    Send an enquiry
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full name"
                      placeholder="e.g. Naledi Mokgosi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      error={errors.fullName}
                      isRequired
                    />

                    <Input
                      label="Company name"
                      placeholder="e.g. Kgosi Mining Supplies (Pty) Ltd"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      error={errors.company}
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email address"
                      type="email"
                      placeholder="naledi@company.co.bw"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      isRequired
                    />

                    <Input
                      label="Phone number"
                      type="tel"
                      placeholder="+267 72 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={errors.phone}
                      hint="Botswana +267 mobile or landline"
                      isRequired
                    />
                  </div>

                  <Select
                    label="What do you need?"
                    options={needOptions}
                    value={needCategory}
                    onChange={(e) => setNeedCategory(e.target.value)}
                  />

                  {/* CONDITIONAL FIELD: Only shown when "Urgent tender" is selected! */}
                  {needCategory === 'Urgent tender' && (
                    <div className="p-4 rounded-[8px] bg-[#FBF9F4] border border-[#B8864B] space-y-3 animate-in fade-in">
                      <div className="text-xs font-semibold text-[#8A5F2B] font-mono uppercase">
                        ⚡ Urgent Tender Priority Routing
                      </div>
                      <Input
                        label="Tender closing date"
                        type="date"
                        value={closingDate}
                        onChange={(e) => setClosingDate(e.target.value)}
                        error={errors.closingDate}
                        hint="Specify the date so we can verify writer team availability immediately."
                        isRequired
                      />
                    </div>
                  )}

                  <Textarea
                    label="Message / Tender details"
                    placeholder="Tell us about the tender reference, procuring entity, or what specific help you require..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={errors.message}
                    isRequired
                  />

                  <Checkbox
                    label="I agree to TenderVantage storing my details to respond to this enquiry."
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    error={errors.consent}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      loadingText="Sending enquiry..."
                      className="w-full sm:w-auto min-w-[180px]"
                    >
                      Send enquiry
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
