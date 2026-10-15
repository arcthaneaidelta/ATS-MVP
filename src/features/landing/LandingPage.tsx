import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  CreditCard,
  FileText,
  Clock,
  Sparkles,
  TrendingUp,
  Building2,
  Users,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { MeterBar } from '../../components/MeterBar';
import { useStore } from '../../store/useStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const setRole = useStore((s) => s.setRole);
  const setActiveBuyerId = useStore((s) => s.setActiveBuyerId);

  // Adaptive Loader state (PRD 4.1: once per session)
  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem('meridian_loader_played');
  });
  const [loaderPhase, setLoaderPhase] = useState<'enter' | 'rotate' | 'exit'>('enter');

  // Live product panel 6-second state machine loop (PRD 4.2 & Wow Moment 1)
  const [demoStateIndex, setDemoStateIndex] = useState<number>(0);
  const demoStates = [
    {
      status: 'submitted' as const,
      statusLabel: 'Submitted',
      note: 'Buyer Elena submitted booking on valid quote Q-2038.',
      paymentsConfirmed: 0,
      totalPayments: 3,
      amountConfirmed: 0,
      totalAmount: 11900,
    },
    {
      status: 'approved' as const,
      statusLabel: 'Approved',
      note: 'Admin verified eligibility & generated 3 supplier lines.',
      paymentsConfirmed: 0,
      totalPayments: 3,
      amountConfirmed: 0,
      totalAmount: 11900,
    },
    {
      status: 'partially_paid' as const,
      statusLabel: 'Payment 2 of 3',
      note: 'Coordinator confirmed Hotel Lagazuoi and Transfers wires.',
      paymentsConfirmed: 2,
      totalPayments: 3,
      amountConfirmed: 7700,
      totalAmount: 11900,
    },
    {
      status: 'completed' as const,
      statusLabel: 'Completed',
      note: 'All supplier accounts confirmed. Travel vouchers delivered.',
      paymentsConfirmed: 3,
      totalPayments: 3,
      amountConfirmed: 11900,
      totalAmount: 11900,
    },
  ];

  // Story step state (3 steps)
  const [activeStoryStep, setActiveStoryStep] = useState<number>(0);

  // Loader sequence orchestration
  useEffect(() => {
    if (!showLoader) return;

    const t1 = setTimeout(() => setLoaderPhase('rotate'), 500);
    const t2 = setTimeout(() => setLoaderPhase('exit'), 900);
    const t3 = setTimeout(() => {
      setShowLoader(false);
      sessionStorage.setItem('meridian_loader_played', 'true');
    }, 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [showLoader]);

  // Live 6s product loop
  useEffect(() => {
    const loopInterval = setInterval(() => {
      setDemoStateIndex((prev) => (prev + 1) % demoStates.length);
    }, 2800); // 2.8s per stage for a punchy, observable 11s full loop
    return () => clearInterval(loopInterval);
  }, []);

  const currentLiveState = demoStates[demoStateIndex];

  const handleStartFree = () => {
    setRole('buyer');
    setActiveBuyerId('buyer-4'); // Juniper (Explorer)
    navigate('/app');
  };

  return (
    <div className="relative min-h-screen bg-meridian-bg text-meridian-text-primary overflow-x-hidden">
      {/* 4.1 ADAPTIVE LOADER OVERLAY */}
      {showLoader && (
        <div className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-meridian-bg">
          <div
            className={`transition-all duration-360 ease-out flex flex-col items-center ${
              loaderPhase === 'exit' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass
                className={`w-8 h-8 text-meridian-primary transition-transform duration-400 ease-out ${
                  loaderPhase === 'rotate' || loaderPhase === 'exit' ? 'rotate-45' : 'rotate-0'
                }`}
              />
              <span className="font-serif text-3xl font-medium tracking-tight text-meridian-primary">
                Meridian
              </span>
            </div>
            <div className="w-32 h-[1px] bg-meridian-border-strong mt-3 overflow-hidden">
              <div
                className={`h-full bg-meridian-primary transition-all duration-700 ease-in-out ${
                  loaderPhase === 'enter' ? 'w-1/3' : 'w-full'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <header className="border-b border-meridian-border bg-meridian-bg/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-meridian-primary" />
              <span className="font-serif text-xl font-medium tracking-tight text-meridian-primary">
                Meridian
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-meridian-text-secondary">
              <a href="#lifecycle" className="hover:text-meridian-text-primary">
                Lifecycle
              </a>
              <a href="#story" className="hover:text-meridian-text-primary">
                How It Works
              </a>
              <Link to="/plans" className="hover:text-meridian-text-primary">
                Plans & Allowances
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/plans"
              className="text-xs font-medium text-meridian-text-secondary hover:text-meridian-text-primary px-3 py-1.5"
            >
              View plans
            </Link>
            <Button variant="accent" size="sm" onClick={handleStartFree}>
              Start free
            </Button>
          </div>
        </div>
      </header>

      {/* 4.2 HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-meridian-primary-tint/60 text-meridian-primary rounded-full text-xs font-medium border border-meridian-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ATS Part 2 • Operator & Buyer Revenue Lifecycle</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] font-medium tracking-[-0.02em] text-meridian-text-primary">
              Every booking, accounted for.
            </h1>

            <p className="text-base sm:text-lg text-meridian-text-secondary leading-relaxed max-w-xl font-sans">
              One portal for quotes, approvals and supplier payments, built for the way tour operators actually work.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="accent"
                size="lg"
                onClick={handleStartFree}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Start free (Explorer)
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/plans')}
              >
                View plans & allowances
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-meridian-text-muted">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-meridian-success" />
                <span>Server-enforced limits</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-meridian-success" />
                <span>Per-supplier payment lines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-meridian-success" />
                <span>Multi-role access control</span>
              </div>
            </div>
          </div>

          {/* Right Column: WOW MOMENT 1 LIVE PRODUCT PANEL */}
          <div className="lg:col-span-6">
            <div className="relative rounded-modal border border-meridian-border bg-meridian-surface shadow-sh-2 overflow-hidden p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-meridian-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-meridian-accent animate-pulse" />
                  <div>
                    <span className="text-xs font-mono font-semibold text-meridian-text-primary">
                      BK-2603 • Live Lifecycle Monitor
                    </span>
                    <p className="text-[11px] text-meridian-text-muted">
                      Dolomites High Routes & Hut Trek (8 Pax)
                    </p>
                  </div>
                </div>
                <StatusChip kind="booking" status={currentLiveState.status} />
              </div>

              {/* Progress step indicators */}
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                {demoStates.map((s, idx) => {
                  const isCurrent = idx === demoStateIndex;
                  const isPassed = idx < demoStateIndex;
                  return (
                    <div
                      key={s.status}
                      className={`p-2 rounded border transition-all duration-300 ${
                        isCurrent
                          ? 'border-meridian-primary bg-meridian-primary-tint font-semibold text-meridian-primary shadow-xs'
                          : isPassed
                          ? 'border-meridian-success/40 bg-meridian-success-tint/30 text-meridian-success'
                          : 'border-meridian-border bg-meridian-surface-sunken/40 text-meridian-text-muted'
                      }`}
                    >
                      <span>{s.statusLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* Live Status Note */}
              <div className="bg-meridian-surface-sunken p-3.5 rounded-card border border-meridian-border text-xs flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-meridian-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-meridian-text-primary">
                    State Machine Step: {currentLiveState.statusLabel}
                  </p>
                  <p className="text-meridian-text-secondary text-[11px] leading-relaxed">
                    {currentLiveState.note}
                  </p>
                </div>
              </div>

              {/* Segmented Roll-up Payment Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-meridian-text-secondary">
                    Supplier Payment Settlement
                  </span>
                  <span className="font-mono tabular-nums text-meridian-text-primary">
                    {currentLiveState.paymentsConfirmed} of {currentLiveState.totalPayments} confirmed ($
                    {currentLiveState.amountConfirmed.toLocaleString()} / $
                    {currentLiveState.totalAmount.toLocaleString()})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-2.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full rounded-sm transition-colors duration-400 ${
                        i < currentLiveState.paymentsConfirmed
                          ? 'bg-meridian-success'
                          : 'bg-meridian-surface-sunken border border-meridian-border'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Interactive jump button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-meridian-text-muted font-mono">
                  Real-time 6s cycle • Powered by stateMachine.ts
                </span>
                <button
                  onClick={() => navigate('/app')}
                  className="text-xs font-semibold text-meridian-accent hover:underline flex items-center gap-1"
                >
                  Jump into Buyer Portal <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="flex flex-col items-center justify-center pt-16">
          <div className="w-[1px] h-6 bg-meridian-border-strong relative overflow-hidden">
            <div className="w-full h-2 bg-meridian-primary absolute animate-bounce" />
          </div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-meridian-text-muted mt-2">
            Scroll to explore lifecycle
          </span>
        </div>
      </section>

      {/* 4.2 SECTION 1: THREE-STEP LIFECYCLE STRIP */}
      <section id="lifecycle" className="py-16 bg-meridian-surface border-y border-meridian-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
              Revenue Engine
            </span>
            <h2 className="font-serif text-3xl font-medium text-meridian-text-primary">
              Subscribe, Book, Pay, Complete.
            </h2>
            <p className="text-xs sm:text-sm text-meridian-text-secondary font-sans">
              Moving past passive quoting into an enforceable operational workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-meridian-bg rounded-card border border-meridian-border p-6 space-y-4">
              <div className="w-10 h-10 rounded-full bg-meridian-primary-tint text-meridian-primary flex items-center justify-center font-serif text-lg font-bold">
                1
              </div>
              <h3 className="font-serif text-xl font-medium text-meridian-text-primary">
                1. Tiered Subscription
              </h3>
              <p className="text-xs text-meridian-text-secondary leading-relaxed">
                Free Explorer agencies browse and request quotes. Upgrading to Professional unlocks direct booking and grants a monthly booking volume quota.
              </p>
              <div className="pt-2 text-[11px] font-mono text-meridian-primary font-medium">
                • 0 / $0 Free tier locked
                <br />• 12 Bookings / $60k Pro tier
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-meridian-bg rounded-card border border-meridian-border p-6 space-y-4">
              <div className="w-10 h-10 rounded-full bg-meridian-accent-tint text-meridian-accent flex items-center justify-center font-serif text-lg font-bold">
                2
              </div>
              <h3 className="font-serif text-xl font-medium text-meridian-text-primary">
                2. Server-Side Eligibility
              </h3>
              <p className="text-xs text-meridian-text-secondary leading-relaxed">
                Every booking passes 5 rigorous backend checks: tenant role, active plan, quote validity date, monthly count allowance, and total value ceiling.
              </p>
              <div className="pt-2 text-[11px] font-mono text-meridian-accent font-medium">
                • Real-time rule resolution
                <br />• Honest failure & fix cues
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-meridian-bg rounded-card border border-meridian-border p-6 space-y-4">
              <div className="w-10 h-10 rounded-full bg-meridian-info-tint text-meridian-info flex items-center justify-center font-serif text-lg font-bold">
                3
              </div>
              <h3 className="font-serif text-xl font-medium text-meridian-text-primary">
                3. Per-Supplier Settlement
              </h3>
              <p className="text-xs text-meridian-text-secondary leading-relaxed">
                Bookings generate distinct lines for hotels, coaches, and mountain guides. Buyer uploads proof; Coordinator confirms; completion unlocks only when 100% confirmed.
              </p>
              <div className="pt-2 text-[11px] font-mono text-meridian-info font-medium">
                • Roll-up status tracking
                <br />• Reconsideration & override
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.2 SECTION 2: STICKY STORY SECTION (3 Steps) */}
      <section id="story" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-primary">
            Interactive Architecture
          </span>
          <h2 className="font-serif text-3xl font-medium text-meridian-text-primary">
            Designed for Enforced Trust
          </h2>
          <p className="text-xs sm:text-sm text-meridian-text-secondary">
            Click through the core mechanisms to see how the portal operates behind the scenes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step navigation tabs */}
          <div className="lg:col-span-5 space-y-3">
            {[
              {
                title: 'Data-Driven Allowance Meters',
                subtitle: 'Visible quotas that govern monthly capacity',
                desc: 'Buyers monitor real-time booking count and dollar value meters. When a tier cap is approached, the system indicates upgrade pathways without abrupt lockouts.',
              },
              {
                title: 'Server Eligibility Rules 01 to 05',
                subtitle: 'Sequential checklist with explicit error causes',
                desc: 'Expired quotes (like Q-2041) or lapsed accounts fail with actionable reasons: "Quote expired on 12 Oct 2026. Request refreshed quote."',
              },
              {
                title: 'Per-Supplier Proof & Coordinator Queue',
                subtitle: 'Separation of concerns between operator and payments',
                desc: 'Payment coordinators verify SWIFT receipts and invoices line-by-line. Only when all supplier lines are confirmed can the operator admin mark a tour Completed.',
              },
            ].map((step, idx) => {
              const isSelected = activeStoryStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStoryStep(idx)}
                  className={`p-5 rounded-card border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-meridian-primary bg-meridian-surface shadow-sh-2'
                      : 'border-meridian-border bg-meridian-surface-sunken/40 hover:bg-meridian-surface'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-meridian-accent">
                      0{idx + 1}
                    </span>
                    <h4 className="font-serif text-base font-medium text-meridian-text-primary">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs font-medium text-meridian-text-secondary">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-meridian-text-muted mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic display based on story step */}
          <div className="lg:col-span-7 bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-2 p-6 min-h-[360px] flex flex-col justify-center">
            {activeStoryStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-meridian-border pb-3">
                  <h4 className="font-serif font-medium text-meridian-text-primary">
                    Professional Plan Usage • Atlas and Pine Travel
                  </h4>
                  <StatusChip kind="subscription" status="active" />
                </div>
                <MeterBar
                  label="Monthly Bookings Allowance"
                  current={11}
                  max={12}
                  unitSuffix=" bookings"
                />
                <MeterBar
                  label="Monthly Booking Gross Value"
                  current={58200}
                  max={60000}
                  unitPrefix="$"
                />
                <div className="p-3 bg-meridian-warning-tint/50 border border-meridian-warning/30 rounded text-xs text-meridian-warning leading-snug">
                  <strong>Notice:</strong> Atlas and Pine Travel has used 11 of 12 bookings this month. The next booking will reach the Professional quota threshold.
                </div>
              </div>
            )}

            {activeStoryStep === 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-meridian-border pb-2">
                  <h4 className="font-serif font-medium text-meridian-text-primary">
                    Server Rule Resolution • Quote Q-2041 Check
                  </h4>
                  <span className="text-xs font-mono text-meridian-error">1 of 5 Failed</span>
                </div>
                <div className="p-2.5 rounded border border-meridian-success/40 bg-meridian-success-tint/20 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-meridian-success shrink-0" />
                  <span>Rule 01: Account and Role verified (Juniper Events)</span>
                </div>
                <div className="p-2.5 rounded border border-meridian-success/40 bg-meridian-success-tint/20 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-meridian-success shrink-0" />
                  <span>Rule 02: Active Professional Tier Entitlement</span>
                </div>
                <div className="p-2.5 rounded border border-meridian-error/40 bg-meridian-error-tint/30 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-meridian-error text-white text-[10px] flex items-center justify-center font-bold">
                      ✕
                    </span>
                    <span className="text-meridian-error font-medium">
                      Rule 03: Quote Q-2041 expired on 12 Oct 2026. Request refreshed quote.
                    </span>
                  </div>
                  <Button size="sm" variant="accent">
                    Refresh Quote
                  </Button>
                </div>
              </div>
            )}

            {activeStoryStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-meridian-border pb-3">
                  <h4 className="font-serif font-medium text-meridian-text-primary">
                    BK-2609 Payment Roll-up • 3 Supplier Lines
                  </h4>
                  <span className="text-xs font-mono font-semibold text-meridian-accent">
                    2 of 3 Confirmed
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-meridian-surface-sunken rounded border border-meridian-border">
                    <div>
                      <p className="font-semibold">Casa Albaicín Boutique ($18,000)</p>
                      <p className="text-[11px] text-meridian-text-muted">
                        Confirmed by Clara Vance (Coordinator)
                      </p>
                    </div>
                    <StatusChip kind="payment" status="confirmed" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-meridian-surface-sunken rounded border border-meridian-border">
                    <div>
                      <p className="font-semibold">Rail Iberia Charters ($9,500)</p>
                      <p className="text-[11px] text-meridian-text-muted">
                        Confirmed by Clara Vance (Coordinator)
                      </p>
                    </div>
                    <StatusChip kind="payment" status="confirmed" />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-meridian-surface-sunken rounded border border-meridian-border">
                    <div>
                      <p className="font-semibold">Flamenco Del Sur Heritage ($4,500)</p>
                      <p className="text-[11px] text-meridian-text-muted">
                        Proof uploaded (remittance_bodega_gala.pdf)
                      </p>
                    </div>
                    <StatusChip kind="payment" status="proof_uploaded" />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-meridian-text-muted">Admin Completion Gate:</span>
                  <Button size="sm" variant="secondary" disabled disabledTooltip="Blocked: Line 3 (Flamenco Del Sur) is pending coordinator confirmation">
                    Complete Booking (Locked)
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4.2 SECTION 4: NUMBERS BAND */}
      <section className="py-14 bg-meridian-surface-sunken border-y border-meridian-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-medium text-meridian-primary">
              $1.4M+
            </div>
            <p className="text-xs text-meridian-text-secondary mt-1">
              Monthly Tour Volume Processed
            </p>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-medium text-meridian-primary">
              100%
            </div>
            <p className="text-xs text-meridian-text-secondary mt-1">
              Server-Verified Eligibility
            </p>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-medium text-meridian-primary">
              3 Roles
            </div>
            <p className="text-xs text-meridian-text-secondary mt-1">
              Buyer, Operator Admin & Coordinator
            </p>
          </div>
          <div>
            <div className="font-serif text-3xl sm:text-4xl font-medium text-meridian-primary">
              &lt;24h
            </div>
            <p className="text-xs text-meridian-text-secondary mt-1">
              Average Approval SLA
            </p>
          </div>
        </div>
      </section>

      {/* 4.2 SECTION 5: PLANS TEASER */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
            Tiered Capacity
          </span>
          <h2 className="font-serif text-3xl font-medium text-meridian-text-primary">
            Choose Your Operator Plan
          </h2>
          <p className="text-xs text-meridian-text-secondary">
            Explorer allows free browsing and quoting. Activate Professional or Enterprise for volume direct booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Explorer */}
          <div className="bg-meridian-surface border border-meridian-border rounded-card p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-meridian-text-muted">
                Explorer
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl font-medium text-meridian-text-primary">
                  $0
                </span>
                <span className="text-xs text-meridian-text-muted">/ month</span>
              </div>
              <p className="text-xs text-meridian-text-secondary">
                For exploring agencies requesting quotes and researching itineraries.
              </p>
              <div className="border-t border-meridian-border pt-4 space-y-2 text-xs text-meridian-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span>Unlimited catalog browsing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span>Quote request submissions</span>
                </div>
                <div className="flex items-center gap-2 text-meridian-text-muted">
                  <Lock className="w-3.5 h-3.5 text-meridian-accent" />
                  <span>0 Monthly bookings (Locked)</span>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleStartFree}
              >
                Start on Explorer
              </Button>
            </div>
          </div>

          {/* Professional (Most chosen) */}
          <div className="bg-meridian-surface border-2 border-meridian-primary rounded-card p-6 flex flex-col justify-between shadow-sh-2 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-meridian-primary text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full">
              Most chosen
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-meridian-primary font-bold">
                Professional
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl font-medium text-meridian-text-primary">
                  $149
                </span>
                <span className="text-xs text-meridian-text-muted">/ month</span>
              </div>
              <p className="text-xs text-meridian-text-secondary">
                Standard tier for active boutique agencies, DMCs, and travel planners.
              </p>
              <div className="border-t border-meridian-border pt-4 space-y-2 text-xs text-meridian-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span><strong>12 bookings</strong> per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span><strong>$60,000</strong> monthly booking value</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span>5 team agency seats</span>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setRole('buyer');
                  setActiveBuyerId('buyer-4');
                  navigate('/app/subscription');
                }}
              >
                Activate Professional
              </Button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="bg-meridian-surface border border-meridian-border rounded-card p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase text-meridian-text-muted">
                Enterprise
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-serif text-3xl font-medium text-meridian-text-primary">
                  $490
                </span>
                <span className="text-xs text-meridian-text-muted">/ month</span>
              </div>
              <p className="text-xs text-meridian-text-secondary">
                High-volume wholesale tour operators with priority review SLAs.
              </p>
              <div className="border-t border-meridian-border pt-4 space-y-2 text-xs text-meridian-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span><strong>60 bookings</strong> per month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span><strong>$400,000</strong> monthly booking value</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-meridian-success" />
                  <span>25 agency seats & priority review</span>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/plans')}
              >
                Compare details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-meridian-border bg-meridian-surface py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-meridian-text-secondary">
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-meridian-primary" />
            <span className="font-serif font-semibold text-meridian-text-primary">
              Meridian Trade Portal
            </span>
            <span className="text-meridian-text-muted">© 15 Oct 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/app" className="hover:text-meridian-text-primary">
              Buyer Portal
            </Link>
            <Link to="/admin" className="hover:text-meridian-text-primary">
              Operator Admin
            </Link>
            <Link to="/coord/payments" className="hover:text-meridian-text-primary">
              Coordinator
            </Link>
            <Link to="/plans" className="hover:text-meridian-text-primary">
              Plans & Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
