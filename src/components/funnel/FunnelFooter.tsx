import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../data/brand';
import { Button } from '../ui/Button';
import { ArrowRight, Phone, Mail, MapPin, Shield } from 'lucide-react';

export const FunnelFooter: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const navigate = useNavigate();

  const handleQuickStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      sessionStorage.setItem('af_pref_email', emailInput.trim());
    }
    navigate('/start');
  };

  return (
    <footer className="w-full">
      {/* Pre-footer Callout Banner */}
      <section className="bg-primary text-[#FBFAF7] py-20 px-4 sm:px-6">
        <div className="max-w-[1000px] mx-auto text-center space-y-6">
          <p className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">
            Start Your Transformation
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#FBFAF7] max-w-2xl mx-auto">
            Tell us about your space.
          </h2>
          <p className="text-sm sm:text-base text-[#E4EBE6] max-w-xl mx-auto leading-relaxed">
            Whether you are expanding a 1920s kitchen or planning a primary suite retreat, our principal designers review every questionnaire within 1 hour.
          </p>

          <form onSubmit={handleQuickStart} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email to begin..."
              className="flex-1 px-4 py-3 rounded-input text-sm bg-[#1E3128] border border-[#3E5C4E] text-[#FBFAF7] placeholder:text-[#9FB5A8] outline-none focus:border-accent"
              required
            />
            <Button
              type="submit"
              variant="accent"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Get started
            </Button>
          </form>

          <div className="text-xs text-[#CFC8BA] pt-2">
            Or call our studio directly at <a href={`tel:${BRAND.phoneRaw}`} className="underline font-semibold hover:text-white">{BRAND.phone}</a>
          </div>
        </div>
      </section>

      {/* Main 4-Column Footer */}
      <div className="bg-bg border-t border-border py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Studio */}
          <div className="space-y-3">
            <div className="font-serif text-xl font-medium text-text">{BRAND.name}</div>
            <p className="text-xs text-text-2 leading-relaxed">
              Design-led architectural remodeling for homes across Portland, Sellwood, Alberta Arts, and Lake Oswego.
            </p>
            <div className="text-xs text-text-muted">
              {BRAND.license}
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Services</h4>
            <ul className="text-xs text-text-2 space-y-2">
              <li>Full Architectural Kitchen Remodels</li>
              <li>Primary Suite & Spa Bathrooms</li>
              <li>Historic Craftsman & Mid-Century Whole Home</li>
              <li>Custom White Oak & Walnut Cabinetry</li>
              <li>Permitting & BDS Coordination</li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Studio & Hours</h4>
            <div className="text-xs text-text-2 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>{BRAND.email}</span>
              </div>
              <p className="text-[11px] text-text-muted pt-1">
                Hours: {BRAND.hours}
              </p>
            </div>
          </div>

          {/* Col 4: Compliance & Simulation Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Compliance & TCPA</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Message frequency varies. Message and data rates may apply. Reply STOP to cancel at any time, HELP for support.
            </p>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-accent font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Interactive Simulation</span>
              </div>
              <p className="text-[11px] text-text-muted mt-1 leading-normal">
                Built for the GoHighLevel Buildout proposal. No live systems connected.{' '}
                <button
                  onClick={() => navigate('/proposal')}
                  className="text-primary font-semibold underline hover:text-primary-hover"
                >
                  View $1,000 Scope & Milestones
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-muted gap-2">
          <div>© 2026 Alder & Finch Home Studio. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/start')} className="hover:text-text">Intake Questionnaire</button>
            <button onClick={() => navigate('/book')} className="hover:text-text">Calendar Booking</button>
            <button onClick={() => navigate('/studio')} className="text-primary font-semibold hover:underline">Team Console</button>
            <button onClick={() => navigate('/proposal')} className="text-accent font-semibold hover:underline">Proposal</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
