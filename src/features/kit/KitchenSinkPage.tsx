import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Chip } from '../../components/ui/Chip';
import { Toggle } from '../../components/ui/Toggle';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../components/ui/Toast';
import { ArrowRight, Check, Search, Bell, AlertTriangle, Shield, Sparkles } from 'lucide-react';

export const KitchenSinkPage: React.FC = () => {
  const { addToast } = useToast();
  const [toggleState, setToggleState] = useState(true);
  const [activeChip, setActiveChip] = useState('All');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [buttonSuccess, setButtonSuccess] = useState(false);

  const triggerSimulatedAction = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      setButtonSuccess(true);
      setTimeout(() => setButtonSuccess(false), 1200);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      {/* Header */}
      <div className="border-b border-line pb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-clay font-medium">Design System Verification</span>
        <h1 className="font-serif text-4xl text-ink mt-2">BionicIQ UI Component Library (/__kit)</h1>
        <p className="text-ink-2 text-sm mt-2 max-w-2xl">
          Audited against PRD Section 3 tokens and Section 10.2 Component State Matrix. 
          Zero rogue colors, strict hairlines, accessible focus rings, and deterministic states.
        </p>
      </div>

      {/* 1. Buttons Matrix */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-serif text-2xl text-ink">1. Buttons Matrix</h2>
          <span className="font-mono text-xs text-ink-3">clay · primary · ghost · danger · icon</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Primary Clay */}
          <div className="bg-surface p-5 rounded-lg border border-line space-y-3">
            <h3 className="font-mono text-xs text-ink-3 uppercase">Primary (Clay)</h3>
            <div className="space-y-2">
              <Button variant="primary" className="w-full">Default</Button>
              <Button variant="primary" isLoading className="w-full">Loading State</Button>
              <Button variant="primary" isSuccess className="w-full">Success State</Button>
              <Button variant="primary" disabled className="w-full">Disabled</Button>
              <Button variant="primary" onClick={triggerSimulatedAction} isLoading={buttonLoading} isSuccess={buttonSuccess} className="w-full">
                Interactive Test <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>

          {/* Secondary Ink */}
          <div className="bg-surface p-5 rounded-lg border border-line space-y-3">
            <h3 className="font-mono text-xs text-ink-3 uppercase">Secondary (Deep Ink)</h3>
            <div className="space-y-2">
              <Button variant="secondary" className="w-full">Default</Button>
              <Button variant="secondary" isLoading className="w-full">Loading State</Button>
              <Button variant="secondary" isSuccess className="w-full">Success State</Button>
              <Button variant="secondary" disabled className="w-full">Disabled</Button>
            </div>
          </div>

          {/* Ghost */}
          <div className="bg-surface p-5 rounded-lg border border-line space-y-3">
            <h3 className="font-mono text-xs text-ink-3 uppercase">Ghost (Hairline)</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full">Default</Button>
              <Button variant="ghost" isLoading className="w-full">Loading State</Button>
              <Button variant="ghost" disabled className="w-full">Disabled</Button>
            </div>
          </div>

          {/* Danger & Icon */}
          <div className="bg-surface p-5 rounded-lg border border-line space-y-3">
            <h3 className="font-mono text-xs text-ink-3 uppercase">Danger & Sizes</h3>
            <div className="space-y-2">
              <Button variant="danger" className="w-full">Delete Record</Button>
              <div className="flex gap-2">
                <Button size="sm" variant="primary">Small</Button>
                <Button size="md" variant="primary">Regular</Button>
                <Button size="lg" variant="primary">Large</Button>
              </div>
              <div className="pt-2">
                <Button variant="ghost" onClick={() => addToast('Simulated notification message', 'success')}>
                  Trigger Toast
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Form Inputs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-serif text-2xl text-ink">2. Form Fields & Controls</h2>
          <span className="font-mono text-xs text-ink-3">input · select · textarea · toggle</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <Input label="Default Input" placeholder="Type here..." helperText="Standard single line text input" />
            <Input label="With Left Icon" prefix={<Search className="w-4 h-4 text-ink-3" />} placeholder="Search catalog..." />
            <Input label="With Right Icon" suffix={<Check className="w-4 h-4 text-ok" />} defaultValue="verified@bioniciq.com" />
          </div>

          <div className="space-y-4">
            <Input label="Error Validation State" defaultValue="invalid-email" error="Please enter a valid business email address" />
            <Input label="Disabled Input" defaultValue="System Managed ID" disabled />
            <Select 
              label="Select Dropdown" 
              options={[
                { value: 'us', label: 'United States (USD)' },
                { value: 'ae', label: 'United Arab Emirates (AED)' },
                { value: 'gb', label: 'United Kingdom (GBP)' },
              ]}
              defaultValue="us"
            />
          </div>

          <div className="space-y-4">
            <Textarea label="Textarea with Counter" placeholder="Project requirements..." maxLength={140} rows={3} />
            <div className="bg-surface p-4 rounded-lg border border-line flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">Simulate Kitchen Open</p>
                <p className="text-xs text-ink-3">Live orders reception toggle</p>
              </div>
              <Toggle checked={toggleState} onChange={setToggleState} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Chips & Badges */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-serif text-2xl text-ink">3. Chips, Badges & Indicators</h2>
          <span className="font-mono text-xs text-ink-3">status · category · modifiers</span>
        </div>

        <div className="bg-surface p-6 rounded-lg border border-line space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase text-ink-3">Filter Chips (Interactive)</p>
            <div className="flex flex-wrap gap-2">
              {['All', 'SaaS Platform', 'LMS Courses', 'Payments', 'Hospitality'].map((chip) => (
                <Chip 
                  key={chip} 
                  label={chip} 
                  selected={activeChip === chip} 
                  onClick={() => setActiveChip(chip)} 
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-mono uppercase text-ink-3">Status Badges</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="ok">Paid · Settled</Badge>
              <Badge variant="warn">Preparing (8m)</Badge>
              <Badge variant="err">Declined</Badge>
              <Badge variant="clay">New Order</Badge>
              <Badge variant="info">Enrolled</Badge>
              <Badge variant="neutral">Draft</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Data Viz & Progress Rings */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-serif text-2xl text-ink">4. Progress Rings & Metrics</h2>
          <span className="font-mono text-xs text-ink-3">SVG animation · math exact</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-surface p-6 rounded-lg border border-line flex flex-col items-center justify-center text-center space-y-3">
            <ProgressRing progress={46} size={84} strokeWidth={6} color="var(--primary)" />
            <div>
              <p className="text-sm font-medium text-ink">Operations Course</p>
              <p className="font-mono text-xs text-ink-3">11 of 24 lessons</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-lg border border-line flex flex-col items-center justify-center text-center space-y-3">
            <ProgressRing progress={100} size={84} strokeWidth={6} color="var(--ok)" />
            <div>
              <p className="text-sm font-medium text-ink">Food Safety</p>
              <p className="font-mono text-xs text-ok">Certified & Issued</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-lg border border-line flex flex-col items-center justify-center text-center space-y-3">
            <ProgressRing progress={70} size={84} strokeWidth={6} color="var(--clay)" />
            <div>
              <p className="text-sm font-medium text-ink">Assessment Pass</p>
              <p className="font-mono text-xs text-ink-3">Target threshold</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-lg border border-line flex flex-col items-center justify-center text-center space-y-3">
            <ProgressRing progress={17} size={84} strokeWidth={6} color="var(--slate)" />
            <div>
              <p className="text-sm font-medium text-ink">Data Literacy</p>
              <p className="font-mono text-xs text-ink-3">3 of 18 lessons</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Skeleton & Empty States */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h2 className="font-serif text-2xl text-ink">5. Skeletons & Empty States</h2>
          <span className="font-mono text-xs text-ink-3">failure & loading discipline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface p-6 rounded-lg border border-line space-y-4">
            <p className="text-xs font-mono uppercase text-ink-3">Skeleton Loader Pulse (No AI glow/gradient)</p>
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-lg border border-line">
            <EmptyState 
              title="Quiet for now" 
              description="New orders placed from diner devices appear here live in real-time."
              actionLabel="Simulate Order"
              onAction={() => addToast('Order simulated successfully', 'info')}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
