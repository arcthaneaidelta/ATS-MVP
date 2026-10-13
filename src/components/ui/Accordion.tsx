import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className = '' }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="card overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-surface-2/60 transition-colors"
            >
              <div className="flex-1 pr-4">{item.header}</div>
              <ChevronDown
                size={18}
                className={`text-ink-3 transition-transform duration-fast ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div className="acc-panel" data-open={isOpen}>
              <div className="px-5 pb-5 pt-1 border-t border-line/60 text-sm text-ink-2">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
