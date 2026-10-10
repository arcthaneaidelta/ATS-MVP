import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, FileText, ShoppingCart, Users, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { matchPartQuery } from '../../lib/normalizer';
import { PartNumber, Badge } from '../ui/Badge';
import { modalScale } from '../../styles/motion';

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, parts, quotations, orders } = useStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  // Search logic
  const matchedParts = parts
    .map((p) => {
      const match = query.trim() ? matchPartQuery(p, query) : null;
      return { part: p, match };
    })
    .filter((item) => (query.trim() ? item.match !== null : true))
    .slice(0, 6);

  const matchedQuotes = quotations
    .filter((q) =>
      query.trim()
        ? q.id.toLowerCase().includes(query.toLowerCase()) ||
          q.customer.toLowerCase().includes(query.toLowerCase())
        : true
    )
    .slice(0, 3);

  const matchedOrders = orders
    .filter((o) =>
      query.trim()
        ? o.id.toLowerCase().includes(query.toLowerCase()) ||
          o.counterparty.toLowerCase().includes(query.toLowerCase())
        : true
    )
    .slice(0, 3);

  const totalResults = matchedParts.length + matchedQuotes.length + matchedOrders.length;

  const handleSelect = (type: 'part' | 'quote' | 'order', id: string) => {
    setCommandPaletteOpen(false);
    if (type === 'part') navigate(`/app/parts?part=${id}`);
    else if (type === 'quote') navigate(`/app/rfq/${id}`);
    else if (type === 'order') navigate(`/app/orders?order=${id}`);
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink-900/40"
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Modal Card */}
          <motion.div
            variants={modalScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-surface-elevated rounded-lg shadow-lg border border-border overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface">
              <Search className="w-4 h-4 text-ink-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search any part number, OEM ref, quote, or customer... (e.g. SDV-4471-023)"
                className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none font-mono"
              />
              <span className="text-[10px] uppercase font-mono text-ink-500 bg-surface-sunken px-1.5 py-0.5 rounded-xs border border-border shrink-0">
                ESC to close
              </span>
            </div>

            {/* Content Results */}
            <div className="max-h-96 overflow-y-auto p-2 divide-y divide-border/60">
              {/* Parts Group */}
              {matchedParts.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-ink-500 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-primary" />
                    <span>Parts Master (Multi-OEM Resolution)</span>
                  </div>
                  {matchedParts.map(({ part, match }) => (
                    <div
                      key={part.id}
                      onClick={() => handleSelect('part', part.id)}
                      className="px-3 py-2.5 rounded-sm hover:bg-surface-sunken/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <PartNumber value={part.id} className="font-semibold text-primary" />
                        <div>
                          <p className="text-ink-900 font-medium">{part.description}</p>
                          {match?.matchType === 'alternate' && (
                            <span className="text-[11px] text-accent font-mono flex items-center gap-1 mt-0.5">
                              <span>Matched via {match.oemName} reference:</span>
                              <strong>{match.matchedNumber}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="neutral" size="sm">
                          {part.category}
                        </Badge>
                        <ArrowRight className="w-3.5 h-3.5 text-ink-300" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quotations Group */}
              {matchedQuotes.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-ink-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-secondary" />
                    <span>Quotations</span>
                  </div>
                  {matchedQuotes.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => handleSelect('quote', q.id)}
                      className="px-3 py-2.5 rounded-sm hover:bg-surface-sunken/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-ink-900">{q.id}</span>
                        <span className="text-ink-700">{q.customer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="neutral" size="sm">
                          {q.status}
                        </Badge>
                        <span className="font-mono text-ink-500">USD {q.total.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Orders Group */}
              {matchedOrders.length > 0 && (
                <div className="py-2">
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-ink-500 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-success" />
                    <span>Customer & Supplier Orders</span>
                  </div>
                  {matchedOrders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => handleSelect('order', o.id)}
                      className="px-3 py-2.5 rounded-sm hover:bg-surface-sunken/80 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-ink-900">{o.id}</span>
                        <span className="text-ink-700">{o.counterparty}</span>
                      </div>
                      <Badge variant={o.fulfillmentStatus === 'Delivered' ? 'success' : 'warning'} size="sm">
                        {o.fulfillmentStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {totalResults === 0 && (
                <div className="py-8 text-center text-ink-500 text-xs">
                  No matching parts, quotations, or orders found for '{query}'.
                </div>
              )}
            </div>

            {/* Bottom Keyboard Nav Cue */}
            <div className="px-4 py-2 border-t border-border bg-surface-sunken/60 flex items-center justify-between text-[11px] text-ink-500">
              <span>ProTip: Search any competitor or OEM part number directly</span>
              <div className="flex items-center gap-2 font-mono text-[10.5px]">
                <span className="flex items-center gap-0.5">
                  <CornerDownLeft className="w-3 h-3" /> Select
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
