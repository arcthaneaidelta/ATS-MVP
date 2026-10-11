import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[72px] transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FBF9F5] border-b border-[#DDD8CD] shadow-[0_1px_2px_rgba(27,36,32,0.05)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] h-full mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-[#2C4A3E] relative flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-5 h-[1.5px] bg-[#2C4A3E] -mt-1" />
          </div>
          <span className="font-display font-medium text-2xl tracking-tight text-[#1B2420]">
            Meridian
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A5650]">
          <Link
            to="/app/pools"
            className="hover:text-[#1B2420] transition-colors"
          >
            Pools
          </Link>
          <a
            href="#how-it-works"
            className="hover:text-[#1B2420] transition-colors"
          >
            How it works
          </a>
          <Link
            to="/verify"
            className="hover:text-[#1B2420] transition-colors"
          >
            Fairness Verifier
          </Link>
          <Link
            to="/trust"
            className="hover:text-[#1B2420] transition-colors"
          >
            Trust Center
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-[#4A5650] hover:text-[#1B2420] transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/login')}
          >
            Get started
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 text-[#1B2420] rounded-md hover:bg-[#EDE9E1] transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Full-Screen Sheet */}
      {isMobileOpen && (
        <div className="fixed inset-0 top-[72px] bg-[#F5F2EC] z-50 p-6 flex flex-col justify-between md:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-6 pt-4 text-left">
            <Link
              to="/app/pools"
              onClick={() => setIsMobileOpen(false)}
              className="text-2xl font-display font-medium text-[#1B2420] py-2 border-b border-[#DDD8CD]"
            >
              Browse Pools
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setIsMobileOpen(false)}
              className="text-2xl font-display font-medium text-[#1B2420] py-2 border-b border-[#DDD8CD]"
            >
              How it works
            </a>
            <Link
              to="/verify"
              onClick={() => setIsMobileOpen(false)}
              className="text-2xl font-display font-medium text-[#1B2420] py-2 border-b border-[#DDD8CD]"
            >
              Public Verifier
            </Link>
            <Link
              to="/trust"
              onClick={() => setIsMobileOpen(false)}
              className="text-2xl font-display font-medium text-[#1B2420] py-2 border-b border-[#DDD8CD]"
            >
              Trust Center
            </Link>
          </div>

          <div className="flex flex-col gap-3 pb-8">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                setIsMobileOpen(false);
                navigate('/login');
              }}
            >
              Get started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => {
                setIsMobileOpen(false);
                navigate('/login');
              }}
            >
              Sign in with Email
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
