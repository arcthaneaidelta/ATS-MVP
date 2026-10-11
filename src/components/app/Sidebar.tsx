import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Wallet,
  ArrowUpRight,
  Activity,
  Settings,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '../../store';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, resetDemoData } = useAppStore();

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Pools', path: '/app/pools', icon: Layers },
    { name: 'Wallet & Deposits', path: '/app/wallet', icon: Wallet },
    { name: 'Withdrawals', path: '/app/withdrawals', icon: ArrowUpRight },
    { name: 'Unified Activity', path: '/app/activity', icon: Activity },
  ];

  return (
    <aside className="hidden lg:flex w-64 h-screen sticky top-0 bg-[#FBF9F5] border-r border-[#DDD8CD] flex-col justify-between p-5 select-none text-left z-30">
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-8 h-8 rounded-full border border-[#2C4A3E] relative flex items-center justify-center">
            <div className="w-5 h-[1.5px] bg-[#2C4A3E] -mt-1" />
          </div>
          <span className="font-display font-medium text-2xl tracking-tight text-[#1B2420]">
            Meridian
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C867F] px-2 mb-1">
            Platform
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E3EBE6] text-[#1B2420] border-l-2 border-[#2C4A3E]'
                      : 'text-[#4A5650] hover:text-[#1B2420] hover:bg-[#EDE9E1]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-[#2C4A3E]" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Audit & Security Section */}
        <div className="flex flex-col gap-1 pt-2 border-t border-[#DDD8CD]/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C867F] px-2 mb-1">
            Verification
          </span>
          <NavLink
            to="/verify"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-[#E3EBE6] text-[#1B2420]' : 'text-[#4A5650] hover:text-[#1B2420] hover:bg-[#EDE9E1]'
              }`
            }
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#3E7D5A]" />
            <span>Draw Verifier</span>
          </NavLink>
          <NavLink
            to="/trust"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'bg-[#E3EBE6] text-[#1B2420]' : 'text-[#4A5650] hover:text-[#1B2420] hover:bg-[#EDE9E1]'
              }`
            }
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#B08A4E]" />
            <span>Trust Center</span>
          </NavLink>
        </div>
      </div>

      {/* Bottom User Profile Card & Tools */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[#DDD8CD]">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'bg-[#E3EBE6] text-[#1B2420]' : 'text-[#4A5650] hover:text-[#1B2420] hover:bg-[#EDE9E1]'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0 text-[#7C867F]" />
          <span>Settings & Demo</span>
        </NavLink>

        <div className="p-3 bg-[#EDE9E1] rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#2C4A3E] text-white flex items-center justify-center font-display text-xs font-semibold shrink-0">
              {user.avatarInitials}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#1B2420] truncate block">
                {user.name}
              </span>
              <span className="text-[11px] text-[#7C867F] truncate block">
                {user.region} · Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                resetDemoData();
              }}
              title="Reset demo data"
              className="p-1 text-[#7C867F] hover:text-[#1B2420] rounded hover:bg-[#DDD8CD] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              title="Sign out"
              className="p-1 text-[#7C867F] hover:text-[#A8453A] rounded hover:bg-[#DDD8CD] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
