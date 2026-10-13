import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PhoneFrame } from '@/components/app/PhoneFrame';
import { AppShell } from '@/components/app/AppShell';
import { YearRibbon } from './YearRibbon';
import { DemoControls } from '@/components/app/DemoControls';
import { ShieldCheck, Lock, Bell, ChevronDown, ArrowRight } from 'lucide-react';
import { copy } from '@/data/copy';

export interface HeroProps {
  onTryAppClick?: () => void;
}

export function Hero({ onTryAppClick }: HeroProps) {
  const [hasTappedPhone, setHasTappedPhone] = useState(false);

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden pt-8 pb-12">
      {/* Background Year Ribbon */}
      <YearRibbon />

      {/* Single Allowed 6% Sage Radial Wash behind phone (PRD §4.1, §6.2) */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(47, 93, 85, 0.08) 0%, rgba(247, 245, 240, 0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="container-page relative z-10 my-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
            {/* Category Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-primary-t text-primary text-xs font-semibold uppercase tracking-wider">
              {copy.hero.label}
            </div>

            {/* H1 Fraunces Headlines */}
            <h1 className="t-h1 text-ink tracking-tight font-display">
              <span className="block">{copy.hero.h1[0]}</span>
              <span className="block">{copy.hero.h1[1]}</span>
              <span className="block text-primary">{copy.hero.h1[2]}</span>
            </h1>

            {/* Body */}
            <p className="t-lead text-ink-2 max-w-[44ch] leading-relaxed">
              {copy.hero.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                onClick={onTryAppClick}
              >
                {copy.hero.cta}
              </Button>

              <Link
                to="/plan"
                className="btn-text"
              >
                <span>{copy.hero.secondary}</span>
                <ArrowRight size={16} className="nudge" />
              </Link>
            </div>

            {/* Three Proof Points */}
            <div className="pt-6 border-t border-line/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary flex-shrink-0" />
                <span>Read-only access</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-primary flex-shrink-0" />
                <span>No card numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-primary flex-shrink-0" />
                <span>Free-trial alerts</span>
              </div>
            </div>

            {/* Placeholder Branding Note */}
            <p className="text-[11px] text-ink-3">
              {copy.hero.placeholder}
            </p>
          </div>

          {/* Right Column: Live Phone Frame */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center relative">
            <div
              id="live-phone-frame"
              onClick={() => setHasTappedPhone(true)}
              className="relative transition-transform duration-med"
            >
              <PhoneFrame>
                <AppShell initialTab="today" />
              </PhoneFrame>

              {/* Floating Demo Control Chip */}
              <div className="absolute -bottom-4 right-2 z-40 hidden sm:block">
                <DemoControls />
              </div>
            </div>

            {/* Tap Hint */}
            <div className="mt-4 text-center">
              <p
                className={`text-xs text-ink-3 font-medium transition-opacity duration-fast ${
                  hasTappedPhone ? 'opacity-30' : 'opacity-100'
                }`}
              >
                {copy.hero.liveHint}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Soft Scroll Cue */}
      <div className="w-full flex justify-center pt-2">
        <a
          href="#the-problem"
          aria-label="Scroll down"
          className="text-ink-3 hover:text-ink transition-colors scroll-cue"
        >
          <ChevronDown size={22} />
        </a>
      </div>
    </section>
  );
}
