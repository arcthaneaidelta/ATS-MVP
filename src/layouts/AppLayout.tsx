import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/app/Sidebar';
import { BottomTabs } from '../components/app/BottomTabs';
import { Topbar } from '../components/app/Topbar';
import { AddFundsDrawer } from '../components/app/AddFundsDrawer';
import { CommandPalette } from '../components/app/CommandPalette';
import { GuidedTour } from '../components/app/GuidedTour';
import { useAppStore } from '../store';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAppStore();
  const location = useLocation();

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Guard against unauthenticated visitors
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Derive breadcrumb path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((p) => {
    if (p === 'app') return 'Dashboard';
    if (p === 'pools') return 'Pools';
    if (p === 'wallet') return 'Wallet';
    if (p === 'withdrawals') return 'Withdrawals';
    if (p === 'activity') return 'Activity';
    if (p === 'settings') return 'Settings';
    if (p === 'draws') return 'Draw Replay';
    return p;
  });

  return (
    <div className="min-h-screen flex bg-[#F5F2EC] text-[#1B2420]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Topbar
          breadcrumbs={breadcrumbs}
          onOpenAddFunds={() => setIsAddFundsOpen(true)}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-[1200px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabs />

      {/* Global Overlays */}
      <AddFundsDrawer
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onOpenAddFunds={() => {
          setIsCommandOpen(false);
          setIsAddFundsOpen(true);
        }}
      />
      <GuidedTour onOpenAddFunds={() => setIsAddFundsOpen(true)} />
    </div>
  );
};
