import React from 'react';
import { Link } from 'react-router-dom';
import { HeroPipelineVisual } from './HeroPipelineVisual';
import { ScrollStory } from './ScrollStory';
import { Footer } from '../../components/layout/Footer';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import {
  ArrowRight,
  Activity,
  Sparkles,
  GitFork,
  CheckCircle2,
  ClipboardList,
  ShieldAlert
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F6F3EE] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Copy (Left) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#E3EDEB] border border-[#CFC8BB] text-[11px] font-mono uppercase tracking-wider text-[#1F4B4A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5B]" />
              <span>Sample Diagnostic · Illustrative Data</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-medium leading-[1.08] tracking-tight text-[#1E2A2B]">
              Find where your meetings go missing.
            </h1>

            <p className="text-base sm:text-lg text-[#4A5757] leading-relaxed max-w-[54ch]">
              Some calls get recorded. Some don't. Some signals fire. Some don't. I'll trace one meeting at a time, from invite to CRM update, and tell you exactly where it breaks, <strong className="text-[#1E2A2B] font-semibold">before changing anything</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link to="/app/trace">
                <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Trace a Missed Meeting
                </Button>
              </Link>
              <Link to="/app/findings">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto" leftIcon={<ClipboardList className="w-4 h-4 text-[#7B8786]" />}>
                  Explore Findings & Scope
                </Button>
              </Link>
            </div>

            {/* Micro proof strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#7B8786] border-t border-[#E2DDD3]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3F7D5B]" />
                <span>Zero unsolicited code rewrites</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3F7D5B]" />
                <span>Written root-cause report first</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3F7D5B]" />
                <span>You approve scope before fixes</span>
              </div>
            </div>
          </div>

          {/* Hero Visual (Right) */}
          <div className="lg:col-span-6">
            <HeroPipelineVisual />
          </div>
        </div>
      </section>

      {/* Section 2: "Two problems, one trace" */}
      <section className="py-16 border-t border-[#E2DDD3] bg-[#FBF9F6]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1F4B4A] font-semibold">
              The Client Problem
            </span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-[#1E2A2B] mt-1">
              Two problems, one trace.
            </h2>
            <p className="text-sm text-[#4A5757] mt-2">
              Both issues stem from the same root reality: failures happen across system handoffs, not inside a single function.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem 1 Card: Recording Reliability */}
            <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5DEDA] text-[#A8433A] flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#A8433A]">Problem 1</span>
                    <h3 className="font-serif text-lg font-semibold text-[#1E2A2B]">
                      Recording Reliability
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4A5757] leading-relaxed mb-4">
                  "Bot joins some calls, misses others." Why does a bot fail to appear even when the customer accepted the invite?
                </p>

                <div className="space-y-2 text-xs text-[#1E2A2B]">
                  <div className="p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3] flex items-start gap-2">
                    <span className="text-[#1F4B4A] font-bold">•</span>
                    <span><strong>Recurring events:</strong> Google Calendar sub-instances detached from master series.</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3] flex items-start gap-2">
                    <span className="text-[#1F4B4A] font-bold">•</span>
                    <span><strong>Lobby timeouts:</strong> Recall bot leaves after 600s waiting in Zoom waiting room before host arrives.</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#FBF9F6] border border-[#E2DDD3] flex items-start gap-2">
                    <span className="text-[#1F4B4A] font-bold">•</span>
                    <span><strong>OAuth expiration:</strong> 90-day tokens expiring silently over weekends without cron refresh.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2DDD3]">
                <Link to="/app/meetings" className="text-xs text-[#1F4B4A] font-semibold hover:underline flex items-center justify-between">
                  <span>Explore Missed Meetings Forensics & Cause Taxonomy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Problem 2 Card: Trigger Reliability */}
            <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F3E3D8] text-[#B4643C] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#B4643C]">Problem 2</span>
                    <h3 className="font-serif text-lg font-semibold text-[#1E2A2B]">
                      Trigger Reliability
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#4A5757] leading-relaxed mb-4">
                  "Signals fire inconsistently." Prompting needs contextual polarity, not brittle keyword cues that hallucinate risks.
                </p>

                {/* Contrast Box */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-[#F3E3D8]/50 border border-[#E6C7B6] flex items-center justify-between">
                    <span className="italic text-[#1E2A2B]">"we may need to delay launch because of legal"</span>
                    <span className="text-[10px] font-mono uppercase font-bold bg-[#B4643C] text-white px-1.5 py-0.5 rounded">
                      True Risk (+7d)
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[#F6F3EE] border border-[#E2DDD3] flex items-center justify-between">
                    <span className="italic text-[#7B8786]">"our other vendor had a problem last quarter"</span>
                    <span className="text-[10px] font-mono uppercase font-bold bg-[#E2DDD3] text-[#7B8786] px-1.5 py-0.5 rounded">
                      No Change (Noise)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7B8786] pt-1">
                    Brittle keyword regex flags "problem" wrongly and misses "delay launch" without explicit schema rules.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2DDD3]">
                <Link to="/app/signals" className="text-xs text-[#1F4B4A] font-semibold hover:underline flex items-center justify-between">
                  <span>Open Signal Lab (Compare Keyword vs Context)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Pinned Scroll Story */}
      <ScrollStory />

      {/* Section 4: Proof in the demo (CTA Cards) */}
      <section className="py-20 max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1F4B4A] font-semibold">
            Interactive Prototype
          </span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-[#1E2A2B] mt-1">
            Explore the live diagnostic tool
          </h2>
          <p className="text-xs sm:text-sm text-[#4A5757] mt-2">
            Click into any screen to experience how I inspect traces, evaluate extraction prompts, and gate scope before writing code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Pipeline Trace */}
          <Link to="/app/trace" className="group">
            <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] hover:shadow-[0_4px_16px_rgba(30,42,43,0.08)] hover:border-[#1F4B4A] hover:-translate-y-0.5 transition-all flex flex-col h-full justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E3EDEB] text-[#1F4B4A] flex items-center justify-center mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1E2A2B] group-hover:text-[#1F4B4A] transition-colors">
                  Pipeline Trace
                </h3>
                <p className="text-xs text-[#4A5757] mt-2 leading-relaxed">
                  Select any of the 30 sample meetings. Watch the 6 stages animate sequentially and halt at the exact failure point with log evidence.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-[#1F4B4A] font-semibold">
                <span>Launch Trace Inspector</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 2: Signal Lab */}
          <Link to="/app/signals" className="group">
            <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] hover:shadow-[0_4px_16px_rgba(30,42,43,0.08)] hover:border-[#1F4B4A] hover:-translate-y-0.5 transition-all flex flex-col h-full justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F3E3D8] text-[#B4643C] flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1E2A2B] group-hover:text-[#B4643C] transition-colors">
                  Signal Lab
                </h3>
                <p className="text-xs text-[#4A5757] mt-2 leading-relaxed">
                  Toggle between keyword heuristics and context-aware extraction. See how false positives disappear and true legal delays are captured.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-[#B4643C] font-semibold">
                <span>Test Extraction Lab</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Card 3: Delivery Funnel */}
          <Link to="/app/delivery" className="group">
            <div className="bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] hover:shadow-[0_4px_16px_rgba(30,42,43,0.08)] hover:border-[#1F4B4A] hover:-translate-y-0.5 transition-all flex flex-col h-full justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#DEE9F1] text-[#3E6A8A] flex items-center justify-center mb-4">
                  <GitFork className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1E2A2B] group-hover:text-[#3E6A8A] transition-colors">
                  Delivery Funnel
                </h3>
                <p className="text-xs text-[#4A5757] mt-2 leading-relaxed">
                  Understand the "silent loss" phenomenon: 9 successfully recorded calls never reached Monday.com due to webhook and schema drops.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs text-[#3E6A8A] font-semibold">
                <span>View Reconciliation Funnel</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
