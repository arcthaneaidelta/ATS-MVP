import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wordmark } from './Wordmark';
import { Button } from '../ui/Button';
import { ArrowRight, Copy, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('partnership@bioniciq.example');
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <footer className="mt-20 border-t border-line bg-bg pt-12 pb-16">
      <div className="max-w-container mx-auto px-6">
        {/* Closing Banner */}
        <div className="bg-primary text-surface rounded-xl p-8 sm:p-14 mb-16 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-wider font-semibold text-clay-tint/80 mb-3 block">
              Architecting the Ecosystem
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl leading-tight font-normal text-surface mb-6">
              Let’s build the thing that outlasts the launch.
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/contact')}
                className="group"
              >
                <span>Start a project</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-surface/20 text-surface text-sm font-sans hover:bg-surface/10 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-ok stroke-[2.5]" />
                    <span>Copied partnership@bioniciq.example</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-surface/70" />
                    <span>partnership@bioniciq.example</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4-Column Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-line text-sm font-sans">
          {/* Col 1 */}
          <div className="col-span-2 md:col-span-1">
            <Wordmark size="md" className="mb-3" />
            <p className="text-ink-2 text-xs leading-relaxed max-w-xs">
              One trusted engineering partner delivering high-polish digital flagships, learning platforms, and real-time hospitality software.
            </p>
          </div>

          {/* Col 2: Company */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-ink mb-3 font-sans">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-ink-2">
              <li><Link to="/services" className="hover:text-ink transition-colors">Services & Capabilities</Link></li>
              <li><Link to="/products" className="hover:text-ink transition-colors">Products Ecosystem</Link></li>
              <li><Link to="/case-studies" className="hover:text-ink transition-colors">Case Studies</Link></li>
              <li><Link to="/careers" className="hover:text-ink transition-colors">Careers (6 Roles)</Link></li>
              <li><Link to="/about" className="hover:text-ink transition-colors">About & Principles</Link></li>
              <li><Link to="/insights" className="hover:text-ink transition-colors">Insights & Architecture</Link></li>
            </ul>
          </div>

          {/* Col 3: Products */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-ink mb-3 font-sans">
              Live Products
            </h4>
            <ul className="space-y-2 text-xs text-ink-2">
              <li><Link to="/academy" className="hover:text-ink transition-colors">BionicIQ Academy</Link></li>
              <li><Link to="/academy/app" className="hover:text-ink transition-colors">Student Learning Portal</Link></li>
              <li><Link to="/cirqla" className="hover:text-ink transition-colors">Cirqla Hospitality SaaS</Link></li>
              <li><Link to="/cirqla/scan/kiln-street?table=12" className="hover:text-ink transition-colors">Diner QR Ordering App</Link></li>
              <li><Link to="/cirqla/venue" className="hover:text-ink transition-colors">Venue Dispatch Dashboard</Link></li>
              <li><Link to="/cirqla/platform" className="hover:text-ink transition-colors">Cirqla Super-Admin</Link></li>
            </ul>
          </div>

          {/* Col 4: Commercials */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-ink mb-3 font-sans">
              Partnership
            </h4>
            <p className="text-xs text-ink-3 mb-2">London · San Francisco · Global</p>
            <div className="pt-2">
              <Link
                to="/proposal"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-clay-tint text-clay text-xs font-semibold hover:bg-clay/20 transition-colors"
              >
                <span>Prepared for BionicIQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-[11px] text-ink-3 mt-3">
              Full source IP, IaC manifests & design tokens transferred upon milestone delivery.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-3 font-sans">
          <div className="flex items-center gap-4">
            <span>© 2026 BionicIQ Technologies Inc.</span>
            <span>·</span>
            <Link to="/proposal" className="hover:text-ink transition-colors">
              Proposal Companion
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ok" />
            <span className="font-mono text-[11px]">Demo Data · Client Vetting Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
