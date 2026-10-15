import React, { useState, useEffect } from 'react';
import { Search, Compass, BookOpen, User, CreditCard, Shield, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { UserRole } from '../data/types';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const setRole = useStore((s) => s.setRole);
  const bookings = useStore((s) => s.bookings);
  const buyers = useStore((s) => s.buyers);
  const quotes = useStore((s) => s.quotes);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredBookings = bookings
    .filter(
      (b) =>
        b.reference.toLowerCase().includes(query.toLowerCase()) ||
        b.tourTitle.toLowerCase().includes(query.toLowerCase()) ||
        b.buyerName.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const filteredQuotes = quotes
    .filter(
      (q) =>
        q.reference.toLowerCase().includes(query.toLowerCase()) ||
        q.tourTitle.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const handleRoleSelect = (role: UserRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
    onClose();
  };

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-meridian-text-primary/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-meridian-border bg-meridian-surface-elevated">
          <Search className="w-4 h-4 text-meridian-text-muted mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search bookings, quotes, buyers or switch roles..."
            className="w-full bg-transparent text-sm text-meridian-text-primary placeholder:text-meridian-text-muted focus:outline-none"
          />
          <button onClick={onClose} className="p-1 text-meridian-text-muted hover:text-meridian-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-3 text-xs">
          {/* Quick Role Switches */}
          <div>
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-meridian-text-muted">
              Switch Workspace Role
            </p>
            <div className="grid grid-cols-3 gap-1.5 mt-1">
              <button
                onClick={() => handleRoleSelect('buyer', '/app')}
                className="flex items-center gap-2 p-2 rounded hover:bg-meridian-surface-sunken text-left border border-transparent hover:border-meridian-border"
              >
                <Compass className="w-3.5 h-3.5 text-meridian-primary" />
                <span>Buyer Portal</span>
              </button>
              <button
                onClick={() => handleRoleSelect('admin', '/admin')}
                className="flex items-center gap-2 p-2 rounded hover:bg-meridian-surface-sunken text-left border border-transparent hover:border-meridian-border"
              >
                <Shield className="w-3.5 h-3.5 text-meridian-accent" />
                <span>Operator Admin</span>
              </button>
              <button
                onClick={() => handleRoleSelect('coordinator', '/coord/payments')}
                className="flex items-center gap-2 p-2 rounded hover:bg-meridian-surface-sunken text-left border border-transparent hover:border-meridian-border"
              >
                <CreditCard className="w-3.5 h-3.5 text-meridian-info" />
                <span>Coordinator</span>
              </button>
            </div>
          </div>

          {/* Bookings */}
          {filteredBookings.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-meridian-text-muted">
                Bookings
              </p>
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleNav(`/app/bookings/${b.id}`)}
                  className="flex items-center justify-between p-2 rounded hover:bg-meridian-surface-sunken cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-meridian-primary" />
                    <div>
                      <span className="font-semibold">{b.reference}</span> — {b.tourTitle}
                      <span className="text-meridian-text-muted ml-1.5">({b.buyerName})</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-meridian-text-muted" />
                </div>
              ))}
            </div>
          )}

          {/* Quotes */}
          {filteredQuotes.length > 0 && (
            <div>
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-meridian-text-muted">
                Quotes
              </p>
              {filteredQuotes.map((q) => (
                <div
                  key={q.id}
                  onClick={() => handleNav(`/app/requests/${q.id}`)}
                  className="flex items-center justify-between p-2 rounded hover:bg-meridian-surface-sunken cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5 text-meridian-secondary" />
                    <div>
                      <span className="font-semibold">{q.reference}</span> — {q.tourTitle} ($
                      {q.totalAmount.toLocaleString()})
                    </div>
                  </div>
                  <ArrowRight className="w-3 h-3 text-meridian-text-muted" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-meridian-border bg-meridian-surface-sunken/40 flex items-center justify-between text-[11px] text-meridian-text-muted">
          <span>Navigation shortcut</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
