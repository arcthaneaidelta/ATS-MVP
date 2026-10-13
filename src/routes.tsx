import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/Landing';
import { PlanPage } from '@/pages/Plan';
import { AppPage } from '@/pages/AppPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/app" element={<AppPage />} />
      <Route path="/app/:tab" element={<AppPage />} />
      <Route path="/app/subscriptions/:id" element={<AppPage />} />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
