import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string
  className?: string
  allowMultiple?: boolean
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  className,
  allowMultiple = false,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  )

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className={cn('divide-y divide-[#E3DDD0] border-y border-[#E3DDD0]', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id)

        return (
          <div key={item.id} className="py-4">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left gap-4 font-serif text-lg font-medium text-[#17323A] hover:text-[#B8864B] transition-colors cursor-pointer group"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-[#6F7A78] group-hover:text-[#17323A] transition-transform duration-280 shrink-0',
                  isOpen && 'transform rotate-180 text-[#17323A]'
                )}
              />
            </button>

            <div
              id={`accordion-content-${item.id}`}
              className={cn(
                'grid transition-all duration-280 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <div className="text-[15px] leading-relaxed text-[#4A5755]">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
