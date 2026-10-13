import React, { useState } from 'react';
import { useDemoStore } from '../../store/demo';
import { useToast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import {
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Mail,
  Clock,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['SaaS platform']);
  const [budget, setBudget] = useState<string>('$50,000 – $100,000');
  const [timeline, setTimeline] = useState<string>('Next 2–3 Months');
  const [projectDescription, setProjectDescription] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [company, setCompany] = useState<string>('');

  const [emailError, setEmailError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { addLead } = useDemoStore();
  const { toast } = useToast();

  const projectTypeOptions = [
    { id: 'SaaS platform', label: 'Multi-Tenant SaaS', icon: <UtensilsCrossed className="w-4 h-4 text-clay" /> },
    { id: 'LMS', label: 'Academy LMS & Video', icon: <GraduationCap className="w-4 h-4 text-slate" /> },
    { id: 'Website', label: 'Corporate Flagship & CMS', icon: <Building className="w-4 h-4 text-primary" /> },
    { id: 'Something else', label: 'Custom Architecture', icon: <Sparkles className="w-4 h-4 text-ink-3" /> },
  ];

  const toggleType = (t: string) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((item) => item !== t));
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleEmailBlur = () => {
    if (!email) {
      setEmailError('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'error@demo.com') {
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 800));
      setIsSubmitting(false);
      toast('Simulated server connection error. Please retry.', 'error', {
        label: 'Retry',
        onClick: () => handleSubmit(e),
      });
      return;
    }

    if (!name || !email || emailError) {
      handleEmailBlur();
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);

    // Capture in CRM leads inbox
    addLead({
      name,
      email,
      company: company || 'Independent Founder',
      projectTypes: selectedTypes,
      budget,
      timeline,
    });

    toast('Enquiry captured in CRM inbox! (See Demo Controls)', 'success');
  };

  return (
    <div className="py-16 md:py-24 max-w-container mx-auto px-6 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Context & Promise */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-wider font-semibold text-clay block">
            Start a Partnership
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
            Tell us what you are building.
          </h1>
          <p className="text-base text-ink-2 leading-relaxed">
            Whether you need the full BionicIQ ecosystem or a targeted high-concurrency build, our systems lead reviews every proposal directly.
          </p>

          <div className="p-5 rounded-xl bg-surface border border-line space-y-3 text-xs text-ink-2">
            <div className="flex items-center gap-2 text-ink font-semibold">
              <Clock className="w-4 h-4 text-ok" />
              <span>Response Time Guarantee</span>
            </div>
            <p className="leading-relaxed">
              We respond with preliminary technical scopes and timeline estimates within <strong>one working day</strong>.
            </p>
            <div className="pt-2 border-t border-line/60 flex items-center gap-2 text-[11px] text-ink-3">
              <Mail className="w-3.5 h-3.5" />
              <span>partnership@bioniciq.example</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-bg border border-line text-[11px] text-ink-3">
            <p><strong>Demo Note:</strong> Submitting this form captures a real lead inside the floating Demo Controls Leads Inbox drawer. Type <code>error@demo.com</code> to test simulated error handling.</p>
          </div>
        </div>

        {/* Right Column: 3-Step Qualification Form */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-line p-8 sm:p-10 shadow-sm">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Stepper progress indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-ink-3">
                  <span>Step {currentStep} of 3</span>
                  <span>
                    {currentStep === 1
                      ? 'Product Selection'
                      : currentStep === 2
                      ? 'Scope & Timing'
                      : 'Contact Details'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-line rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-clay transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Product Selection */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <label className="block text-xs uppercase tracking-wider font-bold text-ink-2">
                    What are you building? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {projectTypeOptions.map((opt) => {
                      const isSelected = selectedTypes.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          onClick={() => toggleType(opt.id)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-elevated border-primary ring-1 ring-primary/30 shadow-sm'
                              : 'bg-bg/60 border-line hover:border-line-2'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            {opt.icon}
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </div>
                          <span className="text-xs font-semibold text-ink">{opt.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => setCurrentStep(2)}
                    >
                      <span>Continue to Scope</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Scope & Timing */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-ink-2 mb-1.5">
                      Target Budget Range
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full h-11 px-3.5 bg-elevated border border-line-2 rounded-md text-xs font-sans text-ink outline-none focus:border-primary"
                    >
                      <option value="$25,000 – $50,000">$25,000 – $50,000</option>
                      <option value="$50,000 – $100,000">$50,000 – $100,000</option>
                      <option value="$100,000 – $200,000+">$100,000 – $200,000+</option>
                      <option value="Flexible / Retainer">Flexible / Monthly Retainer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-ink-2 mb-1.5">
                      Target Delivery Timing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Urgent (< 6 wks)', 'Next 2–3 Months', 'Q1/Q2 2027'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeline(t)}
                          className={`p-2.5 rounded-md text-xs font-medium border text-center transition-all ${
                            timeline === t
                              ? 'bg-elevated border-primary text-primary font-semibold'
                              : 'bg-bg border-line text-ink-2'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    label="Brief Project Summary (Optional)"
                    placeholder="Tell us about your team, tech constraints, or key goals..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={3}
                  />

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      onClick={() => setCurrentStep(3)}
                    >
                      <span>Final Details</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Details */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <Input
                    label="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amina Begum"
                    required
                  />

                  <Input
                    label="Work Email Address *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    error={emailError}
                    placeholder="amina@company.example"
                    required
                    hint="Hint: enter error@demo.com to test error toast"
                  />

                  <Input
                    label="Company or Project Name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="NextGen Dynamics"
                  />

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back</span>
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isSubmitting}
                      disabled={!name || !email || !!emailError}
                    >
                      Send Enquiry & Book Call
                    </Button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="p-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-ok-tint text-ok flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="font-serif text-3xl text-ink">Thanks, {name}.</h3>
              <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed">
                Your proposal has been logged in our leads pipeline. We reply within <strong>one working day</strong> with an initial scoping review.
              </p>
              <div className="pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSuccess(false);
                    setCurrentStep(1);
                    setName('');
                    setEmail('');
                  }}
                >
                  Submit Another Enquiry
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
