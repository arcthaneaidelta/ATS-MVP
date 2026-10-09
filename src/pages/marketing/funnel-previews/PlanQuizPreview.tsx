import React, { useState } from 'react';
import { useDemoStore } from '../../../store/demoStore';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Check, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PlanQuizPreview: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const { addLead } = useDemoStore();
  const [step, setStep] = useState(1);
  const [beds, setBeds] = useState('4 Bedrooms');
  const [budget, setBudget] = useState('$450k – $550k');
  const [mustHave, setMustHave] = useState('Gourmet Kitchen & Scullery Pantry');
  const [market, setMarket] = useState('Fort Mill, SC (Harlow Creek)');
  const [timeline, setTimeline] = useState('Within 3 months');

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setStep(6); // Results screen
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      addLead({
        name: leadName,
        phone: leadPhone,
        email: leadEmail,
        communityName: 'Harlow Creek',
        communityId: 'harlow-creek',
        planName: 'The Calder',
        planId: 'calder',
        budgetRange: budget,
        timeline: timeline,
        score: 'Hot',
        stage: 'new',
        source: 'Meta Ads',
        tags: ['Floor Plan Quiz Lead', 'Matched: The Calder (94%)', 'Move-Up Buyer'],
      });
    }, 600);
  };

  return (
    <div className="space-y-6 text-[#1F2A27]">
      {/* Quiz Progress */}
      {step <= 5 && (
        <div>
          <div className="flex justify-between items-center text-[11px] text-[#79827D] font-mono mb-1.5">
            <span>QUESTION {step} OF {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% COMPLETE</span>
          </div>
          <div className="w-full h-1.5 bg-[#EDE8DD] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B4684A] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1: Bedrooms */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center">
            <h3 className="font-serif text-xl sm:text-2xl text-[#1F2A27] font-medium">
              How many bedrooms does your family need?
            </h3>
            <p className="text-xs text-[#79827D] mt-1">Select your space requirement.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['3 Bedrooms', '4 Bedrooms', '5+ Multi-Gen Bedrooms'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setBeds(opt);
                  handleNext();
                }}
                className={`p-4 rounded-[12px] border text-center transition-all ${
                  beds === opt
                    ? 'border-[#2F4A3F] bg-[#E0E8E3] text-[#2F4A3F] font-semibold'
                    : 'border-[#DDD6C8] bg-white text-[#1F2A27] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-sm">{opt}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Budget */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center">
            <h3 className="font-serif text-xl sm:text-2xl text-[#1F2A27] font-medium">
              What is your target investment range?
            </h3>
            <p className="text-xs text-[#79827D] mt-1">Including homesite & structural options.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['$380k – $450k', '$450k – $550k', '$550k – $750k+'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setBudget(opt);
                  handleNext();
                }}
                className={`p-4 rounded-[12px] border text-center transition-all ${
                  budget === opt
                    ? 'border-[#2F4A3F] bg-[#E0E8E3] text-[#2F4A3F] font-semibold'
                    : 'border-[#DDD6C8] bg-white text-[#1F2A27] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-sm">{opt}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Must Haves */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center">
            <h3 className="font-serif text-xl sm:text-2xl text-[#1F2A27] font-medium">
              What is your top must-have feature?
            </h3>
            <p className="text-xs text-[#79827D] mt-1">Our designs offer distinct architectural highlights.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              'Gourmet Kitchen & Scullery Pantry',
              'Main-Floor Primary Owner Suite',
              '3-Car Tandem / Side-Load Garage',
              'Screened Indoor/Outdoor Fireplace Porch',
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setMustHave(opt);
                  handleNext();
                }}
                className={`p-4 rounded-[12px] border text-left transition-all ${
                  mustHave === opt
                    ? 'border-[#2F4A3F] bg-[#E0E8E3] text-[#2F4A3F] font-semibold'
                    : 'border-[#DDD6C8] bg-white text-[#1F2A27] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-xs sm:text-sm">{opt}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Market */}
      {step === 4 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center">
            <h3 className="font-serif text-xl sm:text-2xl text-[#1F2A27] font-medium">
              Where would you love to build?
            </h3>
            <p className="text-xs text-[#79827D] mt-1">Select your preferred Carolina neighborhood.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              'Fort Mill, SC (Harlow Creek)',
              'Huntersville, NC (Marrow Ridge)',
              'Indian Trail, NC (Larkin Meadows)',
            ].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setMarket(opt);
                  handleNext();
                }}
                className={`p-4 rounded-[12px] border text-center transition-all ${
                  market === opt
                    ? 'border-[#2F4A3F] bg-[#E0E8E3] text-[#2F4A3F] font-semibold'
                    : 'border-[#DDD6C8] bg-white text-[#1F2A27] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-xs sm:text-sm">{opt}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Timeline */}
      {step === 5 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center">
            <h3 className="font-serif text-xl sm:text-2xl text-[#1F2A27] font-medium">
              When are you hoping to move?
            </h3>
            <p className="text-xs text-[#79827D] mt-1">Helps us curate move-in ready vs to-be-built lots.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Within 3 months', '3-6 months', '6-12 months'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  setTimeline(opt);
                  handleNext();
                }}
                className={`p-4 rounded-[12px] border text-center transition-all ${
                  timeline === opt
                    ? 'border-[#2F4A3F] bg-[#E0E8E3] text-[#2F4A3F] font-semibold'
                    : 'border-[#DDD6C8] bg-white text-[#1F2A27] hover:bg-[#F6F3EC]'
                }`}
              >
                <div className="text-sm">{opt}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 6: Results & Lead Capture */}
      {step === 6 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4C7A57] bg-[#E3EEE4] px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> 2 Match Calculations Found
            </span>
            <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
              Your Recommended Floor Plan: The Calder
            </h3>
            <p className="text-xs text-[#79827D]">
              94% Match for your 4-bedroom requirement with scullery kitchen at {market}.
            </p>
          </div>

          {/* Plan Highlight Card */}
          <div className="bg-white p-5 rounded-[14px] border border-[#DDD6C8] space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-serif text-lg text-[#1F2A27] font-medium">The Calder (Craftsman)</h4>
                <p className="text-xs text-[#79827D]">4 Bed • 3 Bath • 2,480 Sq Ft</p>
              </div>
              <span className="font-mono text-xs font-bold text-[#2F4A3F] bg-[#E0E8E3] px-2.5 py-1 rounded">
                From $449,900
              </span>
            </div>
            <p className="text-xs text-[#4A5550]">
              Matches your preference for open gourmet cooking with a hidden walk-in pantry,
              generous primary retreat, and covered back porch.
            </p>
          </div>

          {/* Lead Capture */}
          <div className="bg-white p-6 rounded-[14px] border border-[#DDD6C8]">
            {submitted ? (
              <div className="text-center space-y-3 py-3 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-[#E3EEE4] text-[#4C7A57] flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg text-[#1F2A27]">Lookbook & Virtual Tour Dispatched</h4>
                <p className="text-xs text-[#4A5550]">
                  Dana Whitfield has received your quiz preferences and texted you the interactive 3D tour link.
                </p>
                <Link to="/app/pipeline">
                  <Button variant="clay" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                    View Synced Lead in Pipeline
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div className="text-center pb-2 border-b border-[#EDE8DD]">
                  <h4 className="font-serif text-sm font-semibold text-[#1F2A27]">
                    Send Me The Calder Interactive 3D Tour & Site Maps
                  </h4>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Marcus Reyes"
                    className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                  />
                </div>

                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-[#79827D] mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
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
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="marcus@example.com"
                      className="w-full text-xs rounded-[8px] border border-[#DDD6C8] p-2 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="clay"
                    className="w-full font-semibold"
                    isLoading={isSubmitting}
                  >
                    Send My Floor Plan Match & Pricing
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
