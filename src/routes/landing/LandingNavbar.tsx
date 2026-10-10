import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { BRAND } from '../../config/brand';
import { Button } from '../../components/ui/Button';
import clsx from 'clsx';

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Memory', href: '#problem' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Proposal & Phases', href: '#proposal' },
    { name: 'Architecture', href: '#architecture' },
    { name: 'Support Options', href: '#support' },
  ];

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 right-0 h-16 z-40 transition-all duration-200 select-none px-4 sm:px-8',
        scrolled
          ? 'bg-surface/95 border-b border-border shadow-xs text-ink-900'
          : 'bg-transparent text-dark-text'
      )}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-primary rounded-xs flex flex-col justify-center gap-0.5 px-1">
            <div className="w-full h-0.5 bg-accent rounded-full" />
            <div className="w-3/4 h-0.5 bg-accent rounded-full" />
            <div className="w-1/2 h-0.5 bg-accent rounded-full" />
          </div>
          <span className="font-display text-2xl tracking-tight leading-none font-normal">
            {BRAND.name}
          </span>
        </Link>

        {/* Center Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={clsx(
                'transition-colors',
                scrolled
                  ? 'text-ink-700 hover:text-ink-900'
                  : 'text-dark-muted hover:text-dark-text'
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/app"
            className={clsx(
              'text-xs font-medium px-3 py-1.5 transition-colors',
              scrolled
                ? 'text-ink-700 hover:text-ink-900'
                : 'text-dark-muted hover:text-dark-text'
            )}
          >
            Skip to demo
          </Link>
          <Button
            variant="accent"
            size="sm"
            onClick={() => navigate('/app')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open live demo
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={clsx(
            'md:hidden p-2 rounded-sm',
            scrolled ? 'text-ink-900' : 'text-dark-text'
          )}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-surface-elevated border-b border-border shadow-lg p-6 space-y-4 text-ink-900 text-sm">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-medium hover:text-primary py-1"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-border flex flex-col gap-2">
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/app');
              }}
            >
              Open live demo
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
