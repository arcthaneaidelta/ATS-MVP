import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDemoStore } from '../../store/demoStore';
import {
  LayoutDashboard,
  Zap,
  Kanban,
  Users,
  MessageSquare,
  Calendar,
  Workflow,
  Mail,
  Share2,
  Star,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { leads } = useDemoStore();

  const newLeadsCount = leads.filter((l) => l.stage === 'new').length;

  const navGroups = [
    {
      label: 'Today',
      items: [
        { label: 'Command Center', path: '/app', icon: <LayoutDashboard className="w-4 h-4" /> },
        {
          label: 'Speed-to-Lead',
          path: '/app/speed-to-lead',
          icon: <Zap className="w-4 h-4 text-[#B4684A]" />,
          badge: 'SLA <7s',
        },
      ],
    },
    {
      label: 'Sell',
      items: [
        {
          label: 'Pipeline (Kanban)',
          path: '/app/pipeline',
          icon: <Kanban className="w-4 h-4" />,
          count: leads.length,
        },
        {
          label: 'Leads Directory',
          path: '/app/leads',
          icon: <Users className="w-4 h-4" />,
          badge: newLeadsCount > 0 ? `${newLeadsCount} New` : undefined,
        },
        {
          label: 'Unified Inbox',
          path: '/app/conversations',
          icon: <MessageSquare className="w-4 h-4" />,
          count: 3,
        },
        { label: 'Tours & Calendar', path: '/app/calendar', icon: <Calendar className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Automate',
      items: [
        { label: 'Workflows & Scrubber', path: '/app/workflows', icon: <Workflow className="w-4 h-4" /> },
        { label: 'Campaigns & Templates', path: '/app/campaigns', icon: <Mail className="w-4 h-4" /> },
        { label: 'Social Planner', path: '/app/social', icon: <Share2 className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Grow',
      items: [
        { label: 'Reputation & Reviews', path: '/app/reputation', icon: <Star className="w-4 h-4" /> },
        { label: 'Attribution & Reports', path: '/app/reports', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      label: 'System',
      items: [
        { label: 'Settings & Routing', path: '/app/settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#FBF9F4] border-r border-[#DDD6C8] transition-all duration-200 z-30 shrink-0 select-none ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Brand & Sub-Account Header */}
      <div className="h-16 px-4 border-b border-[#DDD6C8] flex items-center justify-between bg-[#F6F3EC]">
        {!collapsed ? (
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-[7px] bg-[#2F4A3F] text-white flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-base font-semibold text-[#1F2A27] truncate leading-tight">
                Groundwork
              </h2>
              <p className="text-[10px] text-[#79827D] truncate">Alder & Stone Homes</p>
            </div>
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-[7px] bg-[#2F4A3F] text-white flex items-center justify-center mx-auto">
            <span className="font-serif font-bold text-xs">G</span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#79827D] hover:text-[#1F2A27] p-1 rounded hover:bg-[#EDE8DD] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#79827D] px-2.5 block mb-1">
                {group.label}
              </span>
            )}

            {group.items.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-[8px] text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-[#EDE8DD] text-[#1F2A27] font-semibold'
                      : 'text-[#4A5550] hover:text-[#1F2A27] hover:bg-[#F6F3EC]'
                  }`}
                >
                  {/* Left 3px Clay active bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#B4684A] rounded-r" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-[#2F4A3F]' : 'text-[#79827D] group-hover:text-[#1F2A27]'}>
                      {item.icon}
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && (
                    <>
                      {item.badge && (
                        <span className="text-[10px] font-semibold bg-[#F0DFD5] text-[#9B553B] px-1.5 py-0.2 rounded font-mono">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && !item.badge && (
                        <span className="text-[10px] font-mono text-[#79827D] bg-[#EDE8DD] px-1.5 py-0.2 rounded">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Sub-Account Status */}
      {!collapsed && (
        <div className="p-3 border-t border-[#DDD6C8] bg-[#F6F3EC] text-[11px] text-[#79827D] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4C7A57]" />
            <span className="font-medium text-[#1F2A27]">GHL Live Node</span>
          </div>
          <span className="font-mono text-[10px]">v4.2 Carolinas</span>
        </div>
      )}
    </aside>
  );
};
