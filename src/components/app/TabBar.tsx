import React from 'react';
import { Home, Layers, Hourglass } from 'lucide-react';

export type TabId = 'today' | 'subscriptions' | 'trials';

export interface TabBarProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabBar({ currentTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: 'today' as TabId, label: 'Today', icon: Home },
    { id: 'subscriptions' as TabId, label: 'Subscriptions', icon: Layers },
    { id: 'trials' as TabId, label: 'Trials', icon: Hourglass },
  ];

  return (
    <nav
      aria-label="App Navigation"
      className="h-16 px-4 bg-surface border-t border-line flex items-center justify-around flex-shrink-0 z-nav"
    >
      {tabs.map((tab) => {
        const isSelected = currentTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-20 py-1 transition-transform active:scale-95 ${
              isSelected ? 'text-primary' : 'text-ink-3 hover:text-ink-2'
            }`}
          >
            <div className="relative">
              {isSelected && (
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  aria-hidden="true"
                />
              )}
              <Icon size={20} strokeWidth={isSelected ? 2 : 1.5} />
            </div>
            <span
              className={`text-xs mt-1 tracking-tight ${
                isSelected ? 'font-semibold text-primary' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
