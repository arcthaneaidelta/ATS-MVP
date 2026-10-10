import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../config/brand';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react';

export function FooterSection() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <footer className="bg-dark-bg text-dark-text pt-24 pb-12 px-4 sm:px-8 relative overflow-hidden">
      {/* Topographic Contour Lines SVG at 6% opacity */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 150 C 400 50, 800 250, 1440 100"
          fill="none"
          stroke="#EDEAE3"
          strokeWidth="1.2"
        />
        <path
          d="M 0 350 C 350 250, 950 450, 1440 300"
          fill="none"
          stroke="#B4713B"
          strokeWidth="1.5"
        />
        <path
          d="M 0 550 C 500 450, 800 580, 1440 500"
          fill="none"
          stroke="#EDEAE3"
          strokeWidth="1.2"
        />
      </svg>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Large Serif Closing Headline */}
        <div className="max-w-3xl space-y-4">
          <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-dark-text leading-tight">
            Let's build the memory your business should already have.
          </h2>
          <p className="text-sm sm:text-base text-dark-muted max-w-xl">
            Speed up quotation turnarounds, eliminate duplicate parts, and preserve every margin baseline across all operating entities.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="accent"
              size="md"
              onClick={() => navigate('/app')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open the live demo
            </Button>
            <a
              href="#contact"
              className="text-xs text-dark-muted hover:text-dark-text font-mono underline"
            >
              Send an inquiry below
            </a>
          </div>
        </div>

        {/* Compact Contact Form */}
        <div id="contact" className="max-w-xl p-6 sm:p-8 bg-dark-surface rounded-lg border border-white/10 space-y-4 shadow-lg">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-dark-text">Discuss the Freelance Proposal</h3>
            <p className="text-xs text-dark-muted">
              Ready to adjust milestones, scope Deluge custom widgets, or schedule a technical walkthrough.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-dark-muted mb-1">
                  Your Name / Mining Enterprise
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Operations Director"
                  className="w-full p-2.5 rounded-sm bg-dark-bg border border-white/15 text-dark-text focus:outline-none focus:border-accent text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-dark-muted mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. operations@mining-parts.com"
                  className="w-full p-2.5 rounded-sm bg-dark-bg border border-white/15 text-dark-text focus:outline-none focus:border-accent text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-dark-muted mb-1">
                  Scope Questions or Legacy System Notes
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share details on current Zoho apps, approximate spreadsheet volume, or target launch date..."
                  className="w-full p-2.5 rounded-sm bg-dark-bg border border-white/15 text-dark-text focus:outline-none focus:border-accent text-xs font-mono resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="md"
                className="w-full mt-2"
                isLoading={isSubmitting}
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Send message
              </Button>
            </form>
          ) : (
            <div className="p-6 bg-white/5 border border-white/15 rounded-sm text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
              <h4 className="font-bold text-sm text-dark-text">Thanks for reviewing the proposal.</h4>
              <p className="text-xs text-dark-muted">
                I'll reply within one business day with milestone breakdown and timeline confirmation.
              </p>
            </div>
          )}
        </div>

        {/* 4-Column Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-white/10 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-primary rounded-xs flex flex-col justify-center gap-0.5 px-1">
                <div className="w-full h-0.5 bg-accent rounded-full" />
                <div className="w-3/4 h-0.5 bg-accent rounded-full" />
                <div className="w-1/2 h-0.5 bg-accent rounded-full" />
              </div>
              <span className="font-display text-xl text-dark-text font-normal">{BRAND.name}</span>
            </div>
            <p className="text-[11px] text-dark-muted leading-relaxed">
              Every part number. Every price. One memory.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10.5px] uppercase font-bold tracking-widest text-dark-muted font-mono block">
              Capabilities
            </span>
            <ul className="space-y-1.5 text-dark-muted">
              <li><a href="#capabilities" className="hover:text-dark-text">Multi-OEM Resolver</a></li>
              <li><a href="#capabilities" className="hover:text-dark-text">Price Ladder</a></li>
              <li><a href="#capabilities" className="hover:text-dark-text">RFQ Excel Matching</a></li>
              <li><a href="#capabilities" className="hover:text-dark-text">Linked Orders</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[10.5px] uppercase font-bold tracking-widest text-dark-muted font-mono block">
              Bid Deliverables
            </span>
            <ul className="space-y-1.5 text-dark-muted">
              <li><a href="#architecture" className="hover:text-dark-text">Architecture Spec</a></li>
              <li><a href="#proposal" className="hover:text-dark-text">Four Phases & Timeline</a></li>
              <li><a href="#proposal" className="hover:text-dark-text">5-Stage Migration</a></li>
              <li><a href="#support" className="hover:text-dark-text">SLA & Support Plans</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-[10.5px] uppercase font-bold tracking-widest text-dark-muted font-mono block">
              Contact & Prototype
            </span>
            <p className="text-dark-muted text-[11px]">{BRAND.contactEmail}</p>
            <p className="text-dark-muted text-[11px] font-mono">Lima · Kitwe · Dubai</p>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-dark-muted font-mono gap-2">
          <span>{BRAND.footerDisclaimer}</span>
          <span>No OEM logos used. All part numbers and names fictionalized for demonstration.</span>
        </div>
      </div>
    </footer>
  );
}
