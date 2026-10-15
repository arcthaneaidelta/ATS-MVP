import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { RoleGuard } from './RoleGuard';

// Public features
import { LandingPage } from '../features/landing/LandingPage';
import { PlansPage } from '../features/plans/PlansPage';

// Buyer features
import { BuyerOverview } from '../features/buyer/BuyerOverview';
import { QuotesList } from '../features/buyer/QuotesList';
import { QuoteDetail } from '../features/buyer/QuoteDetail';
import { BookingWizard } from '../features/buyer/BookingWizard';
import { BookingsList } from '../features/buyer/BookingsList';
import { BookingDetail } from '../features/buyer/BookingDetail';
import { SubscriptionPage } from '../features/buyer/SubscriptionPage';

// Admin features
import { AdminOverview } from '../features/admin/AdminOverview';
import { BuyersList } from '../features/admin/BuyersList';
import { BuyerDetail } from '../features/admin/BuyerDetail';
import { AdminBookingsList } from '../features/admin/AdminBookingsList';
import { AdminBookingReview } from '../features/admin/AdminBookingReview';

// Coordinator features
import { PaymentsQueue } from '../features/coordinator/PaymentsQueue';

// System features
import { ForbiddenPage } from '../features/system/Forbidden';
import { NotFoundPage } from '../features/system/NotFound';
import { ComponentKitPage } from '../features/system/ComponentKit';

export const router = createBrowserRouter([
  // Public Landing & Plans
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/plans',
    element: <PlansPage />,
  },

  // App Shell containing Buyer, Admin, Coordinator layouts
  {
    element: <AppShell />,
    children: [
      // Buyer Protected Routes
      {
        path: '/app',
        element: (
          <RoleGuard allowedRoles={['buyer']}>
            <BuyerOverview />
          </RoleGuard>
        ),
      },
      {
        path: '/app/requests',
        element: (
          <RoleGuard allowedRoles={['buyer']}>
            <QuotesList />
          </RoleGuard>
        ),
      },
      {
        path: '/app/requests/:id',
        element: (
          <RoleGuard allowedRoles={['buyer']}>
            <QuoteDetail />
          </RoleGuard>
        ),
      },
      {
        path: '/app/book/:quoteId',
        element: (
          <RoleGuard allowedRoles={['buyer']}>
            <BookingWizard />
          </RoleGuard>
        ),
      },
      {
        path: '/app/bookings',
        element: (
          <RoleGuard allowedRoles={['buyer']}>
            <BookingsList />
          </RoleGuard>
        ),
      },
      {
        path: '/app/bookings/:id',
        element: (
          <RoleGuard allowedRoles={['buyer']}>
            <BookingDetail />
          </RoleGuard>
        ),
      },
      {
        path: '/app/subscription',
        element: (
          <RoleGuard allowedRoles={['buyer']}>
            <SubscriptionPage />
          </RoleGuard>
        ),
      },

      // Admin Protected Routes
      {
        path: '/admin',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <AdminOverview />
          </RoleGuard>
        ),
      },
      {
        path: '/admin/buyers',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <BuyersList />
          </RoleGuard>
        ),
      },
      {
        path: '/admin/buyers/:id',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <BuyerDetail />
          </RoleGuard>
        ),
      },
      {
        path: '/admin/bookings',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <AdminBookingsList />
          </RoleGuard>
        ),
      },
      {
        path: '/admin/bookings/:id',
        element: (
          <RoleGuard allowedRoles={['admin']}>
            <AdminBookingReview />
          </RoleGuard>
        ),
      },

      // Coordinator Protected Routes
      {
        path: '/coord/payments',
        element: (
          <RoleGuard allowedRoles={['coordinator']}>
            <PaymentsQueue />
          </RoleGuard>
        ),
      },
      {
        path: '/coord/bookings/:id',
        element: (
          <RoleGuard allowedRoles={['coordinator']}>
            <PaymentsQueue />
          </RoleGuard>
        ),
      },

      // System routes within shell
      {
        path: '/kit',
        element: <ComponentKitPage />,
      },
    ],
  },

  // Standalone System Routes
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
