import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldCheck } from 'lucide-react';
import type { AppNotification } from '@/data/types';
import { fmtLongDay, toDate } from '@/lib/dates';
import { springTransition } from '@/lib/motion';

export interface LockScreenProps {
  notification: AppNotification | null;
  onTapNotification: (notif: AppNotification) => void;
  onDismiss: () => void;
}

export function LockScreen({
  notification,
  onTapNotification,
  onDismiss,
}: LockScreenProps) {
  if (!notification) return null;

  const dateObj = toDate(notification.at);
  const formattedDay = fmtLongDay(dateObj);

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-lock bg-ink/90 backdrop-blur-md text-surface flex flex-col justify-between p-6 select-none overflow-hidden">
        {/* Top: Lock & Time Header */}
        <div className="pt-10 text-center flex flex-col items-center">
          <div className="w-4 h-4 mb-2 opacity-75">
            <ShieldCheck size={16} />
          </div>
          <p className="text-xs font-medium text-surface/80 tracking-wide">
            {formattedDay}
          </p>
          <h2 className="text-6xl font-display font-light tracking-tight mt-1">
            9:00
          </h2>
        </div>

        {/* Center: Push Notification Card */}
        <div className="my-auto w-full px-1">
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={springTransition}
            onClick={() => onTapNotification(notification)}
            className="w-full bg-surface/90 text-ink rounded-lg p-3.5 shadow-sheet backdrop-blur-md cursor-pointer hover:bg-surface transition-colors active:scale-[0.98]"
            role="button"
            tabIndex={0}
          >
            <div className="flex items-center justify-between text-[11px] text-ink-3 mb-1">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <Bell size={12} strokeWidth={2} />
                <span>SAVE ME</span>
              </div>
              <span>now</span>
            </div>
            <h4 className="text-xs font-semibold text-ink leading-snug">
              {notification.title}
            </h4>
            <p className="text-xs text-ink-2 mt-0.5 leading-snug">
              {notification.body}
            </p>
            <p className="text-[10px] text-primary font-medium mt-1.5 flex items-center gap-1">
              Tap to review
            </p>
          </motion.div>
        </div>

        {/* Bottom dismiss indicator */}
        <div className="pb-4 text-center">
          <button
            type="button"
            onClick={onDismiss}
            className="text-xs text-surface/60 hover:text-surface underline font-medium"
          >
            Swipe up or tap to unlock
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
}
