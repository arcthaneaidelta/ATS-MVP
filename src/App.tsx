import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { PortalLayout } from '@/components/layout/PortalLayout'
import { StaffLayout } from '@/components/layout/StaffLayout'
import { StandaloneLayout } from '@/components/layout/StandaloneLayout'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

// Eagerly loaded public & store pages
import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ServicesPage } from '@/pages/public/ServicesPage'
import { HowItWorksPage } from '@/pages/public/HowItWorksPage'
import { ResourcesPage } from '@/pages/public/ResourcesPage'
import { ArticleDetailPage } from '@/pages/public/ArticleDetailPage'
import { ContactPage } from '@/pages/public/ContactPage'
import { LegalPage } from '@/pages/public/LegalPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { StoreCataloguePage } from '@/pages/store/StoreCataloguePage'
import { ServiceDetailPage } from '@/pages/store/ServiceDetailPage'
import { CartPage } from '@/pages/store/CartPage'
import { CheckoutPage } from '@/pages/store/CheckoutPage'
import { OrderConfirmationPage } from '@/pages/store/OrderConfirmationPage'
import { PortalLoginPage } from '@/pages/portal/PortalLoginPage'

// Lazy-loaded Portal & Staff pages for performance budget compliance
const DashboardPage = lazy(() =>
  import('@/pages/portal/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const OrdersListPage = lazy(() =>
  import('@/pages/portal/OrdersListPage').then((m) => ({ default: m.OrdersListPage }))
)
const OrderDetailPage = lazy(() =>
  import('@/pages/portal/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage }))
)
const DocumentsVaultPage = lazy(() =>
  import('@/pages/portal/DocumentsVaultPage').then((m) => ({ default: m.DocumentsVaultPage }))
)
const IntakeFormPage = lazy(() =>
  import('@/pages/portal/IntakeFormPage').then((m) => ({ default: m.IntakeFormPage }))
)
const AccountPage = lazy(() =>
  import('@/pages/portal/AccountPage').then((m) => ({ default: m.AccountPage }))
)
const DeliveryDeskPage = lazy(() =>
  import('@/pages/staff/DeliveryDeskPage').then((m) => ({ default: m.DeliveryDeskPage }))
)
const PaymentGatewayPage = lazy(() =>
  import('@/pages/store/PaymentGatewayPage').then((m) => ({ default: m.PaymentGatewayPage }))
)
const DevTokensPage = lazy(() =>
  import('@/pages/dev/DevTokensPage').then((m) => ({ default: m.DevTokensPage }))
)

const PageSkeleton: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-12">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#17323A] border-t-[#B8864B] animate-spin" />
      <span className="font-mono text-xs uppercase tracking-wider text-[#6F7A78]">
        Loading view...
      </span>
    </div>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Public & Store Routes */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="resources/:slug" element={<ArticleDetailPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy" element={<LegalPage />} />
            <Route path="terms" element={<LegalPage />} />
            <Route path="refunds" element={<LegalPage />} />

            {/* Service Store */}
            <Route path="store" element={<StoreCataloguePage />} />
            <Route path="store/:slug" element={<ServiceDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/complete/:orderId" element={<OrderConfirmationPage />} />

            {/* Dev Tokens */}
            <Route path="dev/tokens" element={<DevTokensPage />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Standalone Pages (Payment Gateway, Login) */}
          <Route element={<StandaloneLayout />}>
            <Route path="checkout/pay" element={<PaymentGatewayPage />} />
            <Route path="portal/login" element={<PortalLoginPage />} />
          </Route>

          {/* Client Portal (Authenticated Shell) */}
          <Route path="portal" element={<PortalLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersListPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="documents" element={<DocumentsVaultPage />} />
            <Route path="intake/:formId" element={<IntakeFormPage />} />
            <Route path="account" element={<AccountPage />} />
          </Route>

          {/* Staff Delivery Desk */}
          <Route path="staff" element={<StaffLayout />}>
            <Route index element={<DeliveryDeskPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
