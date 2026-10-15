import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Calendar,
  Users,
  CreditCard,
  Lock,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { mockApi } from '../../server/mockApi';
import { useStore } from '../../store/useStore';
import { Quote, EligibilityResult, Booking } from '../../data/types';
import { Button } from '../../components/Button';
import { RuleChecklist } from '../../components/RuleChecklist';
import { useToast } from '../../components/Toast';
import { Skeleton } from '../../components/Skeleton';

export const BookingWizard: React.FC = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const activeBuyerId = useStore((s) => s.activeBuyerId);
  const buyers = useStore((s) => s.buyers);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  // Step 2: Hero eligibility check state
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  // Step 3: Submission inputs
  const [adminNote, setAdminNote] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Success state
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const currentBuyer = buyers.find((b) => b.id === activeBuyerId);

  useEffect(() => {
    if (!quoteId) return;
    setLoadingQuote(true);
    mockApi.getQuote(quoteId).then((res) => {
      if (res.body) setQuote(res.body);
      setLoadingQuote(false);
    });
  }, [quoteId, activeBuyerId]);

  // When navigating to Step 2, run server eligibility check
  const handleProceedToStep2 = () => {
    setCurrentStep(2);
    setCheckingEligibility(true);
    mockApi.checkEligibility(quoteId!).then((res) => {
      setCheckingEligibility(false);
      if (res.body) {
        setEligibilityResult(res.body);
      }
    });
  };

  const handleFixAction = (actionType: 'activate_plan' | 'refresh_quote' | 'view_usage') => {
    if (actionType === 'activate_plan' || actionType === 'view_usage') {
      navigate('/app/subscription');
    } else if (actionType === 'refresh_quote') {
      navigate(`/app/requests/${quoteId}`);
    }
  };

  const handleSubmitBooking = async () => {
    if (!termsAccepted || !quote) return;
    setSubmitting(true);
    setSubmissionError(null);

    const res = await mockApi.submitBooking(quote.id, adminNote);
    setSubmitting(false);

    if (res.status === 201 && res.body) {
      setCreatedBooking(res.body);
      addToast('success', 'Booking Submitted', `Booking ${res.body.reference} has been routed to the operator review queue.`);
    } else {
      setSubmissionError(res.error || 'Booking submission failed. Please verify eligibility rules.');
    }
  };

  if (loadingQuote) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-8 text-center text-xs text-meridian-text-muted">
        Quote not found.
      </div>
    );
  }

  // Success view (BK- reference + next steps timeline)
  if (createdBooking) {
    return (
      <div className="max-w-2xl mx-auto bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-2 p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-meridian-success-tint text-meridian-success rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-meridian-success">
            Submission Confirmed
          </span>
          <h1 className="font-serif text-3xl font-medium text-meridian-text-primary mt-1">
            Booking {createdBooking.reference} Created
          </h1>
          <p className="text-xs text-meridian-text-secondary mt-1">
            Tour: {createdBooking.tourTitle} • Gross amount: ${createdBooking.totalAmount.toLocaleString()} USD
          </p>
        </div>

        {/* Timeline of next steps */}
        <div className="p-5 bg-meridian-surface-sunken/60 border border-meridian-border rounded-card text-left space-y-4">
          <p className="text-xs font-semibold text-meridian-text-primary font-serif">
            Lifecycle Next Steps
          </p>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-meridian-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <p className="font-semibold text-meridian-text-primary">Operator SLA Review</p>
                <p className="text-[11px] text-meridian-text-secondary">
                  Meridian operations team examines guide and hotel allotment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-meridian-surface border border-meridian-border-strong text-meridian-text-muted flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="font-semibold text-meridian-text-primary">Approval & Supplier Invoicing</p>
                <p className="text-[11px] text-meridian-text-secondary">
                  On approval, {quote.supplierLines.length} supplier disbursement lines will be created automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-meridian-surface border border-meridian-border-strong text-meridian-text-muted flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <p className="font-semibold text-meridian-text-primary">Payment Settlement & Final Voucher</p>
                <p className="text-[11px] text-meridian-text-secondary">
                  Upload wire proofs to coordinator queue. Complete state unlocks once all lines are reconciled.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => navigate(`/app/bookings/${createdBooking.id}`)}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Open Booking Detail
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/app/bookings')}
          >
            My Bookings List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header & Back */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (currentStep > 1) setCurrentStep((currentStep - 1) as any);
            else navigate(`/app/requests/${quoteId}`);
          }}
          className="flex items-center gap-1.5 text-xs text-meridian-text-secondary hover:text-meridian-text-primary font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentStep === 1 ? 'Back to Quote' : 'Previous Step'}</span>
        </button>

        <span className="text-xs font-mono text-meridian-text-muted">
          Step 0{currentStep} of 03
        </span>
      </div>

      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        {[
          { step: 1, title: '1. Review Quote & Guests' },
          { step: 2, title: '2. Server Eligibility Check' },
          { step: 3, title: '3. Terms & Submit' },
        ].map((s) => {
          const isCurrent = currentStep === s.step;
          const isPassed = currentStep > s.step;
          return (
            <div
              key={s.step}
              className={`pb-2 border-b-2 font-medium transition-colors ${
                isCurrent
                  ? 'border-meridian-primary text-meridian-primary font-semibold'
                  : isPassed
                  ? 'border-meridian-success text-meridian-success'
                  : 'border-meridian-border text-meridian-text-muted'
              }`}
            >
              {s.title}
            </div>
          );
        })}
      </div>

      {/* STEP 1: REVIEW QUOTE AND TRAVELLERS */}
      {currentStep === 1 && (
        <div className="bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-1 p-6 space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-meridian-text-primary">
              Review Quote & Itinerary Details
            </h2>
            <p className="text-xs text-meridian-text-secondary mt-1">
              Verify group composition and supplier breakdown before eligibility policy check.
            </p>
          </div>

          <div className="p-4 bg-meridian-surface-sunken rounded-card border border-meridian-border space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-meridian-border">
              <span className="font-mono text-meridian-primary font-bold">
                {quote.reference}
              </span>
              <span className="font-mono text-meridian-text-muted">
                Validity: {quote.validityDate}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-meridian-text-muted">Tour:</span>
                <p className="font-semibold text-meridian-text-primary mt-0.5">
                  {quote.tourTitle}
                </p>
              </div>
              <div>
                <span className="text-meridian-text-muted">Dates:</span>
                <p className="font-medium text-meridian-text-primary mt-0.5">
                  {quote.travelDates}
                </p>
              </div>
              <div>
                <span className="text-meridian-text-muted">Confirmed Group:</span>
                <p className="font-medium text-meridian-text-primary mt-0.5">
                  {quote.travellersCount} Guests
                </p>
              </div>
              <div>
                <span className="text-meridian-text-muted">Gross Amount:</span>
                <p className="font-serif text-base font-bold text-meridian-primary mt-0.5">
                  ${quote.totalAmount.toLocaleString()} USD
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-meridian-text-primary uppercase tracking-wider font-mono">
              Supplier Disbursement Schedule ({quote.supplierLines.length} lines)
            </h3>
            <div className="space-y-1.5 text-xs">
              {quote.supplierLines.map((sl) => (
                <div
                  key={sl.id}
                  className="flex items-center justify-between p-2.5 bg-meridian-surface-elevated border border-meridian-border rounded"
                >
                  <span className="font-medium text-meridian-text-primary">
                    {sl.supplierName} ({sl.serviceType})
                  </span>
                  <span className="font-mono font-semibold">
                    ${sl.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-meridian-border flex justify-end">
            <Button
              variant="accent"
              onClick={handleProceedToStep2}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Proceed to Eligibility Check
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: HERO MOMENT - SERVER-SIDE ELIGIBILITY CHECK */}
      {currentStep === 2 && (
        <div className="bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-1 p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-meridian-primary" />
              <h2 className="font-serif text-2xl font-medium text-meridian-text-primary">
                Server-Side Eligibility Checklist
              </h2>
            </div>
            <p className="text-xs text-meridian-text-secondary mt-1">
              Evaluating booking policies in real time against agency subscription allowances and quote validity rules.
            </p>
          </div>

          {/* Sequential 5-Rule Checklist */}
          {eligibilityResult && (
            <RuleChecklist
              checks={eligibilityResult.checks}
              isLoading={checkingEligibility}
              onFixAction={handleFixAction}
            />
          )}

          <div className="pt-4 border-t border-meridian-border flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>

            <Button
              variant="accent"
              disabled={!eligibilityResult?.allPassed || checkingEligibility}
              disabledTooltip={
                !eligibilityResult?.allPassed
                  ? 'All 5 eligibility rules must pass before submission'
                  : undefined
              }
              onClick={() => setCurrentStep(3)}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Continue to Confirm
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRM AND SUBMIT */}
      {currentStep === 3 && (
        <div className="bg-meridian-surface border border-meridian-border rounded-modal shadow-sh-1 p-6 space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-medium text-meridian-text-primary">
              Confirm & Submit Booking
            </h2>
            <p className="text-xs text-meridian-text-secondary mt-1">
              Final summary. Enter optional dispatch notes for the operator review desk.
            </p>
          </div>

          {submissionError && (
            <div className="p-3 bg-meridian-error-tint text-meridian-error rounded-card border border-meridian-error/30 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Note to admin */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-meridian-text-primary">
                Notes for Operator Review Desk (Optional)
              </label>
              <span className="text-[11px] text-meridian-text-muted font-mono">
                {adminNote.length}/500 chars
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add rooming preferences, guest dietary restrictions, or arrival flight times..."
              className="w-full text-xs p-3 bg-meridian-surface-sunken border border-meridian-border rounded-input focus:outline-none focus:ring-2 focus:ring-meridian-primary focus:bg-meridian-surface transition-all"
            />
          </div>

          {/* Terms Agreement */}
          <label className="flex items-start gap-3 p-3 bg-meridian-surface-sunken rounded-card border border-meridian-border cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded text-meridian-primary focus:ring-meridian-primary h-4 w-4"
            />
            <span className="text-xs text-meridian-text-secondary leading-snug">
              I acknowledge that submitting this booking will deduct <strong>1 booking</strong> and{' '}
              <strong>${quote.totalAmount.toLocaleString()}</strong> from our monthly{' '}
              {currentBuyer?.planId} allowance upon approval.
            </span>
          </label>

          <div className="pt-4 border-t border-meridian-border flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>

            <Button
              variant="accent"
              size="md"
              loading={submitting}
              disabled={!termsAccepted}
              disabledTooltip={!termsAccepted ? 'Accept terms to submit' : undefined}
              onClick={handleSubmitBooking}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit Booking to Desk
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
