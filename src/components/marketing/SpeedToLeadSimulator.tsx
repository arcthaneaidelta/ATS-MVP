import React, { useState, useEffect, useRef } from 'react';
import { useDemoStore } from '../../store/demoStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PhoneThread, PhoneMessage } from './PhoneThread';
import {
  Zap,
  RotateCcw,
  Play,
  Mail,
  PhoneCall,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const SpeedToLeadSimulator: React.FC<{ isStandalonePage?: boolean }> = ({
  isStandalonePage = false,
}) => {
  const { addLead, moveLeadStage } = useDemoStore();

  // Form state
  const [buyerName, setBuyerName] = useState('Marcus & Elena Reyes');
  const [phone, setPhone] = useState('(704) 555-0142');
  const [email, setEmail] = useState('marcus.reyes@cltmetro.net');
  const [community, setCommunity] = useState('Harlow Creek');
  const [budget, setBudget] = useState('$480k – $540k');
  const [timeline, setTimeline] = useState('Within 3 months');

  // Simulator controls
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [simulateNoPhone, setSimulateNoPhone] = useState<boolean>(false);
  const [simState, setSimState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  // Stepper events
  const [events, setEvents] = useState<
    Array<{ time: string; title: string; subtitle: string; icon: string; done: boolean }>
  >([]);

  // Phone thread state
  const [phoneMessages, setPhoneMessages] = useState<PhoneMessage[]>([]);
  const [isPhoneTyping, setIsPhoneTyping] = useState<boolean>(false);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Fill sample lead
  const handleUseSample = () => {
    setBuyerName('Marcus & Elena Reyes');
    setPhone('(704) 555-0142');
    setEmail('marcus.reyes@cltmetro.net');
    setCommunity('Harlow Creek');
    setBudget('$480k – $540k');
    setTimeline('Within 3 months');
    setSimulateNoPhone(false);
  };

  // Reset simulator
  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSimState('idle');
    setElapsedMs(0);
    setEvents([]);
    setPhoneMessages([]);
    setIsPhoneTyping(false);
  };

  const runSimulation = () => {
    handleReset();
    setSimState('running');
    startTimeRef.current = Date.now();

    const baseUnit = 1000 / speedMultiplier;

    // Start millisecond counter
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 50);

    // Initial event: Lead submitted
    setTimeout(() => {
      setEvents((prev) => [
        ...prev,
        {
          time: '0:00.4',
          title: 'Lead Ingested into GoHighLevel',
          subtitle: `Saved ${buyerName} into CRM with tag [Speed-to-Lead VIP]`,
          icon: 'lead',
          done: true,
        },
      ]);
    }, 400 / speedMultiplier);

    // SMS to buyer or Fallback if no phone
    if (!simulateNoPhone) {
      setTimeout(() => {
        setIsPhoneTyping(true);
      }, 700 / speedMultiplier);

      setTimeout(() => {
        setIsPhoneTyping(false);
        setPhoneMessages([
          {
            id: 'sim-msg-1',
            sender: 'system',
            text: `Hi Marcus — this is Dana from Alder & Stone Homes. Thanks for asking about ${community}! Want a quick tour this weekend? Reply 1 for Sat, 2 for Sun.`,
            time: 'Just now',
            isAutomated: true,
          },
        ]);
        setEvents((prev) => [
          ...prev,
          {
            time: '0:01.2',
            title: 'Personalized SMS Dispatched (<2s)',
            subtitle: 'Sent via local 704 area-code A2P 10DLC verified line',
            icon: 'sms',
            done: true,
          },
        ]);
      }, 1200 / speedMultiplier);
    } else {
      setTimeout(() => {
        setEvents((prev) => [
          ...prev,
          {
            time: '0:01.2',
            title: 'SMS Skipped (No Phone Number)',
            subtitle: 'Fallback triggered: prioritized high-intent email sequence',
            icon: 'warning',
            done: true,
          },
        ]);
      }, 1200 / speedMultiplier);
    }

    // Email lookbook sent
    setTimeout(() => {
      setEvents((prev) => [
        ...prev,
        {
          time: '0:02.0',
          title: 'Digital Brochure & Lookbook Emailed',
          subtitle: `Dispatched ${community} VIP Guide + The Calder floor plan PDF`,
          icon: 'email',
          done: true,
        },
      ]);
    }, 2000 / speedMultiplier);

    // Agent push notification & task
    setTimeout(() => {
      setEvents((prev) => [
        ...prev,
        {
          time: '0:03.0',
          title: 'Sales Counselor Notified (Dana Whitfield)',
          subtitle: 'Mobile push alert + Task: "Call buyer within 5 min SLA"',
          icon: 'task',
          done: true,
        },
      ]);
    }, 3000 / speedMultiplier);

    // Call bridge simulation
    setTimeout(() => {
      setEvents((prev) => [
        ...prev,
        {
          time: '0:04.5',
          title: 'Automated Call Bridge Triggered',
          subtitle: "Dialing Dana's mobile headset... ready to bridge Marcus on answer",
          icon: 'call',
          done: true,
        },
      ]);
    }, 4500 / speedMultiplier);

    // Final completion at 7.0 seconds
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setSimState('completed');
      setElapsedMs(7000);

      // Save to store so user can see it in pipeline!
      addLead({
        name: buyerName,
        phone: simulateNoPhone ? '(Not Provided)' : phone,
        email: email,
        communityName: community,
        communityId: community === 'Harlow Creek' ? 'harlow-creek' : 'marrow-ridge',
        budgetRange: budget,
        timeline: timeline,
        score: 'Hot',
        stage: 'new',
        source: 'Meta Ads',
        tags: ['Speed-to-Lead Simulator', 'Hot Lead'],
      });
    }, 7000 / speedMultiplier);
  };

  const formattedTimer = (elapsedMs / 1000).toFixed(1);

  return (
    <div className={`w-full ${isStandalonePage ? 'max-w-6xl mx-auto' : ''}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0DFD5] text-[#9B553B] text-xs font-semibold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              Live Interactive Benchmark
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#1F2A27] font-normal">
              Speed-to-Lead Simulator
            </h2>
            <p className="text-sm text-[#4A5550] mt-1 max-w-xl">
              Experience what happens behind the scenes in the first 7 seconds when a home buyer
              submits an inquiry on Alder & Stone’s funnels.
            </p>
          </div>

          {/* Controls: Speed, Error Variant, Reset */}
          <div className="flex items-center gap-2 bg-[#EDE8DD] p-1.5 rounded-[10px] border border-[#DDD6C8] text-xs">
            <span className="text-[#79827D] font-medium px-2">Speed:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  speedMultiplier === s
                    ? 'bg-[#2F4A3F] text-white'
                    : 'text-[#4A5550] hover:text-[#1F2A27]'
                }`}
              >
                {s}x
              </button>
            ))}

            <div className="h-4 w-[1px] bg-[#DDD6C8] mx-1" />

            <button
              onClick={() => setSimulateNoPhone(!simulateNoPhone)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                simulateNoPhone
                  ? 'bg-[#B4684A] text-white'
                  : 'text-[#4A5550] hover:text-[#1F2A27]'
              }`}
            >
              {simulateNoPhone ? 'No Phone (Error Mode)' : 'Standard Lead'}
            </button>

            {simState !== 'idle' && (
              <button
                onClick={handleReset}
                className="p-1 text-[#79827D] hover:text-[#1F2A27] rounded transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Simulator 3-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intake Form (Simulated Buyer Action) */}
        <div className="lg:col-span-4 bg-[#FBF9F4] p-5 sm:p-6 rounded-[16px] border border-[#DDD6C8] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EDE8DD]">
            <div>
              <h3 className="font-serif text-lg text-[#1F2A27] font-medium">1. Capture Inquiry</h3>
              <p className="text-[11px] text-[#79827D]">Harlow Creek VIP Floor Plan Form</p>
            </div>
            <button
              type="button"
              onClick={handleUseSample}
              className="text-xs text-[#B4684A] hover:underline font-medium"
            >
              Use Sample Lead
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSimulation();
            }}
            className="space-y-3.5"
          >
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A5550] mb-1">
                Buyer Name
              </label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                className="w-full text-xs rounded-[8px] border border-[#DDD6C8] bg-white px-3 py-2 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A5550] mb-1">
                Mobile Number (SMS Consent)
              </label>
              <input
                type="text"
                value={simulateNoPhone ? '' : phone}
                disabled={simulateNoPhone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={simulateNoPhone ? 'No phone provided by buyer' : '(704) 555-0142'}
                className="w-full text-xs rounded-[8px] border border-[#DDD6C8] bg-white px-3 py-2 text-[#1F2A27] disabled:bg-[#EDE8DD] disabled:text-[#79827D] focus:outline-none focus:border-[#2F4A3F]"
              />
              {simulateNoPhone && (
                <p className="text-[10px] text-[#A5473B] mt-1 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" /> SMS disabled. Testing email fallback logic.
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A5550] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs rounded-[8px] border border-[#DDD6C8] bg-white px-3 py-2 text-[#1F2A27] focus:outline-none focus:border-[#2F4A3F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A5550] mb-1">
                  Community
                </label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className="w-full text-xs rounded-[8px] border border-[#DDD6C8] bg-white px-2 py-2 text-[#1F2A27] focus:outline-none"
                >
                  <option>Harlow Creek</option>
                  <option>Marrow Ridge</option>
                  <option>Larkin Meadows</option>
                  <option>Custom Build</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A5550] mb-1">
                  Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full text-xs rounded-[8px] border border-[#DDD6C8] bg-white px-2 py-2 text-[#1F2A27] focus:outline-none"
                >
                  <option>Within 3 months</option>
                  <option>3-6 months</option>
                  <option>6-12 months</option>
                </select>
              </div>
            </div>

            {/* TCPA Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-[10px] text-[#79827D] leading-tight cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  disabled
                  className="mt-0.5 rounded text-[#2F4A3F]"
                />
                <span>
                  Consent to automated calls & texts from Alder & Stone Homes. Reply STOP to cancel.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="clay"
                className="w-full font-semibold"
                isLoading={simState === 'running'}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                {simState === 'running' ? 'Simulating Response...' : 'Submit Lead (Trigger Simulator)'}
              </Button>
            </div>
          </form>
        </div>

        {/* Center Column: Live Phone Mockup */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="text-center mb-3">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#79827D]">
              Buyer’s Smartphone Screen
            </span>
          </div>

          <PhoneThread
            messages={phoneMessages}
            isTyping={isPhoneTyping}
            contactName="Dana Whitfield"
            contactSubtitle="Alder & Stone Homes"
            smartReplies={
              simState === 'completed' && !simulateNoPhone
                ? ['1 - Saturday at 11am', '2 - Sunday afternoon']
                : undefined
            }
            onSmartReplyClick={(reply) => {
              setPhoneMessages((prev) => [
                ...prev,
                {
                  id: `reply-${Date.now()}`,
                  sender: 'buyer',
                  text: reply,
                  time: 'Just now',
                },
                {
                  id: `confirm-${Date.now()}`,
                  sender: 'agent',
                  text: 'Terrific! Priya Raman has your model tour reserved and calendar invite sent.',
                  time: 'Just now',
                },
              ]);
            }}
          />
        </div>

        {/* Right Column: Execution Timeline & Live Speed Timer */}
        <div className="lg:col-span-4 space-y-4">
          {/* Big Speed Timer Banner */}
          <div className="bg-[#1F2A27] text-white p-5 rounded-[16px] shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#A7B3AE] mb-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#B4684A]" />
                Speed-to-Lead Clock
              </span>
              <span className="font-mono uppercase">{simState}</span>
            </div>

            <div className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white my-1 tabular-nums">
              0:0{formattedTimer} <span className="text-sm font-normal text-[#A7B3AE]">sec</span>
            </div>

            {/* Comparison Bar */}
            <div className="mt-4 pt-4 border-t border-[#34423E] space-y-2 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#C5D5CC]">Alder & Stone System</span>
                <span className="text-[#4C7A57] font-semibold">0:07 seconds</span>
              </div>
              <div className="w-full h-2 bg-[#263330] rounded-full overflow-hidden">
                <div className="h-full bg-[#4C7A57] w-full rounded-full" />
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1 text-[#79827D]">
                <span>Industry Average (Home Builders)</span>
                <span className="text-[#A5473B]">3 hr 12 min</span>
              </div>
              <div className="w-full h-2 bg-[#263330] rounded-full overflow-hidden">
                <div className="h-full bg-[#A5473B] w-[95%] rounded-full opacity-60" />
              </div>
              <p className="text-[9px] text-[#79827D] italic mt-1">
                *Builder benchmark based on nationwide mystery shopping studies (illustrative).
              </p>
            </div>
          </div>

          {/* Chronological Event Stream */}
          <div className="bg-[#FBF9F4] p-5 rounded-[16px] border border-[#DDD6C8] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4A5550]">
                Simulated Automation Sequence
              </h4>
              <Badge variant="pine">Automated</Badge>
            </div>

            {events.length === 0 ? (
              <p className="text-xs text-[#79827D] py-4 text-center italic">
                Press "Submit Lead" to fire the 7-second sequence.
              </p>
            ) : (
              <div className="space-y-3">
                {events.map((ev, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs animate-in slide-in-from-right-2 duration-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#E0E8E3] text-[#2F4A3F] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4C7A57]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1F2A27]">{ev.title}</span>
                        <span className="font-mono text-[10px] text-[#79827D]">{ev.time}</span>
                      </div>
                      <p className="text-[11px] text-[#79827D] leading-tight mt-0.5">
                        {ev.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {simState === 'completed' && (
              <div className="pt-3 border-t border-[#DDD6C8] flex items-center justify-between">
                <span className="text-xs text-[#4C7A57] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Lead synced to CRM
                </span>
                <Link to="/app/pipeline">
                  <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3 h-3" />}>
                    View in Pipeline
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
