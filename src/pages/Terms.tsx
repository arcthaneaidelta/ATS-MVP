import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { formatCurrency } from '../lib/format';
import { useDemoStore } from '../store/useDemoStore';
import { ShieldCheck, Check, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export const Terms: React.FC = () => {
  const location = useLocation();
  const { insurance } = useDemoStore();
  const [activeSection, setActiveSection] = useState('rental-conditions');

  const sections = [
    { id: 'rental-conditions', label: '1. General Rental Conditions' },
    { id: 'driver-requirements', label: '2. Driver & Licence Rules' },
    { id: 'insurance', label: '3. Insurance & Damage Waivers' },
    { id: 'security-deposit', label: '4. Security Deposit (Card Pre-Auth)' },
    { id: 'booking-deposit', label: '5. Booking Deposit & Payments' },
    { id: 'cancellations', label: '6. Cancellation & Refunds' },
    { id: 'responsibilities', label: '7. Road Rules & Exclusions' },
  ];

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    }
  }, [location.hash]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-content mx-auto text-left">
      <div className="space-y-2 mb-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
          Rental Agreement & Policy
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-ink">
          Terms & Conditions
        </h1>
        <p className="text-sm sm:text-base text-ink-2 max-w-2xl leading-relaxed">
          Clear, transparent policies designed for self-drive travel in Namibia. Please review our damage waiver tiers and pre-authorisation hold procedures below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sticky Table of Contents (4 cols) */}
        <aside className="lg:col-span-4 sticky top-24 bg-surface rounded-xl p-5 border border-border shadow-sh-1 space-y-3">
          <h4 className="font-serif text-base font-normal text-ink pb-2 border-b border-border">
            On this page
          </h4>
          <nav className="space-y-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollTo(sec.id)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between',
                  activeSection === sec.id
                    ? 'bg-accent-soft text-accent font-semibold'
                    : 'text-ink-2 hover:bg-sand-soft'
                )}
              >
                <span>{sec.label}</span>
                {activeSection === sec.id && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Body (8 cols, max 62ch measure) */}
        <div className="lg:col-span-8 space-y-12 max-w-[62ch]">
          {/* Section 1 */}
          <section id="rental-conditions" className="space-y-3 scroll-mt-28">
            <h2 className="font-serif text-2xl font-normal text-ink">
              1. General Rental Conditions
            </h2>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Future Shuttles & Rentals (Pty) Ltd provides self-drive vehicles subject to the conditions set out in this agreement. The vehicle remains the sole property of the company throughout the rental. Vehicles are maintained in accordance with manufacturer schedules and inspected before every dispatch.
            </p>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Rentals commence upon formal handover at our Windhoek Depot or at Hosea Kutako International Airport (WDH) and conclude upon physical return and vehicle check-in inspection.
            </p>
          </section>

          {/* Section 2 */}
          <section id="driver-requirements" className="space-y-3 scroll-mt-28">
            <h2 className="font-serif text-2xl font-normal text-ink">
              2. Driver Age & Licence Rules
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-2 list-disc pl-5 leading-relaxed">
              <li>
                <strong>Minimum Age:</strong> The primary driver and all authorised additional drivers must be at least 21 years of age.
              </li>
              <li>
                <strong>Driving Licence:</strong> Drivers must hold a full, unendorsed driving licence valid for at least 2 consecutive years.
              </li>
              <li>
                <strong>International Licences:</strong> If your national driving licence is not in English, an official International Driving Permit (IDP) accompanied by your national licence is required by Namibian traffic law.
              </li>
              <li>
                <strong>Additional Drivers:</strong> Up to two additional drivers may be registered at handover without surcharges, provided their credentials are submitted.
              </li>
            </ul>
          </section>

          {/* Section 3: Insurance & Waiver Comparison Table */}
          <section id="insurance" className="space-y-4 scroll-mt-28">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h2 className="font-serif text-2xl font-normal text-ink">
                3. Insurance & Damage Waivers
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              We offer three distinct damage waiver packages. Excess is the maximum financial contribution the customer is responsible for in the event of accidental vehicle damage.
            </p>

            {/* Comparison Table */}
            <div className="border border-border rounded-lg overflow-x-auto shadow-sh-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-surface-elevated border-b border-border text-ink-3 uppercase tracking-wider text-[11px]">
                    <th className="p-3">Cover Tier</th>
                    <th className="p-3">Daily Rate</th>
                    <th className="p-3">Customer Excess</th>
                    <th className="p-3">Tyres & Glass</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {insurance.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-sand-soft/20">
                      <td className="p-3 font-semibold text-ink">
                        {pkg.name}
                        {pkg.popular && (
                          <span className="ml-1 text-[9px] bg-accent text-white px-1.5 py-0.5 rounded uppercase">
                            Popular
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-serif font-semibold text-primary tabular-nums">
                        {formatCurrency(pkg.dailyPrice)}/day
                      </td>
                      <td className="p-3 font-serif font-bold text-ink tabular-nums">
                        {pkg.excess === 0 ? 'N$0 (Zero)' : formatCurrency(pkg.excess)}
                      </td>
                      <td className="p-3 text-ink-2">
                        {pkg.id === 'zero'
                          ? 'Full 100% cover'
                          : pkg.id === 'reduced'
                          ? '1x Tyre & 1x Windscreen'
                          : 'Excluded (Excl.)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-ink-3 italic">
              Sample wording for client evaluation. Final policy wording supplied with contract.
            </p>
          </section>

          {/* Section 4: Security Deposit */}
          <section id="security-deposit" className="space-y-3 scroll-mt-28">
            <h2 className="font-serif text-2xl font-normal text-ink">
              4. Refundable Security Deposit
            </h2>
            <div className="p-4 bg-sand-soft/60 rounded-lg border border-border space-y-2 text-xs text-ink-2">
              <strong className="text-ink block text-sm">
                Pre-Authorisation Hold Procedure
              </strong>
              <p className="leading-relaxed">
                A security deposit (N$12,000 for 4x4 & SUV models; N$6,000 for compact cars; N$10,000 for vans) is required upon vehicle handover in Windhoek.
              </p>
              <p className="leading-relaxed">
                This amount is <strong>held as a credit card pre-authorisation hold only</strong>. It is not debited from your account. The hold is automatically released within 7 business days following check-in inspection, provided the vehicle is returned in the agreed condition.
              </p>
            </div>
          </section>

          {/* Section 5: Booking Deposit */}
          <section id="booking-deposit" className="space-y-3 scroll-mt-28">
            <h2 className="font-serif text-2xl font-normal text-ink">
              5. Booking Deposit & Payment Terms
            </h2>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              <strong>Instant Online Bookings:</strong> The total rental fee and selected damage waiver are paid in full at the time of online reservation via secure simulated DPO card checkout.
            </p>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              <strong>Quotation Bookings:</strong> For customised quotes, a 20% booking deposit secures the reservation once the quote is accepted. The balance is payable prior to vehicle collection.
            </p>
          </section>

          {/* Section 6: Cancellations */}
          <section id="cancellations" className="space-y-3 scroll-mt-28">
            <h2 className="font-serif text-2xl font-normal text-ink">
              6. Cancellation & Refund Policy
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-ink-2 list-disc pl-5 leading-relaxed">
              <li>Cancellations 30+ days prior to pickup: 100% refund less 5% processing fee.</li>
              <li>Cancellations 14 to 29 days prior: 50% refund.</li>
              <li>Cancellations less than 14 days prior: Non-refundable.</li>
            </ul>
          </section>

          {/* Section 7: Road Rules */}
          <section id="responsibilities" className="space-y-3 scroll-mt-28">
            <h2 className="font-serif text-2xl font-normal text-ink">
              7. Customer Responsibilities & Road Rules
            </h2>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Namibia drives on the left. The general speed limit is 120 km/h on tarred national highways and 80 km/h on unpaved gravel roads. Driving at night outside urban centres is strictly prohibited due to roaming wildlife.
            </p>
            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Vehicles must not be driven into salt pans, tidal zones, or unclassified sand rivers. Cross-border travel into Botswana or South Africa requires prior written authorization and cross-border documentation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
