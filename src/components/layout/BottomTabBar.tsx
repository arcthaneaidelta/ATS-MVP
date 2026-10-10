import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  ShoppingCart,
  MoreHorizontal,
  Landmark,
  Files,
  Database,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EntitySwitcher } from './EntitySwitcher';
import clsx from 'clsx';

export function BottomTabBar() {
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const mainTabs = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Parts', path: '/app/parts', icon: Package },
    { name: 'RFQs', path: '/app/rfq', icon: FileSpreadsheet },
    { name: 'Orders', path: '/app/orders', icon: ShoppingCart },
  ];

  const moreItems = [
    { name: 'Pricing Intelligence', path: '/app/pricing', icon: TrendingUp },
    { name: 'Finance & Payments', path: '/app/finance', icon: Landmark },
    { name: 'Commercial Documents', path: '/app/documents', icon: Files },
    { name: 'Migration Console', path: '/app/migration', icon: Database },
    { name: 'Entities & Access', path: '/app/admin', icon: ShieldCheck },
    { name: 'Reports & Consolidated', path: '/app/reports', icon: BarChart3 },
  ];

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-elevated border-t border-border z-30 flex items-center justify-around px-2"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium transition-colors',
                  isActive ? 'text-primary font-bold' : 'text-ink-500 hover:text-ink-900'
                )
              }
            >
              <Icon className="w-5 h-5 mb-0.5 stroke-[1.75]" />
              <span>{tab.name}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMoreSheet(true)}
          className="flex flex-col items-center justify-center py-1 px-3 text-[10px] font-medium text-ink-500 hover:text-ink-900"
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5 stroke-[1.75]" />
          <span>More</span>
        </button>
      </nav>

      {/* More Sheet for Mobile */}
      <AnimatePresence>
        {showMoreSheet && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-900/40"
              onClick={() => setShowMoreSheet(false)}
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 bg-surface-elevated rounded-t-lg border-t border-border p-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                <span className="font-semibold text-sm text-ink-900">All Modules & Settings</span>
                <button
                  type="button"
                  onClick={() => setShowMoreSheet(false)}
                  className="p-1 text-ink-500 hover:text-ink-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-ink-500 font-mono block mb-1.5">
                  Current Territory
                </span>
                <EntitySwitcher />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMoreSheet(false)}
                      className="flex items-center gap-2 p-2.5 rounded-sm border border-border bg-surface hover:bg-surface-sunken text-xs font-medium text-ink-900"
                    >
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
