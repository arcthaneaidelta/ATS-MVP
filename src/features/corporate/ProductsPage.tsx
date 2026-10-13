import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import {
  GraduationCap,
  UtensilsCrossed,
  ArrowRight,
  CheckCircle2,
  Tv,
  FileCheck,
  Smartphone,
  ChefHat,
  Building2,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left space-y-20">
      {/* Header */}
      <div className="max-w-2xl space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
          Flagship Software Products
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
          Two products. One shared foundation.
        </h1>
        <p className="text-base text-ink-2 leading-relaxed">
          Explore the live interactive applications powered by BionicIQ's unified design tokens, transaction primitives, and tenancy layer.
        </p>
      </div>

      {/* Block 1: Academy LMS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-2xl bg-surface border border-line">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate/10 text-slate text-xs font-semibold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Product 01 · Learning Management</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
            BionicIQ Academy
          </h2>

          <p className="text-sm text-ink-2 leading-relaxed">
            A calm, distraction-free learning platform engineered for professional mastery. Features rich video streaming, inline markdown note taking, automated quiz timers, and instant tamper-proof diploma certification.
          </p>

          <div className="space-y-2 text-xs text-ink-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate stroke-[2.5]" />
              <span>Multi-module curriculum with continuous progress synchronization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate stroke-[2.5]" />
              <span>Timed 5-question certification assessments with animated scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-slate stroke-[2.5]" />
              <span>Verifiable QR-coded PDF certificates with cryptographic IDs</span>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/academy')}
            >
              <span>Open Academy Catalog</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/academy/app')}
            >
              <span>Launch Student Portal</span>
            </Button>
          </div>
        </div>

        <div
          onClick={() => navigate('/academy/app')}
          className="lg:col-span-6 p-6 rounded-xl bg-elevated border border-line shadow-sm hover:border-slate hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-3 border-b border-line mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate">
              Interactive Student Experience
            </span>
            <span className="text-xs text-ink-3 font-mono">Hira Siddiqui</span>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-bg border border-line flex items-center justify-between">
              <div>
                <span className="text-xs text-ink-3">Current Course</span>
                <p className="text-sm font-serif font-bold text-ink">
                  Restaurant Operations Essentials
                </p>
                <span className="text-[11px] text-ink-3">Lesson 11 of 24 (46% Complete)</span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate border-t-line flex items-center justify-center font-mono text-xs font-bold text-ink">
                46%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-lg bg-surface border border-line">
                <span className="text-ink-3 block text-[10px]">Weekly Streak</span>
                <span className="font-bold font-mono text-ink text-base">5 Days 🔥</span>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-line">
                <span className="text-ink-3 block text-[10px]">Earned Diplomas</span>
                <span className="font-bold font-mono text-ink text-base">1 Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Block 2: Cirqla Hospitality SaaS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-2xl bg-surface border border-line">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div
            onClick={() => navigate('/cirqla/scan/kiln-street?table=12')}
            className="p-6 rounded-xl bg-elevated border border-line shadow-sm hover:border-clay hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <span className="text-xs font-bold uppercase tracking-wider text-clay">
                Live Diner Scan Preview
              </span>
              <span className="text-xs text-ink-3 font-mono">Table 12 · Central</span>
            </div>
            <div className="p-4 rounded-lg bg-bg border border-line space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">Slow-Cooked Short Rib</p>
                  <span className="text-[11px] text-ink-3">Hand-cut fries · Extra jus</span>
                </div>
                <span className="font-mono text-xs font-bold text-ink">$26.50</span>
              </div>
              <div className="w-full h-2 bg-line rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-clay animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-ink-3">
                <span>Kitchen Status</span>
                <span className="text-clay font-bold">Preparing ticket...</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-surface border border-line">
                <span className="text-[10px] text-ink-3 block">Sync Latency</span>
                <span className="font-bold font-mono text-ok">&lt;300ms</span>
              </div>
              <div className="p-2 rounded bg-surface border border-line">
                <span className="text-[10px] text-ink-3 block">Card Failure Test</span>
                <span className="font-bold font-mono text-clay">Designed</span>
              </div>
              <div className="p-2 rounded bg-surface border border-line">
                <span className="text-[10px] text-ink-3 block">Tenancy</span>
                <span className="font-bold font-mono text-primary">Multi-branch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-clay-tint text-clay text-xs font-semibold uppercase tracking-wider">
            <UtensilsCrossed className="w-4 h-4" />
            <span>Product 02 · Hospitality SaaS</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
            Cirqla SaaS
          </h2>

          <p className="text-sm text-ink-2 leading-relaxed">
            Modern dine-in table ordering, real-time kitchen dispatching, and multi-tenant venue management. Eliminates hardware clutter with zero-install diner web clients and sub-second KDS screen updates.
          </p>

          <div className="space-y-2 text-xs text-ink-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-clay stroke-[2.5]" />
              <span>Mobile-native diner app with required modifier validation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-clay stroke-[2.5]" />
              <span>Cross-tab & cross-device real-time sync via BroadcastChannel</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-clay stroke-[2.5]" />
              <span>Venue management: branch overrides, CSV menu import & payout ledgers</span>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/cirqla/scan/kiln-street?table=12')}
            >
              <span>Try Customer Demo</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/cirqla/venue/orders')}
            >
              <span>Open Venue Dashboard</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
