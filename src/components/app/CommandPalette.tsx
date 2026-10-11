import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Search, Layers, ShieldCheck, CheckCircle2, Wallet, Plus, X } from 'lucide-react';

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onOpenAddFunds: () => void;
}> = ({ isOpen, onClose, onOpenAddFunds }) => {
  const navigate = useNavigate();
  const { pools, draws } = useAppStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPools = pools.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDraws = draws.filter((d) =>
    d.poolName.toLowerCase().includes(query.toLowerCase()) ||
    d.id.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[85] flex items-start justify-center pt-20 p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B2420]/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#DDD8CD] rounded-lg shadow-[0_20px_48px_rgba(27,36,32,0.14)] overflow-hidden z-10 animate-in fade-in zoom-in-95 text-left">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#DDD8CD] bg-[#FBF9F5]">
          <Search className="w-4 h-4 text-[#7C867F]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pools, draws, destinations, or actions..."
            className="w-full bg-transparent text-sm text-[#1B2420] placeholder:text-[#7C867F] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#7C867F] hover:text-[#1B2420] rounded hover:bg-[#EDE9E1] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#DDD8CD]/40">
          {/* Quick Actions */}
          <div className="py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C867F] px-3 mb-1 block">
              Quick Actions
            </span>
            <button
              type="button"
              onClick={() => handleSelect(onOpenAddFunds)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded hover:bg-[#EDE9E1] text-[#1B2420] transition-colors cursor-pointer text-left"
            >
              <Plus className="w-4 h-4 text-[#2C4A3E]" />
              <span>Simulate / Add funds to sub-wallet</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelect(() => navigate('/trust'))}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded hover:bg-[#EDE9E1] text-[#1B2420] transition-colors cursor-pointer text-left"
            >
              <ShieldCheck className="w-4 h-4 text-[#B08A4E]" />
              <span>Open Trust Center & Architecture Diagram</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelect(() => navigate('/verify'))}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs rounded hover:bg-[#EDE9E1] text-[#1B2420] transition-colors cursor-pointer text-left"
            >
              <CheckCircle2 className="w-4 h-4 text-[#3E7D5A]" />
              <span>Public Draw Modulo Verifier</span>
            </button>
          </div>

          {/* Pools */}
          <div className="py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C867F] px-3 mb-1 block">
              Pools
            </span>
            {filteredPools.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(() => navigate(`/app/pools/${p.id}`))}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#EDE9E1] text-[#1B2420] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#2C4A3E]" />
                  <span>{p.name}</span>
                </div>
                <span className="font-mono text-[#7C867F]">${p.entryFee} entry</span>
              </button>
            ))}
          </div>

          {/* Draws */}
          <div className="py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C867F] px-3 mb-1 block">
              Historical Draws
            </span>
            {filteredDraws.slice(0, 3).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelect(() => navigate(`/app/draws/${d.id}`))}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded hover:bg-[#EDE9E1] text-[#1B2420] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#3E7D5A]" />
                  <span>{d.poolName}</span>
                </div>
                <span className="font-mono text-[#B08A4E]">Winner #{d.winningEntryNumber}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-[#FBF9F5] border-t border-[#DDD8CD] text-[11px] text-[#7C867F] flex items-center justify-between">
          <span>Use ⌘K or Ctrl+K anytime</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
