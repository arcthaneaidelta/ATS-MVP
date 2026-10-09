import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/app/Sidebar';
import { Topbar } from '../components/app/Topbar';
import { BottomTabBar } from '../components/app/BottomTabBar';
import { ResetDemoChip } from '../components/app/ResetDemoChip';
import { CommandPalette } from '../components/app/CommandPalette';
import { LeadDetailDrawer } from '../components/app/LeadDetailDrawer';
import { ToastContainer } from '../components/ui/ToastContainer';
import { useDemoStore } from '../store/demoStore';

export const AppLayout: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const { liveActivityEnabled, addLead } = useDemoStore();

  // Simulated live activity engine: periodically inject a new buyer inquiry if enabled
  useEffect(() => {
    if (!liveActivityEnabled) return;

    const sampleInquiries = [
      { name: 'Brittany & Tyler Hayes', community: 'Harlow Creek', plan: 'The Ashby', budget: '$430k – $460k' },
      { name: 'Dr. Gregory Vance', community: 'Marrow Ridge', plan: 'The Vance', budget: '$620k – $680k' },
      { name: 'Kendall Brooks', community: 'Larkin Meadows', plan: 'The Linden', budget: '$390k – $420k' },
    ];

    let counter = 0;
    const interval = setInterval(() => {
      const item = sampleInquiries[counter % sampleInquiries.length];
      counter++;

      addLead({
        name: item.name,
        communityName: item.community,
        communityId: item.community === 'Harlow Creek' ? 'harlow-creek' : 'marrow-ridge',
        planName: item.plan,
        budgetRange: item.budget,
        timeline: 'Within 3 months',
        score: 'Hot',
        stage: 'new',
        source: 'Meta Ads',
        tags: ['Live Activity Sim', 'Instant Ingest'],
      });
    }, 45000); // 45 seconds

    return () => clearInterval(interval);
  }, [liveActivityEnabled, addLead]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F3EC] text-[#1F2A27]">
      {/* App Left Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* App Topbar */}
        <Topbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tabs */}
      <BottomTabBar />

      {/* Floating Demo Reset Button */}
      <ResetDemoChip />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Universal Lead Detail Drawer */}
      <LeadDetailDrawer />

      {/* Global Automated Toasts */}
      <ToastContainer />
    </div>
  );
};
