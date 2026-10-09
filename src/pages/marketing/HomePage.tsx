import React, { useRef } from 'react';
import { Hero } from '../../components/marketing/Hero';
import { SystemStepper } from '../../components/marketing/SystemStepper';
import { SpeedToLeadSimulator } from '../../components/marketing/SpeedToLeadSimulator';
import { FunnelsPreviewSection } from '../../components/marketing/FunnelsPreviewSection';
import { InsideSystemTabs } from '../../components/marketing/InsideSystemTabs';
import { CommentToLeadMini } from '../../components/marketing/CommentToLeadMini';
import { TeamAcademyTeaser } from '../../components/marketing/TeamAcademyTeaser';
import { ComplianceTeaser } from '../../components/marketing/ComplianceTeaser';
import { Card } from '../../components/ui/Card';
import { AlertCircle, Clock, EyeOff, CheckCircle2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = () => {
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Split Hero Section with Looping Phone Thread */}
      <Hero onScrollToSimulator={scrollToSimulator} />

      {/* 2. Problem Section: "Where Builders Lose Buyers" */}
      <section className="py-20 bg-[#FBF9F4] border-b border-[#DDD6C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
              The Cost of Chaos
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal mt-2">
              Where Mid-Size Home Builders Lose Buyers
            </h2>
            <p className="text-sm text-[#4A5550] mt-2">
              Building a $500k+ home takes 6 to 12 months. Most builders spend thousands on ads,
              only to let 70% of inquiries leak through three structural cracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F6F3EC] p-6 rounded-[16px] border border-[#DDD6C8] space-y-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#F3DEDA] text-[#A5473B] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1F2A27] font-medium">1. Slow First Response</h3>
              <p className="text-xs text-[#4A5550] leading-relaxed">
                When a buyer asks about Lot 14 on Saturday at 2:00 PM, waiting 4 hours to call means
                they have already visited a competitor's model home down the road.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-[#4C7A57] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Groundwork Fix: Instant &lt;7s SMS & lookbook
              </div>
            </div>

            <div className="bg-[#F6F3EC] p-6 rounded-[16px] border border-[#DDD6C8] space-y-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#F3DEDA] text-[#A5473B] flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1F2A27] font-medium">2. Forgotten 90-Day Follow-Up</h3>
              <p className="text-xs text-[#4A5550] leading-relaxed">
                Buyers researching 6 months out get 2 sales calls in week one, then silence. Sales agents
                focus exclusively on immediate buyers, letting warm pipeline go cold.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-[#4C7A57] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Groundwork Fix: Automated 90-day multi-channel nurture
              </div>
            </div>

            <div className="bg-[#F6F3EC] p-6 rounded-[16px] border border-[#DDD6C8] space-y-3">
              <div className="w-10 h-10 rounded-[10px] bg-[#F3DEDA] text-[#A5473B] flex items-center justify-center">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#1F2A27] font-medium">3. Zero Channel Attribution</h3>
              <p className="text-xs text-[#4A5550] leading-relaxed">
                You spend $5,000 on Meta and Google ads every month, but have no reliable tracking
                connecting that spend to booked model tours and signed purchase agreements.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-[#4C7A57] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Groundwork Fix: Real cost-per-contract analytics
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Five-Step Interactive Architecture */}
      <SystemStepper />

      {/* 4. Embedded Speed-to-Lead Simulator (WOW #1) */}
      <section ref={simulatorRef} className="py-20 bg-[#F6F3EC] border-b border-[#DDD6C8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SpeedToLeadSimulator />
        </div>
      </section>

      {/* 5. Funnel Gallery Showcase */}
      <FunnelsPreviewSection />

      {/* 6. Inside the Operating System Tabs */}
      <InsideSystemTabs />

      {/* 7. Social Media Comment-to-Lead Automation (WOW #3) */}
      <CommentToLeadMini />

      {/* 8. Team Academy 60-Minute Video Teaser (WOW #6) */}
      <TeamAcademyTeaser />

      {/* 9. US Compliance & Telephony Guard */}
      <ComplianceTeaser />
    </div>
  );
};
