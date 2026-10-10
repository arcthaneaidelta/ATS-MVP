import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { StatusPill } from '@/components/ui/StatusPill'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { CustomOrderStatus, OrderItem } from '@/mock/types'
import { formatDate } from '@/lib/format'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import {
  UploadCloud,
  ArrowRight,
  CheckCircle2,
  Send,
  FileText,
  AlertCircle,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react'

export const DeliveryDeskPage: React.FC = () => {
  const navigate = useNavigate()
  const { orders, updateOrderStatus, uploadDocument, switchAccount, addToast } = useStore()

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || ''
  )
  const [internalNote, setInternalNote] = useState('')
  const [confirmDeliveredModal, setConfirmDeliveredModal] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: string
    status: CustomOrderStatus
  } | null>(null)

  const selectedOrder: OrderItem | undefined =
    orders.find((o) => o.id === selectedOrderId) || orders[0]

  const handleStatusChange = (orderId: string, newStatus: CustomOrderStatus) => {
    if (newStatus === 'delivered') {
      setPendingStatusChange({ orderId, status: newStatus })
      setConfirmDeliveredModal(true)
      return
    }

    updateOrderStatus(orderId, newStatus, {
      changedBy: 'staff:lorato.dube',
    })
  }

  const handleConfirmDelivered = () => {
    if (pendingStatusChange) {
      updateOrderStatus(pendingStatusChange.orderId, 'delivered', {
        changedBy: 'staff:lorato.dube',
      })
      setConfirmDeliveredModal(false)
      setPendingStatusChange(null)
    }
  }

  const handleSendDraft = () => {
    if (!selectedOrder) return
    updateOrderStatus(selectedOrder.id, 'client-review', {
      changedBy: 'staff:lorato.dube',
      fileUrl: `/deliverables/${selectedOrder.orderNumber}-Draft-v1.pdf`,
    })
    addToast({
      type: 'success',
      title: 'Draft sent to client',
      message: `${selectedOrder.orderNumber} moved to Client Review. Email dispatched.`,
    })
  }

  const handleDeliverableUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !selectedOrder) return

    const file = files[0]
    uploadDocument({
      name: file.name,
      sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      sizeBytes: file.size,
      fileType: 'PDF',
      source: 'tendervantage',
      orderId: selectedOrder.id,
      orderNumber: selectedOrder.orderNumber,
      category: 'deliverable',
    })

    addToast({
      type: 'success',
      title: 'Deliverable attached',
      message: `${file.name} saved to ${selectedOrder.orderNumber}.`,
    })
  }

  const handleSwitchToClientView = () => {
    if (!selectedOrder) return
    // Find matching demo account for this order
    if (selectedOrder.clientEmail.includes('naledi')) {
      switchAccount('acc-naledi')
    } else if (selectedOrder.clientEmail.includes('boitumelo')) {
      switchAccount('acc-boitumelo')
    } else {
      switchAccount('acc-thabo')
    }
    navigate(`/portal/orders/${selectedOrder.id}`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Notice: Live Link */}
      <div className="p-4 rounded-[10px] bg-[#17323A] text-[#F6F3EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#B8864B] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold font-mono uppercase text-[#B8864B]">
              Wow Moment 3 · Unified Bid Automation
            </div>
            <p className="text-xs text-[#CFC7B6] mt-0.5">
              Advance an order status below. State, notifications, emails, and n8n webhooks update in real time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSwitchToClientView}
          className="px-3.5 py-1.5 rounded-[6px] bg-[#F6F3EC] text-[#17323A] text-xs font-semibold hover:bg-white transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>Switch to Client view to see this change</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: Orders Table (8 cols), Selected Order Detail Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table of All Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-[12px] border border-[#E3DDD0] overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD0]">
            <div>
              <h2 className="font-serif text-xl font-medium text-[#17323A]">
                Tender Queue ({orders.length})
              </h2>
              <p className="text-xs text-[#6F7A78] mt-0.5">
                Manage all active client submissions and advance delivery milestones.
              </p>
            </div>
            <BuildMapTag
              label="Staff Delivery Desk"
              wpEquivalent="Custom WooCommerce Order Manager"
              position="inline"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FBF9F4] text-[#6F7A78] font-mono uppercase tracking-wider border-b border-[#E3DDD0]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Order</th>
                  <th className="py-2.5 px-3 font-semibold">Client / Company</th>
                  <th className="py-2.5 px-3 font-semibold">Service</th>
                  <th className="py-2.5 px-3 font-semibold">Status Dropdown</th>
                  <th className="py-2.5 px-3 font-semibold">Writer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DDD0]">
                {orders.map((o) => {
                  const isSelected = o.id === selectedOrder?.id

                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className={`hover:bg-[#EFEADF]/50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#FBF9F4] font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-[#17323A]">
                        {o.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-[#17323A] font-medium">{o.clientName}</div>
                        <div className="text-[10px] text-[#6F7A78] truncate max-w-[140px]">
                          {o.companyName}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#4A5755] max-w-[160px] truncate">
                        {o.serviceName}
                      </td>
                      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value as CustomOrderStatus)
                          }
                          className="h-8 px-2 rounded-[6px] bg-white border border-[#CFC7B6] text-xs font-semibold text-[#17323A] focus:outline-none cursor-pointer"
                        >
                          <option value="awaiting-intake">Awaiting Intake</option>
                          <option value="in-production">In Production</option>
                          <option value="client-review">Client Review</option>
                          <option value="revisions-requested">Revisions Requested</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <div className="text-[9px] text-[#3E7A5B] font-mono mt-0.5">
                          ✓ Webhook sent · 200 OK
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#6F7A78] font-mono text-[11px]">
                        {o.writerName}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detail Desk Panel (4 cols) */}
        {selectedOrder && (
          <div className="lg:col-span-4 bg-white rounded-[12px] border border-[#E3DDD0] p-6 space-y-6 shadow-xs">
            <div className="space-y-2 pb-4 border-b border-[#E3DDD0]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-bold text-[#17323A]">
                  {selectedOrder.orderNumber}
                </span>
                <StatusPill status={selectedOrder.status} size="sm" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#17323A]">
                {selectedOrder.serviceName}
              </h3>
              <div className="text-xs text-[#6F7A78]">
                Client: {selectedOrder.clientName} ({selectedOrder.clientEmail})
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5F2B]">
                Staff Operations
              </span>

              {selectedOrder.status === 'in-production' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSendDraft}
                  className="w-full"
                  rightIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send draft to client (Move to Review)
                </Button>
              )}

              {/* Upload deliverable */}
              <div>
                <label className="block text-xs font-semibold text-[#17323A] mb-1.5">
                  Upload Deliverable Document
                </label>
                <input
                  type="file"
                  onChange={handleDeliverableUpload}
                  className="block w-full text-xs text-[#6F7A78] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#17323A] file:text-white cursor-pointer"
                />
              </div>

              {/* Internal Note */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-[#17323A]">
                  Add Internal Staff Note
                </label>
                <textarea
                  rows={2}
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="e.g. Verified BURS clearance on e-tax portal; waiting on CVs..."
                  className="w-full p-2.5 rounded-[6px] border border-[#CFC7B6] text-xs text-[#1B2625] focus:outline-none focus:border-[#17323A]"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    if (internalNote.trim()) {
                      addToast({
                        type: 'success',
                        title: 'Internal note saved',
                        message: internalNote,
                      })
                      setInternalNote('')
                    }
                  }}
                  className="w-full text-xs"
                >
                  Save internal note
                </Button>
              </div>
            </div>

            {/* View As Client Button */}
            <div className="pt-4 border-t border-[#E3DDD0]">
              <Button
                variant="secondary"
                size="md"
                onClick={handleSwitchToClientView}
                className="w-full text-xs"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Inspect in Client View
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Delivered Modal */}
      <Modal
        isOpen={confirmDeliveredModal}
        onClose={() => setConfirmDeliveredModal(false)}
        title="Mark Order as Delivered?"
        description="This will lock draft authoring, release final deliverables to the client vault, fire the 'Delivered' email, and dispatch the order.delivered webhook."
      >
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" size="sm" onClick={() => setConfirmDeliveredModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirmDelivered}>
            Confirm & Deliver
          </Button>
        </div>
      </Modal>
    </div>
  )
}
