import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDemoStore } from '../store/useDemoStore';
import { formatCurrency, formatDate } from '../lib/format';
import { Button } from '../components/ui/Button';
import { 
  Check, 
  Calendar, 
  Download, 
  MessageSquare, 
  Printer, 
  ArrowLeft, 
  MapPin, 
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const BookConfirmed: React.FC = () => {
  const { ref } = useParams<{ ref: string }>();
  const { bookings, vehicles } = useDemoStore();

  const booking = bookings.find((b) => b.reference === ref) || bookings[0];
  const vehicle = vehicles.find((v) => v.id === booking?.vehicleId) || vehicles[0];

  const downloadICS = () => {
    if (!booking) return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Future Shuttles and Rentals//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${booking.reference}@futureshuttles.com.na`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${booking.startDate.replace(/-/g, '')}`,
      `DTEND;VALUE=DATE:${booking.endDate.replace(/-/g, '')}`,
      `SUMMARY:Namibia Self-Drive Rental (${vehicle.name})`,
      `DESCRIPTION:Booking Ref: ${booking.reference}\\nVehicle: ${vehicle.name}\\nPickup: ${booking.pickupLocation}`,
      `LOCATION:${booking.pickupLocation}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${booking.reference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!booking) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-md mx-auto text-center space-y-4">
        <h2 className="font-serif text-2xl">Booking reference not found</h2>
        <Link to="/"><Button variant="primary">Return to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-3xl mx-auto text-left">
      {/* Animated Drawn Checkmark per §26.4 */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success animate-in zoom-in-75 duration-500">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent block mb-1">
            Reservation Confirmed & Paid
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-ink">
            You're booked.
          </h1>
          <p className="text-sm text-ink-2 mt-2">
            Reference Number:{' '}
            <strong className="font-mono text-base text-primary font-bold px-2 py-0.5 bg-sand-soft rounded">
              {booking.reference}
            </strong>
          </p>
        </div>
      </div>

      {/* Booking Summary Box */}
      <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border shadow-sh-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={vehicle.images[0]}
              alt={vehicle.name}
              className="w-16 h-12 rounded object-cover border border-border shrink-0"
            />
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                {vehicle.type}
              </span>
              <h3 className="font-serif text-lg font-semibold text-ink">
                {vehicle.name}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-ink-3">Total Paid (DPO Verified):</span>
            <div className="font-serif text-2xl font-bold text-primary tabular-nums">
              {formatCurrency(booking.totalAmount)}
            </div>
          </div>
        </div>

        {/* Schedule & Handover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-surface-elevated rounded border border-border space-y-1">
            <span className="text-ink-3">Travel Dates:</span>
            <div className="font-semibold text-ink text-sm">
              {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
            </div>
            <div className="text-ink-2">Windhoek Airport Handover</div>
          </div>

          <div className="p-3 bg-surface-elevated rounded border border-border space-y-1">
            <span className="text-ink-3">Lead Driver:</span>
            <div className="font-semibold text-ink text-sm">{booking.customerName}</div>
            <div className="text-ink-2">{booking.customerEmail} · {booking.customerPhone}</div>
          </div>
        </div>

        {/* What Happens Next Timeline per PRD §26.4 */}
        <div className="pt-2 space-y-3">
          <h4 className="font-serif text-lg font-normal text-ink">
            What happens next
          </h4>

          <div className="space-y-4 border-l-2 border-primary/20 pl-4 ml-2">
            <div className="relative">
              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-bg" />
              <div className="text-xs font-semibold text-ink">1. Digital Voucher & Check-in Details</div>
              <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                A formal PDF confirmation voucher and 24/7 Namibian emergency numbers have been emailed to {booking.customerEmail}.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-sand ring-4 ring-bg" />
              <div className="text-xs font-semibold text-ink">2. Security Deposit Pre-Authorisation at Pickup</div>
              <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                When you collect the vehicle in Windhoek, a temporary pre-authorisation hold of {formatCurrency(booking.securityDeposit)} will be placed on your credit card. No funds are deducted.
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-sand ring-4 ring-bg" />
              <div className="text-xs font-semibold text-ink">3. Vehicle Handover & Safari Briefing</div>
              <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">
                Our handover specialist meets you directly at the airport arrival hall, performs a walkthrough of the dual battery system and tyre compressors, and hands over the keys.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadICS}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Add to Calendar (.ics)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Receipt
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/264812345678?text=Hello,%20I%20have%20confirmed%20booking%20${booking.reference}%20for%20${vehicle.name}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                variant="outline"
                size="sm"
                icon={<MessageSquare className="w-3.5 h-3.5 text-accent" />}
              >
                WhatsApp Us
              </Button>
            </a>
            <Link to="/">
              <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
