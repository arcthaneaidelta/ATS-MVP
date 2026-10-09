import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BRAND } from '../../data/brand';
import { Button } from '../ui/Button';
import { PhoneCall, Menu, X, ArrowRight } from 'lucide-react';

export const FunnelNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '/#work' },
    { label: 'Process', href: '/#process' },
    { label: 'Studio', href: '/#studio' },
    { label: 'FAQ', href: '/#faq' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(href.replace('/', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(href.replace('/', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-base ${
        scrolled
          ? 'bg-surface/95 backdrop-blur-sm border-b border-border shadow-sh-1 py-3.5'
          : 'bg-bg/90 backdrop-blur-sm border-b border-border/40 py-5'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div 
          onClick={() => navigate('/')}
          className="cursor-pointer flex items-baseline gap-2 group select-none"
        >
          <span className="font-serif text-2xl tracking-tight text-text font-medium group-hover:text-primary transition-colors">
            {BRAND.name}
          </span>
          <span className="text-[11px] font-semibold text-text-muted tracking-[0.14em] uppercase hidden sm:inline">
            {BRAND.tagline}
          </span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleLinkClick(link.href)}
              className="text-sm font-medium text-text-2 hover:text-text transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary hover:after:w-full after:transition-all"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-5">
          <a
            href={`tel:${BRAND.phoneRaw}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-2 hover:text-primary transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-accent" />
            <span>{BRAND.phone}</span>
          </a>

          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/start')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Plan my consultation
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/start')}
            className="px-2.5 py-1.5 text-xs sm:hidden"
          >
            Book Free Consult
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-text hover:bg-sunken rounded-input"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-6 py-6 space-y-4 animate-in fade-in-50 duration-fast">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="text-left text-base font-medium text-text py-1"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href={`tel:${BRAND.phoneRaw}`}
              className="flex items-center gap-2 text-sm font-medium text-text-2"
            >
              <PhoneCall className="w-4 h-4 text-accent" />
              <span>{BRAND.phone}</span>
            </a>
            <Button
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/start');
              }}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Plan my consultation
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
