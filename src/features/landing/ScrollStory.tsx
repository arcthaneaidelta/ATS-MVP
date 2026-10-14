import React, { useState } from 'react';
import { Calendar, Bot, Video, FileText, Sparkles, Workflow, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ScrollStory: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      num: '01',
      title: 'Review Code and Bot Configuration',
      summary: 'Audit Base44 endpoints, Google Calendar webhook subscriptions, and Recall.ai bot params before proposing changes.',
      details: 'Inspect OAuth token refresh routines, waiting room timeout defaults (e.g. 600s vs host habits), and whether calendar sync watches recurrence overrides or only master event IDs.',
      highlightedStage: 'calendar'
    },
    {
      num: '02',
      title: 'Compare Recent Hits and Misses',
      summary: 'Analyze last 30 meetings side-by-side to detect structural patterns rather than guessing per incident.',
      details: 'Group misses into the 7 primary cause categories: Calendar sync gap, Recurring mismatch, Lobby timing, OAuth expiration, API scheduling, Webhook timeouts, and Monday schema mapping.',
      highlightedStage: 'bot_scheduled'
    },
    {
      num: '03',
      title: 'Find the Stage Where Each Miss Stops',
      summary: 'Trace every call across the 6-stage pipeline to isolate whether the failure was upstream, in-meeting, or downstream.',
      details: 'Did the bot fail to queue? Did it wait in the lobby and timeout? Did the webhook return 504? Did the LLM prompt hallucinate? Each stage has clear log artifacts.',
      highlightedStage: 'bot_recording'
    },
    {
      num: '04',
      title: 'Reproduce and Confirm the Root Cause',
      summary: 'Run synthetic test cases for each failure mode in staging or sandbox environments.',
      details: 'Simulate delayed host entry (>10 mins), expired token payloads, shifted recurring instances, and large transcript webhook timeouts to confirm the fix before deploying.',
      highlightedStage: 'transcript'
    },
    {
      num: '05',
      title: 'Smallest Fix, Agreed Scope, and Handoff',
      summary: 'Implement targeted, low-risk patches approved in advance, complete with a 1-page operator runbook.',
      details: 'Zero unsolicited architectural rewrites. You approve the scope in writing first, test the fixes end-to-end, and receive a runbook so your team remains completely self-sufficient.',
      highlightedStage: 'crm_update'
    }
  ];

  const stagesList = [
    { id: 'calendar', name: '1. Calendar Sync', icon: Calendar },
    { id: 'bot_scheduled', name: '2. Bot Scheduled', icon: Bot },
    { id: 'bot_recording', name: '3. Bot Joined & Lobby', icon: Video },
    { id: 'transcript', name: '4. Webhook Transcript', icon: FileText },
    { id: 'llm_extraction', name: '5. LLM Extraction', icon: Sparkles },
    { id: 'crm_update', name: '6. Monday.com Push', icon: Workflow }
  ];

  return (
    <section id="diagnosis" className="py-20 border-t border-[#E2DDD3] bg-[#FBF9F6]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#1F4B4A] font-semibold">
            The Diagnostic Method
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#1E2A2B] mt-1.5">
            How I'd diagnose it — before writing a line of new code.
          </h2>
          <p className="text-sm text-[#4A5757] mt-3 leading-relaxed">
            Diagnosing multi-system pipelines requires structured forensics across calendars, bot APIs, webhooks, and prompt models. Here is the exact 5-step methodology I follow.
          </p>
        </div>

        {/* 2-Column Desktop layout (Pinned diagram on left, interactive steps on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (Sticky Diagram) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 bg-[#FFFFFF] border border-[#CFC8BB] rounded-[16px] p-6 shadow-[0_1px_2px_rgba(30,42,43,0.06)] space-y-4">
              <div className="pb-3 border-b border-[#E2DDD3]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7B8786]">
                  Active Stage Focus
                </span>
                <h3 className="font-serif text-base font-semibold text-[#1E2A2B]">
                  Pipeline Architecture
                </h3>
              </div>

              <div className="space-y-2">
                {stagesList.map((st) => {
                  const Icon = st.icon;
                  const isHighlighted = st.id === steps[activeStep].highlightedStage;
                  return (
                    <div
                      key={st.id}
                      className={`flex items-center gap-3 p-3 rounded-[10px] transition-all duration-200 border ${
                        isHighlighted
                          ? 'bg-[#E3EDEB] border-[#1F4B4A] shadow-sm translate-x-1'
                          : 'bg-[#FBF9F6] border-[#E2DDD3]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          isHighlighted
                            ? 'bg-[#1F4B4A] text-white'
                            : 'bg-[#FFFFFF] border border-[#CFC8BB] text-[#7B8786]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isHighlighted ? 'text-[#1F4B4A] font-semibold' : 'text-[#4A5757]'
                        }`}
                      >
                        {st.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#E2DDD3] text-[11px] text-[#7B8786] flex items-center justify-between">
                <span>Phase: Step {steps[activeStep].num} active</span>
                <Link to="/app/trace" className="text-[#1F4B4A] font-medium hover:underline flex items-center gap-1">
                  <span>Open trace</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (Steps) */}
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-[16px] border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FFFFFF] border-[#1F4B4A] shadow-[0_4px_16px_rgba(30,42,43,0.06)] ring-1 ring-[#1F4B4A]/10'
                      : 'bg-[#FBF9F6] border-[#E2DDD3] hover:border-[#CFC8BB] hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold text-[#1F4B4A] bg-[#E3EDEB] px-2 py-0.5 rounded border border-[#CFC8BB]">
                      STEP {step.num}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-[#1E2A2B]">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1E2A2B] font-medium leading-relaxed mb-2">
                    {step.summary}
                  </p>

                  <p className="text-xs text-[#4A5757] leading-relaxed">
                    {step.details}
                  </p>

                  {isActive && (
                    <div className="mt-4 pt-3 border-t border-[#E2DDD3] flex items-center gap-2 text-xs text-[#3F7D5B] font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready for Milestone 1 diagnostic scope</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
