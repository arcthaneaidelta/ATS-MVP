import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StartPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [datePref, setDatePref] = useState('Tuesday at 10:00 AM');
  const [notes, setNotes] = useState('');
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

  const deliverables = [
    '3 Complete Lead Funnels (Harlow Creek, Floor Plan Quiz, Custom Builds)',
    '12+ GoHighLevel Workflows (Speed-to-Lead <7s, 90-Day Nurture, Missed-Call Recovery)',
    '18 Custom Email & SMS Templates Tailored to Carolinas Home Buyers',
    'Social Planner Setup with 14-Day Evergreen Content Queues & Comment-to-Lead Bot',
    'Custom Telephony & A2P 10DLC Brand Registration for Local 704 Numbers',
    'Full Executive Attribution Dashboard (Cost Per Lead & Cost Per Contract)',
    '60-Minute Custom Video Training (8 Chapters) for Robert, OSCs & Agents',
    'Printable Role-Based SOP Checklists & Laminated Desk Reference Guides',
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F6F3EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
            Execution Roadmap
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1F2A27] font-normal mt-2">
            14-Day Go-Live Launch Plan
          </h1>
          <p className="text-base text-[#4A5550] mt-3 leading-relaxed">
            A structured, reliable rollout that gets Alder & Stone Homes capturing and converting
            leads without disrupting your current sales operations.
          </p>
        </div>

        {/* 3-Week Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-3">
            <span className="font-mono text-xs font-bold text-[#B4684A] bg-[#F0DFD5] px-2 py-0.5 rounded">
              WEEK 1: DAYS 1–5
            </span>
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium">Connect & Configure</h3>
            <p className="text-xs text-[#4A5550] leading-relaxed">
              Domain routing, DNS records (SPF, DKIM, DMARC), A2P 10DLC trust hub submission,
              Twilio telephony setup, and team user seats for 6 staff members.
            </p>
            <ul className="text-xs text-[#79827D] space-y-1 pt-1">
              <li className="flex items-center gap-1.5">• Custom sub-account setup</li>
              <li className="flex items-center gap-1.5">• Round-robin lead routing rules</li>
              <li className="flex items-center gap-1.5">• Quiet hours schedule config</li>
            </ul>
          </div>

          <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-3">
            <span className="font-mono text-xs font-bold text-[#2F4A3F] bg-[#E0E8E3] px-2 py-0.5 rounded">
              WEEK 2: DAYS 6–10
            </span>
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium">Build & Populate</h3>
            <p className="text-xs text-[#4A5550] leading-relaxed">
              Deploy the 3 custom funnels with your photography and floor plans, load the 90-day
              educational nurture email/SMS sequences, and schedule the social calendar.
            </p>
            <ul className="text-xs text-[#79827D] space-y-1 pt-1">
              <li className="flex items-center gap-1.5">• 18 email & SMS templates</li>
              <li className="flex items-center gap-1.5">• Comment-to-Lead keyword bots</li>
              <li className="flex items-center gap-1.5">• 7-stage pipeline customization</li>
            </ul>
          </div>

          <div className="bg-[#FBF9F4] p-6 rounded-[16px] border border-[#DDD6C8] space-y-3">
            <span className="font-mono text-xs font-bold text-[#4C7A57] bg-[#E3EEE4] px-2 py-0.5 rounded">
              WEEK 3: DAYS 11–14
            </span>
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium">Train & Launch</h3>
            <p className="text-xs text-[#4A5550] leading-relaxed">
              Deliver the 60-minute recorded video training, host a 30-minute team rehearsal
              with simulated leads, hand over written SOPs, and switch ads live.
            </p>
            <ul className="text-xs text-[#79827D] space-y-1 pt-1">
              <li className="flex items-center gap-1.5">• 60-min custom video handover</li>
              <li className="flex items-center gap-1.5">• Live test lead roleplay</li>
              <li className="flex items-center gap-1.5">• 30 days post-launch support</li>
            </ul>
          </div>
        </div>

        {/* 2-Column: Scope Deliverables Checklist & Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Deliverables */}
          <div className="lg:col-span-6 bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#C5BCA9] space-y-4">
            <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
              Everything Included in the Fixed Scope
            </h3>
            <p className="text-xs text-[#79827D]">
              No surprise add-ons. A turnkey operating engine handed over cleanly.
            </p>

            <div className="space-y-2.5 pt-2">
              {deliverables.map((deliv, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1F2A27]">
                  <CheckCircle2 className="w-4 h-4 text-[#4C7A57] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{deliv}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#DDD6C8] flex items-center justify-between text-xs text-[#79827D]">
              <span className="font-medium text-[#2F4A3F]">Post-Launch Warranty:</span>
              <span>30 Days Bug Fixing & Calibration Included</span>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[16px] border border-[#DDD6C8] shadow-xs">
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium mb-1">
              Schedule Your 20-Minute Kickoff Call
            </h3>
            <p className="text-xs text-[#79827D] mb-6">
              Discuss your current GoHighLevel account or initiate a fresh setup.
            </p>

            {submitted ? (
              <div className="bg-[#E3EEE4] border border-[#C2DEC5] p-6 rounded-[12px] text-center space-y-3 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-[#4C7A57] text-white flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-[#1F2A27]">Strategy Call Reserved</h4>
                <p className="text-xs text-[#4A5550] leading-relaxed">
                  Thank you, {name}! A calendar invite for {datePref} has been dispatched to {email}.
                  We look forward to walking through the Alder & Stone rollout.
                </p>
                <div className="pt-2">
                  <Link to="/app">
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Explore Live Prototype in the Meantime
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#79827D] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Robert Alder"
                    className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2.5 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#79827D] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="robert@alderstonehomes.com"
                      className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2.5 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#79827D] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(704) 555-0101"
                      className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2.5 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#79827D] mb-1">
                    Preferred Call Time
                  </label>
                  <select
                    value={datePref}
                    onChange={(e) => setDatePref(e.target.value)}
                    className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2.5 text-[#1F2A27] focus:outline-none"
                  >
                    <option>Tuesday at 10:00 AM</option>
                    <option>Wednesday at 02:00 PM</option>
                    <option>Thursday at 11:30 AM</option>
                    <option>Friday at 03:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#79827D] mb-1">
                    Any specific communities or questions?
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="We build in Fort Mill and Huntersville with a team of 6..."
                    className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2.5 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="clay" className="w-full" isLoading={isSubmitting}>
                    Lock In 20-Minute Strategy Call
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
