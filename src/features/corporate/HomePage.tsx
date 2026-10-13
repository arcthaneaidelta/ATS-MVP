import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EcosystemScene } from './EcosystemScene';
import { Button } from '../../components/ui/Button';
import { useCmsStore } from '../../store/cms';
import { useDemoStore } from '../../store/demo';
import { serviceLines, caseStudies } from '../../data/seeds/corporate';
import QRCode from 'qrcode';
import {
  ArrowRight,
  ArrowUpRight,
  QrCode,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  UtensilsCrossed,
  Building,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { heroLabel, heroHeadline, heroLead, setHeroHeadline, setHeroLead } = useCmsStore();
  const { isEditMode } = useDemoStore();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    // Generate QR code pointing to customer demo route
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://bioniciq.example';
    const demoUrl = `${currentOrigin}/cirqla/scan/kiln-street?table=12`;
    QRCode.toDataURL(demoUrl, {
      margin: 1,
      width: 240,
      color: {
        dark: '#17231F',
        light: '#FCFBF8',
      },
    }).then(setQrDataUrl);
  }, []);

  return (
    <div className="relative">
      {/* 1. Hero Section with 2% Tonal Wash */}
      <section className="relative pt-12 pb-20 md:py-24 border-b border-line bg-gradient-to-b from-bg to-[#F1EDE3]">
        <div className="max-w-container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy */}
          <div className="lg:col-span-6 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-clay-tint text-clay border border-clay/20 text-xs uppercase tracking-wider font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-clay" />
              <span>{heroLabel}</span>
            </div>

            {/* H1 Display: In edit mode it has a dashed outline */}
            <h1
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => setHeroHeadline(e.currentTarget.textContent || '')}
              className={`font-serif text-4xl sm:text-6xl text-ink font-normal leading-[1.08] tracking-tight transition-all ${
                isEditMode
                  ? 'border border-dashed border-clay p-2 rounded-md bg-white/40 cursor-text'
                  : ''
              }`}
            >
              {heroHeadline}
            </h1>

            {/* Lead Paragraph */}
            <p
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => setHeroLead(e.currentTarget.textContent || '')}
              className={`font-sans text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl ${
                isEditMode
                  ? 'border border-dashed border-clay/60 p-2 rounded-md bg-white/40 cursor-text'
                  : ''
              }`}
            >
              {heroLead}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/contact')}
              >
                <span>Start a project</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  document.getElementById('ecosystem-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore the ecosystem</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>

            {/* Quiet Line Links */}
            <div className="pt-4 border-t border-line/60 flex flex-wrap items-center gap-3 text-xs text-ink-3 font-sans">
              <Link to="/services" className="hover:text-primary transition-colors">
                Corporate website
              </Link>
              <span>·</span>
              <Link to="/academy" className="hover:text-slate transition-colors">
                Academy LMS
              </Link>
              <span>·</span>
              <Link to="/cirqla" className="hover:text-clay transition-colors">
                Cirqla SaaS
              </Link>
            </div>
          </div>

          {/* Right Column: Live Ecosystem Scene */}
          <div className="lg:col-span-6">
            <EcosystemScene />
          </div>
        </div>
      </section>

      {/* 2. Engineering Standards Strip */}
      <section className="py-8 bg-surface border-b border-line text-xs font-sans">
        <div className="max-w-container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg text-primary border border-line">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-ink block">Multi-tenant by design</span>
              <span className="text-ink-3 text-[11px]">Row-level isolation</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg text-clay border border-line">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-ink block">Payments-ready</span>
              <span className="text-ink-3 text-[11px]">Split ledger & Stripe</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg text-ok border border-line">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-ink block">WCAG 2.1 AA certified</span>
              <span className="text-ink-3 text-[11px]">Accessible typography</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-bg text-slate border border-line">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-ink block">Tested end to end</span>
              <span className="text-ink-3 text-[11px]">Sub-300ms live sync</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pinned Ecosystem Section */}
      <section id="ecosystem-section" className="py-20 md:py-28 max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (Sticky Desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
              Architectural Cohesion
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal leading-tight">
              One system, three surfaces.
            </h2>
            <p className="text-sm font-sans text-ink-2 leading-relaxed">
              Instead of hiring three disparate agencies with conflicting designs and codebases, BionicIQ deploys one unified design language and shared transactional core.
            </p>
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/proposal')}
              >
                <span>Review Tech Stack Rationale</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Right Column: 3 Surface Panels */}
          <div className="lg:col-span-8 space-y-8">
            {/* Surface 1: Corporate Platform */}
            <div className="bg-surface rounded-xl border border-line p-8 text-left hover:border-line-2 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  <span className="text-xs uppercase tracking-wider font-bold text-ink">
                    01 · Corporate Brand & Headless CMS
                  </span>
                </div>
                <span className="text-xs text-ink-3 font-mono">Editorial Flagship</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-2">
                Conversion-engineered corporate portal with live inline publishing.
              </h3>
              <p className="text-sm text-ink-2 mb-6 leading-relaxed">
                Empower your content editors without sacrificing page speed. Features instant metadata checks, Google search previewing, and multi-step lead intake funnels.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => navigate('/services')}>
                  Explore Services
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/case-studies')}>
                  See Case Studies
                </Button>
              </div>
            </div>

            {/* Surface 2: Academy LMS */}
            <div className="bg-surface rounded-xl border border-line p-8 text-left hover:border-slate/40 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-slate" />
                  <span className="text-xs uppercase tracking-wider font-bold text-ink">
                    02 · BionicIQ Academy LMS
                  </span>
                </div>
                <span className="text-xs text-slate font-mono">Learning & Certification</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-2">
                Reading-first course delivery, timed assessments, and verifiable diplomas.
              </h3>
              <p className="text-sm text-ink-2 mb-6 leading-relaxed">
                Complete learning loop in two minutes: enrolled students track module completion, take randomized 5-question quizzes, and receive cryptographic verifiable PDF certificates.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="primary" size="sm" onClick={() => navigate('/academy')}>
                  Open Academy Catalog
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/academy/app')}>
                  Launch Student Dashboard
                </Button>
              </div>
            </div>

            {/* Surface 3: Cirqla Hospitality SaaS */}
            <div className="bg-surface rounded-xl border border-line p-8 text-left hover:border-clay/40 transition-colors">
              <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-clay" />
                  <span className="text-xs uppercase tracking-wider font-bold text-ink">
                    03 · Cirqla Multi-Tenant SaaS
                  </span>
                </div>
                <span className="text-xs text-clay font-mono">Hospitality Ordering</span>
              </div>
              <h3 className="font-serif text-2xl text-ink mb-2">
                Scan-to-pay mobile diner client connected to real-time kitchen displays.
              </h3>
              <p className="text-sm text-ink-2 mb-6 leading-relaxed">
                The centerpiece wow moment: diners order at table #12 with required modifiers and test cards; tickets arrive on the kitchen board under 300ms across tabs.
              </p>
              <div className="flex items-center gap-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/cirqla/scan/kiln-street?table=12')}
                >
                  Try Customer QR App
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/cirqla/venue/orders')}
                >
                  Open Venue Board
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cirqla Spotlight with Table-Tent QR Code */}
      <section className="py-16 bg-surface border-y border-line">
        <div className="max-w-container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-4 text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-clay">
              Live Showcase
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
              Experience Cirqla as a guest at Table 12.
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed max-w-lg">
              Point your smartphone camera at the table-tent card below, or click directly to launch the mobile diner web app in a framed preview. Place an order, choose sides, pay with test cards, and watch the status advance in real time.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/cirqla/scan/kiln-street?table=12')}
              >
                <span>Launch Diner Phone App</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => window.open('/cirqla/venue/orders', '_blank')}
              >
                <span>Open Kitchen in 2nd Tab</span>
                <ArrowUpRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            {/* Table-Tent QR Card */}
            <div
              onClick={() => navigate('/cirqla/scan/kiln-street?table=12')}
              className="w-64 p-5 rounded-2xl bg-white border border-line-2 shadow-lg text-center cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-3 mb-2">
                Kiln Street Kitchen · Table 12
              </div>
              <div className="relative p-2 bg-bg rounded-xl border border-line mb-3 overflow-hidden">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Table 12 QR Code" className="w-full h-auto mx-auto" />
                ) : (
                  <div className="w-44 h-44 bg-surface animate-pulse" />
                )}
                {/* Scan sweep line */}
                <div className="absolute left-0 right-0 h-0.5 bg-clay/60 top-1/2 -translate-y-1/2 shadow-sm animate-pulse pointer-events-none" />
              </div>
              <p className="text-xs font-semibold text-ink group-hover:text-clay transition-colors">
                Scan or Click to Order
              </p>
              <p className="text-[10px] text-ink-3 mt-0.5">
                Simulated checkout with instant kitchen sync
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services Line Strip */}
      <section className="py-20 max-w-container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-primary mb-1 block">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
              What we build, and how we keep it running.
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-semibold text-clay hover:underline inline-flex items-center gap-1 mt-4 md:mt-0"
          >
            <span>All 4 Service Lines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {serviceLines.map((svc) => (
            <div
              key={svc.id}
              className="p-6 rounded-xl bg-surface border border-line hover:border-line-2 hover:shadow-sm transition-all group"
            >
              <h3 className="font-serif text-lg text-ink group-hover:text-primary transition-colors mb-2">
                {svc.title}
              </h3>
              <p className="text-xs text-ink-2 leading-relaxed mb-4">
                {svc.description}
              </p>
              <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-clay font-medium">
                <Link to="/services" className="hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Selected Case Studies */}
      <section className="py-16 bg-surface border-t border-line">
        <div className="max-w-container mx-auto px-6 text-left">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-ink-3 block mb-1">
                Engineering Track Record
              </span>
              <h2 className="font-serif text-3xl text-ink font-normal">
                Similar Systems Delivered
              </h2>
            </div>
            <Link
              to="/case-studies"
              className="text-xs font-semibold text-clay hover:underline flex items-center gap-1"
            >
              <span>View All 3 Studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <div
                key={cs.slug}
                onClick={() => navigate(`/case-studies/${cs.slug}`)}
                className="p-6 rounded-xl bg-elevated border border-line hover:border-line-2 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="text-[10px] uppercase font-bold tracking-wider text-clay mb-2">
                  {cs.clientType}
                </div>
                <h3 className="font-serif text-xl text-ink group-hover:text-primary transition-colors mb-2">
                  {cs.title}
                </h3>
                <p className="text-xs text-ink-2 leading-relaxed mb-4">
                  {cs.summary}
                </p>
                <div className="pt-4 border-t border-line grid grid-cols-2 gap-2 text-xs">
                  {cs.outcomeMetrics.slice(0, 2).map((m, idx) => (
                    <div key={idx}>
                      <span className="font-mono font-bold text-ink text-sm block">
                        {m.value}
                      </span>
                      <span className="text-[10px] text-ink-3">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
