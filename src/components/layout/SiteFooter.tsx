import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { Button } from '../ui/Button';
import { ArrowRight, MessageSquare, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="w-full">
      {/* Closing Band */}
      <section className="bg-primary text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-[#2F403A]">
        <div className="max-w-content mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-left">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sand/80 mb-2 block">
              Namibia Self-Drive Safaris
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white mb-3">
              Ready when you land.
            </h2>
            <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
              Check live vehicle availability for your trip dates, or speak directly with our team on WhatsApp for safari advice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link to="/fleet">
              <Button
                variant="accent"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Check Availability
              </Button>
            </Link>
            <a
              href="https://wa.me/264812345678?text=Hello%20Future%20Shuttles%20%26%20Rentals,%20I%20would%20like%20to%20enquire%20about%20vehicle%20rental"
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 active:bg-white/20"
                icon={<MessageSquare className="w-4 h-4 text-sand" />}
              >
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-[#1D2522] text-[#EDE6D8] pt-16 pb-10 px-4 sm:px-8 text-left">
        <div className="max-w-content mx-auto">
          {/* Top Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-white/10">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <BrandLogo inverted size="md" />
              <p className="text-xs sm:text-sm text-sand/75 leading-relaxed max-w-sm">
                Quality, well-maintained 4x4 self-drive rentals and compact vehicles for travel across Namibia. Based in Windhoek with airport handover.
              </p>
              <div className="pt-2 text-xs text-sand/60 space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>14 Bismarck Street, Windhoek, Namibia</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>+264 61 240 910 · +264 81 234 5678</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span>rentals@futureshuttles.com.na</span>
                </p>
              </div>
            </div>

            {/* Explore */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-sand">
                Explore
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-sand/80">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/fleet" className="hover:text-white transition-colors">
                    Our Fleet & Rates
                  </Link>
                </li>
                <li>
                  <Link to="/quote" className="hover:text-white transition-colors">
                    Request a Quotation
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact & Locations
                  </Link>
                </li>
              </ul>
            </div>

            {/* Rental Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-sand">
                Information
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-sand/80">
                <li>
                  <Link to="/terms#insurance" className="hover:text-white transition-colors">
                    Insurance & Waivers
                  </Link>
                </li>
                <li>
                  <Link to="/terms#security-deposit" className="hover:text-white transition-colors">
                    Security Deposit Guide
                  </Link>
                </li>
                <li>
                  <Link to="/terms#driver-requirements" className="hover:text-white transition-colors">
                    Driver Licence Rules
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Operating Hours */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-sand">
                Operating Hours
              </h4>
              <p className="text-xs text-sand/80 leading-relaxed">
                Mon – Fri: 07:30 – 17:30<br />
                Sat – Sun: 08:00 – 14:00<br />
                <span className="text-sand/60">Airport handovers available 24/7 with confirmed flight numbers.</span>
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[11px] text-sand/80">
                  DPO Group Secure Pay (Demo)
                </span>
              </div>
            </div>
          </div>

          {/* Compass needle glyph divider */}
          <div className="relative py-8 flex items-center justify-center">
            <div className="w-full h-[1px] bg-sand/15" />
            <div className="absolute px-3 bg-[#1D2522]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5683A" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
                <polygon points="12,4 14,12 12,20 10,12" fill="#B5683A" fillOpacity="0.3" />
              </svg>
            </div>
          </div>

          {/* Bottom fine print row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand/60">
            <div className="flex flex-wrap items-center gap-4">
              <span>© 2026 Future Shuttles & Rentals (Pty) Ltd</span>
              <span>·</span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <span>·</span>
              <span className="text-sand/40 italic">Shuttle services — coming soon</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="text-accent hover:text-accent-hover font-medium underline underline-offset-2 flex items-center gap-1"
              >
                <span>Admin Demo</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
