import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Kanban, MessageSquare, Calendar, MoreHorizontal } from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { label: 'Today', path: '/app', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Pipeline', path: '/app/pipeline', icon: <Kanban className="w-5 h-5" /> },
    { label: 'Inbox', path: '/app/conversations', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Calendar', path: '/app/calendar', icon: <Calendar className="w-5 h-5" /> },
    { label: 'More', path: '/app/settings', icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF9F4] border-t border-[#DDD6C8] px-2 py-1.5 flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-md text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#2F4A3F] font-bold' : 'text-[#79827D]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
