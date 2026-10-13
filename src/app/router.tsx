import React, { useEffect } from 'react';
import { createBrowserRouter, useLocation, Outlet, Navigate } from 'react-router-dom';

// Shells
import { CorporateShell } from './shells/CorporateShell';
import { AcademyShell } from './shells/AcademyShell';
import { VenueShell } from '../features/cirqla/venue/VenueShell';

// Corporate Pages
import { HomePage } from '../features/corporate/HomePage';
import { ServicesPage } from '../features/corporate/ServicesPage';
import { ProductsPage } from '../features/corporate/ProductsPage';
import { CaseStudiesPage } from '../features/corporate/CaseStudiesPage';
import { CaseStudyDetailPage } from '../features/corporate/CaseStudyDetailPage';
import { CareersPage } from '../features/corporate/CareersPage';
import { AboutPage } from '../features/corporate/AboutPage';
import { ContactPage } from '../features/corporate/ContactPage';
import { InsightsPage } from '../features/corporate/InsightsPage';
import { InsightDetailPage } from '../features/corporate/InsightDetailPage';

// Academy Pages
import { AcademyLandingPage } from '../features/academy/AcademyLandingPage';
import { AcademyCatalogPage } from '../features/academy/AcademyCatalogPage';
import { CourseDetailPage } from '../features/academy/CourseDetailPage';
import { StudentDashboardPage } from '../features/academy/StudentDashboardPage';
import { CoursePlayerPage } from '../features/academy/CoursePlayerPage';
import { QuizAssessmentPage } from '../features/academy/QuizAssessmentPage';
import { CertificatesPage } from '../features/academy/CertificatesPage';
import { CertificateVerifyPage } from '../features/academy/CertificateVerifyPage';
import { AcademyAdminPage } from '../features/academy/AcademyAdminPage';

// Cirqla Pages
import { CirqlaMarketingPage } from '../features/cirqla/CirqlaMarketingPage';
import { CustomerAppPage } from '../features/cirqla/customer/CustomerAppPage';
import { OrderBoardPage } from '../features/cirqla/venue/OrderBoardPage';
import { MenuManagerPage } from '../features/cirqla/venue/MenuManagerPage';
import { PaymentsPage } from '../features/cirqla/venue/PaymentsPage';
import { AnalyticsPage } from '../features/cirqla/venue/AnalyticsPage';
import { StaffPage } from '../features/cirqla/venue/StaffPage';
import { BranchesSettingsPage } from '../features/cirqla/venue/BranchesSettingsPage';
import { PlatformAdminPage } from '../features/cirqla/platform/PlatformAdminPage';

// Proposal Companion & Kit
import { ProposalPage } from '../features/proposal/ProposalPage';
import { KitchenSinkPage } from '../features/kit/KitchenSinkPage';
import { NotFoundPage } from '../components/brand/NotFoundPage';

/**
 * Root Layout with Scroll Restoration & H1 accessibility focus
 */
const RootLayout: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll restoration
    window.scrollTo(0, 0);

    // Accessible H1 focus if available
    const h1 = document.querySelector('h1');
    if (h1 && !h1.hasAttribute('tabindex')) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // 1. Corporate Routes (under CorporateShell)
      {
        path: '/',
        element: <CorporateShell />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'services', element: <ServicesPage /> },
          { path: 'products', element: <ProductsPage /> },
          { path: 'case-studies', element: <CaseStudiesPage /> },
          { path: 'case-studies/:slug', element: <CaseStudyDetailPage /> },
          { path: 'careers', element: <CareersPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'contact', element: <ContactPage /> },
          { path: 'insights', element: <InsightsPage /> },
          { path: 'insights/:slug', element: <InsightDetailPage /> },
        ],
      },

      // 2. Academy Routes (under AcademyShell)
      {
        path: '/academy',
        element: <AcademyShell />,
        children: [
          { index: true, element: <AcademyLandingPage /> },
          { path: 'courses', element: <AcademyCatalogPage /> },
          { path: 'courses/:slug', element: <CourseDetailPage /> },
          { path: 'app', element: <StudentDashboardPage /> },
          { path: 'app/courses/:slug/lessons/:id', element: <CoursePlayerPage /> },
          { path: 'app/quiz', element: <QuizAssessmentPage /> },
          { path: 'app/certificates', element: <CertificatesPage /> },
          { path: 'verify/:id', element: <CertificateVerifyPage /> },
          { path: 'admin', element: <AcademyAdminPage /> },
          { path: 'admin/*', element: <AcademyAdminPage /> },
        ],
      },

      // 3. Cirqla Customer & Marketing
      {
        path: '/cirqla',
        children: [
          { index: true, element: <CirqlaMarketingPage /> },
          { path: 'scan/:venue', element: <CustomerAppPage /> },
        ],
      },

      // 4. Cirqla Venue Dashboard (under VenueShell)
      {
        path: '/cirqla/venue',
        element: <VenueShell />,
        children: [
          { index: true, element: <Navigate to="/cirqla/venue/orders" replace /> },
          { path: 'orders', element: <OrderBoardPage /> },
          { path: 'menu', element: <MenuManagerPage /> },
          { path: 'payments', element: <PaymentsPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'staff', element: <StaffPage /> },
          { path: 'branches', element: <BranchesSettingsPage /> },
          { path: 'settings', element: <BranchesSettingsPage /> },
        ],
      },

      // 5. Cirqla Super-Admin Console
      {
        path: '/cirqla/platform',
        element: <PlatformAdminPage />,
      },
      {
        path: '/cirqla/platform/*',
        element: <PlatformAdminPage />,
      },

      // 6. Proposal Companion (/proposal, unlisted)
      {
        path: '/proposal',
        element: <ProposalPage />,
      },

      // 7. Design Kit Verification (/kit)
      {
        path: '/__kit',
        element: <KitchenSinkPage />,
      },

      // 8. 404 Catch-All
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
