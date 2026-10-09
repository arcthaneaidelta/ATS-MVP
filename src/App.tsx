import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoStoreProvider } from './store/demoStore';

// Layouts
import { MarketingLayout } from './layouts/MarketingLayout';
import { AppLayout } from './layouts/AppLayout';

// Marketing Pages
import { HomePage } from './pages/marketing/HomePage';
import { SystemPage } from './pages/marketing/SystemPage';
import { FunnelsPage } from './pages/marketing/FunnelsPage';
import { AcademyPage } from './pages/marketing/AcademyPage';
import { CompliancePage } from './pages/marketing/CompliancePage';
import { StartPage } from './pages/marketing/StartPage';

// Standalone Funnel Pages
import { CommunityFunnelStandalonePage } from './pages/funnels/CommunityFunnelStandalonePage';
import { PlanQuizStandalonePage } from './pages/funnels/PlanQuizStandalonePage';
import { CustomBuildStandalonePage } from './pages/funnels/CustomBuildStandalonePage';

// Live App Pages
import { CommandCenterPage } from './pages/app/CommandCenterPage';
import { SpeedToLeadPage } from './pages/app/SpeedToLeadPage';
import { PipelinePage } from './pages/app/PipelinePage';
import { LeadsPage } from './pages/app/LeadsPage';
import { ConversationsPage } from './pages/app/ConversationsPage';
import { WorkflowsPage } from './pages/app/WorkflowsPage';
import { CampaignsPage } from './pages/app/CampaignsPage';
import { SocialPage } from './pages/app/SocialPage';
import { CalendarPage } from './pages/app/CalendarPage';
import { ReputationPage } from './pages/app/ReputationPage';
import { ReportsPage } from './pages/app/ReportsPage';
import { SettingsPage } from './pages/app/SettingsPage';

// 404 Page
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <DemoStoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Proposal & Marketing Site */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/system" element={<SystemPage />} />
            <Route path="/funnels" element={<FunnelsPage />} />
            <Route path="/academy" element={<AcademyPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/start" element={<StartPage />} />
          </Route>

          {/* Standalone Funnel Fullscreen Views */}
          <Route path="/funnels/community" element={<CommunityFunnelStandalonePage />} />
          <Route path="/funnels/plan-quiz" element={<PlanQuizStandalonePage />} />
          <Route path="/funnels/custom-build" element={<CustomBuildStandalonePage />} />

          {/* Live GHL Operating App (/app/*) */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<CommandCenterPage />} />
            <Route path="speed-to-lead" element={<SpeedToLeadPage />} />
            <Route path="pipeline" element={<PipelinePage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="workflows" element={<WorkflowsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="social" element={<SocialPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="reputation" element={<ReputationPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </DemoStoreProvider>
  );
}

export default App;
