import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Activity, Menu, X, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 h-16 w-full bg-[#F6F3EE] transition-all duration-150 ${
        isScrolled ? 'border-b border-[#E2DDD3] shadow-[0_1px_2px_rgba(30,42,43,0.04)]' : ''
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#1F4B4A] flex items-center justify-center text-[#F6F3EE] shadow-[0_1px_2px_rgba(30,42,43,0.1)] group-hover:bg-[#173A39] transition-colors">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-xl font-medium tracking-tight text-[#1E2A2B]">
                Implemnt
              </span>
              <span className="text-[10px] font-mono text-[#B4643C] uppercase tracking-wider px-1 py-0.2 rounded bg-[#F3E3D8] border border-[#E6C7B6]">
                Trace
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            to="/#diagnosis"
            className="text-[#4A5757] hover:text-[#1F4B4A] transition-colors font-medium"
          >
            Diagnosis Method
          </Link>
          <Link
            to="/app/trace"
            className={`transition-colors font-medium ${
              location.pathname.startsWith('/app')
                ? 'text-[#1F4B4A] font-semibold'
                : 'text-[#4A5757] hover:text-[#1F4B4A]'
            }`}
          >
            Interactive Demo
          </Link>
          <Link
            to="/app/findings"
            className={`transition-colors font-medium ${
              location.pathname === '/app/findings'
                ? 'text-[#1F4B4A] font-semibold'
                : 'text-[#4A5757] hover:text-[#1F4B4A]'
            }`}
          >
            Findings Report
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/app/trace">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Demo
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#4A5757] hover:text-[#1E2A2B] rounded-lg hover:bg-[#E3EDEB]"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2DDD3] bg-[#FBF9F6] px-4 py-4 flex flex-col gap-3 shadow-[0_8px_16px_rgba(30,42,43,0.06)] animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-sm text-[#1E2A2B] font-medium hover:bg-[#E3EDEB]"
          >
            Diagnosis Method
          </Link>
          <Link
            to="/app/trace"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-sm text-[#1F4B4A] font-semibold bg-[#E3EDEB]"
          >
            Interactive Demo (/app/trace)
          </Link>
          <Link
            to="/app/findings"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded text-sm text-[#1E2A2B] font-medium hover:bg-[#E3EDEB]"
          >
            Findings Report
          </Link>
          <div className="pt-2 border-t border-[#E2DDD3] flex gap-2">
            <Link to="/app/trace" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Launch Diagnostic Demo
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
