import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SiteFooter } from '../components/layout/SiteFooter';
import { IntroOverlay } from '../components/layout/IntroOverlay';
import { DemoPill } from '../components/layout/DemoPill';
import { ToastProvider } from '../components/ui/Toast';

// Public Pages
import { Home } from '../pages/Home';
import { Fleet } from '../pages/Fleet';
import { Book } from '../pages/Book';
import { BookConfirmed } from '../pages/BookConfirmed';
import { Quote } from '../pages/Quote';
import { QuoteSent } from '../pages/QuoteSent';
import { QuotePublic } from '../pages/QuotePublic';
import { Contact } from '../pages/Contact';
import { Terms } from '../pages/Terms';

// Admin Pages — lazy so the admin bundle never loads for public visitors
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })));
const AdminOverview = lazy(() => import('../pages/admin/AdminOverview').then((m) => ({ default: m.AdminOverview })));
const AdminCalendar = lazy(() => import('../pages/admin/AdminCalendar').then((m) => ({ default: m.AdminCalendar })));
const AdminBookings = lazy(() => import('../pages/admin/AdminBookings').then((m) => ({ default: m.AdminBookings })));
const AdminQuotations = lazy(() => import('../pages/admin/AdminQuotations').then((m) => ({ default: m.AdminQuotations })));
const AdminVehicles = lazy(() => import('../pages/admin/AdminVehicles').then((m) => ({ default: m.AdminVehicles })));
const AdminPricing = lazy(() => import('../pages/admin/AdminPricing').then((m) => ({ default: m.AdminPricing })));
const AdminInsurance = lazy(() => import('../pages/admin/AdminInsurance').then((m) => ({ default: m.AdminInsurance })));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-[120px] h-px bg-border overflow-hidden">
        <div className="h-full w-1/2 bg-accent animate-pulse" />
      </div>
    </div>
  );
}

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Layout Wrapper
function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/book');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-bg text-ink selection:bg-accent-soft selection:text-ink">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      {!isCheckout && <SiteFooter />}
    </div>
  );
}

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <IntroOverlay />
        <DemoPill />

        <Suspense fallback={<AdminFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/fleet" element={<PublicLayout><Fleet /></PublicLayout>} />
          <Route path="/book" element={<PublicLayout><Book /></PublicLayout>} />
          <Route path="/book/confirmed/:ref" element={<PublicLayout><BookConfirmed /></PublicLayout>} />
          <Route path="/quote" element={<PublicLayout><Quote /></PublicLayout>} />
          <Route path="/quote/sent/:ref" element={<PublicLayout><QuoteSent /></PublicLayout>} />
          <Route path="/quote/:ref" element={<PublicLayout><QuotePublic /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/quotations" element={<AdminQuotations />} />
          <Route path="/admin/vehicles" element={<AdminVehicles />} />
          <Route path="/admin/pricing" element={<AdminPricing />} />
          <Route path="/admin/insurance" element={<AdminInsurance />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Fallback */}
          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
        </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  );
};
