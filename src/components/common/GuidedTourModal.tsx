import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Compass, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Welcome to Journey Studio',
    subtitle: 'A Live Demonstration of Your GoHighLevel System',
    path: '/',
    description: `This interactive demonstration allows you to test both sides of a modern GoHighLevel buildout:
1. Side A (Public Funnel): The calm, high-converting homeowner experience for Alder & Finch Home Studio.
2. Side B (Operator Console): The team's control room showing leads, pipelines, automations, and call logs.

Everything you do on Side A immediately synchronizes into Side B within 1 second.`,
    highlight: 'Experience both Lead & Team views',
  },
  {
    step: 2,
    title: 'Lead Capture & Live Booking',
    subtitle: 'Multi-Step Survey & Real-Time Slot Picker',
    path: '/start',
    description: `Homeowners fill out a 5-step intake questionnaire with instant validation:
- Tests edge cases like duplicate inquiries (merges cleanly without double-texting).
- Tests recoverable error handling (try entering test@error.com).
- Direct calendar slot picker with automatic taken-slot handling.
- Downloads real .ics calendar invite upon confirmation.`,
    highlight: 'Zero messy follow-up or broken links',
  },
  {
    step: 3,
    title: 'The Operator Console & Pre-Flight Audit',
    subtitle: 'Overview, Live Feed, and Safety Checks',
    path: '/studio',
    description: `The Overview screen gives your team operational clarity:
- "Needs Action" cards with oldest-age indicators.
- Speed-to-lead KPI metrics with SVG trend sparklines.
- Real-time reverse-chronological activity feed.
- Pre-flight audit findings to inspect legacy workflows before modifying live accounts.`,
    highlight: 'Respects existing live setups',
  },
  {
    step: 4,
    title: 'Pipeline Kanban with Automation on Move',
    subtitle: 'Drag-and-Drop Stages with Triggered Rules',
    path: '/studio/pipeline',
    description: `Six dedicated stages representing your real remodeling sales cycle:
- Drag cards between stages; watch automated tasks and notifications fire immediately.
- Moving to "Consultation Booked" verifies appointments.
- Moving to "Lost" stops all queued automations and records drop reasons.
- Full opportunity drawer with timeline, notes, and compliance audit.`,
    highlight: 'Automatic task assignment & notifications',
  },
  {
    step: 5,
    title: 'Workflow Simulator: The Hero Feature',
    subtitle: 'Stop/Change Rules, Deduplication & Human Takeover',
    path: '/studio/simulator',
    description: `The single biggest differentiator addressing your top risk:
- Press "Reply by SMS" and watch queued robot follow-ups cancel in real-time.
- Press "Text STOP" and verify TCPA-compliant DND-SMS enforcement.
- Press "Submit form again" to see deduplication prevent second blasts.
- Use the Time Machine to fast-forward 1 hour or 1 day without waiting.`,
    highlight: 'Guaranteed prevention of duplicate messaging',
  },
  {
    step: 6,
    title: 'Retell AI Voice Integration & Proposal',
    subtitle: 'Itemized Quote ($1,000) & Transparent Delivery',
    path: '/proposal',
    description: `Review our transparent implementation proposal:
- Voice Agent screen (/studio/voice) demonstrates Retell AI call outcomes and custom field mapping.
- M0 to M5 structured milestone plan (2 to 4 weeks delivery).
- Includes itemized Retell/Twilio voice agent line item, complete handoff documentation, recorded walkthrough, and 30-day bug-fix warranty.`,
    highlight: 'Fixed $1,000 scope with clear dependencies',
  },
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({ isOpen, onClose }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const navigate = useNavigate();

  const currentStep = TOUR_STEPS[currentStepIdx];
  const isLast = currentStepIdx === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      navigate(TOUR_STEPS[nextIdx].path);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      navigate(TOUR_STEPS[prevIdx].path);
    }
  };

  const handleJump = (idx: number) => {
    setCurrentStepIdx(idx);
    navigate(TOUR_STEPS[idx].path);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="space-y-5">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent-soft text-accent text-xs font-bold flex items-center justify-center">
              {currentStep.step}
            </span>
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Step {currentStep.step} of {TOUR_STEPS.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleJump(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStepIdx
                    ? 'w-6 bg-primary'
                    : idx < currentStepIdx
                    ? 'bg-primary/40'
                    : 'bg-border-strong'
                }`}
                aria-label={`Jump to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-serif text-text font-medium">{currentStep.title}</h3>
            <p className="text-xs font-semibold text-accent mt-0.5">{currentStep.subtitle}</p>
          </div>

          <div className="text-sm text-text-2 leading-relaxed whitespace-pre-line bg-sunken/60 p-4 rounded-card border border-border">
            {currentStep.description}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary-soft/60 px-3 py-2 rounded-input">
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <span>Key takeaway: {currentStep.highlight}</span>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Skip Tour
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              icon={isLast ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            >
              {isLast ? 'Finish Tour' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
