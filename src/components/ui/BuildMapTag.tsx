import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/cn'
import { Layers } from 'lucide-react'

export interface BuildMapTagProps {
  label: string
  wpEquivalent: string
  description?: string
  className?: string
  position?: 'top-right' | 'top-left' | 'inline'
}

export const BuildMapTag: React.FC<BuildMapTagProps> = ({
  label,
  wpEquivalent,
  description,
  className,
  position = 'top-right',
}) => {
  const { scenarios } = useStore()
  const [showTooltip, setShowTooltip] = useState(false)

  if (!scenarios.buildMapActive) {
    return null
  }

  const posClasses = {
    'top-right': 'absolute top-2 right-2 z-20',
    'top-left': 'absolute top-2 left-2 z-20',
    inline: 'relative inline-flex items-center align-middle ml-2 z-20',
  }

  return (
    <div className={cn(posClasses[position], className)}>
      <button
        type="button"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="px-2 py-0.5 rounded-[4px] border border-[#B8864B] bg-[#FBF9F4]/95 text-[#8A5F2B] text-[10px] font-mono uppercase tracking-wider font-semibold shadow-sm hover:bg-[#B8864B] hover:text-white transition-all flex items-center gap-1 cursor-pointer"
        aria-label={`WordPress equivalent: ${wpEquivalent}`}
      >
        <Layers className="w-3 h-3 shrink-0" />
        <span>{label}</span>
      </button>

      {showTooltip && (
        <div
          role="tooltip"
          className="absolute right-0 top-full mt-1.5 w-64 p-2.5 rounded-[8px] bg-[#17323A] text-[#F6F3EC] text-xs shadow-lg z-50 pointer-events-none animate-in fade-in"
        >
          <div className="font-semibold text-[#B8864B] flex items-center gap-1.5 mb-1 font-mono text-[11px] uppercase">
            <span>WP: {wpEquivalent}</span>
          </div>
          {description && <p className="text-[#CFC7B6] text-[11px] leading-relaxed">{description}</p>}
        </div>
      )}
    </div>
  )
}
