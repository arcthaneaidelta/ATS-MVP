import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'System Architecture', path: '/system' },
    { label: 'Lead Funnels', path: '/funnels' },
    { label: 'Team Academy', path: '/academy' },
    { label: 'US Compliance', path: '/compliance' },
    { label: 'Launch Plan', path: '/start' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#F6F3EC]/95 backdrop-blur-xs border-b border-[#DDD6C8] shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[8px] bg-[#2F4A3F] text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#1F2A27]">
              Groundwork
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider text-[#79827D] font-mono border-l border-[#DDD6C8] pl-2">
              For Alder & Stone
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive ? 'text-[#1F2A27]' : 'text-[#4A5550] hover:text-[#1F2A27]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B4684A] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/app">
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Try the Live System
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/app">
            <Button variant="primary" size="sm">
              Live App
            </Button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1F2A27] hover:bg-[#EDE8DD] rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF9F4] border-b border-[#DDD6C8] px-6 py-5 space-y-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-[#1F2A27] hover:text-[#B4684A]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#DDD6C8]">
            <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Enter Live System (/app)
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
