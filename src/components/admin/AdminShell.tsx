import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandLogo } from '../layout/BrandLogo';
import { useDemoStore } from '../../store/useDemoStore';
import { useToast } from '../ui/Toast';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  FileText, 
  Car, 
  DollarSign, 
  ShieldCheck, 
  Settings, 
  Bus, 
  RotateCcw, 
  Eye, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { InfoTooltip } from '../ui/Tooltip';

export const AdminShell: React.FC<{ children: React.ReactNode; title: string; subtitle?: string; actions?: React.ReactNode }> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F4EE] flex text-left text-ink">
      {/* Desktop & Tablet Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-surface border-b border-border px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-sand-soft text-ink"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs text-ink-3 hidden sm:flex items-center gap-2">
              <span>Admin</span>
              <span>/</span>
              <span className="font-medium text-ink capitalize">
                {location.pathname.replace('/admin', '').replace('/', '') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/">
              <button
                type="button"
                className="text-xs font-semibold text-accent hover:text-accent-hover bg-accent-soft/70 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Site</span>
              </button>
            </Link>

            <div className="h-4 w-[1px] bg-border" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-serif text-xs font-bold">
                NK
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold leading-tight text-ink">Neville K.</div>
                <div className="text-[10px] text-ink-3">Owner / Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Header */}
        <div className="px-4 sm:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-ink-2 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        </div>

        {/* Page Content Body */}
        <main className="flex-1 px-4 sm:px-8 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export const AdminSidebar: React.FC<{ mobileOpen: boolean; onCloseMobile: () => void }> = ({
  mobileOpen,
  onCloseMobile,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetDemoData, quotations, bookings } = useDemoStore();

  const newQuotesCount = quotations.filter((q) => q.status === 'new').length;

  const navItems = [
    { label: 'Overview', to: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Timeline Calendar', to: '/admin/calendar', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Bookings', to: '/admin/bookings', icon: <BookOpen className="w-4 h-4" /> },
    { 
      label: 'Quotations', 
      to: '/admin/quotations', 
      icon: <FileText className="w-4 h-4" />,
      badge: newQuotesCount > 0 ? newQuotesCount : undefined
    },
    { label: 'Fleet & Vehicles', to: '/admin/vehicles', icon: <Car className="w-4 h-4" /> },
    { label: 'Rates & Brackets', to: '/admin/pricing', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Insurance Packages', to: '/admin/insurance', icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Settings', to: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleReset = () => {
    if (window.confirm('Reset all demo data (bookings, rates, vehicles) to seed defaults?')) {
      resetDemoData();
      toast({
        type: 'info',
        title: 'Demo Data Reset',
        message: 'All seed data restored.',
      });
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 text-left">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 px-2">
          <BrandLogo inverted size="sm" />
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-sand hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo data chip per PRD §0: "Demo data chip in the admin only, never on the public site" */}
        <div className="my-3 px-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-accent/20 text-accent px-2 py-0.5 rounded border border-accent/30 inline-block">
            Demo data active
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 mt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary-hover text-white font-semibold shadow-inner border border-white/10'
                    : 'text-sand/80 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sand/70">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold bg-accent text-white px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Shuttles (Planned / Extensible module) per PRD §2 */}
          <div className="flex items-center justify-between px-3 py-2.5 text-xs text-sand/35 cursor-not-allowed select-none">
            <div className="flex items-center gap-2.5">
              <Bus className="w-4 h-4 opacity-50" />
              <span>Shuttles</span>
            </div>
            <span className="text-[9px] bg-white/5 text-sand/40 px-1.5 py-0.5 rounded uppercase">
              Coming soon
            </span>
          </div>
        </nav>
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-sand/75 hover:bg-white/10 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent" />
          <span>Reset Demo Data</span>
        </button>

        <Link
          to="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-sand/75 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Go to Public Site</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-60 bg-primary text-white border-r border-[#1D2522] hidden lg:block shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Off-canvas Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 bg-primary text-white h-full z-10 shadow-sh-3">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
