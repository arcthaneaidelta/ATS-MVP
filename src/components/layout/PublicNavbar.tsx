import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/Button'
import { Lock, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react'
import { BuildMapTag } from '@/components/ui/BuildMapTag'

export const PublicNavbar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, currentUser } = useStore()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartCount = cart.length

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)

      if (currentScrollY > 200 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, mobileMenuOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Resources', path: '/resources' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-280',
          isScrolled
            ? 'h-[72px] bg-[#F6F3EC]/92 backdrop-blur-md border-b border-[#E3DDD0] shadow-sm'
            : 'h-[72px] sm:h-[80px] bg-transparent border-b border-transparent',
          isHidden && !mobileMenuOpen && '-translate-y-full'
        )}
      >
        <div className="max-w-[1240px] h-full mx-auto px-6 sm:px-10 flex items-center justify-between">
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 select-none group"
            aria-label="TenderVantage Home"
          >
            {/* TV Monogram SVG */}
            <div className="w-9 h-9 rounded-[8px] bg-[#17323A] flex items-center justify-center p-1.5 shadow-sm group-hover:bg-[#10252B] transition-colors">
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <path
                  d="M7 10h8M11 10v12"
                  stroke="#F6F3EC"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 12l3.5 8L25 9"
                  stroke="#B8864B"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-[22px] font-medium text-[#17323A] tracking-tight leading-none">
                TenderVantage
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#6F7A78] leading-tight mt-0.5">
                Botswana
              </span>
            </div>

            <BuildMapTag
              label="Header"
              wpEquivalent="Elementor Theme Builder Header"
              position="inline"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'nav-link text-[15px] font-medium transition-colors select-none',
                    isActive ? 'text-[#17323A] is-active font-semibold' : 'text-[#1B2625] hover:text-[#17323A]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Cart Icon Link */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-[#17323A] hover:bg-[#EFEADF] transition-colors"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#17323A] text-[#F6F3EC] text-[10px] font-mono font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Client Portal Link */}
            <Link
              to={currentUser?.role === 'staff' ? '/staff' : '/portal'}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#17323A] hover:text-[#B8864B] transition-colors py-1.5 px-2"
            >
              <Lock className="w-3.5 h-3.5 text-[#5E7F78]" />
              <span>{currentUser?.role === 'staff' ? 'Staff Desk' : 'Client portal'}</span>
            </Link>

            {/* Primary Action Button */}
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/store')}
              className="shadow-sm"
            >
              Browse services
            </Button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-[#17323A] hover:bg-[#EFEADF] transition-colors mr-1"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#17323A] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="h-11 px-3 rounded-[8px] flex items-center gap-1.5 text-[#17323A] hover:bg-[#EFEADF] border border-[#CFC7B6] font-semibold text-sm cursor-pointer select-none"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden flex">
          {/* Scrim */}
          <div
            className="fixed inset-0 bg-[#17323A]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Right Sheet */}
          <div className="relative ml-auto w-full max-w-[340px] h-full bg-[#F6F3EC] shadow-2xl flex flex-col p-6 border-l border-[#E3DDD0] animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-5 border-b border-[#E3DDD0]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[6px] bg-[#17323A] flex items-center justify-center p-1">
                  <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                    <path
                      d="M7 10h8M11 10v12"
                      stroke="#F6F3EC"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17 12l3.5 8L25 9"
                      stroke="#B8864B"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="font-serif text-lg font-medium text-[#17323A]">
                  TenderVantage
                </span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6F7A78] hover:bg-[#EFEADF]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-1 divide-y divide-[#E3DDD0]/50 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-serif text-2xl text-[#17323A] hover:text-[#B8864B] py-3.5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4">
                <Link
                  to={currentUser?.role === 'staff' ? '/staff' : '/portal'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-base font-semibold text-[#17323A]"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#5E7F78]" />
                    <span>{currentUser?.role === 'staff' ? 'Staff Desk' : 'Client portal'}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#6F7A78]" />
                </Link>
              </div>
            </nav>

            <div className="pt-4 border-t border-[#E3DDD0] space-y-3 pb-[env(safe-area-inset-bottom)]">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setMobileMenuOpen(false)
                  navigate('/store')
                }}
                className="w-full"
              >
                Browse services
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
