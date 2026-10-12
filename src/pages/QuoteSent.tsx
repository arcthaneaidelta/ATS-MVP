import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '../store/useDemoStore';
import { formatDate } from '../lib/format';
import { Button } from '../components/ui/Button';
import { 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export const QuoteSent: React.FC = () => {
  const { ref } = useParams<{ ref: string }>();
  const { quotations, vehicles } = useDemoStore();

  const quote = quotations.find((q) => q.reference === ref) || quotations[0];
  const preferredVehicle = vehicles.find((v) => quote?.vehiclePreference.includes(v.id)) || vehicles[0];

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-2xl mx-auto text-left">
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-info/15 border border-info/30 flex items-center justify-center text-info animate-in zoom-in-75 duration-500">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block mb-1">
            Request Logged
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-ink">
            Quotation Request Received
          </h1>
          <p className="text-sm text-ink-2 mt-2">
            Reference Number:{' '}
            <strong className="font-mono text-base text-primary font-bold px-2 py-0.5 bg-sand-soft rounded">
              {quote?.reference}
            </strong>
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-1 space-y-6">
        {/* Notice of No Reservation */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
          <div className="font-semibold flex items-center gap-1.5 text-amber-950">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>No vehicle is reserved until you accept our quote</span>
          </div>
          <p className="text-amber-800">
            Our team is reviewing the fleet schedule for your dates ({formatDate(quote.startDate)} to {formatDate(quote.endDate)}). We will send an itemised proposal to <strong>{quote.customerEmail}</strong> within 4 business hours.
          </p>
        </div>

        {/* Inbound Summary */}
        <div className="p-4 bg-surface-elevated rounded-lg border border-border text-xs space-y-2">
          <div className="font-semibold text-ink uppercase tracking-wider text-[11px] pb-1 border-b border-border">
            Request Summary
          </div>
          <div className="grid grid-cols-2 gap-2 text-ink-2">
            <div><strong>Customer:</strong> {quote.customerName}</div>
            <div><strong>Contact:</strong> {quote.customerPhone}</div>
            <div><strong>Preferred Car:</strong> {preferredVehicle.name}</div>
            <div><strong>Travel Dates:</strong> {formatDate(quote.startDate)} – {formatDate(quote.endDate)}</div>
          </div>
        </div>

        {/* Interactive Demo Proof Links per PRD §21 & §22 */}
        <div className="p-4 bg-sand-soft/50 rounded-lg border border-border space-y-3 text-xs">
          <div className="font-semibold text-ink flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Interactive Demo: Test Option B End-to-End</span>
          </div>
          <p className="text-ink-2 leading-relaxed">
            In this prototype, your quote immediately landed in the <strong>Admin Quotations pipeline</strong> as "New". You can switch to the admin to issue rates, or view the tokenised customer quote page below:
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <Link to={`/quote/${quote.reference}`}>
              <Button size="sm" variant="accent" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                Open Customer Quote Page
              </Button>
            </Link>

            <Link to="/admin/quotations">
              <Button size="sm" variant="primary">
                Switch to Admin Pipeline →
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-2 border-t border-border flex items-center justify-between">
          <Link to="/fleet">
            <Button variant="ghost" size="sm">
              Return to Fleet Catalog
            </Button>
          </Link>

          <a
            href={`https://wa.me/264812345678?text=Hello,%20I%20have%20requested%20quote%20${quote.reference}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline" size="sm" icon={<MessageSquare className="w-3.5 h-3.5 text-accent" />}>
              WhatsApp Support
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
