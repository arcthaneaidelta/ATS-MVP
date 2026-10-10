import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { DEMO_ACCOUNTS } from '@/data/accounts'
import { formatDateTime } from '@/lib/format'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { FloatingGuideTrigger } from '@/components/guide/FloatingGuideTrigger'
import { DemoGuideDrawer } from '@/components/guide/DemoGuideDrawer'
import { BuildMapTag } from '@/components/ui/BuildMapTag'
import {
  LayoutDashboard,
  FileCheck2,
  FolderLock,
  FileText,
  User,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Shield,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

export const PortalLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    currentUser,
    switchAccount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentUser,
  } = useStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  const unreadNotifs = notifications.filter((n) => n.unread)

  const handleSignOut = () => {
    setCurrentUser(null)
    navigate('/portal/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/portal', icon: LayoutDashboard },
    { label: 'Orders', path: '/portal/orders', icon: FileCheck2 },
    { label: 'Documents', path: '/portal/documents', icon: FolderLock },
    { label: 'Intake Forms', path: '/portal/intake/A', icon: FileText },
    { label: 'Account', path: '/portal/account', icon: User },
  ]

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/portal/login', { replace: true })
    }
  }, [currentUser, navigate])

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#1B2625]">
      {/* Top App Bar */}
      <header className="h-16 bg-white border-b border-[#E3DDD0] sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between gap-4">
        {/* Left Brand and Link back */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-[6px] bg-[#17323A] flex items-center justify-center p-1.5 shadow-xs">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path
                  d="M7 10h8M11 10v12"
                  stroke="#F6F3EC"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M17 12l3.5 8L25 9"
                  stroke="#B8864B"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-lg font-medium text-[#17323A] leading-tight">
                TenderVantage
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#6F7A78]">
                Client Portal
              </span>
            </div>
          </Link>

          <BuildMapTag
            label="Portal Shell"
            wpEquivalent="WP Customer Area Pro"
            position="inline"
          />
        </div>

        {/* Middle Global Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6F7A78] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, deliverables, or tenders..."
              className="w-full h-9 pl-9 pr-4 rounded-[6px] bg-[#FBF9F4] border border-[#E3DDD0] text-xs text-[#1B2625] placeholder:text-[#6F7A78] focus:bg-white focus:outline-none focus:border-[#17323A]"
            />
          </div>
        </div>

        {/* Right User Controls */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-full text-[#17323A] hover:bg-[#EFEADF] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#B8864B] ring-2 ring-white" />
              )}
            </button>

            {/* Notification Popover */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-[12px] shadow-[0_24px_48px_-16px_rgba(23,50,58,0.22)] border border-[#E3DDD0] z-50 p-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD0]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#17323A]">Notifications</span>
                    {unreadNotifs.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#EFEADF] text-[10px] font-mono text-[#8A5F2B] font-bold">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs text-[#5E7F78] hover:text-[#17323A] font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="py-2 max-h-72 overflow-y-auto divide-y divide-[#E3DDD0]/50 text-xs">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-[#6F7A78]">You are up to date.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id)
                          if (n.linkUrl) {
                            navigate(n.linkUrl)
                            setNotifOpen(false)
                          }
                        }}
                        className={`p-2.5 hover:bg-[#FBF9F4] rounded-[6px] transition-colors cursor-pointer flex items-start gap-2.5 ${
                          n.unread ? 'bg-[#FBF9F4]' : ''
                        }`}
                      >
                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8864B] mt-1.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#17323A] leading-tight truncate">
                            {n.title}
                          </div>
                          <div className="text-[#6F7A78] text-[11px] mt-0.5 leading-snug">
                            {n.description}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full hover:bg-[#EFEADF] transition-colors border border-transparent hover:border-[#E3DDD0] cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#DCE5DF] text-[#17323A] font-semibold text-xs flex items-center justify-center font-mono">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  : 'NM'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#17323A] leading-tight">
                  {currentUser?.name || 'Naledi Mokgosi'}
                </span>
                <span className="text-[10px] text-[#6F7A78] truncate max-w-[120px]">
                  {currentUser?.companyName || 'Kgosi Mining'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6F7A78]" />
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-[12px] shadow-[0_24px_48px_-16px_rgba(23,50,58,0.22)] border border-[#E3DDD0] z-50 p-2 animate-in fade-in zoom-in-95">
                <div className="p-2.5 pb-2 border-b border-[#E3DDD0] text-xs">
                  <div className="font-semibold text-[#17323A]">{currentUser?.name}</div>
                  <div className="text-[11px] text-[#6F7A78] truncate">{currentUser?.email}</div>
                  <div className="text-[10px] text-[#8A5F2B] font-mono mt-1">
                    CIPA: {currentUser?.cipaNumber}
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-[#6F7A78] font-bold">
                    Switch Demo Account
                  </div>
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        switchAccount(acc.id)
                        setAccountMenuOpen(false)
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-[6px] transition-colors flex items-center justify-between text-xs ${
                        currentUser?.id === acc.id
                          ? 'bg-[#EFEADF] font-semibold text-[#17323A]'
                          : 'hover:bg-[#FBF9F4] text-[#4A5755]'
                      }`}
                    >
                      <span className="truncate">{acc.name}</span>
                      <span className="text-[9px] uppercase font-mono text-[#6F7A78]">
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-[#E3DDD0]">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-2.5 py-1.5 rounded-[6px] text-xs text-[#A94438] hover:bg-[#A94438]/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-[1240px] w-full mx-auto">
        {/* Desktop Left Sidebar (248px) */}
        <aside className="hidden lg:flex flex-col w-[248px] py-6 pr-6 shrink-0 border-r border-[#E3DDD0] space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === '/portal'
                ? location.pathname === '/portal'
                : location.pathname.startsWith(item.path)

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/portal'}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EFEADF] text-[#17323A] font-semibold'
                      : 'text-[#4A5755] hover:bg-[#EFEADF]/50 hover:text-[#17323A]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#B8864B] rounded-r-full" />
                    )}
                    <Icon className="w-4 h-4 text-[#5E7F78]" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}

          <div className="pt-8 mt-auto px-3">
            <div className="p-3 rounded-[8px] bg-[#FBF9F4] border border-[#E3DDD0] text-xs space-y-1.5">
              <div className="font-semibold text-[#17323A] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#3E7A5B]" />
                <span>Encrypted Vault</span>
              </div>
              <p className="text-[11px] text-[#6F7A78] leading-relaxed">
                Tender documents & company returns are confidential under NDA.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1120px] pb-24 lg:pb-12">
          <Outlet />

          {/* Transparent Portal Footer */}
          <div className="mt-16 pt-6 border-t border-[#E3DDD0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6F7A78] gap-2">
            <span>Demo data. Nothing is stored or sent.</span>
            <div className="flex items-center gap-4">
              <Link to="/store" className="hover:text-[#17323A]">
                Browse Store
              </Link>
              <span>·</span>
              <Link to="/contact" className="hover:text-[#17323A]">
                Contact Support
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar (64px) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E3DDD0] z-40 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile Bottom Navigation"
      >
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/portal'
              ? location.pathname === '/portal'
              : location.pathname.startsWith(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 text-xs ${
                isActive ? 'text-[#17323A] font-semibold' : 'text-[#6F7A78]'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          )
        })}

        <Link
          to="/portal/account"
          className={`flex flex-col items-center justify-center py-1 px-3 text-xs ${
            location.pathname.startsWith('/portal/account')
              ? 'text-[#17323A] font-semibold'
              : 'text-[#6F7A78]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Account</span>
        </Link>
      </nav>

      <ToastContainer />
      <FloatingGuideTrigger />
      <DemoGuideDrawer />
    </div>
  )
}
