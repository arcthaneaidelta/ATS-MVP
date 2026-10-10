import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { formatDateTime } from '@/lib/format'
import { Mail, Eye, Code, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const InboxTab: React.FC = () => {
  const { emails, markEmailRead, setDemoGuideOpen } = useStore()
  const [selectedEmailId, setSelectedEmailId] = useState<string>(
    emails[0]?.id || ''
  )
  const [viewPlainText, setViewPlainText] = useState<boolean>(false)
  const navigate = useNavigate()

  const currentEmail = emails.find((e) => e.id === selectedEmailId) || emails[0]

  const handleSelect = (id: string) => {
    setSelectedEmailId(id)
    markEmailRead(id)
  }

  const handlePrimaryAction = (url?: string) => {
    if (url) {
      setDemoGuideOpen(false)
      navigate(url)
    }
  }

  return (
    <div className="flex flex-col h-full -m-5">
      {/* Top Banner */}
      <div className="bg-[#17323A] text-[#F6F3EC] p-3 px-5 text-xs flex items-center justify-between border-b border-[#224752]">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#B8864B]" />
          <span className="font-mono uppercase font-semibold">Google Workspace SMTP Preview</span>
        </div>
        <span className="text-[11px] text-[#CFC7B6]">
          {emails.length} notifications logged
        </span>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Email List Sidebar */}
        <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#E3DDD0] bg-[#FBF9F4] overflow-y-auto max-h-48 md:max-h-none shrink-0 divide-y divide-[#E3DDD0]">
          {emails.map((email) => {
            const isSelected = email.id === currentEmail?.id
            return (
              <button
                key={email.id}
                type="button"
                onClick={() => handleSelect(email.id)}
                className={`w-full text-left p-3 transition-colors text-xs cursor-pointer ${
                  isSelected
                    ? 'bg-white font-semibold border-l-2 border-[#17323A]'
                    : 'hover:bg-[#EFEADF]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono text-[#8A5F2B] uppercase truncate">
                    {email.trigger}
                  </span>
                  {!email.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B8864B] shrink-0" />
                  )}
                </div>
                <div className="text-[#17323A] font-medium truncate leading-tight">
                  {email.subject}
                </div>
                <div className="text-[10px] text-[#6F7A78] mt-1 truncate">
                  {email.recipient}
                </div>
              </button>
            )
          })}
        </div>

        {/* Email Viewer */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 bg-[#F6F3EC]">
          {currentEmail ? (
            <div className="space-y-4">
              {/* Email Metadata */}
              <div className="bg-white p-3.5 rounded-[8px] border border-[#E3DDD0] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#17323A] text-sm">
                    {currentEmail.subject}
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewPlainText(!viewPlainText)}
                    className="text-[11px] font-mono text-[#5E7F78] hover:text-[#17323A] flex items-center gap-1 border border-[#CFC7B6] px-2 py-0.5 rounded"
                  >
                    {viewPlainText ? <Eye className="w-3 h-3" /> : <Code className="w-3 h-3" />}
                    <span>{viewPlainText ? 'HTML View' : 'Plain Text'}</span>
                  </button>
                </div>
                <div className="text-[#6F7A78] text-[11px]">
                  <strong>From:</strong> TenderVantage &lt;orders@tendervantage.example&gt;
                </div>
                <div className="text-[#6F7A78] text-[11px]">
                  <strong>To:</strong> {currentEmail.recipient}
                </div>
                <div className="text-[#6F7A78] text-[11px]">
                  <strong>Date:</strong> {formatDateTime(currentEmail.sentAt)}
                </div>
              </div>

              {/* Email Content Box */}
              {viewPlainText ? (
                <pre className="p-4 bg-white rounded-[8px] border border-[#E3DDD0] text-xs font-mono text-[#1B2625] whitespace-pre-wrap leading-relaxed">
                  {currentEmail.plainText}
                </pre>
              ) : (
                <div className="bg-white rounded-[8px] border border-[#E3DDD0] p-6 shadow-sm max-w-xl mx-auto text-[#1B2625]">
                  {/* Brand header */}
                  <div className="pb-4 border-b border-[#E3DDD0] mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-[#17323A]">
                        TenderVantage
                      </h3>
                      <p className="text-[10px] uppercase tracking-wider text-[#6F7A78] font-mono">
                        Tender Writing & Bid Support · Gaborone
                      </p>
                    </div>
                  </div>

                  {/* Body HTML */}
                  <div
                    className="prose prose-sm max-w-none text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentEmail.htmlBody }}
                  />

                  {/* Primary CTA button */}
                  {currentEmail.primaryButtonText && currentEmail.primaryButtonUrl && (
                    <div className="mt-6 pt-4 border-t border-[#E3DDD0]">
                      <button
                        type="button"
                        onClick={() => handlePrimaryAction(currentEmail.primaryButtonUrl)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#17323A] text-[#F6F3EC] text-xs font-semibold hover:bg-[#10252B] transition-colors cursor-pointer"
                      >
                        <span>{currentEmail.primaryButtonText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="mt-8 pt-4 border-t border-[#E3DDD0] text-[11px] text-[#6F7A78] space-y-1">
                    <p>TenderVantage (Pty) Ltd · Plot 54368 CBD, Gaborone, Botswana</p>
                    <p>Confidential tender communications. Powered by Google Workspace SMTP.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#6F7A78]">
              No email notifications recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
