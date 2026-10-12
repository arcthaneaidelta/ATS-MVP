import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoTooltipProps {
  content: React.ReactNode;
  title?: string;
  className?: string;
  variant?: 'help' | 'info';
  children?: React.ReactNode;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  title,
  className,
  variant = 'info',
  children,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-flex items-center align-middle" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={cn(
          'p-0.5 text-ink-3 hover:text-accent transition-colors rounded focus:outline-none focus:ring-1 focus:ring-accent',
          className
        )}
        aria-label="More information"
      >
        {children ? (
          children
        ) : variant === 'help' ? (
          <HelpCircle className="w-3.5 h-3.5" />
        ) : (
          <Info className="w-3.5 h-3.5" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 max-w-[85vw] p-3.5 bg-surface rounded-md shadow-sh-2 border border-border text-left z-50 text-xs text-ink-2 leading-relaxed pointer-events-auto"
          >
            {title && (
              <h5 className="font-semibold text-ink mb-1 text-xs border-b border-border/60 pb-1">
                {title}
              </h5>
            )}
            <div>{content}</div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-surface border-t-8 border-x-transparent border-x-8 border-b-0 drop-shadow-sm" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
