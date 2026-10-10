import { useState } from 'react';
import { Loader } from './Loader';
import { LandingNavbar } from './LandingNavbar';
import { Hero } from './Hero';
import { ProblemStory } from './ProblemStory';
import { CapabilityTabs } from './CapabilityTabs';
import { NumbersStrip } from './NumbersStrip';
import { ProposalSection } from './ProposalSection';
import { FooterSection } from './FooterSection';

export function LandingPage() {
  const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <div className="bg-bg text-ink-900 font-sans selection:bg-primary-tint selection:text-primary min-h-screen">
      {/* Entry Loader (Contour Reveal) */}
      <Loader onComplete={() => setLoaderFinished(true)} />

      {/* Landing Navbar */}
      <LandingNavbar />

      {/* Hero Section with Live Part Resolver */}
      <Hero />

      {/* The Problem & The Memory Story */}
      <ProblemStory />

      {/* Capability Tabs Showcase */}
      <CapabilityTabs />

      {/* Numbers Strip (4 Counters) */}
      <NumbersStrip />

      {/* Bid Companion Proposal (Architecture, 4 Phases, Migration, Support) */}
      <ProposalSection />

      {/* Closing CTA, Contact Form, & 4-Column Footer */}
      <FooterSection />
    </div>
  );
}
