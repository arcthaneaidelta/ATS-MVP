import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { formatDateTime } from '@/lib/format'
import { WebhookLogEntry } from '@/mock/types'
import { Activity, Copy, Check, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react'

export const WebhooksTab: React.FC = () => {
  const { webhooks, retryWebhook, scenarios, setScenarioFlag } = useStore()
  const [selectedEntryId, setSelectedEntryId] = useState<string>(
    webhooks[0]?.id || ''
  )
  const [copied, setCopied] = useState(false)

  const selectedEntry: WebhookLogEntry | undefined =
    webhooks.find((w) => w.id === selectedEntryId) || webhooks[0]

  const handleCopyJson = () => {
    if (selectedEntry) {
      navigator.clipboard.writeText(JSON.stringify(selectedEntry.payload, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const endpoints = [
    {
      path: '/hooks/order-created',
      desc: 'Fires when order is paid & created',
      topic: 'order.created',
    },
    {
      path: '/hooks/order-status-changed',
      desc: 'Fires when any of 5 statuses transition',
      topic: 'order.status_changed',
    },
    {
      path: '/hooks/intake-submitted',
      desc: 'Fires when an intake form (A/B/C) is submitted',
      topic: 'intake.submitted',
    },
    {
      path: '/hooks/order-delivered',
      desc: 'Fires when deliverables are ready for client',
      topic: 'order.delivered',
    },
  ]

  return (
    <div className="flex flex-col h-full -m-5 bg-[#17323A] text-[#F6F3EC] font-mono text-xs">
      {/* Top Bar */}
      <div className="p-3 px-5 bg-[#10252B] border-b border-[#224752] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#3E7A5B]" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            n8n Webhook Dispatcher · 4 Endpoints
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-[11px] text-[#CFC7B6] cursor-pointer">
            <input
              type="checkbox"
              checked={scenarios.receiverFailure500}
              onChange={(e) => setScenarioFlag('receiverFailure500', e.target.checked)}
              className="rounded border-[#CFC7B6] accent-[#A94438]"
            />
            <span>Simulate 500 Failure</span>
          </label>
        </div>
      </div>

      {/* Endpoints Quick Reference */}
      <div className="p-3 px-5 bg-[#17323A] border-b border-[#224752] shrink-0 text-[11px] grid grid-cols-2 md:grid-cols-4 gap-2">
        {endpoints.map((ep) => (
          <div key={ep.path} className="p-2 rounded bg-[#10252B] border border-[#224752]">
            <div className="text-[#B8864B] font-bold truncate">{ep.path}</div>
            <div className="text-[#6F7A78] text-[10px] mt-0.5 truncate">{ep.desc}</div>
          </div>
        ))}
      </div>

      {/* Split Viewer */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Live Delivery Log List */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#224752] bg-[#10252B] overflow-y-auto max-h-48 md:max-h-none shrink-0 divide-y divide-[#224752]">
          <div className="p-2 px-3 text-[10px] uppercase tracking-wider text-[#6F7A78] font-bold">
            Live Deliveries ({webhooks.length})
          </div>
          {webhooks.map((item) => {
            const isSelected = item.id === selectedEntry?.id
            const isSuccess = item.status === 200

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedEntryId(item.id)}
                className={`w-full text-left p-2.5 transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#17323A] border-l-2 border-[#B8864B]' : 'hover:bg-[#152e35]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isSuccess
                        ? 'bg-[#3E7A5B]/30 text-[#4ade80]'
                        : 'bg-[#A94438]/30 text-[#f87171]'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-[#6F7A78]">{item.durationMs}ms</span>
                </div>
                <div className="text-[#F6F3EC] text-[11px] font-semibold mt-1 truncate">
                  {item.event}
                </div>
                <div className="text-[10px] text-[#5E7F78] truncate mt-0.5">
                  {item.endpoint}
                </div>
              </button>
            )
          })}
        </div>

        {/* Payload Inspector Detail */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0B1A1F] flex flex-col">
          {selectedEntry ? (
            <div className="space-y-3">
              {/* Request Metadata */}
              <div className="p-3 rounded bg-[#10252B] border border-[#224752] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        selectedEntry.status === 200
                          ? 'bg-[#3E7A5B] text-white'
                          : 'bg-[#A94438] text-white'
                      }`}
                    >
                      POST {selectedEntry.status}
                    </span>
                    <span className="text-[#F6F3EC] font-bold text-xs truncate">
                      {selectedEntry.endpoint}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedEntry.status === 500 && (
                      <button
                        type="button"
                        onClick={() => retryWebhook(selectedEntry.id)}
                        className="px-2.5 py-1 rounded bg-[#3E7A5B] text-white hover:bg-[#326349] text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry Webhook</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleCopyJson}
                      className="px-2.5 py-1 rounded bg-[#224752] text-[#F6F3EC] hover:bg-[#2d5c6b] text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-[#CFC7B6] grid grid-cols-2 gap-2 pt-1 border-t border-[#224752]">
                  <div>
                    <span className="text-[#6F7A78]">Timestamp:</span>{' '}
                    {formatDateTime(selectedEntry.timestamp)}
                  </div>
                  <div>
                    <span className="text-[#6F7A78]">Duration:</span>{' '}
                    {selectedEntry.durationMs}ms
                  </div>
                </div>

                {/* Simulated HMAC Signature */}
                <div className="text-[10px] text-[#6F7A78] break-all pt-1">
                  <span className="text-[#B8864B]">X-WC-Webhook-Signature:</span>{' '}
                  sha256={selectedEntry.headers['x-wc-webhook-signature'] || 'e9921bcfa87201389de11a76'}
                </div>
              </div>

              {/* Retry Note if 500 */}
              {selectedEntry.status === 500 && (
                <div className="p-2.5 rounded bg-[#A94438]/20 border border-[#A94438] text-[#fca5a5] text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#f87171]" />
                  <div>
                    <strong>Receiver error 500 simulated:</strong> In production, WooCommerce queues automatic retries (up to 5 attempts) before suspending an uncooperative webhook endpoint to protect server resources.
                  </div>
                </div>
              )}

              {/* JSON Payload viewer */}
              <div>
                <div className="text-[10px] text-[#6F7A78] uppercase tracking-wider mb-1 font-bold">
                  JSON Request Body
                </div>
                <pre className="p-3.5 rounded bg-[#10252B] border border-[#224752] text-[11px] text-[#4ade80] overflow-x-auto leading-relaxed">
                  {JSON.stringify(selectedEntry.payload, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#6F7A78]">No webhook events recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
