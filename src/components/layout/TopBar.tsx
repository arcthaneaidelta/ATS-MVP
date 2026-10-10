import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, HelpCircle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getRelativeTime } from '../../lib/format';
import clsx from 'clsx';

export function TopBar() {
  const {
    setCommandPaletteOpen,
    language,
    toggleLanguage,
    notifications,
    markNotificationRead,
    currentEntity,
    resetDemoData,
  } = useStore();
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showHelpPopover, setShowHelpPopover] = useState(false);
  const location = useLocation();
  const notifRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPopover(false);
      }
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
        setShowHelpPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs from path
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/app') return ['Dashboard'];
    if (path.startsWith('/app/parts')) return ['Knowledge', 'Parts Master'];
    if (path.startsWith('/app/pricing')) return ['Knowledge', 'Pricing Intelligence'];
    if (path.startsWith('/app/rfq/new')) return ['Work', 'RFQs & Quotes', 'Import Wizard'];
    if (path.startsWith('/app/rfq')) return ['Work', 'RFQs & Quotes'];
    if (path.startsWith('/app/orders')) return ['Work', 'Procurement & Orders'];
    if (path.startsWith('/app/finance')) return ['Money', 'Finance & Payments'];
    if (path.startsWith('/app/documents')) return ['Money', 'Commercial Documents'];
    if (path.startsWith('/app/migration')) return ['System', 'Migration Console'];
    if (path.startsWith('/app/admin')) return ['System', 'Entities & Access'];
    if (path.startsWith('/app/reports')) return ['System', 'Reports & Consolidated'];
    return ['System'];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 bg-surface border-b border-border px-4 flex items-center justify-between select-none sticky top-0 z-10">
      {/* Left Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-500 truncate mr-3">
        <Link to="/app" className="hover:text-ink-900 transition-colors">
          App
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-ink-300" />
            <span
              className={clsx(
                idx === breadcrumbs.length - 1
                  ? 'font-semibold text-ink-900'
                  : 'hover:text-ink-900 transition-colors'
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Center Search Trigger */}
      <div className="flex-1 max-w-md mx-2 sm:mx-6">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-sm border border-border-strong bg-surface-elevated hover:border-ink-500 text-xs text-ink-500 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-ink-500 shrink-0" />
            <span className="truncate">Search any part number (OEM, Cat, Sandvik)...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono bg-surface-sunken border border-border px-1.5 py-0.5 rounded-xs text-ink-500">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* EN/ES Language Toggle (PRD Section 1.5) */}
        <button
          type="button"
          onClick={toggleLanguage}
          title="Toggle English / Spanish"
          className="text-xs font-mono font-semibold px-2 py-1 rounded-sm border border-border bg-surface hover:bg-surface-sunken text-ink-700 transition-colors"
        >
          {language}
        </button>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="w-8 h-8 rounded-sm inline-flex items-center justify-center text-ink-700 hover:text-ink-900 hover:bg-surface-sunken transition-colors relative"
            aria-label="Open notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent ring-2 ring-surface" />
            )}
          </button>

          {showNotifPopover && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-elevated rounded-sm border border-border shadow-lg z-30 p-2 text-xs">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-border font-semibold text-ink-900">
                <span>Operational Alerts ({unreadCount} new)</span>
                <span className="text-[10px] font-mono text-ink-500">Simulated feed</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border/50 py-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={clsx(
                      'p-2.5 rounded-xs cursor-pointer transition-colors',
                      n.read ? 'opacity-65 hover:bg-surface-sunken' : 'bg-primary-tint/30 hover:bg-primary-tint/50'
                    )}
                  >
                    <p className="text-xs text-ink-900 font-medium leading-snug">{n.title}</p>
                    <span className="text-[10px] text-ink-500 font-mono mt-1 block">
                      {getRelativeTime(n.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help & Demo Information Popover */}
        <div ref={helpRef} className="relative">
          <button
            type="button"
            onClick={() => setShowHelpPopover(!showHelpPopover)}
            className="w-8 h-8 rounded-sm inline-flex items-center justify-center text-ink-700 hover:text-ink-900 hover:bg-surface-sunken transition-colors"
            aria-label="Demo instructions and error test"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {showHelpPopover && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface-elevated rounded-sm border border-border shadow-lg z-30 p-3 text-xs text-ink-700">
              <h4 className="font-semibold text-ink-900 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Prototype Guide & Edge Cases
              </h4>
              <p className="text-[11px] text-ink-500 mb-2 leading-relaxed">
                All data is relational & simulated in localStorage.
              </p>
              <ul className="space-y-1.5 text-[11px] border-t border-border pt-2 mb-3">
                <li>• <strong>⌘K Search:</strong> Try OEM numbers like <code>SDV-4471-023</code> or <code>KM-HS-2210-8</code>.</li>
                <li>• <strong>RFQ Wizard:</strong> Click "Use sample RFQ" to watch 42 rows resolve.</li>
                <li>• <strong>Error state target:</strong> Part <code>STR-000999</code> deterministically simulates error boundaries.</li>
              </ul>
              <button
                type="button"
                onClick={resetDemoData}
                className="w-full text-center py-1.5 bg-surface-sunken hover:bg-surface border border-border rounded-xs text-[11px] font-medium flex items-center justify-center gap-1.5 text-ink-700"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Sample Database
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
