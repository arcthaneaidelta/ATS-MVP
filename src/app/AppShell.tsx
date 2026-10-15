import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  FileText,
  BookmarkCheck,
  CreditCard,
  Users,
  Shield,
  Search,
  Bell,
  RotateCcw,
  Menu,
  X,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { CommandPalette } from '../components/CommandPalette';
import { DevPanel } from '../components/DevPanel';
import { GuidedTour } from '../components/GuidedTour';

export const AppShell: React.FC = () => {
  const currentRole = useStore((s) => s.currentRole);
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const buyers = useStore((s) => s.buyers);
  const resetDemo = useStore((s) => s.resetDemo);
  const location = useLocation();
  const navigate = useNavigate();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);
  const isExplorer = currentBuyer?.planId === 'explorer';

  interface NavItem {
    label: string;
    path: string;
    icon: any;
    badge?: string;
  }

  // Navigation configurations per role
  const buyerNav: NavItem[] = [
    { label: 'Overview', path: '/app', icon: LayoutDashboard },
    { label: 'Requests & Quotes', path: '/app/requests', icon: FileText },
    { label: 'My Bookings', path: '/app/bookings', icon: BookmarkCheck },
    {
      label: 'Subscription',
      path: '/app/subscription',
      icon: CreditCard,
      badge: isExplorer ? 'Free' : 'Pro',
    },
  ];

  const adminNav: NavItem[] = [
    { label: 'Overview & Queue', path: '/admin', icon: LayoutDashboard },
    { label: 'Buyer Directory', path: '/admin/buyers', icon: Users },
    { label: 'Bookings Queue', path: '/admin/bookings', icon: Shield },
  ];

  const coordinatorNav: NavItem[] = [
    { label: 'Payment Approvals', path: '/coord/payments', icon: CreditCard },
  ];

  const activeNavItems: NavItem[] =
    currentRole === 'buyer'
      ? buyerNav
      : currentRole === 'admin'
      ? adminNav
      : coordinatorNav;


  // Breadcrumbs calculation
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join('/')}`;
    const formatted = part.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return { name: formatted, url, isLast: index === pathParts.length - 1 };
  });

  return (
    <div className="min-h-screen bg-meridian-bg flex flex-col antialiased selection:bg-meridian-primary-tint selection:text-meridian-primary">
      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Dev View Drawer & Guided Tour Pill */}
      <DevPanel />
      <GuidedTour />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (248px desktop, 72px tablet icon rail) */}
        <aside className="hidden md:flex flex-col w-[72px] lg:w-[248px] bg-meridian-surface border-r border-meridian-border shrink-0 select-none transition-all duration-200">
          {/* Logo & Portal Branding */}
          <div className="h-16 px-4 lg:px-6 flex items-center justify-between border-b border-meridian-border">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-meridian-primary flex items-center justify-center text-white shrink-0 shadow-sh-1">
                <Compass className="w-5 h-5 text-meridian-surface" />
              </div>
              <div className="hidden lg:block">
                <span className="font-serif font-medium text-lg text-meridian-primary tracking-tight">
                  Meridian
                </span>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-meridian-text-muted">
                  Trade Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Active Tenant / Role Card (desktop only) */}
          <div className="hidden lg:block p-4 border-b border-meridian-border bg-meridian-surface-sunken/40">
            {currentRole === 'buyer' && currentBuyer ? (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-meridian-text-muted">
                    Buyer Agency
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase font-mono ${
                      isExplorer
                        ? 'bg-meridian-surface text-meridian-text-muted border border-meridian-border'
                        : 'bg-meridian-primary-tint text-meridian-primary'
                    }`}
                  >
                    {currentBuyer.planId}
                  </span>
                </div>
                <p className="text-xs font-semibold text-meridian-text-primary mt-1 truncate">
                  {currentBuyer.name}
                </p>
                <p className="text-[11px] text-meridian-text-muted truncate">
                  {currentBuyer.contactName}
                </p>
              </div>
            ) : currentRole === 'admin' ? (
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-meridian-accent">
                  Operator Admin
                </span>
                <p className="text-xs font-semibold text-meridian-text-primary mt-0.5">
                  Meridian Operations Desk
                </p>
                <p className="text-[11px] text-meridian-text-muted">Sarah Jenkins (Reviewer)</p>
              </div>
            ) : (
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-meridian-info">
                  Coordinator Desk
                </span>
                <p className="text-xs font-semibold text-meridian-text-primary mt-0.5">
                  Supplier Pay Desk
                </p>
                <p className="text-[11px] text-meridian-text-muted">Clara Vance (Disbursements)</p>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/app' &&
                  item.path !== '/admin' &&
                  location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-card text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-meridian-primary-tint text-meridian-primary font-semibold'
                      : 'text-meridian-text-secondary hover:bg-meridian-surface-sunken hover:text-meridian-text-primary'
                  }`}
                  title={item.label}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-meridian-primary rounded-r" />
                  )}

                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden lg:inline truncate">{item.label}</span>

                  {item.badge && (
                    <span className="hidden lg:inline ml-auto text-[10px] font-mono px-1.5 py-0.5 bg-meridian-surface border border-meridian-border rounded text-meridian-text-muted">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-meridian-border space-y-2 text-xs">
            <Link
              to="/plans"
              className="hidden lg:flex items-center justify-between px-3 py-2 text-meridian-text-secondary hover:text-meridian-text-primary hover:bg-meridian-surface-sunken rounded-card"
            >
              <span>Plans & Allowances</span>
              <ExternalLink className="w-3.5 h-3.5 text-meridian-text-muted" />
            </Link>

            <Link
              to="/"
              className="hidden lg:flex items-center justify-between px-3 py-2 text-meridian-text-secondary hover:text-meridian-text-primary hover:bg-meridian-surface-sunken rounded-card"
            >
              <span>Public Landing</span>
              <Compass className="w-3.5 h-3.5 text-meridian-text-muted" />
            </Link>

            <button
              onClick={resetDemo}
              className="w-full flex items-center justify-center lg:justify-start gap-2 px-3 py-2 text-meridian-text-muted hover:text-meridian-error hover:bg-meridian-error-tint/40 rounded-card transition-colors text-[11px]"
              title="Reset Demo Seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Demo Seed</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar (64px) */}
          <header className="h-16 px-4 md:px-8 bg-meridian-surface border-b border-meridian-border flex items-center justify-between shrink-0 sticky top-0 z-20">
            {/* Left: Mobile hamburger & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-meridian-text-secondary hover:bg-meridian-surface-sunken rounded"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <nav className="hidden sm:flex items-center gap-1.5 text-xs text-meridian-text-muted">
                <Link to="/" className="hover:text-meridian-text-primary">
                  Meridian
                </Link>
                {breadcrumbItems.map((b) => (
                  <React.Fragment key={b.url}>
                    <span>/</span>
                    {b.isLast ? (
                      <span className="text-meridian-text-primary font-medium">{b.name}</span>
                    ) : (
                      <Link to={b.url} className="hover:text-meridian-text-primary">
                        {b.name}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Right: Search shortcut, Notification bell, Role Switcher */}
            <div className="flex items-center gap-3">
              {/* Cmd+K Search trigger */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-meridian-text-muted bg-meridian-surface-sunken rounded-full border border-meridian-border hover:border-meridian-border-strong transition-colors"
                title="Search (Cmd+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono bg-meridian-surface rounded border border-meridian-border-strong">
                  ⌘K
                </kbd>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-meridian-text-secondary hover:text-meridian-text-primary hover:bg-meridian-surface-sunken rounded-full relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-meridian-accent rounded-full ring-2 ring-meridian-surface" />
                </button>

                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-meridian-surface border border-meridian-border rounded-card shadow-sh-2 z-30 p-3 text-xs space-y-2 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between pb-2 border-b border-meridian-border">
                        <span className="font-semibold text-meridian-text-primary">
                          Operator Notifications
                        </span>
                        <span className="text-[10px] text-meridian-text-muted font-mono">15 Oct 2026</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="p-2 rounded bg-meridian-warning-tint/40 text-meridian-text-primary">
                          <p className="font-semibold text-meridian-warning">Quote Q-2039 Expiring</p>
                          <p className="text-meridian-text-secondary">
                            Expires in 2 days. 4 travellers for Andalusia Slow Rail.
                          </p>
                        </div>
                        <div className="p-2 rounded bg-meridian-primary-tint/40 text-meridian-text-primary">
                          <p className="font-semibold text-meridian-primary">Payment Confirmed</p>
                          <p className="text-meridian-text-secondary">
                            Rail Iberia Charters $9,500 wire confirmed on BK-2609.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Persistent Role Switcher (PRD Section 3) */}
              <RoleSwitcher />
            </div>
          </header>

          {/* Mobile navigation drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden p-4 bg-meridian-surface-elevated border-b border-meridian-border space-y-1 text-xs">
              {activeNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-card text-meridian-text-secondary hover:bg-meridian-surface-sunken"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Page View Body */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (under 768px, 4 items) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-meridian-surface border-t border-meridian-border z-20 flex items-center justify-around py-2 text-[10px]">
        {activeNavItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-meridian-primary font-semibold' : 'text-meridian-text-muted'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
