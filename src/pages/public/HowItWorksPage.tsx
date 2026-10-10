import React, { useState, useEffect } from 'react'
import { StatusPill } from '@/components/ui/StatusPill'
import { Accordion } from '@/components/ui/Accordion'
import { CustomOrderStatus } from '@/mock/types'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import {
  Mail,
  Clock,
  ArrowRight,
  CheckCircle2,
  Bell,
  Shield,
  FileCheck,
} from 'lucide-react'

export const HowItWorksPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] =
    useState<CustomOrderStatus>('in-production')

  const statusSteps: {
    status: CustomOrderStatus
    stepNum: number
    shortTitle: string
    whoActs: string
    typicalDuration: string
    clientExperience: string
    deliverablesSeen: string
    emailPreview: {
      subject: string
      recipient: string
      body: string
    }
  }[] = [
    {
      status: 'awaiting-intake',
      stepNum: 1,
      shortTitle: 'Awaiting Intake',
      whoActs: 'Client acts',
      typicalDuration: 'Immediate (within 24 hours)',
      clientExperience:
        'Immediately after ordering, your portal prompts you with the intake checklist. You upload tender documents, tax pins, and answer any scope questions.',
      deliverablesSeen: 'Interactive intake form with auto-save and document drag-and-drop slots.',
      emailPreview: {
        subject: 'Order TV-2026-0148 confirmed',
        recipient: 'client@company.example',
        body: 'Thank you for your order. Next critical step: complete your intake form so your assigned writer can begin drafting.',
      },
    },
    {
      status: 'in-production',
      stepNum: 2,
      shortTitle: 'In Production',
      whoActs: 'TenderVantage acts',
      typicalDuration: '3 to 7 working days',
      clientExperience:
        'Your dedicated Senior Bid Writer is assigned. We extract requirements, map evaluator scoring criteria, and draft compliant technical responses.',
      deliverablesSeen: 'Live countdown to expected draft delivery date and direct writer messaging.',
      emailPreview: {
        subject: 'We have your documents, work has started',
        recipient: 'client@company.example',
        body: 'Intake documents verified. Writer Lorato Dube has commenced work. Your first draft will be ready by Tuesday.',
      },
    },
    {
      status: 'client-review',
      stepNum: 3,
      shortTitle: 'Client Review',
      whoActs: 'Client acts',
      typicalDuration: '3 working days review window',
      clientExperience:
        'Your completed draft proposal is uploaded to your portal. You inspect the technical methodology, CV schedules, and verified BoQ calculations.',
      deliverablesSeen: 'Complete draft PDF/Word document with one-click "Approve" or "Request revisions" buttons.',
      emailPreview: {
        subject: 'Your draft is ready for review',
        recipient: 'client@company.example',
        body: 'The draft submission for NR/2026/114 is ready in your portal. Please review and provide feedback or approve.',
      },
    },
    {
      status: 'revisions-requested',
      stepNum: 4,
      shortTitle: 'Revisions Requested',
      whoActs: 'TenderVantage acts',
      typicalDuration: '24 to 48 hours sprint',
      clientExperience:
        'If you request adjustments (e.g. updated pricing numbers or replacement equipment CVs), our writer immediately updates the proposal.',
      deliverablesSeen: 'Structured revision log tracking your comments point-for-point.',
      emailPreview: {
        subject: 'We have your revision request',
        recipient: 'client@company.example',
        body: 'Your revision notes have been received and assigned. An updated revision draft will be posted within 48 hours.',
      },
    },
    {
      status: 'delivered',
      stepNum: 5,
      shortTitle: 'Delivered',
      whoActs: 'Completed',
      typicalDuration: 'Final files sealed',
      clientExperience:
        'Final print-ready and editable documents are placed in your encrypted vault, complete with envelope labels and physical tender box packaging instructions.',
      deliverablesSeen: 'Download all files (.zip) archive, receipt, and optional service rating.',
      emailPreview: {
        subject: 'Your files are ready: Delivered',
        recipient: 'client@company.example',
        body: 'Final submission pack is ready for download in your encrypted portal vault. All best for tender box submission!',
      },
    },
  ]

  // Auto-advance once on initial load (1 step per 1.2s then stops)
  useEffect(() => {
    const sequence: CustomOrderStatus[] = [
      'awaiting-intake',
      'in-production',
      'client-review',
    ]
    let index = 0
    const interval = setInterval(() => {
      index++
      if (index < sequence.length) {
        setSelectedStatus(sequence[index])
      } else {
        clearInterval(interval)
      }
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  const currentStepData =
    statusSteps.find((s) => s.status === selectedStatus) || statusSteps[1]

  const emailNotifications = [
    {
      title: 'Order Confirmed',
      desc: 'Dispatched immediately upon checkout with direct link to your intake form.',
    },
    {
      title: '24-Hour Intake Reminder',
      desc: 'Fired automatically if documents have not been uploaded so your closing date is protected.',
    },
    {
      title: 'Intake Received & Writer Assigned',
      desc: 'Confirms your order is In Production with writer contact details.',
    },
    {
      title: 'Draft Ready for Review',
      desc: 'Notifies you that your draft proposal is ready for inspection in your portal.',
    },
    {
      title: 'Revision Confirmation',
      desc: 'Acknowledges your specific change requests and provides turnaround timeline.',
    },
    {
      title: 'Final Pack Delivered',
      desc: 'Supplies instant download access to your sealed tender pack files.',
    },
  ]

  const faqs = [
    {
      id: 'faq-1',
      title: 'Do you guarantee we will win the tender?',
      content:
        'No ethical tender consultancy guarantees an award. Tenders involve commercial pricing decisions, competitor bids, and internal committee priorities beyond any third party’s control. What we guarantee is 100% compliance with statutory returnables and a persuasively authored proposal designed to achieve top technical scores.',
    },
    {
      id: 'faq-2',
      title: 'What happens if our tender closes in less than 48 hours?',
      content:
        'For urgent deadlines, select our Bid Rapid Review (48 hours) or contact us immediately. We will review the Invitation to Tender within two hours to tell you transparently whether a compliant submission is realistic.',
    },
    {
      id: 'faq-3',
      title: 'How do you safeguard our confidential company documents?',
      content:
        'All client tax clearances, financial statements, and director IDs are stored in private, isolated Customer Area vaults protected by encryption and strict NDAs. We never share documents across clients or reuse sensitive company data.',
    },
    {
      id: 'faq-4',
      title: 'Can we request changes after the first draft is delivered?',
      content:
        'Yes. Every technical proposal writing service includes structured revision rounds. You can request clarifications, swap out personnel CVs, or adjust operational timelines directly inside your portal.',
    },
    {
      id: 'faq-5',
      title: 'Who drops the final tender documents into the tender box?',
      content:
        'In Botswana, bids must be physically delivered to ministerial, council, or parastatal tender boxes in Gaborone, Francistown, or district offices before the closing hour. We provide the fully indexed digital print files and envelope labels. Final submission is handled by your company representative or accompanied by our team.',
    },
    {
      id: 'faq-6',
      title: 'What payment methods do you accept?',
      content:
        'We accept all major cards (Visa, Mastercard) and Botswana mobile money via our secure DPO Group payment gateway integration. Invoices and receipts in Botswana Pula (BWP) are generated automatically.',
    },
  ]

  return (
    <div className="py-20 lg:py-28 px-6 sm:px-10">
      <div className="max-w-[1240px] mx-auto space-y-24">
        {/* Header */}
        <div className="max-w-2xl space-y-4">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
            SERVICE DELIVERY LIFECYCLE
          </div>
          <h1 className="type-h1 text-[#17323A] leading-tight">
            From order to delivered, in plain sight.
          </h1>
          <p className="text-base sm:text-lg text-[#4A5755] leading-relaxed">
            Every tender service moves through five transparent statuses. You always know who holds the next action and exactly what is expected.
          </p>

          <BuildMapTag
            label="How It Works"
            wpEquivalent="Elementor Template · How Orders Work"
            position="top-left"
          />
        </div>

        {/* 5 Status Interactive Track */}
        <section className="bg-white rounded-[16px] border border-[#E3DDD0] p-6 sm:p-10 shadow-[0_6px_20px_-8px_rgba(23,50,58,0.14)] space-y-10">
          {/* Horizontal Track (desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {statusSteps.map((step) => {
              const isSelected = selectedStatus === step.status
              return (
                <button
                  key={step.status}
                  type="button"
                  onClick={() => setSelectedStatus(step.status)}
                  className={`p-4 rounded-[10px] text-left border transition-all cursor-pointer flex flex-col justify-between h-28 ${
                    isSelected
                      ? 'border-[#17323A] bg-[#FBF9F4] shadow-sm'
                      : 'border-[#E3DDD0] bg-white hover:bg-[#FBF9F4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#8A5F2B]">
                      Step {step.stepNum}
                    </span>
                    <StatusPill status={step.status} size="sm" />
                  </div>
                  <div className="text-xs font-semibold text-[#17323A] truncate mt-2">
                    {step.shortTitle}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detailed Status Inspection Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-[#E3DDD0] items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <StatusPill status={selectedStatus} size="md" />
                <span className="text-xs font-mono text-[#6F7A78] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration: {currentStepData.typicalDuration}</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#17323A]">
                {currentStepData.shortTitle}
              </h2>

              <div className="space-y-3 text-sm text-[#4A5755] leading-relaxed">
                <div>
                  <strong className="text-[#17323A]">Who acts:</strong> {currentStepData.whoActs}
                </div>
                <div>
                  <strong className="text-[#17323A]">What happens:</strong>{' '}
                  {currentStepData.clientExperience}
                </div>
                <div>
                  <strong className="text-[#17323A]">What you see in the portal:</strong>{' '}
                  {currentStepData.deliverablesSeen}
                </div>
              </div>
            </div>

            {/* Email Notification Mock Preview */}
            <div className="lg:col-span-5 bg-[#FBF9F4] p-5 rounded-[12px] border border-[#E3DDD0] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3DDD0] text-xs">
                <span className="font-semibold text-[#17323A] flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#B8864B]" />
                  <span>Email You Receive</span>
                </span>
                <span className="text-[10px] text-[#5E7F78] font-mono">Automated SMTP</span>
              </div>

              <div className="text-xs font-semibold text-[#17323A]">
                {currentStepData.emailPreview.subject}
              </div>

              <p className="text-xs text-[#4A5755] leading-relaxed italic bg-white p-3 rounded-[6px] border border-[#E3DDD0]">
                "{currentStepData.emailPreview.body}"
              </p>

              <div className="text-[11px] text-[#6F7A78] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#3E7A5B]" />
                <span>Includes direct one-click link to portal order view</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Automated Notifications Summary */}
        <section className="space-y-8 border-t border-[#E3DDD0] pt-16">
          <div className="max-w-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              COMMUNICATION LOOP
            </div>
            <h2 className="type-h2 text-[#17323A] mt-1">
              What you will receive by email
            </h2>
            <p className="text-sm text-[#4A5755] mt-1">
              No chasing writers over WhatsApp. Six automated milestones keep your team informed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emailNotifications.map((notif, idx) => (
              <div key={idx} className="p-5 bg-white rounded-[10px] border border-[#E3DDD0] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#8A5F2B]">
                  <Bell className="w-3.5 h-3.5 text-[#B8864B]" />
                  <span>Notification {idx + 1}</span>
                </div>
                <h4 className="font-serif text-lg font-medium text-[#17323A]">
                  {notif.title}
                </h4>
                <p className="text-xs text-[#4A5755] leading-relaxed">
                  {notif.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion (6 items) */}
        <section className="space-y-8 border-t border-[#E3DDD0] pt-16">
          <div className="max-w-xl">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="type-h2 text-[#17323A] mt-1">
              Clear answers before you order
            </h2>
          </div>

          <div className="max-w-3xl">
            <Accordion items={faqs} defaultOpenId="faq-1" />
          </div>
        </section>
      </div>
    </div>
  )
}
