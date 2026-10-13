import React, { useState } from 'react';
import { Nav } from '@/components/marketing/Nav';
import { Hero } from '@/components/marketing/Hero';
import { HorizonStory } from '@/components/marketing/HorizonStory';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { TrialScene } from '@/components/marketing/TrialScene';
import { TrustColumns } from '@/components/marketing/TrustColumns';
import { PlanTeaser } from '@/components/marketing/PlanTeaser';
import { ClosingFooter } from '@/components/marketing/ClosingFooter';
import { Loader } from '@/components/marketing/Loader';

export function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleTryApp = () => {
    const el = document.getElementById('live-phone-frame');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`min-h-screen bg-bg text-ink ${isLoaded ? 'intro-done' : ''}`}>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}

      <Nav onTryAppClick={handleTryApp} />

      <main>
        <Hero onTryAppClick={handleTryApp} />
        <HorizonStory />
        <HowItWorks />
        <TrialScene />
        <TrustColumns />
        <PlanTeaser />
      </main>

      <ClosingFooter />
    </div>
  );
}
