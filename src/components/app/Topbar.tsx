import React, { useState } from 'react';
import { Bell, Search, Plus, Check } from 'lucide-react';
import { useAppStore } from '../../store';
import { Button } from '../ui/Button';

export const Topbar: React.FC<{
  onOpenAddFunds: () => void;
  onOpenCommandPalette: () => void;
  breadcrumbs?: string[];
}> = ({ onOpenAddFunds, onOpenCommandPalette, breadcrumbs = ['Dashboard'] }) => {
  const { notifications, markAllNotificationsRead, user } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-[#DDD8CD] bg-[#FBF9F5] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#7C867F]">
        <span>Meridian</span>
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            <span>/</span>
            <span
              className={
                i === breadcrumbs.length - 1
                  ? 'text-[#1B2420] font-semibold font-sans text-sm'
                  : ''
              }
            >
              {b}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search / Command Palette Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#EDE9E1] hover:bg-[#DDD8CD] text-[#7C867F] hover:text-[#1B2420] rounded-md text-xs font-medium transition-colors cursor-pointer border border-[#DDD8CD]"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 bg-[#FFFFFF] border border-[#C7C1B3] rounded text-[10px] font-mono text-[#4A5650]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#4A5650] hover:text-[#1B2420] hover:bg-[#EDE9E1] rounded-md transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B08A4E]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#DDD8CD] rounded-md shadow-[0_6px_20px_rgba(27,36,32,0.08)] py-3 z-50 animate-in fade-in zoom-in-95 text-left">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-[#DDD8CD]/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1B2420]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllNotificationsRead()}
                    className="text-[11px] text-[#2C4A3E] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[#DDD8CD]/40">
                {notifications.length === 0 ? (
                  <div className="p-4 text-xs text-[#7C867F] text-center">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs hover:bg-[#FBF9F5] transition-colors ${
                        !n.read ? 'bg-[#E3EBE6]/30' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold text-[#1B2420] mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-normal text-[#7C867F]">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[#4A5650] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add funds CTA button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenAddFunds}
          className="flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add funds</span>
        </Button>

        {/* User initials */}
        <div className="w-8 h-8 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center font-display text-xs font-semibold shrink-0 select-none">
          {user.avatarInitials}
        </div>
      </div>
    </header>
  );
};
