import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Loader } from './components/layout/Loader';
import { Sidebar } from './components/layout/Sidebar';
import { AppHeader } from './components/layout/AppHeader';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { ToastContainer } from './components/ui/Toast';
import { CommandPalette } from './components/ui/CommandPalette';

import { LandingPage } from './features/landing/LandingPage';
import { OverviewPage } from './features/overview/OverviewPage';
import { PipelineTracePage } from './features/trace/PipelineTracePage';
import { MissedMeetingsPage } from './features/meetings/MissedMeetingsPage';
import { DeliveryFunnelPage } from './features/delivery/DeliveryFunnelPage';
import { SignalLabPage } from './features/signals/SignalLabPage';
import { FindingsPage } from './features/findings/FindingsPage';
import { ScopePage } from './features/scope/ScopePage';
import { HandoffPage } from './features/handoff/HandoffPage';

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F3EE] flex text-[#1E2A2B] font-sans antialiased">
      {/* Desktop / Tablet Left Sidebar */}
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <AppHeader />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabBar />
    </div>
  );
};

export function App() {
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('implemnt_loaded');
  });

  return (
    <BrowserRouter>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
      <ToastContainer />
      <CommandPalette />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />


        {/* Demo App Shell with nested routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="trace" element={<PipelineTracePage />} />
          <Route path="meetings" element={<MissedMeetingsPage />} />
          <Route path="delivery" element={<DeliveryFunnelPage />} />
          <Route path="signals" element={<SignalLabPage />} />
          <Route path="findings" element={<FindingsPage />} />
          <Route path="scope" element={<ScopePage />} />
          <Route path="handoff" element={<HandoffPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
