import React, { useState } from 'react';
import { proposalConfig } from '../../data/proposal.config';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import {
  ShieldCheck,
  Layers,
  Clock,
  DollarSign,
  Download,
  Mail,
  CheckCircle2,
  Server,
  Database,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const ProposalPage: React.FC = () => {
  const { toast } = useToast();
  const [billingMode, setBillingMode] = useState<'milestones' | 'monthly'>('milestones');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const totalHours =
    proposalConfig.estimates.corporate.hours +
    proposalConfig.estimates.academy.hours +
    proposalConfig.estimates.cirqla.hours;

  const totalInvestment =
    proposalConfig.estimates.corporate.investment +
    proposalConfig.estimates.academy.investment +
    proposalConfig.estimates.cirqla.investment;

  const nodes = [
    { id: 'client-corp', lane: 'clients', label: 'Corporate Site & CMS', desc: 'Vite/React with in-place CMS and real-time SEO preview' },
    { id: 'client-acad', lane: 'clients', label: 'Academy Student LMS', desc: 'Video player, interactive notes, timed assessment & diplomas' },
    { id: 'client-diner', lane: 'clients', label: 'Cirqla Diner PWA', desc: 'Table-tent QR scan-to-pay web client with required modifiers' },
    { id: 'client-venue', lane: 'clients', label: 'Cirqla Venue Board', desc: 'Real-time kitchen Kanban display with sub-300ms ticket sync' },
    { id: 'client-super', lane: 'clients', label: 'Platform Super-Admin', desc: 'Multi-tenant provisioning, plan tiers, and system observability' },

    { id: 'svc-tenancy', lane: 'services', label: 'Tenancy & RBAC', desc: 'Row-level cryptographic isolation for multi-venue data' },
    { id: 'svc-orders', lane: 'services', label: 'Realtime Dispatch Broker', desc: 'Sub-300ms ticket arrival between diner and kitchen pass' },
    { id: 'svc-payments', lane: 'services', label: 'Stripe Connect Engine', desc: 'Split payment calculations, automated venue payouts & ledgers' },
    { id: 'svc-lms', lane: 'services', label: 'Assessment Engine', desc: 'Randomized quiz questions and verifiable PDF diploma generation' },

    { id: 'infra-db', lane: 'platform', label: 'PostgreSQL + RLS', desc: 'Single-schema elegance with bulletproof row-level isolation' },
    { id: 'infra-redis', lane: 'platform', label: 'Redis Pub/Sub & Queues', desc: 'High-throughput event dispatching under dinner rush peak covers' },
    { id: 'infra-cloud', lane: 'platform', label: 'Cloud IaC & CI/CD', desc: 'Version-controlled infrastructure transferred directly to your org' },
  ];

  const handlePrint = () => {
    toast('Generating printable executive proposal...', 'info');
    setTimeout(() => window.print(), 300);
  };

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left font-sans space-y-16">
      {/* Executive Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <span className="text-[10px] uppercase font-bold text-clay tracking-wider block font-mono">
              CONFIDENTIAL TECHNICAL PROPOSAL
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-ink mt-1">
              Prepared for {proposalConfig.clientName}
            </h1>
            <p className="text-xs text-ink-3 font-mono mt-1">
              {proposalConfig.preparedDate} · Lead Engineer: {proposalConfig.leadEngineer}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              icon={<Download className="w-4 h-4" />}
            >
              Export Proposal (PDF)
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                window.location.href = `mailto:${proposalConfig.contactEmail}?subject=BionicIQ%20Engineering%20Partnership`;
              }}
              icon={<Mail className="w-4 h-4" />}
            >
              Shortlist Me
            </Button>
          </div>
        </div>

        <p className="text-base text-ink leading-relaxed max-w-4xl">
          {proposalConfig.summary}
        </p>

        {/* IP Ownership Guarantee Banner (PRD Section 14.3) */}
        <div className="p-5 rounded-2xl bg-ok-tint/70 border border-ok/30 flex items-start gap-3.5 text-xs">
          <ShieldCheck className="w-6 h-6 text-ok shrink-0 mt-0.5 stroke-[2.5]" />
          <div>
            <strong className="text-ok font-bold block text-sm">
              100% Full Intellectual Property Transfer
            </strong>
            <p className="text-ink-2 mt-1 leading-relaxed">
              {proposalConfig.ownershipStatement}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Architecture Blueprint (3 Lanes) */}
      <div className="p-8 sm:p-12 rounded-3xl bg-elevated border border-line shadow-sm space-y-8">
        <div>
          <span className="text-xs uppercase font-bold text-slate tracking-wider block mb-1">
            End-to-End System Topology
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            Three-Lane Architecture Blueprint
          </h2>
          <p className="text-xs text-ink-3 mt-1">
            Hover or click any node to review data flow connections and rationale.
          </p>
        </div>

        {/* 3 Lanes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lane 1: Client Surfaces */}
          <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-line text-xs font-bold text-ink uppercase tracking-wider">
              <Layers className="w-4 h-4 text-primary" />
              <span>Client Surfaces</span>
            </div>
            <div className="space-y-2">
              {nodes.filter((n) => n.lane === 'clients').map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    selectedNode === node.id
                      ? 'bg-elevated border-primary ring-2 ring-primary/20 shadow-xs'
                      : 'bg-elevated border-line hover:border-line-2'
                  }`}
                >
                  <p className="font-semibold text-ink">{node.label}</p>
                  <p className="text-[11px] text-ink-3 mt-0.5 leading-snug">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lane 2: Transactional Core */}
          <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-line text-xs font-bold text-ink uppercase tracking-wider">
              <Server className="w-4 h-4 text-clay" />
              <span>Transactional Core</span>
            </div>
            <div className="space-y-2">
              {nodes.filter((n) => n.lane === 'services').map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    selectedNode === node.id
                      ? 'bg-elevated border-clay ring-2 ring-clay/20 shadow-xs'
                      : 'bg-elevated border-line hover:border-line-2'
                  }`}
                >
                  <p className="font-semibold text-ink">{node.label}</p>
                  <p className="text-[11px] text-ink-3 mt-0.5 leading-snug">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lane 3: Platform & Infrastructure */}
          <div className="p-5 rounded-2xl bg-surface border border-line space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-line text-xs font-bold text-ink uppercase tracking-wider">
              <Database className="w-4 h-4 text-ok" />
              <span>Platform & Storage</span>
            </div>
            <div className="space-y-2">
              {nodes.filter((n) => n.lane === 'platform').map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                    selectedNode === node.id
                      ? 'bg-elevated border-ok ring-2 ring-ok/20 shadow-xs'
                      : 'bg-elevated border-line hover:border-line-2'
                  }`}
                >
                  <p className="font-semibold text-ink">{node.label}</p>
                  <p className="text-[11px] text-ink-3 mt-0.5 leading-snug">{node.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tech Stack Rationale Table */}
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line space-y-6">
        <div>
          <span className="text-xs uppercase font-bold text-slate tracking-wider block mb-1">
            Engineering Rationale
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            Technology Decisions & Alternatives Considered
          </h2>
        </div>

        <div className="overflow-x-auto text-xs font-sans">
          <table className="w-full text-left divide-y divide-line">
            <thead className="bg-bg text-ink-3 text-[10px] uppercase font-mono tracking-wider">
              <tr>
                <th className="p-3">Architecture Area</th>
                <th className="p-3">Chosen Solution</th>
                <th className="p-3">Architectural Rationale</th>
                <th className="p-3">Alternative Considered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-elevated">
              {proposalConfig.stackDecisions.map((dec) => (
                <tr key={dec.area} className="hover:bg-surface/50">
                  <td className="p-3 font-bold text-ink whitespace-nowrap">{dec.area}</td>
                  <td className="p-3 font-semibold text-primary">{dec.chosen}</td>
                  <td className="p-3 text-ink-2 leading-relaxed">{dec.why}</td>
                  <td className="p-3 text-ink-3 italic">{dec.alternativeConsidered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Estimate by Build & Commercial Terms */}
      <div className="p-8 sm:p-12 rounded-3xl bg-elevated border border-line shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
          <div>
            <span className="text-xs uppercase font-bold text-clay tracking-wider block mb-1">
              Scope & Commercials
            </span>
            <h2 className="font-serif text-3xl text-ink font-normal">
              Investment Breakdown & Delivery Milestones
            </h2>
          </div>

          {/* Milestone vs Monthly Segmented Toggle */}
          <div className="flex rounded-xl bg-surface border border-line p-1 text-xs">
            <button
              onClick={() => setBillingMode('milestones')}
              className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                billingMode === 'milestones'
                  ? 'bg-elevated text-primary font-bold shadow-xs'
                  : 'text-ink-3'
              }`}
            >
              Milestone Releases
            </button>
            <button
              onClick={() => setBillingMode('monthly')}
              className={`px-4 py-1.5 rounded-lg font-medium transition-colors ${
                billingMode === 'monthly'
                  ? 'bg-elevated text-primary font-bold shadow-xs'
                  : 'text-ink-3'
              }`}
            >
              Monthly Retainer ($17k/mo)
            </button>
          </div>
        </div>

        {/* 3 Build Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
            <span className="text-xs uppercase font-bold text-ink-3 block">Corporate Flagship</span>
            <div className="font-mono text-3xl font-bold text-ink">
              ${proposalConfig.estimates.corporate.investment.toLocaleString()}
            </div>
            <p className="text-xs text-ink-2 font-mono">
              {proposalConfig.estimates.corporate.hours} hrs · {proposalConfig.estimates.corporate.weeks} weeks
            </p>
            <ul className="text-xs text-ink-2 space-y-1.5 pt-2 border-t border-line">
              {proposalConfig.estimates.corporate.deliverables.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
            <span className="text-xs uppercase font-bold text-slate block">BionicIQ Academy</span>
            <div className="font-mono text-3xl font-bold text-ink">
              ${proposalConfig.estimates.academy.investment.toLocaleString()}
            </div>
            <p className="text-xs text-ink-2 font-mono">
              {proposalConfig.estimates.academy.hours} hrs · {proposalConfig.estimates.academy.weeks} weeks
            </p>
            <ul className="text-xs text-ink-2 space-y-1.5 pt-2 border-t border-line">
              {proposalConfig.estimates.academy.deliverables.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-line space-y-4">
            <span className="text-xs uppercase font-bold text-clay block">Cirqla Hospitality SaaS</span>
            <div className="font-mono text-3xl font-bold text-ink">
              ${proposalConfig.estimates.cirqla.investment.toLocaleString()}
            </div>
            <p className="text-xs text-ink-2 font-mono">
              {proposalConfig.estimates.cirqla.hours} hrs · {proposalConfig.estimates.cirqla.weeks} weeks
            </p>
            <ul className="text-xs text-ink-2 space-y-1.5 pt-2 border-t border-line">
              {proposalConfig.estimates.cirqla.deliverables.map((d, i) => (
                <li key={i}>• {d}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Milestone vs Monthly Schedule Details */}
        {billingMode === 'milestones' ? (
          <div className="space-y-4 pt-4 border-t border-line">
            <h3 className="font-serif text-xl text-ink font-bold">Gated Milestone Deliverables</h3>
            <div className="space-y-3 text-xs">
              {proposalConfig.milestones.map((m) => (
                <div key={m.id} className="p-4 rounded-xl bg-surface border border-line space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink text-sm">
                      {m.phase} ({m.timing})
                    </span>
                    <span className="font-mono font-bold text-primary text-sm">
                      ${m.amount.toLocaleString()} ({m.percentage}%)
                    </span>
                  </div>
                  <ul className="space-y-1 text-ink-2">
                    {m.deliverables.map((deliv, i) => (
                      <li key={i}>• {deliv}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-ok font-semibold pt-1">
                    Acceptance Criteria: {m.acceptanceCriteria}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-4 border-t border-line">
            <h3 className="font-serif text-xl text-ink font-bold">Equal Monthly Retainer Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              {proposalConfig.monthlyInstalments.map((inst) => (
                <div key={inst.month} className="p-4 rounded-xl bg-surface border border-line space-y-2">
                  <span className="font-bold text-primary block">Month {inst.month}</span>
                  <p className="font-bold text-ink text-lg">${inst.amount.toLocaleString()}</p>
                  <p className="text-ink-3 text-[11px] font-sans">{inst.focus}</p>
                  <span className="text-[10px] text-clay font-bold block pt-1">{inst.milestoneRelease}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Support Tiers */}
      <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line space-y-6">
        <div>
          <span className="text-xs uppercase font-bold text-ink-3 tracking-wider block mb-1">
            Post-Launch SLA Guarantee
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            Ongoing Maintenance & Partnership Tiers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proposalConfig.supportTiers.map((tier) => (
            <div key={tier.name} className="p-6 rounded-2xl bg-elevated border border-line space-y-4">
              <span className="text-xs uppercase font-bold text-primary block">{tier.name}</span>
              <div className="font-mono text-3xl font-bold text-ink">
                ${tier.monthlyPrice}<span className="text-xs font-normal text-ink-3">/mo</span>
              </div>
              <div className="text-xs text-ink-2 space-y-1">
                <p><strong>Response Time:</strong> {tier.responseTime}</p>
                <p><strong>Hours Included:</strong> {tier.hoursIncluded} hrs/month</p>
                <p className="text-ink-3 pt-1">{tier.coverage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Call to Action */}
      <div className="p-8 sm:p-12 rounded-3xl bg-primary text-surface text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-surface font-normal">
          Let’s build the unified BionicIQ platform.
        </h2>
        <p className="text-sm text-surface/80 max-w-xl mx-auto leading-relaxed">
          I am ready to kick off with Phase 1 upon contract signature. Direct access, zero agency intermediaries, and daily git visibility.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              window.location.href = `mailto:${proposalConfig.contactEmail}?subject=BionicIQ%20Proposal%20Shortlist`;
            }}
            className="bg-clay text-white"
          >
            <span>Shortlist Engineering Partner</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
