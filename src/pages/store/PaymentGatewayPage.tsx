import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { formatBWP } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import { ShieldCheck, AlertCircle, Loader2, ArrowLeft, Smartphone, CreditCard } from 'lucide-react'

export const PaymentGatewayPage: React.FC = () => {
  const navigate = useNavigate()
  const { placeOrder, scenarios, setScenarioFlag, addToast } = useStore()

  // Retrieve checkout draft state
  const draftStr = sessionStorage.getItem('tv_checkout_draft')
  const draft = draftStr
    ? JSON.parse(draftStr)
    : {
        serviceId: 'srv-5',
        addOns: [],
        totalBwp: 5130,
        clientDetails: {
          name: 'Naledi Mokgosi',
          email: 'naledi@kgosimining.example',
          companyName: 'Kgosi Mining Supplies (Pty) Ltd',
          cipaNumber: 'BW0000189421',
          phone: '+267 72 100 450',
        },
      }

  const [activeTab, setActiveTab] = useState<'card' | 'mobile'>('card')
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242')
  const [cardExpiry, setCardExpiry] = useState('12/28')
  const [cardCvc, setCardCvc] = useState('884')
  const [cardName, setCardName] = useState(draft.clientDetails.name)
  const [mobilePhone, setMobilePhone] = useState(draft.clientDetails.phone)

  const [paymentState, setPaymentState] = useState<
    'idle' | 'processing' | 'verifying' | 'declined' | 'mobile-prompt'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentState('processing')
    setErrorMessage('')

    const cleanCard = cardNumber.replace(/\s+/g, '')

    setTimeout(() => {
      // Check if declined
      if (cleanCard === '4000000000000002' || scenarios.paymentDeclinedNext) {
        setPaymentState('declined')
        setErrorMessage('Your bank declined this payment. Please try another card or mobile money.')
        setScenarioFlag('paymentDeclinedNext', false)
        return
      }

      // Enter return transaction verification step (1.8s) per PRD
      setPaymentState('verifying')

      setTimeout(() => {
        // Create order in store
        const createdOrder = placeOrder({
          serviceId: draft.serviceId,
          addOns: draft.addOns || [],
          clientDetails: draft.clientDetails,
        })

        sessionStorage.removeItem('tv_checkout_draft')
        navigate(`/checkout/complete/${createdOrder.id}`)
      }, 1800)
    }, 1400)
  }

  const handleMobilePayment = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentState('mobile-prompt')

    // Simulate 3-second phone prompt state
    setTimeout(() => {
      setPaymentState('verifying')

      setTimeout(() => {
        const createdOrder = placeOrder({
          serviceId: draft.serviceId,
          addOns: draft.addOns || [],
          clientDetails: draft.clientDetails,
        })

        sessionStorage.removeItem('tv_checkout_draft')
        navigate(`/checkout/complete/${createdOrder.id}`)
      }, 1800)
    }, 3000)
  }

  const handleCancel = () => {
    addToast({
      type: 'info',
      title: 'Payment cancelled',
      message: 'Payment cancelled. Your cart is saved.',
    })
    navigate('/cart')
  }

  // Full page verifying state (Return verification step per PRD)
  if (paymentState === 'verifying') {
    return (
      <div className="min-h-screen bg-[#F6F3EC] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[16px] border border-[#E3DDD0] shadow-md max-w-md w-full space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#17323A] mx-auto" />
          <h2 className="font-serif text-2xl font-medium text-[#17323A]">
            Confirming your payment...
          </h2>
          <p className="text-xs text-[#6F7A78]">
            Verifying transaction token with DPO Group gateway API and issuing order receipt.
          </p>
          <div className="w-24 h-1 bg-[#E3DDD0] rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-[#B8864B] animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] py-16 px-4 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-[440px] space-y-4">
        {/* Transparent Simulation Banner */}
        <div className="bg-[#17323A] text-[#F6F3EC] p-3 rounded-[8px] text-xs flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B8864B]" />
            <span>Simulated Gateway · No Real Charge</span>
          </div>
          <BuildMapTag
            label="Gateway API"
            wpEquivalent="DPO Group Direct API"
            position="inline"
          />
        </div>

        {/* Gateway Container (Plain neutral style per PRD) */}
        <div className="bg-white rounded-[12px] border border-[#E3DDD0] p-6 shadow-sm space-y-6">
          {/* Header */}
          <div className="pb-4 border-b border-[#E3DDD0] flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6F7A78] font-mono">
                Merchant
              </div>
              <h2 className="text-base font-bold text-[#17323A]">TenderVantage (Pty) Ltd</h2>
            </div>
            <div className="text-right">
              <div className="text-[11px] uppercase tracking-wider text-[#6F7A78] font-mono">
                Amount BWP
              </div>
              <div className="text-lg font-bold text-[#17323A]">
                {formatBWP(draft.totalBwp, { withDecimals: true })}
              </div>
            </div>
          </div>

          {/* Test Card Numbers helper */}
          <div className="p-3 bg-[#F6F3EC] rounded-[6px] border border-[#E3DDD0] text-[11px] text-[#4A5755] space-y-1">
            <div className="font-bold text-[#17323A]">Testing Cards:</div>
            <div>
              • Success: <code className="font-mono font-bold text-[#3E7A5B]">4242 4242 4242 4242</code>
            </div>
            <div>
              • Decline test: <code className="font-mono font-bold text-[#A94438]">4000 0000 0000 0002</code>
            </div>
          </div>

          {/* Declined Error Banner */}
          {paymentState === 'declined' && (
            <div className="p-3 rounded-[6px] bg-[#A94438]/10 border border-[#A94438] text-xs text-[#A94438] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Payment Declined:</strong> {errorMessage}
              </div>
            </div>
          )}

          {/* Payment Method Tabs */}
          <div className="flex border-b border-[#E3DDD0]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('card')
                setPaymentState('idle')
              }}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                activeTab === 'card'
                  ? 'border-[#17323A] text-[#17323A]'
                  : 'border-transparent text-[#6F7A78] hover:text-[#17323A]'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Credit / Debit Card</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('mobile')
                setPaymentState('idle')
              }}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
                activeTab === 'mobile'
                  ? 'border-[#17323A] text-[#17323A]'
                  : 'border-transparent text-[#6F7A78] hover:text-[#17323A]'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile Money</span>
            </button>
          </div>

          {/* Card Form */}
          {activeTab === 'card' && (
            <form onSubmit={handleCardPayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17323A]">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-10 px-3 rounded-[6px] border border-[#CFC7B6] text-sm font-mono text-[#1B2625] focus:outline-none focus:border-[#17323A]"
                  placeholder="4242 4242 4242 4242"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17323A]">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full h-10 px-3 rounded-[6px] border border-[#CFC7B6] text-sm font-mono text-[#1B2625] focus:outline-none focus:border-[#17323A]"
                    placeholder="12/28"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17323A]">CVC / CVV</label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full h-10 px-3 rounded-[6px] border border-[#CFC7B6] text-sm font-mono text-[#1B2625] focus:outline-none focus:border-[#17323A]"
                    placeholder="884"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17323A]">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full h-10 px-3 rounded-[6px] border border-[#CFC7B6] text-sm text-[#1B2625] focus:outline-none focus:border-[#17323A]"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={paymentState === 'processing'}
                  loadingText="Processing transaction..."
                  className="w-full"
                >
                  Pay {formatBWP(draft.totalBwp, { withDecimals: true })}
                </Button>
              </div>
            </form>
          )}

          {/* Mobile Money Form */}
          {activeTab === 'mobile' && (
            <form onSubmit={handleMobilePayment} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17323A]">
                  Botswana Mobile Number (+267)
                </label>
                <input
                  type="tel"
                  value={mobilePhone}
                  onChange={(e) => setMobilePhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-[6px] border border-[#CFC7B6] text-sm font-mono text-[#1B2625] focus:outline-none focus:border-[#17323A]"
                  placeholder="+267 72 100 450"
                  required
                />
              </div>

              {paymentState === 'mobile-prompt' ? (
                <div className="p-4 rounded-[6px] bg-[#EFEADF] border border-[#CFC7B6] text-center space-y-2 animate-in fade-in">
                  <Loader2 className="w-6 h-6 animate-spin text-[#B8864B] mx-auto" />
                  <div className="text-xs font-semibold text-[#17323A]">
                    Waiting for approval on your phone...
                  </div>
                  <p className="text-[11px] text-[#6F7A78]">
                    Please approve the USSD prompt on {mobilePhone} to authorize {formatBWP(draft.totalBwp, { withDecimals: true })}.
                  </p>
                </div>
              ) : (
                <div className="pt-2">
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Send Payment Prompt
                  </Button>
                </div>
              )}
            </form>
          )}

          {/* Cancel and Return */}
          <div className="text-center pt-2 border-t border-[#E3DDD0]">
            <button
              type="button"
              onClick={handleCancel}
              className="text-xs text-[#6F7A78] hover:text-[#A94438] underline cursor-pointer"
            >
              Cancel and return to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
