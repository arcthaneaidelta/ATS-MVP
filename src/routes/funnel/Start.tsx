import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { FunnelNav } from '../../components/funnel/FunnelNav';
import { FunnelFooter } from '../../components/funnel/FunnelFooter';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { 
  ArrowRight, ArrowLeft, Check, ShieldCheck, 
  Clock, Sparkles, AlertCircle, Info, Home 
} from 'lucide-react';

export const Start: React.FC = () => {
  const navigate = useNavigate();
  const { submitIntakeSurvey } = useAppStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [simulatedErrorAttempts, setSimulatedErrorAttempts] = useState(0);

  // Form State
  const [rooms, setRooms] = useState<string[]>(['Kitchen']);
  const [budget, setBudget] = useState('$50k–$75k');
  const [startWindow, setStartWindow] = useState('1–3 months');
  const [zip, setZip] = useState('97211');
  const [ownerOccupied, setOwnerOccupied] = useState<boolean>(true);
  const [anythingElse, setAnythingElse] = useState('');
  
  const [firstName, setFirstName] = useState('Maya');
  const [lastName, setLastName] = useState('Okafor');
  const [email, setEmail] = useState('maya.okafor@gmail.com');
  const [phone, setPhone] = useState('(503) 555-0142');

  const [consentContact, setConsentContact] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(true);
  const [consentError, setConsentError] = useState<string | null>(null);

  useEffect(() => {
    const prefEmail = sessionStorage.getItem('af_pref_email');
    if (prefEmail) {
      setEmail(prefEmail);
    }
  }, []);

  const roomOptions = ['Kitchen', 'Bathroom', 'Whole Home', 'Basement / ADU', 'Living Space', 'Other'];
  const budgetOptions = ['Under $25k', '$25k–$50k', '$50k–$75k', '$75k+', 'Not sure'];
  const timingOptions = ['Now (Ready to start)', '1–3 months', '3–6 months', 'Exploring ideas'];

  const toggleRoom = (room: string) => {
    if (rooms.includes(room)) {
      if (rooms.length > 1) {
        setRooms(rooms.filter(r => r !== room));
      }
    } else {
      setRooms([...rooms, room]);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 10) {
      if (raw.length > 6) {
        setPhone(`(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`);
      } else if (raw.length > 3) {
        setPhone(`(${raw.slice(0, 3)}) ${raw.slice(3)}`);
      } else if (raw.length > 0) {
        setPhone(`(${raw}`);
      } else {
        setPhone('');
      }
    }
  };

  const isStepValid = () => {
    if (step === 1) return rooms.length > 0;
    if (step === 2) return budget && startWindow;
    if (step === 3) return zip.trim().length === 5;
    if (step === 4) return firstName.trim() && lastName.trim() && email.includes('@') && phone.length >= 14;
    if (step === 5) return consentContact;
    return true;
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!consentContact) {
      setConsentError('Please confirm consent to proceed with communication.');
      return;
    }
    setConsentError(null);

    // Test error demonstration path
    if (email.toLowerCase() === 'test@error.com' && simulatedErrorAttempts === 0) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 900));
      setLoading(false);
      setErrorBanner("We couldn't save that. Nothing was lost. Try again.");
      setSimulatedErrorAttempts(1);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    const result = submitIntakeSurvey({
      rooms,
      budget,
      startWindow,
      zip,
      ownerOccupied,
      anythingElse,
      firstName,
      lastName,
      email,
      phone,
      marketingConsent: consentMarketing,
    });

    setLoading(false);

    // Navigate to live booking slot selection
    navigate(`/book?contactId=${result.contactId}&name=${encodeURIComponent(firstName + ' ' + lastName)}`);
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text flex flex-col justify-between">
      <FunnelNav />

      <main className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-12 flex-1">
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-medium">
            <span>Step {step} of 5</span>
            <span>
              {step === 1 && 'Project Rooms'}
              {step === 2 && 'Scope & Investment'}
              {step === 3 && 'Property Details'}
              {step === 4 && 'Your Contact Info'}
              {step === 5 && 'Confirmation & Consent'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-base ease-out-custom"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Two-Column Grid on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-4xl mx-auto items-start">
          {/* Left 40% Summary Panel */}
          <div className="hidden lg:block lg:col-span-5 bg-surface p-7 rounded-modal border border-border space-y-6 shadow-sh-1">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-accent uppercase tracking-wider">Alder & Finch Intake</span>
              <h3 className="font-serif text-2xl font-medium text-text">What happens next</h3>
              <p className="text-xs text-text-2 leading-relaxed">
                We review every architectural submission with care and respect for your time.
              </p>
            </div>

            <div className="space-y-4 text-xs text-text-2">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <div className="font-semibold text-text">Instant Confirmation</div>
                  <div className="text-text-muted mt-0.5">We text you a direct booking confirmation and a curated design lookbook.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <div className="font-semibold text-text">Live Calendar Booking</div>
                  <div className="text-text-muted mt-0.5">Pick a 45-minute virtual or in-home slot with principal designer Dana Whitfield on the next screen.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <div className="font-semibold text-text">Zero Pressure Consultation</div>
                  <div className="text-text-muted mt-0.5">We explore floor plan options, City of Portland permit steps, and honest budget feasibility.</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-text-muted">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Never shared. Unsubscribe anytime by replying STOP.</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-surface-elevated rounded-modal p-6 sm:p-8 border border-border shadow-sh-2 space-y-6">
            {errorBanner && (
              <div className="p-3.5 rounded-input bg-error/10 border border-error/20 flex items-start gap-2.5 text-xs text-error">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorBanner}</span>
                  <button 
                    onClick={() => setErrorBanner(null)}
                    className="ml-2 underline font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: PROJECT ROOMS */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in-50 duration-fast">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-medium text-text">
                    Which room(s) are you planning to remodel?
                  </h2>
                  <p className="text-xs text-text-muted">
                    Select all that apply.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {roomOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleRoom(opt)}
                      className={`p-3.5 rounded-input text-left text-sm font-medium border transition-all flex items-center justify-between ${
                        rooms.includes(opt)
                          ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary'
                          : 'bg-sunken border-border hover:border-border-strong text-text'
                      }`}
                    >
                      <span>{opt}</span>
                      {rooms.includes(opt) && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: SCOPE & TIMING */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in-50 duration-fast">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-medium text-text">
                    What is your target investment & timeline?
                  </h2>
                  <p className="text-xs text-text-muted">
                    Helps us pair you with the right architectural approach.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wider block">
                    Estimated Budget Band
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {budgetOptions.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        className={`p-2.5 text-xs rounded-input font-medium border text-center transition-all ${
                          budget === b
                            ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary'
                            : 'bg-sunken border-border hover:border-border-strong text-text'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-text-2 uppercase tracking-wider block">
                    Target Start Window
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timingOptions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setStartWindow(t)}
                        className={`p-3 text-xs rounded-input font-medium border text-left transition-all ${
                          startWindow === t
                            ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary'
                            : 'bg-sunken border-border hover:border-border-strong text-text'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PROPERTY DETAILS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in-50 duration-fast">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-medium text-text">
                    Tell us about your home.
                  </h2>
                  <p className="text-xs text-text-muted">
                    We serve the greater Portland-metro area and surrounding historic neighborhoods.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Home Zip Code (5 digits)"
                    value={zip}
                    onChange={(e) => setZip(e.target.value.slice(0, 5))}
                    placeholder="e.g. 97211"
                    maxLength={5}
                    error={zip.length > 0 && zip.length < 5 ? 'Please enter a valid 5-digit zip' : undefined}
                  />

                  <div className="space-y-1.5 text-left">
                    <label className="block text-xs font-semibold text-text-2 tracking-wide uppercase">
                      Do you own this property?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOwnerOccupied(true)}
                        className={`py-2.5 text-xs rounded-input font-medium border text-center transition-all ${
                          ownerOccupied
                            ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary'
                            : 'bg-sunken border-border text-text'
                        }`}
                      >
                        Yes, I own
                      </button>
                      <button
                        type="button"
                        onClick={() => setOwnerOccupied(false)}
                        className={`py-2.5 text-xs rounded-input font-medium border text-center transition-all ${
                          !ownerOccupied
                            ? 'bg-primary-soft border-primary text-primary font-semibold ring-1 ring-primary'
                            : 'bg-sunken border-border text-text'
                        }`}
                      >
                        Renting / Leasing
                      </button>
                    </div>
                  </div>
                </div>

                {!ownerOccupied && (
                  <div className="p-3 bg-accent-soft/50 border border-accent/20 rounded-input text-xs text-text-2 flex items-start gap-2">
                    <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>We love rental enhancements! Please note major structural adjustments require signed landlord/owner consent for permitting.</span>
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-semibold text-text-2 tracking-wide uppercase">
                      Anything specific we should know? (Optional)
                    </label>
                    <span className="text-[11px] text-text-muted">{anythingElse.length}/500</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={anythingElse}
                    onChange={(e) => setAnythingElse(e.target.value)}
                    placeholder="e.g. 1928 Craftsman home, want to remove the non-bearing kitchen wall and keep original hardwood..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-input bg-sunken border border-border text-text placeholder:text-text-muted outline-none focus:border-primary focus:bg-surface-elevated resize-none"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: CONTACT INFO */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in-50 duration-fast">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-medium text-text">
                    Where should we send your lookbook & consultation link?
                  </h2>
                  <p className="text-xs text-text-muted">
                    A real person replies within the hour during business hours.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Maya"
                    required
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Okafor"
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya.okafor@gmail.com"
                  helperText="Tip: Try entering test@error.com to test error recovery"
                  required
                />

                <Input
                  label="Mobile Phone (for SMS confirmation)"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(503) 555-0142"
                  required
                />
              </div>
            )}

            {/* STEP 5: CONSENT & SUBMIT */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in-50 duration-fast">
                <div className="space-y-1">
                  <h2 className="font-serif text-2xl font-medium text-text">
                    Review & Communication Consent
                  </h2>
                  <p className="text-xs text-text-muted">
                    We take communication hygiene and TCPA compliance seriously.
                  </p>
                </div>

                {/* Summary box */}
                <div className="p-4 bg-sunken/80 rounded-card border border-border space-y-2 text-xs text-text-2">
                  <div className="font-semibold text-text">Inquiry Summary:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-text-muted">Rooms:</span> {rooms.join(', ')}</div>
                    <div><span className="text-text-muted">Investment:</span> {budget}</div>
                    <div><span className="text-text-muted">Timeline:</span> {startWindow}</div>
                    <div><span className="text-text-muted">Location:</span> Portland {zip}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Required Checkbox 1 */}
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-text-2">
                    <input
                      type="checkbox"
                      checked={consentContact}
                      onChange={(e) => {
                        setConsentContact(e.target.checked);
                        if (e.target.checked) setConsentError(null);
                      }}
                      className="mt-0.5 rounded border-border-strong text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="leading-snug">
                      <strong className="text-text font-semibold">Required:</strong> Yes, Alder & Finch may call, text, or email me about my remodeling consultation. Message and data rates may apply. Reply STOP to opt out at any time, HELP for support.
                    </span>
                  </label>

                  {/* Optional Checkbox 2 */}
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-text-2">
                    <input
                      type="checkbox"
                      checked={consentMarketing}
                      onChange={(e) => setConsentMarketing(e.target.checked)}
                      className="mt-0.5 rounded border-border-strong text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="leading-snug">
                      Send me the quarterly Pacific Northwest architectural remodel journal and case studies.
                    </span>
                  </label>

                  {consentError && (
                    <p className="text-xs text-error font-medium">{consentError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              {step > 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                disabled={!isStepValid()}
                loading={loading}
                icon={step === 5 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              >
                {step === 5 ? 'Confirm & Choose Time Slot' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <FunnelFooter />
    </div>
  );
};
