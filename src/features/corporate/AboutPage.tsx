import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Code2, Users, Flame, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const principles = [
    {
      num: '01',
      title: 'One Architecture Over Three Vendors',
      desc: 'Fragmentation is the silent killer of startup velocity. We build one cohesive system that shares design tokens, auth schemas, and data pipelines.',
    },
    {
      num: '02',
      title: 'Restraint as an Engineering Virtue',
      desc: 'We refuse generic UI trends: no floating neon blobs, unreadable glassmorphism, or artificial hype. Clean editorial typography and responsive speeds win trust.',
    },
    {
      num: '03',
      title: 'Transactional Reality, Not Mockups',
      desc: 'Software must survive failure gracefully. We design the card decline, the network retry, and the kitchen surge before declaring any flow complete.',
    },
    {
      num: '04',
      title: 'Complete Intellectual Property Transfer',
      desc: 'You own every commit, Terraform manifest, and Figma variable from the first milestone. Zero proprietary runtime entrapment.',
    },
  ];

  const team = [
    { name: 'Dr. Tariq Vance', role: 'Founding Partner & Systems Architect', initials: 'TV', focus: 'Distributed Systems & Tenancy' },
    { name: 'Elena Rostova', role: 'Lead Design Systems Engineer', initials: 'ER', focus: 'Accessible Typography & Radix' },
    { name: 'Dr. Sana Malik', role: 'Curriculum & Hospitality Fellow', initials: 'SM', focus: 'Academy Operations & Compliance' },
    { name: 'Marcus Sterling', role: 'Infrastructure & Payment Pipelines', initials: 'MS', focus: 'Stripe Connect & PostgreSQL' },
  ];

  const timelineSteps = [
    { phase: '01. Architecture Sprint', duration: 'Week 1–2', desc: 'Detailed data schema design, tenancy isolation model, and shared design tokens package.' },
    { phase: '02. Core Platform Build', duration: 'Week 3–8', desc: 'Real-time ordering engine, video LMS infrastructure, and CMS publishing console.' },
    { phase: '03. Stress Testing & Hardening', duration: 'Week 9–12', desc: 'Sub-300ms ticket synchronization benchmarks, WCAG AA audits, and payment decline retries.' },
    { phase: '04. Handover & Post-Launch Care', duration: 'Ongoing', desc: 'Complete IP transfer to client org, observability dashboard configuration, and SLA coverage.' },
  ];

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-20">
      {/* Editorial Statement */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
          Our Philosophy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal leading-tight">
          We engineer the quiet precision behind platforms that endure.
        </h1>
        <p className="text-base text-ink-2 leading-relaxed">
          BionicIQ was founded on a simple observation: ambitious businesses lose millions of dollars and months of momentum juggling multiple agencies who build incompatible silos. We provide one accountable engineering partnership for the entire ecosystem.
        </p>
      </div>

      {/* Principles (4 Numbered Items) */}
      <div className="space-y-6">
        <span className="text-xs uppercase tracking-wider font-bold text-ink-3 block">
          Foundational Principles
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((p) => (
            <div key={p.num} className="p-8 rounded-xl bg-surface border border-line space-y-3">
              <span className="font-mono text-xs font-bold text-clay block">{p.num}</span>
              <h2 className="font-serif text-2xl text-ink">{p.title}</h2>
              <p className="text-sm text-ink-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Grid with Initials Avatars */}
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-ink-3 block mb-1">
            Core Leadership
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            Senior practitioners on every ticket
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m) => (
            <div key={m.name} className="p-6 rounded-xl bg-surface border border-line space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-serif text-lg font-bold text-primary">
                {m.initials}
              </div>
              <div>
                <h3 className="font-serif text-lg text-ink font-semibold">{m.name}</h3>
                <p className="text-xs text-clay font-medium">{m.role}</p>
                <p className="text-[11px] text-ink-3 mt-1">{m.focus}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How We Work Timeline */}
      <div className="p-8 sm:p-12 rounded-2xl bg-surface border border-line space-y-8">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-clay block mb-1">
            Working Cadence
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            How we partner with founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="space-y-2 text-xs">
              <span className="font-mono font-bold text-primary block">{step.duration}</span>
              <h3 className="font-serif text-lg text-ink font-semibold">{step.phase}</h3>
              <p className="text-ink-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-ink-2">
            Interested in milestone or monthly retainer structures?
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/proposal')}>
            <span>View Proposal Companion</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
