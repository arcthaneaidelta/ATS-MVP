import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, CornerDownLeft, Sparkles, X } from 'lucide-react';
import { useCirqlaStore } from '../../store/cirqla';
import { useDemoStore } from '../../store/demo';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { orders } = useCirqlaStore();
  const { toggleEditMode } = useDemoStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const quickLinks = [
    { title: 'Corporate Home & Ecosystem', category: 'Corporate', route: '/' },
    { title: 'Services & Architecture Lines', category: 'Corporate', route: '/services' },
    { title: 'Products Overview', category: 'Corporate', route: '/products' },
    { title: 'Case Studies (TableFlow, MasterOps, FinGate)', category: 'Corporate', route: '/case-studies' },
    { title: 'Careers & Apply Drawer (6 Open Roles)', category: 'Corporate', route: '/careers' },
    { title: 'Contact & Lead Qualification Funnel', category: 'Corporate', route: '/contact' },
    { title: 'Insights & Technical Articles', category: 'Corporate', route: '/insights' },
    { title: 'Academy Course Catalog', category: 'Academy', route: '/academy/courses' },
    { title: 'Student Dashboard (Hira Siddiqui)', category: 'Academy', route: '/academy/app' },
    { title: 'Verified Certificate Sample (BIQ-2026-00391)', category: 'Academy', route: '/academy/verify/BIQ-2026-00391' },
    { title: 'Academy Admin Operations Console', category: 'Academy', route: '/academy/admin' },
    { title: 'Cirqla Diner QR Ordering (Table 12)', category: 'Cirqla', route: '/cirqla/scan/kiln-street?table=12' },
    { title: 'Cirqla Live Orders Kitchen Display (Central)', category: 'Cirqla', route: '/cirqla/venue/orders' },
    { title: 'Cirqla Multi-Branch Menu Manager', category: 'Cirqla', route: '/cirqla/venue/menu' },
    { title: 'Cirqla Payments & Settlement Ledger', category: 'Cirqla', route: '/cirqla/venue/payments' },
    { title: 'Cirqla Super-Admin Console', category: 'Cirqla', route: '/cirqla/platform' },
    { title: 'Proposal Companion & Interactive Blueprint', category: 'Commercials', route: '/proposal' },
    { title: 'Design System Kitchen Sink', category: 'Design System', route: '/__kit' },
  ];

  // Match orders by order number or customer name
  const matchedOrders = orders
    .filter((o) =>
      query.trim() &&
      (o.orderNumber.includes(query.trim()) ||
        o.customerName?.toLowerCase().includes(query.toLowerCase()) ||
        o.table.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 4);

  const matchedLinks = quickLinks.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase()) ||
    l.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-elevated rounded-xl border border-line-2 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="relative border-b border-line flex items-center px-4">
          <Search className="w-4 h-4 text-ink-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a screen, product, order # (e.g. 1048), or command..."
            className="w-full h-13 py-3.5 px-3 bg-transparent text-sm font-sans text-ink placeholder:text-ink-3 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-ink-3 hover:text-ink p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono text-ink-3 px-1.5 py-0.5 rounded bg-bg border border-line ml-2">
            ESC
          </span>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 text-xs font-sans space-y-1">
          {/* Matched Orders */}
          {matchedOrders.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-ink-3 tracking-wider">
                Matching Live Orders
              </div>
              {matchedOrders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => handleSelect('/cirqla/venue/orders')}
                  className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-surface text-left transition-colors border border-transparent hover:border-line"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-clay">#{ord.orderNumber}</span>
                    <span className="text-ink">Table {ord.table} · {ord.customerName}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-bg border border-line font-medium text-ink-2">
                      {ord.status}
                    </span>
                  </div>
                  <span className="font-mono text-ink-3">${ord.total.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-ink-3 tracking-wider flex items-center justify-between">
            <span>Navigation & Ecosystem</span>
            <span>{matchedLinks.length} results</span>
          </div>

          {matchedLinks.length === 0 && matchedOrders.length === 0 ? (
            <div className="p-6 text-center text-ink-3">
              No matching pages or orders found for "{query}".
            </div>
          ) : (
            matchedLinks.map((item) => (
              <button
                key={item.route}
                onClick={() => handleSelect(item.route)}
                className="w-full flex items-center justify-between p-2.5 rounded-md hover:bg-surface text-left transition-colors group border border-transparent hover:border-line"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-bg text-ink-3 border border-line">
                    {item.category}
                  </span>
                  <span className="text-ink group-hover:text-primary font-medium">
                    {item.title}
                  </span>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-ink-3 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}

          <div className="pt-2 mt-1 border-t border-line px-3 py-1.5 flex items-center justify-between text-[11px] text-ink-3">
            <button
              onClick={() => {
                toggleEditMode();
                setIsOpen(false);
              }}
              className="flex items-center gap-1.5 text-clay hover:underline font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Toggle Corporate CMS Edit Mode</span>
            </button>
            <span className="font-mono text-[10px]">Jump anywhere anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
