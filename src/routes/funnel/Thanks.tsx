import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store';
import { FunnelNav } from '../../components/funnel/FunnelNav';
import { FunnelFooter } from '../../components/funnel/FunnelFooter';
import { Button } from '../../components/ui/Button';
import { generateIcsFile } from '../../lib/ics';
import { 
  Check, Calendar, ArrowRight, ShieldCheck, 
  Clock, Download, MessageSquare, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Thanks: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const aptId = searchParams.get('id');
  const leadName = searchParams.get('name') || 'Maya';
  const firstName = leadName.split(' ')[0];

  const { appointments } = useAppStore();
  const currentApt = appointments.find(a => a.id === aptId) || appointments[0];

  useEffect(() => {
    // Gentle celebration burst
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2F4A3E', '#B5703D', '#E4EBE6'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleDownloadIcs = () => {
    generateIcsFile({
      title: `Alder & Finch Design Consultation · ${leadName}`,
      description: `45-minute design consultation with Principal Designer Dana Whitfield. Format: ${currentApt.format === 'in_home' ? 'In-Home Visit' : 'Video Call'}.\n\nManage appointment: ${window.location.origin}/booking/${currentApt.id}`,
      location: currentApt.format === 'in_home' ? 'Portland Metro Area' : 'Google Meet / Zoom (link in confirmation email)',
      startIso: currentApt.start,
      endIso: currentApt.end,
    });
  };

  const formattedDate = new Date(currentApt.start).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(currentApt.start).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent-soft selection:text-text flex flex-col justify-between">
      <FunnelNav />

      <main className="max-w-[800px] w-full mx-auto px-4 sm:px-6 py-16 flex-1 text-center space-y-8">
        {/* Animated SVG Checkmark */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-soft text-primary flex items-center justify-center border-2 border-primary shadow-sh-2 animate-in zoom-in-50 duration-500">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-accent tracking-[0.2em] uppercase">Appointment Confirmed</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-text">
            You're booked, {firstName}.
          </h1>
          <p className="text-xs sm:text-sm text-text-2 max-w-md mx-auto leading-relaxed">
            We texted a confirmation to your mobile phone and emailed your appointment preparation lookbook.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-surface-elevated rounded-modal p-6 sm:p-7 border border-border shadow-sh-2 text-left max-w-lg mx-auto space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-semibold text-text uppercase tracking-wider">Consultation Details</span>
            <span className="text-[11px] font-semibold text-primary bg-primary-soft px-2.5 py-0.5 rounded-chip">
              {currentApt.format === 'in_home' ? 'In-Home Visit' : 'Video Conference'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-text-2">
            <div>
              <div className="text-text-muted">Date & Time</div>
              <div className="text-sm font-semibold text-text mt-0.5">
                {formattedDate} at {formattedTime}
              </div>
            </div>

            <div>
              <div className="text-text-muted">Host</div>
              <div className="text-sm font-semibold text-text mt-0.5">
                Dana Whitfield, Principal Designer
              </div>
            </div>

            <div>
              <div className="text-text-muted">Preparation</div>
              <div className="mt-0.5">
                Having rough dimensions or Pinterest inspiration handy makes our 45 minutes especially fruitful!
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadIcs}
              icon={<Download className="w-4 h-4" />}
              className="flex-1"
            >
              Add to Calendar (.ics)
            </Button>

            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate(`/booking/${currentApt.id}`)}
            >
              Manage Booking
            </Button>
          </div>
        </div>

        {/* Timeline of what happens next */}
        <div className="bg-surface rounded-card p-6 border border-border max-w-lg mx-auto text-left space-y-4">
          <h4 className="text-xs font-semibold text-text uppercase tracking-wider">Automated Notification Timeline</h4>
          
          <div className="space-y-3 text-xs text-text-2">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0" />
              <div>
                <strong className="text-text">Instant Confirmation (Now):</strong> SMS and lookbook sent to your phone and email.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong className="text-text">24 Hours Before:</strong> Reminder SMS with one-tap confirm or reschedule link.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong className="text-text">2 Hours Before:</strong> Video link delivered or arrival notice confirmed for Dana.
              </div>
            </div>
          </div>
        </div>

        {/* Operator Console Link (For demo reviewer) */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 p-3 rounded-card bg-accent-soft/60 border border-accent/30 text-xs text-text-2">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
            <span>
              <strong>Client Demo Note:</strong> This lead has now appeared in the CRM console.{' '}
              <button
                onClick={() => navigate('/studio')}
                className="font-semibold text-primary underline hover:text-primary-hover inline-flex items-center gap-1 ml-1"
              >
                <span>Open Operator Console</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>
      </main>

      <FunnelFooter />
    </div>
  );
};
