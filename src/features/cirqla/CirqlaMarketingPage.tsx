import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Button } from '../../components/ui/Button';
import { useCirqlaStore } from '../../store/cirqla';
import {
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  ChefHat,
  Sparkles,
  QrCode,
  Layers,
  CreditCard,
  BarChart3,
  Users,
  CheckCircle2,
} from 'lucide-react';

export const CirqlaMarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const { tenants } = useCirqlaStore();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [selectedThemeTenant, setSelectedThemeTenant] = useState(tenants[0]);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://bioniciq.example';
    const demoUrl = `${origin}/cirqla/scan/${selectedThemeTenant.slug}?table=12`;
    QRCode.toDataURL(demoUrl, {
      margin: 1,
      width: 220,
      color: {
        dark: '#17231F',
        light: '#FCFBF8',
      },
    }).then(setQrUrl);
  }, [selectedThemeTenant]);

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-20">
      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-clay-tint text-clay text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-clay" />
            <span>Cirqla Hospitality Platform</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-ink font-normal leading-[1.08] tracking-tight">
            Scan. Order. Paid.
          </h1>

          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl">
            Cirqla lets guests order and pay from their own phone, while your kitchen team sees every ticket the moment it lands. Zero app downloads, sub-300ms kitchen sync.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/cirqla/scan/kiln-street?table=12')}
            >
              <span>Try Customer Demo (Table 12)</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/cirqla/venue/orders')}
            >
              <span>Open Venue Dashboard</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>

          <div className="pt-2 text-xs text-ink-3">
            Open the customer demo and venue board in <strong>two browser tabs</strong> to watch live orders arrive without delay.
          </div>
        </div>

        {/* Hero Right: QR Table-Tent Preview */}
        <div className="lg:col-span-5 flex justify-center">
          <div
            onClick={() => navigate(`/cirqla/scan/${selectedThemeTenant.slug}?table=12`)}
            className="w-72 p-6 rounded-2xl bg-white border border-line-2 shadow-xl text-center cursor-pointer group hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="text-[10px] uppercase font-bold tracking-wider text-ink-3 mb-2">
              {selectedThemeTenant.name} · Table 12
            </div>
            <div className="p-3 bg-bg rounded-xl border border-line mb-3">
              {qrUrl ? (
                <img src={qrUrl} alt="Table QR code" className="w-full h-auto mx-auto" />
              ) : (
                <div className="w-44 h-44 bg-surface animate-pulse" />
              )}
            </div>
            <p className="text-xs font-semibold text-ink group-hover:text-clay transition-colors">
              On a phone? Point your camera here
            </p>
            <p className="text-[10px] text-ink-3 mt-0.5">
              Or click to launch framed preview
            </p>
          </div>
        </div>
      </div>

      {/* 3-Step Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl bg-surface border border-line">
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-clay">01. SCAN</span>
          <h3 className="font-serif text-xl text-ink">Instant Table Scan</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Diners scan an original QR on table tents. Loads in under 800ms with verified table session.
          </p>
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-clay">02. ORDER & PAY</span>
          <h3 className="font-serif text-xl text-ink">Custom Modifiers & Tap to Pay</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Guests customize sides and allergies, select tips, and pay with Apple/Google Pay or card.
          </p>
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-clay">03. DISPATCH</span>
          <h3 className="font-serif text-xl text-ink">Sub-300ms Kitchen Pass</h3>
          <p className="text-xs text-ink-2 leading-relaxed">
            Ticket flashes onto the kitchen display board with audible fire cue and status stepper.
          </p>
        </div>
      </div>

      {/* Multi-Tenant Re-skinning Live Callout */}
      <div className="p-8 sm:p-12 rounded-2xl bg-elevated border border-line space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-clay">
            Enterprise Architecture Proof
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            Multi-Tenant White-Labeling in Action
          </h2>
          <p className="text-xs text-ink-2 leading-relaxed">
            Switch between demo tenants below to observe how the entire diner client and accent color re-skins instantaneously via CSS variable injection:
          </p>
        </div>

        {/* Tenant Switcher Buttons */}
        <div className="flex flex-wrap gap-3">
          {tenants.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedThemeTenant(t)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-medium flex items-center gap-2 border transition-all ${
                selectedThemeTenant.id === t.id
                  ? 'border-ink bg-surface shadow-sm font-semibold'
                  : 'border-line bg-bg hover:bg-surface text-ink-2'
              }`}
            >
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
              <span>{t.name}</span>
              <span className="text-[10px] text-ink-3">({t.type})</span>
            </button>
          ))}
        </div>

        {/* Re-skinned Mini Preview */}
        <div className="p-4 rounded-xl bg-bg border border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold text-white shadow-sm"
              style={{ backgroundColor: selectedThemeTenant.accent }}
            >
              {selectedThemeTenant.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-ink">{selectedThemeTenant.name}</p>
              <p className="text-[11px] text-ink-3">Accent: <code className="font-mono">{selectedThemeTenant.accent}</code> · Branches: {selectedThemeTenant.branches.join(', ')}</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/cirqla/scan/${selectedThemeTenant.slug}?table=12`)}
            style={{ backgroundColor: selectedThemeTenant.accent }}
          >
            <span>Launch As {selectedThemeTenant.name}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-surface border border-line space-y-2">
          <ChefHat className="w-5 h-5 text-clay mb-1" />
          <h4 className="font-serif text-lg text-ink">Kitchen Display System</h4>
          <p className="text-xs text-ink-2 leading-relaxed">
            Full Kanban order boards with elapsed time warnings, arrival chimes, and ticket reprints.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-surface border border-line space-y-2">
          <Layers className="w-5 h-5 text-primary mb-1" />
          <h4 className="font-serif text-lg text-ink">Branch Pricing Overrides</h4>
          <p className="text-xs text-ink-2 leading-relaxed">
            Differ prices and item availability across Central, Riverside, and Airport locations seamlessly.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-surface border border-line space-y-2">
          <CreditCard className="w-5 h-5 text-ok mb-1" />
          <h4 className="font-serif text-lg text-ink">Automated Ledger Payouts</h4>
          <p className="text-xs text-ink-2 leading-relaxed">
            Integrated Stripe Connect ledger handling platform commission splits and direct CSV export.
          </p>
        </div>
      </div>

      {/* Example Pricing Tiers */}
      <div className="space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <span className="text-xs uppercase tracking-wider font-bold text-ink-3 block mb-1">
            Predictable SaaS Pricing
          </span>
          <h2 className="font-serif text-3xl text-ink font-normal">
            Example Platform Tiers
          </h2>
          <p className="text-xs text-ink-3 mt-1">
            Example pricing tiers configured in super-admin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-line space-y-4">
            <span className="text-xs uppercase font-bold text-ink-3 block">Starter</span>
            <div className="font-mono text-3xl font-bold text-ink">$99<span className="text-xs font-normal text-ink-3">/mo</span></div>
            <p className="text-xs text-ink-2">1 branch, up to 25 tables, standard support.</p>
            <Button variant="ghost" size="sm" block onClick={() => navigate('/cirqla/venue')}>
              View Venue Board
            </Button>
          </div>

          <div className="p-6 rounded-xl bg-elevated border-2 border-clay shadow-md space-y-4 relative">
            <span className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-clay text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <span className="text-xs uppercase font-bold text-clay block">Growth</span>
            <div className="font-mono text-3xl font-bold text-ink">$199<span className="text-xs font-normal text-ink-3">/mo</span></div>
            <p className="text-xs text-ink-2">Up to 3 branches, unlimited tables, staff RBAC & custom branding.</p>
            <Button variant="primary" size="sm" block onClick={() => navigate('/cirqla/venue')}>
              View Growth Features
            </Button>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-line space-y-4">
            <span className="text-xs uppercase font-bold text-ink-3 block">Scale</span>
            <div className="font-mono text-3xl font-bold text-ink">$399<span className="text-xs font-normal text-ink-3">/mo</span></div>
            <p className="text-xs text-ink-2">Unlimited branches, multi-region routing, dedicated SLA.</p>
            <Button variant="ghost" size="sm" block onClick={() => navigate('/cirqla/platform')}>
              View Super-Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
