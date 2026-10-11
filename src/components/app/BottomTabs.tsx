import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Layers, Wallet, Activity, Settings } from 'lucide-react';

export const BottomTabs: React.FC = () => {
  const tabs = [
    { name: 'Home', path: '/app', icon: LayoutDashboard },
    { name: 'Pools', path: '/app/pools', icon: Layers },
    { name: 'Wallet', path: '/app/wallet', icon: Wallet },
    { name: 'Activity', path: '/app/activity', icon: Activity },
    { name: 'More', path: '/app/settings', icon: Settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FBF9F5] border-t border-[#DDD8CD] z-40 flex items-center justify-around px-2 pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-md transition-colors ${
                isActive ? 'text-[#2C4A3E]' : 'text-[#7C867F] hover:text-[#1B2420]'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">{tab.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
