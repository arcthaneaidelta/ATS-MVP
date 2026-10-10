import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { formatBWP, formatDate } from '@/lib/format'
import { getDaysLeft } from '@/mock/clock'
import { mockApi } from '@/mock/api'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Download,
  Send,
  MessageSquare,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Star,
  Check,
  Shield,
  Loader2,
} from 'lucide-react'

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    orders,
    messages,
    documents,
    sendMessage,
    requestRevisions,
    approveDraft,
    addToast,
  } = useStore()

  const order = orders.find((o) => o.id === id) || orders[0]
  const orderMessages = messages.filter((m) => m.orderId === order?.id)
  const orderFiles = documents.filter(
    (d) => d.orderId === order?.id || d.orderNumber === order?.orderNumber
  )

  const [messageInput, setMessageInput] = useState('')
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [revisionModalOpen, setRevisionModalOpen] = useState(false)
  const [revisionComment, setRevisionComment] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [downloadingZip, setDownloadingZip] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(order?.rating || 0)

  const daysLeft = order ? getDaysLeft(order.closingDate) : 0
  const isUrgent = daysLeft <= 10 && order?.status !== 'delivered'

  const stagesTimeline = [
    { id: 'awaiting-intake', label: 'Awaiting Intake', step: 1 },
    { id: 'in-production', label: 'In Production', step: 2 },
    { id: 'client-review', label: 'Client Review', step: 3 },
    { id: 'revisions-requested', label: 'Revisions', step: 4 },
    { id: 'delivered', label: 'Delivered', step: 5 },
  ]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !order) return
    sendMessage(order.id, messageInput.trim())
    setMessageInput('')
  }

  const handleApproveConfirm = () => {
    if (!order) return
    setIsApproving(true)
    setTimeout(() => {
      approveDraft(order.id)
      setIsApproving(false)
      setApproveModalOpen(false)
      addToast({
        type: 'success',
        title: 'Draft Approved',
        message: `${order.orderNumber} is finalized and delivered.`,
      })
    }, 1200)
  }

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!order || revisionComment.trim().length < 20) return
    requestRevisions(order.id, revisionComment.trim())
    setRevisionComment('')
    setRevisionModalOpen(false)
  }

  const handleDownloadAllZip = async () => {
    setDownloadingZip(true)
    setDownloadError(null)
    try {
      await mockApi.downloadFile(`${order.orderNumber}-Final-Submission-Pack.zip`)
      setDownloadingZip(false)
      addToast({
        type: 'success',
        title: 'Download complete',
        message: `${order.orderNumber}-Final-Submission-Pack.zip downloaded.`,
      })
    } catch (err: any) {
      setDownloadingZip(false)
      setDownloadError(err.message || 'Download failed. Please try again.')
    }
  }

  if (!order) {
    return <div className="p-8 text-center text-sm">Order not found.</div>
  }

  return (
    <div className="space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/portal/orders"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#17323A] hover:text-[#B8864B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to orders</span>
        </Link>

        <BuildMapTag
          label="Order Workspace"
          wpEquivalent="WP Customer Area Private Workspace"
          position="top-right"
        />
      </div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E3DDD0]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-[#17323A]">
              {order.orderNumber}
            </span>
            <StatusPill status={order.status} size="md" />
            <div
              className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                isUrgent ? 'text-[#A94438]' : 'text-[#5E7F78]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{daysLeft > 0 ? `Closes in ${daysLeft} days` : 'Closed'}</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl font-medium text-[#17323A]">
            {order.serviceName}
          </h1>

          <p className="text-xs text-[#6F7A78]">
            {order.tenderReference} · {order.procuringEntity}
          </p>
        </div>

        {/* Dynamic Context Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          {order.status === 'awaiting-intake' && (
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/portal/intake/A?orderId=${order.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Complete intake form
            </Button>
          )}

          {order.status === 'client-review' && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setRevisionModalOpen(true)}
                leftIcon={<RotateCcw className="w-4 h-4 text-[#A94438]" />}
              >
                Request revisions
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setApproveModalOpen(true)}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Approve draft
              </Button>
            </div>
          )}

          {order.status === 'delivered' && (
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadAllZip}
              isLoading={downloadingZip}
              loadingText="Archiving files..."
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download all (.zip)
            </Button>
          )}
        </div>
      </div>

      {/* 5-Stage Stepper Timeline */}
      <div className="p-6 bg-white rounded-[12px] border border-[#E3DDD0] space-y-3">
        <div className="text-xs font-mono font-semibold text-[#8A5F2B] uppercase">
          Delivery Status Progression
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {stagesTimeline.map((st, i) => {
            const isCurrent = order.status === st.id
            const isCompleted =
              order.status === 'delivered' ||
              (order.status === 'client-review' && i <= 2) ||
              (order.status === 'in-production' && i <= 1)

            return (
              <div
                key={st.id}
                className={`p-3 rounded-[8px] border text-xs space-y-1 ${
                  isCurrent
                    ? 'border-[#17323A] bg-[#FBF9F4] font-semibold'
                    : isCompleted
                    ? 'border-[#3E7A5B]/30 bg-[#3E7A5B]/5 text-[#3E7A5B]'
                    : 'border-[#E3DDD0] bg-white text-[#6F7A78]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>Stage {st.step}</span>
                  {isCompleted && <Check className="w-3 h-3 text-[#3E7A5B]" />}
                </div>
                <div className="truncate">{st.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Grid: Left Next Step & Messages (7 cols), Right Files & Details (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Next Step Guidance Box */}
          <div className="p-6 bg-[#FBF9F4] rounded-[12px] border border-[#E3DDD0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#8A5F2B]">
                Your Current Next Step
              </span>
              <span className="text-xs text-[#6F7A78] font-mono">
                Assigned: {order.writerName}
              </span>
            </div>

            <h3 className="font-serif text-xl font-medium text-[#17323A]">
              {order.status === 'awaiting-intake'
                ? 'Submit company documents & tender pack'
                : order.status === 'in-production'
                ? 'Senior writer drafting compliance matrix'
                : order.status === 'client-review'
                ? 'Inspect draft proposal and approve or request line changes'
                : order.status === 'revisions-requested'
                ? 'Writer addressing revision feedback'
                : 'All final proposal files ready for tender box'}
            </h3>

            <p className="text-xs text-[#4A5755] leading-relaxed">
              {order.status === 'awaiting-intake'
                ? 'Kabo Ntshole is waiting for your returnable documents before beginning work.'
                : order.status === 'in-production'
                ? `First draft is scheduled for delivery on ${formatDate(order.expectedDraftDate)}.`
                : order.status === 'client-review'
                ? 'You have 3 working days to review the compiled draft and request amendments.'
                : order.status === 'revisions-requested'
                ? `Your revision comments have been assigned to ${order.writerName}.`
                : 'Deliverables are finalized. Verify physical tender box sealing requirements.'}
            </p>
          </div>

          {/* Delivered Status Banner & Rating */}
          {order.status === 'delivered' && (
            <div className="p-6 bg-white rounded-[12px] border border-[#3E7A5B] space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#3E7A5B]">
                <CheckCircle2 className="w-5 h-5" />
                <span>Delivered. Final files are available in the right panel.</span>
              </div>

              {/* Service Rating */}
              <div className="pt-2 border-t border-[#E3DDD0] flex items-center justify-between text-xs">
                <span className="text-[#4A5755]">Rate this service experience:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star)
                        addToast({
                          type: 'success',
                          title: 'Thank you for your rating',
                          message: `${star} stars recorded privately.`,
                        })
                      }}
                      className="p-1 text-[#CFC7B6] hover:text-[#B8864B] transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= rating
                            ? 'text-[#B8864B] fill-[#B8864B]'
                            : 'text-[#CFC7B6]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages with Writer */}
          <div className="bg-white rounded-[12px] border border-[#E3DDD0] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD0]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3F6C8C]" />
                <h3 className="font-serif text-lg font-medium text-[#17323A]">
                  Messages with writer ({order.writerName})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#6F7A78]">Instant Chat</span>
            </div>

            {/* Threaded Message List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {orderMessages.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#6F7A78]">
                  No messages yet. Send a note to your assigned writer below.
                </div>
              ) : (
                orderMessages.map((msg) => {
                  const isClient = msg.senderRole === 'client'
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col text-xs ${
                        isClient ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-[#6F7A78] mb-1">
                        <span className="font-semibold text-[#17323A]">{msg.senderName}</span>
                        <span>·</span>
                        <span>{formatDate(msg.timestamp)}</span>
                      </div>
                      <div
                        className={`p-3 rounded-[10px] max-w-sm leading-relaxed ${
                          isClient
                            ? 'bg-[#17323A] text-white rounded-br-none'
                            : 'bg-[#FBF9F4] text-[#1B2625] border border-[#E3DDD0] rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Message Composer */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#E3DDD0]">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Write a message to your writer..."
                className="flex-1 h-10 px-3.5 rounded-[8px] bg-[#FBF9F4] border border-[#CFC7B6] text-xs text-[#1B2625] focus:outline-none focus:border-[#17323A]"
              />
              <Button type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                Send
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side Column: Deliverables & Meta Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Files List Card */}
          <div className="bg-white rounded-[12px] border border-[#E3DDD0] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD0]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#5E7F78]" />
                <h3 className="font-serif text-lg font-medium text-[#17323A]">
                  Files & Deliverables ({orderFiles.length})
                </h3>
              </div>
              <Link to="/portal/documents" className="text-xs text-[#B8864B] font-semibold underline">
                Vault
              </Link>
            </div>

            {downloadError && (
              <div className="p-3 rounded-[6px] bg-[#A94438]/10 border border-[#A94438] text-xs text-[#A94438] flex items-center justify-between">
                <span>{downloadError}</span>
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  className="font-bold underline cursor-pointer ml-2"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="divide-y divide-[#E3DDD0] text-xs">
              {orderFiles.length === 0 ? (
                <div className="py-4 text-center text-[#6F7A78]">
                  No files uploaded yet for this order.
                </div>
              ) : (
                orderFiles.map((file) => (
                  <div key={file.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-[#6F7A78] shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-[#17323A] truncate">{file.name}</div>
                        <div className="text-[10px] text-[#6F7A78]">
                          {file.sizeFormatted} · {file.source === 'tendervantage' ? 'From TenderVantage' : 'Your Upload'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadAllZip()}
                      className="p-1.5 rounded hover:bg-[#EFEADF] text-[#17323A] transition-colors cursor-pointer shrink-0"
                      aria-label={`Download ${file.name}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Writer Card */}
          <div className="bg-[#FBF9F4] rounded-[12px] border border-[#E3DDD0] p-6 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
              Assigned Senior Writer
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#17323A] text-white flex items-center justify-center font-serif text-sm font-semibold">
                {order.writerInitials}
              </div>
              <div>
                <div className="font-semibold text-[#17323A] text-sm">{order.writerName}</div>
                <div className="text-xs text-[#6F7A78]">{order.writerRole}</div>
              </div>
            </div>
          </div>

          {/* Order Financials Breakdown */}
          <div className="bg-white rounded-[12px] border border-[#E3DDD0] p-6 space-y-3 text-xs">
            <h4 className="font-serif text-base font-medium text-[#17323A] pb-2 border-b border-[#E3DDD0]">
              Financial Breakdown
            </h4>
            <div className="space-y-1.5 text-[#4A5755]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-[#17323A]">{formatBWP(order.subtotalBwp, { withDecimals: true })}</span>
              </div>
              <div className="flex justify-between">
                <span>Botswana VAT (14%):</span>
                <span className="font-mono text-[#17323A]">{formatBWP(order.vatBwp, { withDecimals: true })}</span>
              </div>
              <div className="pt-2 border-t border-[#E3DDD0] flex justify-between font-semibold text-[#17323A]">
                <span>Total Paid:</span>
                <span className="font-serif text-base">{formatBWP(order.totalBwp, { withDecimals: true })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Draft Confirm Modal */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve this draft?"
        description="We will prepare final sealed files, index returnables, and release complete deliverables to your vault."
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-[#4A5755] leading-relaxed">
            By approving, you confirm that technical specifications, equipment CVs, and company data meet your satisfaction.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={() => setApproveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApproveConfirm}
              isLoading={isApproving}
              loadingText="Delivering final pack..."
            >
              Confirm and Deliver Files
            </Button>
          </div>
        </div>
      </Modal>

      {/* Request Revisions Modal (Minimum 20 chars per PRD) */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title="Request Revisions"
        description="Tell our writer exactly what needs adjusting (e.g. updated pricing numbers, alternative personnel CVs)."
      >
        <form onSubmit={handleRevisionSubmit} className="space-y-4 pt-2">
          <div>
            <textarea
              rows={4}
              value={revisionComment}
              onChange={(e) => setRevisionComment(e.target.value)}
              placeholder="Please adjust Section 4 to reflect revised diesel prices or alternative staff CVs..."
              className="w-full p-3 rounded-[8px] bg-white border border-[#CFC7B6] text-xs text-[#1B2625] focus:outline-none focus:border-[#17323A]"
              required
            />
            <div className="flex justify-between text-[11px] text-[#6F7A78] mt-1">
              <span>Minimum 20 characters required.</span>
              <span className={revisionComment.length >= 20 ? 'text-[#3E7A5B] font-bold' : ''}>
                {revisionComment.length} chars
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={() => setRevisionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={revisionComment.trim().length < 20}
            >
              Submit Revision Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
