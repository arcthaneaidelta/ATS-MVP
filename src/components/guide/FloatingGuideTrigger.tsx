import React from 'react'
import { useStore } from '@/store/useStore'
import { useLocation } from 'react-router-dom'
import { Compass, Mail } from 'lucide-react'

export const FloatingGuideTrigger: React.FC = () => {
  const { setDemoGuideOpen, emails, scenarios } = useStore()
  const location = useLocation()

  // Clean recording toggle (?guide=off)
  const searchParams = new URLSearchParams(location.search)
  if (searchParams.get('guide') === 'off') {
    return null
  }

  const unreadCount = emails.filter((e) => !e.isRead).length

  return (
    <div className="fixed bottom-5 left-5 z-[50] print:hidden">
      <button
        type="button"
        onClick={() => setDemoGuideOpen(true)}
        className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#17323A] text-[#F6F3EC] shadow-[0_6px_20px_-8px_rgba(23,50,58,0.25)] border border-[#224752] hover:bg-[#10252B] hover:border-[#B8864B] transition-all cursor-pointer select-none active:scale-95"
        aria-label="Open Reviewer Demo Guide and Under The Hood inspector"
      >
        <Compass className="w-4 h-4 text-[#B8864B] group-hover:rotate-45 transition-transform duration-300" />
        <span className="text-xs font-semibold font-mono tracking-wide">
          Demo guide
        </span>

        {unreadCount > 0 && (
          <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-[#B8864B] text-white text-[10px] font-mono font-bold">
            <Mail className="w-2.5 h-2.5" />
            <span>{unreadCount}</span>
          </span>
        )}

        {scenarios.buildMapActive && (
          <span className="px-1.5 py-0.2 rounded bg-[#3F6C8C] text-white text-[9px] font-mono uppercase">
            Map ON
          </span>
        )}
      </button>
    </div>
  )
}
