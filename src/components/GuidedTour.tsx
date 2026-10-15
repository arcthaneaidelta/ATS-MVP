import React from 'react';
import { Compass, ChevronRight, X, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

const TOUR_STEPS = [
  {
    step: 1,
    title: '1. Observe Live Lifecycle',
    instruction: 'Watch the live product panel on the landing page cycling through Submitted -> Approved -> Paid -> Completed.',
    targetPath: '/',
    actionLabel: 'Explore Lifecycle',
  },
  {
    step: 2,
    title: '2. Review Free-Tier Lock',
    instruction: 'In the Buyer app, notice Juniper Events is on Explorer tier: booking is locked.',
    targetPath: '/app',
    actionLabel: 'Go to Buyer App',
  },
  {
    step: 3,
    title: '3. Activate Professional Plan',
    instruction: 'Click "Activate plan" or visit Subscription to run simulated checkout and watch padlocks dissolve!',
    targetPath: '/app/subscription',
    actionLabel: 'Open Subscription',
  },
  {
    step: 4,
    title: '4. Pass 5 Server Eligibility Rules',
    instruction: 'Book quote Q-2038 or test expired Q-2041 to see sequential server rule resolution.',
    targetPath: '/app/requests',
    actionLabel: 'View Quotes',
  },
  {
    step: 5,
    title: '5. Admin Review & Coordinator Roll-up',
    instruction: 'Switch role to Admin to approve the queue, then Coordinator to confirm supplier wire proof!',
    targetPath: '/admin',
    actionLabel: 'Go to Admin Queue',
  },
];

export const GuidedTour: React.FC = () => {
  const guidedTourDismissed = useStore((s) => s.guidedTourDismissed);
  const setGuidedTourDismissed = useStore((s) => s.setGuidedTourDismissed);
  const guidedTourStep = useStore((s) => s.guidedTourStep);
  const setGuidedTourStep = useStore((s) => s.setGuidedTourStep);
  const navigate = useNavigate();
  const location = useLocation();

  if (guidedTourDismissed) {
    return (
      <button
        onClick={() => setGuidedTourDismissed(false)}
        className="fixed bottom-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-meridian-surface text-meridian-primary text-xs font-medium rounded-full shadow-sh-2 border border-meridian-border hover:bg-meridian-primary hover:text-white transition-all"
        title="Re-open guided walkthrough"
      >
        <Sparkles className="w-3.5 h-3.5 text-meridian-accent" />
        <span>Tour Guide</span>
      </button>
    );
  }

  const currentStepData = TOUR_STEPS[guidedTourStep - 1] || TOUR_STEPS[0];

  const handleNextStep = () => {
    if (guidedTourStep < TOUR_STEPS.length) {
      const next = guidedTourStep + 1;
      setGuidedTourStep(next);
      navigate(TOUR_STEPS[next - 1].targetPath);
    } else {
      setGuidedTourDismissed(true);
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] sm:w-auto">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-meridian-surface-elevated/95 backdrop-blur-md border border-meridian-border-strong rounded-full shadow-sh-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-meridian-primary-tint text-meridian-primary rounded-full">
            <Compass className="w-3.5 h-3.5" />
          </span>
          <span className="font-semibold text-meridian-text-primary whitespace-nowrap">
            {currentStepData.title}
          </span>
        </div>

        <p className="hidden md:block text-meridian-text-secondary truncate max-w-xs">
          {currentStepData.instruction}
        </p>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
          {location.pathname !== currentStepData.targetPath && (
            <button
              onClick={() => navigate(currentStepData.targetPath)}
              className="text-meridian-accent hover:underline font-semibold px-2 py-0.5"
            >
              {currentStepData.actionLabel}
            </button>
          )}

          <button
            onClick={handleNextStep}
            className="flex items-center gap-1 px-2.5 py-1 bg-meridian-primary text-white rounded-full font-medium hover:bg-meridian-primary-hover transition-colors"
          >
            <span>{guidedTourStep === TOUR_STEPS.length ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setGuidedTourDismissed(true)}
            className="p-1 text-meridian-text-muted hover:text-meridian-text-primary rounded-full"
            aria-label="Dismiss tour"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
