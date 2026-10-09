import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Check, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gap, setGap] = useState('slow_response');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <footer className="relative bg-[#1F2A27] text-[#EDE8DD] pt-20 pb-12 overflow-hidden border-t border-[#3A4743]">
      {/* Subtle site-plan backdrop in dark theme */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 1200 800" fill="none" className="w-full h-full object-cover">
          <path d="M-50 200 C 250 180, 450 350, 750 320 C 1000 290, 1150 480, 1300 450" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="8 6" />
          <polygon points="430,60 550,90 515,225 410,180" stroke="#FFFFFF" strokeWidth="1" />
          <polygon points="760,650 830,600 870,680 800,730" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="850" cy="720" r="60" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Line */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
            Ready-to-Deploy GoHighLevel Solution
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal mt-2 leading-[1.15]">
            Let’s put this system to work before the next lead comes in.
          </h2>
          <p className="text-[#A7B3AE] text-base mt-4 leading-relaxed max-w-2xl">
            Customized for Alder & Stone Homes in Charlotte, NC. Includes turnkey funnels,
            90-day buyer nurture, social automation, and the full 60-minute handover video.
          </p>
        </div>

        {/* 2-Column Pitch & Start Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#34423E]">
          {/* Left Column: Interactive Proposal Kickoff Form */}
          <div className="lg:col-span-6 bg-[#263330] p-7 sm:p-8 rounded-[16px] border border-[#3E4E49]">
            <h3 className="font-serif text-xl text-white font-medium mb-1">
              Request Your 14-Day Go-Live Plan
            </h3>
            <p className="text-xs text-[#A7B3AE] mb-6">
              Enter your details to generate a customized Alder & Stone setup blueprint.
            </p>

            {submitted ? (
              <div className="bg-[#2F4A3F]/50 border border-[#4C7A57] p-6 rounded-[12px] text-center space-y-3 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-full bg-[#4C7A57] text-white flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-white">Blueprint Dispatched</h4>
                <p className="text-xs text-[#C5D5CC] leading-relaxed">
                  Thank you, {name}! Your personalized launch plan and GoHighLevel sub-account migration roadmap have been scheduled. I’ll follow up with your customized scope breakdown.
                </p>
                <div className="pt-2">
                  <Link to="/app">
                    <Button variant="clay" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore Live Prototype in the Meantime
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5D5CC] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Robert Alder"
                    className="w-full bg-[#1F2A27] border border-[#3E4E49] rounded-[8px] px-3.5 py-2.5 text-sm text-white placeholder:text-[#64726D] focus:outline-none focus:border-[#B4684A] focus:ring-1 focus:ring-[#B4684A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5D5CC] mb-1.5">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="robert@alderstonehomes.com"
                    className="w-full bg-[#1F2A27] border border-[#3E4E49] rounded-[8px] px-3.5 py-2.5 text-sm text-white placeholder:text-[#64726D] focus:outline-none focus:border-[#B4684A] focus:ring-1 focus:ring-[#B4684A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5D5CC] mb-1.5">
                    What is your biggest follow-up bottleneck right now?
                  </label>
                  <select
                    value={gap}
                    onChange={(e) => setGap(e.target.value)}
                    className="w-full bg-[#1F2A27] border border-[#3E4E49] rounded-[8px] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#B4684A]"
                  >
                    <option value="slow_response">Leads take hours or days to get their first response</option>
                    <option value="lead_inconsistency">Follow-up stops after 1-2 attempts; no 90-day nurture</option>
                    <option value="social">Social media isn't driving direct leads into our CRM</option>
                    <option value="reporting">Can't see cost-per-lead or cost-per-contract by channel</option>
                    <option value="team_adoption">Team doesn't use the CRM because it's too complicated</option>
                  </select>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="clay"
                    isLoading={isSubmitting}
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Submit & Receive 14-Day Launch Plan
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Handover Timeline & Deliverables */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold mb-3">
                Implementation Timeline
              </h4>
              <h3 className="font-serif text-2xl text-white font-medium mb-6">
                Turnkey handover in 3 clear milestones.
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2F4A3F] border border-[#4C7A57] text-[#C5D5CC] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Day 1–3: Account & Telephony Setup</h5>
                    <p className="text-xs text-[#A7B3AE] mt-0.5 leading-relaxed">
                      Connect custom domain, configure A2P 10DLC SMS registration, set up local tracking numbers, and establish round-robin sales routing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#2F4A3F] border border-[#4C7A57] text-[#C5D5CC] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Day 4–8: Funnels & Workflow Activation</h5>
                    <p className="text-xs text-[#A7B3AE] mt-0.5 leading-relaxed">
                      Deploy Harlow Creek, Floor Plan Quiz, and Custom Build funnels. Load the 90-day buyer nurture sequence and social planner queues.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#B4684A] text-white font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    03
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-white">Day 9–10: Team Training & Go-Live</h5>
                    <p className="text-xs text-[#A7B3AE] mt-0.5 leading-relaxed">
                      Deliver the custom 60-minute recorded video training, SOP checklists, and lead a live 30-minute team rehearsal. System goes live.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct contact note */}
            <div className="p-4 rounded-[12px] bg-[#263330] border border-[#3E4E49] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#B4684A]" />
                <div>
                  <h6 className="text-xs font-semibold text-white">Prefer to talk through your communities?</h6>
                  <p className="text-[11px] text-[#A7B3AE]">Book a 20-minute architecture strategy call.</p>
                </div>
              </div>
              <Link to="/start">
                <Button variant="secondary" size="sm" className="bg-[#1F2A27] text-white border-[#4E5E58]">
                  Schedule Call
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#79827D] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-white font-medium text-sm">Groundwork</span>
            <span>—</span>
            <span>Built on GoHighLevel for US Home Builders</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/system" className="hover:text-[#EDE8DD] transition-colors">System</Link>
            <Link to="/funnels" className="hover:text-[#EDE8DD] transition-colors">Funnels</Link>
            <Link to="/academy" className="hover:text-[#EDE8DD] transition-colors">Academy</Link>
            <Link to="/compliance" className="hover:text-[#EDE8DD] transition-colors">Compliance</Link>
            <Link to="/app" className="text-[#B4684A] font-medium hover:underline">Interactive Preview</Link>
          </div>

          <div className="text-[11px] text-[#64726D]">
            Interactive demo prototype. All builder data simulated for Alder & Stone Homes.
          </div>
        </div>
      </div>
    </footer>
  );
};
