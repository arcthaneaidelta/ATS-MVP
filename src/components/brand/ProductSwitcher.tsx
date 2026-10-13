import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowUpRight, GraduationCap, UtensilsCrossed, Building2 } from 'lucide-react';

export const ProductSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const products = [
    {
      name: 'BionicIQ Corporate',
      tagline: 'Brand, services & enterprise proof',
      route: '/',
      icon: <Building2 className="w-4 h-4 text-primary" />,
      accent: 'border-primary/20',
    },
    {
      name: 'BionicIQ Academy',
      tagline: 'LMS, curriculum & certification',
      route: '/academy',
      icon: <GraduationCap className="w-4 h-4 text-slate" />,
      accent: 'border-slate/30',
    },
    {
      name: 'Cirqla SaaS',
      tagline: 'Multi-tenant hospitality ordering',
      route: '/cirqla',
      icon: <UtensilsCrossed className="w-4 h-4 text-clay" />,
      accent: 'border-clay/30',
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Switch product zone"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-sans font-medium text-ink hover:bg-surface border border-line transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="w-2 h-2 rounded-full bg-clay" />
        <span>Ecosystem</span>
        <ChevronDown className={`w-3.5 h-3.5 text-ink-3 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-80 bg-elevated rounded-lg border border-line-2 shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-2.5 py-1.5 border-b border-line mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-3">
              One Brand · Three Products
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {products.map((p) => (
              <button
                key={p.route}
                type="button"
                onClick={() => {
                  navigate(p.route);
                  setIsOpen(false);
                }}
                className="w-full flex items-start gap-3 p-2 rounded-md hover:bg-surface text-left transition-colors duration-150 group border border-transparent hover:border-line"
              >
                <div className="p-2 rounded bg-bg shrink-0 group-hover:bg-elevated transition-colors border border-line/60">
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">
                      {p.name}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-ink-3 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-ink-3 truncate mt-0.5">{p.tagline}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 border-t border-line flex items-center justify-between px-2 text-[11px]">
            <button
              onClick={() => {
                navigate('/proposal');
                setIsOpen(false);
              }}
              className="text-clay hover:underline font-medium"
            >
              Proposal Companion →
            </button>
            <span className="text-ink-3 text-[10px]">Demo v1.0</span>
          </div>
        </div>
      )}
    </div>
  );
};
