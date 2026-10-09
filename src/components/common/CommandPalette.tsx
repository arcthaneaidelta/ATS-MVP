import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { 
  Search, LayoutDashboard, GitPullRequest, Users, Calendar, 
  Workflow, Zap, PhoneCall, BarChart3, Settings, ShieldCheck, 
  FileText, Home, ArrowRight, CornerDownLeft 
} from 'lucide-react';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { contacts } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const screens = [
    { name: 'Funnel Landing Page', path: '/', category: 'Public Funnel', icon: <Home className="w-4 h-4" /> },
    { name: 'Intake Survey (/start)', path: '/start', category: 'Public Funnel', icon: <ArrowRight className="w-4 h-4" /> },
    { name: 'Consultation Booking (/book)', path: '/book', category: 'Public Funnel', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Operator Overview', path: '/studio', category: 'Operator Console', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Pipeline Kanban', path: '/studio/pipeline', category: 'Operator Console', icon: <GitPullRequest className="w-4 h-4" /> },
    { name: 'Contacts Database', path: '/studio/contacts', category: 'Operator Console', icon: <Users className="w-4 h-4" /> },
    { name: 'Workflow Visualizer', path: '/studio/workflows', category: 'Operator Console', icon: <Workflow className="w-4 h-4" /> },
    { name: 'Workflow Simulator (Stop/Change Rules)', path: '/studio/simulator', category: 'Operator Console', icon: <Zap className="w-4 h-4" /> },
    { name: 'Voice Agent (Retell AI + Twilio)', path: '/studio/voice', category: 'Operator Console', icon: <PhoneCall className="w-4 h-4" /> },
    { name: 'Calendar & Availability', path: '/studio/calendar', category: 'Operator Console', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Analytics & Reports', path: '/studio/reports', category: 'Operator Console', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Setup & Go-Live Readiness', path: '/studio/setup', category: 'Operator Console', icon: <Settings className="w-4 h-4" /> },
    { name: 'Handoff Hub & QA Log', path: '/studio/handoff', category: 'Operator Console', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Proposal & Scope ($1,000)', path: '/proposal', category: 'Proposal', icon: <FileText className="w-4 h-4" /> },
  ];

  const filteredScreens = screens.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) || 
    s.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedContacts = contacts.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase()) ||
    c.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 4);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-[#1F2420]/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-surface-elevated rounded-modal shadow-sh-3 border border-border overflow-hidden">
        {/* Search input */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface">
          <Search className="w-4 h-4 text-text-muted shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a screen name, contact, or shortcut..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
          />
          <kbd className="hidden sm:inline text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sunken border border-border text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {/* Matched Contacts */}
          {matchedContacts.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                Contacts
              </div>
              <div className="space-y-1 mt-1">
                {matchedContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelect('/studio/contacts')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-input text-left text-xs hover:bg-sunken text-text transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-primary-soft text-primary font-medium flex items-center justify-center text-[10px]">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{contact.firstName} {contact.lastName}</div>
                        <div className="text-[11px] text-text-muted">{contact.email} · {contact.tags.slice(0, 2).join(', ')}</div>
                      </div>
                    </div>
                    <CornerDownLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screens */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Navigation
            </div>
            <div className="space-y-1 mt-1">
              {filteredScreens.map((screen) => (
                <button
                  key={screen.path}
                  onClick={() => handleSelect(screen.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-input text-left text-xs hover:bg-sunken text-text transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-text-muted group-hover:text-primary transition-colors">
                      {screen.icon}
                    </span>
                    <span className="font-medium">{screen.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sunken text-text-muted">
                      {screen.category}
                    </span>
                  </div>
                  <CornerDownLeft className="w-3.5 h-3.5 text-text-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-sunken border-t border-border flex items-center justify-between text-[11px] text-text-muted">
          <span>Navigate with arrows or click to select</span>
          <span>Journey Studio v1.0</span>
        </div>
      </div>
    </div>
  );
};
