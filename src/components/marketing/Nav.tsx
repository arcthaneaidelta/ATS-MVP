import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Menu } from 'lucide-react';

export interface NavProps {
  onTryAppClick?: () => void;
}

export function Nav({ onTryAppClick }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-nav h-16 transition-all duration-fast select-none ${
          scrolled
            ? 'bg-bg/85 backdrop-blur-md border-b border-line shadow-1'
            : 'bg-transparent'
        }`}
      >
        <div className="container-page h-full flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-ink hover:opacity-90 transition-opacity focus-visible:outline-none"
          >
            <span className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-display font-medium text-xl tracking-tight">
              Save Me
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-2">
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-ink transition-colors"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('your-data')}
              className="hover:text-ink transition-colors"
            >
              Your data
            </button>
            <Link
              to="/plan"
              className="hover:text-ink transition-colors"
            >
              Build plan
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={onTryAppClick}
            >
              Try the app
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={onTryAppClick}
              className="text-xs px-3 h-8"
            >
              Try app
            </Button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 text-ink-2 hover:text-ink"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Sheet Menu */}
      <Sheet
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Navigation"
      >
        <div className="space-y-3 py-2 text-base font-medium">
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="w-full text-left p-3 rounded-md hover:bg-surface-2 transition-colors block text-ink"
          >
            How it works
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('your-data')}
            className="w-full text-left p-3 rounded-md hover:bg-surface-2 transition-colors block text-ink"
          >
            Your data
          </button>
          <Link
            to="/plan"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full text-left p-3 rounded-md hover:bg-surface-2 transition-colors block text-ink"
          >
            Build plan
          </Link>
          <div className="pt-4">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onTryAppClick) onTryAppClick();
              }}
            >
              Open app prototype
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}
