import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './routes/landing/LandingPage';
import { AppShell } from './components/layout/AppShell';

// Lazy-loaded App Route Chunks (PRD Section 16 Performance Architecture)
const DashboardPage = lazy(() =>
  import('./features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const PartsPage = lazy(() =>
  import('./features/parts/PartsPage').then((m) => ({ default: m.PartsPage }))
);
const PricingPage = lazy(() =>
  import('./features/pricing/PricingPage').then((m) => ({ default: m.PricingPage }))
);
const RfqListPage = lazy(() =>
  import('./features/rfq/RfqListPage').then((m) => ({ default: m.RfqListPage }))
);
const RfqImportWizardPage = lazy(() =>
  import('./features/rfq/RfqImportWizardPage').then((m) => ({ default: m.RfqImportWizardPage }))
);
const QuotationBuilderPage = lazy(() =>
  import('./features/rfq/QuotationBuilderPage').then((m) => ({ default: m.QuotationBuilderPage }))
);
const OrdersPage = lazy(() =>
  import('./features/orders/OrdersPage').then((m) => ({ default: m.OrdersPage }))
);
const DocumentsPage = lazy(() =>
  import('./features/documents/DocumentsPage').then((m) => ({ default: m.DocumentsPage }))
);
const FinancePage = lazy(() =>
  import('./features/finance/FinancePage').then((m) => ({ default: m.FinancePage }))
);
const MigrationPage = lazy(() =>
  import('./features/migration/MigrationPage').then((m) => ({ default: m.MigrationPage }))
);
const AdminPage = lazy(() =>
  import('./features/admin/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const ReportsPage = lazy(() =>
  import('./features/reports/ReportsPage').then((m) => ({ default: m.ReportsPage }))
);
const NotFoundPage = lazy(() =>
  import('./routes/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

function RouteSuspenseFallback() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 w-64 bg-surface-sunken rounded-sm" />
      <div className="h-32 w-full bg-surface-sunken rounded-md" />
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-surface-sunken rounded-sm" />
        <div className="h-24 bg-surface-sunken rounded-sm" />
        <div className="h-24 bg-surface-sunken rounded-sm" />
        <div className="h-24 bg-surface-sunken rounded-sm" />
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Application Shell & Lazy Feature Routes */}
        <Route path="/app" element={<AppShell />}>
          <Route
            index
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="parts"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <PartsPage />
              </Suspense>
            }
          />
          <Route
            path="parts/:partId"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <PartsPage />
              </Suspense>
            }
          />
          <Route
            path="pricing"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <PricingPage />
              </Suspense>
            }
          />
          <Route
            path="rfq"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <RfqListPage />
              </Suspense>
            }
          />
          <Route
            path="rfq/new"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <RfqImportWizardPage />
              </Suspense>
            }
          />
          <Route
            path="rfq/:id"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <QuotationBuilderPage />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <OrdersPage />
              </Suspense>
            }
          />
          <Route
            path="orders/:id"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <OrdersPage />
              </Suspense>
            }
          />
          <Route
            path="documents"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <DocumentsPage />
              </Suspense>
            }
          />
          <Route
            path="finance"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <FinancePage />
              </Suspense>
            }
          />
          <Route
            path="migration"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <MigrationPage />
              </Suspense>
            }
          />
          <Route
            path="admin"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <AdminPage />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense fallback={<RouteSuspenseFallback />}>
                <ReportsPage />
              </Suspense>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteSuspenseFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
