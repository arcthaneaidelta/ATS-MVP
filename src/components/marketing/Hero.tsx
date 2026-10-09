import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { SitePlanBg } from './SitePlanBg';
import { ArrowRight, Zap, CheckCircle2, Bot, Calendar, Sparkles } from 'lucide-react';

export const Hero: React.FC<{ onScrollToSimulator: () => void }> = ({ onScrollToSimulator }) => {
  // 14-second loop state machine for hero phone and pipeline preview
  const [loopStep, setLoopStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoopStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] pt-32 pb-20 flex flex-col justify-between overflow-hidden bg-[#F6F3EC]">
      {/* Drifting site plan SVG motif */}
      <SitePlanBg opacity={0.06} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0E8E3] border border-[#C5D5CC] text-[#2F4A3F] text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#4C7A57] animate-pulse" />
              Engineered for US Home Builders
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[62px] text-[#1F2A27] font-normal tracking-tight leading-[1.08] max-w-2xl">
              Every inquiry answered in seconds.{' '}
              <span className="italic font-light text-[#B4684A]">Every buyer followed</span> until closing.
            </h1>

            <p className="text-base sm:text-lg text-[#4A5550] leading-relaxed max-w-xl font-normal">
              A complete lead capture, nurture, and conversion system customized for{' '}
              <strong className="font-semibold text-[#1F2A27]">Alder & Stone Homes</strong> — built on GoHighLevel,
              enforced with US compliance safeguards, and trained into your team in 60 minutes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/app">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-md"
                >
                  Try the Live System
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={onScrollToSimulator}
                leftIcon={<Zap className="w-4 h-4 text-[#B4684A]" />}
              >
                Watch a Lead Come In
              </Button>
            </div>

            {/* Subtle disclaimer */}
            <div className="pt-1 flex items-center gap-2 text-xs text-[#79827D]">
              <span className="font-medium text-[#2F4A3F]">Alder & Stone Homes</span>
              <span>•</span>
              <span>Charlotte & Fort Mill Communities</span>
              <span>•</span>
              <span>6-Person Sales Team Configured</span>
            </div>
          </div>

          {/* Right Column: Live Dual Composition (Phone + Moving Pipeline Card) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] flex items-center gap-4">
              {/* Phone Mockup (Looping SMS Thread) */}
              <div className="w-[280px] sm:w-[300px] h-[490px] bg-[#FBF9F4] rounded-[36px] border-[6px] border-[#1F2A27] shadow-[0_16px_40px_rgba(31,42,39,0.14)] flex flex-col overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-[#1F2A27] rounded-full z-20" />

                {/* Header */}
                <div className="pt-6 px-4 pb-2.5 border-b border-[#DDD6C8] bg-[#F6F3EC]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#2F4A3F] text-white flex items-center justify-center text-[10px] font-semibold">
                      A&S
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-[#1F2A27] leading-tight">
                        Dana Whitfield (OSC)
                      </h4>
                      <p className="text-[9px] text-[#4C7A57] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4C7A57]" />
                        Speed-to-Lead Active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thread Body */}
                <div className="flex-1 p-3 space-y-2.5 overflow-y-auto text-[11px] bg-[#FBF9F4]">
                  {/* Message 1: Buyer inquiry */}
                  <div className="flex flex-col items-end">
                    <div className="bg-[#2F4A3F] text-white rounded-[12px] rounded-br-none px-3 py-2 max-w-[90%] shadow-2xs">
                      Is lot 14 at Harlow Creek still available? We love The Calder floor plan!
                    </div>
                    <span className="text-[8px] text-[#79827D] mt-0.5">09:14 AM</span>
                  </div>

                  {/* Message 2: Automated instant reply */}
                  <div
                    className={`flex flex-col items-start transition-opacity duration-300 ${
                      loopStep >= 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="bg-[#EDE8DD] text-[#1F2A27] border border-[#DDD6C8] rounded-[12px] rounded-bl-none px-3 py-2 max-w-[95%] shadow-2xs">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[8px] font-semibold text-[#B4684A] bg-[#F0DFD5] px-1 rounded flex items-center gap-0.5">
                          <Bot className="w-2.5 h-2.5" /> 7 SECONDS
                        </span>
                      </div>
                      Hi Marcus! Dana here with Alder & Stone Homes. Lot 14 has wooded views and is available! Want to tour this Saturday at 11am or 2pm?
                    </div>
                    <span className="text-[8px] text-[#79827D] mt-0.5">09:14 AM</span>
                  </div>

                  {/* Message 3: Buyer reply */}
                  <div
                    className={`flex flex-col items-end transition-opacity duration-300 ${
                      loopStep >= 2 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="bg-[#2F4A3F] text-white rounded-[12px] rounded-br-none px-3 py-2 max-w-[90%] shadow-2xs">
                      Saturday 11am works perfect! Elena and I will be there.
                    </div>
                    <span className="text-[8px] text-[#79827D] mt-0.5">09:16 AM</span>
                  </div>

                  {/* Message 4: Confirmation */}
                  <div
                    className={`flex flex-col items-start transition-opacity duration-300 ${
                      loopStep >= 3 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="bg-[#E3EEE4] text-[#1F2A27] border border-[#C2DEC5] rounded-[12px] rounded-bl-none px-3 py-2 max-w-[95%] shadow-2xs">
                      <div className="flex items-center gap-1 text-[#4C7A57] font-semibold text-[9px] mb-0.5">
                        <Calendar className="w-2.5 h-2.5" /> TOUR CONFIRMED
                      </div>
                      Locked in! Priya will meet you at the Harlow Creek model. Calendar invite sent!
                    </div>
                    <span className="text-[8px] text-[#79827D] mt-0.5">09:17 AM</span>
                  </div>
                </div>

                {/* Bottom status */}
                <div className="p-2 border-t border-[#DDD6C8] bg-white text-[10px] text-[#79827D] flex items-center justify-between">
                  <span>Simulated Phone Interaction</span>
                  <span className="text-[#B4684A] font-semibold font-mono">Looping</span>
                </div>
              </div>

              {/* Floating Pipeline Stage Card (Animated beside phone) */}
              <div className="hidden sm:flex flex-col gap-3 w-40 shrink-0">
                <div className="bg-white p-3.5 rounded-[12px] border border-[#DDD6C8] shadow-[0_4px_12px_rgba(31,42,39,0.08)]">
                  <div className="text-[9px] uppercase tracking-wider text-[#79827D] font-semibold mb-1">
                    Live Pipeline
                  </div>
                  <div className="text-xs font-semibold text-[#1F2A27]">Marcus Reyes</div>
                  <div className="text-[10px] text-[#4A5550]">Harlow Creek • $514k</div>

                  <div className="mt-2.5 pt-2 border-t border-[#EDE8DD]">
                    <span className="text-[9px] uppercase tracking-wide text-[#79827D] block mb-1">
                      Current Stage:
                    </span>
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all duration-300 ${
                        loopStep < 3
                          ? 'bg-[#E1EAF0] text-[#36566E]'
                          : 'bg-[#E3EEE4] text-[#4C7A57]'
                      }`}
                    >
                      {loopStep < 3 ? 'New Inquiry' : 'Tour Booked'}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FBF9F4] p-3 rounded-[12px] border border-[#DDD6C8] text-[11px] text-[#4A5550] space-y-1">
                  <div className="flex items-center gap-1 text-[#4C7A57] font-semibold text-[10px]">
                    <CheckCircle2 className="w-3 h-3" /> SLA Responded
                  </div>
                  <div className="font-mono text-xs font-bold text-[#1F2A27]">0:07 sec</div>
                  <p className="text-[9px] text-[#79827D] leading-tight">
                    Instant text + calendar automation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip Below Hero (Hairline divided) */}
      <div className="w-full border-t border-b border-[#DDD6C8] bg-[#FBF9F4]/80 mt-12 py-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-[#DDD6C8]">
            <div className="lg:px-6">
              <div className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-medium tabular-nums">
                &lt; 10 Seconds
              </div>
              <p className="text-xs text-[#79827D] mt-1 font-medium">
                Automated first touch across SMS & lookbook email
              </p>
            </div>

            <div className="lg:px-6">
              <div className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-medium tabular-nums">
                7 Channels
              </div>
              <p className="text-xs text-[#79827D] mt-1 font-medium">
                SMS, email, IG, FB, phone bridge in one unified inbox
              </p>
            </div>

            <div className="lg:px-6">
              <div className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-medium tabular-nums">
                90-Day Nurture
              </div>
              <p className="text-xs text-[#79827D] mt-1 font-medium">
                Automated construction, financing, and VIP tour touches
              </p>
            </div>

            <div className="lg:px-6">
              <div className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-medium tabular-nums">
                60-Min Training
              </div>
              <p className="text-xs text-[#79827D] mt-1 font-medium">
                Turnkey recorded video & SOPs for sales counselors & agents
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
