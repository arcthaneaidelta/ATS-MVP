import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { QuoteForm } from '../components/quote/QuoteForm';
import { Clock, Shield, MessageSquare, Check, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Quote: React.FC = () => {
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicle') || undefined;
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-content mx-auto text-left">
      <div className="space-y-2 mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block">
          Custom Safari Planning
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-ink">
          Request a Quotation
        </h1>
        <p className="text-sm sm:text-base text-ink-2 max-w-2xl leading-relaxed">
          Planning an extended overland journey or travelling with family? Share your dates and route, and we'll prepare a transparent, itemised quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Quote Request Form (7 Cols) */}
        <div className="lg:col-span-8">
          <QuoteForm
            initialVehicleId={vehicleId}
            initialFrom={from}
            initialTo={to}
          />
        </div>

        {/* Right: What to expect & WhatsApp shortcut (4 Cols) */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="bg-surface rounded-xl p-6 border border-border shadow-sh-1 space-y-4">
            <h4 className="font-serif text-lg font-normal text-ink pb-2 border-b border-border">
              What to expect
            </h4>

            <div className="space-y-3.5 text-xs text-ink-2">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Fast turnaround</strong>
                  We review fleet scheduling and respond within 4 business hours.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Zero obligation</strong>
                  Nothing is charged or reserved until you review and accept our proposal.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ink block">Equipment tailoring</strong>
                  Need rooftop tents, 40L fridge/freezers, or child booster seats? Mention it in the notes.
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Assistance Card */}
          <div className="bg-sand-soft/60 rounded-xl p-6 border border-border space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent block">
              Prefer an informal chat?
            </span>
            <h5 className="font-serif text-base font-normal text-ink">
              Speak with our Windhoek team directly
            </h5>
            <p className="text-xs text-ink-2 leading-relaxed">
              Have questions about road conditions, rainy season gravel routes, or Etosha waterholes? We are happy to help.
            </p>

            <div className="pt-2">
              <a
                href="https://wa.me/264812345678?text=Hello%20Future%20Shuttles,%20I%20have%20a%20question%20about%20vehicle%20rental"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-white hover:bg-sand-soft"
                  icon={<MessageSquare className="w-3.5 h-3.5 text-accent" />}
                >
                  Message on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
