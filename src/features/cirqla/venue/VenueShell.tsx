import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useCirqlaStore } from '../../../store/cirqla';
import { useDemoStore } from '../../../store/demo';
import { ProductSwitcher } from '../../../components/brand/ProductSwitcher';
import { DemoControls } from '../../../components/brand/DemoControls';
import { CommandPalette } from '../../../components/brand/CommandPalette';
import {
  ChefHat,
  UtensilsCrossed,
  BookOpen,
  CreditCard,
  BarChart3,
  Users,
  MapPin,
  Settings,
  ChevronDown,
  Search,
  Bell,
  ArrowUpRight,
  LogOut,
  Building,
} from 'lucide-react';

export const VenueShell: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, activeTenantId, tenants, kitchenOpen, setKitchenOpen } = useCirqlaStore();
  const { activeBranchId, setActiveBranchId } = useDemoStore();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const newOrdersCount = orders.filter((o) => o.status === 'Received').length;

  const navItems = [
    { label: 'Live Orders', path: '/cirqla/venue/orders', icon: <ChefHat className="w-4 h-4" />, badge: newOrdersCount },
    { label: 'Menu Manager', path: '/cirqla/venue/menu', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Payments Ledger', path: '/cirqla/venue/payments', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Analytics', path: '/cirqla/venue/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Staff & Roles', path: '/cirqla/venue/staff', icon: <Users className="w-4 h-4" /> },
    { label: 'Branches & QR Codes', path: '/cirqla/venue/branches', icon: <MapPin className="w-4 h-4" /> },
    { label: 'Settings & Branding', path: '/cirqla/venue/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col font-sans text-ink">
      {/* 48px Slim Product Bar */}
      <div className="h-12 bg-primary text-surface px-6 flex items-center justify-between text-xs border-b border-primary-a shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/cirqla" className="font-serif text-base tracking-tight font-normal text-surface flex items-center gap-1.5">
            <span className="font-sans font-bold text-clay">cirqla</span>
            <span className="text-surface/80">/ Venue Dispatch</span>
          </Link>
          <span className="text-surface/40">|</span>
          <span className="text-[11px] text-surface/80 font-mono">
            Kiln Street Kitchen (Growth Tier)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.open('/cirqla/scan/kiln-street?table=12', '_blank')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface/10 hover:bg-surface/20 text-surface text-[11px] transition-colors"
          >
            <span>Open Diner PWA in New Tab</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <ProductSwitcher />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 240px Sidebar (Desktop) */}
        <aside className="w-60 bg-surface border-r border-line flex flex-col justify-between p-4 shrink-0 hidden md:flex text-left">
          <div className="space-y-4">
            {/* Venue & Branch Selector */}
            <div className="p-3 rounded-xl bg-bg border border-line space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-serif text-sm font-bold text-white shadow-xs"
                  style={{ backgroundColor: activeTenant.accent }}
                >
                  {activeTenant.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-ink truncate leading-tight">
                    {activeTenant.name}
                  </h3>
                  <span className="text-[10px] text-ink-3 uppercase font-mono">Branch Scoped</span>
                </div>
              </div>

              {/* Branch select */}
              <select
                value={activeBranchId}
                onChange={(e) => setActiveBranchId(e.target.value)}
                className="w-full h-7 px-2 rounded bg-elevated border border-line text-[11px] text-ink outline-none"
              >
                {activeTenant.branches.map((b) => (
                  <option key={b} value={b}>
                    {b} Branch
                  </option>
                ))}
              </select>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-elevated text-primary font-semibold border border-line shadow-xs'
                        : 'text-ink-2 hover:bg-bg hover:text-ink'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-primary' : 'text-ink-3'}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-clay text-white font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User & GM Persona Card */}
          <div className="pt-4 border-t border-line space-y-2 text-xs">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-bg border border-line">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center font-serif">
                DF
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink text-xs truncate">Daniyal Farooq</p>
                <p className="text-[10px] text-ink-3">General Manager</p>
              </div>
            </div>

            <Link
              to="/cirqla/platform"
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-ink-3 hover:text-ink hover:underline"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Switch to Cirqla Super-Admin</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar 56px */}
          <header className="h-14 bg-elevated border-b border-line px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider font-mono">
                {activeBranchId} Branch Live Console
              </span>
              <span className="text-ink-3 text-xs">·</span>
              <span className="text-xs text-ink-2 font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Quick Order Search Trigger */}
              <div className="text-xs text-ink-3 hidden sm:flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-bg border border-line text-[10px] font-mono">
                  Cmd + K
                </kbd>
                <span>Command Palette</span>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full text-ink-2 hover:bg-surface hover:text-ink transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  {newOrdersCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-clay animate-ping" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-elevated rounded-xl border border-line shadow-xl p-3 z-50 text-left text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-line">
                      <span className="font-bold text-ink uppercase tracking-wider text-[10px]">
                        Service Notifications
                      </span>
                      <span className="text-[10px] text-ink-3 font-mono">{newOrdersCount} pending</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded bg-surface border border-line text-[11px]">
                        <span className="font-bold text-clay">Order #1048 Arrived</span>
                        <p className="text-ink-3">Table 12 · Short rib, lemonade</p>
                      </div>
                      <div className="p-2 rounded bg-bg text-[11px] text-ink-3">
                        <span>Staff shifted to Dinner Rush pace</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Subview Outlet */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden h-14 bg-elevated border-t border-line flex items-center justify-around px-2 shrink-0">
        <Link
          to="/cirqla/venue/orders"
          className="flex flex-col items-center gap-1 text-[10px] font-medium text-ink relative"
        >
          <ChefHat className="w-4 h-4 text-primary" />
          <span>Orders</span>
          {newOrdersCount > 0 && (
            <span className="absolute -top-1 right-2 px-1 rounded-full bg-clay text-white text-[9px] font-mono">
              {newOrdersCount}
            </span>
          )}
        </Link>
        <Link to="/cirqla/venue/menu" className="flex flex-col items-center gap-1 text-[10px] font-medium text-ink-2">
          <BookOpen className="w-4 h-4" />
          <span>Menu</span>
        </Link>
        <Link to="/cirqla/venue/payments" className="flex flex-col items-center gap-1 text-[10px] font-medium text-ink-2">
          <CreditCard className="w-4 h-4" />
          <span>Ledger</span>
        </Link>
        <Link to="/cirqla/venue/analytics" className="flex flex-col items-center gap-1 text-[10px] font-medium text-ink-2">
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </Link>
      </div>

      {/* Global Demo Controls (Bottom Left) */}
      <DemoControls />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />
    </div>
  );
};
