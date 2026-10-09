import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/marketing/Navbar';
import { Footer } from '../components/marketing/Footer';
import { Loader } from '../components/marketing/Loader';
import { ToastContainer } from '../components/ui/ToastContainer';

export const MarketingLayout: React.FC = () => {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(() => {
    // Only show on home page if not seen yet
    return location.pathname === '/' && !sessionStorage.getItem('groundwork_loader_seen');
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#1F2A27]">
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
