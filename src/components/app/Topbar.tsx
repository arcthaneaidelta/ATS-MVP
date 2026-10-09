import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDemoStore } from '../../store/demoStore';
import { UserRole } from '../../types';
import {
  Search,
  Bell,
  Home,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

export const Topbar: React.FC<{ onOpenCommandPalette: () => void }> = ({
  onOpenCommandPalette,
}) => {
  const location = useLocation();
  const {
    currentUserRole,
    setUserRole,
    selectedCommunity,
    setSelectedCommunity,
    complianceGuardActive,
  } = useDemoStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Generate breadcrumb from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageTitle =
    pathParts.length > 1
      ? pathParts[1].replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : 'Command Center';

  const roles: Array<{ id: UserRole; name: string; title: string; initials: string }> = [
    { id: 'owner', name: 'Robert Alder', title: 'Owner & Principal Builder', initials: 'RA' },
    { id: 'osc', name: 'Dana Whitfield', title: 'Lead Online Sales Counselor', initials: 'DW' },
    { id: 'agent', name: 'Priya Raman', title: 'Community Sales Agent (Harlow Creek)', initials: 'PR' },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentUserRole) || roles[0];

  const notifications = [
    { title: 'High Intent Alert', text: 'Kevin Patel opened pricing lookbook 3× in Mint Hill', time: '12m ago' },
    { title: 'Tour Scheduled', text: 'Marcus & Elena Reyes confirmed Saturday 11:00 AM with Priya', time: '25m ago' },
    { title: 'Workflow Notice', text: '90-Day Nurture enrolled Samantha Ortiz (Day 28 SMS sent)', time: '1h ago' },
  ];

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#FBF9F4] border-b border-[#DDD6C8] flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Breadcrumbs & Community Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Link to="/app" className="text-[#79827D] hover:text-[#1F2A27]">
            App
          </Link>
          <span className="text-[#DDD6C8]">/</span>
          <span className="font-semibold text-[#1F2A27]">{pageTitle}</span>
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-[#DDD6C8] mx-1" />

        {/* Community Switcher */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <Building2 className="w-3.5 h-3.5 text-[#79827D]" />
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="bg-transparent font-medium text-[#1F2A27] focus:outline-none cursor-pointer text-xs"
          >
            <option value="all">All Communities (3 Active)</option>
            <option value="harlow-creek">Harlow Creek (Fort Mill)</option>
            <option value="marrow-ridge">Marrow Ridge (Huntersville)</option>
            <option value="larkin-meadows">Larkin Meadows (Indian Trail)</option>
            <option value="custom-builds">Custom & On-Your-Lot</option>
          </select>
        </div>
      </div>

      {/* Right: Search, Notifications, Role Switcher (WOW #7), Back to Pitch */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search trigger (⌘K) */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 text-xs text-[#79827D] bg-[#F6F3EC] hover:bg-[#EDE8DD] px-2.5 py-1.5 rounded-[8px] border border-[#DDD6C8] transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search (⌘K)</span>
          <kbd className="hidden sm:inline font-mono text-[10px] bg-white px-1 rounded border border-[#DDD6C8]">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-1.5 text-[#79827D] hover:text-[#1F2A27] hover:bg-[#EDE8DD] rounded-full relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B4684A]" />
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FBF9F4] rounded-[14px] border border-[#C5BCA9] shadow-[0_16px_40px_rgba(31,42,39,0.14)] p-3 space-y-2 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDE8DD]">
                <span className="text-xs font-semibold text-[#1F2A27]">Recent Activity Alerts</span>
                <span className="text-[10px] font-mono text-[#4C7A57]">3 New</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className="p-2 rounded bg-white border border-[#DDD6C8] text-xs">
                    <div className="flex justify-between items-center text-[10px] text-[#79827D] mb-0.5">
                      <span className="font-semibold text-[#B4684A]">{n.title}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-[#1F2A27] leading-tight">{n.text}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setNotifDropdownOpen(false)}
                className="w-full text-center text-[11px] text-[#79827D] hover:text-[#1F2A27] pt-1"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Role Switcher (WOW Feature #7) */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-[8px] hover:bg-[#EDE8DD] transition-colors text-left"
          >
            <Avatar initials={currentRoleObj.initials} size="sm" />
            <div className="hidden lg:block min-w-0">
              <div className="text-xs font-semibold text-[#1F2A27] leading-tight truncate">
                {currentRoleObj.name}
              </div>
              <div className="text-[10px] text-[#79827D] truncate">
                Role: <span className="capitalize text-[#2F4A3F] font-semibold">{currentUserRole}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#79827D]" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#FBF9F4] rounded-[14px] border border-[#C5BCA9] shadow-[0_16px_40px_rgba(31,42,39,0.14)] p-2 z-50 animate-in fade-in duration-150">
              <div className="p-2 border-b border-[#EDE8DD] mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D]">
                  Switch Active Role (WOW Demo #7)
                </span>
                <p className="text-[11px] text-[#4A5550] mt-0.5">
                  See the exact workspace tailored for each staff member:
                </p>
              </div>

              {roles.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    setUserRole(r.id);
                    setRoleDropdownOpen(false);
                  }}
                  className={`p-2.5 rounded-md flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    currentUserRole === r.id
                      ? 'bg-[#E0E8E3] text-[#2F4A3F] font-semibold'
                      : 'hover:bg-[#EDE8DD] text-[#1F2A27]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar initials={r.initials} size="sm" />
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-[10px] text-[#79827D]">{r.title}</div>
                    </div>
                  </div>
                  {currentUserRole === r.id && <Check className="w-4 h-4 text-[#4C7A57]" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Proposal Site link */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-1 text-xs text-[#2F4A3F] hover:text-[#1F2A27] bg-[#E0E8E3] hover:bg-[#C5D5CC] px-2.5 py-1.5 rounded-[8px] border border-[#C5D5CC] font-medium transition-colors"
        >
          <span>Proposal Site</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </header>
  );
};
