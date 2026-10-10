import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Calendar,
  Database,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Server,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import clsx from 'clsx';

export function ProposalSection() {
  const [archMode, setArchMode] = useState<'zoho' | 'custom'>('zoho');
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const navigate = useNavigate();

  const phases = [
    {
      number: 1,
      title: 'Canonical Parts Master & Multi-OEM Cross-Referencing',
      duration: 'Weeks 1–3',
      milestone: '[Milestone 1 — 25% upon Parts Master acceptance]',
      deliverables: [
        'Relational schema design connecting canonical parts to infinite OEM numbers',
        'Normalizer pipeline handling spaces, hyphens, and leading zeros',
        'Excel & legacy catalogue ingestion tool with duplicate detection flags',
        'Part detail view with visual Reference Map & verified alternatives',
      ],
    },
    {
      number: 2,
      title: 'Pricing Intelligence & RFQ Import Automation',
      duration: 'Weeks 4–6',
      milestone: '[Milestone 2 — 25% upon RFQ Wizard deployment]',
      deliverables: [
        'Historical commercial memory log tracking every quote, sale and purchase',
        'Auto-identification of latest quotation (reference and date stamps)',
        '4-step RFQ spreadsheet wizard: Upload → Progressive Match → Margin Slider → Quote',
        'Multi-currency price ladder with landed cost (freight/duty) calculations',
      ],
    },
    {
      number: 3,
      title: 'Procurement, Customer POs & Partial Deliveries',
      duration: 'Weeks 7–9',
      milestone: '[Milestone 3 — 25% upon Order Fulfillment delivery]',
      deliverables: [
        'Customer sales orders linked directly to backing supplier purchase POs',
        'Partial delivery recording with waybill numbers and automated backorders',
        'Supplier comparison matrix evaluating lead times and historical on-time rates',
        'A4 commercial documentation generator (Quotations, Packing Lists, Invoices)',
      ],
    },
    {
      number: 4,
      title: 'Multi-Entity Consolidation, Statements & Migration Verification',
      duration: 'Weeks 10–12',
      milestone: '[Milestone 4 — 25% upon Final Sign-off & Client Validation]',
      deliverables: [
        'Multi-subsidiary governance (Stratum Peru, Zambia Ltd, International FZE)',
        'Receivables aging buckets (Current, 1–30, 31–60, 61–90, 90+) and statements',
        'Drive document relinking engine with original immutable preservation',
        'Role-based security matrix and staff training documentation',
      ],
    },
  ];

  const migrationSteps = [
    { num: '01', title: 'Inventory & Extraction', text: 'Scan and extract legacy Excel files, Zoho records, Billdu exports, and Google Drive PDFs.' },
    { num: '02', title: 'Normalization', text: 'Clean formatting variations (dashes, spaces, slashes) into normalized canonical search indexes.' },
    { num: '03', title: 'Cluster & Dedupe', text: 'Run fuzzy matching to detect duplicate part numbers and bilingual descriptions (EN / ES).' },
    { num: '04', title: 'Relink Documents', text: 'Automatically link historic Drive PDF invoices to transactions while leaving originals untouched.' },
    { num: '05', title: 'Client Validation', text: 'Collaborative exception review with your sales specialists to verify margin accuracy.' },
  ];

  const supportPlans = [
    {
      name: 'Essential',
      coverage: 'Business Hours (Lima / Lusaka)',
      responseTime: '4 Business Hours',
      deliverables: ['Bug fixes and patch updates', 'Monthly database backup integrity checks', 'Email support desk'],
    },
    {
      name: 'Growth (Recommended)',
      coverage: 'Extended Hours (12/5)',
      responseTime: '2 Hours Priority',
      deliverables: ['All Essential features', 'New OEM catalogue ingestion assistance', 'Quarterly workflow optimization review', 'Direct Slack / WhatsApp channel'],
    },
    {
      name: 'Partner',
      coverage: '24/7 Priority Emergency',
      responseTime: 'Under 1 Hour SLA',
      deliverables: ['Dedicated technical lead', 'Continuous schema enhancements', 'Custom reporting query development', 'Bi-weekly executive check-ins'],
    },
  ];

  return (
    <section id="proposal" className="py-24 px-4 sm:px-8 bg-bg border-t border-border">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            Freelance Bid Companion
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-normal text-ink-900 tracking-tight">
            Architecture, Delivery Phases & Migration Strategy
          </h2>
          <p className="text-sm text-ink-700 leading-relaxed">
            A structured blueprint designed specifically for an international spare parts trader operating across Peru and Zambia.
          </p>
        </div>

        {/* 1. Architecture Section with Toggle */}
        <div id="architecture" className="p-6 sm:p-10 bg-surface border border-border rounded-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="text-lg font-bold text-ink-900">Recommended System Architecture</h3>
              <p className="text-xs text-ink-500 mt-0.5">
                Compare a Zoho Creator-first implementation against a custom PostgreSQL/API stack.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-surface-sunken p-1 rounded-sm border border-border text-xs">
              <button
                type="button"
                onClick={() => setArchMode('zoho')}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xs font-medium transition-colors',
                  archMode === 'zoho'
                    ? 'bg-primary text-white font-bold shadow-xs'
                    : 'text-ink-500 hover:text-ink-900'
                )}
              >
                Zoho Creator-First (Fastest)
              </button>
              <button
                type="button"
                onClick={() => setArchMode('custom')}
                className={clsx(
                  'px-3.5 py-1.5 rounded-xs font-medium transition-colors',
                  archMode === 'custom'
                    ? 'bg-primary text-white font-bold shadow-xs'
                    : 'text-ink-500 hover:text-ink-900'
                )}
              >
                Custom Stack (Postgres + React)
              </button>
            </div>
          </div>

          {/* SVG Diagram */}
          <div className="p-6 bg-surface-sunken/40 rounded-md border border-border flex justify-center">
            <svg viewBox="0 0 800 240" className="w-full max-w-3xl select-none text-xs">
              {/* Box 1: Ingestion Sources */}
              <rect x="40" y="30" width="180" height="180" rx="6" fill="#FBFAF7" stroke="#CFC9BD" strokeWidth="1.5" />
              <text x="130" y="60" textAnchor="middle" fontWeight="bold" fill="#1E2623" fontSize="12">
                External Ingestion
              </text>
              <text x="130" y="90" textAnchor="middle" fill="#47524D" fontSize="11">• Client Excel RFQs</text>
              <text x="130" y="115" textAnchor="middle" fill="#47524D" fontSize="11">• Zoho CRM / Books</text>
              <text x="130" y="140" textAnchor="middle" fill="#47524D" fontSize="11">• Billdu Legacy Files</text>
              <text x="130" y="165" textAnchor="middle" fill="#47524D" fontSize="11">• Google Drive PDFs</text>

              {/* Arrow 1 -> 2 */}
              <line x1="220" y1="120" x2="300" y2="120" stroke="#2E4A42" strokeWidth="2" strokeDasharray="4 2" />
              <polygon points="300,120 292,116 292,124" fill="#2E4A42" />

              {/* Box 2: Core Platform Engine */}
              <rect x="310" y="20" width="220" height="200" rx="6" fill="#E4ECE8" stroke="#2E4A42" strokeWidth="2" />
              <text x="420" y="50" textAnchor="middle" fontWeight="bold" fill="#2E4A42" fontSize="13">
                {archMode === 'zoho' ? 'Zoho Creator Workflows' : 'FastAPI + Postgres Core'}
              </text>
              <text x="420" y="80" textAnchor="middle" fill="#1E2623" fontSize="11">• Canonical Parts Master</text>
              <text x="420" y="105" textAnchor="middle" fill="#1E2623" fontSize="11">• Multi-OEM Cross-Index</text>
              <text x="420" y="130" textAnchor="middle" fill="#1E2623" fontSize="11">• Price Ladder & Margin Engine</text>
              <text x="420" y="155" textAnchor="middle" fill="#1E2623" fontSize="11">• Linked Customer/Supplier POs</text>
              <text x="420" y="180" textAnchor="middle" fill="#1E2623" fontSize="11">• Multi-Entity Ledger Isolator</text>

              {/* Arrow 2 -> 3 */}
              <line x1="530" y1="120" x2="600" y2="120" stroke="#2E4A42" strokeWidth="2" strokeDasharray="4 2" />
              <polygon points="600,120 592,116 592,124" fill="#2E4A42" />

              {/* Box 3: Output Engine */}
              <rect x="610" y="30" width="160" height="180" rx="6" fill="#FBFAF7" stroke="#CFC9BD" strokeWidth="1.5" />
              <text x="690" y="60" textAnchor="middle" fontWeight="bold" fill="#1E2623" fontSize="12">
                Commercial Output
              </text>
              <text x="690" y="90" textAnchor="middle" fill="#47524D" fontSize="11">• Standard A4 Quotations</text>
              <text x="690" y="115" textAnchor="middle" fill="#47524D" fontSize="11">• Commercial Invoices</text>
              <text x="690" y="140" textAnchor="middle" fill="#47524D" fontSize="11">• Packing Lists</text>
              <text x="690" y="165" textAnchor="middle" fill="#47524D" fontSize="11">• Customer Statements</text>
            </svg>
          </div>

          {/* Trade-offs Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-surface-elevated rounded-sm border border-border space-y-2">
              <span className="font-bold text-ink-900 block text-sm">
                Zoho Creator-First Approach
              </span>
              <ul className="space-y-1 text-ink-700">
                <li>• <strong>Speed to Launch:</strong> Fastest deployment within existing Zoho ecosystem.</li>
                <li>• <strong>Cost:</strong> Low infrastructure overhead; runs on existing Zoho licenses.</li>
                <li>• <strong>Maintenance:</strong> Built-in mobile apps and cloud compliance out of the box.</li>
                <li>• <strong>Trade-off:</strong> Complex multi-OEM matching requires Deluge scripts and custom widgets for rich price ladders.</li>
              </ul>
            </div>

            <div className="p-4 bg-surface-elevated rounded-sm border border-border space-y-2">
              <span className="font-bold text-ink-900 block text-sm">
                Custom Stack (PostgreSQL + React + Python)
              </span>
              <ul className="space-y-1 text-ink-700">
                <li>• <strong>Speed & Power:</strong> Sub-millisecond fuzzy search over 500,000+ OEM references.</li>
                <li>• <strong>Complete Ownership:</strong> Zero per-user platform subscription fees; portable database.</li>
                <li>• <strong>Tailored UX:</strong> Pixel-perfect quotation builder and multi-supplier comparison without platform limits.</li>
                <li>• <strong>Trade-off:</strong> Requires dedicated cloud hosting (AWS / DigitalOcean / Supabase) and maintenance.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Four Delivery Phases with Expandable Milestones */}
        <div className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-bold text-ink-900">Four Delivery Phases & Milestones</h3>
            <p className="text-xs text-ink-500">
              Structured to ship usable software every three weeks, minimizing risk and ensuring client validation at each gate.
            </p>
          </div>

          <div className="space-y-3">
            {phases.map((ph) => {
              const isExpanded = expandedPhase === ph.number;
              return (
                <div
                  key={ph.number}
                  className="bg-surface border border-border rounded-md overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedPhase(isExpanded ? null : ph.number)}
                    className="w-full text-left p-5 flex items-center justify-between hover:bg-surface-sunken/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-primary-tint text-primary font-mono font-bold flex items-center justify-center text-xs shrink-0">
                        0{ph.number}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-ink-900">{ph.title}</h4>
                        <span className="text-[11px] text-ink-500 font-mono">{ph.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-accent hidden sm:inline">
                        {ph.milestone}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-ink-500" /> : <ChevronDown className="w-4 h-4 text-ink-500" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-border/60 bg-surface-sunken/20 space-y-3 text-xs">
                      <span className="text-[10.5px] uppercase font-bold text-ink-500 tracking-wider block font-mono">
                        Key Deliverables & Acceptance Criteria:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ph.deliverables.map((d, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-ink-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 text-[11px] font-mono text-ink-500">
                        Payment gate: {ph.milestone}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Migration Approach (5 Steps) */}
        <div className="p-6 sm:p-10 bg-surface border border-border rounded-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h3 className="text-lg font-bold text-ink-900">Five-Stage Migration Approach</h3>
              <p className="text-xs text-ink-500 mt-0.5">
                Preserve every original quotation and invoice while reconciling duplicate records.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/app/migration')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Migration Console
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {migrationSteps.map((st) => (
              <div key={st.num} className="p-4 bg-surface-sunken/40 rounded-sm border border-border space-y-2">
                <span className="font-mono text-base font-bold text-accent">{st.num}</span>
                <h4 className="font-bold text-xs text-ink-900 leading-tight">{st.title}</h4>
                <p className="text-[11px] text-ink-700 leading-relaxed">{st.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Support Options Plans (PRD Spec 7.6) */}
        <div id="support" className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-bold text-ink-900">Ongoing Support & SLA Options</h3>
            <p className="text-xs text-ink-500">
              Clear post-deployment support packages to ensure seamless continuous uptime across international time zones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportPlans.map((plan) => (
              <div
                key={plan.name}
                className={clsx(
                  'p-6 rounded-lg border space-y-4 flex flex-col justify-between shadow-xs',
                  plan.name.includes('Recommended')
                    ? 'bg-surface-elevated border-primary ring-2 ring-primary/20'
                    : 'bg-surface border-border'
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-ink-900">{plan.name}</span>
                    {plan.name.includes('Recommended') && (
                      <Badge variant="primary" size="sm">
                        Recommended
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-ink-700 border-b border-border pb-3">
                    <p>
                      <strong>Coverage:</strong> {plan.coverage}
                    </p>
                    <p>
                      <strong>SLA Response:</strong> {plan.responseTime}
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-ink-700 pt-1">
                    {plan.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border text-center">
                  <span className="text-[11px] font-mono text-ink-500 block mb-2">
                    [Retainer Rate: Quotation upon requirements finalization]
                  </span>
                  <a
                    href="#contact"
                    className="block text-center w-full py-2 bg-surface-sunken hover:bg-surface border border-border rounded-sm text-xs font-semibold text-ink-900 transition-colors"
                  >
                    Discuss this tier
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
