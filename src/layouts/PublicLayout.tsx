import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/marketing/Navbar';
import { Footer } from '../components/marketing/Footer';
import { IntroLoader } from '../components/marketing/IntroLoader';
import { GuidedTour } from '../components/app/GuidedTour';
import { AddFundsDrawer } from '../components/app/AddFundsDrawer';

export const PublicLayout: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('meridian_intro_shown');
  });
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F2EC] text-[#1B2420]">
      {showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <GuidedTour onOpenAddFunds={() => setIsAddFundsOpen(true)} />
      <AddFundsDrawer
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
      />
    </div>
  );
};
