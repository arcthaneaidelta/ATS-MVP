import React from 'react'
import { cn } from '@/lib/cn'

export interface TabOption {
  id: string
  label: string
  count?: number
}

export interface TabsProps {
  tabs: TabOption[]
  activeTabId: string
  onChange: (tabId: string) => void
  className?: string
  variant?: 'underline' | 'pills'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  className,
  variant = 'underline',
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center overflow-x-auto scrollbar-none',
        variant === 'underline' && 'border-b border-[#E3DDD0] gap-6',
        variant === 'pills' && 'gap-2 p-1 bg-[#EFEADF] rounded-[8px]',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId

        if (variant === 'pills') {
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                'px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all whitespace-nowrap select-none flex items-center gap-1.5',
                isActive
                  ? 'bg-[#17323A] text-[#F6F3EC] shadow-sm'
                  : 'text-[#4A5755] hover:text-[#17323A] hover:bg-[#E6DFD0]'
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                    isActive ? 'bg-[#5E7F78] text-white' : 'bg-[#CFC7B6] text-[#17323A]'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        }

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative py-3 text-[15px] font-medium transition-colors whitespace-nowrap select-none flex items-center gap-2 cursor-pointer',
              isActive
                ? 'text-[#17323A] font-semibold'
                : 'text-[#6F7A78] hover:text-[#17323A]'
            )}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs font-mono font-normal',
                  isActive ? 'bg-[#17323A] text-[#F6F3EC]' : 'bg-[#EFEADF] text-[#6F7A78]'
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B8864B] rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
