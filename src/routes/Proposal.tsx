import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalSwitcher } from '../components/common/GlobalSwitcher';
import { FunnelNav } from '../components/funnel/FunnelNav';
import { FunnelFooter } from '../components/funnel/FunnelFooter';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle2, ShieldCheck, Clock, DollarSign, 
  ArrowRight, PhoneCall, Workflow, Calendar, Database, 
  HelpCircle, AlertCircle, FileText, Check 
} from 'lucide-react';

export const Proposal: React.FC = () => {
  const navigate = useNavigate();

  const milestones = [
    {
      id: 'M0',
      title: 'M0: Kickoff & Pre-Flight Audit',
      window: 'Days 1–3',
      deliverable: 'Access provisioning, custom field discovery, audit of existing live workflows, and success metrics agreement.',
    },
    {
      id: 'M1',
      title: 'M1: Subaccount Foundation & Taxonomy',
      window: 'Week 1',
      deliverable: 'Custom fields, tag library, lead sources, pipeline stages, calendar availability, and SPF/DKIM/DMARC domain auth.',
    },
    {
      id: 'M2',
      title: 'M2: Branded Funnel & Real-Time Booking',
      window: 'Week 2',
      deliverable: 'High-converting 4-page funnel, 5-step survey with validation, collision-free slot picker, and automated .ics calendar invites.',
    },
    {
      id: 'M3',
      title: 'M3: 5 Core Automation Workflows',
      window: 'Week 2–3',
      deliverable: 'Speed-to-lead, 7-day unresponsive cadence, appointment reminders, no-show recovery, and nurture with automatic stop-on-reply and deduplication.',
    },
    {
      id: 'M4',
      title: 'M4: Retell AI + Twilio Voice Integration (Itemized)',
      window: 'Week 3',
      deliverable: 'Finch Assist voice agent, Twilio phone routing, webhook receiver workflow, bi-directional qualification custom field sync, and live calendar booking via voice.',
    },
    {
      id: 'M5',
      title: 'M5: Attribution Reports, QA Testing & Walkthrough',
      window: 'Week 3–4',
      deliverable: 'Source attribution dashboards, 12-point QA suite execution, written operator handbook, 14-min recorded walkthrough, and 30-day warranty kickoff.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text flex flex-col justify-between">
      <GlobalSwitcher />
      <FunnelNav />

      <main className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-16 flex-1 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">
            Implementation Proposal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-text tracking-tight">
            GoHighLevel Journey Studio
          </h1>
          <p className="text-sm sm:text-base text-text-2 leading-relaxed">
            A cohesive lead-to-booking system with strict follow-up hygiene, voice AI qualification, and human takeover safety.
          </p>
        </div>

        {/* Honest Simulation Disclaimer Banner */}
        <div className="p-4 bg-accent-soft/50 border border-accent/30 rounded-card flex items-start gap-3 text-xs text-text-2">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-text font-semibold">About This Demonstration:</strong> The live web application you just explored (including the Alder & Finch funnel and the Journey Studio operator console) is an interactive client simulation demonstrating the exact workflows, custom field mappings, and safeguards we deliver into your real GoHighLevel subaccount.
          </div>
        </div>

        {/* Itemized Price & Milestones Grid */}
        <div className="bg-surface-elevated rounded-modal p-6 sm:p-8 border border-border shadow-sh-2 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
            <div>
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Fixed-Fee Engagement</span>
              <div className="font-serif text-3xl font-medium text-text mt-0.5">$1,000 USD Fixed Price</div>
              <p className="text-xs text-text-muted mt-0.5">2–4 weeks end-to-end delivery · 30-day post-launch warranty</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/studio')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Inspect Live Console
              </Button>
            </div>
          </div>

          {/* Itemized Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">Itemized Scope & Deliverables</h3>
            <div className="border border-border rounded-card overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-sunken border-b border-border text-[11px] font-semibold text-text-muted uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Component</th>
                    <th className="py-2.5 px-4">Deliverables Included</th>
                    <th className="py-2.5 px-4 text-right">Included Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text-2">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-text">Subaccount Setup & Data Taxonomy</td>
                    <td className="py-3 px-4">Custom fields, tag library, lead sources, pipeline stages, calendar availability, and pre-flight audit of live flows.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-text">$200</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-text">Lead-Capture Funnel & Booking Engine</td>
                    <td className="py-3 px-4">Branded 4-page funnel, 5-step survey with validation, collision-free slot picker, .ics calendar generation, and manage booking.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-text">$250</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-text">The 5 Core Automations & Stop Rules</td>
                    <td className="py-3 px-4">Speed-to-lead, unresponsive 7-day flow, appointment reminders, no-show recovery, nurture, stop-on-reply, and duplicate merge engine.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-text">$250</td>
                  </tr>
                  <tr className="bg-accent-soft/30 font-medium">
                    <td className="py-3 px-4 font-bold text-accent">Retell AI + Twilio Voice Integration (Itemized)</td>
                    <td className="py-3 px-4">Finch Assist voice agent, Twilio phone routing, webhook receiver, bi-directional qualification custom field writeback, and voice booking.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-accent">$150</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-text">Reporting, QA Test Suite & 30-Day Support</td>
                    <td className="py-3 px-4">Attribution charts, 12-point QA verification, recorded 14-min screencast walkthrough, written operator handbook, and 30-day bug warranty.</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-text">$150</td>
                  </tr>
                  <tr className="bg-sunken font-bold text-text">
                    <td className="py-3 px-4" colSpan={2}>Total Fixed Investment</td>
                    <td className="py-3 px-4 text-right font-mono text-sm">$1,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Milestones */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider">Milestone Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {milestones.map(m => (
                <div key={m.id} className="p-4 rounded-card bg-surface border border-border space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">{m.title}</span>
                    <span className="font-mono text-[10px] text-accent font-semibold">{m.window}</span>
                  </div>
                  <p className="text-text-2 text-[11px] leading-relaxed">{m.deliverable}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why Our Approach Prevents Messy Follow-Up */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-6 rounded-card border border-border space-y-2.5">
            <h4 className="font-bold text-sm text-text">1. Never Spam Leads</h4>
            <p className="text-xs text-text-2 leading-relaxed">
              When a lead replies with "YES" or questions, every automated scheduled touch immediately halts. A priority task is created for human staff.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-card border border-border space-y-2.5">
            <h4 className="font-bold text-sm text-text">2. Deduplication Safety</h4>
            <p className="text-xs text-text-2 leading-relaxed">
              When an existing contact fills out the questionnaire a second time from another device, their details merge cleanly without sending duplicate welcome text blasts.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-card border border-border space-y-2.5">
            <h4 className="font-bold text-sm text-text">3. Honest Carrier Approvals</h4>
            <p className="text-xs text-text-2 leading-relaxed">
              A2P 10DLC registration requires carrier review (3–10 business days). We initiate vetting on Day 1 of kickoff so messaging compliance is locked in early.
            </p>
          </div>
        </div>
      </main>

      <FunnelFooter />
    </div>
  );
};
