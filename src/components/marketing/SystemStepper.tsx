import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, ArrowRight, Bot, PhoneCall, Calendar, FileText, Sparkles } from 'lucide-react';

export const SystemStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: '01',
      title: 'Capture',
      tagline: 'Multi-Channel Entry Points',
      description: 'Funnels, Facebook/IG lead forms, Zillow/NHS portals, and website visitors feed into one clean funnel.',
      automations: [
        'Form webhook intake & deduplication',
        'TCPA consent compliance logging',
        'Automatic tagging by community and floor plan',
      ],
      teamAction: 'No manual data entry required.',
      toolReplaced: 'Manual spreadsheets, lost paper forms',
    },
    {
      number: '02',
      title: 'Respond',
      tagline: 'Sub-10-Second Engagement',
      description: 'Instant personalized SMS from assigned Sales Counselor, high-res lookbook email, and automated call bridge prompt.',
      automations: [
        'Instant SMS with weekend tour prompt',
        'PDF floor plan lookbook email',
        '5-minute counselor push notification & SLA countdown',
      ],
      teamAction: 'Counselor answers bridge call or responds to buyer text.',
      toolReplaced: 'Delayed callbacks hours or days later',
    },
    {
      number: '03',
      title: 'Nurture',
      tagline: '90-Day Multi-Touch Education',
      description: 'Long sales cycle management: bi-weekly craftsman construction highlights, financing guides, and new homesite release alerts.',
      automations: [
        'Behind-the-drywall 2x6 construction video',
        '2-1 mortgage buydown incentive breakdown',
        'Advance notice of new cul-de-sac lot releases',
      ],
      teamAction: 'System nurtures while team focuses on active tours.',
      toolReplaced: 'Dormant leads going cold in an inbox',
    },
    {
      number: '04',
      title: 'Book',
      tagline: 'Model Tours & Consultations',
      description: 'Self-serve tour scheduling with automated 24h, 2h, and 15m reminders including GPS gate codes and parking directions.',
      automations: [
        'Calendar invite sync (Outlook/Google)',
        '2-hour parking & model home arrival directions SMS',
        'Automated no-show rescue sequence if tour is missed',
      ],
      teamAction: 'Community agent greets buyer at decorated model home.',
      toolReplaced: 'Back-and-forth email scheduling and no-shows',
    },
    {
      number: '05',
      title: 'Close',
      tagline: 'Design Studio to Settlement',
      description: 'Post-tour homesite holds, design center selections prep, pre-construction checklists, and post-closing 5-star Google review requests.',
      automations: [
        'Personalized homesite pricing & 48h courtesy hold email',
        'Design Studio lookbook & selections appointment reminders',
        '14-day post-closing Google review request generator',
      ],
      teamAction: 'Execute purchase agreement and guide construction milestones.',
      toolReplaced: 'Disjointed paper files and forgotten review requests',
    },
  ];

  return (
    <section className="py-20 bg-[#FBF9F4] border-t border-b border-[#DDD6C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
            How The System Works
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1F2A27] font-normal mt-2">
            Five Steps from Inquiry to Closing
          </h2>
          <p className="text-sm text-[#4A5550] mt-2">
            Click through each stage to see the exact automations running behind the scenes.
          </p>
        </div>

        {/* 5-Step Horizontal Tab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-3.5 rounded-[12px] border transition-all duration-150 ${
                  isActive
                    ? 'bg-[#2F4A3F] text-white border-[#243A31] shadow-xs'
                    : 'bg-[#F6F3EC] text-[#4A5550] border-[#DDD6C8] hover:bg-[#EDE8DD] hover:border-[#C5BCA9]'
                }`}
              >
                <div
                  className={`font-mono text-xs font-semibold mb-1 ${
                    isActive ? 'text-[#C5D5CC]' : 'text-[#79827D]'
                  }`}
                >
                  {step.number}
                </div>
                <div className={`font-serif text-base font-medium ${isActive ? 'text-white' : 'text-[#1F2A27]'}`}>
                  {step.title}
                </div>
                <div className={`text-[11px] truncate ${isActive ? 'text-[#C5D5CC]' : 'text-[#79827D]'}`}>
                  {step.tagline}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detail Panel */}
        <div className="bg-[#F6F3EC] rounded-[16px] border border-[#C5BCA9] p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Description & Automations */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#B4684A]">
                  STAGE {steps[activeStep].number}
                </span>
                <span className="text-[#79827D]">•</span>
                <span className="text-xs uppercase font-semibold text-[#4A5550]">
                  {steps[activeStep].tagline}
                </span>
              </div>

              <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
                {steps[activeStep].title} Phase Architecture
              </h3>

              <p className="text-sm text-[#4A5550] leading-relaxed">
                {steps[activeStep].description}
              </p>

              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2A27]">
                  Automations Executing:
                </h4>
                {steps[activeStep].automations.map((auto, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#2F4A3F]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4C7A57] shrink-0" />
                    <span>{auto}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Team Routine & Legacy Replaced */}
            <div className="lg:col-span-5 bg-white p-5 rounded-[12px] border border-[#DDD6C8] space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#79827D] block mb-1">
                  What Your Team Does Here:
                </span>
                <p className="text-xs font-medium text-[#1F2A27] leading-relaxed">
                  {steps[activeStep].teamAction}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EDE8DD]">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#A5473B] block mb-1">
                  Old Chaotic Workflow Replaced:
                </span>
                <p className="text-xs text-[#79827D] line-through">
                  {steps[activeStep].toolReplaced}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
