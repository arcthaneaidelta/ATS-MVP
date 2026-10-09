import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  Layers,
  Zap,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  Database,
  ShieldCheck,
  Share2,
} from 'lucide-react';

export const SystemPage: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState(0);

  const stages = [
    {
      title: '1. Lead Capture & Intake',
      subtitle: 'Harlow Creek, Floor Plan Quiz, Facebook & Portal Leads',
      description: 'Centralizes every inquiry from paid social, Google ads, Zillow/NewHomeSource portals, and QR codes into an automated ingestion pipeline.',
      channels: ['Meta Lead Ads', 'Google Ads', 'Community Funnels', 'Quiz Lead Magnet', 'On-Site QR Codes'],
      automations: [
        'Instant deduplication checking against existing database',
        'TCPA express written consent timestamping',
        'Community & floor plan interest tagging',
        'Round-robin distribution to Dana Whitfield or Marcus Oyelaran',
      ],
      dataFields: ['Budget Range', 'Buying Timeline', 'Pre-Approval Status', 'Desired Homesite Lot #'],
    },
    {
      title: '2. Speed-to-Lead Response (<7s)',
      subtitle: 'Two-Way SMS, VIP Brochure Lookbook, Call Bridge',
      description: 'The moment a lead clicks submit, Groundwork fires a 3-touch response within 7 seconds, beating competitor builders by hours.',
      channels: ['Local 704 A2P 10DLC SMS', 'Transactional HTML Email', 'Twilio Call Bridge Dialer'],
      automations: [
        'Personalized text asking for weekend tour preference',
        'High-resolution PDF floor plan lookbook email',
        'Mobile push notification to assigned sales counselor with 5-minute SLA',
        'Outbound bridge phone call prompting counselor headset',
      ],
      dataFields: ['First Response Seconds', 'SLA Adherence %', 'Call Outcome Log'],
    },
    {
      title: '3. 90-Day Buyer Nurture',
      subtitle: 'Educational Construction, Financing, & Community Stories',
      description: 'Home buying cycles are long. Groundwork nurtures buyers across 90 days with behind-the-drywall videos, mortgage buydowns, and advance lot release notices.',
      channels: ['Email Automation', 'Check-In SMS', 'Agent Personal Video Tasks'],
      automations: [
        'Day 1: 2x6 construction & sealed crawlspace quality guide',
        'Day 7: 2-1 mortgage rate buydown incentive breakdown',
        'Day 21: Private VIP after-hours model home tour invite',
        'Day 45: Early release notice for premium cul-de-sac lots',
        'Day 90: Quarterly builder flex credit specials',
      ],
      dataFields: ['Email Open Frequency', 'Floor Plan Clicks', 'Engagement Score (Hot/Warm/Cool)'],
    },
    {
      title: '4. Tour Booking & No-Show Rescue',
      subtitle: 'Self-Serve Model Tours, Virtual Walkthroughs, Gate Codes',
      description: 'Frictionless calendar scheduling that syncs with community agents’ schedules, paired with automated 24h/2h reminders to eliminate no-shows.',
      channels: ['Calendar Booking Widget', 'GPS Directions SMS', 'Automated Reschedule Flow'],
      automations: [
        'Instant calendar ICS invite to buyer and agent',
        '24 hours prior: confirmation SMS with reply YES prompt',
        '2 hours prior: parking instructions and gate code #1042',
        '1-click No-Show rescue sequence if appointment is missed',
      ],
      dataFields: ['Tour Date & Time', 'Assigned Sales Agent', 'Homesites Toured'],
    },
    {
      title: '5. Contract, Closing & 5-Star Reviews',
      subtitle: 'Design Studio Prep, Pre-Construction, Review Requests',
      description: 'Guides buyers through selections appointments and pre-con meetings, followed by automated post-closing Google review generation.',
      channels: ['Selections Packets', 'Escrow Milestone SMS', 'Google Business Profile Review Bot'],
      automations: [
        'Post-tour 48-hour courtesy lot hold confirmation',
        'Design Studio lookbook and selections prep guide',
        '14-day post-closing satisfaction rating SMS',
        'Smart reputation routing: 5-star to Google, 1-3 star to Robert Alder',
      ],
      dataFields: ['Purchase Agreement Value', 'Lot #', 'Google Review Status'],
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F6F3EC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-widest text-[#B4684A] font-semibold">
            Technical Architecture
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1F2A27] font-normal mt-2">
            How Groundwork Operates on GoHighLevel
          </h1>
          <p className="text-base text-[#4A5550] mt-3 leading-relaxed">
            A visual overview of the lead flow, telephony infrastructure, and workflow logic
            powering Alder & Stone Homes’ sales pipeline.
          </p>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#C5BCA9] mb-12 shadow-xs">
          <h2 className="font-serif text-xl text-[#1F2A27] font-medium mb-6">
            End-to-End System Diagram (Click Stage to Inspect)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
            {stages.map((stg, i) => (
              <button
                key={i}
                onClick={() => setSelectedStage(i)}
                className={`p-4 rounded-[12px] border text-left transition-all ${
                  selectedStage === i
                    ? 'bg-[#2F4A3F] text-white border-[#243A31] shadow-xs'
                    : 'bg-[#F6F3EC] text-[#4A5550] border-[#DDD6C8] hover:bg-[#EDE8DD]'
                }`}
              >
                <div className="font-mono text-xs opacity-75 mb-1">0{i + 1}</div>
                <div className="font-semibold text-sm leading-tight">{stg.title.split('. ')[1]}</div>
              </button>
            ))}
          </div>

          {/* Detailed Inspector for Selected Stage */}
          <div className="bg-[#F6F3EC] p-6 sm:p-8 rounded-[14px] border border-[#DDD6C8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD6C8] pb-4">
              <div>
                <h3 className="font-serif text-2xl text-[#1F2A27] font-medium">
                  {stages[selectedStage].title}
                </h3>
                <p className="text-xs text-[#79827D] mt-0.5">{stages[selectedStage].subtitle}</p>
              </div>
              <Badge variant="clay">Active Engine</Badge>
            </div>

            <p className="text-sm text-[#4A5550] leading-relaxed">
              {stages[selectedStage].description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white p-4 rounded-[10px] border border-[#DDD6C8]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2A27] mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#B4684A]" /> Channels Active
                </h4>
                <ul className="text-xs text-[#4A5550] space-y-1">
                  {stages[selectedStage].channels.map((c, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B4684A]" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-[10px] border border-[#DDD6C8]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2A27] mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#4C7A57]" /> Automation Logic
                </h4>
                <ul className="text-xs text-[#4A5550] space-y-1">
                  {stages[selectedStage].automations.map((a, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#4C7A57] shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-[10px] border border-[#DDD6C8]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2A27] mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#2F4A3F]" /> CRM Data Captured
                </h4>
                <ul className="text-xs text-[#4A5550] space-y-1">
                  {stages[selectedStage].dataFields.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F4A3F]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Replaced Section */}
        <div className="bg-[#FBF9F4] p-6 sm:p-8 rounded-[16px] border border-[#DDD6C8]">
          <h2 className="font-serif text-2xl text-[#1F2A27] font-medium mb-2">
            Disjointed Tools Replaced by This System
          </h2>
          <p className="text-xs text-[#79827D] mb-6">
            Eliminates the subscription clutter and broken zaps between separate software.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#DDD6C8] bg-[#F6F3EC]">
                  <th className="p-3 font-semibold text-[#1F2A27]">Functional Need</th>
                  <th className="p-3 font-semibold text-[#A5473B]">Disjointed Traditional Stack</th>
                  <th className="p-3 font-semibold text-[#2F4A3F]">Groundwork (GHL Unified)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD6C8]">
                <tr>
                  <td className="p-3 font-medium text-[#1F2A27]">Instant 2-Way Texting</td>
                  <td className="p-3 text-[#79827D]">TextMagic / SimpleTexting ($120/mo)</td>
                  <td className="p-3 text-[#2F4A3F] font-semibold">Native A2P 10DLC 2-Way SMS</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#1F2A27]">Model Tour Scheduling</td>
                  <td className="p-3 text-[#79827D]">Calendly Team Plan ($96/mo)</td>
                  <td className="p-3 text-[#2F4A3F] font-semibold">Integrated Tour Booking & Reminders</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#1F2A27]">90-Day Buyer Email Drip</td>
                  <td className="p-3 text-[#79827D]">Mailchimp / ActiveCampaign ($180/mo)</td>
                  <td className="p-3 text-[#2F4A3F] font-semibold">Visual Workflow Automations</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#1F2A27]">Social Media Scheduler</td>
                  <td className="p-3 text-[#79827D]">Buffer / Hootsuite ($140/mo)</td>
                  <td className="p-3 text-[#2F4A3F] font-semibold">Social Planner + Comment-to-Lead</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-[#1F2A27]">Google Review Generator</td>
                  <td className="p-3 text-[#79827D]">Birdeye / Podium ($299/mo)</td>
                  <td className="p-3 text-[#2F4A3F] font-semibold">Automated Post-Closing Reputation Flow</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/app">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Test System Live in the Operating App
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
