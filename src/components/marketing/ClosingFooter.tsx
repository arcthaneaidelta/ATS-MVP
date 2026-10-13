import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { plan } from '@/config/plan';
import { copy } from '@/data/copy';

export function ClosingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mailtoHref = plan.contact.email
    ? `mailto:${plan.contact.email}?subject=Save%20Me%20Mobile%20App%20Build`
    : 'mailto:?subject=Save%20Me%20Mobile%20App%20Build';

  return (
    <footer className="bg-primary text-bg pt-20 pb-12 select-none">
      <div className="container-page">
        {/* Large Fraunces Closing Headline */}
        <div className="max-w-2xl text-left space-y-6 pb-16 border-b border-white/15">
          <h2 className="text-3xl sm:text-5xl font-display font-normal leading-tight tracking-tight">
            {copy.closing}
          </h2>

          <div>
            <a
              href={mailtoHref}
              className="inline-flex items-center justify-center px-6 py-3 rounded-pill bg-bg text-primary font-semibold text-sm hover:bg-white transition-colors"
            >
              Start the conversation
            </a>
          </div>
        </div>

        {/* 4-Column Footer */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-bg/80">
          <div>
            <h4 className="font-semibold text-bg uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><a href="#live-phone-frame" className="hover:text-bg">Today</a></li>
              <li><a href="#live-phone-frame" className="hover:text-bg">Subscriptions</a></li>
              <li><a href="#live-phone-frame" className="hover:text-bg">Trials</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bg uppercase tracking-wider mb-3">Plan</h4>
            <ul className="space-y-2">
              <li><Link to="/plan" className="hover:text-bg">Milestones</Link></li>
              <li><Link to="/plan#store-readiness" className="hover:text-bg">Store readiness</Link></li>
              <li><Link to="/plan#needs" className="hover:text-bg">What I need</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bg uppercase tracking-wider mb-3">Trust</h4>
            <ul className="space-y-2">
              <li><a href="#your-data" className="hover:text-bg">Your data</a></li>
              <li><span className="opacity-60">Read-only open banking</span></li>
              <li><span className="opacity-60">No stored cards</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-bg uppercase tracking-wider mb-3">Contact</h4>
            <ul className="space-y-2">
              <li><span>{plan.contact.timezone}</span></li>
              <li><span>{plan.contact.responseTime}</span></li>
              {plan.contact.email && (
                <li><a href={mailtoHref} className="underline hover:text-bg">{plan.contact.email}</a></li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-bg/60 gap-4">
          <p>Demo built to show approach. Placeholder branding — swaps to yours in one tokens file.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-bg transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
