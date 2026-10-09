import React, { useState } from 'react';
import { useDemoStore } from '../../../store/demoStore';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Check, Calendar, ArrowRight, Home, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CommunityFunnelPreview: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const { addLead } = useDemoStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [timeline, setTimeline] = useState('Within 3 months');
  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !consent) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Add to store
      addLead({
        name,
        phone,
        email,
        communityName: 'Harlow Creek',
        communityId: 'harlow-creek',
        planName: 'The Calder',
        planId: 'calder',
        budgetRange: '$480k – $540k',
        timeline,
        score: 'Hot',
        stage: 'new',
        source: 'Meta Ads',
        tags: ['Harlow Creek Funnel', 'Pre-Approved', 'VIP Lookbook Request'],
      });
    }, 600);
  };

  return (
    <div className="space-y-6 text-[#1F2A27]">
      {/* Funnel Hero */}
      <div className="text-center space-y-2">
        <Badge variant="clay">Fort Mill, SC • Master-Planned Community</Badge>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#1F2A27] font-medium leading-tight">
          Welcome Home to Harlow Creek
        </h2>
        <p className="text-xs text-[#4A5550] max-w-lg mx-auto">
          Cottage & Craftsman designs from <strong className="text-[#2F4A3F] font-semibold">$429,900</strong>.
          Top-rated Fort Mill schools, direct greenway trail access, and private wooded homesites.
        </p>
      </div>

      {/* Quick Move-In Homes Cards */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-[#79827D] uppercase">Lot 14 • Quick Delivery</span>
              <h4 className="text-sm font-semibold text-[#1F2A27]">The Calder Craftsman</h4>
            </div>
            <span className="text-xs font-mono font-bold text-[#2F4A3F]">$514,200</span>
          </div>
          <p className="text-[11px] text-[#4A5550]">
            4 Bed • 3 Bath • 2,480 SF • 9ft Quartz Island & Walk-in Scullery
          </p>
          <span className="inline-block text-[9px] bg-[#E3EEE4] text-[#4C7A57] font-semibold px-2 py-0.5 rounded-full">
            Available for December Move-In
          </span>
        </div>

        <div className="bg-white p-4 rounded-[12px] border border-[#DDD6C8] space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono text-[#79827D] uppercase">Lot 22 • Ranch Model</span>
              <h4 className="text-sm font-semibold text-[#1F2A27]">The Linden Single-Story</h4>
            </div>
            <span className="text-xs font-mono font-bold text-[#2F4A3F]">$449,900</span>
          </div>
          <p className="text-[11px] text-[#4A5550]">
            3 Bed • 2 Bath • 1,780 SF • Zero-Step Living & Screened Lanai
          </p>
          <span className="inline-block text-[9px] bg-[#E3EEE4] text-[#4C7A57] font-semibold px-2 py-0.5 rounded-full">
            Move-In Ready
          </span>
        </div>
      </div>

      {/* Lead Capture Form or Confirmation */}
      <div className="bg-white p-6 rounded-[14px] border border-[#DDD6C8] shadow-2xs">
        {submitted ? (
          <div className="text-center space-y-3 py-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-[#E3EEE4] text-[#4C7A57] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-[#1F2A27] font-medium">
              Thank you, {name}!
            </h3>
            <p className="text-xs text-[#4A5550] max-w-sm mx-auto">
              Dana Whitfield will text you in a moment with the Harlow Creek lot map.
              Check your inbox for the VIP Lookbook PDF.
            </p>
            <div className="pt-2">
              <Link to="/app/pipeline">
                <Button variant="clay" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  See Lead on the CRM Pipeline Side →
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="text-center pb-2 border-b border-[#EDE8DD]">
              <h3 className="font-serif text-base text-[#1F2A27] font-medium">
                Download the Harlow Creek VIP Lookbook & Pricing Sheet
              </h3>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Reyes"
                className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
              />
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
              <div>
                <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                  Mobile Number (SMS Updates)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(704) 555-0142"
                  className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marcus@example.com"
                  className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                Moving Timeline
              </label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none"
              >
                <option>Within 3 months</option>
                <option>3-6 months</option>
                <option>6-12 months</option>
                <option>Just browsing</option>
              </select>
            </div>

            {/* US TCPA Mandatory Consent Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-[10px] text-[#79827D] leading-tight cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-[#2F4A3F]"
                />
                <span>
                  By submitting, you agree to receive calls and texts from Alder & Stone Homes at the number provided, including automated messages. Consent is not a condition of purchase. Msg & data rates may apply. Reply STOP to opt out.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="clay"
                className="w-full"
                isLoading={isSubmitting}
                disabled={!consent}
              >
                Get VIP Floor Plans & Schedule Model Tour
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
