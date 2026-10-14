import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useDemoStore } from '../../store/useDemoStore';
import {
  Activity,
  Layers,
  CalendarX2,
  GitFork,
  Sparkles,
  ClipboardList,
  CheckSquare,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggleCollapse }) => {
  const { resetAll, addToast } = useDemoStore();

  const navItems = [
    { label: 'Overview', to: '/app', icon: Layers, end: true },
    { label: 'Pipeline Trace', to: '/app/trace', icon: Activity, end: false },
    { label: 'Missed Meetings', to: '/app/meetings', icon: CalendarX2, end: false },
    { label: 'Delivery Funnel', to: '/app/delivery', icon: GitFork, end: false },
    { label: 'Signal Lab', to: '/app/signals', icon: Sparkles, end: false },
    { label: 'Findings Report', to: '/app/findings', icon: ClipboardList, end: false },
    { label: 'Scope & Milestones', to: '/app/scope', icon: CheckSquare, end: false },
    { label: 'Handoff Doc', to: '/app/handoff', icon: BookOpen, end: false }
  ];

  const handleReset = () => {
    resetAll();
    addToast({
      type: 'success',
      title: 'Demo State Reset',
      message: 'Scope checklist and filters restored to default.'
    });
  };

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#FBF9F6] border-r border-[#E2DDD3] h-screen sticky top-0 transition-all duration-200 z-20 shrink-0 ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Top Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2DDD3]">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-[#1F4B4A] flex items-center justify-center text-[#F6F3EE] shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="leading-none">
              <span className="font-serif text-lg font-medium text-[#1E2A2B] tracking-tight block">
                Implemnt
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
                Pipeline Trace
              </span>
            </div>
          )}
        </Link>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-[#7B8786] hover:text-[#1E2A2B] hover:bg-[#E3EDEB] transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-semibold text-[#7B8786] uppercase tracking-wider">
            Diagnostic Modules
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E3EDEB] text-[#1F4B4A] font-semibold border-l-2 border-[#1F4B4A]'
                    : 'text-[#4A5757] hover:bg-[#E3EDEB]/60 hover:text-[#1E2A2B]'
                } ${collapsed ? 'justify-center px-0' : ''}`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-[#1F4B4A]" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        <div className="pt-4 pb-1">
          <div className="border-t border-[#E2DDD3] my-2" />
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-semibold text-[#7B8786] uppercase tracking-wider">
              Proposal Reference
            </div>
          )}
          <NavLink
            to="/proposal"
            title={collapsed ? 'Proposal Answers (Q1–Q6)' : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#E3EDEB] text-[#1F4B4A] font-semibold border-l-2 border-[#1F4B4A]'
                  : 'text-[#4A5757] hover:bg-[#E3EDEB]/60 hover:text-[#1E2A2B]'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-[#B4643C]" />
            {!collapsed && <span>Proposal Answers</span>}
          </NavLink>
        </div>
      </nav>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-[#E2DDD3] bg-[#F6F3EE] space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#E3EDEB] border border-[#CFC8BB] text-[11px] text-[#1F4B4A]">
              <Info className="w-3.5 h-3.5 shrink-0 text-[#1F4B4A]" />
              <span className="font-medium truncate">Illustrative sample data</span>
            </div>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-[#7B8786] hover:text-[#A8433A] hover:bg-[#F5DEDA] rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset demo state</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center p-2 text-[#7B8786] hover:text-[#A8433A] hover:bg-[#F5DEDA] rounded transition-colors cursor-pointer"
            title="Reset demo state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
