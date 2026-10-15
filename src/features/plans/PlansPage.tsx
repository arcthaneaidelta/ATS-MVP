import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Compass, Check, X, ArrowLeft, Shield, Zap, Sparkles } from 'lucide-react';
import { Button } from '../../components/Button';
import { useStore } from '../../store/useStore';

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const setRole = useStore((s) => s.setRole);
  const setActiveBuyerId = useStore((s) => s.setActiveBuyerId);

  const handleSelectPlan = (planId: 'explorer' | 'professional' | 'enterprise') => {
    setRole('buyer');
    if (planId === 'explorer') {
      setActiveBuyerId('buyer-4'); // Juniper (Explorer)
      navigate('/app');
    } else {
      setActiveBuyerId('buyer-4');
      navigate('/app/subscription');
    }
  };

  return (
    <div className="min-h-screen bg-meridian-bg text-meridian-text-primary pb-20">
      {/* Header */}
      <header className="border-b border-meridian-border bg-meridian-surface sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-medium text-meridian-text-secondary hover:text-meridian-text-primary">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-meridian-primary" />
            <span className="font-serif text-lg font-medium text-meridian-primary">
              Meridian Plans
            </span>
          </div>
          <Button size="sm" variant="accent" onClick={() => navigate('/app')}>
            Enter Portal
          </Button>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center space-y-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-accent">
          Volume Entitlements & Pricing
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-meridian-text-primary">
          Predictable operator allowances.
        </h1>
        <p className="text-xs sm:text-sm text-meridian-text-secondary max-w-xl mx-auto leading-relaxed">
          Choose a tier that mirrors your agency’s monthly throughput. All plans enforce server-side rules and provide automated per-supplier payment tracking.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Explorer */}
        <div className="bg-meridian-surface border border-meridian-border rounded-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-meridian-text-muted">Explorer</span>
              <span className="text-xs bg-meridian-surface-sunken px-2 py-0.5 rounded text-meridian-text-muted font-mono">Free</span>
            </div>
            <div>
              <span className="font-serif text-4xl font-medium text-meridian-text-primary">$0</span>
              <span className="text-xs text-meridian-text-muted ml-1">/ month</span>
            </div>
            <p className="text-xs text-meridian-text-secondary">
              Browse tours, examine supplier portfolios, and request customized operator quotes. Direct booking is locked.
            </p>
            <div className="pt-4 border-t border-meridian-border space-y-2 text-xs">
              <div className="font-semibold text-meridian-text-primary">Included allowances:</div>
              <div className="flex items-center gap-2 text-meridian-text-secondary">
                <Check className="w-4 h-4 text-meridian-success" />
                <span>Quote requests & custom itineraries</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-secondary">
                <Check className="w-4 h-4 text-meridian-success" />
                <span>1 Agency seat</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-muted">
                <X className="w-4 h-4 text-meridian-border-strong" />
                <span>0 monthly bookings (direct booking locked)</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Button variant="secondary" className="w-full" onClick={() => handleSelectPlan('explorer')}>
              Start Free on Explorer
            </Button>
          </div>
        </div>

        {/* Professional (Most Chosen) */}
        <div className="bg-meridian-surface border-2 border-meridian-primary rounded-card p-6 flex flex-col justify-between shadow-sh-2 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-meridian-primary text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full">
            Most chosen
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-meridian-primary font-bold">Professional</span>
              <Zap className="w-4 h-4 text-meridian-primary" />
            </div>
            <div>
              <span className="font-serif text-4xl font-medium text-meridian-text-primary">$149</span>
              <span className="text-xs text-meridian-text-muted ml-1">/ month</span>
            </div>
            <p className="text-xs text-meridian-text-secondary">
              The benchmark tier for established agencies, DMCs, and corporate planners needing guaranteed volume.
            </p>
            <div className="pt-4 border-t border-meridian-border space-y-2 text-xs">
              <div className="font-semibold text-meridian-text-primary">Included allowances:</div>
              <div className="flex items-center gap-2 text-meridian-text-primary font-medium">
                <Check className="w-4 h-4 text-meridian-success" />
                <span><strong>12 direct bookings</strong> / month</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-primary font-medium">
                <Check className="w-4 h-4 text-meridian-success" />
                <span><strong>$60,000</strong> gross booking value / month</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-secondary">
                <Check className="w-4 h-4 text-meridian-success" />
                <span>5 agency team seats</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-secondary">
                <Check className="w-4 h-4 text-meridian-success" />
                <span>Per-supplier proof upload & messaging</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Button variant="primary" className="w-full" onClick={() => handleSelectPlan('professional')}>
              Activate Professional ($149)
            </Button>
          </div>
        </div>

        {/* Enterprise */}
        <div className="bg-meridian-surface border border-meridian-border rounded-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-meridian-accent font-bold">Enterprise</span>
              <Sparkles className="w-4 h-4 text-meridian-accent" />
            </div>
            <div>
              <span className="font-serif text-4xl font-medium text-meridian-text-primary">$490</span>
              <span className="text-xs text-meridian-text-muted ml-1">/ month</span>
            </div>
            <p className="text-xs text-meridian-text-secondary">
              Designed for high-capacity wholesale operators requiring dedicated allocation and fast approval turnaround.
            </p>
            <div className="pt-4 border-t border-meridian-border space-y-2 text-xs">
              <div className="font-semibold text-meridian-text-primary">Included allowances:</div>
              <div className="flex items-center gap-2 text-meridian-text-primary font-medium">
                <Check className="w-4 h-4 text-meridian-success" />
                <span><strong>60 bookings</strong> / month</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-primary font-medium">
                <Check className="w-4 h-4 text-meridian-success" />
                <span><strong>$400,000</strong> gross booking value / month</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-secondary">
                <Check className="w-4 h-4 text-meridian-success" />
                <span>25 agency team seats</span>
              </div>
              <div className="flex items-center gap-2 text-meridian-text-secondary">
                <Check className="w-4 h-4 text-meridian-success" />
                <span>Priority queue SLA & dedicated account manager</span>
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Button variant="accent" className="w-full" onClick={() => handleSelectPlan('enterprise')}>
              Activate Enterprise ($490)
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <h2 className="font-serif text-2xl font-medium text-meridian-text-primary mb-6 text-center">
          Comprehensive Feature & Allowance Comparison
        </h2>

        <div className="bg-meridian-surface rounded-card border border-meridian-border overflow-hidden shadow-sh-1">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-meridian-surface-sunken border-b border-meridian-border text-meridian-text-secondary font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Allowance Metric</th>
                <th className="py-3 px-4">Explorer</th>
                <th className="py-3 px-4 text-meridian-primary font-bold">Professional</th>
                <th className="py-3 px-4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-meridian-border">
              <tr>
                <td className="py-3 px-4 font-medium">Monthly Booking Count</td>
                <td className="py-3 px-4 text-meridian-text-muted">0 (Locked)</td>
                <td className="py-3 px-4 font-semibold text-meridian-primary">12 bookings</td>
                <td className="py-3 px-4 font-semibold">60 bookings</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Monthly Value Limit (USD)</td>
                <td className="py-3 px-4 text-meridian-text-muted">$0</td>
                <td className="py-3 px-4 font-semibold text-meridian-primary">$60,000 / mo</td>
                <td className="py-3 px-4 font-semibold">$400,000 / mo</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Agency User Seats</td>
                <td className="py-3 px-4">1 seat</td>
                <td className="py-3 px-4">5 seats</td>
                <td className="py-3 px-4">25 seats</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Direct Booking Wizard</td>
                <td className="py-3 px-4 text-meridian-error">Locked</td>
                <td className="py-3 px-4 text-meridian-success font-medium">Enabled</td>
                <td className="py-3 px-4 text-meridian-success font-medium">Enabled</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Supplier Payment Proof Upload</td>
                <td className="py-3 px-4 text-meridian-text-muted">—</td>
                <td className="py-3 px-4 text-meridian-success font-medium">Included</td>
                <td className="py-3 px-4 text-meridian-success font-medium">Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">One-Time Reconsideration Appeal</td>
                <td className="py-3 px-4 text-meridian-text-muted">—</td>
                <td className="py-3 px-4 text-meridian-success font-medium">1 per rejected booking</td>
                <td className="py-3 px-4 text-meridian-success font-medium">1 per rejected booking</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Review SLA</td>
                <td className="py-3 px-4 text-meridian-text-muted">Standard (48–72h)</td>
                <td className="py-3 px-4">Priority (24h)</td>
                <td className="py-3 px-4 font-semibold text-meridian-accent">Expedited (&lt;12h)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
