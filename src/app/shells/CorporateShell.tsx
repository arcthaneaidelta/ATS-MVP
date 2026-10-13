import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Wordmark } from '../../components/brand/Wordmark';
import { ProductSwitcher } from '../../components/brand/ProductSwitcher';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/brand/Footer';
import { DemoControls } from '../../components/brand/DemoControls';
import { CommandPalette } from '../../components/brand/CommandPalette';
import { useDemoStore } from '../../store/demo';
import { EditModePanel } from '../../features/corporate/EditModePanel';
import { Menu, X, Edit3, Sparkles } from 'lucide-react';

export const CorporateShell: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isEditMode, toggleEditMode } = useDemoStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Products', path: '/products' },
    { label: 'Case Studies', path: '/case-studies' },
    { label: 'Careers', path: '/careers' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink selection:bg-clay-tint">
      {/* 64px Sticky Top Navigation */}
      <header
        className={`sticky top-0 z-30 h-16 transition-all duration-200 bg-bg/95 backdrop-blur-sm ${
          scrolled ? 'border-b border-line shadow-sm' : ''
        }`}
      >
        <div className="max-w-container mx-auto h-full px-6 flex items-center justify-between">
          {/* Left: Wordmark */}
          <Link to="/" className="flex items-center gap-2 group outline-none">
            <Wordmark size="md" />
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-sans font-medium text-ink-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative py-1 hover:text-ink transition-colors ${
                    isActive ? 'text-ink font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-clay rounded-full animate-in fade-in duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <ProductSwitcher />
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/contact')}
            >
              Start a project
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <ProductSwitcher />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 text-ink hover:bg-surface rounded-md border border-line"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 sm:hidden">
          <div className="w-4/5 max-w-sm h-full bg-bg border-l border-line p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
                <Wordmark size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-ink-3 hover:text-ink rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-xl font-serif">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-clay transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-line space-y-3">
              <Button
                variant="primary"
                size="md"
                block
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/contact');
                }}
              >
                Start a project
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Outlet */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Floating Edit Mode Pill (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={toggleEditMode}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-sans font-semibold shadow-md border transition-all duration-150 active:scale-95 ${
            isEditMode
              ? 'bg-clay text-white border-clay shadow-clay/20'
              : 'bg-elevated text-ink hover:bg-surface border-line-2'
          }`}
        >
          {isEditMode ? <Sparkles className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5 text-clay" />}
          <span>{isEditMode ? 'Exit CMS Edit Mode' : 'Edit Page (CMS)'}</span>
        </button>
      </div>

      {/* CMS & SEO Drawer / Side Panel */}
      {isEditMode && <EditModePanel />}

      {/* Global Demo Controls (Bottom Left) */}
      <DemoControls />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette />
    </div>
  );
};
