import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex border-b border-[#E2DDD3] gap-1 overflow-x-auto ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative pb-3 px-3.5 text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              isActive ? 'text-[#1F4B4A] font-semibold' : 'text-[#7B8786] hover:text-[#1E2A2B]'
            }`}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#E3EDEB] text-[#1F4B4A]' : 'bg-[#E2DDD3] text-[#4A5757]'
                }`}
              >
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1F4B4A] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

interface SegmentedToggleProps {
  options: { id: string; label: string; badge?: string; icon?: React.ReactNode }[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const SegmentedToggle: React.FC<SegmentedToggleProps> = ({
  options,
  activeId,
  onChange,
  className = ''
}) => {
  return (
    <div
      className={`inline-flex p-1 bg-[#E2DDD3]/60 border border-[#CFC8BB] rounded-[10px] gap-1 ${className}`}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = option.id === activeId;
        return (
          <button
            key={option.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-[7px] transition-all duration-180 flex items-center gap-1.5 cursor-pointer ${
              isSelected
                ? 'bg-[#FFFFFF] text-[#1F4B4A] font-semibold shadow-[0_1px_3px_rgba(30,42,43,0.08)]'
                : 'text-[#4A5757] hover:text-[#1E2A2B]'
            }`}
          >
            {option.icon && <span className="w-3.5 h-3.5">{option.icon}</span>}
            <span>{option.label}</span>
            {option.badge && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-[#E3EDEB] text-[#1F4B4A]' : 'bg-[#E2DDD3] text-[#7B8786]'
                }`}
              >
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
