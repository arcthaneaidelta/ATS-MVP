import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import { MEETINGS_DATA } from '../../data/meetings';
import {
  Search,
  Activity,
  CalendarX2,
  GitFork,
  Sparkles,
  ClipboardList,
  CheckSquare,
  BookOpen,
  RotateCcw,
  ArrowRight,
  Video
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setSelectedMeetingId,
    resetAll,
    addToast
  } = useDemoStore();
  const [query, setQuery] = useState('');

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navItems = [
    { label: 'Pipeline Trace (Hero Diagnostic)', path: '/app/trace', icon: Activity, group: 'Navigation' },
    { label: 'Missed Meetings Forensics', path: '/app/meetings', icon: CalendarX2, group: 'Navigation' },
    { label: 'Delivery Funnel Reconciliation', path: '/app/delivery', icon: GitFork, group: 'Navigation' },
    { label: 'Signal Lab (Keyword vs Context)', path: '/app/signals', icon: Sparkles, group: 'Navigation' },
    { label: 'Diagnostic Findings Report', path: '/app/findings', icon: ClipboardList, group: 'Navigation' },
    { label: 'Scope Gate & Milestones', path: '/app/scope', icon: CheckSquare, group: 'Navigation' },
    { label: 'Operator Handoff Runbook', path: '/app/handoff', icon: BookOpen, group: 'Navigation' },
    { label: 'Diagnostic Overview KPIs', path: '/app', icon: Activity, group: 'Navigation' }
  ];

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMeetings = MEETINGS_DATA.filter(
    (m) =>
      m.id.toLowerCase().includes(query.toLowerCase()) ||
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.account.toLowerCase().includes(query.toLowerCase()) ||
      (m.causeCategory && m.causeCategory.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const handleSelectNav = (path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const handleSelectMeeting = (id: string) => {
    setSelectedMeetingId(id);
    navigate('/app/trace');
    setCommandPaletteOpen(false);
    setQuery('');
    addToast({
      type: 'info',
      title: `Loaded ${id}`,
      message: 'Viewing pipeline trace for this meeting'
    });
  };

  const handleReset = () => {
    resetAll();
    setCommandPaletteOpen(false);
    addToast({
      type: 'success',
      title: 'Demo State Reset',
      message: 'Restored initial scope selections and meeting filters.'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E2A2B]/40 transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] shadow-[0_16px_40px_rgba(30,42,43,0.18)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E2DDD3] bg-[#FBF9F6]">
          <Search className="w-5 h-5 text-[#7B8786] shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a screen name, meeting ID, or account..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#1E2A2B] placeholder-[#7B8786] text-sm focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono text-[#7B8786] bg-[#E2DDD3]/60 rounded border border-[#CFC8BB]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {/* Quick Actions */}
          {query === '' && (
            <div className="mb-2">
              <span className="px-3 py-1 text-[11px] font-semibold text-[#7B8786] uppercase tracking-wider block">
                Quick Actions
              </span>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#A8433A] hover:bg-[#F5DEDA] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Demo State (Scope & Filters)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          )}

          {/* Navigation Items */}
          {filteredNav.length > 0 && (
            <div className="mb-2">
              <span className="px-3 py-1 text-[11px] font-semibold text-[#7B8786] uppercase tracking-wider block">
                Screens
              </span>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleSelectNav(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#1E2A2B] hover:bg-[#E3EDEB] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#1F4B4A] shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7B8786] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Meetings Items */}
          {filteredMeetings.length > 0 && (
            <div>
              <span className="px-3 py-1 text-[11px] font-semibold text-[#7B8786] uppercase tracking-wider block">
                Meetings
              </span>
              {filteredMeetings.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleSelectMeeting(m.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-[#1E2A2B] hover:bg-[#E3EDEB] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <Video className="w-4 h-4 text-[#7B8786] shrink-0" />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#1F4B4A]">{m.id}</span>
                        <span className="text-xs text-[#1E2A2B] font-medium">{m.title}</span>
                      </div>
                      <span className="text-[11px] text-[#7B8786]">
                        {m.account} · {m.outcome}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#1F4B4A] opacity-0 group-hover:opacity-100 transition-opacity">
                    Trace →
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredNav.length === 0 && filteredMeetings.length === 0 && (
            <div className="py-8 text-center text-sm text-[#7B8786]">
              No results found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#FBF9F6] border-t border-[#E2DDD3] text-[11px] text-[#7B8786] flex items-center justify-between">
          <span>Use ⌘K / Ctrl+K anytime</span>
          <span>Sample Diagnostic Data</span>
        </div>
      </div>
    </div>
  );
};
