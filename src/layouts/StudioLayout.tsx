import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { GlobalSwitcher } from '../components/common/GlobalSwitcher';
import { CommandPalette } from '../components/common/CommandPalette';
import { GuidedTourModal } from '../components/common/GuidedTourModal';
import { ToastContainer } from '../components/ui/ToastContainer';
import { 
  LayoutDashboard, GitPullRequest, Users, Calendar as CalendarIcon, 
  Workflow, Zap, PhoneCall, BarChart3, Settings, ShieldCheck, 
  Search, Bell, ChevronLeft, ChevronRight, Menu, Compass, RotateCcw, 
  ExternalLink, User as UserIcon 
} from 'lucide-react';

export const StudioLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activity, resetAllData } = useAppStore();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const navGroups = [
    {
      group: 'Run',
      items: [
        { label: 'Overview', path: '/studio', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Pipeline', path: '/studio/pipeline', icon: <GitPullRequest className="w-4 h-4" /> },
        { label: 'Contacts', path: '/studio/contacts', icon: <Users className="w-4 h-4" /> },
        { label: 'Calendar', path: '/studio/calendar', icon: <CalendarIcon className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Automate',
      items: [
        { label: 'Workflows', path: '/studio/workflows', icon: <Workflow className="w-4 h-4" /> },
        { label: 'Simulator', path: '/studio/simulator', icon: <Zap className="w-4 h-4" /> },
        { label: 'Voice Agent', path: '/studio/voice', icon: <PhoneCall className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Measure',
      items: [
        { label: 'Reports', path: '/studio/reports', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Configure',
      items: [
        { label: 'Setup', path: '/studio/setup', icon: <Settings className="w-4 h-4" /> },
        { label: 'Handoff Hub', path: '/studio/handoff', icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col antialiased">
      {/* Top Global Switcher */}
      <GlobalSwitcher onOpenTour={() => setIsTourOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop & Tablet) */}
        <aside
          className={`hidden md:flex flex-col border-r border-border bg-surface shrink-0 transition-all duration-base ${
            collapsed ? 'w-16' : 'w-[232px]'
          }`}
        >
          {/* Brand header */}
          <div className="h-14 px-4 border-b border-border flex items-center justify-between">
            {!collapsed && (
              <div 
                onClick={() => navigate('/studio')}
                className="cursor-pointer flex items-center gap-2 select-none"
              >
                <div className="w-6 h-6 rounded-md bg-primary text-surface flex items-center justify-center font-bold text-xs">
                  J
                </div>
                <div className="font-serif font-semibold text-sm tracking-tight text-text">
                  Journey Studio
                </div>
              </div>
            )}
            {collapsed && (
              <div 
                onClick={() => navigate('/studio')}
                className="w-full flex justify-center cursor-pointer"
              >
                <div className="w-7 h-7 rounded-md bg-primary text-surface flex items-center justify-center font-bold text-xs">
                  J
                </div>
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded text-text-muted hover:text-text hover:bg-sunken"
              aria-label="Toggle sidebar collapse"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {!collapsed && (
                  <div className="px-2.5 py-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    {group.group}
                  </div>
                )}
                {group.items.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-input text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-primary-soft text-primary font-semibold border-l-2 border-primary shadow-xs'
                          : 'text-text-2 hover:bg-sunken hover:text-text'
                      } ${collapsed ? 'justify-center px-0' : ''}`}
                    >
                      <span className={isActive ? 'text-primary' : 'text-text-muted'}>
                        {item.icon}
                      </span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer Card */}
          {!collapsed && (
            <div className="p-3 border-t border-border bg-sunken/40">
              <div className="p-2.5 rounded-input bg-surface border border-border space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-text">
                  <span>Alder & Finch GHL</span>
                  <span className="w-2 h-2 rounded-full bg-success" />
                </div>
                <div className="text-[10px] text-text-muted">Subaccount: pdx_remodel_01</div>
                <button
                  onClick={() => setIsTourOpen(true)}
                  className="w-full mt-1.5 py-1 text-[10px] font-medium rounded bg-primary-soft text-primary hover:bg-primary-soft/80 flex items-center justify-center gap-1"
                >
                  <Compass className="w-3 h-3 text-accent" />
                  <span>Interactive Tour</span>
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Console Bar (56px) */}
          <header className="h-14 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between shrink-0">
            {/* Left: Mobile hamburger & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-text hover:bg-sunken rounded"
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                <span>Journey Studio</span>
                <span>/</span>
                <span className="text-text capitalize font-semibold">
                  {currentPath.replace('/studio/', '').replace('/studio', 'Overview')}
                </span>
              </div>
            </div>

            {/* Right: Search, Notifications, Avatar */}
            <div className="flex items-center gap-3">
              {/* Quick Search trigger */}
              <button
                onClick={() => setIsCommandOpen(true)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-input bg-sunken border border-border text-xs text-text-muted hover:border-primary/40 hover:text-text transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search screens & contacts...</span>
                <kbd className="text-[10px] font-mono px-1 py-0.5 rounded bg-surface border border-border">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsCommandOpen(true)}
                className="sm:hidden p-2 text-text-muted hover:text-text"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notification bell */}
              <div className="relative">
                <button
                  onClick={() => setUnreadNotifications(0)}
                  className="p-2 text-text-muted hover:text-text rounded-input hover:bg-sunken relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-input hover:bg-sunken transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-surface text-xs font-semibold flex items-center justify-center">
                    DW
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-text leading-tight">Dana Whitfield</div>
                    <div className="text-[10px] text-text-muted leading-tight">Principal / Owner</div>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-elevated rounded-card shadow-sh-2 border border-border p-1.5 z-50 text-xs space-y-1 animate-in fade-in-50 duration-fast">
                    <div className="px-2.5 py-1 text-[11px] font-semibold text-text-muted">Operator Session</div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsTourOpen(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-sunken flex items-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5 text-accent" />
                      <span>Start Guided Tour</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/proposal');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-sunken flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      <span>View Proposal ($1,000)</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (window.confirm('Reset all demo state to clean defaults?')) {
                          resetAllData();
                        }
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-error/15 text-error flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Outlet */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1360px] w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar (<= 767px) */}
      <nav className="md:hidden border-t border-border bg-surface flex items-center justify-around py-2 px-1 z-30 shrink-0">
        <Link
          to="/studio"
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPath === '/studio' ? 'text-primary font-bold' : 'text-text-muted'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </Link>
        <Link
          to="/studio/pipeline"
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPath === '/studio/pipeline' ? 'text-primary font-bold' : 'text-text-muted'
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Pipeline</span>
        </Link>
        <Link
          to="/studio/simulator"
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPath === '/studio/simulator' ? 'text-accent font-bold' : 'text-text-muted'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Simulator</span>
        </Link>
        <Link
          to="/studio/voice"
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPath === '/studio/voice' ? 'text-primary font-bold' : 'text-text-muted'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Voice</span>
        </Link>
        <Link
          to="/studio/reports"
          className={`flex flex-col items-center gap-0.5 text-[10px] ${
            currentPath === '/studio/reports' ? 'text-primary font-bold' : 'text-text-muted'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Reports</span>
        </Link>
      </nav>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Guided Tour Modal */}
      <GuidedTourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      {/* Global Toast Stack */}
      <ToastContainer />
    </div>
  );
};
