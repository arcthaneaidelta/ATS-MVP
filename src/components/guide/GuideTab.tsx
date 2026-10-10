import React from 'react'
import { useStore } from '@/store/useStore'
import { DEMO_ACCOUNTS } from '@/data/accounts'
import { Button } from '@/components/ui/Button'
import { Switch } from '@/components/ui/Switch'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, ArrowRight, RotateCcw, Zap, UserCheck, Shield } from 'lucide-react'

export const GuideTab: React.FC = () => {
  const navigate = useNavigate()
  const {
    currentUser,
    switchAccount,
    scenarios,
    setScenarioFlag,
    suggestedSteps,
    markSuggestedStep,
    resetDemoData,
    updateOrderStatus,
    orders,
    addToast,
    setDemoGuideOpen,
  } = useStore()

  const suggestedPath = [
    {
      id: 'browseStore',
      title: '1. Browse Store & Add Service',
      description: 'Explore the 10 BWP services and add to cart.',
      isDone: suggestedSteps.browseStore,
      action: () => {
        navigate('/store')
        setDemoGuideOpen(false)
      },
    },
    {
      id: 'payCheckout',
      title: '2. Complete DPO-Style Checkout',
      description: 'Test redirect, card/mobile payment, & return.',
      isDone: suggestedSteps.payCheckout,
      action: () => {
        navigate('/checkout')
        setDemoGuideOpen(false)
      },
    },
    {
      id: 'submitIntake',
      title: '3. Submit Multi-Step Intake Form',
      description: 'Test conditional logic, document drop, & consent.',
      isDone: suggestedSteps.submitIntake,
      action: () => {
        navigate('/portal/intake/A?orderId=ord-148')
        setDemoGuideOpen(false)
      },
    },
    {
      id: 'staffAdvance',
      title: '4. Staff Delivery Desk Update',
      description: 'Advance status & watch Client View update instantly.',
      isDone: suggestedSteps.staffAdvance,
      action: () => {
        navigate('/staff')
        setDemoGuideOpen(false)
      },
    },
    {
      id: 'inspectWebhooks',
      title: '5. Inspect Webhook Payloads & Emails',
      description: 'View 4 endpoints, live event log, & SMTP inbox.',
      isDone: suggestedSteps.inspectWebhooks,
      action: () => {
        useStore.getState().setDemoGuideTab('webhooks')
        markSuggestedStep('inspectWebhooks')
      },
    },
  ]

  const handleTriggerRevision = () => {
    const activeOrder = orders.find((o) => o.status === 'client-review' || o.id === 'ord-141')
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, 'revisions-requested', {
        note: 'Requested changes on drilling consumable specifications.',
      })
      navigate(`/portal/orders/${activeOrder.id}`)
      setDemoGuideOpen(false)
    }
  }

  const handleTriggerDelivery = () => {
    const activeOrder = orders.find((o) => o.status === 'in-production' || o.status === 'client-review')
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, 'delivered', {
        note: 'Order finalized and uploaded.',
      })
      navigate(`/portal/orders/${activeOrder.id}`)
      setDemoGuideOpen(false)
    }
  }

  return (
    <div className="space-y-6 text-sm">
      {/* Choreographed Reviewer Suggested Path */}
      <div className="bg-[#FBF9F4] p-4 rounded-[12px] border border-[#E3DDD0]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-[#17323A] text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#B8864B]" />
            Suggested 2-Minute Review Path
          </h4>
          <span className="text-[11px] text-[#5E7F78] font-mono font-semibold">
            {Object.values(suggestedSteps).filter(Boolean).length}/5 completed
          </span>
        </div>
        <p className="text-xs text-[#4A5755] mb-3">
          Follow these 5 steps to verify all client requirements and wow moments:
        </p>

        <div className="space-y-2">
          {suggestedPath.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between p-2.5 rounded-[8px] bg-white border border-[#E3DDD0] text-xs hover:border-[#B8864B] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {step.isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#3E7A5B] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#CFC7B6] shrink-0" />
                )}
                <div className="truncate">
                  <div className="font-medium text-[#17323A] truncate">{step.title}</div>
                  <div className="text-[11px] text-[#6F7A78] truncate">{step.description}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={step.action}
                className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#17323A] text-[#F6F3EC] hover:bg-[#10252B] shrink-0 flex items-center gap-1"
              >
                <span>Go</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Role Switcher */}
      <div className="space-y-2.5">
        <h4 className="font-semibold text-xs text-[#17323A] uppercase tracking-wider font-mono flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[#3F6C8C]" />
          Role Switcher & Demo Accounts
        </h4>
        <p className="text-xs text-[#6F7A78]">
          Switch perspectives to see both sides of an order:
        </p>

        <div className="grid grid-cols-1 gap-2">
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = currentUser?.id === acc.id
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => switchAccount(acc.id)}
                className={`w-full text-left p-3 rounded-[8px] border transition-all select-none cursor-pointer ${
                  isSelected
                    ? 'border-[#17323A] bg-[#EFEADF] shadow-sm'
                    : 'border-[#E3DDD0] bg-white hover:bg-[#FBF9F4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#17323A] text-xs">
                    {acc.name}{' '}
                    <span className="font-normal text-[#6F7A78]">({acc.companyName})</span>
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${
                      acc.role === 'staff'
                        ? 'bg-[#17323A] text-[#F6F3EC]'
                        : 'bg-[#CFC7B6]/40 text-[#17323A]'
                    }`}
                  >
                    {acc.role}
                  </span>
                </div>
                <p className="text-[11px] text-[#4A5755] mt-1 leading-snug">
                  {acc.demonstrates}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Scenarios & Toggles */}
      <div className="space-y-3 pt-2 border-t border-[#E3DDD0]">
        <h4 className="font-semibold text-xs text-[#17323A] uppercase tracking-wider font-mono flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#B8864B]" />
          Edge Case Scenarios & Test Toggles
        </h4>

        <div className="bg-white rounded-[10px] border border-[#E3DDD0] divide-y divide-[#E3DDD0] px-3.5">
          <Switch
            label="Build Map Overlay"
            description="Display WordPress equivalent tags on each screen"
            checked={scenarios.buildMapActive}
            onChange={(val) => setScenarioFlag('buildMapActive', val)}
          />

          <Switch
            label="Simulate Declined Payment Next"
            description="Next payment attempt rejects with bank decline error"
            checked={scenarios.paymentDeclinedNext}
            onChange={(val) => setScenarioFlag('paymentDeclinedNext', val)}
          />

          <Switch
            label="Simulate Pending / Timeout Payment"
            description="Next payment returns pending confirmation status"
            checked={scenarios.paymentPendingNext}
            onChange={(val) => setScenarioFlag('paymentPendingNext', val)}
          />

          <Switch
            label="Slow Network Mode (1.8s - 3.0s)"
            description="Throttle mock API latency to test loading states"
            checked={scenarios.slowNetwork}
            onChange={(val) => setScenarioFlag('slowNetwork', val)}
          />

          <Switch
            label="Simulate Receiver 500 (Webhooks)"
            description="Webhook delivery fails and tests retry workflow"
            checked={scenarios.receiverFailure500}
            onChange={(val) => setScenarioFlag('receiverFailure500', val)}
          />

          <Switch
            label="Simulate File Download Failure"
            description="Next download rejects to test retry prompt"
            checked={scenarios.downloadFailsNext}
            onChange={(val) => setScenarioFlag('downloadFailsNext', val)}
          />
        </div>
      </div>

      {/* Instant Action Triggers */}
      <div className="space-y-2 pt-2 border-t border-[#E3DDD0]">
        <h4 className="font-semibold text-xs text-[#17323A] uppercase tracking-wider font-mono">
          One-Click Order State Triggers
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTriggerRevision}
            className="text-xs"
          >
            Trigger Revision Request
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTriggerDelivery}
            className="text-xs"
          >
            Trigger Order Delivery
          </Button>
        </div>
      </div>

      {/* Clock and Reset */}
      <div className="pt-3 border-t border-[#E3DDD0] flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => useStore.getState().fastForward24h()}
          className="text-xs"
        >
          Fast-forward 24 h
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetDemoData}
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#A94438]" />}
          className="text-xs text-[#A94438] hover:text-[#752D24]"
        >
          Reset Demo Data
        </Button>
      </div>
    </div>
  )
}
