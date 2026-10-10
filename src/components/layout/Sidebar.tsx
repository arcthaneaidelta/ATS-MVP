import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  ShoppingCart,
  Package,
  TrendingUp,
  Landmark,
  Files,
  Database,
  ShieldCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { useStore, UserRole } from '../../store/useStore';
import { BRAND } from '../../config/brand';
import { EntitySwitcher } from './EntitySwitcher';
import clsx from 'clsx';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { currentRole, setRole, resetDemoData, permissionMatrix } = useStore();
  const location = useLocation();

  const isModuleVisible = (moduleName: string) => {
    const perm = permissionMatrix[currentRole]?.[moduleName];
    return perm && perm !== 'None';
  };

  const navGroups = [
    {
      label: 'Work',
      items: [
        { name: 'Dashboard', path: '/app', icon: LayoutDashboard, visible: true },
        { name: 'RFQs & Quotes', path: '/app/rfq', icon: FileSpreadsheet, visible: isModuleVisible('RFQ') },
        { name: 'Procurement & Orders', path: '/app/orders', icon: ShoppingCart, visible: isModuleVisible('Orders') },
      ],
    },
    {
      label: 'Knowledge',
      items: [
        { name: 'Parts Master', path: '/app/parts', icon: Package, visible: isModuleVisible('Parts') },
        { name: 'Pricing Intelligence', path: '/app/pricing', icon: TrendingUp, visible: isModuleVisible('Pricing') },
      ],
    },
    {
      label: 'Money',
      items: [
        { name: 'Finance & Payments', path: '/app/finance', icon: Landmark, visible: isModuleVisible('Finance') },
        { name: 'Commercial Documents', path: '/app/documents', icon: Files, visible: true },
      ],
    },
    {
      label: 'System',
      items: [
        { name: 'Migration Console', path: '/app/migration', icon: Database, visible: true },
        { name: 'Entities & Access', path: '/app/admin', icon: ShieldCheck, visible: isModuleVisible('Admin') },
        { name: 'Reports & Audit', path: '/app/reports', icon: BarChart3, visible: true },
      ],
    },
  ];

  const rolesList: UserRole[] = ['Sales', 'Buyer', 'Finance', 'Director', 'Admin'];

  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col bg-surface border-r border-border transition-all duration-200 select-none relative z-20 shrink-0 h-screen sticky top-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-primary rounded-xs flex flex-col justify-center gap-0.5 px-1">
              <div className="w-full h-0.5 bg-accent rounded-full" />
              <div className="w-3/4 h-0.5 bg-accent rounded-full" />
              <div className="w-1/2 h-0.5 bg-accent rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg text-ink-900 leading-none">
                {BRAND.name}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-ink-500 font-mono mt-0.5">
                Mining Parts ERP
              </span>
            </div>
          </NavLink>
        )}

        {collapsed && (
          <div className="w-8 h-8 mx-auto bg-primary rounded-xs flex flex-col justify-center items-center gap-0.5 p-1">
            <div className="w-4 h-0.5 bg-accent rounded-full" />
            <div className="w-3 h-0.5 bg-accent rounded-full" />
            <div className="w-2 h-0.5 bg-accent rounded-full" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-xs text-ink-500 hover:text-ink-900 hover:bg-surface-sunken"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Entity Switcher Block */}
      {!collapsed && (
        <div className="p-3 border-b border-border">
          <EntitySwitcher />
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) => item.visible);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="space-y-1">
              {!collapsed && (
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-ink-500 font-mono">
                  {group.label}
                </div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/app'
                    ? location.pathname === '/app'
                    : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.name : undefined}
                    className={clsx(
                      'flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-medium transition-colors relative',
                      isActive
                        ? 'bg-primary-tint text-primary font-semibold'
                        : 'text-ink-700 hover:text-ink-900 hover:bg-surface-sunken',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-primary rounded-full" />
                    )}
                    <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* User & Role Switcher Footer */}
      <div className="p-3 border-t border-border bg-surface-sunken/40 relative">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 text-left truncate flex-1 hover:opacity-85"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[11px] shrink-0 font-mono">
              VQ
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-xs font-semibold text-ink-900 block truncate">
                  Valeria Quispe
                </span>
                <span className="text-[10px] text-ink-500 font-mono block">
                  Role: {currentRole}
                </span>
              </div>
            )}
            {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-ink-500 ml-auto" />}
          </button>
        </div>

        {/* Role Menu Popover */}
        {showRoleMenu && (
          <div className="absolute bottom-full left-2 right-2 mb-2 p-2 bg-surface-elevated rounded-sm border border-border shadow-lg z-30 text-xs">
            <span className="text-[10px] font-bold text-ink-500 uppercase tracking-wider block px-2 py-1 mb-1 border-b border-border">
              Preview Demo As Role
            </span>
            {rolesList.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setShowRoleMenu(false);
                }}
                className={clsx(
                  'w-full text-left px-2 py-1.5 rounded-xs transition-colors flex items-center justify-between',
                  r === currentRole
                    ? 'bg-primary-tint text-primary font-semibold'
                    : 'text-ink-700 hover:bg-surface-sunken'
                )}
              >
                <span>{r}</span>
                {r === currentRole && <UserCheck className="w-3.5 h-3.5 text-primary" />}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setShowRoleMenu(false);
                }}
                className="w-full text-left px-2 py-1 text-xs text-error hover:bg-error-tint/60 rounded-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Seed Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
