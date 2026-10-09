import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '../../store/demoStore';
import {
  Search,
  Kanban,
  MessageSquare,
  Users,
  Zap,
  Calendar,
  Share2,
  BarChart3,
  Settings,
  X,
  ArrowRight,
  User,
} from 'lucide-react';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { leads, setSelectedLeadId } = useDemoStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pages = [
    { label: 'Command Center', path: '/app', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Speed-to-Lead Simulator', path: '/app/speed-to-lead', icon: <Zap className="w-4 h-4 text-[#B4684A]" /> },
    { label: 'Sales Pipeline (Kanban)', path: '/app/pipeline', icon: <Kanban className="w-4 h-4" /> },
    { label: 'All Leads Directory', path: '/app/leads', icon: <Users className="w-4 h-4" /> },
    { label: 'Unified Conversations Inbox', path: '/app/conversations', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Automation Workflows & Scrubber', path: '/app/workflows', icon: <Zap className="w-4 h-4" /> },
    { label: 'Email & SMS Campaigns', path: '/app/campaigns', icon: <MessageSquare className="w-4 h-4" /> },
    { label: 'Social Planner & Comment Bot', path: '/app/social', icon: <Share2 className="w-4 h-4" /> },
    { label: 'Tours & Appointments Calendar', path: '/app/calendar', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Reports & Attribution', path: '/app/reports', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Settings & Round-Robin Routing', path: '/app/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const filteredPages = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = query.trim()
    ? leads
        .filter(
          (l) =>
            l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.communityName.toLowerCase().includes(query.toLowerCase()) ||
            (l.planName && l.planName.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-start justify-center pt-20 p-4 bg-[#1F2A27]/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FBF9F4] rounded-[16px] border border-[#C5BCA9] shadow-[0_16px_40px_rgba(31,42,39,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#DDD6C8] flex items-center gap-3 bg-white">
          <Search className="w-4 h-4 text-[#79827D]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, floor plans, or jump to any page..."
            className="flex-1 text-xs text-[#1F2A27] placeholder:text-[#79827D] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-[11px] font-mono text-[#79827D] bg-[#EDE8DD] px-1.5 py-0.5 rounded border border-[#DDD6C8]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {/* Matched Leads */}
          {filteredLeads.length > 0 && (
            <div className="mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D] px-2 py-1 block">
                Leads & Buyers
              </span>
              {filteredLeads.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    setSelectedLeadId(l.id);
                    navigate('/app/pipeline');
                    onClose();
                  }}
                  className="p-2.5 rounded-md hover:bg-[#EDE8DD] flex items-center justify-between text-xs cursor-pointer text-[#1F2A27]"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#B4684A]" />
                    <span className="font-semibold">{l.name}</span>
                    <span className="text-[11px] text-[#79827D]">({l.communityName})</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#4C7A57] bg-[#E3EEE4] px-2 py-0.5 rounded">
                    {l.stage.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Pages */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D] px-2 py-1 block">
              Pages & Workspaces
            </span>
            {filteredPages.map((page) => (
              <div
                key={page.path}
                onClick={() => {
                  navigate(page.path);
                  onClose();
                }}
                className="p-2.5 rounded-md hover:bg-[#EDE8DD] flex items-center justify-between text-xs cursor-pointer text-[#1F2A27]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#79827D]">{page.icon}</span>
                  <span className="font-medium">{page.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#79827D]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
