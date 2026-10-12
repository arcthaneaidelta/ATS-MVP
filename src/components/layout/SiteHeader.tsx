import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { Button } from '../ui/Button';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SiteHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isCheckout = location.pathname === '/book';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Our Fleet', to: '/fleet' },
    { label: 'Contact', to: '/contact' },
    { label: 'Terms', to: '/terms' },
  ];

  // Simplified header for checkout
  if (isCheckout) {
    return (
      <header className="sticky top-0 z-header bg-bg/95 backdrop-blur-md border-b border-border py-3.5 px-4 sm:px-8">
        <div className="max-w-content mx-auto flex items-center justify-between">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-2 text-xs font-medium text-ink-2 bg-surface px-3 py-1.5 rounded-full border border-border">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Secure 256-bit Checkout (Demo)</span>
          </div>
          <Link
            to="/fleet"
            className="text-xs text-ink-3 hover:text-ink underline underline-offset-2 transition-colors"
          >
            Cancel & Return
          </Link>
        </div>
      </header>
    );
  }

  const isTransparent = isHome && !isScrolled;

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-header transition-all duration-200 py-4 px-4 sm:px-8',
          isTransparent
            ? 'bg-gradient-to-b from-[#141A17]/70 via-[#141A17]/30 to-transparent text-white'
            : 'bg-bg/95 backdrop-blur-md border-b border-border shadow-sh-1 text-ink'
        )}
      >
        <div className="max-w-content mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <BrandLogo inverted={isTransparent} />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors hover:text-accent relative py-1',
                    isTransparent
                      ? isActive
                        ? 'text-white font-semibold'
                        : 'text-white/80'
                      : isActive
                      ? 'text-primary font-semibold'
                      : 'text-ink-2'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/quote" className={cn(
              "text-xs font-semibold uppercase tracking-wider transition-colors hover:text-accent mr-1",
              isTransparent ? "text-white/90" : "text-ink-2"
            )}>
              Request Quote
            </Link>
            <Link to="/fleet">
              <Button
                variant={isTransparent ? 'accent' : 'primary'}
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
              >
                Book a Vehicle
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'md:hidden p-2 rounded-md transition-colors',
              isTransparent
                ? 'text-white hover:bg-white/10'
                : 'text-ink hover:bg-sand-soft'
            )}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-bg flex flex-col justify-between p-6 pt-20 animate-in fade-in-50 duration-150">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-md text-ink hover:bg-sand-soft"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="space-y-6 pt-4 text-left">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-ink-3">
              Navigation
            </div>
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl text-ink hover:text-accent transition-colors"
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl text-accent hover:text-accent-hover transition-colors"
              >
                Request a Quotation
              </NavLink>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-border">
            <Link to="/fleet" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full">
                Book a Vehicle
              </Button>
            </Link>
            <div className="flex items-center justify-between text-xs text-ink-3 pt-2">
              <span>Windhoek, Namibia</span>
              <a
                href="https://wa.me/264812345678"
                target="_blank"
                rel="noreferrer"
                className="text-accent font-medium hover:underline"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
