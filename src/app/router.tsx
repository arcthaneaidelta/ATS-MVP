import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Landing } from '../routes/funnel/Landing';
import { Start } from '../routes/funnel/Start';
import { Book } from '../routes/funnel/Book';
import { Thanks } from '../routes/funnel/Thanks';
import { ManageBooking } from '../routes/funnel/ManageBooking';

import { StudioLayout } from '../layouts/StudioLayout';
import { Overview } from '../routes/studio/Overview';
import { Pipeline } from '../routes/studio/Pipeline';
import { Contacts } from '../routes/studio/Contacts';
import { Workflows } from '../routes/studio/Workflows';
import { Simulator } from '../routes/studio/Simulator';
import { Voice } from '../routes/studio/Voice';
import { Calendar } from '../routes/studio/Calendar';
import { Reports } from '../routes/studio/Reports';
import { Setup } from '../routes/studio/Setup';
import { Handoff } from '../routes/studio/Handoff';

import { Proposal } from '../routes/Proposal';

export const router = createBrowserRouter([
  // Public Funnel Routes
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/start',
    element: <Start />,
  },
  {
    path: '/book',
    element: <Book />,
  },
  {
    path: '/thanks',
    element: <Thanks />,
  },
  {
    path: '/booking/:id',
    element: <ManageBooking />,
  },

  // Operator Console Routes (StudioLayout)
  {
    path: '/studio',
    element: <StudioLayout />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: 'pipeline',
        element: <Pipeline />,
      },
      {
        path: 'contacts',
        element: <Contacts />,
      },
      {
        path: 'workflows',
        element: <Workflows />,
      },
      {
        path: 'simulator',
        element: <Simulator />,
      },
      {
        path: 'voice',
        element: <Voice />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'setup',
        element: <Setup />,
      },
      {
        path: 'handoff',
        element: <Handoff />,
      },
    ],
  },

  // Proposal Route
  {
    path: '/proposal',
    element: <Proposal />,
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
