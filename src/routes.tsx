import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PoolsPage } from './pages/PoolsPage';
import { PoolDetailPage } from './pages/PoolDetailPage';
import { DrawDetailPage } from './pages/DrawDetailPage';
import { VerifyPage } from './pages/VerifyPage';
import { WalletPage } from './pages/WalletPage';
import { WithdrawalsPage } from './pages/WithdrawalsPage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import { TrustCenterPage } from './pages/TrustCenterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/trust" element={<TrustCenterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/verify/:drawId" element={<VerifyPage />} />
      </Route>

      {/* Auth & Onboarding */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Authenticated Application */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="pools" element={<PoolsPage />} />
        <Route path="pools/:id" element={<PoolDetailPage />} />
        <Route path="draws/:id" element={<DrawDetailPage />} />
        <Route path="wallet" element={<WalletPage />} />
        <Route path="withdrawals" element={<WithdrawalsPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
