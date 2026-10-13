import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ToastProvider } from './components/ui/Toast';
import { Loader } from './components/brand/Loader';
import './design/tokens.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ToastProvider>
      <Loader />
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
);
