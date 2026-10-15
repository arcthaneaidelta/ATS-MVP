import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { MeterBar } from '../../components/MeterBar';
import { LockedGate } from '../../components/LockedGate';
import { RuleChecklist } from '../../components/RuleChecklist';
import { FileDropzone } from '../../components/FileDropzone';
import { Modal } from '../../components/Modal';
import { Drawer } from '../../components/Drawer';
import { useToast } from '../../components/Toast';
import { Compass, Check, ArrowRight } from 'lucide-react';
import { EligibilityCheckItem } from '../../data/types';

export const ComponentKitPage: React.FC = () => {
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [testLocked, setTestLocked] = useState(true);

  const sampleRules: EligibilityCheckItem[] = [
    { ruleId: 1, name: 'Account & Role Authorization', status: 'pass', message: 'Verified buyer credentials.' },
    { ruleId: 2, name: 'Plan Booking Entitlement', status: 'pass', message: 'Active Professional tier confirmed.' },
    {
      ruleId: 3,
      name: 'Quote Validity & Status',
      status: 'fail',
      message: 'Quote Q-2041 expired on 12 Oct 2026. Request a refreshed quote.',
      fixAction: { label: 'Refresh Quote', actionType: 'refresh_quote' },
    },
    { ruleId: 4, name: 'Monthly Booking Volume (Count)', status: 'pass', message: '9 of 12 used.' },
    { ruleId: 5, name: 'Monthly Booking Value (USD)', status: 'pass', message: '$42,500 of $60,000 used.' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      <div>
        <span className="text-xs font-mono font-semibold uppercase text-meridian-accent">
          Internal Validation
        </span>
        <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-1">
          Meridian Component Kit (/kit)
        </h1>
        <p className="text-xs text-meridian-text-secondary mt-1">
          Review of all primitives from Section 7.1 across all supported states.
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-meridian-text-primary border-b border-meridian-border pb-2">
          Buttons & States
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary (Pine)</Button>
          <Button variant="accent">Accent (Terracotta)</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading State</Button>
          <Button success>Success State</Button>
          <Button disabled disabledTooltip="Hovered tooltip explaining blocked reason">
            Disabled with Tooltip
          </Button>
        </div>
      </section>

      {/* Status Chips */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-meridian-text-primary border-b border-meridian-border pb-2">
          Status Chips
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip kind="booking" status="submitted" />
          <StatusChip kind="booking" status="under_review" />
          <StatusChip kind="booking" status="approved" />
          <StatusChip kind="booking" status="payment_pending" />
          <StatusChip kind="booking" status="partially_paid" />
          <StatusChip kind="booking" status="fully_paid" />
          <StatusChip kind="booking" status="completed" />
          <StatusChip kind="booking" status="rejected" />
          <StatusChip kind="booking" status="reconsideration_requested" />
          <StatusChip kind="booking" status="rejected_final" />
        </div>
      </section>

      {/* Allowance Meters */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-meridian-text-primary border-b border-meridian-border pb-2">
          Meters (Normal, Warning at 80%, Error at 100%)
        </h2>
        <div className="space-y-4 max-w-lg bg-meridian-surface p-5 border border-meridian-border rounded-card">
          <MeterBar label="Normal Usage (3 of 12)" current={3} max={12} unitSuffix=" bookings" />
          <MeterBar label="Warning at 80%+ (10 of 12)" current={10} max={12} unitSuffix=" bookings" />
          <MeterBar label="At Limit 100% ($60k of $60k)" current={60000} max={60000} unitPrefix="$" />
        </div>
      </section>

      {/* Rule Checklist */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-meridian-text-primary border-b border-meridian-border pb-2">
          Sequential Rule Checklist
        </h2>
        <div className="max-w-2xl bg-meridian-surface p-5 border border-meridian-border rounded-card">
          <RuleChecklist
            checks={sampleRules}
            onFixAction={(act) => addToast('info', 'Fix Triggered', `Action: ${act}`)}
          />
        </div>
      </section>

      {/* Locked Gate */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-meridian-text-primary border-b border-meridian-border pb-2">
          Locked Gate Dissolution
        </h2>
        <div className="flex items-center gap-4">
          <LockedGate isLocked={testLocked} requirement="Needs Professional plan">
            <Button variant="accent">Book This Quote</Button>
          </LockedGate>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setTestLocked(!testLocked)}
          >
            Toggle Lock State ({testLocked ? 'Locked' : 'Unlocked'})
          </Button>
        </div>
      </section>

      {/* Overlays & Toasts */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-medium text-meridian-text-primary border-b border-meridian-border pb-2">
          Modals, Drawers & Toasts
        </h2>
        <div className="flex items-center gap-3">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Button
            variant="accent"
            onClick={() => addToast('success', 'Test Notification', 'Everything is operating smoothly.')}
          >
            Trigger Toast
          </Button>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Test Modal Dialog">
          <p className="text-xs text-meridian-text-secondary">
            Modal with focus trapping and ESC escape support.
          </p>
        </Modal>

        <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Test Drawer Panel">
          <p className="text-xs text-meridian-text-secondary">
            Slide-over drawer panel with ESC support.
          </p>
        </Drawer>
      </section>
    </div>
  );
};
