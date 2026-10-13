import React from 'react';
import { brand } from '@/config/brand';

export interface HeaderProps {
  title: string;
  onOpenSettings?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ title, onOpenSettings, rightAction }: HeaderProps) {
  return (
    <header className="h-14 px-5 flex items-center justify-between flex-shrink-0 z-10 bg-bg/90 backdrop-blur-sm">
      <h1 className="text-2xl font-display font-medium text-ink">{title}</h1>

      <div className="flex items-center gap-2">
        {rightAction}
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Settings and account"
            className="w-8 h-8 rounded-full bg-primary-t text-primary flex items-center justify-center font-display font-medium text-sm hover:ring-2 hover:ring-primary/20 transition-all"
          >
            {brand.user.initial}
          </button>
        )}
      </div>
    </header>
  );
}
